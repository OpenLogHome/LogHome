<template>
	<view class="outer" v-dark>
		<view class="friends-tabs">
			<view
				class="friends-tab"
				v-for="(tab, index) in tabValue"
				:key="index"
				:class="{ active: curTabIndex === index }"
				@tap="changeTab(index)"
			>
				<text>{{ tab }}</text>
			</view>
			<view
				class="tab-indicator"
				:class="{ dragging: isSwiperDragging }"
				:style="tabIndicatorStyle"
			></view>
		</view>
		<view class="search-bar">
			<input class="search-input" v-model="searchKeyword" placeholder="搜索好友..." placeholder-style="color:#999" />
			<text v-if="searchKeyword" class="search-clear" @tap="searchKeyword = ''">×</text>
		</view>

		<!-- 两个页面始终保留在同一横向轨道中，原生 swiper 负责跟手位移。 -->
		<swiper
			class="friends-swiper"
			:current="curTabIndex"
			:duration="280"
			:circular="false"
			@transition="handleSwiperTransition"
			@change="handleSwiperChange"
			@animationfinish="handleSwiperAnimationFinish"
		>
			<swiper-item>
				<scroll-view class="friend-page" scroll-y :show-scrollbar="false">
					<view class="list">
						<view v-if="followsError" class="privacy-status">{{ followsError }}</view>
						<view v-else class="friend-count">共有 {{ filteredFollows.length }} 个关注</view>
						<view v-if="!followsError" class="friend-row" v-for="item in filteredFollows" :key="item.follow_id">
							<navigator class="user-link" :url="'../users/personalPage?id=' + item.follow_id">
								<user-avatar class="friend-avatar" :src="item.avatar_url" :frame="item.avatar_frame" :visual-scale="item.avatar_frame ? 1.25 : 1" />
								<view class="person-info">
									<view class="name">{{ item.name }}</view>
									<view class="motto">{{ item.motto }}</view>
								</view>
							</navigator>
							<followBtn class="follow-button" :targetId="item.follow_id"></followBtn>
						</view>
						<view class="empty-state" v-if="!followsError && filteredFollows.length === 0">
							{{ searchKeyword ? '没有匹配的用户' : '暂无关注' }}
						</view>
					</view>
				</scroll-view>
			</swiper-item>

			<swiper-item>
				<scroll-view class="friend-page" scroll-y :show-scrollbar="false">
					<view class="list">
						<view v-if="fansError" class="privacy-status">{{ fansError }}</view>
						<view v-else class="friend-count">共有 {{ filteredFans.length }} 个粉丝</view>
						<view v-if="!fansError" class="friend-row" v-for="item in filteredFans" :key="item.user_id">
							<navigator class="user-link" :url="'../users/personalPage?id=' + item.user_id">
								<user-avatar class="friend-avatar" :src="item.avatar_url" :frame="item.avatar_frame" :visual-scale="item.avatar_frame ? 1.25 : 1" />
								<view class="person-info">
									<view class="name">{{ item.name }}</view>
									<view class="motto">{{ item.motto }}</view>
								</view>
							</navigator>
							<followBtn class="follow-button" :targetId="item.user_id"></followBtn>
						</view>
						<view class="empty-state" v-if="!fansError && filteredFans.length === 0">
							{{ searchKeyword ? '没有匹配的用户' : '暂无粉丝' }}
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import followBtn from '../../components/follow.vue'
	import darkModeMixin from '@/mixins/dark-mode.js'
	import axios from 'axios'
	export default{
		components:{
			followBtn
		},
		mixins: [darkModeMixin],
			data(){
			return{
				tabValue:[
					"我的关注","我的粉丝"
				],
				id:-1,
				user:{},
				isMe:false,
				curTabIndex:0,
				follows:[],
				fans:[],
				searchKeyword:'',
				fansError:'',
				followsError:'',
				swiperWidth: 375,
				tabIndicatorPosition: 0,
				isSwiperDragging: false,
				isTabClickAnimating: false
			}
		},
		watch: {
			id(value) {
				if (Number(value) > 0) { this.refreshFans(); this.refreshFollows(); }
			}
		},
		onShow() {
			if (Number(this.id) > 0) { this.refreshFans(); this.refreshFollows(); }
		},
		computed:{
			tabIndicatorStyle() {
				return {
					transform: `translate3d(${this.tabIndicatorPosition * 100}%, 0, 0)`
				};
			},
			filteredFans(){
				if(!this.searchKeyword) return this.fans;
				const kw = this.searchKeyword.toLowerCase();
				return this.fans.filter(item => item.name && item.name.toLowerCase().includes(kw));
			},
			filteredFollows(){
				if(!this.searchKeyword) return this.follows;
				const kw = this.searchKeyword.toLowerCase();
				return this.follows.filter(item => item.name && item.name.toLowerCase().includes(kw));
			}
		},
		onLoad(params){
			//获取该页面模式，没有id为自己的信息，有id为查看他人信息
			if(params.id != undefined){
				this.id = params.id;
				let _this = this;
				axios.get(this.$baseUrl + '/users/user_profile_of?id=' + this.id, {}).then((res) => {
					_this.user = JSON.parse(JSON.stringify(res.data))[0];
					this.tabValue=["Ta的关注","Ta的粉丝"];
					uni.setNavigationBarTitle({
						title:_this.user.name + "的好友"
					})
					//复检是不是本人
					let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
					if(tk != null){
						//验活
						axios.get( _this.$baseUrl + '/users/userprofile', {
							headers: {
								 'Content-Type': 'application/json',//设置请求头请求格式为JSON
								 'Authorization': tk //设置token 其中K名要和后端协调好
							}
						}).then((res) => {
							let data = JSON.parse(JSON.stringify(res.data));
							if(_this.id != -1 && _this.id == data.user_id) {
								_this.tabValue=["我的关注","我的粉丝"];
								uni.setNavigationBarTitle({
									title:"我的好友"
								})
								_this.isMe = true;
							}

						}).catch(function(error) {
							if(error.message == "Request failed with status code 401"){
							}
						})
					}
				}).catch(function(error) {
					uni.showToast({
						title: "用户信息加载失败",
						icon: 'none',
						duration: 2000
					})
				})
			} else {
				let _this = this;
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				if(tk != null){
					//验活
					axios.get( _this.$baseUrl + '/users/userprofile', {
						headers: {
							 'Content-Type': 'application/json',//设置请求头请求格式为JSON
							 'Authorization': tk //设置token 其中K名要和后端协调好
						}
					}).then((res) => {
						let data = JSON.parse(JSON.stringify(res.data));
						if(_this.id != -1 && _this.id == data.user_id) {
							_this.tabValue=["我的关注","我的粉丝"];
							uni.setNavigationBarTitle({
								title:"我的好友"
							})
							_this.isMe = true;
						}
						_this.id = data.user_id;

					}).catch(function(error) {
						if(error.message == "Request failed with status code 401"){
						}
					})
				}else {

				}
			}



			if(params.tab !== undefined){
				const requestedTab = Number(params.tab);
				const initialTab = requestedTab === 1 ? 1 : 0;
				this.curTabIndex = initialTab;
				this.tabIndicatorPosition = initialTab;
			}


		},
		mounted(){
			const systemInfo = uni.getSystemInfoSync ? uni.getSystemInfoSync() : {};
			const browserWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
			this.swiperWidth = Number(systemInfo.windowWidth) || browserWidth || 375;
		},
		methods:{
			changeTab(index){
				const nextIndex = Number(index) === 1 ? 1 : 0;
				this.isSwiperDragging = false;
				this.isTabClickAnimating = nextIndex !== this.curTabIndex;
				this.tabIndicatorPosition = nextIndex;
				this.curTabIndex = nextIndex;
				this.refreshTab(nextIndex);
			},
			handleSwiperTransition(event) {
				if (this.isTabClickAnimating) return;
				const dx = Number(event && event.detail && event.detail.dx);
				if (!Number.isFinite(dx) || !this.swiperWidth) return;

				// dx 与内容移动方向相反，因此用 current - dx / width 得到分页进度。
				const position = this.curTabIndex - dx / this.swiperWidth;
				this.isSwiperDragging = true;
				this.tabIndicatorPosition = Math.max(0, Math.min(1, position));
			},
			handleSwiperChange(event) {
				const nextIndex = Number(event && event.detail && event.detail.current) === 1 ? 1 : 0;
				const changed = nextIndex !== this.curTabIndex;
				this.curTabIndex = nextIndex;
				this.tabIndicatorPosition = nextIndex;
				if (changed) this.refreshTab(nextIndex);
			},
			handleSwiperAnimationFinish(event) {
				const nextIndex = Number(event && event.detail && event.detail.current) === 1 ? 1 : 0;
				this.curTabIndex = nextIndex;
				this.tabIndicatorPosition = nextIndex;
				this.isSwiperDragging = false;
				this.isTabClickAnimating = false;
			},
			refreshTab(index) {
				if(index === 1){
					this.refreshFans();
				} else {
					this.refreshFollows();
				}
			},
			refreshFans(){ return this.loadList('fans'); },
			refreshFollows(){ return this.loadList('follows'); },
			async loadList(kind) {
				if (Number(this.id) <= 0) return;
				this[kind + 'Error'] = '';
				try {
					const token = JSON.parse(window.localStorage.getItem('token') || 'null');
					const res = await axios.get(this.$baseUrl + '/community/get_' + kind + '_of?id=' + this.id, {
						headers: { Authorization: token ? 'Bearer ' + token.tk : '' }, timeout: 15000
					});
					this[kind] = res.data;
				} catch (error) {
					this[kind] = [];
					this[kind + 'Error'] = this.$t('settings.privacy.' +
						(error.response && error.response.data.code === 'PRIVATE_LIST' ? 'privateList' : 'listLoadFailed'));
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.outer {
		display: flex;
		flex-direction: column;
		height: 100vh;
		height: 100dvh;
		box-sizing: border-box;
		overflow: hidden;
		background-color: #ffffff;

		&.dark-mode {
			background-color: #252525;
		}
	}

	.friends-tabs {
		position: relative;
		display: flex;
		flex: 0 0 80rpx;
		width: 100%;
		border-bottom: 1rpx solid #ececec;
		box-sizing: border-box;

		.dark-mode & {
			border-bottom-color: #3a3a3a;
		}
	}

	.friends-tab {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50%;
		font-size: 30rpx;
		color: #777;
		transition: color .2s ease, font-size .2s ease;

		&.active {
			font-size: 34rpx;
			font-weight: 600;
			color: #2d2d2d;
		}

		.dark-mode & {
			color: #a8a8a8;
		}

		.dark-mode &.active {
			color: #ffffff;
		}
	}

	.tab-indicator {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 50%;
		height: 6rpx;
		transition: transform 280ms cubic-bezier(.22, .61, .36, 1);
		will-change: transform;

		&::after {
			content: '';
			display: block;
			width: 88rpx;
			height: 100%;
			margin: 0 auto;
			border-radius: 999rpx;
			background-color: rgb(125, 218, 91);
		}

		&.dragging {
			transition: none;
		}

		.dark-mode &::after {
			background-color: #5f9550;
		}
	}

	.search-bar {
		display: flex;
		align-items: center;
		flex: 0 0 auto;
		padding: 10rpx 20rpx;
		border-bottom: #cacaca 1rpx solid;
		box-sizing: border-box;

		.dark-mode & {
			border-bottom-color: #3a3a3a;
		}
	}

	.search-input {
		flex: 1;
		height: 60rpx;
		background-color: #f5f5f5;
		border-radius: 10rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
		box-sizing: border-box;

		.dark-mode & {
			background-color: #3a3a3a;
			color: #e5e5e5;
		}
	}

	.search-clear {
		margin-left: 15rpx;
		font-size: 36rpx;
		color: #999;
		padding: 0 10rpx;
	}

	.friends-swiper {
		flex: 1 1 auto;
		min-height: 0;
		width: 100%;
		overflow: hidden;
	}

	.friend-page {
		display: block;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		-webkit-overflow-scrolling: touch;
	}

	.list {
		width: 100%;
		padding-bottom: calc(24rpx + var(--loghome-safe-bottom, 0px));
		box-sizing: border-box;
	}

	.friend-count {
		display: flex;
		align-items: center;
		height: 58rpx;
		padding: 0 20rpx;
		font-size: 26rpx;
		color: #666;
		border-bottom: #e5e5e5 1rpx solid;
		box-sizing: border-box;

		.dark-mode & {
			color: #b8b8b8;
			border-bottom-color: #3a3a3a;
		}
	}

	.friend-row {
		display: flex;
		align-items: center;
		position: relative;
		height: 130rpx;
		width: 100%;
		border-bottom: #cacaca 1rpx solid;
		box-sizing: border-box;

		.dark-mode & {
			border-bottom-color: #3a3a3a;
		}
	}

	.user-link {
		display: flex;
		align-items: center;
		min-width: 0;
		flex: 1;
		height: 100%;
		padding-right: 18rpx;
		box-sizing: border-box;
	}

	.friend-avatar {
		flex: 0 0 100rpx;
		width: 100rpx;
		height: 100rpx;
		margin: 15rpx;
	}

	.person-info {
		min-width: 0;
		flex: 1;
	}

	.name {
		font-size: 32rpx;
		line-height: 42rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: rgb(180, 111, 88);

		.dark-mode & {
			color: #d1a980;
		}
	}

	.motto {
		margin-top: 8rpx;
		font-size: 28rpx;
		line-height: 36rpx;
		color: rgb(97, 97, 97);
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;

		.dark-mode & {
			color: #b8b8b8;
		}
	}

	.follow-button {
		position: static;
		flex: 0 0 150rpx;
		margin-right: 30rpx;
		transform: none;
	}

	.empty-state,
	.privacy-status {
		padding: 100rpx 30rpx;
		text-align: center;
		font-size: 28rpx;
		color: #999;
	}
</style>
