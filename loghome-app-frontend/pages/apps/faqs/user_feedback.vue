<template>
	<view style="background-color: #ffffff; padding-top: 8px;">
		<input class="feedback_title" placeholder="标题" maxlength="20" v-model="faq_title"/>
		<textarea class="feedback_content" placeholder="在这里写下你遇到的问题"  v-model="faq_content" maxlength="500"></textarea>
		<button @click="post_faq">提交反馈</button>
		<view class="feedback_history">
			<view class="title_bar">
				<text>反馈历史</text>
			</view>
			<navigator v-for="record in records" 
			:url="'./feedback?id=' +  record.faq_id"
			open-type="navigate">
				<view class="fb">
					<view class="fb_title">{{record.faq_title}}</view>
					<text class="fb_summary">{{record.faq_content}}</text>
					<view class="fb_solved">
						<text v-if="record.solved" style="color: #00FF00;">已解决</text>
						<text v-else style="color: #FF0000;">未解决</text>
					</view>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	import axios from 'axios'
	export default {
		data() {
			return {
				records:[],
				faq_title:"",
				faq_content:""
			}
		},
		methods: {
			get_my_faqs(){
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;
				axios.get(this.$baseUrl + '/app/get_my_faqs', 
				{
					headers: {
					     'Content-Type': 'application/json',//设置请求头请求格式为JSON
					     'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}
				).then((res) => {
					this.records = res.data;
					this.$forceUpdate();
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
				}).then(function(){
					uni.hideLoading();
				})
			},
			post_faq(){
				let _this = this;
				if(this.faq_title.replace(/(^\s*)|(\s*$)/g, "") == "" || this.faq_content.replace(/(^\s*)|(\s*$)/g, "") == "") return;
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;
				axios.post(this.$baseUrl + '/app/post_faq',
					{
						faq_title:this.faq_title,
						faq_content: this.faq_content
					},
					{
						headers: {
							'Content-Type': 'application/json', //设置请求头请求格式为JSON
							'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
						}
					},
				)
				.then(function(response) {
					uni.showToast({
						title: "发表成功",
						icon: 'none',
						duration: 2000
					});
					_this.faq_title="";
					_this.faq_content="";
					_this.get_my_faqs();
				})
				.catch(function(error) {
					if (error) {
						uni.showToast({
							title: "发表失败",
							icon: 'none',
							duration: 2000
						});
					}
				});
			}
		},
		onShow(){
			this.get_my_faqs();
		}
	}
</script>

<style scoped lang="less">
	.feedback_title{
		width: 696rpx;
		margin: 20rpx auto;
		border: #cacaca 1rpx solid;
		padding: 0 12rpx;
		font-size: 18px;
		height: 30px;
		margin-top: 16px;
	}
	.feedback_content{
		width: 696rpx;
		margin: 20rpx auto;
		border: #CACACA 1rpx solid;
		padding: 4px 12rpx;
		font-size: 18px;
		height: 36vh;
	}
	.feedback_history{
		margin-top: 45rpx;
		color: #713418;
		.title_bar{
			padding: 8px 30rpx;
			font-size: 40rpx;
			font-weight: bold;
			background-color: #f2f2f2;
			margin: 25rpx auto;
			color: #934900;
		}
		.fb{
			border-bottom: #cacaca 1px solid;
			padding-bottom: 25rpx;
			height: 90px;
			padding: 0 30rpx;
			position: relative;
			.fb_title{
				font-size: 35rpx;
				font-weight: 600;
				padding-bottom: 6px;
			}
			.fb_summary{
				display: block;
				height: 30rpx;
				height:100rpx;
				overflow: hidden;
			}
			.fb_solved{
				position: absolute;
				right: 30rpx;
				bottom: 10px;
			}
		}
		
	}
	
	button {
		height: 40px;
		width: 80%;
		margin-top: 30px;
		font-size: 16px;
		font-weight: bold;
		line-height: 38px;
		border-radius: 5px;
		color: #ffffff;
		background-color: rgb(180, 111, 88);
		text-align: center;
	}
</style>
