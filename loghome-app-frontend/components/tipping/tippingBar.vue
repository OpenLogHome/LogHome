<template>
	<view class="outer">
		<div class="balance">
			<span>余额：</span>
			<img src="@/static/resources/log.png" alt="">
			<span>{{resources.log}}</span>
			<img src="@/static/resources/apple.png" alt="">
			<span>{{resources.apple}}</span>
		</div>
		<div class="gifts">
			<div class="gift" v-for="item in tippingList"
			:class="{'selected':selectedTippingItem == item.item_name}"
			@click="selectedTippingItem = item.item_name">
				<p>{{item.item_name}}</p>
				<img :src="item.img_url" alt="" class="gift">
				<div class="cost">
					<img src="@/static/resources/log.png" alt=""
					v-show="!item.is_log_free" class="cost">
					<img src="@/static/resources/apple.png" alt=""
					v-show="item.is_log_free" class="cost">
					<p v-show="!item.is_log_free">{{item.item_cost}}</p>
					<p v-show="item.is_log_free">{{item.item_cost}}</p>
				</div>
			</div>
		</div>
		<div class="bottomBar">
			<div class="leftBar" @click="selectAmount"> × {{tippingAmount}}</div>
			<div class="rightBar" @click="tipping">打赏</div>
		</div>
		<chunLei-modal v-model="showModal" :mData="inputData" type="input" @onConfirm="onModalConfirm">
		</chunLei-modal>
	</view>
</template>

<script>
	import axios from 'axios'
	export default{
		data(){
			return{
				resources:{
					log:0,apple:0
				},
				tippingList:[],
				selectedTippingItem:"苹果",
				tippingAmount:1,
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
		methods:{
			refreshResources(){
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
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
				for(let item of this.tippingList){
					if(item.item_name == this.selectedTippingItem){
						
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
							_this.$emit("tip", item);
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
				}
			}
		},
		mounted(){
			console.log("load")
			this.refreshResources();
			this.refreshTippingList();
		}
	}
</script>

<style scoped lang="scss">
	.outer{
		background-color: rgb(255, 248, 234);
		div.balance{
			padding:15rpx;
			// border-bottom:solid 0.5rpx rgb(200, 200, 200);
			display:flex;
			font-size:30rpx;
			img{
				height:40rpx;
			}
			span{
				margin-left: 10rpx;
				margin-right: 10rpx;
			}
		}
		div.gifts{
			width:100vw;
			display:flex;
			flex-flow: wrap;
			div.gift{
				display:flex;
				flex-direction: column;
				align-items: center;
				box-sizing: border-box;
				border:solid 3rpx rgb(200, 200, 200);
				height:240rpx;
				width:25vw;
				transition: all .2s;
				img.gift{
					height:150rpx;
				}
				div.cost{
					display:flex;
					margin-top: 5rpx;
					img.cost{
						width:40rpx;
					}
				}
			}
			div.gift.selected{
				box-sizing: border-box;
				border:solid 3rpx #FF007F;
				width:25vw;
			}
		}
		div.bottomBar{
			height:80rpx;
			
			display:flex;
			justify-content: center;
			align-items: center;
			color:white;
			font-size: 35rpx;
			div.leftBar{
				height:80rpx;
				width:30vw;
				color:#713418;
				display:flex;
				justify-content: center;
				align-items: center;
			}
			div.rightBar{
				background-color: #FF007F;
				height:80rpx;
				display:flex;
				width:70vw;
				justify-content: center;
				align-items: center;
			}
		}
	}
</style>
