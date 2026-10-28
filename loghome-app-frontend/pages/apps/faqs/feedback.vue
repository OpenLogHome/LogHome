<template>
	<view class="feedback-detail" v-dark>
		<view v-if="loading" class="feedback-status">{{ $t('apps.feedback.loading') }}</view>
		<view v-else-if="error" class="feedback-status">{{ error }}</view>
		<template v-else>
		<view class="fb_head">
			<view class="fb_title">{{fb.faq_title}}</view>
			<view class="fb_questioner">{{user_name}}<!--显示提交者--></view>
			<view class="fb_date">{{utc2beijing(fb.create_time)}}</view>
		</view>
		<view class="fb_content">
			<text>{{fb.faq_content}}</text>
		</view>
		<view class="title_bar">{{ $t('apps.feedback.customerReply') }}</view>
		<view v-if="fb.solved" class="fb_content">
			<text>{{fb.answer}}</text>
			<view class="fb_date">{{utc2beijing(fb.answer_time)}}</view>
		</view>
		<view v-else>{{ $t('apps.feedback.submitted') }}</view>
		</template>
	</view>
</template>

<script>
	import axios from 'axios'

	export default {
		data() {
			return {
				uid:-1,
				fb: null,
				user_name:'',
				loading:true,
				error:''
			};
		},
		onLoad(params){
			this.uid = params.id;
			if (!this.uid) {
				this.loading = false;
				this.error = this.$t('apps.feedback.notFound');
				return;
			}
			let _this = this;
			axios.get(this.$baseUrl + '/app/get_faqs_by_id?id=' + this.uid, {}).then((res) => {
				const feedback = res.data && res.data[0];
				if (!feedback) throw new Error('not-found');
				_this.fb = feedback;
				_this.loading = false;
				_this.$forceUpdate();
				axios.get(this.$baseUrl + '/users/user_profile_of?id=' + _this.fb.user_id, {}).then((res) => {
					_this.user_name=res.data && res.data[0] ? res.data[0].name : '';
				}).catch(() => {})
			}).catch(function (error) {
				_this.loading = false;
				_this.error = error && error.message === 'not-found'
					? _this.$t('apps.feedback.notFound')
					: _this.$t('apps.feedback.loadFailed');
			})
		},
		methods:{
			utc2beijing(utc_datetime) {
				if (!utc_datetime || typeof utc_datetime !== 'string') return '';
			    // 转为正常的时间格式 年-月-日 时:分:秒
			    var T_pos = utc_datetime.indexOf('T');
			    var Z_pos = utc_datetime.indexOf('Z');
				if (T_pos < 0 || Z_pos < 0) return utc_datetime;
			    var year_month_day = utc_datetime.substr(0,T_pos);
			    var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
			    var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06

			    // 处理成为时间戳
			    var timestamp = new Date(Date.parse(new_datetime));
			    timestamp = timestamp.getTime();
			    timestamp = timestamp/1000;

			    // 增加8个小时，北京时间比utc时间多八个时区
			    timestamp = timestamp+8*60*60;

			    // 时间戳转为时间
				var beijing_datetime = this.timeConvert(new Date(parseInt(timestamp) * 1000))
			    return beijing_datetime; // 2017-03-31 16:02:06
			},
		}
	}
</script>

<style lang="less">
	.feedback-detail{
		min-height: 100vh;
		background-color: var(--card-background);
	}
	.feedback-status{
		padding: 96rpx 30rpx;
		text-align: center;
		font-size: 30rpx;
		color: var(--secondary-text-color);
	}
	.title_bar{
		padding: 8px 30rpx;
		font-size: 40rpx;
		font-weight: bold;
		background-color: var(--background-color-secondary);
		margin: 0 auto 25rpx;
		color: var(--accent-text-color);
	}
	.fb_head{
		color: #a7a7a7;
		padding: 0 15rpx;
		position: relative;
		border-bottom: var(--border-color) 1px solid;
		.fb_title{
			font-size: 50rpx;
			font-weight: bold;
			color: var(--accent-text-color);
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
