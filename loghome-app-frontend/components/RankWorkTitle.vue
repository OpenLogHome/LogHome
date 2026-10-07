<template>
	<view v-dark class="rank-work-title" :class="{ compact }">
		<text class="work-title-text">{{ title }}</text>
		<view v-if="visibleBadges.length" class="work-badges">
			<text
				v-for="badge in visibleBadges"
				:key="badge.code"
				class="work-badge"
				:class="'tone-' + badge.tone"
			>
				{{ badge.text }}
			</text>
		</view>
	</view>
</template>
<script>
export default {
	name: 'RankWorkTitle',
	props: {
		title: { type: String, default: '' },
		badges: { type: Array, default: () => [] },
		compact: { type: Boolean, default: false },
		maxBadges: { type: Number, default: 1 },
	},
	data() {
		return {
			now: Date.now(),
			expiryTimer: null,
		};
	},
	computed: {
		visibleBadges() {
			return this.badges
				.filter(
					b => !b.expires_at || new Date(b.expires_at).getTime() > this.now,
				)
				.slice(0, this.maxBadges);
		},
	},
	watch: {
		badges() {
			this.now = Date.now();
			this.scheduleExpiry();
		},
	},
	mounted() {
		this.scheduleExpiry();
	},
	beforeDestroy() {
		clearTimeout(this.expiryTimer);
	},
	methods: {
		scheduleExpiry() {
			clearTimeout(this.expiryTimer);
			const next = Math.min(
				...this.badges
					.map(b => new Date(b.expires_at).getTime())
					.filter(t => t > this.now),
			);
			if (Number.isFinite(next))
				this.expiryTimer = setTimeout(() => {
					this.now = Date.now();
					this.scheduleExpiry();
				}, Math.min(next - this.now + 1, 2147483647));
		},
	},
};
</script>
<style scoped lang="scss">
.rank-work-title {
	position: relative;
	min-width: 0;
	font-size: 32rpx;
	line-height: 44rpx;
	color: inherit;
}
.work-title-text {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	overflow-wrap: anywhere;
	font-weight: 500;
}
.compact {
	font-size: 28rpx;
	line-height: 34rpx;
	.work-title-text {
		font-weight: 700;
	}
}
.compact .work-badges {
	margin-top: 2rpx;
	line-height: 24rpx;
}
.compact .work-badge {
	padding-top: 0;
	padding-bottom: 0;
}

.work-badges {
	display: flex;
	gap: 6rpx;
	margin-top: 6rpx;
	min-width: 0;
	overflow: hidden;
	line-height: 26rpx;
}
.work-badge {
	min-width: 0;
	max-width: 100%;
	padding: 1rpx 7rpx;
	border-radius: 5rpx;
	font-size: 20rpx;
	font-weight: 500;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.tone-green {
	color: #39805c;
	background: #edf7ef;
}
.tone-orange {
	color: #b56a37;
	background: #fff1e5;
}
.tone-gold {
	color: #9c7b3c;
	background: #f8f2e4;
}
.dark-mode .tone-green {
	color: #9ccaae;
	background: #263a2e;
}
.dark-mode .tone-orange {
	color: #e7b18d;
	background: #403026;
}
.dark-mode .tone-gold {
	color: #d9c091;
	background: #3c3526;
}
@media (max-width: 360px) {
	.rank-work-title:not(.compact) {
		font-size: 30rpx;
		line-height: 40rpx;
	}
}
</style>
