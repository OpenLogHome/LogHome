<template>
	<view class="content">
			<div class="articles">
				<uni-collapse accordion>
				    <uni-collapse-item class="titleOuter" v-for="item in articles" :key="item.article_id"
						:mainClick="function(){}" :clickInfo="item.article_id">
						<template v-slot:title>
							<div class="title">{{item.title}}
								<span class="draft" v-show="item.is_draft == true">草稿</span>
							</div>
							<div class="miniTitle">
								{{item.text_count}}字 {{utc2beijing(item.update_time)}}
							</div>
						</template>
						<view class="menuContent">
							<div class="subTitle" @click="restoreArticle(item.article_id)"> 
								<uni-icons type="loop" size="20" color="rgb(113, 52, 24)"/>
								<span>恢复</span>
							</div>
							<div class="subTitle" @click="deleteArticle(item.article_id)">
								<uni-icons type="trash" size="20" color="rgb(113, 52, 24)"/>
								<span>永久删除</span>
							</div>
						</view>
				    </uni-collapse-item>
				</uni-collapse>
			</div>
	</view>
</template>

<script>
import axios from 'axios'
import uniCollapse from '../../uni_modules/uni-collapse/components/uni-collapse/uni-collapse.vue'
import uniCollapseItem from '../../uni_modules/uni-collapse/components/uni-collapse-item/uni-collapse-item.vue'
import uniIcons from '../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue'
export default{
	components:{
		uniCollapse,uniCollapseItem,uniIcons
	},
	data(){
		return{
			uid:0,
			bookName:"",
			bookInfo:{},
			articles:[]
		}
	},
	onLoad(option){
		uni.showLoading({
			title: '加载中'
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
		refreshPage(){
			const uid = this.uid;
			let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
			axios.get(this.$baseUrl + '/essays/get_articles_deleted?id=' + uid, 
			{
				headers: {
					'Content-Type': 'application/json', //设置请求头请求格式为JSON
					'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
				}
			}
			).then((res) => {
				this.articles = res.data;
				uni.setNavigationBarTitle({
					title:"章节回收站"
				});
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
		restoreArticle(article_id){
			let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
			let _this = this;
			uni.showModal({
				title: '提示',
				content: '确认要恢复吗？',
				confirmColor:"#EA7034",
				success: function (res) {
					if (res.confirm) {
						axios.post(_this.$baseUrl + '/essays/restore_deleted',
							{
								id:article_id
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
								title: "已恢复",
								icon: 'none',
								duration: 2000
							});
							
							_this.refreshPage();
			
						})
						.catch(function(error) {
							console.log(error);
							if (error) {
								uni.showToast({
									title: "恢复失败",
									icon: 'none',
									duration: 2000
								});
							}
						})
						.then(function(){
							_this.buttonLock = true;
						});
					} else if (res.cancel) {
						return;
					}
				}
			});
		},
		deleteArticle(article_id){
			let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
			let _this = this;
			uni.showModal({
				title: '提示',
				content: '删除后将无法找回，确定继续吗？',
				confirmColor:"#EA7034",
				success: function (res) {
					if (res.confirm) {
						axios.post(_this.$baseUrl + '/essays/delete_forever',
							{
								id:article_id
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
								title: "已删除",
								icon: 'none',
								duration: 2000
							});
							
							_this.refreshPage();

						})
						.catch(function(error) {
							console.log(error);
							if (error) {
								uni.showToast({
									title: "删除失败",
									icon: 'none',
									duration: 2000
								});
							}
						})
						.then(function(){
							_this.buttonLock = true;
						});
					} else if (res.cancel) {
						return;
					}
				}
			});
		}
	}
}
</script>

<style scoped lang="less">
	.menuContent{
		display:flex;
		flex-direction:column;
		.subTitle{
			line-height: 80rpx;
			height:80rpx;
			text-align:center;
			background-color: rgb(255, 242, 217);
			border-bottom: #bec3ca 1px solid;
			font-size: 35rpx;
			color:rgb(113, 52, 24);
			span{
				margin-left: 10rpx;
			}
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
		margin-top: 20rpx;
		padding-left:35rpx;
		background-color: rgb(255,248,234);
		font-size: 35rpx;
		font-weight: bold;
		color:rgb(113, 52, 24);
		line-height: 35rpx;
		.draft{
			font-size: 28rpx;
			margin-left: 10rpx;
			color:rgb(195, 0, 0);
		}
	}
	
	.title.last{
		margin-bottom: 20rpx;
	}
	
	.miniTitle{
		padding-left:35rpx;
		font-size: 30rpx;
		color:rgb(134, 133, 132);
		line-height: 50rpx;
		margin-bottom: 10rpx;
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
			width:100%;
			.article{
				border-bottom: #cacaca 1rpx solid;
			}
			
		}
		div.underBar{
			height: 150rpx
		}
	}
</style>
