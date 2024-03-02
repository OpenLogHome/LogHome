<template>
	<view style="background-color: #ffffff;">
		<view class="credit_table">
			<view class="score_ring_outer">
				<view class="score_ring" :style="style.ring">
					<view class="score_ring_inner" :style="style.ring_inner"></view>
				</view>
			</view>
			<view class="score"><countTo :startVal="0" :endVal="credit.credit" :duration="1500"></countTo></view>
		</view>
		<view class="credit_records">
			<view class="title_bar">变更记录</view>
			<view class="credit_history" v-if="credit.history==[]">
				<text>信誉良好，没有留下记录</text>
			</view>
			<view class="credit_history" v-else v-for="history in credit.history">
				<view class="credit_reason">{{history.reason}}</view>
				<view class="credit_change" :class="{'fix': (history.type===2)}" v-if="history.type===2">{{history.delta}}</view>
				<view class="credit_change" :class='{"adjust_add": (history.type===1&&history.delta>0)}' v-else-if="history.type===1&&history.delta>0">+{{history.delta}}</view>
				<view class="credit_change" :class='{"adjust_remove": (history.type===1&&history.delta<=0)}' v-else-if="history.type===1&&history.delta<=0">{{history.delta}}</view>
				<view class="credit_change" v-else>历史信息出错</view>
				<view class="credit_date">{{utc2beijing(history.time)}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import axios from 'axios'
	import countTo from "vue-count-to"
	export default {
		components:{
			countTo
		},
		data() {
			return {
				credit: {
					credit: 50,
					history: [
					]
				},
				style: {
					ring: {
						transform: "rotate(0deg)"
					},
					ring_inner: {
						transform: "rotate(0deg)"
					}
				}
			}
		},
		methods: {
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
			/*tableChange() {
				let rotate=180/100*this.credit.credit;
				this.style.ring.transform="rotate(" + rotate + "deg)";
				this.style.ring_inner.transform="rotate(-" + rotate + "deg)";
				console.log("change", this.style, this.credit);
			}*/
		},
		onShow() {
			let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
			let _this = this;
			if(tk == null){
				uni.navigateTo({
					url: './users/login?msg=' + 'unAuthorized'
				});
				return;
			}
			//验活
			axios.get(this.$baseUrl + '/credit/history', {
				headers: {
				     'Content-Type': 'application/json',//设置请求头请求格式为JSON
				     'Authorization': tk //设置token 其中K名要和后端协调好
				}
			}).then((res) => {
				_this.credit = JSON.parse(JSON.stringify(res.data));
			}).catch(function(error) {
				if(error.message == "Request failed with status code 401"){
					window.localStorage.removeItem('token');
					uni.navigateTo({
						url: './login'
					});
				}
			});
			//this.tableChange();
			
		}
	}
</script>

<style scoped lang="scss">
	.title_bar{
		padding: 8px 30rpx;
		font-size: 40rpx;
		font-weight: bold;
		background-color: #f2f2f2;
		margin: 25rpx auto;
		color: #934900;
	}
	.credit_records{
		//border-top: solid 1px #e3e3e3;
		padding-top: 12px;
		margin-top: 12px;
	}
	.credit_table{
		position: relative;
		width: 560rpx;
		height: 280rpx;
		margin: 32px auto;
		padding-top: 20rpx;
		overflow: hidden;
		border-left: solid 8px#ffffff;
		border-right: solid 8px#ffffff;
		border-bottom: solid 8px #ffff7f;
		border-radius: 560rpx 560rpx 8px 8px;
		background-image: linear-gradient(to right, rgba(175, 175, 175, 0.6), rgba(249, 249, 249, 0.6), rgba(175, 175, 175, 0.6));
		.score_ring_outer{
			margin: 0 auto;
			padding: 0;
			width: 520rpx;
			height: 520rpx;
			position: relative;
			//border-bottom: solid 4px #ffffff;
			border-left: solid 8px #934900;
			border-top: solid 8px #934900;
			//border-right: solid 4px #ffffff;
			border-radius: 520rpx;
			transform: rotate(45deg);
			overflow: hidden;
			.score_ring{
				width: 500rpx;
				height: 500rpx;
				padding: 0;
				margin: 10rpx;
				border-bottom: solid 4px #FA3534;
				border-left: solid 4px #FFF;
				border-top: solid 4px #FFF;
				border-right: solid 4px #FA3534;
				border-radius: 500rpx;
				.score_ring_inner{
					width: 480rpx;
					height: 480rpx;
					margin: 10rpx;
					border-bottom: solid 1px #ffffff;
					border-left: solid 1px #C8C7CC;
					border-top: solid 1px #C8C7CC;
					border-right: solid 1px #ffffff;
					border-radius: 480rpx;
					background-color: rgba($color: #717e66, $alpha: 0.1);
				}
			}
		}
		.score{
		position: absolute;
		bottom: 20rpx;
		width: 540rpx;
		color: #ea7034;
		text-align: center;
		font-size: 64px;
		font-weight: bold;
		line-height: 100%;
		}
	}
	.credit_history{
		height: 64px;
		margin: 16px 30rpx 0;
		padding: 0 15rpx;
		border-bottom: solid 1px #C8C7CC;
		position: relative;
		background-color: #ffffff;
		.credit_reason{
			font-size: 18px;
		}
		.credit_change{
			position: absolute;
			right: 30rpx;
		}
		.credit_change.fix{
			color: #f4c000;
		}
		.credit_change.adjust_add{
			color: #00f074;
		}
		.credit_change.adjust_remove{
			color: #b40000;
		}
	}
</style>
