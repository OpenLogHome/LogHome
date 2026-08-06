package top.codesocean.loghome.android.audio

import androidx.test.ext.junit.runners.AndroidJUnit4
import org.json.JSONArray
import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class AudioArticleParsingTest {
    @Test
    fun worldOutlineUsesTheSameParagraphPipelineAsRichText() {
        val content = JSONArray()
            .put(JSONObject().put("type", "text").put("id", 7).put("value", "世界观第一段"))
            .put(JSONObject().put("type", "image").put("img", "ignored.png"))
            .put(JSONObject().put("type", "text").put("id", 9).put("value", "世界观第二段"))
        val article = Article.fromJson(
            JSONObject()
                .put("article_id", 101)
                .put("article_type", "worldOutline")
                .put("title", "世界设定")
                .put("content", content.toString()),
        )

        assertEquals("101", article.id)
        assertEquals(
            listOf("章节 世界设定", "世界观第一段", "世界观第二段"),
            article.paragraphs,
        )
        assertEquals(listOf("-1", "7", "9"), article.paragraphIds)
    }
}
