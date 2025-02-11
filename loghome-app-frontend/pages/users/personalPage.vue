<template>
	<view style="background-color:rgb(255, 248, 234);">
		<!-- 后台按钮组件 -->
		<zetank-backBar textcolor="#000" :showLeft="topNum == 0" :showTitle="false" navTitle='标题'></zetank-backBar>
		<!-- 用户背景封面 -->
		<log-image class="info-cover" @tap="change_top_pic" :src="user.top_pic_url"
		onerror="onerror=null;src='https://i.loli.net/2021/11/29/BxFmtyrS7GolgqM.jpg'"></log-image>
		
		<springBack :top="`calc(300rpx + ${jsBridge.inApp ? jsBridge.statusBarHeight + 'px' : 0 + 'px'})`">
			<!-- 右侧悬浮按钮 -->
			<view class="rightBtnGroup">
				<followBtn :targetId="Number(uid)" v-show="uid != myUserInfo.user_id"/>
				<navigator url="./change_user_info" v-show="uid == myUserInfo.user_id">
					<div class="button">编辑资料</div>
				</navigator>
				<!-- <div class="button" v-show="uid != myUserInfo.user_id" @click="gotoPrivateMessage">私信</div> -->
			</view>
			
			<!-- 用户头像关注 -->
			<view class="u-flex-wrap"
				style="padding-top: 18rpx;padding-bottom: 18rpx;position: relative;align-items: center;display: flex;flex-direction: row;justify-content: flex-end;">
				<view class="info-avatar" @click="$previewImg([user.avatar_url])">
					<log-image :src="user.avatar_url" onerror="onerror=null;src='../static/user/defaultAvatar.jpg'"/>
				</view>
				<view style="margin-right: 50rpx;">
					<view v-if='!showedit' style="height: 45rpx;"></view>
				</view>
			</view>
			<!-- 用户名 -->
			<view style="display: flex;align-items: center;margin-left: 50rpx;margin-top: 28rpx;">
				<text style="font-size: 40rpx;color: #111111;font-weight: bold;margin-right: 10rpx;">{{user.name}}</text>
				
			</view>
			
			<view class="moreInfo" style="margin-left: 50rpx;margin-top: 18rpx;">
				<span class="user_id">ID:{{uid}}</span>
				<!-- <span class="user_group" :class="group2class[user.user_group]">{{user.user_group}}</span> -->
				<groupLabel v-for="user_group in user.user_group" :userGroup="user_group"></groupLabel>
				<span class="admin_title" v-show="user.is_admin">
					<img src="../../static/icons/admin.gif" alt="" style="width:45rpx;margin-left: 10rpx;"/>社区管理员</span>
			</view>
	
			<!-- 简介-->
			<view style="font-size: 28rpx;color: #555555;margin:20rpx 50rpx;">
				<text style="margin-right: 20rpx;">{{user.motto==''?'暂无简介':user.motto}}</text>
			</view>
			<view style="display: flex;align-items: center;margin-left: 50rpx;margin-top: 20rpx;margin-bottom: 20rpx;">
				<navigator :url="'../community/friends?id=' + uid + '&tab=1'">
					<text
						style="font-size: 40rpx;font-weight: bold;color: #555555;margin-right: 18rpx;">{{fans}}</text><text
						style="font-size: 28rpx;color: gray;margin-right: 28rpx;">粉丝</text>
				</navigator>
				<navigator :url="'../community/friends?id=' + uid + '&tab=0'">
					<text
						style="font-size: 40rpx;font-weight: bold;color: #555555;margin-right: 18rpx;">{{follows}}</text><text
						style="font-size: 28rpx;color: gray;margin-right: 28rpx;">关注</text>
				</navigator>
			
	<!-- 			<text
					style="font-size: 40rpx;font-weight: bold;color: #555555;margin-right: 18rpx;">{{likes}}</text><text
					style="font-size: 28rpx;color: gray;margin-right: 28rpx;">点赞</text> -->
			
			</view>
	
			<view id="tabbar" :class="isFixed?'tabbar-fixed':''"
				style=" align-items: stretch;height: 90rpx;line-height: 90rpx; display: flex;flex-direction: row;justify-content: space-around;">
				<view style="font-size: 32rpx;font-weight: bold;text-align: center;width: 128rpx;"
					:class="current == 0?'tabbarsh':'notabbarsh'" @tap="fnBarClick(0)">作品</view>
				<view style="font-size: 32rpx;font-weight: bold;text-align: center;width: 128rpx;"
					:class="current == 1?'tabbarsh':'notabbarsh'" @tap="fnBarClick(1)" v-show="false">动态</view>
			</view>
	
			<!-- 导航显示内容 -->
			<view v-show="current == 0">
				<div class="bookcase">
					<bookInCase v-for="item in booksOnShow" :bookName="item.name" :picUrl="item.picUrl" :key="item.novel_id"
								@click.native="readBook(item.novel_id)" v-show="!item.is_personal"></bookInCase>
				</div>
			</view>
		</springBack>
	</view>
