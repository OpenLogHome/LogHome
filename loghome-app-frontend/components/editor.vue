<template>
	<view>
		<!-- 导航栏 -->
		<statusBar>
			<text slot="pageTitle" class="font-title mt-1">编辑器</text>
			<view v-if="!isWechat" slot="right-text" class="flex just-content-around">
				<view @tap="saveValidation">
					<text style="color: #59C65D; margin-top: 3rpx;" class="font-title">保存</text>
				</view>
			</view>
		</statusBar>
		
		<!-- 分割线 -->
		<view class="hr"></view>
		
		<!-- 内容区域 -->
		<view class="p-3">
			<scroll-view scroll-y="true" style="width: 100%;" :style="{'bottom': this.absEditorH + 'px'}">
				<editor @focus="editorFocus" id="editor" @ready="onEditorReady"
				show-img-size show-img-resize show-img-toolbar 
				:focus="true" placeholder="请输入..." class="h6" style="width: 100%;" :style="editorHeiht"></editor>
			</scroll-view>
		</view>
		
		<!-- 键盘功能切换 -->
		<view class="keywordOrFunction-box border bg-color-white" :style="{'bottom':keyWordMenuHeight}">
			<view v-if="currentPopupType != '字号'" class="titleMenu w-100 flex just-content-around align-center">
				<view v-for="(item,index) in popupMenu" :key="index" @tap.stop="tapMenu(index)">
					<log-image :src="item.img" :style="{
						'width': item.w + 'rpx',
						'height': item.h + 'rpx'
					}"></log-image>
				</view>
			</view>
			<view v-if="currentPopupType == '字号'" class="titleMenu w-100 flex align-center">
				<view style="width: 100rpx;" class="flex align-center just-content-around">
					<view><text class="icon iconfont h4 font-color-666" @tap="tapMenu(2,false)">&#xe635;</text></view>
					<!-- <view><text class="icon iconfont font-title font-color-666">&#xe6c7;</text></view> -->
					<view class="divider flex align-center" style="margin-top: 6rpx;"></view>
				</view>
				<view style="width: 650rpx;" class="flex just-content-center align-center">
					<text class="h5">{{fontSizeOrTitleSize}}</text>
				</view>
			</view>
			
		</view>
		
		<!-- 编辑器 -->
		<cPopup ref="cPopup" :height="popupHeight" :isCircleAngle="false" :isShowMask="false">
			<view slot="content">
				<scroll-view scroll-y="true" style="height: 750rpx;">
					<view v-if="currentPopupType == '字体'">
						<view class="fontSyle box px-4 w-100 flex align-center">
							<view class="fontSize flex dire-column just-content-center align-center" @tap="selectFontSize">
								<view><text class="font-color-9A font-small">字号</text></view>
								<view><text class="font-title font-mian">{{currentFontSize}}</text></view>
							</view>
							<view class="ml-2" style="height: 180rpx;">
								<view @tap.stop="selectTitleSize" class="flex fontFamily just-content-center align-center"><text class="h6 font-color-666">{{currentFontTitle}}</text></view>
								<view @tap.stop="setFont" class="flex mt-2 fontFamily just-content-center align-center"><text class="h6 font-color-666">思源黑体</text></view>
							</view>
						</view>
						<!-- 分割线 -->
						<view class="hr20"></view>
						
						<view class="px-4 mt-3 mb-3 flex align-center">
							<view class="flex just-content-around align-center fontFamily-left">
								<view v-for="(item,index) in fontFamily" :key="index" :class="item.isSelect?'font-mian':''" class="flex align-center" @tap.stop="selectFamily(index)">
									<log-image :src="item.img" :style="{
										'width': item.w + 'rpx',
										'height': item.h + 'rpx'
									}"></log-image>
									<view class="divider ml-4"></view>
								</view>
							</view>
							<view class="fontFamily-right ml-2 flex just-content-center align-center" @tap.stop="removeFormat">
								<img src="/static/editor/I-d.png" style="width: 32rpx;height: 38rpx;"></img>
							</view>
						</view>
						
						<!-- 字体颜色 -->
						<view class="px-4">
							<view class="mb-2"><text class="font-color-9A font-small font-weight-bold">字体颜色</text></view>
							<view class="fontColor-box flex align-center just-content-around">
								<view v-for="(item,index) in fontColor" :key="index" @tap="selectFontColor(index)">
									<view v-if="index == 5"><log-image :src="item.img" style="margin-top: 12rpx;" :style="{
										'width': item.w + 'rpx',
										'height': item.h + 'rpx'
									}"></log-image></view>
									<view v-else class="fColor flex just-content-center align-center" :style="'background-color: #'+item.img">
										<text v-if="item.isSelect" class="icon iconfont h6 font-white">&#xe623;</text>
									</view>
								</view>
							</view>
						</view>
						
						<!-- 背景颜色 -->
						<view class="px-4 mt-1">
							<view class="mb-2"><text class="font-color-9A font-small font-weight-bold">背景颜色</text></view>
							<view class="fontColor-box flex align-center just-content-around">
								<view v-for="(item,index) in bgColor" :key="index" @tap="selectBGColor(index)">
									<view v-if="index > 3"><log-image :src="item.img" style="margin-top: 12rpx;" :style="{
										'width': item.w + 'rpx',
										'height': item.h + 'rpx'
									}"></log-image></view>
									<view v-else class="bgColor flex just-content-center align-center" :style="'background-color: #'+item.img">
										<text v-if="item.isSelect" class="icon iconfont h6 font-white">&#xe623;</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					
					<view v-if="currentPopupType == '对齐方式'">
						<view class="px-4 py-3 flex">
							<view class="flex just-content-around align-center align-box-left">
								<view v-for="(item,index) in alignWay" :key="index" class="flex align-center" @tap.stop="selectAlignMent(index)">
									<log-image :src="item.img" :style="{
										'width': item.w + 'rpx',
										'height': item.h + 'rpx'
									}"></log-image>
									<view v-if="index != alignWay.length-1" class="divider ml-4"></view>
								</view>
							</view>
							<view class="align-box-right ml-2 flex just-content-around align-center">
								<view v-for="(item,index) in sortStyle" :key="index" class="flex align-center" @tap.stop="selectSortStyle(index)">
									<log-image :src="item.img" :style="{
										'width': item.w + 'rpx',
										'height': item.h + 'rpx'
									}"></log-image>
									<view v-if="index != sortStyle.length-1" class="divider ml-4"></view>
								</view>
							</view>
						</view>
						
						<!-- 分割线 -->
						<view class="hr20"></view>
						
						<!-- 缩进 -->
						<view class="pl-4">
							<view v-for="(item,index) in indentition" :key="index" @tap.stop="selectIndent(index)">
								<view class="py-3 flex align-center">
									<log-image :src="item.img" class="mt-1" :style="{
										'width': item.w + 'rpx',
										'height': item.h + 'rpx'
									}"></log-image>
									<view><text class="h5 font-color-666 ml-2">{{item.title}}</text></view>
								</view>
								<view class="view-hr"></view>
							</view>
						</view>
					</view>
								
					<view v-if="currentPopupType == '功能'">
						<view class="">
							<view v-for="(item,index) in functionList" :key="index" @tap="selectFunction(index,item.value)">
								<view class="py-3 pl-4 flex align-center">
									<log-image :src="item.img" class="mt-1" :style="{
										'width': item.w + 'rpx',
										'height': item.h + 'rpx'
									}"></log-image>
									<view><text class="h5 font-color-666 ml-2">{{item.title}}</text></view>
								</view>
								<view class="hr20" v-if="index == 3 || index == 5"></view>
								<view v-else class="hr-710 ml-4"></view>
							</view>
						</view>
					</view>
				
					<view v-if="currentPopupType == '字号' && fontSizeOrTitleSize == '字号'">
						<!-- 缩进 -->
						<view>
							<view v-for="(item,index) in fontSizeData" :key="index" @tap.stop="confirmFontSize">
								<i data-name="fontSize" :data-value="item.num" class="h5 py-3 font-color-666 ml-3">{{item.title}}</i>
								<view class="view-hr"></view>
							</view>
						</view>
					</view>
					
					<view v-if="currentPopupType == '字号' && fontSizeOrTitleSize == '标题'">
						<!-- 缩进 -->
						<view>
							<view v-for="(item,index) in fontTitle" :key="index" @tap.stop="confirmFontSize">
								<i data-name="header" :data-value="item.title" class="h5 py-3 font-color-666 ml-3">{{item.title}}</i>
								<view class="view-hr"></view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</cPopup>
		
		<!-- 颜色选择器 -->
		<t-color-picker ref="colorPicker" :color="pickerColor" @confirm="pickerConfirm" @cancel="pickerCancel"></t-color-picker>
		
		<!-- #ifdef MP-WEIXIN -->
			<view v-if="isWechat" @click="saveValidation" class="float-btn-box circle flex just-content-center align-center">
				<text class="icon iconfont h6 font-white">保存</text>
			</view>
		<!-- #endif -->
		
	</view>
