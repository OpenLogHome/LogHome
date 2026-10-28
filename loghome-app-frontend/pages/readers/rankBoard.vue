<template>
	<view class="rank-board-page" v-dark>
		<view class="rank-header">
			<button class="back-button" :aria-label="$t('common.back')" @click="goBack"><uni-icons type="back" size="36rpx" :color="$store.state.isDarkMode ? '#dddddd' : '#777777'" /></button>
			<view class="zone-tabs">
				<view class="zone-tab" v-for="zone in zones" :key="zone.key" :class="{ active: zone.key === currentZone }" @click="switchZone(zone.key)">{{ $t(zone.labelKey) }}</view>
			</view>
		</view>

		<view class="board-summary">
			<text class="summary-title">{{ currentBoardLabel }}</text>
			<text class="summary-desc">{{ boardDescription }}</text>
		</view>

		<view class="rank-layout">
			<view class="board-tabs">
				<view class="board-tab" v-for="board in boards" :key="board.key" :class="{ active: board.key === currentBoard, 'logpower-tab': board.key === 'logpower' }" @click="switchBoard(board.key)">
					<template v-if="board.key === 'logpower'"><LogPowerWordmark class="rank-wordmark" /><text>{{ $t('reader.rank.boardSuffix') }}</text></template>
					<text v-else>{{ $t(board.labelKey) }}</text>
				</view>
			</view>

			<swiper class="rank-swiper" :current="currentZoneIndex" :duration="240" @change="onZoneSwipe" :circular="false">
				<swiper-item v-for="zone in zones" :key="zone.key">
					<scroll-view class="rank-content" scroll-y :scroll-top="zone.key === currentZone ? listScrollTop : 0" :refresher-enabled="zone.key === currentZone" :refresher-triggered="zone.key === currentZone && refreshing" @refresherrefresh="zone.key === currentZone && refreshRank()" @scrolltolower="zone.key === currentZone && loadMore()">
						<view class="meta-line" v-if="zone.key === currentZone && snapshotTimeText && items.length">{{ $t('reader.rank.metaLine', { time: snapshotTimeText, count: items.length }) }}</view>
						<view class="rank-list">
							<view class="rank-item" v-for="item in zoneItems(zone.key)" :key="item.novel_id" @click="goBook(item)">
								<view class="rank-index" :class="{ 'rank-top': item.position <= 3 }">{{ item.position <= 3 ? item.position : String(item.position).padStart(2, '0') }}</view>
								<view class="book-cover-box">
									<log-image :src="item.picUrl + '?thumbnail=1'" class="book-cover" :onerror="`onerror=null;src='` + $backupResources.bookCover + `'`" />
									<text v-if="item.novel_type === 'manga'" class="manga-cover-badge">{{ $t('reader.rank.zoneManga') }}</text>
									<text v-if="item.novel_type === 'world'" class="world-cover-badge">{{ $t('reader.rank.zoneWorld') }}</text>
								</view>
								<view class="book-info">
									<rank-work-title class="book-name" :title="item.name" :badges="item.badges || []" :max-badges="2" />
									<view class="book-details">
										<view class="book-author">{{ $t('reader.rank.author', { name: item.user_name || $t('reader.rank.anonymousAuthor') }) }}</view>
										<view class="book-category">{{ novelTypeText(item.novel_type) }} · {{ Number(item.is_complete) === 1 ? $t('common.completed') : $t('reader.rank.serializing') }}</view>
										<view v-if="currentBoard === 'logpower'" class="book-score">{{ $t('reader.rank.logPowerScore', { score: formatScore(item.score) }) }}</view>
										<view v-else class="book-update">{{ $t('reader.rank.updatedOn', { date: formatUpdateDate(item.update_time) }) }}</view>
									</view>
								</view>
							</view>
						</view>

						<view class="loading-state" v-if="zoneLoading(zone.key) && !zoneItems(zone.key).length">
							<image class="state-icon" src="../../static/loading.gif" mode="aspectFit" />
							<text class="state-title">{{ $t('reader.rank.loadingRank') }}</text>
						</view>
						<view class="empty-state" v-else-if="!zoneLoading(zone.key) && !zoneItems(zone.key).length">
							<text class="state-title">{{ $t('reader.rank.emptyTitle') }}</text>
							<text class="state-desc">{{ $t('reader.rank.emptyDesc') }}</text>
						</view>
						<view class="more-button" v-if="zone.key === currentZone && hasMore" @click="loadMore">{{ loading ? $t('reader.rank.loadingMore') : $t('reader.rank.loadMore') }}</view>
						<view class="list-end" v-else-if="zone.key === currentZone && items.length && !loading">{{ $t('reader.rank.listEnd') }}</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
