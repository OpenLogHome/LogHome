package top.codesocean.loghome.android.logistics

import org.junit.Assert.assertEquals
import org.junit.Test

class StoreLogisticsQueryTest {
    @Test fun usesFixedHttpsProvider() {
        assertEquals("https://www.kuaidi.com/index-ajaxselectcourierinfo-JT5529580581737-jtexpress.html",
            StoreLogisticsService.queryUrl("JT5529580581737", "jtexpress"))
    }
    @Test(expected = IllegalArgumentException::class) fun rejectsCallerUrls() {
        StoreLogisticsService.queryUrl("https://example.com", "jtexpress")
    }
    @Test(expected = IllegalArgumentException::class) fun rejectsUnknownCarriers() {
        StoreLogisticsService.queryUrl("123456789", "../other")
    }
}
