<template>
	<view class="code-view" :class="{isRotate}">
		默认不启用代码浏览模块，如有需要请关闭注释
		<!-- <uni-im-code-view :code="code" :showFullBtn="false"></uni-im-code-view> -->
		
		
		<!-- <uni-im-icons id="rotate" @click="rotate" code="e664"></uni-im-icons> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				code:"",
				isRotate:false
			}
		},
		onLoad({
			code
		}) {
			this.code = decodeURIComponent(code)
		},
		methods:{
			rotate(){
				this.isRotate = !this.isRotate
			}
		}
	}
</script>

<style lang="scss">
	.text-box,
	.code-view {
		background-color: #fffae5 !important;
		flex: 1;
		width: 750rpx;
		/* #ifndef APP-NVUE */
		width: 100vw;
		/* #endif */
		height: 100vh;
	}
	#rotate{
		position: fixed;
		right: 10px;
		top: 60px;
		z-index: 999;
	}
	.isRotate{}
</style>