</template>

<script>
	import bookInCase from '../../components/book_in_case.vue'
	import followBtn from '../../components/follow.vue'
	import groupLabel from "../usergroup/groupLabel.vue"
	import springBack from '../../components/springBack.vue'
	import axios from 'axios'
	export default {
		components:{
			bookInCase,followBtn,springBack,groupLabel
		},
		data() {
			return {
				uid: -1,
				membertype: '',
				showedit: true, //信息编辑按钮
				// 是否固定导航
				isFixed: false,
				// 距离顶部达到导航距离
				topNum: 0,
				// 选中 
				current: 0,
				// 导航距离顶部
				tabbarTop: 0,
				clickRefresh: false,
				// 刷新间隔
				timeOutUserInfo: 0,
				// 激活顶部导航关联页状态
				status: {
					publish: true,
					praise: false,
				},
				toTop: {
					offset: 300,
					duration: 300,
					zIndex: 9990,
				 right: 30,
					bottom: 150,
					safearea: false,
					width: 72,
					radius: "50%",
					left: null
				},
				topImgSrc: "https://i.loli.net/2021/11/29/BxFmtyrS7GolgqM.jpg",
				user: {},
				booksOnShow:[],
				myUserInfo:{},
				likes:0,
				follows:0,
				fans:0,
				group2class:{
					"社区奠基人":"founder",
					"原木体验官":"copemate",
					"用户":'nonTitle',
					"社区管理员":'nonTitle',
					"系统消息":'nonTitle'
				},
			}
		},
		onLoad(option) {
			this.uid = option.uid
			// 等待0.3秒页面渲染,$nextTick使用不能准确
			let uid = uni.getStorageSync('uid')
			if (uid === option.uid) {
				this.showedit = true
			}


		},
		methods: {
			/// 顶部导航选项点击
			fnBarClick(current) {
				// console.log(current);
				// 是否当前项点击
				if (this.current == current) {
					this.timeOutUserInfo += 1;
					// 是否为刷新值和连续点击2次
					// console.log('timeOutUserInfo',this.timeOutUserInfo);
					if (!this.clickRefresh && this.timeOutUserInfo >= 2) {
						// 刷新值开
						// console.log('点击了两下');
						this.clickRefresh = true;
						// 获取新数据

						// 定时器重置
						this.timeOutUserInfo = setTimeout(() => {
							// 清除定时器
							// console.log('5秒后清除定时器');
							clearTimeout(this.timeOutUserInfo)
							// 连续触发记录重置
							this.timeOutUserInfo = 0;
							// 5秒后刷新值关
							this.clickRefresh = false;
						}, 5000);
					}
				} else {
					// 改变顶部导航选中
					this.current = current;
					// 首次选中激活顶部导航关联页状态
					if (!this.status.praise && this.current == 1) this.status.praise = true;
					// 获取新数据

					// 清除定时器
					clearTimeout(this.timeOutUserInfo)
					// 连续触发记录重置
					this.timeOutUserInfo = 0;
					// 刷新值关
					this.clickRefresh = false;
				}
			},
			readBook(novel_id) {
				if(novel_id > 0) {
					uni.navigateTo({
						url:'../readers/bookInfo?id=' +  novel_id
					})
				}
			},
			change_top_pic(){
				if(this.uid == this.myUserInfo.user_id){
					uni.navigateTo({
						url:"./top_pic_upload?noneAnimation=1"
					})
				} else {
					this.$previewImg([this.user.top_pic_url])
				}
			},
			// gotoPrivateMessage(){
			// 	if(this.user.uni_id != undefined){
			// 		uni.navigateTo({
			// 			url:"/uni_modules/uni-im/pages/chat/chat?user_id=" + this.user.uni_id
			// 		})
			// 	} else {
			// 		uni.showToast({
			// 			title: "该用户使用的版本太旧，还未开通私信功能哦",
			// 			icon: 'none',
			// 			duration: 2000
			// 		})
			// 	}
			// },
			onLoad(params) {
				this.uid = params.id;
			},
			onShow(params) {
				let _this = this;
				axios.get(this.$baseUrl + '/users/user_profile_of?id=' + this.uid, {}).then((res) => {
					_this.user = JSON.parse(JSON.stringify(res.data))[0];
					_this.user.user_group = _this.user.user_group.split(',');
				}).catch(function(error) {
					uni.showToast({
						title: "用户信息加载失败",
						icon: 'none',
						duration: 2000
					})
				})
				
				axios.get(this.$baseUrl + '/library/get_novel_by_user_id?id=' + this.uid, {
				}).then((res) => {
					_this.booksOnShow=res.data;
					console.log(_this.booksOnShow)
				}).catch(function(error) {
					uni.showToast({
						title: "作品信息加载失败",
						icon: 'none',
						duration: 2000
					})
				})
				
				
				//检测是否与个人相关
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				if(tk == null){
					return;
				}
				//验活
				axios.get( this.$baseUrl + '/users/userprofile', {
					headers: { 
					     'Content-Type': 'application/json',//设置请求头请求格式为JSON
					     'Authorization': tk //设置token 其中K名要和后端协调好
					}
				}).then((res) => {
					_this.myUserInfo = JSON.parse(JSON.stringify(res.data));
					console.log(_this.myUserInfo)
				}).catch(function(error) {
					if(error.message == "Request failed with status code 401"){
						window.localStorage.removeItem('token');
					}
				})
				
				
				axios.get(_this.$baseUrl + '/community/get_fans_of?id=' + _this.uid, {}).then((res) => {
					_this.fans = JSON.parse(JSON.stringify(res.data)).length;
				}).catch(function(error) {
					uni.showToast({
						title: "用户信息加载失败",
						icon: 'none',
						duration: 2000
					})
				})
				
				axios.get(_this.$baseUrl + '/community/get_follows_of?id=' + _this.uid, {}).then((res) => {
					_this.follows = JSON.parse(JSON.stringify(res.data)).length;
				}).catch(function(error) {
					uni.showToast({
						title: "用户信息加载失败",
						icon: 'none',
						duration: 2000
					})
				})
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.info-cover {
		position:absolute;
		display: block;
		width: 100vw;
		height:100vw;
	}

	.info-avatar {
		position: absolute;
		left: 0;
		top: -120rpx;
		margin-left: 50rpx;
		width: 160upx;
		height: 160upx;
	}

	.info-avatar img {
		border-radius: 8rpx;
		width: 100%;
		height: 100%;
	}

	.tabbarsh {
		color: rgb(180, 111, 88);
		border-bottom: 4rpx rgb(180, 111, 88) solid;
	}

	.notabbarsh {
		color: #555555;
	}

	.tabbar-fixed {
		position: fixed;
		left: 0;
		right: 0;
		/* #ifdef H5 */
		top: 0rpx;
		/* #endif */
		/* #ifndef H5 */
		top: 0;
		/* #endif */
		z-index: 300;
		background: #ffffff;
		margin-bottom: 0;
	}
	
	.bookcase {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		flex-flow: wrap;
		padding-bottom:40rpx;
		font-size:30rpx;
	}
	
	.rightBtnGroup{
		position:absolute;
		right:35rpx;
		margin-top: 10px;
		display: flex;
	}
	
	.button {
		height: 60rpx;
		width: 150rpx;
		font-size: 14px;
		text-align: center;
		line-height: 30px;
		border-radius: 5px;
		color: #ffffff;
		background-color: rgb(180, 111, 88);
		margin-left: 15rpx;
	}
	
	.user_id{
		color:#808080;
		font-size:20rpx;
		background-color: #c8c8c8;
		padding:5rpx;
		line-height: 40rpx;
		border-radius: 10rpx;
	}
	.user_group{
		font-size:20rpx;
		padding:5rpx;
		line-height: 40rpx; 
		margin-left:10rpx;
		border-radius: 10rpx;
	}
	
	.admin_title{
		font-size:20rpx;
		padding:5rpx;
		line-height: 40rpx; 
		margin-left:10rpx;
		border-radius: 10rpx;
		background: #55aaff;
		color:white;
		margin-left: 25rpx;
		padding: 5rpx 7.5rpx 5rpx 30rpx;
		text-align: right;
		position:relative;
		img{
			position:absolute;
			left:-25rpx;
			top:-7.5rpx;
		}
	}
	
	.user_group.nonTitle{
		display:none;
	}
	
	@keyframes gradient-move {
		0% {
			background-position: 0% 0;
		}
	
		50% {
			background-position: 100% 0;
		}
	
		100% {
			background-position: 0% 0;
		}
	}
</style>
