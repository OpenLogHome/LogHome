<template>
	<view class="mescroll-uni-warp">
		<scroll-view :id="viewId" class="mescroll-uni" :class="{'mescroll-uni-fixed':isFixed}" :style="{'height':scrollHeight,'padding-top':padTop,'padding-bottom':padBottom,'top':fixedTop,'bottom':fixedBottom}" :scroll-top="scrollTop" :scroll-with-animation="scrollAnim" @scroll="scroll" :scroll-y='scrollable' :enable-back-to-top="true" :throttle="false">
			<view class="mescroll-uni-content mescroll-render-touch"
			@touchstart="wxsBiz.touchstartEvent" 
			@touchmove="wxsBiz.touchmoveEvent" 
			@touchend="wxsBiz.touchendEvent" 
			@touchcancel="wxsBiz.touchendEvent"
			:change:prop="wxsBiz.propObserver"
			:prop="wxsProp">
						
				<!-- 状态栏 -->
				<view v-if="topbar&&statusBarHeight" class="mescroll-topbar" :style="{height: statusBarHeight+'px', background: topbar}"></view>
							
				<view class="mescroll-wxs-content" :style="{'transform': translateY, 'transition': transition}" :change:prop="wxsBiz.callObserver" :prop="callProp">
					<!-- 下拉加载区域 (支付宝小程序子组件传参给子子组件仍报单项数据流的异常,暂时不通过mescroll-down组件实现)-->
					<!-- <mescroll-down :option="mescroll.optDown" :type="downLoadType"></mescroll-down> -->
					<view v-if="mescroll.optDown.use" class="mescroll-downwarp" :style="{'background':mescroll.optDown.bgColor,'color':mescroll.optDown.textColor}">
						<view class="downwarp-content">
							<log-image class="downwarp-slogan" src="https://www.mescroll.com/img/beibei/mescroll-slogan.jpg?v=1" mode="widthFix"/>
							<view v-if="isDownLoading" class="downwarp-loading mescroll-rotate"></view>
							<view v-else class="downwarp-progress" :style="{'transform':downRotate}"></view>
							<view class="downwarp-mascot"></view>
						</view>
					</view>

					<!-- 列表内容 -->
					<slot></slot>

					<!-- 空布局 -->
					<mescroll-empty v-if="isShowEmpty" :option="mescroll.optUp.empty" @emptyclick="emptyClick"></mescroll-empty>

					<!-- 上拉加载区域 (下拉刷新时不显示, 支付宝小程序子组件传参给子子组件仍报单项数据流的异常,暂时不通过mescroll-up组件实现)-->
					<!-- <mescroll-up v-if="mescroll.optUp.use && !isDownLoading && upLoadType!==3" :option="mescroll.optUp" :type="upLoadType"></mescroll-up> -->
					<view v-if="mescroll.optUp.use && !isDownLoading && upLoadType!==3" class="mescroll-upwarp" :style="{'background':mescroll.optUp.bgColor,'color':mescroll.optUp.textColor}">
						<!-- 努力加载中 (此处不能用v-if,否则android小程序快速上拉可能会不断触发上拉回调) -->
						<view v-show="upLoadType===1">
							<view class="upwarp-progress mescroll-rotate" :style="{'border-color':mescroll.optUp.textColor}"></view>
							<view class="upwarp-tip">{{ mescroll.optUp.textLoading }}</view>
						</view>
						<!-- 无数据 -->
						<view v-if="upLoadType===2" class="upwarp-nodata">{{ mescroll.optUp.textNoMore }}</view>
					</view>
				</view>
				
				<!-- 底部是否偏移TabBar的高度(仅H5端生效) -->
				<!-- #ifdef H5 -->
				<view v-if="bottombar && windowBottom>0" class="mescroll-bottombar" :style="{height: windowBottom+'px'}"></view>
				<!-- #endif -->
				
				<!-- 适配iPhoneX -->
				<view v-if="safearea" class="mescroll-safearea"></view>
			</view>
		</scroll-view>

		<!-- 回到顶部按钮 (fixed元素,需写在scroll-view外面,防止滚动的时候抖动)-->
		<mescroll-top v-model="isShowToTop" :option="mescroll.optUp.toTop" @click="toTopClick"></mescroll-top>

		<!-- #ifdef MP-WEIXIN || MP-QQ || APP-PLUS || H5 -->
		<!-- renderjs的数据载体,不可写在mescroll-downwarp内部,避免use为false时,载体丢失,无法更新数据 -->
		<view :change:prop="renderBiz.propObserver" :prop="wxsProp"></view>
		<!-- #endif -->
	</view>
