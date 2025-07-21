<template>
	<view class="content">
			<div class="articles">
				<uni-collapse accordion>
				    <uni-collapse-item class="titleOuter" v-for="(item,index) in articles" :key="item.time"
						:mainClick="function(){}" :clickInfo="Number(item.article_id)">
						<template v-slot:title>
							<div class="title">{{item.article_title}}</div>
							<div class="miniTitle">
								{{item.text_count}}字 {{new Date(item.time).toLocaleString()}}
							</div>
						</template>
						<view class="menuContent">
							<div class="subTitle" @click="restoreArticle(index)"> 
								<uni-icons type="compose" size="20" color="rgb(113, 52, 24)"/>
								<span>复制到剪贴板</span>
							</div>
							<div class="subTitle" @click="deleteArticle(index)">
								<uni-icons type="trash" size="20" color="rgb(113, 52, 24)"/>
								<span>永久删除</span>
							</div>
							<div class="content_view">
								{{item.article_content}}
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
			uid:-1,
			bookName:"",
			bookInfo:{},
			articles:[],
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
			let dbStatus = window.localStorage.getItem("IndexedDB");
			
			if(this.uid!=-1&& dbStatus == "enabled"){
				
				let version = this.$DBVersion
				let _this = this;
				let IDBOpenDBRequest = indexedDB.open('LogCommunity', version);
				
				var db;
				
				IDBOpenDBRequest.onsuccess=function(e){
					
					db = e.target.result
					
					// 创建一个事务，类型：IDBTransaction，文档地址： https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction
					var transaction = db.transaction('articleBackup', 'readwrite');
					
					// 通过事务来获取IDBObjectStore
					var store = transaction.objectStore('articleBackup');
					
					var index = store.index('article_id');
					var request = index.openCursor(IDBKeyRange.only(_this.uid.toString()));
					
					request.onsuccess = function (e) {
						uni.hideLoading();
						var cursor=e.target.result;
						if(cursor){
							var result=cursor.value;
							_this.articles.push(result);
							console.log(result)
							cursor.continue();
						}
					}
				
				};
					
			}
		},
		restoreArticle(index){
			let content = this.articles[index].article_content;
			uni.setClipboardData({
				data: content,
				success: function () {
				    console.log('success');
				}
			})
		},
		deleteArticle(index){
			
			let _this = this;
			
			uni.showModal({
				title: '提示',
				content: '删除后将无法找回，确定继续吗？',
				confirmColor:"#EA7034",
				success: function (res) {
					
					if(!res.confirm) return;
					
					let version = this.$DBVersion
					
					let IDBOpenDBRequest = indexedDB.open('LogCommunity', version);
					
					var db;
					
					IDBOpenDBRequest.onsuccess=function(e){
						
						db = e.target.result
							
						// 创建一个事务，类型：IDBTransaction，文档地址： https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction
						var transaction = db.transaction('articleBackup', 'readwrite');
							
						// 通过事务来获取IDBObjectStore
						var store = transaction.objectStore('articleBackup');
						
						var request = store.delete(_this.articles[index].history_id);
						
						request.onsuccess = function (event) {
							uni.showToast({
								title: "删除成功",
								icon: 'none',
								duration: 2000
							});
							_this.articles = [];
							_this.refreshPage();
						};
					}
					
				},
			})
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
		}
		.content_view{
			max-height:500rpx;
			overflow:scroll;
			background-color: rgb(255, 242, 217);
			color:rgb(113, 52, 24);
			padding:30rpx;
			text-wrap:break-all;
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
