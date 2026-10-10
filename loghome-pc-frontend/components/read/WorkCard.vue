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
.reading-work { display: flex; align-items: flex-start; gap: 16px; padding: 16px 10px; border: 0; border-radius: 8px; background: transparent; color: var(--reading-ink, #302f2a); text-decoration: none; min-width: 0; transition: background .18s ease, transform .18s ease; }
.reading-work:hover { background: var(--reading-hover, #f5f4f0); text-decoration: none; }
.reading-work:active { transform: translateY(1px); }
.reading-work:focus-visible { outline: 2px solid var(--reading-accent, #79573c); outline-offset: 2px; }
.work-cover { position: relative; flex: 0 0 80px; width: 80px; height: 112px; border-radius: 4px; overflow: hidden; background: #e8e7e2; box-shadow: 0 3px 7px #40362914; }
.work-cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
.work-kind { position: absolute; bottom: 0; left: 0; right: 0; padding: 3px 0; text-align: center; background: #383c36e8; color: #fff; font-size: 11px; }
.work-kind.world { background: #526047ed; }
.work-copy { min-width: 0; flex: 1; }
.work-copy h3 { font-size: 15px; line-height: 1.5; font-weight: 600; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow-wrap: anywhere; }
.work-author { color: var(--reading-muted, #73716a); font-size: 13px; margin: 6px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.work-description { color: var(--reading-secondary, #615e57); font-size: 13px; line-height: 1.75; margin: 8px 0; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow-wrap: anywhere; }
.work-meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 12px; color: var(--reading-muted, #73716a); margin-top: 8px; font-variant-numeric: tabular-nums; }
.work-score { color: var(--reading-accent, #79573c); font-weight: 600; }
.work-date { font-size: 11px; color: var(--reading-muted, #73716a); margin-top: 5px; font-variant-numeric: tabular-nums; }
.work-badges { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 5px; }
.work-badge { padding: 2px 5px; border-radius: 3px; font-size: 10px; line-height: 1.4; color: #526043; background: #edf1e7; }
.tone-gold { color: #80601f; background: #f8efd7; }
.tone-red { color: #9b5146; background: #faeeeb; }
.tone-blue { color: #46647a; background: #edf2f5; }
.work-rank { flex: 0 0 26px; color: #96948c; font-size: 21px; line-height: 1.4; font-weight: 500; padding-top: 1px; font-family: 'SFMono-Regular', Consolas, monospace; font-variant-numeric: tabular-nums; }
.work-rank.podium { color: var(--reading-accent, #79573c); }
.work-updates, .work-progress { font-size: 12px; margin-top: 6px; color: var(--reading-accent, #79573c); }
.compact { gap: 12px; padding: 12px 8px; }
.compact .work-cover { flex-basis: 54px; width: 54px; height: 76px; }
.compact .work-copy h3 { font-size: 14px; }
.compact .work-rank { flex-basis: 24px; font-size: 19px; }
.compact .work-author { font-size: 12px; margin: 4px 0; }
.compact .work-meta { font-size: 11px; margin-top: 6px; }
@media (prefers-reduced-motion: reduce) { .reading-work { transition: none; } .reading-work:active { transform: none; } }
@media (max-width: 640px) { .reading-work { padding: 14px 4px; } }
</style>