</template>

<!-- 微信小程序, QQ小程序, app, h5使用wxs -->
<!-- #ifdef MP-WEIXIN || MP-QQ || APP-PLUS || H5 -->
<script src="../../mescroll-uni/wxs/wxs.wxs" module="wxsBiz" lang="wxs"></script>
<!-- #endif -->

<!-- app, h5使用renderjs -->
<!-- #ifdef APP-PLUS || H5 -->
<script module="renderBiz" lang="renderjs">
	import renderBiz from '../../mescroll-uni/wxs/renderjs.js';
	export default {
		mixins: [renderBiz]
	}
</script>
<!-- #endif -->

<script>
	import MeScroll from '../../mescroll-uni/mescroll-uni.js';
	import MescrollTop from '../../mescroll-uni/components/mescroll-top.vue';
	import WxsMixin from '../../mescroll-uni/wxs/mixins.js';
	import mescrollI18n from '../../mescroll-uni/mescroll-i18n.js';
	import GlobalOption from './mescroll-uni-option.js';
	
	export default {
		mixins: [WxsMixin],
		components: {
			MescrollTop
		},
		data() {
			return {
				mescroll: null, // mescroll实例
				viewId: 'id_' + Math.random().toString(36).substr(2,16), // 随机生成mescroll的id(不能数字开头,否则找不到元素)
				downHight: 0, //下拉刷新: 容器高度
				downLoadType: 0, // 下拉刷新状态: 0(loading前), 1(inOffset), 2(outOffset), 3(showLoading), 4(endDownScroll)
				upLoadType: 0, // 上拉加载状态: 0(loading前), 1loading中, 2没有更多了,显示END文本提示, 3(没有更多了,不显示END文本提示)
				isShowEmpty: false, // 是否显示空布局
				isShowToTop: false, // 是否显示回到顶部按钮
				scrollTop: 0, // 滚动条的位置
				scrollAnim: false, // 是否开启滚动动画
				windowTop: 0, // 可使用窗口的顶部位置
				windowBottom: 0, // 可使用窗口的底部位置
				windowHeight: 0, // 可使用窗口的高度
				statusBarHeight: 0 // 状态栏高度
			}
		},
		props: {
			down: Object, // 下拉刷新的参数配置
			up: Object, // 上拉加载的参数配置
			i18n: Object, // 国际化的参数配置
			top: [String, Number], // 下拉布局往下的偏移量 (支持20, "20rpx", "20px", "20%"格式的值, 其中纯数字则默认单位rpx, 百分比则相对于windowHeight)
			topbar: [Boolean, String], // top的偏移量是否加上状态栏高度, 默认false (使用场景:取消原生导航栏时,配置此项可留出状态栏的占位, 支持传入字符串背景,如色值,背景图,渐变)
			bottom: [String, Number], // 上拉布局往上的偏移量 (支持20, "20rpx", "20px", "20%"格式的值, 其中纯数字则默认单位rpx, 百分比则相对于windowHeight)
			safearea: Boolean, // bottom的偏移量是否加上底部安全区的距离, 默认false (需要适配iPhoneX时使用)
			fixed: { // 是否通过fixed固定mescroll的高度, 默认true
				type: Boolean,
				default: true
			},
			height: [String, Number], // 指定mescroll的高度, 此项有值,则不使用fixed. (支持20, "20rpx", "20px", "20%"格式的值, 其中纯数字则默认单位rpx, 百分比则相对于windowHeight)
			bottombar:{ // 底部是否偏移TabBar的高度(默认仅在H5端的tab页生效)
				type: Boolean,
				default: true
			},
			disableScroll: Boolean // 是否禁止滚动
		},
		computed: {
			// 是否使用fixed定位 (当height有值,则不使用)
			isFixed(){
				return !this.height && this.fixed
			},
			// mescroll的高度
			scrollHeight(){
				if (this.isFixed) {
					return "auto"
				} else if(this.height){
					return this.toPx(this.height) + 'px'
				}else{
					return "100%"
				}
			},
			// 下拉布局往下偏移的距离 (px)
			numTop() {
				return this.toPx(this.top)
			},
			fixedTop() {
				return this.isFixed ? (this.numTop + this.windowTop) + 'px' : 0
			},
			padTop() {
				return !this.isFixed ? this.numTop + 'px' : 0
			},
			// 上拉布局往上偏移 (px)
			numBottom() {
				return this.toPx(this.bottom)
			},
			fixedBottom() {
				return this.isFixed ? (this.numBottom + this.windowBottom) + 'px' : 0
			},
			padBottom() {
				return !this.isFixed ? this.numBottom + 'px' : 0
			},
			// 是否为重置下拉的状态
			isDownReset(){
				return this.downLoadType===3 || this.downLoadType===4
			},
			// 过渡
			transition() {
				return this.isDownReset ? 'transform 300ms' : ''
			},
			translateY() {
				return this.downHight > 0 ? 'translateY(' + this.downHight + 'px)' : '' // transform会使fixed失效,需注意把fixed元素写在mescroll之外
			},
			// 列表是否可滑动
			scrollable(){
				if(this.disableScroll) return false
				return this.downLoadType===0 || this.isDownReset
			},
			// 是否在努力加载中
			isDownLoading(){
				return this.downLoadType === 3
			},
			// 旋转的角度
			downRotate(){
				return this.downLoadType === 2 ? 'rotate(180deg)' : 'rotate(0deg)'
			}
		},
		methods: {
			//number,rpx,upx,px,% --> px的数值
			toPx(num){
				if(typeof num === "string"){
					if (num.indexOf('px') !== -1) {
						if(num.indexOf('rpx') !== -1) { // "10rpx"
							num = num.replace('rpx', '');
						} else if(num.indexOf('upx') !== -1) { // "10upx"
							num = num.replace('upx', '');
						} else { // "10px"
							return Number(num.replace('px', ''))
						}
					}else if (num.indexOf('%') !== -1){
						// 传百分比,则相对于windowHeight,传"10%"则等于windowHeight的10%
						let rate = Number(num.replace("%","")) / 100
						return this.windowHeight * rate
					}
				}
				return num ? uni.upx2px(Number(num)) : 0
			},
			//注册列表滚动事件,用于下拉刷新和上拉加载
			scroll(e) {
				this.mescroll.scroll(e.detail, () => {
					this.$emit('scroll', this.mescroll) // 此时可直接通过 this.mescroll.scrollTop获取滚动条位置; this.mescroll.isScrollUp获取是否向上滑动
				})
			},
			// 点击空布局的按钮回调
			emptyClick() {
				this.$emit('emptyclick', this.mescroll)
			},
			// 点击回到顶部的按钮回调
			toTopClick() {
				this.mescroll.scrollTo(0, this.mescroll.optUp.toTop.duration); // 执行回到顶部
				this.$emit('topclick', this.mescroll); // 派发点击回到顶部按钮的回调
			},
			// 更新滚动区域的高度 (使内容不满屏和到底,都可继续翻页)
			setClientHeight() {
				if (this.mescroll.getClientHeight(true) === 0 && !this.isExec) {
					this.isExec = true; // 避免多次获取
					this.$nextTick(() => { // 确保dom已渲染
						this.getClientInfo(data=>{
							this.isExec = false;
							if (data) {
								this.mescroll.setClientHeight(data.height);
							} else if (this.clientNum != 3) { // 极少部分情况,可能dom还未渲染完毕,递归获取,最多重试3次
								this.clientNum = this.clientNum == null ? 1 : this.clientNum + 1;
								setTimeout(() => {
									this.setClientHeight()
								}, this.clientNum * 100)
							}
						})
					})
				}
			},
			// 获取滚动区域的信息
			getClientInfo(success){
				let query = uni.createSelectorQuery();
				// #ifndef MP-ALIPAY || MP-DINGTALK
				query = query.in(this) // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
				// #endif
				let view = query.select('#' + this.viewId);
				view.boundingClientRect(data => {
					success(data)
				}).exec();
			}
		},
		// 使用created初始化mescroll对象; 如果用mounted部分css样式编译到H5会失效
		created() {
			let vm = this;

			let diyOption = {
				// 下拉刷新的配置
				down: {
					inOffset() {
						vm.downLoadType = 1; // 下拉的距离进入offset范围内那一刻的回调 (自定义mescroll组件时,此行不可删)
					},
					outOffset() {
						vm.downLoadType = 2; // 下拉的距离大于offset那一刻的回调 (自定义mescroll组件时,此行不可删)
					},
					onMoving(mescroll, rate, downHight) {
						// 下拉过程中的回调,滑动过程一直在执行;
						vm.downHight = downHight; // 设置下拉区域的高度 (自定义mescroll组件时,此行不可删)
					},
					showLoading(mescroll, downHight) {
						vm.downLoadType = 3; // 显示下拉刷新进度的回调 (自定义mescroll组件时,此行不可删)
						vm.downHight = downHight; // 设置下拉区域的高度 (自定义mescroll组件时,此行不可删)
					},
					endDownScroll() {
						vm.downLoadType = 4; // 结束下拉 (自定义mescroll组件时,此行不可删)
						vm.downHight = 0; // 设置下拉区域的高度 (自定义mescroll组件时,此行不可删)
						vm.downResetTimer && clearTimeout(vm.downResetTimer)
						vm.downResetTimer = setTimeout(()=>{ // 过渡动画执行完毕后,需重置为0的状态,以便置空this.transition,避免iOS小程序列表渲染不完整
							if(vm.downLoadType===4) vm.downLoadType = 0
						},300)
					},
					// 派发下拉刷新的回调
					callback: function(mescroll) {
						vm.$emit('down', mescroll)
					}
				},
				// 上拉加载的配置
				up: {
					// 显示努力加载中的回调
					showLoading() {
						vm.upLoadType = 1;
					},
					// 显示无更多数据的回调
					showNoMore() {
						vm.upLoadType = 2;
					},
					// 隐藏上拉加载的回调
					hideUpScroll(mescroll) {
						vm.upLoadType = mescroll.optUp.hasNext ? 0 : 3;
					},
					// 空布局
					empty: {
						onShow(isShow) { // 显示隐藏的回调
							vm.isShowEmpty = isShow;
						}
					},
					// 回到顶部
					toTop: {
						onShow(isShow) { // 显示隐藏的回调
							vm.isShowToTop = isShow;
						}
					},
					// 派发上拉加载的回调
					callback: function(mescroll) {
						vm.$emit('up', mescroll);
						// 更新容器的高度 (多mescroll的情况)
						vm.setClientHeight()
					}
				}
			}

			let i18nType = mescrollI18n.getType() // 当前语言类型
			let i18nOption = {type: i18nType} // 国际化配置
			MeScroll.extend(i18nOption, vm.i18n) // 具体页面的国际化配置
			MeScroll.extend(i18nOption, GlobalOption.i18n) // 全局的国际化配置
			MeScroll.extend(diyOption, i18nOption[i18nType]); // 混入国际化配置
			MeScroll.extend(diyOption, {down:GlobalOption.down, up:GlobalOption.up}); // 混入全局的配置
			let myOption = JSON.parse(JSON.stringify({'down': vm.down,'up': vm.up})) // 深拷贝,避免对props的影响
			MeScroll.extend(myOption, diyOption); // 混入具体界面的配置

			// 初始化MeScroll对象
			vm.mescroll = new MeScroll(myOption);
			vm.mescroll.viewId = vm.viewId; // 附带id
			// 挂载语言包
			vm.mescroll.i18n = i18nOption;
			// init回调mescroll对象
			vm.$emit('init', vm.mescroll);
			
			// 设置高度
			const sys = uni.getSystemInfoSync();
			if(sys.windowTop) vm.windowTop = sys.windowTop;
			if(sys.windowBottom) vm.windowBottom = sys.windowBottom;
			if(sys.windowHeight) vm.windowHeight = sys.windowHeight;
			if(sys.statusBarHeight) vm.statusBarHeight = sys.statusBarHeight;
			// 使down的bottomOffset生效
			vm.mescroll.setBodyHeight(sys.windowHeight);

			// 因为使用的是scrollview,这里需自定义scrollTo
			vm.mescroll.resetScrollTo((y, t) => {
				vm.scrollAnim = (t !== 0); // t为0,则不使用动画过渡
				if(typeof y === 'string'){
					// 小程序不支持slot里面的scroll-into-view, 统一使用计算的方式实现
					vm.getClientInfo(function(rect){
						let mescrollTop = rect.top // mescroll到顶部的距离
						let selector;
						if(y.indexOf('#')==-1 && y.indexOf('.')==-1){
							selector = '#'+y // 不带#和. 则默认为id选择器
						}else{
							selector = y
							// #ifdef APP-PLUS || H5 || MP-ALIPAY || MP-DINGTALK
							if(y.indexOf('>>>')!=-1){ // 不支持跨自定义组件的后代选择器 (转为普通的选择器即可跨组件查询)
								selector = y.split('>>>')[1].trim()
							}
							// #endif
						}
						uni.createSelectorQuery().select(selector).boundingClientRect(function(rect){
							if (rect) {
								let curY = vm.mescroll.getScrollTop()
								let top = rect.top - mescrollTop
								top += curY
								if(!vm.isFixed) top -= vm.numTop
								vm.scrollTop = curY;
								vm.$nextTick(function() {
									vm.scrollTop = top
								})
							} else{
								console.error(selector + ' does not exist');
							}
						}).exec()
					})
					return;
				}
				let curY = vm.mescroll.getScrollTop()
				if (t === 0 || t === 300) { // 当t使用默认配置的300时,则使用系统自带的动画过渡
					vm.scrollTop = curY;
					vm.$nextTick(function() {
						vm.scrollTop = y
					})
				} else {
					vm.mescroll.getStep(curY, y, step => { // 此写法可支持配置t
						vm.scrollTop = step
					}, t)
				}
			})
			
			// 具体的界面如果不配置up.toTop.safearea,则取本vue的safearea值
			if (vm.up && vm.up.toTop && vm.up.toTop.safearea != null) {} else {
				vm.mescroll.optUp.toTop.safearea = vm.safearea;
			}
			// 全局配置监听
			uni.$on("setMescrollGlobalOption", options=>{
				if(!options) return;
				let i18nType = options.i18n ? options.i18n.type : null
				if(i18nType && vm.mescroll.i18n.type != i18nType){
					vm.mescroll.i18n.type = i18nType
					mescrollI18n.setType(i18nType)
					MeScroll.extend(options, vm.mescroll.i18n[i18nType])
				}
				if(options.down){
					let down = MeScroll.extend({}, options.down)
					vm.mescroll.optDown = MeScroll.extend(down, vm.mescroll.optDown)
				}
				if(options.up){
					let up = MeScroll.extend({}, options.up)
					vm.mescroll.optUp = MeScroll.extend(up, vm.mescroll.optUp)
				}
			})
		},
		mounted() {
			// 设置容器的高度
			this.setClientHeight()
		},
		destroyed() {
			// 注销全局配置监听
			uni.$off("setMescrollGlobalOption")
		}
	}
</script>

<style>
	@import "../../mescroll-uni/mescroll-uni.css";
	@import "../../mescroll-uni/components/mescroll-down.css";
	@import "../../mescroll-uni/components/mescroll-up.css";
	@import "./components/mescroll-down.css";
</style>
