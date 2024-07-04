<template>
	<!-- #ifdef APP-NVUE -->
	<cell :keep-scroll-position="true">
		<slot></slot>
	</cell>
	<!-- #endif -->
	<!-- #ifndef APP-NVUE -->
	<view>
		<slot></slot>
	</view>
	<!-- #endif -->
</template>

<script>
	export default {
		data() {
			return {}
		},
		props: {
		},
		computed:{
		},
		methods:{
		}
	}
</script>

<style>
</style>
