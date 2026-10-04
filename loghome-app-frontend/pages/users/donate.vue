<template>
	<view class="outer" v-dark>
		<div class="intro">{{ $t('settings.donate.intro') }}</div>
		<div class="button" @click="gotoDonate">{{ $t('settings.donate.button') }}</div>
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
					url:"apps/h5webview?url=https://loghome.ink/activities/novelcraft&title=干草块杯活动页面&baseUrl=loghome.ink/activities/novelcraft"
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
