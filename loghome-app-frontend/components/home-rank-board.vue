<template>
	<view class="home-rank-board" role="group" aria-label="排行榜" v-dark>
		<view class="rank-header">
			<view class="board-tabs">
				<view class="board-tab clickable" v-for="board in boards" :key="board.key"
					:style="{ '--tab-units': board.key === 'logpower' ? 4.2 : 3 }"
					:class="{ active: board.key === currentBoard }" @click="switchBoard(board.key)">
					<span class="board-tab-label">
						<template v-if="board.key === 'logpower'"><LogPowerWordmark class="rank-wordmark" /><text>榜</text></template>
						<text v-else>{{ board.label }}</text>
					</span>
				</view>
			</view>
			<view class="more clickable" @click="gotoRankBoard">
				<text>更多</text>
				<uni-icons type="right" size="15" :color="$store.state.isDarkMode ? '#aaa' : '#777'"></uni-icons>
			</view>
		</view>

		<view class="zone-chips">
			<view class="zone-chip clickable" v-for="zone in zones" :key="zone.key"
				:class="{ active: zone.key === currentZone }" @click="switchZone(zone.key)">
				{{ zone.label }}
			</view>
		</view>

		<view class="rank-carousel" role="group" aria-label="按列滑动的排行榜"
			@touchstart="startGesture" @touchmove="moveGesture" @touchend="endGesture" @touchcancel="cancelGesture"
			@mousedown="startGesture" @mousemove="moveGesture" @mouseup="endGesture" @mouseleave="cancelGesture"
			@wheel="onWheel" @keydown.left.prevent="moveColumn(-1)" @keydown.right.prevent="moveColumn(1)"
			tabindex="0">
			<view class="dense-card-page" :class="{ 'is-dragging': gesture !== null, 'is-loading': loading }"
				:style="{ transform: 'translate3d(' + (-columnIndex * columnPitch + dragOffset) + 'px, 0, 0)' }">
				<view class="dense-card-column" v-for="(column, columnNumber) in columns" :key="columnNumber"
					:class="{ 'has-double-digit-rank': column.some((novel, idx) => novel && columnNumber * 4 + idx + 1 >= 10) }">
					<view class="dense-card-item" v-for="(novel, idx) in column" :key="idx"
						:class="{ clickable: !!novel, 'rank-placeholder': !novel }"
						@click="openNovel(novel)" :aria-hidden="!novel ? 'true' : null"
						:id="novel ? 'book-cover-' + novel.novel_id : null">
						<template v-if="novel">
							<view class="dense-card-cover-box">
								<log-image :src="novel.picUrl + '?thumbnail=1'" alt="" class="dense-card-cover"
									:onerror="`onerror=null;src='` + $backupResources.bookCover + `'`" />
								<text v-if="novel.novel_type === 'manga'" class="manga-cover-badge">漫画</text>
								<text v-else-if="novel.novel_type === 'world'" class="world-cover-badge">世界</text>
								<haycraft-mark v-if="isHayCraftWork(novel)" class="dense-haycraft-mark" size="small" />
							</view>
							<text class="dense-card-rank" :class="{ 'rank-top': columnNumber * 4 + idx < 3 }">{{ columnNumber * 4 + idx + 1 }}</text>
							<view class="dense-card-info">
								<rank-work-title class="dense-card-title" :title="novel.name" :badges="novel.badges || []" compact />
								<view class="dense-card-author">{{ novel.user_name }}</view>
							</view>
						</template>
						<template v-else>
							<view class="skeleton-cover"></view>
							<view class="skeleton-rank"></view>
							<view class="skeleton-info"><view class="skeleton-title"></view><view class="skeleton-author"></view></view>
						</template>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import axios from 'axios';
import RankWorkTitle from '@/components/RankWorkTitle.vue';
import darkModeMixin from '@/mixins/dark-mode.js';
import HaycraftMark from '@/components/haycraft-mark.vue';
import LogPowerWordmark from '@/components/LogPowerWordmark.vue';

const HOME_RANK_CACHE_TTL = 10 * 60 * 1000;
const HOME_RANK_FETCH_AMOUNT = 12;

