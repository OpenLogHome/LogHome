<template>
	<view class="outer">
		<div class="container">
			<div class="end-mark">尚未完结 · 敬请期待</div>

			<div class="action-buttons">
				<button class="btn urge-btn" onclick="urgeUpdate()">
					<i class="fas fa-bell"></i>催更
				</button>
				<button class="btn subscribe-btn" onclick="toggleSubscribe()">
					<i class="fas fa-bookmark"></i>订阅
				</button>
				<!-- 		            <button class="btn rate-btn" onclick="rateNovel()">
		                <i class="fas fa-star"></i>评分
		            </button> -->
			</div>
			<div class="rate">
				<div>如果可以，打个分吧？</div>
				<el-rate v-model="rate" @change="handleRateChange"></el-rate>
				<el-button  class="rate-btn" type="primary" size="small" v-show="showRateConfirmButton">确认</el-button>
			</div>

			<div class="message">
				📢 作者没跑路！只是鸽了！<br>
				👥 当前订阅人数：<span id="subscribers">1</span>
			</div>

			<div class="navigation">
				<button class="nav-btn" onclick="goToCatalog()">
					<i class="fas fa-list"></i> 返回目录
				</button>
				<button class="nav-btn" onclick="nextVolume()" disabled>
					<i class="fas fa-arrow-right"></i> 更多好书
				</button>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				rate: null,
				showRateConfirmButton: false
			}
		},
		methods: {
			handleRateChange(newRate) {
				this.showRateConfirmButton = true;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.outer {
		font-family: 'Microsoft Yahei', sans-serif;
		background: #f5f5f5;
		padding: 120rpx 60rpx;
		line-height: 1.6;

		.container {
			max-width: 600px;
			margin: 0 auto;
			background: white;
			padding: 30px;
			border-radius: 12px;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		}

		.end-mark {
			text-align: center;
			font-size: 24px;
			color: #666;
			margin: 40px 0;
			padding: 20px 0;
			border-bottom: 1px dashed #ddd;
		}

		.action-buttons {
			display: flex;
			text-align: center;
			justify-content: space-around;
			margin: 40px 0;
			flex-wrap: wrap;
			gap: 15px;
		}

		.btn {
			padding: 12px 25px;
			border: none;
			border-radius: 25px;
			font-size: 16px;
			cursor: pointer;
			transition: all 0.3s;
			display: flex;
			align-items: center;
		}

		.btn i {
			margin-right: 8px;
		}

		.urge-btn {
			background: #ff4757;
			color: white;
		}

		.subscribe-btn {
			background: #2ed573;
			color: white;
		}

		.rate-btn {
			background: #ffa502;
			color: white;
		}

		.rate-btn:active {
			opacity: 0.9;
			transform: translateY(-2px);
		}
		
		.rate {
			text-align: center;
		}
		.message {
			text-align: center;
			color: #999;
			margin: 30px 0;
		}

		.navigation {
			margin-top: 40px;
			display: flex;
			justify-content: space-between;
		}

		.nav-btn {
			padding: 10px 15px;
			border: 1px solid #ddd;
			border-radius: 20px;
			cursor: pointer;
		}
	}
</style>