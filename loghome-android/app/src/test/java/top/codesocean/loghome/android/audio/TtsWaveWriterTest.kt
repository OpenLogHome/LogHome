package top.codesocean.loghome.android.audio

import java.io.File
import java.io.IOException
import java.nio.ByteBuffer
import java.nio.ByteOrder
import org.junit.Assert.*
import org.junit.Test

class TtsWaveWriterTest {
    private fun wave(samples: ByteArray, sampleRate: Int = 32000): ByteArray {
        val data = ByteBuffer.allocate(44 + samples.size).order(ByteOrder.LITTLE_ENDIAN)
        data.put("RIFF".toByteArray()).putInt(36 + samples.size).put("WAVEfmt ".toByteArray())
        data.putInt(16).putShort(1).putShort(1).putInt(sampleRate).putInt(sampleRate * 2)
        data.putShort(2).putShort(16).put("data".toByteArray()).putInt(samples.size).put(samples)
        return data.array()
    }

    @Test fun mergingChunksPreservesSamplesAndUpdatesBothSizes() {
        val file = File.createTempFile("tts-wave", ".wav")
        try {
            TtsWaveWriter(file).use { writer ->
                writer.append(wave(byteArrayOf(1, 2, 3, 4)))
                writer.append(wave(byteArrayOf(5, 6)))
            }
            assertArrayEquals(wave(byteArrayOf(1, 2, 3, 4, 5, 6)), file.readBytes())
        } finally { file.delete() }
    }

    @Test fun partialAndIncompatibleAudioMustNotBeCached() {
        val file = File.createTempFile("tts-wave", ".wav")
        try {
            assertThrows(IOException::class.java) {
                TtsWaveWriter(file).use { it.append(wave(byteArrayOf(1, 2)).dropLast(1).toByteArray()) }
            }
            assertThrows(IOException::class.java) {
                TtsWaveWriter(file).use {
                    it.append(wave(byteArrayOf(1, 2)))
                    it.append(wave(byteArrayOf(3, 4), 48000))
                }
            }
        } finally { file.delete() }
    }
}
