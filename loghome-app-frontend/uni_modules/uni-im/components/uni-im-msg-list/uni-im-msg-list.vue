<template>
	<view class="root">
		<uni-im-list v-if="msgList.length" class="uni-im-list" @scroll="onScroll" :style="{'height':listHeight}"
			:scrollTop="scrollTop" :scroll-into-view="scrollIntoView" :paddingBottom="paddingBottom" ref="uni-im-list">
				<uni-im-list-item v-for="(msg,index) in msgList" :key="msg._id" :ref="'item-'+index">
					<view class="item" :id="'item-'+index" @click="clickItem">
						<view v-if="index === 0" class="data-state-tip-box" @appear="loadMore">
							<template v-if="isSafariPc">
								<button v-if="hasMore" class="loadMore-btn" @click="loadMore">点击加载更多</button>
								<text v-else class="data-state-tip-text">没有更多历史消息</text>
							</template>
							<template v-else>
								<!-- vue2下小程序端 加载状态如果使用组件会有 滚动锚定问题 其他端可以使用 uni-load-more -->
								<uni-icons v-if="hasMore" size="25px" color="#ccc" type="spinner-cycle"
									class="data-state-tip-icon"></uni-icons>
								<text class="data-state-tip-text">{{hasMore ? '正在加载历史消息' : '没有更多历史消息' }}</text>
							</template>
						</view>
						<view v-if="msg.type == 'system'" class="system-msg-box">
							<uni-im-msg-system :msg="msg"></uni-im-msg-system>
						</view>
						<view v-else class="msg-box" :class="{'active-index':index === activeIndex}">
							<!-- <text style="width: 750rpx;text-align: center;border: 1px solid #000;">{{'item-'+index}}</text> -->
							<uni-im-msg @showMsgById="showMsgById" :msg="msg" :self="current_uid() == msg.from_uid" :index="index"
								@showControl="showControl" @retriesSendMsg="retriesSendMsg" :equalPrevTime="equalPrevTime(index)"
								:avatar_file="conversation.avatar_file" :aboutMsg="getAboutMsg(msg.about_msg_id)" ref="uni-im-msg" class="uni-im-msg">
							</uni-im-msg>
						</view>
					</view>
				</uni-im-list-item>
		</uni-im-list>
		<uni-load-more v-if="msgList.length == 0" :status="hasMore?'loading':'noMore'" class="mg-15"
			:contentText='{"contentrefresh": "加载中","contentnomore": "- 没有聊天记录 -"}'></uni-load-more>
		
		<!-- <view class="slider-box">
			val:{{val}} scrollTop:{{scrollTop}}
			<slider value="1" @change="sliderChange" min="1" max="14" step="1" />
		</view> -->
		
		<!-- <view style="position: fixed;top: 100px;width: 400rpx;">
			paddingBottom：{{paddingBottom}}
			scrollTop：{{scrollTop}}
			msgList.length:{{msgList.length}}
			this.loadMore.lock：{{loadMore.lock}}
			scrollIntoView:{{scrollIntoView}}
			<input type="text" v-model="nextScrollIntoView" placeholder="nextScrollIntoView">
			<button @click="showLast">showLast</button>
		</view> -->
		<view v-if="call_list.length" class="showCallMe" @click="showCallMe">@回复我({{call_list.length}})</view>
			<!-- <button @click="showLast">showLast</button> -->
	</view>
</template>

