package top.codesocean.loghome.android.audio

data class EdgeTtsVoiceDescriptor(
    val voiceId: String,
    val shortName: String,
    val displayName: String,
    val description: String,
)

object EdgeTtsVoiceCatalog {
    const val VOICE_PREFIX = "edge:"

    val voices = listOf(
        voice("zh-CN-XiaoxiaoNeural", "在线女声·晓晓", "温暖自然 · 适合小说"),
        voice("zh-CN-XiaoyiNeural", "在线女声·晓伊", "活泼明快 · 适合轻松内容"),
        voice("zh-CN-YunjianNeural", "在线男声·云健", "富有张力 · 适合剧情内容"),
        voice("zh-CN-YunxiNeural", "在线男声·云希", "自然阳光 · 适合小说"),
        voice("zh-CN-YunxiaNeural", "在线男声·云夏", "年轻轻快 · 适合轻松内容"),
        voice("zh-CN-YunyangNeural", "在线男声·云扬", "专业沉稳 · 适合非虚构内容"),
        voice("en-US-AvaMultilingualNeural", "在线双语女声·Ava", "中英多语言 · 清晰自然"),
        voice("en-US-AndrewMultilingualNeural", "在线双语男声·Andrew", "中英多语言 · 温暖沉稳"),
    )

    fun findByVoiceId(voiceId: String): EdgeTtsVoiceDescriptor? =
        voices.firstOrNull { it.voiceId == voiceId }

    fun isEdgeVoice(voiceId: String): Boolean = voiceId.startsWith(VOICE_PREFIX)

    private fun voice(
        shortName: String,
        displayName: String,
        description: String,
    ) = EdgeTtsVoiceDescriptor(
        voiceId = "$VOICE_PREFIX$shortName",
        shortName = shortName,
        displayName = displayName,
        description = "在线合成 · 需联网 · $description",
    )
}
