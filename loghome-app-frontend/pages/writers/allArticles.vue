<template>
	<view class="content" :style="{'--statusBarHeight': jsBridge.inApp ? jsBridge.statusBarHeight + 'px' : 0 + 'px'}">
			<div class="articles">
				<uni-collapse accordion @touchstart.native="touchstart" @touchend.native="touchend" @touchmove.native="touchmove">
				    <uni-collapse-item class="titleOuter" v-for="item in shownArticles"
						:key="item.article_id"
						:mainClick="gotoEditor" :clickInfo="item" 
						:style="{backgroundColor:item.article_type == 'spliter' ? '#dddddd' : '#ffffff'}">
						<template v-slot:title>
							<div class="title" :style="{'color':item.article_type == 'spliter' ? '#444444' : '#763a18'}">
								{{item.title}}
								<el-tag type="success" v-show="item.article_type == 'worldOutline'" effect="dark"
								style="margin-left:10rpx; transform:translateY(-5rpx)" size="mini">大纲</el-tag>
								<el-tag type="success" v-show="item.article_type == 'worldVocabulary'" effect="dark"
								style="margin-left:10rpx; transform:translateY(-5rpx)" size="mini">词条</el-tag>
								<el-tag type="info" v-show="item.article_type == 'spliter'" effect="dark"
								style="margin-left:10rpx; transform:translateY(-5rpx)" size="mini">分卷</el-tag>
								<el-tag type="danger" v-show="item.is_draft == true" effect="dark"
								style="margin-left:10rpx; transform:translateY(-5rpx)" size="mini">草稿</el-tag>
							</div>
							<div class="miniTitle">
								<div v-show="item.article_type != 'spliter'">
									{{item.text_count}}字 {{utc2beijing(item.update_time)}}
								</div>
							</div>
						</template>
						<view class="menuContent">
							<navigator @click="gotoEditor(item)">
								<div class="subTitle"> 
									<uni-icons type="compose" size="20" color="rgb(113, 52, 24)"/>
									<span>编辑{{item.article_type == 'spliter'?"分卷信息":""}}</span>
								</div>
							</navigator>
							<navigator :url="'../readers/article?id=' +  item.article_id"
									   open-type="navigate" v-show="item.is_draft == false">
								<div class="subTitle"> 
									<uni-icons type="eye" size="20" color="rgb(113, 52, 24)"/>
									<span>阅读</span>
								</div>
							</navigator>
							<navigator :url="'./localBackup?id=' +  item.article_id"
									   open-type="navigate" v-show="item.article_type != 'spliter'">
								<div class="subTitle"> 
									<uni-icons type="loop" size="20" color="rgb(113, 52, 24)"/>
									<span>本地备份</span>
								</div>
							</navigator>
							<div class="subTitle" @click="deleteArticle(item.article_id)">
								<uni-icons type="trash" size="20" color="rgb(113, 52, 24)"/>
								<span>删除{{item.article_type == 'spliter'?"分卷":""}}</span>
							</div>
						</view>
				    </uni-collapse-item>
				</uni-collapse>
				<div class="newArticle" v-show="novel.novel_type != 'world'">
					<div class="tit" style="background-color: #f2f2f2; padding: 5rpx 35rpx; color:#444444">新增普通章节</div>
					<div class="share">
						<div class="add richArticle" @click="addArticle('richtext')">
							+ 章节
						</div>
					</div>
					<div class="monopolize" v-show="bookPart.currentPart.id == -1">
						<div class="add split" @click="addArticle('spliter')">
							+ 分卷
						</div>
					</div>
				</div>
				<div class="newArticle" v-show="novel.novel_type == 'world'">
					<div class="tit" style="background-color: #f2f2f2; padding: 5rpx 35rpx; color:#444444">新增设定章节</div>
					<div class="share">
						<div class="add commonArticle" @click="addArticle('worldOutline')">
							+ 世界大纲
						</div>
						<div class="add richArticle" @click="addArticle('worldVocabulary')">
							+ 世界词条
						</div>
					</div>
					<div class="monopolize" v-show="bookPart.currentPart.id == -1">
						<div class="add split" @click="addArticle('spliter')">
							+ 分卷
						</div>
					</div>
				</div>
			</div>
			<uni-popup ref="setPopup" type="top" style="z-index:101" background-color="fff2d9">
				<div class="bookParts">
					<navigator v-for="(item, index) in bookPart.parts" :key="index" @click="changeBookPart(item)">  
						<div class="part" :class="{'selected': item.id == bookPart.currentPart.id}">
							<div class="partTitle">{{item.name}}</div>
						</div>
					</navigator>
				</div>
			</uni-popup>
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
			worldId:0,
			bookName:"",
			novel:{},
			articles:[],
			shownArticles:[],
			bookPart:{
				currentPart:{id: -1, name: "全部分卷"},
				parts:[],
				btnOpened:false
			},
			titleBtn:undefined,
			startTouchX: 0,
			startTouchY: 0,
			touchNotMoved: true
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
		this.worldId = option.worldId;
		this.refreshPage(true);
	},
	onShow(){
		this.refreshPage();
		setTimeout(()=>{
			this.titleBtn = document.getElementsByClassName("uni-page-head__title")[0];
			this.titleBtn.addEventListener("click",this.toggleTitleBtn);
			this.titleBtn.style.fontSize = "17px";
		},200)
	},
	beforeDestroy(){
		this.titleBtn.removeEventListener("click",this.toggleTitleBtn);
	},
	methods:{
		toggleTitleBtn(){
			if(!this.bookPart.btnOpened){
				this.$refs.setPopup.open('top');
			} else {
				this.$refs.setPopup.close();
			}
			this.bookPart.btnOpened = !this.bookPart.btnOpened;
		},
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
		    var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString("chinese",{ hour12: false }).replace(/年|月/g, "-").replace(/日/g, " ");
		    return beijing_datetime; // 2017-03-31 16:02:06
		},
		refreshPage(changeToNewestBookPart){
			uni.showLoading({
				title: '加载中'
			});
			//清除文章排序信息，该功能应当被移除！
			window.localStorage.removeItem('articleSortSetting');
			
			const uid = this.uid;
			let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;
			
			axios.get(this.$baseUrl + '/essays/get_novel_by_id?id=' + uid, {}).then((res) => {
				this.novel = res.data[0];
			}).catch(function(error) {
				uni.showToast({
					title: error.toString(),
					icon: 'none',
					duration: 2000
				});
			}).then(function() {})
			
			axios.get(this.$baseUrl + '/essays/get_articles?id=' + uid, 
			{
				headers: {
					'Content-Type': 'application/json', //设置请求头请求格式为JSON
					'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
				}
			}
			).then((res) => {
				this.articles = res.data;
				this.refreshBookPart();
				if(changeToNewestBookPart){
					// 判断并打开最新的分卷
					this.changeBookPart(this.bookPart.parts[this.bookPart.parts.length - 1]);
				}
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
		addArticle(type){
			// 新增文章分两步，第一步如果不在全部分卷中，则需要先将后面的文章后移。
			// 然后再新增这个文章。
			let _this = this;
			let insertChapter;
			let sortList = [];
			let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
			if(_this.bookPart.currentPart.id != -1){
				let index = 0;
				for(index = 0; index < _this.articles.length; index ++){
					let item = _this.articles[index];
					sortList.push({
						article_id:item.article_id,
						article_chapter:index + 1
					})
					if(item.article_id == _this.bookPart.currentPart.id){
						index ++;
						break;
					}
				}
				for(; index < _this.articles.length; index ++){
					let item = _this.articles[index];
					if(item.article_type == "spliter"){
						break;
					}
					sortList.push({
						article_id:item.article_id,
						article_chapter:index + 1
					})
				}
				// 从这里开始向后调整
				insertChapter = index + 1;
				for(; index < _this.articles.length; index ++){
					let item = _this.articles[index];
					sortList.push({
						article_id:item.article_id,
						article_chapter:index + 2
					})
				}
				// 调整章节顺序
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
					return;
				})
			} else {
				insertChapter = _this.articles.length + 1;
			}
			if(type != undefined){
				let typeInfo = {
					"richtext":{
						title: "新章节",
						content: "[]",
						name: "章节",
						is_draft: 1
					},
					"spliter":{
						title: "新分卷",
						content: "",
						name: "分卷",
						is_draft: 0
					},
					"worldOutline":{
						title: "新世界大纲",
						content: "新世界大纲",
						name: "世界大纲",
						is_draft: 1
					},
					"worldVocabulary":{
						title: "新世界词条",
						content: "{}",
						name: "世界词条",
						is_draft: 1
					},
				}
				if(typeInfo[type] != undefined){
					axios.post(_this.$baseUrl + '/essays/add_article',
						{
							title: typeInfo[type].title,
							content: typeInfo[type].content,
							article_type: type,
							id:_this.uid,
							article_chapter:insertChapter,
							is_draft: typeInfo[type].is_draft
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
							title: typeInfo[type].name + "新增成功",
							icon: 'none',
							duration: 2000
						});
						_this.refreshPage();
					})
					.catch(function(error) {
						if (error) {
							uni.showToast({
								title: typeInfo[type].name +  "新增失败",
								icon: 'none',
								duration: 2000
							});
						}
					})
					.then(function(){
						_this.buttonLock = true;
					});
				}
				return;
			}
		},
		deleteArticle(article_id){
			let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
			let _this = this;
			uni.showModal({
				title: '提示',
				content: '删除后，可通过章节回收站找回。',
				confirmColor:"#EA7034",
				success: function (res) {
					if (res.confirm) {
						axios.post(_this.$baseUrl + '/essays/delete_article',
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
							let sortList = [];
							let chapter = 0;
							for(let i = 0 ; i < _this.articles.length - 1; i ++) {
								if(_this.articles[i].article_id != article_id){
									chapter ++;
									sortList.push({
										article_id:_this.articles[i].article_id,
										article_chapter:chapter
									})
								}
							}
							
							axios.post(_this.$baseUrl + '/essays/resort_article',
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
								uni.showToast({
									title: "已删除章节",
									icon: 'none',
									duration: 2000
								});
								_this.refreshPage();
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
							

						})
						.catch(function(error) {
							console.log(error);
							if (error) {
								uni.showToast({
									title: "章节删除失败",
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
		changeSpliterName(id, content){
			let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
			let _this = this;
			axios.post(this.$baseUrl + '/essays/modify_article',
				{
					title:content,
					content:"",
					is_draft:0,
					article_id:id
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
					title: "修改成功",
					icon: 'none',
					duration: 2000
				});
				_this.refreshPage();
			})
			.catch(function(error) {
				//console.log(error);
				if (error) {
					uni.showToast({
						title: "修改失败，请重试",
						icon: 'none',
						duration: 2000
					});
				}
			})
		},
		gotoEditor(item){
			if(item.article_type == "spliter"){
				uni.showModal({
				    title: '修改分卷名',
				    content: '',
					editable:true,
					placeholderText:"输入分卷名",
				    success: (res) => {
				        if (res.confirm) {
							this.changeSpliterName(item.article_id, res.content)
						}
						else if (res.cancel) {
				        }
				    }
				});
			} else if(item.article_type == "worldVocabulary"){
				uni.navigateTo({
					url:'./worldVocabularyEditor?id=' +  item.article_id
				})
			} else {
				uni.navigateTo({
					url:'./chapterEditor?id=' +  item.article_id
				})
			}
		},
		refreshBookPart(){
			this.bookPart.parts = [{
				id: -1,
				name: "全部分卷"
			}];
			for(let item of this.articles){
				if(item.article_type == "spliter"){
					this.bookPart.parts.push({
						id: item.article_id,
						name: item.title
					});
				}
			}
			if(this.bookPart.currentPart.id != -1){
				// 检查当前的bookPart是否还在，不在的话就转回默认
				let exist = false;
				for(let item of this.bookPart.parts){
					if(item.id == this.bookPart.currentPart.id){
						exist = true;
					}
				}
				if(exist) {
					this.changeBookPart(this.bookPart.currentPart)
				} else {
					this.changeBookPart({id:-1, name:"全部分卷"})
				}
			} else {
				this.changeBookPart({id:-1, name:"全部分卷"})
			}
		},
		exportNovel(){
			uni.showLoading({
				title: '导出中，请稍候...'
			});
			const uid = this.uid;
			let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;
			axios.get(this.$baseUrl + '/essays/export_novel?id=' + uid,
			{
				headers: {
					'Content-Type': 'application/json', //设置请求头请求格式为JSON
					'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
				}
			}
			).then((res) => {
				uni.showModal({
					title: '提示',
					content: '已经开始导出作品，导出完成后将通过“我的”->“我的通知”提示，请关注。',
					showCancel: false,
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
		touchstart(ev) {
			let that = this;
			this.startTouchX = ev.touches[0].pageX;
			this.startTouchY = ev.touches[0].pageY;
			this.touchNotMoved = true;
			clearInterval(this.Loop); //再次清空定时器，防止重复注册定时器
			this.Loop = setTimeout(function() {
				if(this.touchNotMoved){
					uni.navigateTo({
						url:"./sortArticles?id=" + that.uid
					})
				}
				that.touchend();
			}.bind(this), 500);
		},
		touchmove(ev) {
			let w = this.startTouchX - ev.touches[0].pageX;
			let h = this.startTouchY - ev.touches[0].pageY;
			if(w*w + h*h > 50){
				this.touchNotMoved = false;
			}
		},
		touchend() {
			clearInterval(this.Loop);
		},
		changeBookPart(bookPart){
			this.bookPart.currentPart = bookPart;
			// 如果不是全部分卷，则只显示当前选择的分卷
			this.shownArticles = [];
			if(bookPart.id != -1){
				let startSpliter = false;
				for(let item of this.articles){
					if(item.article_type == "spliter" && startSpliter){
						break;
					}
					if(item.article_id == bookPart.id)
						startSpliter = true;
					if(startSpliter){
						this.shownArticles.push(item);
					}
				}
			} else {
				this.shownArticles = this.articles;
			}
			this.bookPart.btnOpened = false;
			this.$refs.setPopup.close();
			this.$forceUpdate();
		}
	},
	onNavigationBarButtonTap(e) {
		let _this = this;
		if(e.text=="\ue790 "){
			if(this.novel.novel_type == "world"){
				uni.showActionSheet({
				    itemList: ['章节排序',"章节回收站","查看世界","世界设置"],
				    success: function (res) {
				        if(res.tapIndex == 0) {
							uni.navigateTo({
								url:"./sortArticles?id=" + _this.uid
							})
						}
						if(res.tapIndex == 1) {
							uni.navigateTo({
								url:"./articlesDustbin?id=" + _this.uid
							})
						}
						if(res.tapIndex == 2) {
							uni.navigateTo({
								url:"../worlds/worldPage?id=" + _this.worldId
							})
						}
						if(res.tapIndex == 3) {
							uni.navigateTo({
								url:"./essaySet?id=" + _this.uid
							})
						}
				    },
				    fail: function (res) {
				        console.log(res.errMsg);
				    }
				});
			} else {
				uni.showActionSheet({
				    itemList: ['章节排序',"章节回收站","阅读","作品设置","导出作品"],
				    success: function (res) {
				        if(res.tapIndex == 0) {
							uni.navigateTo({
								url:"./sortArticles?id=" + _this.uid
							})
						}
						if(res.tapIndex == 1) {
							uni.navigateTo({
								url:"./articlesDustbin?id=" + _this.uid
							})
						}
						if(res.tapIndex == 2) {
							uni.navigateTo({
								url:"../readers/bookInfo?id=" + _this.uid
							})
						}
						if(res.tapIndex == 3) {
							uni.navigateTo({
								url:"./essaySet?id=" + _this.uid
							})
						}
						if(res.tapIndex == 4) {
							_this.exportNovel();
						}
				    },
				    fail: function (res) {
				        console.log(res.errMsg);
				    }
				});
			}
		}
	},
	watch:{
		bookPart:{
			handler:function(newValue,oldValue){
				let _this = this;
				uni.setNavigationBarTitle({
					title:_this.bookPart.currentPart.name + (_this.bookPart.btnOpened?" ▴":" ▾")
				});
			},
			deep:true,
			immediate:true
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
			background-color: rgb(244, 244, 244);
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
		background-color: rgb(255, 255, 255);
	}
	
	.title{
		margin-top: 20rpx;
		padding-left:35rpx;
		font-size: 35rpx;
		font-weight: bold;
		color:rgb(113, 52, 24);
		line-height: 35rpx;
		.draft{
			font-size: 28rpx;
			margin-left: 10rpx;
			color:rgb(195, 0, 0);
		}
		.specialType{ 
			font-size: 28rpx;
			margin-left: 10rpx;
			color:rgb(130, 0, 195);
		}
	}
	
	.title.last{
		margin-top: 40rpx;
		margin-bottom: 40rpx;
	}
	
	.newArticle{
		margin-top:10rpx;
		background-color: rgb(255, 255, 255);
		div.add{
			width:100%;
			margin:10rpx 0;
			margin-left:34rpx;
			padding:20rpx;
			font-size:32rpx;
			color:#713418;
			background-color: rgb(236, 236, 236);
			border-radius: 14rpx;
			text-align: center;
			transition: all .3s;
		}
		div.add:active{
			transform:scale(.95);
			filter:brightness(.9);
		}
		.share{
			display:flex;
			div.add:last-child{
				margin-right:34rpx;
			}
		}
		.monopolize{
			display:flex;
			width:100%;
			div.add{
				width:100%;
				margin-right:34rpx;
			}
		}
	}
	
	.miniTitle{
		padding-left:35rpx;
		font-size: 30rpx;
		color:rgb(134, 133, 132);
		line-height: 50rpx;
		margin-bottom: 10rpx;
		.openBtn{
		}
	}
	
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-flow: wrap;
		background-color: #f2f2f2;
		width:100vw;
		.articles{
			width:100%;
			.article{
				border-bottom: #f2f2f2 1rpx solid;
			}
			
		}
		div.underBar{
			height: 150rpx
		}
	}
	
	.bookParts{
		width:100%;
		margin-top: var(--statusBarHeight);
		.part{
			padding-left:35rpx;
			border-bottom: #cacaca 1rpx solid;
			background-color: #dddddd !important;
			.partTitle{
				font-size: 35rpx;
				color:#444444;
				line-height: 80rpx;
			}
		}
		.part.selected{
			background-color: #ffffff !important;
			.partTitle{
				color:#222222;
				font-weight: bold;
			}
		}
		
	}
</style>
