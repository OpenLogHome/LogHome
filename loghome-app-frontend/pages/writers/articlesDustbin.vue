<template>
	<view class="content">
			<div class="articles">
				<uni-collapse accordion>
				    <uni-collapse-item class="titleOuter" v-for="item in articles" :key="item.article_id"
						:mainClick="function(){}" :clickInfo="item.article_id">
						<template v-slot:title>
							<div class="title">{{item.title}}
								<span class="draft" v-show="item.is_draft == true">草稿</span>
                                <el-tag type="danger" v-if="item.hasWriterModify == true"
                                    style="margin-left:10rpx; transform:translateY(-5rpx)" size="mini">有未发布的编辑</el-tag>
                                <i class="el-icon-loading" v-if="item.isCheckingStatus"
                                    style="margin-left:10rpx; color:#444444;"></i>
							</div>
							<div class="miniTitle">
                                <div v-if="item.hasWriterModify">
                                    {{ item.modifiedTextCount }}字
                                    {{ item.modify_time }}
                                </div>
                                <div v-else>
                                    {{item.text_count}}字 {{utc2beijing(item.update_time)}}
                                </div>
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
import { writerArticleDB } from "../../lib/db.js"
import crypto from 'crypto'

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
		utc2beijing(utc_datetime) {
		    // 转为正常的时间格式 年-月-日 时:分:秒
		    var T_pos = utc_datetime.indexOf('T');
		    var Z_pos = utc_datetime.indexOf('Z');
		    var year_month_day = utc_datetime.substr(0,T_pos);
		    var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
		    var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06
		
		    // 处理成为时间戳
		    let timestamp = new Date(Date.parse(new_datetime));
		    timestamp = timestamp.getTime();
		    timestamp = timestamp/1000;
		
		    // 增加8个小时，北京时间比utc时间多八个时区
		    timestamp = timestamp+8*60*60;
		
		    // 时间戳转为时间
		    var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString("chinese", { hour12: false }).replace(/年|月/g, "-").replace(/日/g, " ");
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
			).then(async (res) => {
				this.articles = res.data;
				uni.setNavigationBarTitle({
					title:"章节回收站"
				});
                await this.checkArticleStatus();
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
        async checkArticleStatus() {
			// 10个10个地并行查询
			const batchSize = 10;
			for (let item of this.articles) {
				this.$set(item, 'isCheckingStatus', true);
			}
			for (let i = 0; i < this.articles.length; i += batchSize) {
				const batch = this.articles.slice(i, i + batchSize);
				// 并行处理当前批次的文章
				await Promise.all(batch.map(item => this._checkArticleStatusSingle(item)));
				this.$forceUpdate();
			}
            this.sortArticles();
		},
        sortArticles() {
            this.articles.sort((a, b) => {
                let timeA = a.sort_time || new Date(a.update_time).getTime();
                let timeB = b.sort_time || new Date(b.update_time).getTime();
                return timeA - timeB;
            });
            this.$forceUpdate();
        },
        async getArticleWriter(articleId) {
			let tk = JSON.parse(window.localStorage.getItem('token')); if (tk) tk = tk.tk;
			let res = await axios.get(this.$baseUrl + '/essays/get_article_writer?id=' + articleId,
				{
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}
			)
			return res;
		},
		getArticleWriterHash(article) {
			if(article.article_writer) {
				return article.article_writer;
			} else {
				return "no data";
			}
		},
        countText(content) {
			let textCount = 0;
			let imageCount = 0;
			for (let item of content) {
				if (item.type == "text") {
					textCount += item.value.length;
				} else if (item.type == "image") {
					imageCount++;
				}
			}
			return {
				textCount: textCount,
				imageCount: imageCount
			}
		},
        async _checkArticleStatusSingle(article) {
			// 查找最近保存的本地文章和云端文章
			const localArticles = await writerArticleDB.articles
				.where('article_id')
				.equals(article.article_id)
				.toArray();
			let latestLocalArticle = null;
			if (localArticles.length > 0) {
				latestLocalArticle = localArticles.reduce((latest, current) => {
					return latest.create_time > current.create_time ? latest : current;
				});
				latestLocalArticle.content_hash = crypto.createHash('md5').update(latestLocalArticle.content).digest('hex');
			}
			let latestRemoteArticle = this.getArticleWriterHash(article);
			if (latestRemoteArticle == "no data") {
				latestRemoteArticle = null;
			}

			let writerArticle = null;

			// 比较本地和云端的文章状态
			if (latestLocalArticle == null && latestRemoteArticle == null) {
				// 本地和云端都没有保存过文章
			} else if (latestLocalArticle == null) {
				writerArticle = latestRemoteArticle;
				// 本地没有保存过文章，但是云端有保存过文章
			} else if (latestRemoteArticle == null) {
				writerArticle = latestLocalArticle;
				// 本地有保存过文章，但是云端没有保存过文章
			} else {
				// 本地和云端都有保存过文章
				// 比较本地和云端的文章内容
				if (latestLocalArticle.content_hash != latestRemoteArticle.content_hash) {
					writerArticle = latestRemoteArticle;
					// 本地和云端的文章内容不一致
				} else {
					writerArticle = latestLocalArticle;
				}
			}

			if (writerArticle != null) {
				if (writerArticle.content_hash != article.content_hash) {
					if(!writerArticle.content) {
                        try {
                            writerArticle.content = (await this.getArticleWriter(article.article_id)).data.content;
                        } catch(e) {
                            console.error(e);
                        }
                    }
                    if(writerArticle.content) {
                        article.hasWriterModify = true;
                        // 将writerArticle.create_time原本的YYYYMMDDhhmmss格式调整为YYYY/MM/DD hh:mm:ss
                        article.modify_time = Number(writerArticle.create_time.substring(0, 4)) + "/" +
                            Number(writerArticle.create_time.substring(4, 6)) + "/" +
                            Number(writerArticle.create_time.substring(6, 8)) + " " +
                            writerArticle.create_time.substring(8, 10) + ":" +
                            writerArticle.create_time.substring(10, 12) + ":" +
                            writerArticle.create_time.substring(12, 14);

                        // 统计字数
                        try {
                            let { textCount, imageCount } = this.countText(JSON.parse(writerArticle.content));
                            article.title = writerArticle.title;
                            article.modifiedTextCount = textCount;
                            article.modifiedImageCount = imageCount;
                        } catch(e) {
                            // ignore parse error
                        }
                        
                        // Set sort time
                        const y = writerArticle.create_time.substring(0, 4);
                        const m = writerArticle.create_time.substring(4, 6);
                        const d = writerArticle.create_time.substring(6, 8);
                        const h = writerArticle.create_time.substring(8, 10);
                        const min = writerArticle.create_time.substring(10, 12);
                        const s = writerArticle.create_time.substring(12, 14);
                        article.sort_time = new Date(y, m-1, d, h, min, s).getTime();
                    }
				}
			}
            
            // 如果没有writer记录或者内容一致，则使用update_time作为排序依据
            if(!article.sort_time) {
                // utc2beijing returns string, we need raw timestamp
                article.sort_time = new Date(article.update_time).getTime();
            }

			this.$set(article, 'isCheckingStatus', false);
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
