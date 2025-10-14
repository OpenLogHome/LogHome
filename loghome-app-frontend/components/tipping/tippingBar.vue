<template>
	<view class="outer" v-dark>
		<div class="balance">
			<div class="balance-item">
				<img src="../../static/resources/log.png" alt="">
				<span>{{resources.log}}</span>
			</div>
			<div class="balance-item">
				<img src="../../static/resources/apple.png" alt="">
				<span>{{resources.apple}}</span>
			</div>
			<div class="refresh-btn" @click="refreshResources">
				<uni-icons type="reload" size="18" color="#795548"></uni-icons>
			</div>
		</div>
		<div class="gifts">
			<div class="gift" v-for="item in tippingList"
			:class="{'selected':selectedTippingItem == item}"
			@click="selectedTippingItem = item">
				<p class="gift-name">{{item.item_name}}</p>
				<log-image :src="item.img_url" alt="" class="gift-img" />
				<div class="cost">
					<img src="../../static/resources/log.png" alt=""
					v-show="!item.is_log_free" class="cost-icon">
					<img src="../../static/resources/apple.png" alt=""
					v-show="item.is_log_free" class="cost-icon">
					<p>{{item.item_cost}}</p>
				</div>
			</div>
		</div>
		
		<div class="message-area">
			<textarea v-model="tippingMessage" placeholder="添加留言..." maxlength="50" class="message-input"></textarea>
			<div class="message-counter">{{tippingMessage.length}}/50</div>
		</div>
		
		<div class="amount-selector">
			<div class="amount-label">数量：</div>
			<div class="amount-stepper">
				<div class="amount-btn" @click="decreaseAmount">-</div>
				<div class="amount-value" @click="selectAmount">{{tippingAmount}}</div>
				<div class="amount-btn" @click="increaseAmount">+</div>
			</div>
		</div>
		
		<div class="total-cost">
			<div class="total-label">总计：</div>
			<div class="total-value">
				<img :src="selectedTippingItem && selectedTippingItem.is_log_free ? '/static/resources/apple.png' : '/static/resources/log.png'" 
					 alt="" class="total-icon">
				<span>{{totalCost}}</span>
			</div>
		</div>
		
		<div class="tip-button" @click="tipping">
			<span>打 赏</span>
		</div>
		
		<chunLei-modal v-model="showModal" :mData="inputData" type="input" @onConfirm="onModalConfirm">
		</chunLei-modal>
	</view>
</template>

