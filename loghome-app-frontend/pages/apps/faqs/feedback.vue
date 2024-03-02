<template>
	<view style="background-color: #ffffff;">
		<view class="fb_head">
			<view class="fb_title">{{fb.faq_title}}</view>
			<view class="fb_questioner">{{user_name}}<!--显示提交者--></view>
			<view class="fb_date">{{utc2beijing(fb.create_time)}}</view>
		</view>
		<view class="fb_content">
			<text>{{fb.faq_content}}</text>
		</view>
		<view class="title_bar">客服答复</view>
		<view v-if="fb.solved" class="fb_content">
			<text>{{fb.answer}}</text>
			<view class="fb_date">{{utc2beijing(fb.answer_time)}}</view>
		</view>
		<view v-else>问题已提交，客服还在路上哦</view>
	</view>
</template>

<script>
	import axios from 'axios'
	
	export default {
		data() {
			return {
				uid:-1,
				fb: {
					title: "aaaaaaaa",
					faq_id: 0,
					user_id:"系统消息",
					date: "1973/01/01",
					content: "哼哼啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊",
					solved: true,
					answer: "?",
					answer_date: "2077/9/18"
				},
				user_name:undefined
			};
		},
		onLoad(params){
			this.uid = params.id;
			let _this = this;
			let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;
			axios.get(this.$baseUrl + '/app/get_faqs_by_id?id=' + this.uid, {}).then((res) => {
				_this.fb = res.data[0];
				_this.$forceUpdate();
				axios.get(this.$baseUrl + '/users/user_profile_of?id=' + _this.fb.user_id, {}).then((res) => {
					_this.user_name=res.data[0].name;
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
				}).then(function(){
					
				})
			}).catch(function (error) {
				uni.showToast({
					title: error.toString(),
					icon:'none',
					duration: 2000
				});
			}).then(function(){
				
			})
		},
		methods:{
			utc2beijing(utc_datetime) {
			    // 转为正常的时间格式 年-月-日 时:分:秒
			    var T_pos = utc_datetime.indexOf('T');
			    var Z_pos = utc_datetime.indexOf('Z');
			    var year_month_day = utc_datetime.substr(0,T_pos);
			    var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
			    var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06
			
			    // 处理成为时间戳
			    timestamp = new Date(Date.parse(new_datetime));
			    timestamp = timestamp.getTime();
			    timestamp = timestamp/1000;
			
			    // 增加8个小时，北京时间比utc时间多八个时区
			    var timestamp = timestamp+8*60*60;
			
			    // 时间戳转为时间
				var beijing_datetime = this.timeConvert(new Date(parseInt(timestamp) * 1000))
			    return beijing_datetime; // 2017-03-31 16:02:06
			},
		}
	}
</script>

<style lang="less">
	.title_bar{
		padding: 8px 30rpx;
		font-size: 40rpx;
		font-weight: bold;
		background-color: #f2f2f2;
		margin: 0 auto 25rpx;
		color: #934900;
	}
	.fb_head{
		color: #a7a7a7;
		padding: 0 15rpx;
		position: relative;
		border-bottom: #e3e3e3 1px solid;
		.fb_title{
			font-size: 50rpx;
			font-weight: bold;
			color: #713418;
			margin: 8px 0;
		}
		.fb_questioner{
			margin: 0 0 8px;
		}
		.fb_date{
			position: absolute;
			right: 10rpx;
		}
	}
	.fb_content{
		margin: 16px 15rpx;
		width: 720rpx;
		font-size: 30rpx;
		position: relative;
		.fb_date{
			position: absolute;
			right: 10rpx;
			bottom: -32px;
			color: #a7a7a7;
			font-size: 16px;
		}
	}
</style>