</template>

<script>
	import statusBar from "@/components/c-ui/c-navbar.vue"
	import cPopup from "@/components/c-ui/c-popup.vue"
	import tColorPicker from "@/components/t-color-picker/t-color-picker.vue"
	export default {
		components: {
			statusBar,
			cPopup,
			tColorPicker,
		},
		props: {
			htmlContent: {
				type: String,
				default: ''
			},
		},
		watch: {
			switchKeyword(newValue, oldValue) {
				let keywordHeight = 0;
				if (this.currentPopupType == '字体' || this.currentPopupType == '对齐方式' || this.currentPopupType == '功能' || this.currentPopupType == '字号' || this.currentPopupType == '格式') {
					keywordHeight = uni.upx2px(this.popupHeight);
				}
				
				if (this.currentPopupType == '软键盘') {
					if (this.currentPlatform == 'android') {
						keywordHeight = uni.upx2px(10);
					}
					if (this.currentPlatform == 'ios') {
						this.$nextTick(()=>{
							keywordHeight = this.switchKeyword;
						})
					}
				}
				this.absEditorH = keywordHeight;
			},
			/* 监听 */
			editorHeiht(newValue, oldValue){
				// #ifdef APP-PLUS
				if (this.switchKeyword <= 0) {
					this.keyWordMenuHeight = this.popupHeight + 'rpx';
				} else {
					/* 软件盘高度大于0时 */
					this.keyWordMenuHeight = this.switchKeyword + 'px';
				}
				// #endif
				
				// #ifdef MP-WEIXIN
				this.keyWordMenuHeight = this.popupHeight + 'rpx';
				// #endif
			},
			/* 软件盘高度大于0时 */
			switchKeyword(newValue, oldValue) {
				this.keyWordMenuHeight = newValue + 'px';
			}
		},
		computed: {
			editorHeiht(){
				let height = "";
				if (this.currentPlatform == 'ios') {
					height = this.windowHeight - this.popupHeight - this.statusBarHeight - this.switchKeyword - uni.upx2px(250);
				} else {
					height = this.windowHeight - this.popupHeight - this.statusBarHeight - this.switchKeyword + uni.upx2px(250);
				}
				return `height:${height}px`;
			}
		},
		data() {
			return {
				/* 是否是微信小程序 */
				isWechat: false,
					
				/* 当前Index */
				currentIndex: 0,
				
				/* 编辑器高度 */
				absEditorH: 0,
				/* 获取当前屏幕高度 */
				windowHeight: 0,
				/* 状态栏高度 */
				statusBarHeight: 0,
				/* 当前手机为安卓 还是 苹果 */
				currentPlatform: '',
				/* 富文本功能/软键盘 menu 高度 */
				keyWordMenuHeight: 0,
				
				/* 是否显示键盘功能切换菜单 */
				isSwitchKeyWord: false,
				/* switchKeyword的高度 */
				switchKeyword: 0,
				
				/* 弹出框高度 */
				popupHeight: 0,
				/* 当前popup类型 */
				currentPopupType: '软键盘',
				
				/* 菜单栏 */
				popupMenu: [
					{img:'/static/editor/undo.png',w:'42',h:'33',isSelect:false},
					{img:'/static/editor/return.png',w:'42',h:'33',isSelect:false},
					{img:'/static/editor/A.png',w:'30',h:'37',isSelect:false},
					{img:'/static/editor/alignMent.png',w:'35',h:'32',isSelect:false},
					{img:'/static/editor/function.png',w:'39',h:'39',isSelect:false}
				],
				
				/* 字体功能 */
				fontFamily: [
					{img:'/static/editor/B.png',w:'26',h:'37',isSelect:true},
					{img:'/static/editor/I.png',w:'23',h:'37',isSelect:false},
					{img:'/static/editor/U.png',w:'34',h:'38',isSelect:false},
					{img:'/static/editor/S.png',w:'32',h:'37',isSelect:false}
				],
				
				/* 当前picker颜色 */
				pickerColor: {r: 89,g: 198,b: 93,a: 1},
				confirmPickerColor: '',
				/* 当前打开颜色选择器为字体还是背景 */
				currentColorType: '',
				/* 字体颜色 */
				fontColor: [
					{img:'000000',w:'26',h:'37',isSelect:false},
					{img:'666666',w:'23',h:'37',isSelect:false},
					{img:'FF0000',w:'34',h:'38',isSelect:false},
					{img:'FFFF00',w:'32',h:'37',isSelect:false},
					{img:'0000FF',w:'34',h:'38',isSelect:false},
					{img:'/static/editor/colorful.png',w:'50',h:'50',isSelect:false}
				],
				/* 背景颜色 */
				bgColor: [
					{img:'FFD800',w:'26',h:'37',isSelect:false},
					{img:'EE82EE',w:'23',h:'37',isSelect:false},
					{img:'00FFFF',w:'34',h:'38',isSelect:false},
					{img:'FF5E5E',w:'32',h:'37',isSelect:false},
					{img:'/static/editor/delete.png',w:'50',h:'50',isSelect:false},
					{img:'/static/editor/colorful.png',w:'50',h:'50',isSelect:false}
				],
				
				/* 对齐方式 */
				alignWay: [
					{img:'/static/editor/align/left.png',w:'36',h:'32',isSelect:false},
					{img:'/static/editor/align/center.png',w:'36',h:'32',isSelect:false},
					{img:'/static/editor/align/right.png',w:'36',h:'32',isSelect:false},
				],
				
				/* 排序样式 */
				sortStyle: [
					{img:'/static/editor/align/number.png',w:'39',h:'38',isSelect:false},
					{img:'/static/editor/align/point.png',w:'39',h:'38',isSelect:false}
				],
				
				/* 缩进 */
				indentition: [
					{img:'/static/editor/align/add.png',title:'增加缩进',w:'41',h:'31',isSelect:false},
					{img:'/static/editor/align/sub.png',title:'减少缩进',w:'41',h:'31',isSelect:false}
				],
				
				/* 功能 */
				functionList: [
					// {img:'/static/editor/function/replace.png',title:'查找替换',w:'40',h:'40',isSelect:false},
					{img:'/static/editor/function/img.png',title:'添加图片',w:'37',h:'33',isSelect:false},
					{img:'/static/editor/function/weachat.png',title:'添加微信号',value:'微信号',w:'42',h:'35',isSelect:false},
					{img:'/static/editor/function/qr.png',title:'添加微信二维码',value:'二维码',w:'37',h:'36',isSelect:false},
					{img:'/static/editor/function/phone.png',title:'添加电话',value:'电话',w:'33',h:'48',isSelect:false},
					{img:'/static/editor/function/qq.png',title:'添加QQ号',value:'qq',w:'43',h:'51',isSelect:false},
					{img:'/static/editor/function/name.png',title:'添加昵称',value:'昵称',w:'43',h:'33',isSelect:false},
					{img:'/static/editor/function/city.png',title:'添加城市',value:'城市',w:'39',h:'39',isSelect:false},
					{img:'/static/editor/function/gender.png',title:'添加性别',value:'性别',w:'41',h:'41',isSelect:false}
				],
				
				/* 字号大小还是标题大小 */
				fontSizeOrTitleSize: '',
				/* 当前字号 */
				currentFontSize: 12,
				/* 字号 */
				fontSizeData: [
					{num:12,title:'12px',isSelect:true},
					{num:14,title:'14px',isSelect:false},
					{num:16,title:'16px',isSelect:false},
					{num:20,title:'20px',isSelect:false},
					{num:24,title:'24px',isSelect:false},
					{num:28,title:'28px',isSelect:false},
					{num:30,title:'30px',isSelect:false},
					{num:35,title:'35px',isSelect:false},
					{num:42,title:'42px',isSelect:false}
				],
				/* 当前标题大小 */
				currentFontTitle: '(p)正文',
				/* 标题大小 */
				fontTitle: [
					{num:12,title:'(p)正文',isSelect:true},
					{num:32,title:'h1',isSelect:false},
					{num:24,title:'h2',isSelect:false},
					{num:18,title:'h3',isSelect:false},
					{num:16,title:'h4',isSelect:false},
					{num:13,title:'h5',isSelect:false},
					{num:11,title:'h6',isSelect:false},
				],
			}
		},
		methods: {
			/* editor  区域 */
			onEditorReady() {
				uni.createSelectorQuery().in(this).select('#editor').context((res)=> {
					this.editorCtx = res.context;
					
					/* 传递的数据  这里也可以改为你们的API接口获取文本 */
					this.editorCtx.setContents({
						html: this.htmlContent,
						success: () => {}
					})
				}).exec();
			},
			/* 设置字体 */
			setFont(){
				let e = {target:{dataset:{name:'fontFamily',value:'Arial,Verdana,Sans-serif'}}};
				this.format(e);
			},
			/* 撤销 */
			undo() {
				this.editorCtx.undo();
			},
			/* 还原 */
			redo() {
				this.editorCtx.redo();
			},
			/* 样式改变 */
			format(e){
				let {
					name,
					value
				} = e.target.dataset;
				if (!name) return;  
				if (name=='fontSize') value = value + 'px';
				this.editorCtx.format(name, value);
			},
			/* 去除样式 */
			removeFormat() {
				this.fontFamily = [
					{img:'/static/editor/B.png',w:'26',h:'37',isSelect:true},
					{img:'/static/editor/I.png',w:'23',h:'37',isSelect:false},
					{img:'/static/editor/U.png',w:'34',h:'38',isSelect:false},
					{img:'/static/editor/S.png',w:'32',h:'37',isSelect:false}
				];
				this.fontColor.forEach(r=>r.isSelect=false);
				this.bgColor.forEach(r=>r.isSelect=false);
				this.editorCtx.removeFormat();
			},
			
			/* 显示Popup */
			showPopup(){
				this.$refs.cPopup.isPopup = true;
			},
			/* 隐藏popup */
			hidePopup(){
				this.$refs.cPopup.isPopup = false;
			},
			/* 显示软键盘 隐藏popup */
			showKeyWord(){
				this.isSwitchKeyWord = false;
				this.popupHeight = 0;
				this.currentPopupType = '软键盘';
				this.popupMenu[2] = {img:'/static/editor/A.png',w:'30',h:'37',isSelect:false},
				this.popupMenu[3] = {img:'/static/editor/alignMent.png',w:'35',h:'32',isSelect:false},
				this.popupMenu[4] = {img:'/static/editor/function.png',w:'39',h:'39',isSelect:false}
				this.hidePopup();
			},
			/* 点击菜单栏 */
			tapMenu(index,isTrue=true){
				/* 是否点击同一个  同一个切换到软键盘 */
				if (isTrue && index != 0 && index != 1) {
					let item = this.popupMenu.find(r=>r.isSelect);
					let indexOf = this.popupMenu.indexOf(item);
					if (indexOf == index) {
						this.showKeyWord();
						return;
					};
				}
				
				this.popupHeight = 750;
				
				if (index == 0) {
					this.undo();
				};
				if (index == 1) {
					this.redo();
				};
				if (index == 2) {
					this.currentPopupType = '字体';
					this.popupMenu[2] = {img:'/static/editor/keyword.png',w:'44',h:'44',isSelect:true},
					this.popupMenu[3] = {img:'/static/editor/alignMent.png',w:'35',h:'32',isSelect:false},
					this.popupMenu[4] = {img:'/static/editor/function.png',w:'39',h:'39',isSelect:false}
				};
				if (index == 3) {
					this.currentPopupType = '对齐方式';
					this.popupMenu[2] = {img:'/static/editor/A.png',w:'30',h:'37',isSelect:false},
					this.popupMenu[3] = {img:'/static/editor/keyword.png',w:'44',h:'44',isSelect:true},
					this.popupMenu[4] = {img:'/static/editor/function.png',w:'39',h:'39',isSelect:false}
				};
				if (index == 4) {
					this.currentPopupType = '功能';
					this.popupMenu[2] = {img:'/static/editor/A.png',w:'30',h:'37',isSelect:false},
					this.popupMenu[3] = {img:'/static/editor/alignMent.png',w:'35',h:'32',isSelect:false},
					this.popupMenu[4] = {img:'/static/editor/keyword.png',w:'44',h:'44',isSelect:true}
				};
				if (index == 2 || index == 3 || index == 4) {
					uni.hideKeyboard();
					this.showPopup();
				}
			},
			/* 选择字体颜色 */
			selectFontColor(index){
				this.currentColorType = '文字';
				this.fontColor.forEach((r,i)=>r.isSelect=i==index);
				
				if (index == 5) {
					this.$refs.colorPicker.open();
				} else {
					let e = {target:{dataset:{name:'color',value:'#'+this.fontColor[index].img}}};
					this.format(e);
				}
			},
			/* 选择背景颜色 */
			selectBGColor(index){
				this.currentColorType = '背景';
				this.bgColor.forEach((r,i)=>r.isSelect=i==index);
				
				if (index == 5) {
					this.$refs.colorPicker.open();
				} else if (index == 4) {
					let e = {target:{dataset:{name:'backgroundColor',value:''}}};
					this.format(e);
				} else {
					let e = {target:{dataset:{name:'backgroundColor',value:'#'+this.bgColor[index].img}}};
					this.format(e);
				}
			},
			/* editor获取焦点 */
			editorFocus(){
				this.showKeyWord();
			},
			pickerConfirm(e){
				this.pickerColor = e.rgba;
				
				let color;
				if (this.currentColorType == '文字') {
					color = {target:{dataset:{name:'color',value:e.hex}}};
				} else {
					color = {target:{dataset:{name:'backgroundColor',value:e.hex}}};
				}
				this.format(color);
				
				this.$refs.colorPicker.close();
			},
			pickerCancel(){
				this.$refs.colorPicker.close();
			},
			
			/* 选择字体大小 */
			selectFontSize(){
				this.currentPopupType = '字号';
				this.fontSizeOrTitleSize = '字号';
				this.showPopup();
			},
			/* 选择标题大小 */
			selectTitleSize(){
				this.currentPopupType = '字号';
				this.fontSizeOrTitleSize = '标题';
				this.showPopup();
			},
			/* 确认字体大小 */
			confirmFontSize(e){
				this.currentFontSize = e.target.dataset.value;
				this.tapMenu(2,false);
				this.format(e);
			},
			/* 选择字体样式 */
			selectFamily(index){
				this.fontFamily[index].isSelect = !this.fontFamily[index].isSelect;
				
				let e = {target:{dataset:{name:'',value:''}}};
				
				if (index == 0) {
					if (this.fontFamily[0].isSelect) {
						this.fontFamily[0].img = '/static/editor/B-active.png';
						e.target.dataset.name = 'bold';
						e.target.dataset.value = '';
					} else {
						this.fontFamily[0].img = '/static/editor/B.png';
					};
					this.format(e);
				}
				
				if (index == 1) {
					if (this.fontFamily[1].isSelect) {
						this.fontFamily[1].img = '/static/editor/I-active.png';
						e.target.dataset.name = 'italic';
						e.target.dataset.value = '';
					} else {
						this.fontFamily[1].img = '/static/editor/I.png';
					};
					this.format(e);
				}
				
				if (index == 2) {
					if (this.fontFamily[2].isSelect) {
						this.fontFamily[2].img = '/static/editor/U-active.png';
						e.target.dataset.name = 'underline';
						e.target.dataset.value = '';
					} else {
						this.fontFamily[2].img = '/static/editor/U.png';
					};
					this.format(e);
				}
				
				if (index == 3) {
					if (this.fontFamily[3].isSelect) {
						this.fontFamily[3].img = '/static/editor/S-active.png';
						e.target.dataset.name = 'strike';
						e.target.dataset.value = '';
					} else {
						this.fontFamily[3].img = '/static/editor/S.png';
					};
					this.format(e);
				}
			},
			/* 选择对齐方式 */
			selectAlignMent(index){
				this.alignWay.forEach((r,i)=>{
					if (r.isSelect) {
						if (i == index) {
							r.isSelect = false;
							return;
						}
					}
				})
				
				this.alignWay.forEach((r,i)=>r.isSelect=i==index);
				let e = {target:{dataset:{name:'',value:''}}};
				
				
				if (this.alignWay[0].isSelect) {
					this.alignWay[0].img = '/static/editor/align/left-action.png';
					e.target.dataset.name = 'align';
					e.target.dataset.value = 'left';
				} else {
					this.alignWay[0].img = '/static/editor/align/left.png';
				};
				
				if (this.alignWay[1].isSelect) {
					this.alignWay[1].img = '/static/editor/align/center-action.png';
					e.target.dataset.name = 'align';
					e.target.dataset.value = 'center';
				} else {
					this.alignWay[1].img = '/static/editor/align/center.png';
				};
			
				if (this.alignWay[2].isSelect) {
					this.alignWay[2].img = '/static/editor/align/right-action.png';
					e.target.dataset.name = 'align';
					e.target.dataset.value = 'right';
				} else {
					this.alignWay[2].img = '/static/editor/align/right.png';
				};
				
				this.format(e);
			},
			/* 选择排序样式 */
			selectSortStyle(index){
				this.sortStyle.forEach((r,i)=>{
					if (r.isSelect) {
						if (i == index) {
							r.isSelect = false;
							return;
						}
					}
				})
				
				this.sortStyle.forEach((r,i)=>r.isSelect=i==index);
				let e = {target:{dataset:{name:'',value:''}}};
				
				if (this.sortStyle[0].isSelect) {
					this.sortStyle[0].img = '/static/editor/align/number-action.png';
					e.target.dataset.name = 'list';
					e.target.dataset.value = 'ordered';
				} else {
					this.sortStyle[0].img = '/static/editor/align/number.png';
				};
			
				if (this.sortStyle[1].isSelect) {
					this.sortStyle[1].img = '/static/editor/align/point-action.png';
					e.target.dataset.name = 'list';
					e.target.dataset.value = 'bullet';
				} else {
					this.sortStyle[1].img = '/static/editor/align/point.png';
				};
				this.format(e);
			},
			/* 缩进 */
			selectIndent(index){
				let e = {target:{dataset:{name:'',value:''}}};
				e.target.dataset.name = 'indent';
				
				if (index == 0) {
					e.target.dataset.value = '+1';
				};
				
				if (index == 1) {
					e.target.dataset.value = '-1';
				};
				this.format(e);
			},
			/* 功能 */
			selectFunction(index,value){
				if (index == 0) {
					uni.chooseImage({
						count:1,
						success: (res) => {
							this.editorCtx.insertImage({
								src: res.tempFilePaths[0],
								alt:'该图无法显示',
								data: {
									id: 'abcd',
									role: 'god'
								},
								width: '80%',
								height: '80%'
							})
						}
					})
				};
				
				if (index > 0) {
					this.editorCtx.insertText({
						text: `#${value}#`,
					})
				};
			},
			
			saveValidation(){
				let content = '';
				let htmlContent = '';
				this.editorCtx.getContents({
					success: (res) => {
						content = res.text;
						htmlContent = res.html;
						this.$emit('saveContent',{content, htmlContent});
					}
				});
			}
		},
		mounted() {
			
			// #ifdef MP-WEIXIN
			this.isWechat = true;
			// #endif
			
			/* 获取当前屏幕高度  状态栏高度 */
			uni.getSystemInfo({
				success: (res) => {
					this.currentPlatform = res.platform;
					this.windowHeight = res.windowHeight;
					this.statusBarHeight = res.statusBarHeight;
				}
			});
			
			/* 监听键盘高度 */
			uni.onKeyboardHeightChange(res => {
				this.switchKeyword = res.height;
				
				if (this.currentPlatform == 'android') {
					this.keyWordMenuHeight = '0';
					
					if (!this.$refs.cPopup.isPopup && this.switchKeyword == 0) {
						this.keyWordMenuHeight = '0';
					}
				}
				if (this.currentPlatform == 'ios') {
					this.keyWordMenuHeight = this.switchKeyword + 'px';
				}
				
			});
			
		}
	}