export default {
	components: { HaycraftMark, LogPowerWordmark, RankWorkTitle },
	mixins: [darkModeMixin],
	data() {
		return {
			boards: [
				{ key: 'update', label: '更新榜' },
				{ key: 'logpower', label: '原木力榜' },
				{ key: 'complete', label: '完结榜' },
				{ key: 'new', label: '新作榜' },
			],
			zones: [
				{ key: 'all', label: '全部' },
				{ key: 'novel', label: '小说' },
				{ key: 'manga', label: '漫画' },
				{ key: 'world', label: '世界' },
			],
			currentBoard: 'update',
			currentZone: 'all',
			items: [],
			loading: true,
			cache: {},
			loadError: false,
			requestVersion: 0,
			columnIndex: 0,
			columnPitch: 179,
			visibleColumns: 2,
			gesture: null,
			dragOffset: 0,
			gestureLockUntil: 0,
			suppressClickUntil: 0,
			wheelIdleUntil: 0,
			wheelDistance: 0,
		};
	},
	computed: {
		columns() {
			const items = this.loading ? [] : this.items;
			const count = Math.max(this.visibleColumns, Math.ceil(items.length / 4));
			return Array.from({ length: count }, (_, col) =>
				Array.from({ length: 4 }, (_, row) => items[col * 4 + row] || null));
		},
		maxColumnIndex() {
			return Math.max(0, this.columns.length - this.visibleColumns);
		},
	},
	mounted() {
		this.$nextTick(this.measureCarousel);
		if (uni.onWindowResize) uni.onWindowResize(this.measureCarousel);
		return this.loadBoard();
	},
	beforeDestroy() {
		if (uni.offWindowResize) uni.offWindowResize(this.measureCarousel);
	},
	methods: {
		measureCarousel() {
			uni.createSelectorQuery().in(this).select('.rank-carousel').boundingClientRect()
				.select('.dense-card-column').boundingClientRect().exec(rects => {
					if (!rects[0] || !rects[1] || !rects[1].width) return;
					const gap = uni.upx2px(24);
					this.columnPitch = rects[1].width + gap;
					this.visibleColumns = Math.max(1, Math.floor((rects[0].width + gap) / this.columnPitch));
					this.columnIndex = Math.min(this.columnIndex, this.maxColumnIndex);
				});
		},
		gesturePoint(event) {
			return (event.changedTouches && event.changedTouches[0]) || (event.touches && event.touches[0]) || event;
		},
		startGesture(event) {
			if (this.loading || this.loadError || Date.now() < this.gestureLockUntil || (event.button != null && event.button !== 0)) return;
			const point = this.gesturePoint(event);
			this.gesture = { x: point.clientX, y: point.clientY, axis: null };
			this.dragOffset = 0;
		},
		moveGesture(event) {
			if (!this.gesture) return;
			const point = this.gesturePoint(event);
			const dx = point.clientX - this.gesture.x;
			const dy = point.clientY - this.gesture.y;
			if (!this.gesture.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 8) {
				this.gesture.axis = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'horizontal' : 'vertical';
			}
			if (this.gesture.axis !== 'horizontal') return;
			if (event.cancelable && event.preventDefault) event.preventDefault();
			this.suppressClickUntil = Date.now() + 400;
			const atEdge = (dx > 0 && this.columnIndex === 0) || (dx < 0 && this.columnIndex === this.maxColumnIndex);
			this.dragOffset = atEdge ? Math.max(-24, Math.min(24, dx / 4)) : Math.max(-this.columnPitch, Math.min(this.columnPitch, dx));
		},
		endGesture(event) {
			if (!this.gesture) return;
			const point = this.gesturePoint(event);
			const dx = point.clientX - this.gesture.x;
			const dy = point.clientY - this.gesture.y;
			const horizontal = this.gesture.axis !== 'vertical' && Math.abs(dx) >= 36 && Math.abs(dx) > Math.abs(dy) * 1.2;
			this.cancelGesture();
			if (horizontal) {
				this.suppressClickUntil = Date.now() + 400;
				return this.moveColumn(dx < 0 ? 1 : -1);
			}
		},
		cancelGesture() {
			this.gesture = null;
			this.dragOffset = 0;
		},
		onWheel(event) {
			if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
			if (event.cancelable && event.preventDefault) event.preventDefault();
			const now = Date.now();
			if (now > this.wheelIdleUntil) this.wheelDistance = 0;
			this.wheelIdleUntil = now + 180;
			if (!Number.isFinite(this.wheelDistance)) return;
			this.wheelDistance += event.deltaX;
			if (Math.abs(this.wheelDistance) >= 36) {
				const direction = this.wheelDistance > 0 ? 1 : -1;
				this.wheelDistance = Infinity;
				return this.moveColumn(direction);
			}
		},
		moveColumn(direction) {
			if (this.loading || this.loadError || Date.now() < this.gestureLockUntil) return;
			this.gestureLockUntil = Date.now() + 280;
			if (direction < 0) {
				if (this.columnIndex > 0) {
					this.columnIndex -= 1;
					return;
				}
				const zoneIndex = this.zones.findIndex(zone => zone.key === this.currentZone);
				if (zoneIndex > 0) return this.switchZone(this.zones[zoneIndex - 1].key, 'last');
				const boardIndex = this.boards.findIndex(board => board.key === this.currentBoard);
				if (boardIndex > 0) {
					this.currentZone = this.zones[this.zones.length - 1].key;
					return this.switchBoard(this.boards[boardIndex - 1].key, 'last');
				}
				return;
			}
			if (this.columnIndex < this.maxColumnIndex) {
				this.columnIndex += 1;
				return;
			}
			const zoneIndex = this.zones.findIndex(zone => zone.key === this.currentZone);
			if (zoneIndex < this.zones.length - 1) return this.switchZone(this.zones[zoneIndex + 1].key);
			const boardIndex = this.boards.findIndex(board => board.key === this.currentBoard);
			if (boardIndex < this.boards.length - 1) {
				this.currentZone = 'all';
				return this.switchBoard(this.boards[boardIndex + 1].key);
			}
			this.gotoRankBoard();
		},
		isHayCraftWork(novel) {
			if (!novel || typeof novel !== 'object') return false;
			return novel.is_haycraft === true || Number(novel.is_haycraft) === 1;
		},
		readCache(board, zone) {
			const hit = this.cache[board + ':' + zone];
			if (!hit) return null;
			if (Date.now() - hit.savedAt > HOME_RANK_CACHE_TTL) return null;
			return hit;
		},
		async loadBoard(initialColumn = 'first') {
			const version = ++this.requestVersion;
			this.loadError = false;
			const board = this.currentBoard;
			const zone = this.currentZone;
			const cached = this.readCache(board, zone);
			if (cached) {
				this.items = cached.items;
				this.loading = false;
				this.columnIndex = initialColumn === 'last' ? this.maxColumnIndex : 0;
				return;
			}
			this.loading = true;
			try {
				const res = await axios.get(this.$baseUrl
					+ '/library/rank/get_rank_board?board=' + board
					+ '&zone=' + zone + '&page=1&amount=' + HOME_RANK_FETCH_AMOUNT, {});
				const payload = res.data || {};
				const items = Array.isArray(payload.items) ? payload.items : [];
				this.cache[board + ':' + zone] = { items, savedAt: Date.now() };
				if (version === this.requestVersion) {
					this.items = items;
				}
			} catch (error) {
				console.error('loadBoard failed:', board, zone, error);
				if (version === this.requestVersion) { this.items = []; this.loadError = true; }
			} finally {
				if (version === this.requestVersion) {
					this.loading = false;
					this.columnIndex = initialColumn === 'last' ? this.maxColumnIndex : 0;
				}
			}
		},
		switchBoard(key, initialColumn = 'first') {
			if (this.currentBoard === key) return Promise.resolve();
			this.cancelGesture();
			this.columnIndex = 0;
			this.currentBoard = key;
			return this.loadBoard(initialColumn);
		},
		switchZone(key, initialColumn = 'first') {
			if (this.currentZone === key) return Promise.resolve();
			this.cancelGesture();
			this.columnIndex = 0;
			this.currentZone = key;
			return this.loadBoard(initialColumn);
		},
		openNovel(novel) {
			if (Date.now() < this.suppressClickUntil || !novel || !(novel.novel_id > 0)) return;
			const url = novel.novel_type === 'manga'
				? '/pages/readers/mangaInfo?id=' + novel.novel_id
				: '/pages/readers/bookInfo?id=' + novel.novel_id;
			uni.navigateTo({ url });
		},
		gotoRankBoard() {
			uni.navigateTo({
				url: '/pages/readers/rankBoard?board=' + this.currentBoard + '&zone=' + this.currentZone,
			});
		},
		// 供首页下拉刷新调用
		reload() {
			this.cache = {};
			this.columnIndex = 0;
			return this.loadBoard();
		},
	},
};
</script>

