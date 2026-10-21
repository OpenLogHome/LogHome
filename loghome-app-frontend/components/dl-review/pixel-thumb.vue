<template>
	<svg class="pixel-thumb" :class="{ 'pixel-thumb-down': down }" viewBox="0 0 16 16"
		xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true" focusable="false">
		<path v-if="active" fill="currentColor" opacity="0.18"
			d="M8 1h2v1h1v3h3v1h1v4h-1v3h-1v1H5v-1H1V7h4V6h1V5h1V3h1Z" />
		<path fill="currentColor" fill-rule="evenodd"
			d="M8 1h2v1h1v3h3v1h1v4h-1v3h-1v1H5v-1H1V7h4V6h1V5h1V3h1Z M9 2v1H8v3H7v1H6v1H5v5h8v-3h1V6h-4V2Z M2 8v4h2V8Z" />
	</svg>
</template>

<script>
	export default {
		name: 'PixelThumb',
		props: {
			down: Boolean,
			active: Boolean
		}
	}
</script>

<style scoped>
.pixel-thumb {
	display: block;
	flex: none;
	width: 32rpx;
	height: 32rpx;
}
.pixel-thumb-down {
	transform: scaleY(-1);
}
</style>
