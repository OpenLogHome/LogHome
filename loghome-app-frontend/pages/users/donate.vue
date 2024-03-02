<template>
	<view class="outer">
		<div class="intro">原木巨树承载着一本又一本的书籍，快去给他浇点水、施点肥</div>
		<div class="button" @click="gotoDonate">捐助</div>
		</view>
</template>
<script>
	export default {
		data() {
			return {
				title: '原木社区',
			}
		},
		onLoad() {
	
		},
		methods: {
			gotoDonate(){
				console.log("nononono");
				uni.navigateTo({
					url:"apps/h5webview?url=https://loghome.codesocean.top/activities/novelcraft&title=干草块杯活动页面&baseUrl=loghome.codesocean.top/activities/novelcraft"
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.button {
		height: 20px;
		width: 70%;
		margin-top: 15px;
		font-size: 16px;
		font-weight: bold;
		text-align: center;
		line-height: 38px;
		border-radius: 5px;
		color: rgb(234, 112, 52);
	}
</style>
