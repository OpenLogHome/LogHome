<template>
	<view class="content">
			<div class="articles">
				<HM-dragSorts :list="draglist" :isLongTouch="false" :rowHeight="45" @confirm="dragConfirmed">
					<template slot="rowContent" slot-scope="{ row }">
						<view class="row" :style="{'color': row.article_type == 'spliter' ? '#888888' : 'black'}">
							<text class="text">{{row.article_type == 'spliter' ? "分卷符 - " : ""}}{{row.name}}</text>
						</view>
					</template>
				</HM-dragSorts> 
			</div>
	</view>
</template>

<script>
	import axios from 'axios'
	import dragSorts from '../.././uni_modules/HM-dragSorts/components/HM-dragSorts/HM-dragSorts.vue' 
	export default{
		components:{
			dragSorts
		},
		data(){
			return{
				uid:0,
				bookInfo:{},
				articles:[],
				draglist:[]
			}
		},
		onLoad(option){
			uni.showLoading({
				title: '努力加载中'
			});
			if(JSON.stringify(option) == "{}"){
				uni.showToast({
					title: "undefined",
					icon:'none',
					duration: 2000
				});
				return;
			}
			this.uid = option.id;
			this.refreshPage();
		},
		onShow(){
			this.refreshPage();
		},
		methods:{
			refreshPage(){
				const uid = this.uid;
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				let _this = this;
				axios.get(this.$baseUrl + '/essays/get_articles?id=' + uid, 
				{
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}
				).then((res) => {
					this.articles = res.data;
					this.draglist=[];
					this.articles.forEach(item => {
						_this.draglist.push({
							name:item.title,
							article_id:item.article_id,
							article_type: item.article_type,
						})
					})
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
			dragConfirmed(e){
				let startIndex = Math.min(e.index,e.moveTo);
				let endIndex = Math.max(e.index,e.moveTo);
				//对交换结果进行处理，生成最新的列表。
				if(e.index < e.moveTo) {
					for(let i = startIndex ; i < endIndex ; i ++) {
						[this.draglist[i],this.draglist[i+1]] = [this.draglist[i+1],this.draglist[i]]
					}
				} else if(e.index > e.moveTo) {
					for(let i = endIndex - 1 ; i >= startIndex ; i --) {
						[this.draglist[i],this.draglist[i+1]] = [this.draglist[i+1],this.draglist[i]]
					}
				}
				// for(let i = 0;i < this.draglist.length ; i ++) {
				// 	console.log(this.draglist[i].name)
				// }
			}
		},
		//点击完成按钮时，将结果提交到后端。
		onNavigationBarButtonTap(e){
			let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
			let _this = this;
			let sortList = [];
			for(let i = 0 ; i < this.draglist.length ; i ++) {
				sortList.push({
					article_id:this.draglist[i].article_id,
					article_chapter:i + 1
				})
			}
			axios.post(this.$baseUrl + '/essays/resort_article',
				{
					sortlist:JSON.stringify(sortList)
				},
				{
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				},
			)
			.then(function(response) {
				uni.navigateBack({
					
				})
			})
			.catch(function(error) {
				//console.log(error);
				if (error) {
					uni.showToast({
						title: "操作失败",
						icon: 'none',
						duration: 2000
					});
				}
			})
			.then(function(){
				_this.buttonLock = true;
			});
		}
	}
	
</script>

<style scoped lang="less">
	.menuContent{
		display:flex;
		.subTitle{
			width:50vw;
			text-align:center;
			background-color: rgb(255,248,234);
			font-size: 35rpx;
			color:rgb(113, 52, 24);
			line-height: 60rpx;
			.draft{
				font-size: 28rpx;
				margin-left: 10rpx;
				color:rgb(195, 0, 0);
			}
		}
	}
	.titleOuter{
		background-color: rgb(255,248,234);
	}
	.title{
		padding-left:35rpx;
		background-color: rgb(255,248,234);
		font-size: 35rpx;
		font-weight: bold;
		color:rgb(113, 52, 24);
		line-height: 100rpx;
		.draft{
			font-size: 28rpx;
			margin-left: 10rpx;
			color:rgb(195, 0, 0);
		}
	}
	
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-flow: wrap;
		background-color: rgb(255,248,234);
		width:100vw;
		.articles{
			width:100vw;
		}
		div.underBar{
			height: 150rpx
		}
	}
</style>
