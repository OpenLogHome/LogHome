<template>
	<view
		class="haycraft-mark"
		:class="`haycraft-mark--${size}`"
		title="HayCraft 干草块文会作品"
		aria-label="HayCraft 干草块文会作品"
	>
		<image
			class="haycraft-mark__image"
			src="https://storage.codesocean.top/image/179007802148436"
			mode="aspectFit"
		/>
	</view>
</template>

<script>
	export default {
		name: 'HaycraftMark',
		props: {
			size: {
				type: String,
				default: 'medium'
			}
		}
	}
</script>

<style scoped lang="scss">
	.haycraft-mark {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 auto;
		margin-left: 6rpx;
		vertical-align: -0.12em;
		pointer-events: none;
	}

	.haycraft-mark--small {
		width: 30rpx;
		height: 30rpx;
	}

	.haycraft-mark--medium {
		width: 38rpx;
		height: 38rpx;
	}

	.haycraft-mark__image {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
