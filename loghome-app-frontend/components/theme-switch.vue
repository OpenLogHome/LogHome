<template>
	<view class="theme-switch" @click="toggleTheme">
		<view class="switch-icon">{{ switchIcon }}</view>
	</view>
</template>

<script>
	export default {
		name: 'theme-switch',
		computed: {
			themeMode() {
				return this.$store.state.themeMode || 'system';
			},
			switchIcon() {
				if (this.themeMode === 'dark') {
					return 'D';
				}
				if (this.themeMode === 'light') {
					return 'L';
				}
				return 'A';
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
		font-size: 34rpx;
		font-weight: 600;
	}
</style>
