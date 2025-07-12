<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad(params){
			console.log(params.url);
			if (window.jsBridge && window.jsBridge.inApp) {
			  window.jsBridge.openInBrowser(params.url);
			} else {    
			  window.open(params.url);
			}
			uni.navigateBack();
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
