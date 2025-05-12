<template>
	<view class="theme-switch" @click="toggleTheme">
		<view v-if="isDarkMode" class="switch-icon">🌙</view>
		<view v-else class="switch-icon">☀️</view>
	</view>
</template>

<script>
	export default {
		name: 'theme-switch',
		computed: {
			isDarkMode() {
				return this.$store.state.isDarkMode;
			}
		},
		methods: {
			toggleTheme() {
				// 调用App.vue中定义的toggleTheme方法
				getApp().toggleTheme();
			}
		}
	}
</script>

<style scoped lang="scss">
	.theme-switch {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		background-color: var(--card-background);
	}
	
	.switch-icon {
		font-size: 40rpx;
	}
</style> 