<style scoped lang="scss">
.home-rank-board {
	--rank-accent: #8fdf70;
	--rank-text: #202020;
	--rank-muted: #999;
	--rank-chip: #f5f5f5;
	margin: 0;
	padding: 24rpx 25rpx 6rpx;
	box-sizing: border-box;
	background: #fff;
	overflow: hidden;

	&.dark-mode {
		--rank-text: var(--text-color-primary, #eee);
		--rank-muted: #aaa;
		--rank-chip: #303030;
		background: var(--card-background, #252525);
	}
}

.rank-header {
	display: flex;
	align-items: flex-start;
	gap: 12rpx;
	height: 48rpx;
	box-sizing: border-box;
	white-space: nowrap;
	padding-bottom: 0rpx;
}

.board-tabs {
	display: flex;
	align-items: flex-start;
	gap: 24rpx;
	flex-shrink: 0;
	height: 48rpx;
}

.board-tab {
	// Keep font metrics fixed; animate width separately from the visual text scale.
	position: relative;
	display: block;
	flex-shrink: 0;
	width: calc(var(--tab-units) * 32rpx);
	height: 48rpx;
	font-size: 36rpx;
	line-height: 48rpx;
	margin-right: 10rpx;
	transition: width .24s cubic-bezier(.4, 0, .2, 1);
	&.active { width: calc(var(--tab-units) * 36rpx); }
}

.board-tab-label {
	position: absolute;
	left: 0;
	top: 0;
	display: block;
	width: max-content;
	color: #777;
	font-size: 36rpx;
	line-height: 48rpx;
	font-weight: 400;
	transform: scale(.888888889);
	// Scale around the shared text baseline, never the centre of the title bar.
	transform-origin: left calc(24rpx + .35em);
	transition:
		transform .24s cubic-bezier(.4, 0, .2, 1),
		font-weight .24s cubic-bezier(.4, 0, .2, 1),
		color .24s cubic-bezier(.4, 0, .2, 1);

	.board-tab.active & {
		color: var(--rank-text);
		transform: scale(1);
		font-weight: 600;
	}

	.dark-mode & { color: #aaa; }
	.dark-mode .board-tab.active & { color: var(--rank-text); }
}

.more {
	display: flex;
	align-items: baseline;
	gap: 4rpx;
	flex-shrink: 0;
	color: #777;
	font-size: 25rpx;
	line-height: 48rpx;
	margin-left: auto;
	transform: translateY(4rpx);
	.dark-mode & { color: #aaa; }
}

.zone-chips {
	display: flex;
	gap: 18rpx;
	margin: 22rpx 0 28rpx;
}

.zone-chip {
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 104rpx;
	height: 54rpx;
	padding: 0 14rpx;
	box-sizing: border-box;
	border-radius: 13rpx;
	font-size: 26rpx;
	font-weight: 400;
	color: var(--rank-muted);
	background: var(--rank-chip);
	transition: background-color .24s cubic-bezier(.4, 0, .2, 1), color .24s cubic-bezier(.4, 0, .2, 1);

	&.active {
		color: #202020;
		background: var(--rank-accent);
	}
}

.rank-carousel {
	width: 100%;
	overflow: hidden;
	touch-action: pan-y;
	user-select: none;
	outline-offset: 2px;
}
.rank-wordmark { width: 3.2em; }
.rank-carousel ::v-deep img { -webkit-user-drag: none; }


.dense-card-page {
	transition: transform .28s cubic-bezier(.22, .61, .36, 1);
	&.is-dragging { transition: none; }
	display: flex;
	align-items: flex-start;
	gap: 24rpx;
	width: max-content;
	min-width: 100%;
	padding: 0;
	box-sizing: border-box;
}

.dense-card-column {
	--rank-number-width: 28rpx;
	display: flex;
	flex-direction: column;
	gap: 24rpx;
	width: 334.4rpx;
	flex: 0 0 334.4rpx;
	&.has-double-digit-rank { --rank-number-width: 44rpx; }
}

.dense-card-item {
	display: grid;
	grid-template-columns: 96rpx var(--rank-number-width) minmax(0, 1fr);
	column-gap: 12rpx;
	align-items: start;
	width: 100%;
	min-height: 130rpx;
	white-space: normal;
	box-sizing: border-box;
}

.dense-card-cover-box {
	position: relative;
	width: 96rpx;
	height: 130rpx;
	border-radius: 8rpx;
	overflow: hidden;
	background: var(--rank-chip);
}

.dense-card-cover {
	display: block;
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.dense-card-rank {
	padding-top: 0;
	font-size: 33rpx;
	font-weight: 800;
	line-height: 36rpx;
	text-align: center;
	color: #666;
	font-family: 'Avenir Next', 'DIN Alternate', sans-serif;
	font-variant-numeric: tabular-nums;
	&.rank-top { color: #ed7156; }
	.dark-mode & { color: #aaa; }
	.dark-mode &.rank-top { color: #f28570; }
}

.dense-card-info {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	min-width: 0;
	height: 130rpx;
	box-sizing: border-box;
}

.dense-card-title { min-width: 0; color: var(--rank-text); }

.dense-haycraft-mark {
	position: absolute;
	right: 4rpx;
	bottom: 4rpx;
	margin: 0;
}

.dense-card-author {
	margin-top: 0;
	font-size: 24rpx;
	font-weight: 400;
	line-height: 32rpx;
	color: var(--rank-muted);
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.manga-cover-badge, .world-cover-badge {
	position: absolute;
	left: 6rpx;
	bottom: 6rpx;
	padding: 1rpx 6rpx;
	border-radius: 4rpx;
	color: #fff;
	font-size: 17rpx;
	line-height: 26rpx;
	pointer-events: none;
}
.manga-cover-badge { background: rgba(178, 64, 18, .94); }
.world-cover-badge { background: rgba(65, 104, 48, .94); }

.rank-empty {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 220rpx;
	font-size: 26rpx;
	color: var(--rank-muted);
}

.skeleton-cover, .skeleton-rank, .skeleton-title, .skeleton-author {
	position: relative;
	overflow: hidden;
	border-radius: 6rpx;
	background: var(--rank-chip);
	.is-loading &::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, transparent, rgba(150, 150, 150, .1), transparent);
		animation: rank-skeleton-shimmer 1.2s ease-in-out infinite;
	}
}
.skeleton-cover { width: 96rpx; height: 130rpx; }
.skeleton-rank { width: 24rpx; height: 30rpx; margin-top: 4rpx; }
.skeleton-info {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	min-width: 0;
	height: 130rpx;
}
.skeleton-title { height: 72rpx; }
.skeleton-author { height: 24rpx; width: 65%; margin-top: 10rpx; }

.clickable { cursor: pointer; -webkit-tap-highlight-color: transparent; }

@media (max-width: 360px) {
	.rank-header { gap: 6rpx; }
	.board-tabs { gap: 16rpx; }
	.board-tab { font-size: 34rpx; width: calc(var(--tab-units) * 30rpx); }
	.board-tab.active { width: calc(var(--tab-units) * 34rpx); }
	.board-tab-label { font-size: 34rpx; transform: scale(.882352941); }
	.board-tab.active .board-tab-label { transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
	.board-tab, .board-tab-label, .zone-chip, .dense-card-page { transition: none; }
	.skeleton-cover::after, .skeleton-rank::after, .skeleton-title::after, .skeleton-author::after { animation: none; }
}

@keyframes rank-skeleton-shimmer { to { transform: translateX(100%); } }
</style>
