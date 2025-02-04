<template>
	<view class="outer" :style="{'--statusBarHeight': jsBridge.inApp ? jsBridge.statusBarHeight + 'px' : 0 + 'px'}">
		<!-- 后台按钮组件 -->
		<zetank-backBar textcolor="#000" :showLeft="true" :showTitle="false" navTitle='原木树场'></zetank-backBar>
		<view class="balance">
			<div class="b">
				<img src="../../static/resources/log.png" alt="" />
				<p>{{resources.log}}</p>
			</div>
			<div class="b">
				<img src="../../static/resources/apple.png" alt="" />
				<p>{{resources.apple}}</p>
			</div>
			<div class="b">
				<img src="../../static/resources/cropped_log.webp" alt="" />
				<p>{{resources.cropped_log}}</p>
			</div>
		</view>
		<view class="screen">
			<view v-bind:is="treeType" :state="state"></view>
		</view>
		<view class="btns">
			<button type="default" class="mainBtn" @click="handleMainBtnClick">
				{{btnText}}
			</button>
		</view>
	</view>
</template>

<script>
	import axios from 'axios'
	import defaultTree from "../../components/plantTrees/defaultTree/defaultTree.vue"
	export default{
		components:{
			defaultTree
		},
		data(){
			return{
				treeType:"defaultTree",
				plant_time:Date.now(),
				is_gotten:0,
				state:{},
				btnText:"加载中",
				selectedTreeType:"defaultTree",
				resources:{
					log:0,
					apple:0
				}
			}
		},
		methods:{
			refreshPage(){
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				axios.get(this.$baseUrl + '/treePlant/get_treePlant_of', 
					{
						headers: {
							 'Content-Type': 'application/json',//设置请求头请求格式为JSON
							 'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
						}
					}
				).then((res) => {
					if(res.data.length > 0){
						this.treeType = res.data[0].treeType;
						this.plant_time = res.data[0].plant_time;
						this.is_gotten = res.data[0].is_gotten;
						this.state = res.data[0];
					} else {
						this.treeType = "defaultTree";
						this.plant_time = Date.now();
						this.is_gotten = 0;
						this.state = {
							tree_status:"未种植"
						};
					}
					this.handleData();
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
			handleData(){
				let _this = this;
				if(this.treeType == "defaultTree"){
					if(this.state.tree_status == "未种植"){
						_this.btnText = "种下树苗";
					} else if(this.state.tree_status == "收获"){
						_this.btnText = "再次种树";
					} else {
						_this.btnText = "收获";
					}
				}
			},
			handleMainBtnClick(){
				switch(this.btnText){
					case "加载中":
						uni.showToast({
							title: "加载中",
							icon:'none',
							duration: 2000
						});
						break;
					case "种下树苗":
						this.plantTree();
						break;
					case "收获":
						let _this = this;
						if(this.state.tree_status != "结果"){
							uni.showModal({
								title: '提示',
								content: '你的树还没长成，是否提前收获？',
								confirmColor:"rgb(234, 171, 11)",
								success: function (res) {
									if(res.confirm){
										_this.gotTree();
									}
								},
							})
						} else {
							this.gotTree();
						}
						break;
					default:
						uni.showToast({
							title: "系统出错",
							icon:'none',
							duration: 2000
						});
						break;
				}
			},
			plantTree(){
				uni.showLoading({
					title: '播种中'
				});
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				axios.get(this.$baseUrl + '/treePlant/plant_tree?tree_type=' + this.selectedTreeType, 
				{
					headers: {
					     'Content-Type': 'application/json',//设置请求头请求格式为JSON
					     'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}
				).then((res) => {
					this.refreshPage();
					uni.showToast({
						title: "已种下树苗",
						icon:'none',
						duration: 2000
					});
					this.$forceUpdate();
				}).catch(function (error) {
					uni.showToast({
						title: "尚未收获",
						icon:'none',
						duration: 2000
					});
				}).then(function(){
					uni.hideLoading();
				})
			},
			gotTree(){
				uni.showLoading({
					title: '收获中'
				});
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				axios.get(this.$baseUrl + '/treePlant/got_tree', 
				{
					headers: {
					     'Content-Type': 'application/json',//设置请求头请求格式为JSON
					     'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}
				).then((res) => {
					this.refreshPage();
					this.refreshResources();
					uni.showToast({
						title: res.data,
						icon:'none',
						duration: 2000
					});
					this.$forceUpdate();
				}).catch(function (error) {
					uni.showToast({
						title: "尚未播种",
						icon:'none',
						duration: 2000
					});
				}).then(function(){
					uni.hideLoading();
				})
			},
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
			}
		},
		onShow(){
			uni.showLoading({
				title: '加载中'
			});
			this.refreshPage();
			this.refreshResources();
		}
	}
</script>

<style scoped lang="scss">
	.outer{
		view.screen{
			height:100vh;
			width:100vw;
			overflow: hidden;
			position:absolute;
		}
		view.balance{
			position:absolute;
			width:200rpx;
			height:50vh;
			right:0rpx;
			top:calc(40rpx + var(--statusBarHeight));
			z-index: 5;
			.b{
				width:175rpx;
				height:75rpx;
				border-radius: 30rpx;
				margin-bottom: 25rpx;
				background-color: rgba(0,0,0,.5);
				z-index: 5;
				display:flex;
				line-height: 75rpx;
				color:white;
				font-size: 32rpx;
				img{
					height:45rpx;
					margin:15rpx;
					margin-left:25rpx;
				}
			}
		}
		view.btns{
			height:100vh;
			width:100vw;
			overflow: hidden;
			position:absolute;
			.mainBtn{
				position:absolute;
				bottom:100rpx;
				left:50vw;
				transform: translateX(-50%);
				height:110rpx;
				width:350rpx;
				border-radius: 100rpx;
				background-color:rgb(225, 139, 110);
				font-size: 45rpx;
				color:white;
				transition: all .1s;
			}
			.mainBtn:active{
				transform: translateX(-50%) scale(.85);
				background-color:rgb(180, 111, 88);
			}
		}
	}
</style>
