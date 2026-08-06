<template>
		<view
			class="theme-switch"
			:class="{ 'theme-switch--dark': themeMode === 'dark' }"
			role="button"
			:aria-label="themeLabel"
			@click="toggleTheme"
		>
			<image
				class="celestial-texture"
				:src="celestialTexture"
				mode="aspectFit"
				aria-hidden="true"
			></image>
		</view>
</template>

<script>
	function resolveAssetUrl(assetModule) {
		return assetModule && assetModule.default ? assetModule.default : assetModule;
	}

	const MINECRAFT_SUN = resolveAssetUrl(require('../static/icons/minecraft-sun.svg'));
	const MINECRAFT_FULL_MOON = resolveAssetUrl(require('../static/icons/minecraft-full-moon.svg'));

	export default {
		name: 'theme-switch',
		computed: {
			themeMode() {
				return this.$store.state.themeMode || 'light';
			},
			themeLabel() {
				return this.themeMode === 'dark'
					? '当前为暗色模式，点击切换为亮色模式'
					: '当前为亮色模式，点击切换为暗色模式';
			},
			celestialTexture() {
				return this.themeMode === 'dark' ? MINECRAFT_FULL_MOON : MINECRAFT_SUN;
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
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 70rpx;
			height: 70rpx;
			box-sizing: border-box;
			overflow: hidden;
			border: 3rpx solid #d8efff;
			border-radius: 8rpx;
			background: #76b9ff;
			box-shadow: 0 4rpx 0 rgba(30, 78, 130, 0.65), inset 0 -12rpx 0 rgba(181, 224, 255, 0.5);
			transition: transform 0.15s ease, background-color 0.2s ease;
			image-rendering: pixelated;

			&::before {
				content: '';
				position: absolute;
				left: 10rpx;
				bottom: 8rpx;
				width: 12rpx;
				height: 5rpx;
				background: rgba(255, 255, 255, 0.72);
				box-shadow: 8rpx -4rpx 0 rgba(255, 255, 255, 0.72), 31rpx 3rpx 0 rgba(255, 255, 255, 0.55);
			}

			&:active {
				transform: translateY(3rpx);
				box-shadow: 0 1rpx 0 rgba(30, 78, 130, 0.65), inset 0 -12rpx 0 rgba(181, 224, 255, 0.5);
			}
		}

		.theme-switch--dark {
			border-color: #4f638e;
			background: #111a38;
			box-shadow: 0 4rpx 0 rgba(4, 8, 22, 0.85), inset 0 -12rpx 0 rgba(40, 51, 91, 0.65);

			&::before {
				left: 9rpx;
				top: 10rpx;
				bottom: auto;
				width: 3rpx;
				height: 3rpx;
				background: #e5edff;
				box-shadow: 13rpx 8rpx 0 #9dafdb, 38rpx -3rpx 0 #e5edff, 46rpx 16rpx 0 #9dafdb, 5rpx 39rpx 0 #e5edff;
			}

			&:active {
				box-shadow: 0 1rpx 0 rgba(4, 8, 22, 0.85), inset 0 -12rpx 0 rgba(40, 51, 91, 0.65);
			}
		}

		.celestial-texture {
			display: block;
			position: relative;
			z-index: 1;
			width: 56rpx;
			height: 56rpx;
			object-fit: contain;
			image-rendering: pixelated;
			mix-blend-mode: screen;
		}

		.theme-switch--dark .celestial-texture {
			object-fit: contain;
		}
</style>
