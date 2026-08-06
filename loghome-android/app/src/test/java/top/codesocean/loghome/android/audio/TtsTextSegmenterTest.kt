package top.codesocean.loghome.android.audio

import org.junit.Assert.assertEquals
import org.junit.Test

class TtsTextSegmenterTest {
    @Test
    fun insertsDifferentPausesForChinesePunctuation() {
        assertEquals(
            listOf(
                TtsTextSegment("第一句", 180),
                TtsTextSegment("稍作停顿", 280),
                TtsTextSegment("这是问题", 420),
                TtsTextSegment("结束", 420),
            ),
            segmentTextWithPunctuationPauses("第一句，稍作停顿；这是问题？结束。"),
        )
    }

    @Test
    fun preservesPunctuationInsideNumbers() {
        assertEquals(
            listOf(
                TtsTextSegment("价格是3.14元", 180),
                TtsTextSegment("数量1,000", 180),
                TtsTextSegment("时间12:30", 420),
            ),
            segmentTextWithPunctuationPauses("价格是3.14元，数量1,000，时间12:30。"),
        )
    }

    @Test
    fun handlesRepeatedPunctuationQuotesAndNewlines() {
        assertEquals(
            listOf(
                TtsTextSegment("“等等", 500),
                TtsTextSegment("然后继续", 420),
                TtsTextSegment("下一行", 0),
            ),
            segmentTextWithPunctuationPauses("“等等……”然后继续！\n下一行"),
        )
    }

    @Test
    fun leavesPlainTextAsOneSegmentWithoutTrailingPause() {
        assertEquals(
            listOf(TtsTextSegment("没有标点的文本", 0)),
            segmentTextWithPunctuationPauses("没有标点的文本"),
        )
    }
}