</script>

<style scoped>
	.keywordOrFunction-box{
		position: fixed; 
		height: 100rpx;
		z-index: 10000;
	}
	
	.hr{
		width:750rpx;
		height:20rpx;
		background:rgba(245,245,250,1);
	}
	.hr-710{
		width: 710rpx;
		height: 1px;
		background:rgba(245,245,250,1);
	}
	.popupContent{
		width: 750rpx;
		height: 750rpx;
		background-color: #FFFFFF;
	}
	.titleMenu{
		height: 90rpx;
	}
	.fontSyle{
		height: 250rpx;
	}
	.fontSize{
		width: 180rpx;
		height: 180rpx;
		border:1rpx solid rgba(204,204,204,1);
		border-radius:6rpx;
	}
	.fontFamily{
		width: 470rpx;
		height: 80rpx;
		border:1rpx solid rgba(204,204,204,1);
		border-radius:6rpx;
	}
	.divider{
		width:1rpx;
		height:20rpx;
		background:rgba(204,204,204,1);
	}
	.fontFamily-right,
	.fontFamily-left{
		height:80rpx;
		background:rgba(255,255,255,1);
		border:1rpx solid rgba(204,204,204,1);
		border-radius:6rpx;
	}
	.fontFamily-left{
		width:570rpx;
	}
	.fontFamily-right{
		width:80rpx;
	}
	
	.fontColor-box{
		width:670rpx;
		height:80rpx;
		background:rgba(255,255,255,1);
		border:1rpx solid rgba(204,204,204,1);
		border-radius:6rpx;
	}
	.fColor{
		width:50rpx;
		height:50rpx;
		border-radius:50%;
	}
	
	.bgColor{
		width:50rpx;
		height:50rpx;
	}
	.align-box-right,
	.align-box-left{
		height:80rpx;
		background:rgba(255,255,255,1);
		border:1rpx solid rgba(204,204,204,1);
		border-radius:6rpx;
	}
	.align-box-left{
		width:436rpx;
	}
	.align-box-right{
		width:210rpx;
	}
	
	.mask{
		background-color: rgba(0,0,0,0.2);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
	}
	
	.float-btn-box{
		width: 70rpx;
		height: 70rpx;
		background-image: linear-gradient(to top, #59C65D , #65E16A );
		position: fixed;
		right: 30rpx;
		top: 310rpx;
	}
</style>
