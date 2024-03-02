<template>
	<view style="background-color: #ffffff;">
		<view v-for="qtype in faqs">
			<view class="title">
				<text>{{qtype.title}}</text>
			</view>
			<navigator v-for="qna in qtype.content"
			:url="'./feedback?id=' +  qna.faq_id"
			open-type="navigate">
				<view class="faq">
					<view class="faq_title">{{qna.faq_title}}</view>
				</view>
			</navigator>
			<div style="height:150rpx;"></div>
		</view>
		<view class="under_bar">
			<button @click="newFeedBack">我的问题</button>
		</view>
	</view>
</template>

<script>
	import axios from 'axios'
	export default {
		data() {
			return {
				faqs:[
					{
						title: "常见问题",
						content: undefined
					},
					{
						title: "最新问题",
						content: undefined
					}
				]
			};
		},
		methods:{
			newFeedBack(){
				uni.navigateTo({
					url:"./user_feedback"
				})
			},
			refreshPage(){
				let _this = this;
				axios.get(this.$baseUrl + '/app/get_typical_faqs', {}).then((res) => {
					_this.faqs[0]['content']=res.data;
					_this.$forceUpdate();
					console.log(res.data);
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
				}).then(function(){
					
				})
				axios.get(this.$baseUrl + '/app/get_newest_faqs', {}).then((res) => {
					_this.faqs[1]['content']=res.data;
					_this.$forceUpdate();
					console.log(res.data);
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
				}).then(function(){
					
				})
			}
		},
		onShow(){
			this.refreshPage();
		}
	}
</script>

<style lang="less">
	.title{
		padding: 8px 30rpx;
		font-size: 40rpx;
		font-weight: bold;
		background-color: #f2f2f2;
		border-bottom: #e3e3e3 1rpx solid;
		margin: 0 auto 25rpx;
		color: #934900;
	}
	.faq{
		border-bottom: #cacaca 1px solid;
		height: 70rpx;
		padding: 0 30rpx;
		line-height: 70rpx;
		position: relative;
		.faq_title{
			font-size: 30rpx;
		}
	}
	.under_bar{
		position: fixed;
		bottom: 0;
		width: 750rpx;
		margin-top:10rpx;
		padding-top:10rpx;
		padding-bottom: 15px;
		background-color: #f2f2f2;
	}
	button {
		height: 40px;
		width: 80%;
		margin-top: 10px;
		font-size: 16px;
		font-weight: bold;
		line-height: 38px;
		border-radius: 5px;
		color: #ffffff;
		background-color: rgb(180, 111, 88);
		text-align: center;
	}
</style>
