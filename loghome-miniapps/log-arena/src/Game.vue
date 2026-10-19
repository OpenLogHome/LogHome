<template>
<div class="arena" v-dark>
	<div class="arena-card">
		<div class="arena-icon">⚔️</div>
		<div class="arena-title">{{ $t('arena.title') }}</div>
		<div class="arena-desc">{{ $t('arena.comingSoon') }}</div>
	</div>
</div>
</template>
<script>
export default {
	name: 'LogArena',
	methods: {
		teardown() {},
		resumeGame() {}
	}
};
</script>
<style lang="scss">
.arena {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: calc(24 * var(--rpx));
	box-sizing: border-box;
	background: #f4f1e8;
	&.dark-mode { background: #1c211c; }
}
.arena-card {
	text-align: center;
	padding: 64rpx 48rpx;
	border-radius: 24rpx;
	background: #ffffff;
	box-shadow: 0 4rpx 24rpx rgba(57, 61, 51, 0.12);
	.dark-mode & { background: #263026; }
}
.arena-icon { font-size: 96rpx; line-height: 1; }
.arena-title {
	margin-top: 28rpx;
	font-size: 40rpx;
	font-weight: 700;
	color: #393d33;
	.dark-mode & { color: #eeeae0; }
}
.arena-desc {
	margin-top: 16rpx;
	font-size: 26rpx;
	color: #6d7267;
	.dark-mode & { color: #b4c0b1; }
}
</style>
