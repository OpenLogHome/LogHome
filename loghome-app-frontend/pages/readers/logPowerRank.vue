<template>
	<view class="rank-container" v-dark>
		<view class="hero-section">
			<view class="hero-panel">
				<!-- <image class="hero-background" src="../../static/bg.png" mode="aspectFill"></image> -->
				<view class="hero-mask"></view>
				<view class="hero-content">
					<view class="hero-pill">实时热度榜</view>
					<view class="hero-title"><LogPowerWordmark />爆棚榜</view>
					<view class="hero-subtitle">按<LogPowerWordmark />实时排序，越靠前说明作品越热。</view>

					<view class="hero-meta">
						<view class="meta-chip">
							<text class="meta-label">更新时间</text>
							<text class="meta-value">{{ currentTime }}</text>
						</view>
						<view class="meta-chip">
							<text class="meta-label">收录</text>
							<text class="meta-value">{{ books.length }} 本</text>
						</view>
					</view>

					<view class="summary-row" v-if="books.length">
						<view class="summary-card" v-for="item in summaryCards" :key="item.label">
							<view class="summary-label"><template v-if="item.label === '榜首原木力'">榜首<LogPowerWordmark /></template><template v-else>{{ item.label }}</template></view>
							<text class="summary-value">{{ item.value }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="page-body">
			<view class="feature-card" v-if="champion" @click="goBook(champion.novel_id)">
				<view class="feature-head">
					<view class="feature-tag">当前冠军</view>
				</view>

				<view class="feature-main">
					<view class="feature-cover-box">
						<log-image :src="champion.picUrl" class="feature-cover"
							:onerror="`onerror=null;src='` + $backupResources.bookCover + `'`" />
					</view>

					<view class="feature-info">
						<view class="feature-title">{{ champion.name }}</view>
						<view class="feature-author">
							<view class="rank-avatar rank-avatar-first">
								<image class="rank-avatar-medal" src="../../static/rank/NO1.png" mode="aspectFit"></image>
								<log-image :src="champion.avatar_url" class="rank-avatar-photo rank-avatar-photo-first"
									onerror="onerror=null;src='../static/user/defaultAvatar.jpg'" />
							</view>
							<text>{{ champion.user_name || '匿名作者' }}</text>
						</view>
						<view class="feature-desc">{{ champion.content || '这个作品还没有简介。' }}</view>

						<view class="feature-footer">
							<view class="feature-score">
								<LogPowerWordmark class="feature-score-label" />
								<text class="feature-score-value">{{ formatScore(champion.ranking) }}</text>
							</view>
							<view class="feature-action">点击查看详情</view>
						</view>
					</view>
				</view>
			</view>

			<view class="section-card" v-if="runnerUps.length">
				<view class="section-head">
					<text class="section-title">头部梯队</text>
					<text class="section-tip">Top 2 - 3</text>
				</view>

				<view class="podium-list">
					<view class="podium-card" v-for="(item, index) in runnerUps" :key="item.novel_id"
						:class="['podium-' + (index + 2)]" @click="goBook(item.novel_id)">
						<view class="podium-top">
							<view class="rank-avatar rank-avatar-podium">
								<image class="rank-avatar-medal"
									:src="index === 0 ? '../../static/rank/NO2.png' : '../../static/rank/NO3.png'"
									mode="aspectFit"></image>
								<log-image :src="item.avatar_url" class="rank-avatar-photo rank-avatar-photo-podium"
									onerror="onerror=null;src='../static/user/defaultAvatar.jpg'" />
							</view>
							<view class="podium-rank">TOP {{ index + 2 }}</view>
						</view>
						<view class="podium-name">{{ item.name }}</view>
						<view class="podium-author">{{ item.user_name || '匿名作者' }}</view>
						<view class="podium-score">{{ formatScore(item.ranking) }}</view>
					</view>
				</view>
			</view>

			<view class="section-card" v-if="remainingBooks.length">
				<view class="section-head">
					<text class="section-title">其余上榜作品</text>
					<text class="section-tip">点击卡片进入详情页</text>
				</view>

				<view class="rank-list">
					<view class="rank-item" v-for="(item, index) in remainingBooks" :key="item.novel_id"
						@click="goBook(item.novel_id)">
						<view class="rank-index">{{ index + 4 }}</view>

						<view class="book-cover-box">
							<log-image :src="item.picUrl" class="book-cover"
								:onerror="`onerror=null;src='` + $backupResources.bookCover + `'`" />
						</view>

						<view class="book-info">
							<view class="book-name">{{ item.name }}</view>
							<view class="book-author">
								<log-image :src="item.avatar_url" class="author-avatar"
									onerror="onerror=null;src='../static/user/defaultAvatar.jpg'" />
								<text>{{ item.user_name || '匿名作者' }}</text>
							</view>
							<view class="book-desc">{{ item.content || '这个作品还没有简介。' }}</view>
						</view>

						<view class="score-pill">
							<LogPowerWordmark class="score-pill-label" />
							<text class="score-pill-value">{{ formatScore(item.ranking) }}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="loading-state" v-if="showLoadingState">
				<image class="state-icon" src="../../static/loading.gif" mode="aspectFit"></image>
				<text class="state-title">正在生成榜单</text>
				<view class="state-desc">正在通过<LogPowerWordmark />探测器搜索...</view>
			</view>

			<view class="empty-state" v-else-if="showEmptyState">
				<text class="empty-icon">🌲</text>
				<text class="state-title">榜单暂时还没有数据</text>
				<text class="state-desc">下拉刷新后再试一次</text>
			</view>
		</view>
	</view>
</template>

<script>
import LogPowerWordmark from '@/components/LogPowerWordmark.vue'
	import axios from 'axios'
	import darkModeMixin from '@/mixins/dark-mode.js'

	export default {
		components: { LogPowerWordmark },
		mixins: [darkModeMixin],
		data() {
			return {
				books: [],
				currentTime: '',
				loading: true,
				hasLoaded: false
			}
		},
		computed: {
			champion() {
				return this.books[0] || null;
			},
			runnerUps() {
				return this.books.slice(1, 3);
			},
			remainingBooks() {
				return this.books.slice(3);
			},
			showLoadingState() {
				return this.loading && !this.books.length;
			},
			showEmptyState() {
				return this.hasLoaded && !this.loading && !this.books.length;
			},
			summaryCards() {
				if (!this.books.length) {
					return [];
				}

				const totalScore = this.books.reduce((sum, item) => sum + this.normalizeScore(item.ranking), 0);
				const averageScore = Math.floor(totalScore / this.books.length);
				const lastScore = this.normalizeScore(this.books[this.books.length - 1].ranking);

				return [{
					label: '榜首原木力',
					value: this.formatScore(this.champion.ranking)
				}, {
					label: '平均热度',
					value: this.formatScore(averageScore)
				}, {
					label: '入榜门槛',
					value: this.formatScore(lastScore)
				}];
			}
		},
		onLoad() {
			this.updateTime();
			this.refreshCollections();
		},
		onPullDownRefresh() {
			this.updateTime();
			this.refreshCollections();
		},
		methods: {
			updateTime() {
				const now = new Date();
				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(2, '0');
				const day = String(now.getDate()).padStart(2, '0');
				const hour = String(now.getHours()).padStart(2, '0');
				const minute = String(now.getMinutes()).padStart(2, '0');
				this.currentTime = `${year}-${month}-${day} ${hour}:${minute}`;
			},
			normalizeScore(value) {
				return Math.floor(Number(value) || 0);
			},
			formatScore(value) {
				return String(this.normalizeScore(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			},
			refreshCollections() {
				if (!this.books.length) {
					this.loading = true;
				}

				axios.get(this.$baseUrl +
					'/library/recommand/get_library_recommend_titles?title=原木力爆棚&page=1&amount=50')
					.then((res) => {
						const list = Array.isArray(res.data) ? res.data.slice() : [];
						list.sort((a, b) => (b.ranking || 0) - (a.ranking || 0));
						this.books = list;
						this.hasLoaded = true;
					})
					.catch(() => {
						this.hasLoaded = true;
						uni.showToast({
							title: '获取榜单失败',
							icon: 'none',
							duration: 2000
						});
					})
					.finally(() => {
						this.loading = false;
						uni.stopPullDownRefresh();
					});
			},
			goBook(id) {
				uni.navigateTo({
					url: './bookInfo?id=' + id
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.rank-container {
		--page-bg: #f7f0e6;
		--card-bg: rgba(255, 252, 247, 0.96);
		--card-strong-bg: linear-gradient(135deg, rgba(255, 249, 239, 0.98), rgba(255, 239, 217, 0.98));
		--card-border: rgba(102, 62, 32, 0.08);
		--text-primary: #2f2119;
		--text-secondary: #73594a;
		--text-muted: #9c8475;
		--accent: #c76b2e;
		--accent-deep: #9f4f1c;
		--accent-soft: rgba(199, 107, 46, 0.12);
		--shadow-soft: 0 18rpx 48rpx rgba(87, 48, 22, 0.08);
		--shadow-strong: 0 24rpx 60rpx rgba(87, 48, 22, 0.14);
		min-height: 100vh;
		background:
			radial-gradient(circle at top left, rgba(255, 207, 149, 0.4), transparent 32%),
			radial-gradient(circle at right 10% top 8%, rgba(224, 137, 90, 0.16), transparent 24%),
			linear-gradient(180deg, #faefe0 0%, #f6f3ee 32%, #f5f6f8 100%);
		padding-bottom: 48rpx;
		color: var(--text-primary);

		&.dark-mode {
			--page-bg: #151312;
			--card-bg: rgba(29, 25, 22, 0.94);
			--card-strong-bg: linear-gradient(135deg, rgba(44, 34, 28, 0.98), rgba(61, 40, 27, 0.94));
			--card-border: rgba(255, 255, 255, 0.06);
			--text-primary: #f6efe7;
			--text-secondary: #d6c0b1;
			--text-muted: #9b8678;
			--accent: #ffb36d;
			--accent-deep: #ff9243;
			--accent-soft: rgba(255, 179, 109, 0.14);
			--shadow-soft: 0 18rpx 48rpx rgba(0, 0, 0, 0.28);
			--shadow-strong: 0 26rpx 64rpx rgba(0, 0, 0, 0.36);
			background:
				radial-gradient(circle at top left, rgba(255, 160, 92, 0.12), transparent 30%),
				radial-gradient(circle at right 10% top 8%, rgba(255, 179, 109, 0.08), transparent 20%),
				linear-gradient(180deg, #171311 0%, #111111 100%);
		}
	}

	.hero-section {
		padding: 28rpx 24rpx 0;
	}

	.hero-panel,
	.feature-card,
	.section-card,
	.rank-item,
	.podium-card {
		border: 1rpx solid var(--card-border);
		box-shadow: var(--shadow-soft);
	}

	.hero-panel {
		position: relative;
		overflow: hidden;
		border-radius: 36rpx;
		padding: 34rpx 30rpx 30rpx;
		background: linear-gradient(135deg, #6f3a1e 0%, #a85929 46%, #d48f54 100%);
		box-shadow: var(--shadow-strong);
	}

	.hero-background,
	.hero-mask {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}

	.hero-background {
		width: 100%;
		height: 100%;
		opacity: 0.22;
	}

	.hero-mask {
		background:
			radial-gradient(circle at left top, rgba(255, 233, 201, 0.38), transparent 28%),
			linear-gradient(180deg, rgba(41, 20, 10, 0.1), rgba(41, 20, 10, 0.22));
	}

	.hero-content {
		position: relative;
		z-index: 1;
	}

	.hero-pill {
		display: inline-flex;
		align-items: center;
		padding: 10rpx 20rpx;
		border-radius: 999rpx;
		font-size: 22rpx;
		color: #fff6ea;
		background: rgba(255, 255, 255, 0.14);
		backdrop-filter: blur(8rpx);
	}

	.hero-title {
		margin-top: 18rpx;
		font-size: 54rpx;
		font-weight: 800;
		letter-spacing: 1rpx;
		color: #fff9f2;
	}

	.hero-subtitle {
		margin-top: 14rpx;
		font-size: 26rpx;
		line-height: 1.65;
		color: rgba(255, 244, 232, 0.9);
	}

	.hero-meta {
		display: flex;
		flex-wrap: wrap;
		margin-top: 28rpx;
	}

	.meta-chip {
		min-width: 220rpx;
		margin-right: 16rpx;
		margin-bottom: 16rpx;
		padding: 18rpx 22rpx;
		border-radius: 24rpx;
		background: rgba(255, 255, 255, 0.12);
	}

	.meta-label {
		display: block;
		font-size: 20rpx;
		color: rgba(255, 242, 228, 0.7);
	}

	.meta-value {
		display: block;
		margin-top: 8rpx;
		font-size: 28rpx;
		font-weight: 700;
		color: #fff8ef;
	}

	.summary-row {
		display: flex;
		justify-content: space-between;
		margin-top: 8rpx;
	}

	.summary-card {
		box-sizing: border-box;
		width: 31%;
		padding: 22rpx 18rpx;
		border-radius: 24rpx;
		background: rgba(255, 255, 255, 0.14);
	}

	.summary-label {
		display: block;
		font-size: 20rpx;
		color: rgba(255, 242, 228, 0.72);
	}

	.summary-value {
		display: block;
		margin-top: 10rpx;
		font-size: 32rpx;
		font-weight: 800;
		color: #fff8ef;
	}

	.page-body {
		position: relative;
		z-index: 2;
		margin-top: -24rpx;
		padding: 0 24rpx 24rpx;
	}

	.feature-card,
	.section-card {
		border-radius: 32rpx;
		margin-bottom: 24rpx;
		padding: 28rpx;
		background: var(--card-bg);
	}

	.feature-card {
		background: var(--card-strong-bg);
		box-shadow: var(--shadow-strong);

		&:active {
			transform: scale(0.99);
		}
	}

	.feature-head,
	.section-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.feature-tag {
		padding: 10rpx 18rpx;
		border-radius: 999rpx;
		font-size: 22rpx;
		font-weight: 700;
		color: var(--accent-deep);
		background: rgba(255, 255, 255, 0.68);
	}

	.feature-main {
		display: flex;
		margin-top: 22rpx;
	}

	.feature-cover-box,
	.book-cover-box {
		flex-shrink: 0;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.2);
	}

	.feature-cover-box {
		width: 176rpx;
		height: 232rpx;
		border-radius: 24rpx;
		margin-right: 24rpx;
		box-shadow: 0 12rpx 32rpx rgba(61, 33, 18, 0.18);
	}

	.feature-cover,
	.book-cover {
		width: 100%;
		height: 100%;
	}

	.feature-info,
	.book-info {
		flex: 1;
		min-width: 0;
	}

	.feature-title,
	.book-name {
		font-size: 34rpx;
		font-weight: 800;
		line-height: 1.4;
		color: var(--text-primary);
	}

	.feature-author,
	.book-author {
		display: flex;
		align-items: center;
		margin-top: 14rpx;
		font-size: 24rpx;
		color: var(--text-secondary);
	}

	.rank-avatar {
		position: relative;
		flex-shrink: 0;
		margin-right: 10rpx;
	}

	.rank-avatar-first {
		width: 84rpx;
		height: 61rpx;
	}

	.rank-avatar-podium {
		width: 76rpx;
		height: 60rpx;
	}

	.rank-avatar-medal {
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.rank-avatar-photo {
		position: absolute;
		z-index: 2;
		box-sizing: border-box;
		border-radius: 50%;
		object-fit: cover;
		background: rgba(255, 255, 255, 0.9);
	}

	.rank-avatar-photo-first {
		top: 6rpx;
		left: 22rpx;
		width: 40rpx;
		height: 40rpx;
		border: 2rpx solid #f6b51f;
	}

	.rank-avatar-photo-podium {
		top: 5rpx;
		left: 19rpx;
		width: 38rpx;
		height: 38rpx;
		border: 2rpx solid rgba(255, 255, 255, 0.88);
	}

	.author-avatar {
		width: 36rpx;
		height: 36rpx;
		margin-right: 10rpx;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.2);
	}

	.feature-desc,
	.book-desc {
		margin-top: 18rpx;
		font-size: 24rpx;
		line-height: 1.7;
		color: var(--text-muted);
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
	}

	.feature-desc {
		-webkit-line-clamp: 3;
	}

	.book-desc {
		-webkit-line-clamp: 2;
	}

	.feature-footer {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		margin-top: 22rpx;
	}

	.feature-score {
		display: flex;
		flex-direction: column;
	}

	.feature-score-label,
	.score-pill-label {
		font-size: 20rpx;
		color: var(--text-secondary);
	}

	.feature-score-value {
		margin-top: 8rpx;
		font-size: 44rpx;
		line-height: 1;
		font-weight: 800;
		color: var(--accent-deep);
		font-family: 'Avenir Next', 'DIN Alternate', sans-serif;
	}

	.feature-action {
		padding: 10rpx 18rpx;
		border-radius: 999rpx;
		font-size: 22rpx;
		color: var(--accent-deep);
		background: var(--accent-soft);
	}

	.section-title {
		font-size: 30rpx;
		font-weight: 800;
		color: var(--text-primary);
	}

	.section-tip {
		font-size: 22rpx;
		color: var(--text-muted);
	}

	.podium-list {
		display: flex;
		justify-content: space-between;
		margin-top: 24rpx;
	}

	.podium-card {
		box-sizing: border-box;
		width: 48%;
		padding: 24rpx;
		border-radius: 28rpx;
		background: var(--card-bg);

		&:active {
			transform: scale(0.99);
		}
	}

	.podium-2 {
		background: linear-gradient(180deg, rgba(243, 245, 250, 0.98), rgba(233, 236, 241, 0.96));
	}

	.podium-3 {
		background: linear-gradient(180deg, rgba(255, 246, 236, 0.98), rgba(243, 230, 218, 0.96));
	}

	.rank-container.dark-mode {
		.podium-2 {
			background: linear-gradient(180deg, rgba(40, 42, 48, 0.98), rgba(29, 31, 35, 0.96));
		}

		.podium-3 {
			background: linear-gradient(180deg, rgba(52, 39, 32, 0.98), rgba(42, 31, 26, 0.96));
		}
	}

	.podium-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.podium-rank {
		padding: 8rpx 16rpx;
		border-radius: 999rpx;
		font-size: 20rpx;
		font-weight: 700;
		color: var(--accent-deep);
		background: rgba(255, 255, 255, 0.66);
	}

	.podium-name {
		margin-top: 18rpx;
		font-size: 28rpx;
		font-weight: 700;
		line-height: 1.45;
		color: var(--text-primary);
	}

	.podium-author {
		margin-top: 10rpx;
		font-size: 22rpx;
		color: var(--text-secondary);
	}

	.podium-score {
		margin-top: 22rpx;
		font-size: 40rpx;
		font-weight: 800;
		line-height: 1;
		color: var(--accent-deep);
		font-family: 'Avenir Next', 'DIN Alternate', sans-serif;
	}

	.rank-list {
		margin-top: 16rpx;
	}

	.rank-item {
		display: flex;
		align-items: center;
		margin-top: 18rpx;
		padding: 22rpx;
		border-radius: 26rpx;
		background: var(--card-bg);

		&:active {
			transform: scale(0.995);
		}
	}

	.rank-index {
		width: 68rpx;
		height: 68rpx;
		line-height: 68rpx;
		margin-right: 20rpx;
		border-radius: 20rpx;
		text-align: center;
		font-size: 28rpx;
		font-weight: 800;
		color: var(--accent-deep);
		background: var(--accent-soft);
	}

	.book-cover-box {
		width: 122rpx;
		height: 162rpx;
		border-radius: 20rpx;
		margin-right: 20rpx;
		box-shadow: 0 8rpx 24rpx rgba(61, 33, 18, 0.12);
	}

	.book-name {
		font-size: 30rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.score-pill {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		margin-left: 18rpx;
		padding: 14rpx 18rpx;
		border-radius: 22rpx;
		background: var(--accent-soft);
	}

	.score-pill-value {
		margin-top: 6rpx;
		font-size: 30rpx;
		font-weight: 800;
		color: var(--accent-deep);
		font-family: 'Avenir Next', 'DIN Alternate', sans-serif;
	}

	.loading-state,
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 120rpx 40rpx;
		text-align: center;
	}

	.state-icon {
		width: 112rpx;
		height: 112rpx;
		margin-bottom: 20rpx;
	}

	.empty-icon {
		font-size: 72rpx;
		line-height: 1;
		margin-bottom: 20rpx;
	}

	.state-title {
		font-size: 32rpx;
		font-weight: 800;
		color: var(--text-primary);
	}

	.state-desc {
		margin-top: 14rpx;
		font-size: 24rpx;
		line-height: 1.6;
		color: var(--text-muted);
	}
</style>
