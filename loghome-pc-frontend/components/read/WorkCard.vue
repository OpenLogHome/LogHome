<template>
  <nuxt-link :to="destination || workUrl(book)" class="reading-work" :class="{ compact }">
    <span v-if="rank" class="work-rank" :class="{ podium: rank <= 3 }">{{ String(rank).padStart(2, '0') }}</span>
    <div class="work-cover">
      <img :src="book.picUrl || '/default-book-cover.png'" :alt="book.name || '作品封面'" loading="lazy" @error="coverError">
      <span v-if="book.novel_type === 'manga' || book.novel_type === 'world'" class="work-kind" :class="book.novel_type">{{ book.novel_type === 'manga' ? '漫画' : '世界' }}</span>
    </div>
    <div class="work-copy">
      <h3 :title="book.name">{{ book.name || '未命名作品' }}</h3>
      <div class="work-author">{{ book.author_name }}</div>
      <div v-if="visibleBadges.length || book.is_haycraft" class="work-badges">
        <span v-if="book.is_haycraft" class="work-badge tone-gold" title="HayCraft 干草块文会作品">HayCraft</span>
        <span v-for="badge in visibleBadges" :key="badge.code" class="work-badge" :class="'tone-' + badge.tone">{{ badge.text }}</span>
      </div>
      <p v-if="!compact && book.content" class="work-description">{{ plainDescription }}</p>
      <div v-if="book.updateInfo && book.updateInfo.has_updates" class="work-updates">更新 {{ book.updateInfo.new_chapters_count }} 章</div>
      <div v-else-if="book.last_article_chapter" class="work-progress">读至第 {{ book.last_article_chapter }} 章</div>
      <div v-if="showScore" class="work-meta work-score">原木力 {{ numberText(book.score == null ? book.ranking : book.score) }}</div>
      <div v-else class="work-meta">
        <span>{{ book.novel_type === 'world' ? '世界设定' : book.is_complete ? '已完结' : '连载中' }}</span>
        <span v-if="!compact && book.text_count">{{ numberText(book.text_count) }} 字</span>
      </div>
      <div v-if="!compact" class="work-date">{{ dateText(book.update_time) }}</div>
    </div>
  </nuxt-link>
</template>

<script>
import { asList, normalizeWork, workUrl, dateText, numberText } from '~/utils/reading-discovery'
export default {
  props: {
    work: { type: Object, required: true }, compact: Boolean,
    rank: { type: Number, default: 0 }, showScore: Boolean,
    destination: { type: String, default: '' }
  },
  data: () => ({ now: Date.now(), expiryTimer: null }),
  computed: {
    book() { return normalizeWork(this.work) },
    plainDescription() { return String(this.book.content || '暂无简介').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ') },
    visibleBadges() {
      return asList(this.book.badges).filter(badge => badge.code !== 'haycraft_work' && (!badge.expires_at || new Date(badge.expires_at).getTime() > this.now)).slice(0, this.compact ? 1 : 2)
    }
  },
  watch: { 'work.badges': { handler() { this.now = Date.now(); this.scheduleExpiry() }, deep: true } },
  mounted() { this.scheduleExpiry() },
  beforeDestroy() { clearTimeout(this.expiryTimer) },
  methods: {
    workUrl, dateText, numberText,
    coverError(event) { if (!event.target.src.endsWith('/default-book-cover.png')) event.target.src = '/default-book-cover.png' },
    scheduleExpiry() {
      clearTimeout(this.expiryTimer)
      const next = Math.min(...asList(this.work.badges).map(badge => new Date(badge.expires_at).getTime()).filter(time => time > this.now))
      if (Number.isFinite(next)) this.expiryTimer = setTimeout(() => { this.now = Date.now(); this.scheduleExpiry() }, Math.min(next - this.now + 1, 2147483647))
    }
  }
}
</script>

<style scoped>
.reading-work { display: flex; align-items: flex-start; gap: 13px; padding: 13px; border: 1px solid #eee9e4; border-radius: 9px; background: #fff; color: #333; text-decoration: none; min-width: 0; transition: border-color .2s, background .2s; }
.reading-work:hover { background: #fcfaf7; border-color: #cbb69f; }
.reading-work:focus-visible { outline: 2px solid #947358; outline-offset: 3px; }
.work-cover { position: relative; flex: 0 0 74px; width: 74px; height: 104px; border-radius: 4px; overflow: hidden; background: #eee; }
.work-cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
.work-kind { position: absolute; bottom: 0; left: 0; right: 0; padding: 2px 0; text-align: center; background: #526e86ed; color: white; font-size: 10px; }
.work-kind.world { background: #607a4bed; }
.work-copy { min-width: 0; flex: 1; }
.work-copy h3 { font-size: 14px; line-height: 1.45; font-weight: 600; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow-wrap: anywhere; }
.work-author { color: #888; font-size: 11px; margin: 5px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.work-description { color: #777; font-size: 12px; line-height: 1.7; margin: 6px 0; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow-wrap: anywhere; }
.work-meta { display: flex; flex-wrap: wrap; gap: 9px; font-size: 10px; color: #9b8e7e; margin-top: 7px; }
.work-score { color: #947358; font-weight: 600; }
.work-date { font-size: 10px; color: #999; margin-top: 4px; }
.work-badges { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px; }
.work-badge { padding: 1px 4px; border-radius: 3px; font-size: 9px; line-height: 1.4; color: #627749; background: #eef3e7; }
.tone-gold { color: #9b7123; background: #fbf1d6; }
.tone-red { color: #b66a5b; background: #fff0eb; }
.tone-blue { color: #547791; background: #eaf2f8; }
.work-rank { flex: 0 0 23px; color: #a6a099; font-size: 18px; font-weight: 650; padding-top: 3px; font-variant-numeric: tabular-nums; }
.work-rank.podium { color: #bd854a; }
.work-updates, .work-progress { font-size: 10px; margin-top: 5px; color: #bb7533; }
.work-progress { color: #728468; }
.compact { gap: 10px; padding: 10px; }
.compact .work-cover { flex-basis: 49px; width: 49px; height: 70px; }
.compact .work-copy h3 { font-size: 12px; }
.compact .work-rank { flex-basis: 20px; font-size: 16px; }
</style>
