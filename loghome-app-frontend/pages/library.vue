<template>
	<view class="content" :style="{'--statusBarHeight': jsBridge.inApp ? jsBridge.statusBarHeight + 'px' : 0 + 'px'}">
		<div class="searchBarUnder">
			<uni-search-bar bgColor="#f2f2f2" :radius="8"
							placeholder = "搜索书库或输入传送ID" cancelButton="none">
			</uni-search-bar>
		</div>
		<div class="searchBar">
			<uni-search-bar bgColor="#f2f2f2" :radius="8" @input="searchLibrary" 
							placeholder = "搜索书库或输入传送ID" cancelButton="none" class="searchBarBox">
				<img src="../static/icons/icon_search.png" alt="" slot="searchIcon" style="height:25px;"/>
				<img src="../static/icons/icon_r_x.png" alt="" slot="clearIcon" style="height:20px;"/>
			</uni-search-bar>
			<uni-icons type="chat" size="26" :color="'#2d2d2d'" class="messageIcon" @click="gotoMessage"></uni-icons>
		</div>
		<popup class="popup" type="5" v-if="appUpdate.hasUpdate" :version="appUpdate.version" :content="appUpdate.desc" @close="closeMask()" @eventClick="update()"></popup>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :fixed="false" :height="'100%'">
			<div class="swiper" v-show="keyword.length == 0">
				<Xsuu-swiper :swiperItems="newchartList" :margin="18" 
				:borderRadius="10" @clicked="roulousChartClicked"
				class="swiperImgs">
				</Xsuu-swiper>
				<div class="swiperNav">
					<div class="navBtn">
						<img src="../static/swiperNavIcons/category.png" alt="标签" @click="navBarJump('标签')"/>
						<div class="name">标签</div>
					</div>
 					<div class="navBtn">
						<img src="../static/swiperNavIcons/activity.png" alt="活动" @click="navBarJump('活动')"/>
						<div class="name">活动</div>
					</div>
 					<div class="navBtn">
						<img src="../static/swiperNavIcons/ranks.png" alt="排行" @click="navBarJump('排行')"/>
						<div class="name">排行</div>
					</div>
					<div class="navBtn">
						<img src="../static/swiperNavIcons/recommands.png" alt="推荐" @click="navBarJump('推荐')"/>
						<div class="name">推荐</div>
					</div>
					<div class="navBtn">
						<img src="../static/swiperNavIcons/finish.png" alt="完结" @click="navBarJump('完结')"/>
						<div class="name">完结</div>
					</div>
				</div>
			</div>
			
			
			<div class="card" v-for="(item,index) in collections" v-show="keyword.length == 0">
				<div class="head" @click="gotoCollections(item.collection_title)">
					<div class="title">
						<p>
							{{item.collection_title}}
						</p>
						<div class="lightLine"></div>
						<log-image :src="item.icon" alt="" class="icon" v-show="item.icon!=''"/>
					</div>
					<div class="more" >
						<uni-icons type="right" size="20" :color="'rgb(142,130,109)'"></uni-icons>
					</div>
				</div>
				
				<div class="novels-slide" v-if="item.collection_type=='slide'" style="min-height: 200rpx;">
					<transition-group name="fade" class="transition" type="in-out">
						<bookInCase v-for="novel in item['novels']" :bookName="novel.name" 
						:picUrl="novel.picUrl" :key="novel.novel_id"
						@click.native="readBook(novel.novel_id)"></bookInCase>
					</transition-group>
				</div>
				<div class="novel-lists" v-else-if="item.collection_type=='cards'" style="min-height: 200rpx;">
					<transition-group name="fade" class="transition" type="in-out">
						<div v-for="novel in item['novels'].slice(0,4)" :key="novel.novel_id">
							<navigator :url="'./readers/bookInfo?id=' +  novel.novel_id"
												   open-type="navigate" class="books">
								<log-image :src="novel.picUrl + '?thumbnail=1'" alt=""
								:onerror="`onerror=null;src='`+ $backupResources.bookCover +`'`" style="border-radius: 10rpx; transform:scale(.90)"/>
								<div class="bookInfo" style="margin-left:10rpx;">
									<div class="title">
										{{novel.name}}
										<el-tag type="warning" v-show="novel.novel_type == 'world'" effect="dark"
										style="margin-left:10rpx; transform:translateY(-5rpx)" size="mini">世界设定</el-tag>
									</div>
									<view class="author">
										<log-image :src="novel.avatar_url" alt="" class="auther_avatar"
										onerror="onerror=null;src='../static/user/defaultAvatar.jpg'"/>
										<div class="auther_name">{{novel.user_name}}</div>
									</view>
									<div class="description">{{novel.content}}</div>
								</div>
							</navigator>
						</div>
					</transition-group>
				</div>
				
			</div>
			
			<div v-for="item in [...searchBooks,...books]" :key="item.book_id">
				<navigator :url="'./readers/bookInfo?id=' +  item.novel_id"
									   open-type="navigate" class="books">
					<log-image :src="item.picUrl + '?thumbnail=1'" alt=""
					:onerror="`onerror=null;src='`+ $backupResources.bookCover +`'`"/>
					<div class="bookInfo">
						<div class="title">
							{{item.name}}
						</div>
						<view class="author">
							<log-image :src="item.auther_avatar" alt="" class="auther_avatar"
							onerror="onerror=null;src='../static/user/defaultAvatar.jpg'"/>
							<div class="auther_name">{{item.author_name}}</div>
						</view>
						<div class="description">{{item.content}}</div>
					</div>
				</navigator>
			</div>
			
			<div class="underBar"></div>
		</mescroll-body>
	</view>