<script>
	import axios from 'axios'
	import darkModeMixin from '@/mixins/dark-mode.js'
	export default{
		data(){
			return{
				resources:{
					log:0,apple:0
				},
				tippingList:[],
				selectedTippingItem:undefined,
				tippingAmount:1,
				tippingMessage: "此书只应天上有，当赏当赏！",
				showModal:false,
				inputData:{
				  title:'自定义数量(<=9999)',
				  content:[
				  {title:'数量',content:'',type:'number',placeholder:'请输入数量'},
				  ]
				}
			}
		},
		props:["novel_id"],
		mixins: [darkModeMixin],
		computed: {
			totalCost(){
				if (!this.selectedTippingItem) return 0;
				return this.selectedTippingItem.item_cost * Number(this.tippingAmount);
			}
		},
		methods:{
			decreaseAmount() {
				if (this.tippingAmount > 1) {
					this.tippingAmount--;
				}
			},
			increaseAmount() {
				if (this.tippingAmount < 9999) {
					this.tippingAmount++;
				} else {
					uni.showToast({
						title: "数量不能超过9999",
						icon: 'none',
						duration: 2000
					});
				}
			},
			refreshResources(){
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;
				axios.get(this.$baseUrl + '/resource/get_resources', 
					{
						headers: {
							 'Content-Type': 'application/json',//设置请求头请求格式为JSON
							 'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
						}
					}
				).then((res) => {
					this.resources = res.data[0];
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
			refreshTippingList(){
				axios.get(this.$baseUrl + '/library/get_tipping_list').then((res) => {
					let list = res.data;
					for(let i = 0 ; i < list.length ; i ++){
						this.tippingList[list[i].sort_id] = list[i];
					}
					// 设置默认选中的物品（如果未选中）
					if (!this.selectedTippingItem && this.tippingList.length > 0) {
						this.selectedTippingItem = this.tippingList[0];
					}
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
			// 获取用户的粉丝留言
			getUserFanMessage() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (!tk) return;
				
				let _this = this;
				axios.get(this.$baseUrl + '/library/get_user_fan_message', {
					params: { novel_id: this.novel_id },
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + tk.tk
					}
				})
				.then(function(response) {
					if (response.data.success && response.data.message) {
						_this.tippingMessage = response.data.message;
					}
				})
				.catch(function(error) {
					console.log('获取留言失败', error);
				});
			},
			// 更新粉丝留言
			updateFanMessage() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (!tk) return;
				
				axios.post(this.$baseUrl + '/library/update_fan_message', 
					{
						novel_id: this.novel_id,
						message: this.tippingMessage.trim()
					},
					{
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + tk.tk
						}
					}
				)
				.catch(function(error) {
					console.log('更新留言失败', error);
				});
			},
			selectAmount(){
				let _this = this;
				uni.showActionSheet({
				    itemList: ['自定义 (<=9999)','爱的告白 ×520','天长地久 ×99','六六大顺 ×66',"十全十美 ×10","五福临门 ×5","一心一意 ×1"],
				    success: function (res) {
				        if(res.tapIndex == 0) {
							_this.showModal = true;
						}
						if(res.tapIndex == 1) {
							_this.tippingAmount = 520;
						}
						if(res.tapIndex == 2) {
							_this.tippingAmount = 99;
						}
						if(res.tapIndex == 3) {
							_this.tippingAmount = 66;
						}
						if(res.tapIndex == 4) {
							_this.tippingAmount = 10;
						}
						if(res.tapIndex == 5) {
							_this.tippingAmount = 5;
						}
						if(res.tapIndex == 6) {
							_this.tippingAmount = 1;
						}
				    },
				    fail: function (res) {
				        console.log(res.errMsg);
				    }
				});
			},
			onModalConfirm(e){
				this.tippingAmount=Math.max(Math.min(Math.floor(Number(e[0].content)),9999),1);
			},
			tipping(){
				if (!this.selectedTippingItem) {
					uni.showToast({
						title: "请选择打赏物品",
						icon:'none',
						duration: 2000
					});
					return;
				}
				
				const item = this.selectedTippingItem;
				let item_cost = 0;
				let item_amount = 0;
				let item_name = "";
				let resource_name = "log"
				//是不是免原木item
				if(item.is_log_free == 1){
					if(this.resources.apple >= item.item_cost * this.tippingAmount){
						item_cost = item.item_cost;
						item_amount = this.tippingAmount;
						item_name = item.item_name;
						resource_name = "apple";
					} else{
						uni.showToast({
							title: "余额不足",
							icon:'none',
							duration: 2000
						});
						return;
					}
				} else {
					if(this.resources.log >= item.item_cost * this.tippingAmount){
						item_cost = item.item_cost;
						item_amount = this.tippingAmount;
						item_name = item.item_name;
						resource_name = "log";
					} else{
						uni.showToast({
							title: "余额不足",
							icon:'none',
							duration: 2000
						});
						return;
					}
				}
				
				let _this = this;
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if(!tk) return;
				axios.post(this.$baseUrl + '/library/tipping',
					{
						from_id:tk.id,
						novel_id: this.novel_id,
						item_name: item_name,
						item_amount: item_amount,
						item_cost:item_cost,
						resource_name:resource_name,
						message: this.tippingMessage.trim() // 添加留言内容
					},
					{
						headers: {
							'Content-Type': 'application/json', //设置请求头请求格式为JSON
							'Authorization': 'Bearer ' + tk.tk //设置token 其中K名要和后端协调好
						}
					},
				)
				.then(function(response) {
					uni.showToast({
						title: "打赏成功",
						icon: 'none',
						duration: 2000
					});
					
					// 如果有留言，则更新粉丝留言
					if (_this.tippingMessage.trim()) {
						_this.updateFanMessage();
					}
					
					_this.$emit("tip", {
						...item,
						message: _this.tippingMessage.trim()
					});
					_this.tippingMessage = ""; // 清空留言
				})
				.catch(function(error) {
					if (error) {
						console.log(error);
						uni.showToast({
							title: "打赏失败",
							icon: 'none',
							duration: 2000
						});
					}
				}).then(function(){
					_this.refreshResources();
				});
				
			}
		},
		mounted(){
			this.refreshResources();
			this.refreshTippingList();
			this.getUserFanMessage(); // 获取用户留言
		}
	}
</script>

<style scoped lang="scss">
	.outer{
		background-color: rgb(255, 248, 234);
		padding: 20rpx;
		border-radius: 20rpx 20rpx 0 0;
		box-shadow: 0 -5rpx 15rpx rgba(0, 0, 0, 0.1);
		
		&.dark-mode {
			background-color: #1c1c1e;
			box-shadow: 0 -5rpx 15rpx rgba(0, 0, 0, 0.3);
		}
		
		div.balance{
			display: flex;
			align-items: center;
			justify-content: flex-end;
			padding: 15rpx;
			margin-bottom: 20rpx;
			border-radius: 10rpx;
			background-color: rgba(255, 255, 255, 0.6);
			box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.05);
			
			.dark-mode & {
				background-color: rgba(45, 45, 45, 0.6);
				box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.2);
			}
			
			.balance-item {
				display: flex;
				align-items: center;
				margin-left: 20rpx;
				
				img {
					height: 36rpx;
					width: 36rpx;
				}
				
				span {
					margin-left: 8rpx;
					font-size: 28rpx;
					color: #795548;
					font-weight: bold;
					
					.dark-mode & {
						color: #d4b8a8;
					}
				}
			}
			
			.refresh-btn {
				margin-left: auto;
				width: 36rpx;
				height: 36rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				background-color: rgba(121, 85, 72, 0.1);
				
				.dark-mode & {
					background-color: rgba(200, 170, 160, 0.15);
				}
			}
		}
		
		div.gifts{
			width: 100%;
			display: flex;
			flex-flow: wrap;
			justify-content: space-between;
			margin-bottom: 20rpx;
			
			div.gift{
				display: flex;
				flex-direction: column;
				align-items: center;
				box-sizing: border-box;
				border: solid 2rpx rgba(200, 200, 200, 0.5);
				border-radius: 12rpx;
				height: 220rpx;
				width: 24%;
				margin-bottom: 10rpx;
				padding: 10rpx;
				transition: all .2s;
				background-color: rgba(255, 255, 255, 0.6);
				
				.dark-mode & {
					background-color: rgba(45, 45, 45, 0.6);
					border: solid 2rpx rgba(100, 100, 100, 0.5);
				}
				
				&:active {
					transform: scale(0.95);
				}
				
				.gift-name {
					font-size: 24rpx;
					margin-bottom: 8rpx;
					color: #795548;
					
					.dark-mode & {
						color: #d4b8a8;
					}
				}
				
				.gift-img {
					height: 120rpx;
					width: 120rpx;
					object-fit: contain;
					
					.dark-mode & {
						filter: brightness(0.9);
					}
				}
				
				div.cost{
					display: flex;
					align-items: center;
					margin-top: 8rpx;
					
					.cost-icon {
						width: 30rpx;
						height: 30rpx;
						margin-right: 5rpx;
					}
					
					p {
						font-size: 24rpx;
						color: #EA7034;
						font-weight: bold;
						
						.dark-mode & {
							color: #ff9966;
						}
					}
				}
			}
			
			div.gift.selected{
				border: solid 2rpx #ff7043;
				box-shadow: 0 2rpx 10rpx rgba(255, 112, 67, 0.2);
				background-color: rgba(255, 248, 234, 0.8);
				transform: translateY(-3rpx);
				
				.dark-mode & {
					background-color: rgba(255, 112, 67, 0.15);
					border: solid 2rpx rgba(255, 112, 67, 0.6);
					box-shadow: 0 2rpx 10rpx rgba(255, 112, 67, 0.3);
				}
			}
		}
		
		.message-area {
			margin-bottom: 20rpx;
			position: relative;
			
			.dark-mode & {
				color: #d4b8a8;
			}
			
			.message-input {
				width: 100%;
				height: 120rpx;
				padding: 15rpx;
				border-radius: 12rpx;
				font-size: 28rpx;
				background-color: rgba(255, 255, 255, 0.6);
				border: solid 2rpx rgba(200, 200, 200, 0.5);
				box-sizing: border-box;
				color: #333;
				
				.dark-mode & {
					background-color: rgba(45, 45, 45, 0.6);
					border: solid 2rpx rgba(100, 100, 100, 0.5);
					color: #e0e0e0;
				}
			}
			
			.message-counter {
				position: absolute;
				bottom: 10rpx;
				right: 10rpx;
				font-size: 22rpx;
				color: #999;
				
				.dark-mode & {
					color: #777;
				}
			}
		}
		
		.amount-selector {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		
		.dark-mode & {
			color: var(--text-color-primary);
		}
		
		.amount-label {
			font-size: 28rpx;
			color: #795548;
			margin-right: 15rpx;
			
			.dark-mode & {
				color: #d4b8a8;
			}
		}
			
			.amount-stepper {
			display: flex;
			align-items: center;
			
			.dark-mode & {
				border-color: rgba(100, 100, 100, 0.5);
			}
			
			.amount-btn {
				width: 60rpx;
				height: 60rpx;
				border-radius: 30rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 36rpx;
				color: #fff;
				background-color: rgba(234, 112, 52, 0.8);
				font-weight: bold;
				box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.1);
				
				.dark-mode & {
					background-color: rgba(234, 112, 52, 0.7);
					box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.2);
				}
				
				&:active {
					transform: scale(0.95);
				}
			}
				
				.amount-value {
				min-width: 100rpx;
				padding: 0 20rpx;
				height: 60rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 32rpx;
				background-color: rgba(255, 255, 255, 0.6);
				border-radius: 30rpx;
				margin: 0 10rpx;
				color: #333;
				font-weight: bold;
				border: 2rpx dashed rgba(200, 200, 200, 0.5);
				
				.dark-mode & {
					background-color: rgba(45, 45, 45, 0.6);
					color: #e0e0e0;
					border: 2rpx dashed rgba(100, 100, 100, 0.5);
				}
			}
			}
		}
		
		.total-cost {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-bottom: 30rpx;
		
		.dark-mode & {
			color: var(--text-color-primary);
		}
		
		.total-label {
			font-size: 28rpx;
			color: #795548;
			margin-right: 15rpx;
			
			.dark-mode & {
				color: #d4b8a8;
			}
		}
			
			.total-value {
			display: flex;
			align-items: center;
			
			.total-icon {
				width: 36rpx;
				height: 36rpx;
				margin-right: 8rpx;
			}
			
			span {
				font-size: 36rpx;
				font-weight: bold;
				color: #EA7034;
				
				.dark-mode & {
					color: #ff9966;
				}
			}
		}
		}
		
		.tip-button {
		height: 90rpx;
		background: linear-gradient(135deg, #ff9800, #ff5722);
		border-radius: 45rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 32rpx;
		font-weight: bold;
		box-shadow: 0 5rpx 15rpx rgba(255, 87, 34, 0.3);
		transition: all 0.2s;
		
		.dark-mode & {
			background: linear-gradient(135deg, #e67e00, #e64a00);
			box-shadow: 0 5rpx 15rpx rgba(255, 87, 34, 0.2);
		}
		
		&:active {
			transform: scale(0.98);
			box-shadow: 0 2rpx 8rpx rgba(255, 87, 34, 0.2);
		}
		}
	}
</style>
