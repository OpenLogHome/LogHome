<template>
	<view class="statistics-container" v-dark>
		<!-- 骨架屏 -->
		<view class="skeleton" v-if="loading">
			<view class="skeleton-block skeleton-title"></view>
			<view class="skeleton-block skeleton-chip-row"></view>
			<view class="skeleton-block skeleton-value"></view>
			<view class="skeleton-block skeleton-chart"></view>
		</view>

		<!-- 空状态 -->
		<view class="empty-state" v-else-if="!stats.length">
			<view class="empty-title">{{ $t('writer.work.stats.noData') }}</view>
			<view class="empty-subtitle">{{ $t('writer.work.stats.noDataHint') }}</view>
		</view>

		<view class="stats-body" v-else>
			<!-- 指标切换 -->
			<view class="metric-tabs">
				<scroll-view scroll-x class="tabs-scroll">
					<view class="tabs-row">
						<view class="tab-item" v-for="m in metrics" :key="m.key"
							:class="{ active: activeMetric === m.key }"
							:style="activeMetric === m.key ? { color: m.color, borderColor: m.color } : {}"
							@click="activeMetric = m.key">
							{{ $t(m.labelKey) }}
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 当前指标核心数据 -->
			<view class="core-card">
				<view class="core-main">
					<text class="core-value">{{ activeInfo.totalText }}</text>
					<text class="core-label">{{ $t('writer.work.stats.cumulative') }}</text>
				</view>
				<view class="core-change" :class="activeInfo.changeClass" v-if="activeInfo.changeText">
					{{ activeInfo.changeText }}
				</view>
			</view>

			<!-- 时间范围切换 -->
			<view class="range-tabs">
				<view class="range-item" v-for="r in ranges" :key="r.value"
					:class="{ active: range === r.value }" @click="range = r.value">
					{{ $t(r.labelKey) }}
				</view>
			</view>

			<!-- 趋势图 -->
			<view class="trend-section">
				<view class="trend-title">
					<text>{{ activeInfo.label }} · {{ $t('writer.work.stats.dailyNew') }}</text>
					<text class="trend-subtitle">{{ $t('writer.work.stats.realtimeHint') }}</text>
				</view>
				<view class="chart-empty" v-if="!activeInfo.hasTrendData">
					<text>{{ $t('writer.work.stats.noTrendData') }}</text>
				</view>
				<view class="chart-container" v-else>
					<canvas canvas-id="trendChart" id="trendChart" class="charts"></canvas>
				</view>
				<view class="insight" v-if="activeInfo.insightText">
					<text>{{ activeInfo.insightText }}</text>
				</view>
			</view>

			<!-- 近期更新，用于对照更新后的数据变化 -->
			<view class="events-section" v-if="events.length">
				<view class="trend-title">
					<text>{{ $t('writer.work.stats.recentUpdates') }}</text>
				</view>
				<view class="event-item" v-for="ev in events" :key="ev.article_id">
					<text class="event-date">{{ eventDate(ev) }}</text>
					<text class="event-title">{{ eventTitle(ev) }}</text>
				</view>
			</view>

			<!-- 扩展数据区块（数据盒第二梯队） -->
			<view v-if="overview">
				<!-- 原木力透视 -->
				<view class="ov-section">
					<view class="section-title">
						<text>{{ $t('writer.work.stats.powerTitle') }}</text>
						<text class="section-subtitle">{{ $t('writer.work.stats.powerHint') }}</text>
					</view>
					<view class="power-value">{{ formatNumber(overview.logpower.value) }}</view>
					<view class="power-spark" v-if="powerHistory.length > 1">
						<view class="spark-col" v-for="(h, i) in powerHistory" :key="i">
							<view class="spark-bar" :style="{ height: powerBarHeight(h.value) }"></view>
						</view>
					</view>
					<view class="power-history-hint" v-if="powerHistory.length > 1">{{ $t('writer.work.stats.powerTrend') }}</view>
					<view class="bar-row" v-for="b in powerBars" :key="b.labelKey">
						<text class="bar-label">{{ $t(b.labelKey) }}</text>
						<view class="bar-track">
							<view class="bar-fill" :style="{ width: b.percent + '%' }"></view>
						</view>
						<text class="bar-value">{{ formatNumber(b.value) }}</text>
					</view>
				</view>

				<!-- 转化漏斗 -->
				<view class="ov-section">
					<view class="section-title">
						<text>{{ $t('writer.work.stats.funnelTitle') }}</text>
					</view>
					<view class="chart-empty" v-if="!funnelBars.length">
						<text>{{ $t('writer.work.stats.funnelEmpty') }}</text>
					</view>
					<view v-else>
						<view v-for="f in funnelBars" :key="f.labelKey">
							<view class="bar-row">
								<text class="bar-label">{{ $t(f.labelKey) }}</text>
								<view class="bar-track">
									<view class="bar-fill funnel-fill" :style="{ width: f.percent + '%' }"></view>
								</view>
								<text class="bar-value">{{ f.rateText }}</text>
							</view>
							<view class="bench-row" v-if="f.benchText">
								<text class="bench-compare" :class="f.compareClass">{{ f.compareText }}</text>
								<text class="bench-avg">{{ f.benchText }}</text>
							</view>
							<view class="bench-row" v-if="f.pctText">
								<text class="bench-avg">{{ f.pctText }}</text>
							</view>
						</view>
						<view class="bench-row" v-if="percentileSample">
							<text class="bench-avg">{{ percentileSample }}</text>
						</view>
					</view>
				</view>

				<!-- 写作数据 -->
				<view class="ov-section">
					<view class="section-title">
						<text>{{ $t('writer.work.stats.writingTitle') }}</text>
					</view>
					<view class="writing-grid">
						<view class="writing-cell" v-for="w in writingGrid" :key="w.labelKey">
							<text class="writing-value">{{ w.value }}</text>
							<text class="writing-label">{{ $t(w.labelKey) }}</text>
						</view>
					</view>
				</view>

				<!-- 章节阅读排行 -->
				<view class="ov-section">
					<view class="section-title">
						<text>{{ $t('writer.work.stats.chapterTitle') }}</text>
						<text class="section-subtitle">{{ $t('writer.work.stats.chapterRecent') }}</text>
					</view>
					<view class="chart-empty" v-if="!chapterRanking.length">
						<text>{{ $t('writer.work.stats.chapterEmpty') }}</text>
					</view>
					<view v-else>
						<view class="chapter-row" v-for="c in chapterRanking" :key="c.article_id">
							<view class="bar-row">
								<text class="bar-label chapter-label">{{ chapterLabel(c) }}</text>
								<view class="bar-track">
									<view class="bar-fill chapter-fill" :style="{ width: c.percent + '%' }"></view>
								</view>
								<text class="bar-value">{{ formatNumber(c.reads) }}</text>
							</view>
							<view class="chapter-meta" v-if="c.completionRateText">
								<text>{{ c.completionRateText }}</text>
							</view>
						</view>
						<view class="retention-row" v-if="chapterRanking[0] && chapterRanking[0].retentionText">
							<text>{{ chapterRanking[0].retentionText }}</text>
						</view>
						<view class="drop-hint" v-if="chapterDropHint">
							<text>{{ chapterDropHint }}</text>
						</view>
					</view>
				</view>

				<!-- 打赏榜 -->
				<view class="ov-section">
					<view class="section-title">
						<text>{{ $t('writer.work.stats.supporterTitle') }}</text>
					</view>
					<view class="chart-empty" v-if="!overview.topSupporters.length">
						<text>{{ $t('writer.work.stats.supporterEmpty') }}</text>
					</view>
					<view class="supporter-item" v-for="(s, i) in overview.topSupporters" :key="s.user_id">
						<image class="supporter-avatar" :src="s.avatar_url || ''" mode="aspectFill"></image>
						<text class="supporter-name">{{ s.name }}</text>
						<text class="supporter-value">{{ formatNumber(s.value) }}</text>
						<view class="thank-btn" :class="{ done: thankedIds.indexOf(s.user_id) >= 0 }" @click.stop="thankSupporter(s)">
							{{ thankedIds.indexOf(s.user_id) >= 0 ? $t('writer.work.stats.thankDone') : $t('writer.work.stats.thankBtn') }}
						</view>
					</view>
				</view>

				<!-- 读者画像 -->
				<view class="ov-section" v-if="overview.audience.length">
					<view class="section-title">
						<text>{{ $t('writer.work.stats.audienceTitle') }}</text>
						<text class="section-subtitle">{{ $t('writer.work.stats.audienceHint') }}</text>
					</view>
					<scroll-view scroll-x class="audience-scroll">
						<view class="audience-row">
							<view class="audience-item" v-for="a in overview.audience" :key="a.novel_id">
								<image class="audience-cover" :src="a.picUrl || ''" mode="aspectFill"></image>
								<text class="audience-name">{{ a.name }}</text>
								<text class="audience-count">{{ formatNumber(a.count) }}</text>
							</view>
						</view>
					</scroll-view>
				</view>

				<!-- 数据来源 -->
				<view class="ov-section">
					<view class="section-title">
						<text>{{ $t('writer.work.stats.sourceTitle') }}</text>
					</view>
					<view class="source-row">
						<text class="source-label">{{ $t('writer.work.stats.sourceExternal') }}</text>
						<text class="source-value">{{ formatNumber(overview.sources.externalTotal) }}</text>
						<text class="source-recent">{{ $t('writer.work.stats.sourceExternalRecent') }} {{ formatNumber(overview.sources.external30d) }}</text>
					</view>
					<view v-if="overview.sources.internal && overview.sources.internal.length">
						<view class="source-subtitle">{{ $t('writer.work.stats.sourceInternal') }}</view>
						<view class="bar-row" v-for="s in internalSources" :key="s.source">
							<text class="bar-label">{{ sourceLabel(s.source) }}</text>
							<view class="bar-track">
								<view class="bar-fill source-fill" :style="{ width: s.percent + '%' }"></view>
							</view>
							<text class="bar-value">{{ formatNumber(s.recent) }}</text>
						</view>
					</view>
				</view>

				<!-- 成就里程碑 -->
				<view class="ov-section">
					<view class="section-title">
						<text>{{ $t('writer.work.stats.milestoneTitle') }}</text>
					</view>
					<view class="chart-empty" v-if="!milestoneChips.length">
						<text>{{ $t('writer.work.stats.milestoneEmpty') }}</text>
					</view>
					<view class="milestone-row" v-else>
						<view class="milestone-chip" v-for="(m, i) in milestoneChips" :key="i">
							<text>{{ m.text }}</text>
						</view>
					</view>
					<view class="milestone-actions" v-if="milestoneChips.length">
						<view class="milestone-action" @click="shareMilestones">{{ $t('writer.work.stats.milestoneShareFriend') }}</view>
						<view class="milestone-action primary" @click="shareToCommunity">{{ $t('writer.work.stats.milestoneShareCommunity') }}</view>
					</view>
				</view>

				<!-- 目标与提醒 -->
				<view class="ov-section">
					<view class="section-title">
						<text>{{ $t('writer.work.stats.goalTitle') }}</text>
						<text class="section-subtitle">{{ $t('writer.work.stats.goalHint') }}</text>
					</view>
					<view class="goal-row" v-for="g in goalRows" :key="g.type">
						<view class="goal-head">
							<text class="goal-label">{{ $t(g.labelKey) }}</text>
							<text class="goal-value">{{ formatNumber(g.current) }} / {{ formatNumber(g.target) }}</text>
						</view>
						<view class="goal-track">
							<view class="goal-fill" :class="{ done: g.set && g.progress >= 100 }" :style="{ width: (g.set ? g.progress : 0) + '%' }"></view>
						</view>
						<view class="goal-edit" :class="{ primary: !g.set }" @click="editGoal(g)">
							{{ g.set ? $t('writer.work.stats.goalEdit') : $t('writer.work.stats.goalSet') }}
						</view>
					</view>
				</view>

				<!-- 数据导出 -->
				<view class="ov-section">
					<view class="section-title">
						<text>{{ $t('writer.work.stats.exportTitle') }}</text>
						<text class="section-subtitle">{{ $t('writer.work.stats.exportHint') }}</text>
					</view>
					<view class="export-actions">
						<view class="milestone-action" @click="exportCsv(30)">{{ $t('writer.work.stats.export30') }}</view>
						<view class="milestone-action primary" @click="exportCsv(90)">{{ $t('writer.work.stats.export90') }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import axios from 'axios'
import uCharts from '@/uni_modules/qiun-data-charts/js_sdk/u-charts/u-charts.js'
var trendChartInstance = null;

export default {
	name: 'NovelStatistics',
	data() {
		return {
			novel_id: -1,
			loading: true,
			stats: [],
			events: [],
			overview: null,
			thankedIds: [],
			goals: [],
			activeMetric: 'views',
			range: 30,
			metrics: [
				{ key: 'views', field: 'clicks', labelKey: 'writer.work.stats.views', color: '#ea7034' },
				{ key: 'likes', field: 'nices', labelKey: 'writer.work.stats.likes', color: '#ff6b6b' },
				{ key: 'favorites', field: 'likes', labelKey: 'common.favorite', color: '#ffd93d' },
				{ key: 'comments', field: 'comments', labelKey: 'writer.work.stats.comments', color: '#6c5ce7' },
				{ key: 'shares', field: 'shares', labelKey: 'common.share', color: '#74b9ff' },
				{ key: 'tips', field: 'tippings', labelKey: 'writer.work.stats.tips', color: '#a8e6cf' }
			],
			ranges: [
				{ value: 7, labelKey: 'writer.work.stats.range7' },
				{ value: 30, labelKey: 'writer.work.stats.range30' },
				{ value: 90, labelKey: 'writer.work.stats.range90' }
			]
		}
	},
	computed: {
		chartFontColor() {
			return this.$store.state.isDarkMode ? '#b8b8b8' : '#666666'
		},
		chartGridColor() {
			return this.$store.state.isDarkMode ? '#4b4b4b' : '#cccccc'
		},
		activeInfo() {
			const def = this.metrics.find(m => m.key === this.activeMetric) || this.metrics[0];
			const stats = this.stats;
			const field = def.field;
			const latest = stats.length ? stats[stats.length - 1] : {};
			const total = Number(latest[field]) || 0;

			// 日增量序列：range 天窗口 + 之前一行作为基线
			const windowRows = stats.slice(Math.max(0, stats.length - (this.range + 1)));
			const increments = [];
			for (let i = 1; i < windowRows.length; i++) {
				const diff = (Number(windowRows[i][field]) || 0) - (Number(windowRows[i - 1][field]) || 0);
				increments.push(Math.max(0, diff));
			}
			const categories = windowRows.slice(1).map(row => this.dateLabel(row.statistic_date));

			// 今日新增
			let changeClass = '';
			let changeText = '';
			if (increments.length) {
				const today = increments[increments.length - 1];
				if (today > 0) {
					changeClass = 'up';
					changeText = this.$t('writer.work.stats.todayUp', { count: this.formatNumber(today) });
				} else {
					changeClass = 'flat';
					changeText = this.$t('writer.work.stats.todayFlat');
				}
			}

			// 洞察：本窗口日均 vs 上一同长度窗口日均
			let insightText = '';
			const currentWindow = increments.slice(-this.range);
			const previousWindow = increments.slice(0, Math.max(0, increments.length - this.range)).slice(-this.range);
			if (currentWindow.length) {
				const curAvg = Math.round(currentWindow.reduce((s, v) => s + v, 0) / currentWindow.length);
				const baseParams = { n: this.range, avg: this.formatNumber(curAvg) };
				if (previousWindow.length >= Math.min(this.range, 3)) {
					const prevAvg = previousWindow.reduce((s, v) => s + v, 0) / previousWindow.length;
					if (prevAvg > 0) {
						const percent = Math.round(((curAvg - prevAvg) / prevAvg) * 100);
						if (percent > 0) {
							insightText = this.$t('writer.work.stats.insightUp', Object.assign({ percent }, baseParams));
						} else if (percent < 0) {
							insightText = this.$t('writer.work.stats.insightDown', Object.assign({ percent: Math.abs(percent) }, baseParams));
						} else {
							insightText = this.$t('writer.work.stats.insightFlat', baseParams);
						}
					} else {
						insightText = this.$t('writer.work.stats.insightAvg', baseParams);
					}
				} else {
					insightText = this.$t('writer.work.stats.insightAvg', baseParams);
				}
			}

			return {
				label: this.$t(def.labelKey),
				color: def.color,
				totalText: this.formatNumber(total),
				changeClass,
				changeText,
				increments,
				categories,
				hasTrendData: increments.some(v => v > 0),
				insightText
			};
		},
		powerBars() {
			if (!this.overview || !this.overview.logpower) return [];
			const comp = this.overview.logpower.composition || [];
			const keyMap = {
				clicks: 'powerRead',
				nices: 'powerLike',
				bookcase: 'powerFav',
				comments: 'powerComment',
				tips: 'powerTip'
			};
			const max = Math.max.apply(null, comp.map(c => Number(c.value) || 0).concat([1]));
			return comp.map(c => ({
				labelKey: 'writer.work.stats.' + (keyMap[c.key] || 'powerRead'),
				value: Number(c.value) || 0,
				percent: max > 0 ? Math.round(((Number(c.value) || 0) / max) * 100) : 0
			}));
		},
		powerHistory() {
			return (this.overview && this.overview.logpower && this.overview.logpower.history) || [];
		},
		funnelBars() {
			if (!this.overview || !this.overview.funnel) return [];
			const f = this.overview.funnel;
			const rows = [
				{ labelKey: 'writer.work.stats.funnelLikeRate', field: 'likeRate', rate: Number(f.likeRate) || 0 },
				{ labelKey: 'writer.work.stats.funnelFavRate', field: 'favRate', rate: Number(f.favRate) || 0 },
				{ labelKey: 'writer.work.stats.funnelCommentRate', field: 'commentRate', rate: Number(f.commentRate) || 0 }
			];
			const max = Math.max.apply(null, rows.map(r => r.rate).concat([0.0001]));
			if (max <= 0) return [];
			const bench = f.benchmark || null;
			return rows.map(r => {
				const row = {
					labelKey: r.labelKey,
					rateText: (r.rate * 100).toFixed(1) + '%',
					percent: Math.round((r.rate / max) * 100)
				};
				if (bench) {
					const bv = Number(bench[r.field]) || 0;
					if (bv > 0) {
						row.benchText = this.$t('writer.work.stats.funnelBench', { value: (bv * 100).toFixed(1) + '%' });
						const ratio = r.rate / bv;
						if (ratio >= 1.15) {
							row.compareText = this.$t('writer.work.stats.funnelAbove');
							row.compareClass = 'up';
						} else if (ratio <= 0.85) {
							row.compareText = this.$t('writer.work.stats.funnelBelow');
							row.compareClass = 'down';
						} else {
							row.compareText = this.$t('writer.work.stats.funnelNear');
							row.compareClass = 'flat';
						}
					}
				}
				const pct = f.percentile || null;
				if (pct && pct[r.field] != null) {
					row.pctText = this.$t('writer.work.stats.funnelPct', { pct: pct[r.field] });
				}
				return row;
			});
		},
		percentileSample() {
			const pct = this.overview && this.overview.funnel && this.overview.funnel.percentile;
			if (!pct || !(Number(pct.sampleSize) > 0)) return '';
			return this.$t('writer.work.stats.funnelPctSample', { n: pct.sampleSize });
		},
		writingGrid() {
			const w = (this.overview && this.overview.writing) || {};
			return [
				{ labelKey: 'writer.work.stats.totalWords', value: this.formatNumber(w.total_words) },
				{ labelKey: 'writer.work.stats.avgDailyWords', value: this.formatNumber(w.avg_daily_words) },
				{ labelKey: 'writer.work.stats.updateDays', value: String(Number(w.update_days_30) || 0) },
				{ labelKey: 'writer.work.stats.serialDays', value: String(Number(w.serial_days) || 0) }
			];
		},
		chapterRanking() {
			const chapters = (this.overview && this.overview.chapters) || [];
			if (!chapters.length) return [];
			const maxReads = Math.max.apply(null, chapters.map(c => Number(c.reads) || 0).concat([1]));
			const sorted = chapters.slice().sort((a, b) => (Number(b.reads) || 0) - (Number(a.reads) || 0));
			return sorted.slice(0, 10).map((c, i) => {
				const reads = Number(c.reads) || 0;
				const completionRate = c.completionRate != null ? Number(c.completionRate) : null;
				return {
					article_id: c.article_id,
					chapter: c.chapter,
					title: c.title,
					reads,
					percent: maxReads > 0 ? Math.round((reads / maxReads) * 100) : 0,
					retentionText: reads > 0
						? this.$t(
							i === 0 ? 'writer.work.stats.chapterTop' : 'writer.work.stats.chapterRetention',
							i === 0 ? { chapter: c.chapter } : { chapter: c.chapter, percent: Math.round((reads / maxReads) * 100) }
						)
						: '',
					completionRateText: completionRate != null
						? this.$t('writer.work.stats.chapterCompletion', { percent: Math.round(completionRate * 100) })
						: ''
				};
			});
		},
		chapterDropHint() {
			const chapters = (this.overview && this.overview.chapters) || [];
			if (chapters.length < 2) return '';
			const asc = chapters.slice().sort((a, b) => (Number(a.chapter) || 0) - (Number(b.chapter) || 0));
			let best = null;
			for (let i = 0; i < asc.length - 1; i++) {
				const prev = Number(asc[i].reads) || 0;
				const cur = Number(asc[i + 1].reads) || 0;
				if (prev <= 0) continue;
				const drop = prev - cur;
				if (drop > 0 && drop / prev >= 0.3) {
					if (!best || drop / prev > best.ratio) {
						best = { from: asc[i].chapter, to: asc[i + 1].chapter, ratio: drop / prev };
					}
				}
			}
			return best ? this.$t('writer.work.stats.chapterDropHint', { from: best.from, to: best.to }) : '';
		},
		milestoneChips() {
			const list = (this.overview && this.overview.milestones) || [];
			const keyMap = {
				fav: 'milestoneFav',
				read: 'milestoneRead',
				like: 'milestoneLike',
				comment: 'milestoneComment',
				tip: 'milestoneTip'
			};
			return list
				.filter(m => keyMap[m.type])
				.sort((a, b) => (Number(a.value) || 0) - (Number(b.value) || 0))
				.map(m => ({
					text: this.$t('writer.work.stats.' + keyMap[m.type], { value: this.formatNumber(m.value) })
				}));
		},
		internalSources() {
			const list = (this.overview && this.overview.sources && this.overview.sources.internal) || [];
			if (!list.length) return [];
			const sorted = list.slice().sort((a, b) => (Number(b.recent) || 0) - (Number(a.recent) || 0));
			const max = Math.max.apply(null, sorted.map(s => Number(s.recent) || 0).concat([1]));
			return sorted.map(s => ({
				source: s.source,
				recent: Number(s.recent) || 0,
				percent: max > 0 ? Math.round(((Number(s.recent) || 0) / max) * 100) : 0
			}));
		},
		goalRows() {
			const defs = [
				{ type: 'daily_words', labelKey: 'writer.work.stats.goalDaily' },
				{ type: 'monthly_words', labelKey: 'writer.work.stats.goalMonthly' },
				{ type: 'clicks', labelKey: 'writer.work.stats.goalClicks' }
			];
			return defs.map((def) => {
				const goal = (this.goals || []).find((g) => g.goal_type === def.type) || {};
				const target = Number(goal.target_value) || 0;
				const current = Number(goal.current_value) || 0;
				return {
					type: def.type,
					labelKey: def.labelKey,
					target,
					current,
					set: target > 0,
					progress: target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0
				};
			});
		}
	},
	watch: {
		activeMetric() {
			this.drawChart();
		},
		range() {
			this.drawChart();
		}
	},
	methods: {
		formatNumber(value) {
			let n = Number(value) || 0;
			if (!Number.isInteger(n)) n = Math.round(n * 100) / 100;
			const locale = (this.$i18n && this.$i18n.locale) || 'zh-CN';
			const abs = Math.abs(n);
			if (locale.indexOf('zh') === 0) {
				if (abs >= 100000000) return (n / 100000000).toFixed(1).replace(/\.0$/, '') + '亿';
				if (abs >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, '') + '万';
			} else {
				if (abs >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
				if (abs >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
			}
			return String(n);
		},
		dateLabel(dateLike) {
			// 直接使用后端返回的真实日期，避免标签与数据错位
			return String(dateLike || '').slice(5, 10);
		},
		eventDate(ev) {
			return String(ev.update_time || '').slice(5, 10);
		},
		eventTitle(ev) {
			const chapter = ev.article_chapter ? this.$t('writer.work.stats.eventChapter', { chapter: ev.article_chapter }) + ' ' : '';
			return chapter + (ev.title || '');
		},
		chapterLabel(c) {
			return this.$t('writer.work.stats.eventChapter', { chapter: c.chapter });
		},
		sourceLabel(source) {
			const keyMap = {
				library: 'sourceLibrary',
				search: 'sourceSearch',
				community: 'sourceCommunity',
				chat: 'sourceCommunity',
				post: 'sourceCommunity',
				bookcase: 'sourceBookcase',
				rank: 'sourceRank',
				personal: 'sourcePersonal',
				bookshelf: 'sourceBookshelf',
				detail: 'sourceDetail',
				works: 'sourceWorks',
				world: 'sourceWorld',
				webview: 'sourceWebview',
				reader: 'sourceReader',
				other: 'sourceOther'
			};
			const key = keyMap[String(source || '')] || 'sourceOther';
			return this.$t('writer.work.stats.' + key);
		},
		authHeaders() {
			let tk = null;
			try {
				const tokenObj = JSON.parse(window.localStorage.getItem('token'));
				tk = tokenObj ? tokenObj.tk : null;
			} catch (e) {
				tk = null;
			}
			return {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + tk
			};
		},
		async fetchGoals() {
			try {
				const res = await axios.get(
					this.$baseUrl + '/articles/get_author_goals?novel_id=' + this.novel_id,
					{ headers: this.authHeaders() }
				);
				this.goals = (res.data && Array.isArray(res.data.goals)) ? res.data.goals : [];
			} catch (error) {
				console.error(error)
				this.goals = [];
			}
		},
		async editGoal(g) {
			const typeLabel = this.$t(g.labelKey);
			const res = await new Promise((resolve) => {
				uni.showModal({
					title: this.$t('writer.work.stats.goalSetTitle', { type: typeLabel }),
					content: this.$t('writer.work.stats.goalSetPrompt'),
					editable: true,
					placeholderText: g.set ? String(g.target) : '',
					success: (r) => resolve(r),
					fail: () => resolve(null)
				});
			});
			if (!res || !res.confirm) return;
			const raw = String(res.content || '').trim();
			const value = Number(raw);
			if (!raw || !Number.isFinite(value) || value < 1) {
				uni.showToast({ title: this.$t('writer.work.stats.goalInvalid'), icon: 'none' });
				return;
			}
			try {
				const resp = await axios.post(
					this.$baseUrl + '/articles/set_author_goal',
					{ novel_id: this.novel_id, goal_type: g.type, target_value: Math.round(value) },
					{ headers: this.authHeaders() }
				);
				if (resp.data && resp.data.success) {
					uni.showToast({ title: this.$t('writer.work.stats.goalSaved'), icon: 'none' });
					this.fetchGoals();
				} else {
					uni.showToast({ title: (resp.data && resp.data.msg) || this.$t('writer.work.stats.goalFailed'), icon: 'none' });
				}
			} catch (error) {
				console.error(error)
				uni.showToast({ title: this.$t('writer.work.stats.goalFailed'), icon: 'none' });
			}
		},
		async exportCsv(days) {
			try {
				const resp = await axios.get(
					this.$baseUrl + '/articles/export_novel_statistics?novel_id=' + this.novel_id + '&days=' + days,
					{ headers: this.authHeaders(), responseType: 'blob' }
				);
				const blob = resp.data;
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'novel_' + this.novel_id + '_stats_' + days + 'd.csv';
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				window.URL.revokeObjectURL(url);
			} catch (error) {
				console.error(error)
				uni.showToast({ title: this.$t('writer.work.stats.exportFailed'), icon: 'none' });
			}
		},
		powerBarHeight(value) {
			const max = Math.max.apply(null, this.powerHistory.map(h => Number(h.value) || 0).concat([1]));
			if (max <= 0) return '15%';
			return Math.max(15, Math.round(((Number(value) || 0) / max) * 100)) + '%';
		},
		async thankSupporter(s) {
			if (this.thankedIds.indexOf(s.user_id) >= 0) return;
			const confirmed = await new Promise((resolve) => {
				uni.showModal({
					title: this.$t('writer.work.stats.thankTitle'),
					content: this.$t('writer.work.stats.thankConfirm', { name: s.name }),
					success: (r) => resolve(!!r.confirm),
					fail: () => resolve(false)
				});
			});
			if (!confirmed) return;
			try {
				const res = await axios.post(this.$baseUrl + '/articles/thank_supporter', {
					novel_id: this.novel_id,
					user_id: s.user_id
				}, { headers: this.authHeaders() });
				if (res.data && (res.data.success || res.data.repeated)) {
					uni.showToast({
						title: this.$t(res.data.repeated ? 'writer.work.stats.thankRepeated' : 'writer.work.stats.thankSent'),
						icon: 'none'
					});
					this.thankedIds.push(s.user_id);
				} else {
					uni.showToast({
						title: (res.data && res.data.msg) || this.$t('writer.work.stats.thankFailed'),
						icon: 'none'
					});
				}
			} catch (error) {
				console.error(error)
				uni.showToast({ title: this.$t('writer.work.stats.thankFailed'), icon: 'none' });
			}
		},
		milestoneShareParts() {
			const texts = this.milestoneChips.map(m => m.text);
			const name = (this.overview && this.overview.novelName) || '';
			const title = this.$t('writer.work.stats.milestoneShareTitle', { name });
			const content =
				title +
				(texts.length ? '：' + texts.slice(0, 3).join('、') : '') +
				this.$t('writer.work.stats.milestoneShareTail');
			return { title, content };
		},
		async shareMilestones() {
			try {
				const { content } = this.milestoneShareParts();
				const res = await axios.post(this.$baseUrl + '/library/create_share_code', {
					share_type: 'book',
					share_content: content,
					target_url: '/pages/readers/bookInfo?id=' + this.novel_id,
					share_message: content
				}, { headers: this.authHeaders() });
				if (res.data && res.data.share_text) {
					uni.setClipboardData({
						data: res.data.share_text,
						success: () => {
							uni.showModal({
								title: this.$t('writer.work.stats.milestoneShareFriend'),
								content: this.$t('writer.work.stats.milestoneShareCopied'),
								showCancel: false
							});
						},
						fail: () => {
							uni.showToast({ title: this.$t('writer.work.stats.milestoneShareFailed'), icon: 'none' });
						}
					});
				} else {
					uni.showToast({ title: this.$t('writer.work.stats.milestoneShareFailed'), icon: 'none' });
				}
			} catch (error) {
				console.error(error)
				uni.showToast({ title: this.$t('writer.work.stats.milestoneShareFailed'), icon: 'none' });
			}
		},
		shareToCommunity() {
			const { title, content } = this.milestoneShareParts();
			uni.navigateTo({
				url:
					'/pages/community/postEdit?prefill_title=' +
					encodeURIComponent(title) +
					'&prefill_content=' +
					encodeURIComponent(content) +
					'&prefill_novel_id=' +
					this.novel_id
			});
		},
		async fetchOverview() {
			try {
				const res = await axios.get(this.$baseUrl + '/articles/get_novel_data_overview?novel_id=' + this.novel_id)
				this.overview = (res.data && typeof res.data === 'object') ? res.data : null;
			} catch (error) {
				console.error(error)
				this.overview = null;
			}
		},
		async fetchStatistics() {
			try {
				const res = await axios.get(this.$baseUrl + '/articles/get_novel_specific_statistics?novel_id=' + this.novel_id + '&days=90')
				const data = Array.isArray(res.data) ? res.data : [];
				data.sort((a, b) => String(a.statistic_date).localeCompare(String(b.statistic_date)));
				this.stats = data;
				this.loading = false;
				this.drawChart();
			} catch (error) {
				console.error(error)
				this.loading = false;
				uni.showToast({
					title: this.$t('writer.work.stats.loadStatsFailed'),
					icon: 'none'
				})
			}
			this.fetchEvents();
		},
		async fetchEvents() {
			try {
				const res = await axios.get(this.$baseUrl + '/articles/get_novel_article_events?novel_id=' + this.novel_id + '&days=90')
				this.events = Array.isArray(res.data) ? res.data.slice(0, 5) : [];
			} catch (error) {
				console.error(error)
			}
		},
		drawChart() {
			if (!this._ready) return;
			if (!this.activeInfo.hasTrendData) return;
			this.$nextTick(() => {
				const ctx = uni.createCanvasContext('trendChart', this)
				trendChartInstance = new uCharts({
					type: 'column',
					context: ctx,
					width: uni.upx2px(700),
					height: uni.upx2px(500),
					categories: this.activeInfo.categories,
					series: [{
						name: this.activeInfo.label,
						data: this.activeInfo.increments,
						color: this.activeInfo.color
					}],
					padding: [15, 15, 0, 5],
					dataLabel: false,
					legend: { show: false },
					xAxis: {
						disableGrid: true,
						fontColor: this.chartFontColor,
						fontSize: 12,
						labelCount: 6
					},
					yAxis: {
						gridType: 'dash',
						dashLength: 4,
						data: [{ min: 0 }],
						fontColor: this.chartFontColor,
						fontSize: 12,
						format: 'integer'
					},
					extra: {
						column: {
							width: 12,
							activeBgColor: 'rgba(0,0,0,0.06)',
							activeBgOpacity: 1
						},
						tooltip: {
							showBox: true,
							showArrow: false,
							showCategory: true,
							borderWidth: 0,
							borderRadius: 4,
							bgColor: '#000000',
							bgOpacity: 0.7,
							gridType: 'dash',
							dashLength: 4,
							gridColor: this.chartGridColor,
							fontColor: '#FFFFFF'
						}
					}
				});
			});
		}
	},
	onLoad(params) {
		if (params.id) {
			this.novel_id = params.id
			if (params.metric && this.metrics.some(m => m.key === params.metric)) {
				this.activeMetric = params.metric;
			}
			this.fetchStatistics()
			this.fetchOverview()
			this.fetchGoals()
		} else {
			uni.navigateBack()
		}
	},
	onReady() {
		this._ready = true;
		this.drawChart();
	},
	onResize() {
		if (trendChartInstance && trendChartInstance.resize) trendChartInstance.resize()
	}
}
</script>

<style lang="scss" scoped>
.statistics-container {
	padding: 20rpx;
	background-color: var(--background-color-secondary);
	min-height: 100vh;

	.skeleton {
		.skeleton-block {
			background: var(--card-background);
			border-radius: 12rpx;
			margin-bottom: 20rpx;

			.dark-mode & {
				opacity: 0.6;
			}
		}

		.skeleton-title {
			height: 48rpx;
			width: 40%;
		}

		.skeleton-chip-row {
			height: 72rpx;
		}

		.skeleton-value {
			height: 140rpx;
		}

		.skeleton-chart {
			height: 500rpx;
		}
	}

	.empty-state {
		padding: 120rpx 40rpx;
		text-align: center;

		.empty-title {
			font-size: 32rpx;
			color: var(--text-color-primary);
			font-weight: bold;
		}

		.empty-subtitle {
			margin-top: 16rpx;
			font-size: 26rpx;
			color: var(--text-color-secondary);
		}
	}

	.metric-tabs {
		background: var(--card-background);
		border-radius: 12rpx;
		padding: 16rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

		.tabs-scroll {
			white-space: nowrap;
			// scroll-x 的 scroll-view 必须给显式高度，否则在 H5 下会被拉伸
			height: 88rpx;
			max-height: 88rpx;
		}

		.tabs-row {
			display: flex;
			flex-direction: row;
			align-items: center;
			height: 88rpx;
		}

		.tab-item {
			display: inline-block;
			padding: 12rpx 28rpx;
			margin-right: 16rpx;
			border-radius: 32rpx;
			font-size: 26rpx;
			color: var(--text-color-regular);
			background: var(--background-color-secondary);
			border: 2rpx solid transparent;
			flex-shrink: 0;

			&.active {
				font-weight: bold;
			}
		}
	}

	.core-card {
		background: var(--card-background);
		border-radius: 12rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

		.core-main {
			display: flex;
			align-items: baseline;
			gap: 16rpx;

			.core-value {
				font-size: 56rpx;
				font-weight: bold;
				color: var(--text-color-primary);
			}

			.core-label {
				font-size: 24rpx;
				color: var(--text-color-secondary);
			}
		}

		.core-change {
			margin-top: 12rpx;
			font-size: 26rpx;

			&.up {
				color: #20bf6b;
			}

			&.down {
				color: #e74c3c;
			}

			&.flat {
				color: var(--text-color-secondary);
			}
		}
	}

	.range-tabs {
		display: flex;
		justify-content: flex-end;
		gap: 12rpx;
		margin-bottom: 20rpx;

		.range-item {
			padding: 10rpx 28rpx;
			border-radius: 28rpx;
			font-size: 24rpx;
			color: var(--text-color-regular);
			background: var(--card-background);
			box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

			&.active {
				color: #ffffff;
				background: #ea7034;
				font-weight: bold;
			}
		}
	}

	.trend-section {
		background: var(--card-background);
		border-radius: 12rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

		.trend-title {
			font-size: 32rpx;
			color: var(--text-color-primary);
			margin-bottom: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-weight: bold;

			.trend-subtitle {
				font-size: 24rpx;
				color: var(--text-color-secondary);
				font-weight: normal;
			}
		}

		.chart-empty {
			height: 240rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 26rpx;
			color: var(--text-color-secondary);
		}

		.chart-container {
			height: 500rpx;
			width: 100%;
			margin-top: 20rpx;

			.charts {
				width: 100%;
				height: 100%;
			}
		}

		.insight {
			margin-top: 20rpx;
			padding: 16rpx 20rpx;
			border-radius: 8rpx;
			background: var(--background-color-secondary);
			font-size: 24rpx;
			color: var(--text-color-regular);
		}
	}

	.events-section {
		background: var(--card-background);
		border-radius: 12rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

		.trend-title {
			font-size: 32rpx;
			color: var(--text-color-primary);
			margin-bottom: 20rpx;
			font-weight: bold;
		}

		.event-item {
			display: flex;
			align-items: center;
			gap: 20rpx;
			padding: 14rpx 0;
			border-bottom: 2rpx solid var(--border-color-lighter, rgba(0, 0, 0, 0.05));

			&:last-child {
				border-bottom: none;
			}

			.event-date {
				flex-shrink: 0;
				font-size: 24rpx;
				color: var(--text-color-secondary);
			}

			.event-title {
				font-size: 26rpx;
				color: var(--text-color-regular);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}

	// ---- 扩展区块通用样式 ----
	.ov-section {
		background: var(--card-background);
		border-radius: 12rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

		.section-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 32rpx;
			color: var(--text-color-primary);
			font-weight: bold;
			margin-bottom: 24rpx;

			.section-subtitle {
				font-size: 24rpx;
				color: var(--text-color-secondary);
				font-weight: normal;
			}
		}

		.power-value {
			font-size: 56rpx;
			font-weight: bold;
			color: #ea7034;
			margin-bottom: 24rpx;
		}

		.power-spark {
			display: flex;
			flex-direction: row;
			align-items: flex-end;
			height: 120rpx;
			gap: 8rpx;
			padding: 0 4rpx;

			.spark-col {
				flex: 1;
				height: 100%;
				display: flex;
				align-items: flex-end;

				.spark-bar {
					width: 100%;
					min-height: 6rpx;
					border-radius: 4rpx;
					background: linear-gradient(to top, rgba(234, 112, 52, 0.25), #ea7034);
				}
			}
		}

		.power-history-hint {
			margin: 8rpx 0 16rpx;
			font-size: 22rpx;
			color: var(--text-color-secondary);
		}

		.bar-row {
			display: flex;
			align-items: center;
			gap: 16rpx;
			padding: 10rpx 0;

			.bar-label {
				flex-shrink: 0;
				width: 150rpx;
				font-size: 24rpx;
				color: var(--text-color-regular);

				&.chapter-label {
					width: 170rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}

			.bar-track {
				flex: 1;
				height: 16rpx;
				border-radius: 8rpx;
				background: var(--background-color-secondary);
				overflow: hidden;

				.bar-fill {
					height: 100%;
					border-radius: 8rpx;
					background: #ea7034;

					&.funnel-fill {
						background: #6c5ce7;
					}

					&.chapter-fill {
						background: #74b9ff;
					}
				}
			}

			.bar-value {
				flex-shrink: 0;
				width: 130rpx;
				text-align: right;
				font-size: 24rpx;
				color: var(--text-color-secondary);
			}
		}

		.bench-row {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 4rpx 0 10rpx 166rpx;
			font-size: 22rpx;

			.bench-compare {
				&.up {
					color: #20bf6b;
				}

				&.down {
					color: #e74c3c;
				}

				&.flat {
					color: var(--text-color-secondary);
				}
			}

			.bench-avg {
				color: var(--text-color-secondary);
			}
		}

		.chart-empty {
			height: 160rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 26rpx;
			color: var(--text-color-secondary);
		}

		.writing-grid {
			display: flex;
			flex-wrap: wrap;
			gap: 20rpx;

			.writing-cell {
				width: calc(50% - 10rpx);
				box-sizing: border-box;
				background: var(--background-color-secondary);
				border-radius: 12rpx;
				padding: 24rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 8rpx;

				.writing-value {
					font-size: 40rpx;
					font-weight: bold;
					color: var(--text-color-primary);
				}

				.writing-label {
					font-size: 22rpx;
					color: var(--text-color-secondary);
				}
			}
		}

		.retention-row {
			margin-top: 16rpx;
			padding: 14rpx 20rpx;
			border-radius: 8rpx;
			background: var(--background-color-secondary);
			font-size: 24rpx;
			color: var(--text-color-regular);
		}

		.drop-hint {
			margin-top: 12rpx;
			padding: 14rpx 20rpx;
			border-radius: 8rpx;
			background: rgba(231, 76, 60, 0.08);
			font-size: 24rpx;
			color: #e74c3c;
		}

		.supporter-item {
			display: flex;
			align-items: center;
			gap: 20rpx;
			padding: 14rpx 0;
			border-bottom: 2rpx solid var(--border-color-lighter, rgba(0, 0, 0, 0.05));

			&:last-child {
				border-bottom: none;
			}

			.supporter-avatar {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				background: var(--background-color-secondary);
				flex-shrink: 0;
			}

			.supporter-name {
				flex: 1;
				font-size: 26rpx;
				color: var(--text-color-regular);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.supporter-value {
				font-size: 26rpx;
				font-weight: bold;
				color: #ea7034;
			}

			.thank-btn {
				flex-shrink: 0;
				padding: 8rpx 22rpx;
				border-radius: 28rpx;
				font-size: 22rpx;
				color: #ea7034;
				border: 2rpx solid #ea7034;
				background: transparent;

				&.done {
					color: var(--text-color-secondary);
					border-color: var(--border-color-lighter, rgba(0, 0, 0, 0.1));
				}
			}
		}

		.audience-scroll {
			white-space: nowrap;
			height: 220rpx;
			max-height: 220rpx;
		}

		.audience-row {
			display: flex;
			flex-direction: row;
			align-items: flex-start;
			height: 220rpx;
		}

		.audience-item {
			display: inline-flex;
			flex-direction: column;
			align-items: center;
			width: 140rpx;
			margin-right: 24rpx;
			flex-shrink: 0;

			.audience-cover {
				width: 120rpx;
				height: 150rpx;
				border-radius: 8rpx;
				background: var(--background-color-secondary);
			}

			.audience-name {
				margin-top: 8rpx;
				font-size: 22rpx;
				color: var(--text-color-regular);
				max-width: 140rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.audience-count {
				font-size: 20rpx;
				color: var(--text-color-secondary);
			}
		}

		.source-row {
			display: flex;
			align-items: center;
			gap: 16rpx;
			padding: 10rpx 0;

			.source-label {
				font-size: 26rpx;
				color: var(--text-color-regular);
			}

			.source-value {
				font-size: 26rpx;
				font-weight: bold;
				color: var(--text-color-primary);
			}

			.source-recent {
				margin-left: auto;
				font-size: 22rpx;
				color: var(--text-color-secondary);
			}
		}

		.source-subtitle {
			margin: 16rpx 0 8rpx;
			font-size: 24rpx;
			color: var(--text-color-secondary);
		}

		.source-fill {
			background: #ffd93d !important;
		}

		.chapter-row {
			.chapter-meta {
				margin-top: -4rpx;
				padding: 0 0 8rpx 166rpx;
				font-size: 22rpx;
				color: var(--text-color-secondary);
			}
		}

		.goal-row {
			margin-bottom: 20rpx;

			.goal-head {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 8rpx;

				.goal-label {
					font-size: 26rpx;
					color: var(--text-color-regular);
				}

				.goal-value {
					font-size: 26rpx;
					font-weight: bold;
					color: var(--text-color-primary);
				}
			}

			.goal-track {
				height: 16rpx;
				border-radius: 8rpx;
				background: var(--background-color-secondary);
				overflow: hidden;

				.goal-fill {
					height: 100%;
					border-radius: 8rpx;
					background: #ea7034;
					transition: width 0.3s ease;

					&.done {
						background: #20bf6b;
					}
				}
			}

			.goal-edit {
				margin-top: 10rpx;
				display: inline-block;
				padding: 8rpx 28rpx;
				border-radius: 28rpx;
				font-size: 24rpx;
				color: var(--text-color-regular);
				background: var(--background-color-secondary);

				&.primary {
					color: #ffffff;
					background: #ea7034;
				}
			}
		}

		.export-actions {
			display: flex;
			gap: 16rpx;

			.milestone-action {
				flex: 1;
				text-align: center;
				padding: 16rpx 0;
				border-radius: 32rpx;
				font-size: 24rpx;
				color: var(--text-color-regular);
				background: var(--background-color-secondary);

				&.primary {
					color: #ffffff;
					background: #ea7034;
				}
			}
		}

		.milestone-row {
			display: flex;
			flex-wrap: wrap;
			gap: 16rpx;

			.milestone-chip {
				padding: 12rpx 24rpx;
				border-radius: 32rpx;
				font-size: 24rpx;
				color: #ea7034;
				background: rgba(234, 112, 52, 0.1);
				border: 2rpx solid rgba(234, 112, 52, 0.3);
			}
		}

		.milestone-actions {
			display: flex;
			gap: 16rpx;
			margin-top: 24rpx;

			.milestone-action {
				flex: 1;
				text-align: center;
				padding: 16rpx 0;
				border-radius: 32rpx;
				font-size: 24rpx;
				color: var(--text-color-regular);
				background: var(--background-color-secondary);
				border: 2rpx solid var(--border-color-lighter, rgba(0, 0, 0, 0.08));

				&.primary {
					color: #ffffff;
					background: #ea7034;
					border-color: #ea7034;
					font-weight: bold;
				}
			}
		}
	}
}
</style>