</template>

<script>	
	import axios from 'axios'
	import bookInCase from '../components/book_in_case.vue'
	import popup from "@/components/ge-popup.vue"
	import XsuuSwiper from "../components/Xss-swiper/Xsuu-swiper.vue"
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		components:{
			bookInCase,popup,XsuuSwiper
		},
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				books: [],
				chartList:[],
				newchartList:[],
				collections:[],
				timer:undefined,
				searchBooks:[],
				keyword:"",
				appUpdate:{
					hasUpdate: false,
					version:'1.0',
					desc:'1.更新内容更新内容 <br/> 2.更新内容更新内容 <br/>2.更新内容更新内容',
					update_url:""
				},
			}
		},
		onLoad(){
		},
		onShow() {
		},
		methods: {
			mescrollInit(mescroll){
				this.mescroll = mescroll;
			},
			downCallback(){
				this.mescroll.resetUpScroll();
				this.refreshPage();
				this.checkUpdate();
				this.checkAncientVersion();
				this.refreshRecommends();
				this.books = [];
				// if(this.jsBridge.inApp){
				// 	this.jsBridge.vibrate();
				// }
			},
			upCallback(){
				this.getMoreNovels();
			},
			//刷新页面
			async refreshPage() {
				//刷新轮播图
				let _this = this;
				axios.get(this.$baseUrl + '/library/get_library_roulous_chart', {}).then((res) => {
					this.chartList = res.data;
					_this.newchartList = [];
					for(let item of _this.chartList){
						if(item.isValid == 1){
							_this.newchartList.push({
								img:item.image,
								title:item.title,
								Subtitle:item.name,
								button:(item.navigate_to == "None")?0:1,
								navigate_to:item.navigate_to
							})
						}
					}
					setTimeout(()=>{
						this.mescroll.endSuccess();
					},1000);
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
					this.mescroll.endErr();
				}).then(function(){
					
				})
			},
			async getMoreNovels(){
				//获取更多小说
				axios.get(this.$baseUrl + '/library/get_novels_all', {}).then((res) => {
					this.books = [...this.books,...res.data];
					setTimeout(()=>{
						this.mescroll.endSuccess();
					},1000);
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
					this.mescroll.endErr();
				}).then(function(){
					uni.hideLoading();
				})
			},
			//响应轮播图点击事件
			roulousChartClicked(item){
				if(item.navigate_to && item.navigate_to !="None"){
					uni.navigateTo({
						url:item.navigate_to
					})
				}
			},
			//响应进入书籍详情页面事件
			readBook(novel_id) {
				if(novel_id > 0) {
					uni.navigateTo({
						url:'./readers/bookInfo?id=' +  novel_id
					})
				}
			},
			//刷新推荐
			refreshRecommends(){
				// 获取所有推荐集合
				let _this = this;
				axios.get(this.$baseUrl + '/library/recommand/get_library_collections', {}).then((res) => {
					_this.collections = res.data;
					//获取每个推荐集合中的推荐作品
					for(let item of _this.collections){
						_this.$set(item,'novels',[])
						axios.get(_this.$baseUrl
						+ '/library/recommand/get_library_recommend_titles?title='
						+ item.collection_title+"&page=1&amount=10", {}).then((res) => {
							_this.$set(item,'novels',res.data);
						}).catch(function (error) {
							uni.showToast({
								title: error.toString(),
								icon:'none',
								duration: 2000
							});
						}).then(function(){
							
						})
					}
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
				}).then(function(){
					
				})
			},
			// 搜索图书馆
			searchLibrary(e){
				clearTimeout(this.timer);
				let _this = this;
				this.keyword = e;
				// 这里使用延时节流
				this.timer= setTimeout(()=>{
					axios.get(_this.$baseUrl + '/library/get_novels_search?keyword=' + e, {}).then((res) => {
						_this.searchBooks = res.data;
						if(!isNaN(parseInt(_this.keyword)) && res.data.length != 0){
							_this.books = [];
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
				},500)
			},
			//前往推荐集合的详情界面
			gotoCollections(title){
				uni.navigateTo({
					url:'./readers/collections?title=' +  title
				})
			},
			closeMask(){//关闭弹窗
				this.appUpdate.hasUpdate=false;
			},
			update(){//前往新版本下载页面
				if (this.jsBridge && this.jsBridge.inApp) {
					this.jsBridge.openInBrowser(this.appUpdate.update_url);
				}
			},
			//检查更新
			checkUpdate(){
				let _this = this;
				let isApp = this.jsBridge.inApp && this.jsBridge.inApp;
				if(!isApp) return;
				let appVersion = this.$store.state.appVersion;
				console.log(appVersion);
				axios.get(this.$baseUrl + '/app/get_app_update', {}).then((res) => {
					if(res.data[0].version > appVersion){
						_this.appUpdate.hasUpdate = true;
						_this.appUpdate.version = res.data[0].version;
						_this.appUpdate.desc = res.data[0].version_info;
						_this.appUpdate.update_url = res.data[0].update_url;
					} else if(res.data[0].version < appVersion){
						_this.$alert(`您使用的版本为非正式版本，可能存在各种问题，如发现请向开发人员反馈，感谢您参与原木社区内测活动！`, '内测版本提示', {
							  confirmButtonText: '确定',
							  dangerouslyUseHTMLString:true,
						  callback: action => {
						  }
						});
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
			gotoMessage(){
				uni.navigateTo({
					url:"./community/message"
				})
			},
			//通过某些技术手段（如版本特性）检查是否是超远古版本
			checkAncientVersion(){
				//检查是否内测期间的超远古热更新版本
				if(sessionStorage.getItem("appVersion") != undefined){
					uni.navigateTo({
						url:"./apps/badVersion"
					})
				}
			},
			navBarJump(func){
				switch(func){
					case "标签":
						uni.navigateTo({
							url:"./readers/tags"
						})
						break;
					case "活动":
						this.gotoCollections("干草块杯活动专辑");
						break;
					case "排行":
						this.gotoCollections("原木力爆棚");
						break;
					case "推荐":
						this.gotoCollections("原木力飙升");
						break;
					case "完结":
						this.gotoCollections("完本经典");
						break;
				}
			}
		},

	}
</script>

<style scoped lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-flow: wrap;
		background-color: rgb(242,242,242);
		width:100vw;
		div.searchBar{
			position:fixed;
			width:calc(100vw - 20rpx);
			z-index:10;
			top:0;
			left:0;
			margin:0 0rpx;
			padding:10rpx;
			padding-top:calc(5rpx + var(--statusBarHeight));
			padding-bottom:5rpx;
			background-color: rgb(255,255,255);
			display:flex;
			box-shadow:
			  0px 0px 2.2px rgba(0, 0, 0, 0.02),
			  0px 0px 5.3px rgba(0, 0, 0, 0.028),
			  0px 0px 10px rgba(0, 0, 0, 0.035),
			  0px 0px 17.9px rgba(0, 0, 0, 0.042),
			  0px 0px 33.4px rgba(0, 0, 0, 0.05),
			  0px 0px 80px rgba(0, 0, 0, 0.07)
			;
			.searchBarBox{
				width:100%;
			}
			.messageIcon{
				margin:24rpx 5rpx 20rpx 5rpx;
			}
		}
		div.searchBarUnder{
			opacity:0;
			margin:0 0rpx;
			padding-top:calc(5rpx + var(--statusBarHeight));
			padding-bottom:5rpx;
			background-color: rgb(255,255,255);
		}
		
		div.swiper{
			margin:0;
			background-color:white;
			padding:20rpx 0;
			width: 750rpx;
			.swiperImgs{
				position:relative;
				z-index:1;
			}
			.swiperNav{
				position:relative;
				height:200rpx;
				margin:0 9px;
				margin-top:-10rpx;
				width:calc(100% - 18px);
				background:linear-gradient(
					180deg,
					rgb(255, 255, 255),
					rgb(252,233,164),
				);
				z-index:0;
				border-radius: 0 0 10rpx 10rpx;
				box-shadow:
				  0px 0px 2.2px rgba(0, 0, 0, 0.02),
				  0px 0px 5.3px rgba(0, 0, 0, 0.028),
				  0px 0px 10px rgba(0, 0, 0, 0.035),
				  0px 0px 17.9px rgba(0, 0, 0, 0.042),
				  0px 0px 33.4px rgba(0, 0, 0, 0.05),
				  0px 0px 80px rgba(0, 0, 0, 0.07)
				;
				display:flex;
				align-items: center;
				justify-content: space-around;
				.navBtn{
					transform: translate(0,10rpx);
					img{
						height:100rpx;
						filter: drop-shadow(0px 2px 10rpx #17181944);
					}
					div.name{
						text-align: center;
						color:rgb(45,45,45);
						font-size: 25rpx;
						margin-top:5rpx;
					}
				}
			}
		}
		div.card{
			margin:20rpx 0rpx;
			padding:0 0 0rpx 0;
			box-sizing: border-box;
			background-color:rgb(255,255,255);
			.head{
				margin:0rpx 25rpx;
				padding: 30rpx 0;
				height:45rpx;
				div.title{
					float:left;
					font-size: 35rpx;
					font-weight: bold;
					color:rgb(45,45,45);
					margin:0 0 20rpx 0;
					height:45rpx;
					position:relative;
					p{
						position:relative;
						z-index:1;
					}
					.lightLine{
						width:100%;
						height:30rpx;
						background-color:rgb(161,255,127);
						border-radius: 20rpx;
						position:relative;
						top:-30rpx;
						z-index:0;
					}
					img.icon{
						height:65rpx;
						border-radius: 20rpx;
						position:absolute;
						top:-5rpx;
						right:-65rpx;
						z-index:0;
						filter: drop-shadow(0px 2px 10rpx #17181944);
					}
				}
				div.more{
					float:right;
					display:flex;
					margin-top: 5rpx;
					p{
						color:rgb(142,130,109);
						font-size: 30rpx;
						line-height: 44rpx;
						height:44rpx;
					}
					.moreImg{
						height:30rpx;
						width:30rpx;
						margin-right: 8rpx;
					}
				}
			}
			div.novels-slide{
				.transition{
					width:100vw;
					display:flex;
					flex-direction: row;
					overflow: auto;
					font-size:30rpx;
					height:370rpx;
					overflow-y: hidden;
				}
			}
			div.novels-slide::-webkit-scrollbar {
				display: none;
			}
			div.novel-cards{
				.transition{
					width:100vw;
					display:flex;
					flex-direction: row;
					justify-content: center;
					flex-flow: wrap;
					overflow: auto;
					font-size:30rpx;
				}
			}
		}
		.books {
			height: 260rpx;
			width: calc(100vw - 40rpx);
			margin:20rpx;
			display: flex;
			background-color:rgb(255,255,255);
			border-radius:10rpx;
			
			
			img {
				height: 260rpx;
				width: 200rpx;
				border-radius: 10rpx 0 0 10rpx;
				margin:0rpx;
				flex-shrink: 0;
			}
			.bookInfo {
				margin-left:30rpx;
				margin-top: 22rpx;
				.title{
					font-size: 34rpx;
					height:42rpx;
					margin-bottom: 10rpx;
					overflow: hidden;
					display: -webkit-box;
					font-weight:bold;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					color:rgb(45,45,45);
					margin:5rpx;
				}
				.author{
					position:relative;
					margin-top:15rpx;
					margin-bottom:10rpx;
					width:40vw;
					.auther_avatar{
						position:absolute;
						top:0rpx;
						left:5rpx;
						height:35rpx;
						width:35rpx;
						border-radius: 5rpx;
					}
					.auther_name{
						font-size: 25rpx;
						// font-weight: bold;
						color:rgb(45,45,45);
						overflow:hidden;
						margin-left:45rpx;
						display:-webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
					}
				}
				
				.description{
					font-size: 25rpx;
					color:rgb(142,130,109);
					margin:5rpx;
					margin-right:10rpx;
					overflow: hidden;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 3;
				}
			}
		}
		div.underBar{
			height: 150rpx;
		}
		
		.changeButton{
			margin:0 60rpx 20rpx 60rpx;
			background-color: #f0e4cd;
			color:#713418;
			height:80rpx;
			line-height: 80rpx;
			text-align: center;
			font-size:30rpx;
			border-radius:10rpx;
			transition:all .3s;
		}
		
		.changeButton:active{
			background-color: #d1c7b3;
			transform:scale(.9,.9)
		}
	}
	
	.fade-enter-active, .fade-leave-active {
	  transition: all .5s;
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	  opacity: 1;
	}
	.list-complete-item {
	  transition: all 1s;
	  display: inline-block;
	  margin-right: 10px;
	}
	.list-complete-enter, .list-complete-leave-to
	/* .list-complete-leave-active for below version 2.1.8 */ {
	  opacity: 1;
	  transform: translateY(30px);
	}
	.list-complete-leave-active {
	  position: absolute;
	}
	
	.popup{
		height:100vh;
	}
</style>