<script>
	import uniIm from '@/uni_modules/uni-im/lib/main.js';
	import utils from '@/uni_modules/uni-im/common/utils.js';
	import {
		store as uniIdStore
	} from '@/uni_modules/uni-id-pages/common/store';

	import uniImList from './components/uni-im-list/uni-im-list';
	import uniImListItem from './components/uni-im-list-item/uni-im-list-item';

	// 递归loadMore计数，防止死循环
	let loadMoreIndex = 0
	// 一页多少条数据
	let pageLimit = 10
	// 当前页面滚动条高度
	let currentScrollTop = 0

	// #ifdef APP-NVUE
	const nativePluginDom = uni.requireNativePlugin('dom')
	// #endif
	export default {
		components: {
			uniImList,
			uniImListItem
		},
		computed: {
			...uniIm.mapState(['systemInfo', 'isWidescreen', 'heartbeat']),
			loadState() {
				return this.hasMore ? '正在加载历史消息' : '没有更多历史消息'
			},
			msgList() {
				return this.conversation.msgList || []
			},
			isSafariPc() {
				// #ifdef H5
				return this.systemInfo.browserName == 'safari' && this.isWidescreen
				// #endif
				return false
			},
			listHeight(){
				// #ifdef APP-NVUE
				return this.systemInfo.windowHeight - parseInt(this.paddingBottom) - 44 +'px';
				// #endif
				return 'auto'
			}
		},
		data() {
			return {
				val: 0,
				conversation: {},
				scrollIntoView: '',
				nextScrollIntoView: '11',
				scrollTop: 0,
				hasMore: true,
				tasksList: [],
				call_list:[],
				activeIndex:''
			}
		},
		watch: {
			'conversation.call_list'(call_list) {
				this.call_list = call_list
			}
		},
		props: {
			paddingBottom: {
				default: ''
			},
			conversationId: {
				default () {
					return false
				}
			}
		},
		async mounted() {
			// for (var i = 0; i < 10; i++) {
			// 	this.msgList.unshift({
			// 		t:i
			// 	})
			// }
		},
		methods: {
			getAboutMsg(about_msg_id){
				return this.msgList.find(i => i._id == about_msg_id)
			},
			equalPrevTime(index){
				
				const getFriendlyTime = (msg)=>{
					return utils.toFriendlyTime(msg.create_time || msg.client_create_time)
				}
				
				if(index === 0){
					return false
				}else if (index == this.msgList.length-1){
					return false
				}else{
					return getFriendlyTime(this.msgList[index])  == getFriendlyTime(this.msgList[index - 1])
				}
			},
			async showCallMe(){
				let msgId = this.conversation.call_list.pop()
				console.log('msgId',msgId)
				this.showMsgById(msgId)
			},
			async showViewByIndex(index,duration=300){
				if(index == -1){
					return
				}
				// #ifdef APP-NVUE
				let target = this.$refs['item-'+index][0];
				// console.log('滚动到第', index, target);
				nativePluginDom.scrollToElement(target, {
					// animated: duration != 0,
					// offset: 999
				});
				// #endif
				
				// #ifndef APP-NVUE
				const query = uni.createSelectorQuery().in(this);
				let listHeight = this.systemInfo.windowHeight
				
					// #ifdef H5
					if(uniIm.isWidescreen){
						listHeight = document.querySelector('.uni-im-list uni-scroll-view').clientHeight
						// console.log('listHeight',listHeight)
					}else{
						listHeight -= 44
					}
					// #endif

				query.select('#item-'+index).boundingClientRect(data => {
					// console.log('showViewByIndex #item-'+index);
					if(!data){
						return 
					}
					let val = currentScrollTop - listHeight + data.top + data.height + parseInt(this.paddingBottom)
					if(val < 0){
						val = 0
					}
					// 赋值为当前滚动条的高度
					this.scrollTop = currentScrollTop
					// 设置一个新值触发视图更新 -> 滚动
					this.$nextTick(()=>{
						this.scrollTop = val
					})
				}).exec()
				// #endif
			},
			async sliderChange(e){
				let index = e.detail.value
				console.log(index)
				this.val = index
				this.showViewByIndex(index)
			},
			async init() {
				this.conversation = await uniIm.conversation.get(this.conversationId)
				// init data --start
				this.scrollIntoView = ''
				this.scrollTop = 0
				currentScrollTop = 0
				this.hasMore = true
				this.tasksList = []
				this.loadMore.lock = false
				loadMoreIndex = 0
				// init data --end
				

				// 判断此会话的数据是否初始化（加载）过
				if (!this.conversation.isInit) {
					await this.loadMore({"showLast":true})
				} else {
					// #ifndef APP-NVUE
						this.$nextTick(()=>{
							this.showLast(300)
						})
					// #endif
					
					// 给hasMore赋值
					if (this.msgList.length < pageLimit) {
						// 加载过且少于一页 说明没有更多历史数据，否则先假设有滚动到最后一条，用户再次滚动到顶时会根据接口响应数据重新设定
						this.hasMore = false
					}
				}
			},
			async loadMore(param = {"showLast":false}) {
				if (this.loadMore.lock || !this.hasMore) {
					// console.log('this.loadMore.lock，!this.hasMore', this.loadMore.lock,!this.hasMore);
					return []
				}
				this.loadMore.lock = true

				let data = await this.conversation.msgManager.getMore() || [] //空数组避免切换过快引发请求bug
				// console.log('加载到数据：', data);
				this.hasMore = (data.length != 0)
				if (data.length) {
					// 添加到任务列再执行，解决滚动锚定的问题
					this.tasksList.push(async () => {
						// 重新获取会话对象，防止web pc端 切换太快引起的会话对象指向错误
						let conversation = await uniIm.conversation.get(data[0].conversation_id)
						if (!this.conversation.isInit) {
							// 清空数据，注意不能直接 = []，已被禁用，因为那样会破坏数据原型
							this.conversation.msgList.clear()
						}
						this.conversation.msgList.unshift(...data)
						// console.log('this.conversation.msgList',this.conversation.msgList.length);
						this.conversation.isInit = true
						this.$nextTick(async () => {
							
							// console.log('loadMoreIndex',loadMoreIndex);
							this.loadMore.lock = false
							
							if(param.showLast){
								this.showLast()
							}
							
							loadMoreIndex++
							if (this.hasMore && this.msgList.length < pageLimit && loadMoreIndex < 3) {
								// console.log('不满一屏时，再loadMore一次');
								await this.loadMore({"showLast":true})
							}
						})
						// console.log('this.loadMore.lock-----',this.loadMore.lock);
					})
					await this.doTasksListBefore()
				}
				return data
			},
			async doTasksListBefore() {
				if (this.tasksList.length) {
					// 非APP端有滚动锚定问题，需要先滚动为非0高度再加载
					// #ifndef APP-NVUE
					if (currentScrollTop < 1 && !this.isSafariPc) {
						// console.log('小于1111');
						this.scrollTop = currentScrollTop
						return this.$nextTick( async() => {
							this.scrollTop = 1
							currentScrollTop = 1
							await this.doTasksList()
						})
					}
					// #endif
					
					await this.doTasksList()
				}
			},
			showMsgById(showMsgById){
				// console.log('showMsgById',showMsgById)
				let index = this.msgList.findIndex(i=>i._id == showMsgById)
				
				this.activeIndex = index
				setTimeout(()=>{
					this.activeIndex = ''
				}, 1500);
				
				this.showViewByIndex(index)
			},
			async doTasksList() {
				// console.log("this.tasksList.length-----",this.tasksList.length)
				let length = this.tasksList.length
				for (let i = 0; i < length; i++) {
					let fun = this.tasksList.shift()
					if(typeof fun == 'function'){
						await fun()
					}
				}
			},
			showLast(duration = 300) {
				let mLength = this.msgList.length
				this.showViewByIndex(mLength -1)
			},
			onScroll(e) {
				currentScrollTop = e.detail.scrollTop
				
				// #ifdef H5
				// pc 端 safari浏览器有滚动锚定问题走点击加载
				if (this.isSafariPc) {
					return
				}
				// #endif
				
				if (currentScrollTop < 300) {
					this.loadMore()
				}
				// 防抖
				let fun = () => {
					if (currentScrollTop < 300) {
						this.loadMore()
					}
				}
				debounce(fun,1500)()
			},
			showControl(e) {
				this.$emit('showControl', e)
			},
			retriesSendMsg(e) {
				this.$emit('retriesSendMsg', e)
			},
			//当前用户自己的uid
			current_uid() {
				return uniCloud.getCurrentUserInfo().uid;
			},
			clickItem(){
				this.$emit('clickItem')
			}
		}
	}

	let timers = []

	function debounce(fn, delay) {
		return function() {
			if (timers.length) {
				timers.forEach(timer => clearTimeout(timer))
			}
			let timer = setTimeout(fn, delay);
			timers.push(timer)
		}
	}
