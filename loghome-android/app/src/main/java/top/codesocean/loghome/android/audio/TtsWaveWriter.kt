package top.codesocean.loghome.android.audio

import java.io.File
import java.io.IOException
import java.io.RandomAccessFile
import java.nio.ByteBuffer
import java.nio.ByteOrder

/** Rebuild WAV sizes when combining API-sized chunks, preserving duration and seeking. */
internal class TtsWaveWriter(file: File) : AutoCloseable {
    private val output = RandomAccessFile(file, "rw").apply { setLength(0) }
    private var format: ByteArray? = null
    private var dataSize = 0L
    private var dataSizeOffset = 0L

    fun append(wave: ByteArray) {
        fun name(offset: Int) = String(wave, offset, 4, Charsets.US_ASCII)
        fun size(offset: Int) = ByteBuffer.wrap(wave, offset, 4).order(ByteOrder.LITTLE_ENDIAN).int.toLong() and 0xffffffffL
        if (wave.size < 12 || name(0) != "RIFF" || name(8) != "WAVE") throw IOException("听书服务返回无效 WAV")
        var offset = 12
        var chunkFormat: ByteArray? = null
        var audio: ByteArray? = null
        while (offset + 8 <= wave.size) {
            val kind = name(offset)
            val declared = size(offset + 4)
            val start = offset + 8
            val length = if (kind == "data" && declared == 0xffffffffL) wave.size - start else {
                if (declared > wave.size - start) throw IOException("听书音频不完整")
                declared.toInt()
            }
            if (kind == "fmt ") chunkFormat = wave.copyOfRange(start, start + length)
            if (kind == "data") audio = wave.copyOfRange(start, start + length)
            offset = start + length + length % 2
        }
        val fmt = chunkFormat ?: throw IOException("听书音频缺少格式")
        val samples = audio ?: throw IOException("听书音频缺少数据")
        if (fmt.size < 16 || samples.isEmpty()) throw IOException("听书音频无效")
        if (format == null) {
            format = fmt
            output.writeBytes("RIFF")
            writeSize(0)
            output.writeBytes("WAVEfmt ")
            writeSize(fmt.size.toLong())
            output.write(fmt)
            if (fmt.size % 2 != 0) output.write(0)
            output.writeBytes("data")
            dataSizeOffset = output.filePointer
            writeSize(0)
        } else if (!format!!.contentEquals(fmt)) throw IOException("听书音频格式发生变化，请重试")
        output.write(samples)
        dataSize += samples.size
    }

    private fun writeSize(value: Long) {
        if (value > 0xffffffffL) throw IOException("听书音频过大")
        output.write(ByteBuffer.allocate(4).order(ByteOrder.LITTLE_ENDIAN).putInt(value.toInt()).array())
    }

    override fun close() {
        try {
            if (format != null) {
                if (dataSize % 2L != 0L) output.write(0)
                val length = output.length()
                output.seek(4)
                writeSize(length - 8)
                output.seek(dataSizeOffset)
                writeSize(dataSize)
            }
        } finally { output.close() }
    }
}