import axios from 'axios';
import RankWorkTitle from '@/components/RankWorkTitle.vue';
import LogPowerWordmark from '@/components/LogPowerWordmark.vue';
import darkModeMixin from '@/mixins/dark-mode.js';

const PAGE_AMOUNT = 20;

export default {
	components: { LogPowerWordmark, RankWorkTitle },
	mixins: [darkModeMixin],
	data() {
		return {
			boards: [
				{ key: 'update', labelKey: 'reader.rank.boards.update' },
				{ key: 'logpower', labelKey: 'reader.rank.boards.logpower' },
				{ key: 'complete', labelKey: 'reader.rank.boards.complete' },
				{ key: 'new', labelKey: 'reader.rank.boards.new' },
			],
			zones: [
				{ key: 'all', labelKey: 'common.all' },
				{ key: 'novel', labelKey: 'reader.rank.zoneNovel' },
				{ key: 'manga', labelKey: 'reader.rank.zoneManga' },
				{ key: 'world', labelKey: 'reader.rank.zoneWorld' },
			],
			currentBoard: 'update',
			currentZone: 'all',
			items: [],
			page: 1,
			hasMore: false,
			loading: true,
			snapshotDate: '',
			batchId: null,
			requestVersion: 0,
			refreshing: false,
			listScrollTop: 0,
			zonePreviews: {},
			previewRequests: {},
		};
	},
	computed: {
		currentZoneIndex() { return this.zones.findIndex(zone => zone.key === this.currentZone); },
		currentBoardLabel() { return this.$t(this.boards.find(board => board.key === this.currentBoard).labelKey); },
		boardDescription() {
			return this.$t('reader.rank.boardDesc.' + this.currentBoard);
		},
		snapshotTimeText() {
			if (!this.snapshotDate) return '';
			const date = new Date(this.snapshotDate);
			if (isNaN(date.getTime())) return '';
			const pad = (n) => String(n).padStart(2, '0');
			return this.$t('reader.rank.snapshotTime', {
				month: date.getMonth() + 1,
				day: date.getDate(),
				time: `${pad(date.getHours())}:${pad(date.getMinutes())}`
			});
		},
	},
	onLoad(options) {
		if (options && this.boards.some((b) => b.key === options.board)) {
			this.currentBoard = options.board;
		}
		if (options && this.zones.some((z) => z.key === options.zone)) {
			this.currentZone = options.zone;
		}
		this.loadFirstPage();
	},
	methods: {
		onZoneSwipe(event) {
			const zone = this.zones[Number(event.detail.current)];
			if (zone) this.switchZone(zone.key);
		},
		zoneItems(zone) {
			if (zone === this.currentZone) return this.items;
			return this.zonePreviews[`${this.currentBoard}:${zone}`] || [];
		},
		zoneLoading(zone) {
			return zone === this.currentZone ? this.loading : !this.zonePreviews[`${this.currentBoard}:${zone}`];
		},
		cacheCurrentZone() {
			this.zonePreviews = { ...this.zonePreviews, [`${this.currentBoard}:${this.currentZone}`]: this.items };
		},
		preloadZones() {
			const board = this.currentBoard;
			for (const zone of this.zones) {
				const key = `${board}:${zone.key}`;
				if (zone.key === this.currentZone || this.zonePreviews[key] || this.previewRequests[key]) continue;
				this.previewRequests[key] = true;
				axios.get(this.$baseUrl + '/library/rank/get_rank_board?board=' + board
					+ '&zone=' + zone.key + '&page=1&amount=' + PAGE_AMOUNT, {})
					.then(res => {
						// A preview never changes the active list, pagination, or selected batch.
						if ((board === this.currentBoard && zone.key === this.currentZone) || this.zonePreviews[key]) return;
						this.zonePreviews = { ...this.zonePreviews, [key]: Array.isArray(res.data.items) ? res.data.items : [] };
					})
					.catch(() => {})
					.finally(() => { delete this.previewRequests[key]; });
			}
		},
		goBack() {
			uni.navigateBack();
		},
		formatUpdateDate(value) { return value ? String(value).slice(0, 10) : this.$t('reader.rank.noUpdate'); },
		novelTypeText(type) {
			if (type === 'manga') return this.$t('reader.rank.zoneManga');
			if (type === 'world') return this.$t('reader.rank.worldSetting');
			return this.$t('reader.rank.zoneNovel');
		},
		refreshRank() { this.refreshing = true; this.loadFirstPage(); },
		resetListScroll() {
			this.listScrollTop = 1;
			this.$nextTick(() => { this.listScrollTop = 0; });
		},
		formatScore(value) {
			return String(Math.floor(Number(value) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		},
		async fetchPage(page, version = this.requestVersion) {
			const res = await axios.get(this.$baseUrl
				+ '/library/rank/get_rank_board?board=' + this.currentBoard
				+ '&zone=' + this.currentZone
				+ '&page=' + page + '&amount=' + PAGE_AMOUNT
				+ (page > 1 && this.batchId ? '&batch_id=' + this.batchId : ''), {});
			const payload = res.data || {};
			const items = Array.isArray(payload.items) ? payload.items : [];
			if (version === this.requestVersion) {
				this.snapshotDate = payload.snapshot_date || '';
				this.batchId = payload.batch_id || null;
			}
			return items;
		},
		async loadFirstPage() {
			const version = ++this.requestVersion;
			this.batchId = null;
			this.loading = true;
			try {
				const items = await this.fetchPage(1, version);
				if (version !== this.requestVersion) return;
				this.items = items;
				this.page = 1;
				this.hasMore = items.length >= PAGE_AMOUNT;
				this.cacheCurrentZone();
				this.preloadZones();
			} catch (error) {
				if (version !== this.requestVersion) return;
				console.error('rankBoard loadFirstPage failed:', error);
				uni.showToast({ title: this.$t('reader.rank.fetchFailed'), icon: 'none', duration: 2000 });
			} finally {
				if (version === this.requestVersion) { this.loading = false; this.refreshing = false; }
			}
		},
		async loadMore() {
			if (this.loading || !this.hasMore) return;
			const version = this.requestVersion;
			this.loading = true;
			try {
				const items = await this.fetchPage(this.page + 1, version);
				if (version !== this.requestVersion) return;
				const seen = new Set(this.items.map((item) => item.novel_id));
				const fresh = items.filter((item) => !seen.has(item.novel_id));
				this.items = [...this.items, ...fresh];
				this.page += 1;
				this.hasMore = items.length >= PAGE_AMOUNT;
				this.cacheCurrentZone();
			} catch (error) {
				if (version !== this.requestVersion) return;
				if (error.response && error.response.status === 410) { this.loading = false; this.resetListScroll(); return this.loadFirstPage(); }
				console.error('rankBoard loadMore failed:', error);
				uni.showToast({ title: this.$t('reader.rank.loadMoreFailed'), icon: 'none', duration: 2000 });
			} finally {
				if (version === this.requestVersion) this.loading = false;
			}
		},
		switchBoard(key) {
			if (this.currentBoard === key) return;
			this.cacheCurrentZone();
			this.currentBoard = key;
			this.items = this.zonePreviews[`${key}:${this.currentZone}`] || [];
			this.resetListScroll();
			this.loadFirstPage();
		},
		switchZone(key) {
			if (this.currentZone === key) return;
			this.cacheCurrentZone();
			this.currentZone = key;
			this.items = this.zonePreviews[`${this.currentBoard}:${key}`] || [];
			this.resetListScroll();
			this.loadFirstPage();
		},
		goBook(item) {
			if (!item || !(item.novel_id > 0)) return;
			const url = item.novel_type === 'manga'
				? '/pages/readers/mangaInfo?id=' + item.novel_id
				: '/pages/readers/bookInfo?id=' + item.novel_id;
			uni.navigateTo({ url });
		},
	},
};
</script>

<style scoped lang="scss">
.rank-board-page {
	--page-bg: #ffffff;
	--nav-bg: #f5f6f8;
	--text-primary: #252525;
	--text-secondary: #858585;
	--text-muted: #a6a6a6;
	--accent: #36b5e5;
	--rank-color: #c79972;
	--header-height: calc(100rpx + var(--loghome-safe-top, 0px));
	height: 100vh;
	height: 100dvh;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	background: var(--page-bg);
	color: var(--text-primary);

	&.dark-mode {
		--page-bg: #181a1d;
		--nav-bg: #22252a;
		--text-primary: #eceef1;
		--text-secondary: #a3a7af;
		--text-muted: #7c838e;
		--rank-color: #d2a580;
	}
}
.rank-header {
	display: flex;
	align-items: center;
	flex-shrink: 0;
	height: var(--header-height);
	padding: var(--loghome-safe-top, 0px) 32rpx 0 16rpx;
	box-sizing: border-box;
	background: var(--nav-bg);
}
.back-button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 64rpx;
	height: 80rpx;
	padding: 0;
	margin: 0 18rpx 0 0;
	background: transparent;
	border: 0;
	flex-shrink: 0;
	&::after { border: 0; }
}
.zone-tabs { display: flex; align-items: center; justify-content: center; gap: 38rpx; flex: 1; }
.zone-tab {
	font-size: 30rpx;
	line-height: 44rpx;
	color: var(--text-secondary);
	white-space: nowrap;
	transition: color .2s ease, transform .2s ease;
	&.active { color: var(--text-primary); font-weight: 700; transform: scale(1.13); }
}
.board-summary {
	position: relative;
	display: flex;
	align-items: center;
	gap: 24rpx;
	padding: 28rpx 26rpx 28rpx 30rpx;
	flex-shrink: 0;
	&::before { content: ''; position: absolute; left: 0; top: 30rpx; width: 7rpx; height: 34rpx; background: var(--accent); border-radius: 0 5rpx 5rpx 0; }
}
.summary-title { font-size: 30rpx; font-weight: 700; flex-shrink: 0; }
.summary-desc { font-size: 22rpx; line-height: 32rpx; color: var(--text-muted); }
.rank-layout { display: flex; flex: 1; min-height: 0; }
.board-tabs { width: 144rpx; flex-shrink: 0; background: var(--nav-bg); padding-top: 12rpx; }
.board-tab {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 108rpx;
	padding: 0 8rpx;
	font-size: 26rpx;
	color: var(--text-secondary);
	transition: background-color .2s ease, color .2s ease;
	&.active {
		color: var(--text-primary);
		background: var(--page-bg);
		font-weight: 700;
		&::before { content: ''; position: absolute; left: 0; top: 34rpx; bottom: 34rpx; width: 5rpx; background: var(--accent); border-radius: 0 4rpx 4rpx 0; }
	}
}
.logpower-tab {
	flex-direction: column;
	gap: 7rpx;
	font-size: 22rpx;
	line-height: 1;
}
.rank-wordmark { width: 4em; }
.rank-swiper { flex: 1; min-width: 0; height: 100%; }
.rank-content { width: 100%; height: 100%; }
.meta-line { padding: 6rpx 20rpx 24rpx; font-size: 20rpx; line-height: 30rpx; color: var(--text-muted); }
.rank-list { padding: 0 20rpx; }
.rank-item {
	display: grid;
	grid-template-columns: 48rpx 184rpx minmax(0, 1fr);
	gap: 12rpx;
	align-items: start;
	margin-bottom: 34rpx;
	transition: opacity .18s ease;
	&:active { opacity: .7; }
}
.rank-index {
	position: relative;
	z-index: 1;
	font-size: 46rpx;
	line-height: 1;
	font-weight: 900;
	letter-spacing: -3rpx;
	color: var(--rank-color);
	font-family: 'Avenir Next Condensed', 'Arial Narrow', sans-serif;
	&.rank-top { font-size: 108rpx; font-style: italic; letter-spacing: -8rpx; }
}
.book-cover-box { position: relative; width: 184rpx; height: 246rpx; border-radius: 4rpx; overflow: hidden; background: var(--nav-bg); }
.book-cover { width: 100%; height: 100%; }
.manga-cover-badge, .world-cover-badge { position: absolute; left: 6rpx; bottom: 6rpx; padding: 1rpx 7rpx; border-radius: 4rpx; color: #fff; font-size: 18rpx; line-height: 27rpx; pointer-events: none; }
.manga-cover-badge { background: rgba(178, 64, 18, .94); }
.world-cover-badge { background: rgba(184, 134, 11, .94); }
.book-info { min-width: 0; height: 246rpx; display: flex; flex-direction: column; justify-content: space-between; padding-left: 4rpx; box-sizing: border-box; }
.book-name { min-width: 0; }
.book-details { font-size: 24rpx; line-height: 34rpx; color: var(--text-secondary); }
.book-author, .book-category, .book-update, .book-score { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.book-score { color: var(--rank-color); font-weight: 600; font-variant-numeric: tabular-nums; }
.loading-state, .empty-state { display: flex; flex-direction: column; align-items: center; gap: 16rpx; padding: 100rpx 20rpx; text-align: center; }
.state-icon { width: 112rpx; height: 112rpx; }
.state-title { font-size: 27rpx; color: var(--text-secondary); }
.state-desc { font-size: 23rpx; line-height: 34rpx; color: var(--text-muted); }
.more-button { margin: 4rpx 20rpx 26rpx; padding: 22rpx 0; text-align: center; background: var(--nav-bg); color: var(--text-secondary); font-size: 26rpx; border-radius: 8rpx; }
.list-end { padding: 0 20rpx calc(34rpx + var(--loghome-safe-bottom, 0px)); text-align: center; font-size: 22rpx; color: var(--text-muted); }
@media (max-width: 360px) {
	.zone-tabs { gap: 30rpx; }
	.board-tabs { width: 132rpx; }
	.rank-list { padding: 0 16rpx; }
	.rank-item { grid-template-columns: 44rpx 170rpx minmax(0, 1fr); gap: 10rpx; }
	.book-cover-box { width: 170rpx; height: 228rpx; }
	.book-info { height: 228rpx; }
	.book-details { font-size: 22rpx; line-height: 32rpx; }
}
@media (prefers-reduced-motion: reduce) { .zone-tab, .board-tab, .rank-item { transition: none; } }
</style>