</script>

<style lang="scss" scoped>
	.root,
	.uni-im-list {
		/* #ifndef APP-NVUE */
		flex: 1;
		/* #endif */
		background-color: transparent;
	}

	.item {
		margin: 15px 0;
		// border: solid 1px #f40000;
	}

	.mg-15 {
		margin: 15px;
	}

	.data-state-tip-box {
		// height: 35px;
		align-items: center;
		justify-content: center;
		flex-direction: row;
		color: #999999;
	}

	/* #ifndef APP-NVUE */
	.data-state-tip-icon {
		justify-content: center;
		align-items: center;
		display: flex;
		animation: rotation 1s linear infinite;
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	/* #endif */

	.data-state-tip-text {
		height: 36px;
		line-height: 36px;
		font-size: 12px;
		margin: 0 5px;
		color: #999999;
	}

	/* #ifdef H5 */
	.loadMore-btn {
		font-size: 14px;
		color: #666;
	}

	.loadMore-btn::after {
		display: none;
	}

	/* #endif */

	.system-msg-box {
		margin-bottom: 10px;
		align-items: center;
	}

	.msg-box{
		transition-property: background-color;
		transition-duration:2s;
	}
	.active-index{
		background-color: #f9f9f9;
	}
	
	.slider-box{
		border: 1px solid #000;
		position: fixed;
		width: 750rpx;
		height: 55px;
		top: 60px;
		right: 0;
		z-index: 999;
		background-color: #FFF;
	}
	
	.ask-line{
		width: 750rpx;
		text-align: center;
		color: #666;
		font-size: 12px;
	}
	
	.showCallMe{
		background-color: #62caf8;
		border-radius:50px;
		padding:2px 15px;
		font-size: 12px;
		color: #FFF;
		position: fixed;
		right: 5px;
		top: 10px;
		/* #ifdef H5 */
		top: 55px;
		@media screen and (min-width:960px){
			top: calc(7vh + 80px);
			right: calc(50vw - 520px);
		}
		cursor: pointer;
		/* #endif */
	}
</style>