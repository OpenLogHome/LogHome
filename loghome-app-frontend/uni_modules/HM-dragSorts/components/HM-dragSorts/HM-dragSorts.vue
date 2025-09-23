<template>
	<view class="HM-drag-sort" :style="{'height': ListHeight+'px'}">
		<view class="rowBox-shadow" :style="{'height': rowHeight+'px'}" id="shadowRowBox">
			<view class="row" id="shadowRow">
				<view class="modules">
					<!-- 内容  -->
					<slot name="rowContent" :row="shadowRow"></slot>
					<!-- 拖拽图标 -->
					<view class="drag" :style="{'height': rowHeight+'px'}"><text class="iconfont icon-drag"></text>
					</view>
				</view>
			</view>
		</view>
		<scroll-view :id="'scrollView_'+guid" :scroll-y="true" :style="{'height': ListHeight+'px'}"
			:scroll-top="scrollViewTop" @scroll="drag.scroll" :scroll-with-animation="false">
			<!-- 两个list列表 拖拽完直接切换list 避免闪烁 -->
			<block v-for="(tmplist,listType) in dragList" :key="listType">
				<view class="list color" :class="[listType=='A'?(listSwitch?'show':'hide'):(listSwitch?'hide':'show')]">
					<block v-for="(row,index) in tmplist" :key="row.id">
						<view class="rowBox" :style="{'height': rowHeight+'px'}">
							<view :class="'row row'+listType" :style="{'height': rowHeight+'px'}" :data-id="row.id"
								:id="'row'+listType+row.id">
								<view class="modules" @tap="triggerClick(index,row)">
									<!-- 内容  -->
									<slot name="rowContent" :row="row"></slot>
									<!-- 拖拽图标 -->
										<view class="drag" :style="{'height': rowHeight+'px'}" :data-id="row.id"
											:data-type="listType" @touchstart="drag.touchstart" @touchmove="drag.touchmove"
											@touchend="drag.touchend" 
											<!-- #ifdef MP-WEIXIN -->
											@longpress="drag.longpress"
											<!-- #endif -->
											<!-- #ifdef H5 -->
											@mousedown="pcDragStart($event, row, listType, index)"
											<!-- #endif -->
											>
											<text class="iconfont icon-drag"></text>
										</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</block>
		</scroll-view>
		<view :data-isapph5="isAppH5" :data-guid="guid" :data-islongtouch="isLongTouch" :data-isautoscroll="isAutoScroll"
			:data-feedbackgeneratorstate="feedbackGeneratorState" :data-longtouchtime="longTouchTime"
			:data-listheight="ListHeight" :data-rownum="list.length" id="dataView" style="display: none !important;">
			存放数据给wxs读取</view>
		<view style="display: none !important;" :prop="scrollCommand" :change:prop="renderjs.runCommand">
			触发renderjs跳板，请勿删除</view>
	</view>
</template>
<script src="./drag.wxs" module="drag" lang="wxs"></script>
<script module="renderjs" lang="renderjs">
	// APP or H5端renderjs
	export default {
		data() {
			return {
				e: null,
				ScrollView: null,
				scrollTimer: null
			}
		},
		methods: {
			runCommand(e, oldValue, ownerInstance, instance) {
				this.e = e;
				this.getScrollView(document.getElementById('scrollView_' + this.e.guid))
				window.cancelAnimationFrame(this.AnimationFrameID);
				this.AnimationFrameID = window.requestAnimationFrame(this.Animation);
				if (e.command == "stop") {
					window.cancelAnimationFrame(this.AnimationFrameID);
					return;
				}
			},
			Animation() {
				if (this.e.command == "stop") {
					window.cancelAnimationFrame(this.AnimationFrameID);
					return;
				}
				let maxScrollTop = this.e.rowLength * this.e.rowHeight - this.e.ListHeight;
				if (this.e.command == "up") {
					this.ScrollView.scrollTop -= 3
				} else if (this.e.command == "down") {
					this.ScrollView.scrollTop += 3;
				}
				if (this.ScrollView.scrollTop < 0) {
					this.ScrollView.scrollTop = 0;
					window.cancelAnimationFrame(this.AnimationFrameID);
				}
				if (this.ScrollView.scrollTop > maxScrollTop) {
					this.ScrollView.scrollTop = maxScrollTop;
					window.cancelAnimationFrame(this.AnimationFrameID);
				}
				this.AnimationFrameID = window.requestAnimationFrame(this.Animation);
			},
			getScrollView(DOM) {

				if (this.ScrollView != null) {
					return this.ScrollView;
				}
				var styleStr = DOM.getAttribute('style');

				if (DOM.className == 'uni-scroll-view' && styleStr != null && styleStr.indexOf('overflow') > -1 && styleStr
					.indexOf(
						'auto') > -1) {
					this.ScrollView = DOM;
					return DOM;
				} else {
					this.getScrollView(DOM.firstChild);
				}
			}
		}
	}
</script>
<script>
	/**  
	 * 拖拽排序组件 HM-dragSort
	 * @description 拖拽排序组件 HM-dragSort
	 * @property {ObjectArray} list = [] 列表数据,自定义数据，会传递到name="rowContent"插槽  
	 * @property {Boolean} feedbackGeneratorState = [true|false] 是否拖动触感反馈  
	 * @property {Boolean} isLongTouch = [true|false] 是否长按拖动  
	 * @property {Boolean} isAutoScroll = [true|false] 是否拖拽至边缘自动滚动列表  
	 * @property {Number} longTouchTime = [] 选填,触发长按时长,单位:ms,默认350ms,不支持微信小程序 
	 * @property {Number} listHeight = [] 选填,可拖动列表整体的高度,单位:px,默认等于窗口高度 
	 * @property {Number} rowHeight = [] 必填,行高,单位:px,默认44px
	 * @event {Function} change 行位置发生改变时触发事件 返回值:{index:'原始下标',moveTo:'被拖动到的下标',moveRow:'拖动行数据'}   
	 * @event {Function} confirm 拖拽结束且行位置发生了改变触发事件 返回值:{index:'原始下标',moveTo:'被拖动到的下标',moveRow:'拖动行数据',list:'整个列表拖动后的数据'}  
	 * @event {Function} onclick 点击行触发事件 返回值:{index:'被点击行下标',value:'被点击行数据'} 
	 */
	export default {
		name: 'HM-dragSort',
		data() {
			return {
				guid: '',
				// #ifdef APP-PLUS || H5
				isAppH5: true,
				// #endif
				// #ifdef MP-WEIXIN
				isAppH5: false,
				// #endif

				shadowRow: {}, // 存放被拖拽行数据
				// 列表数据 分A和B两个列表 互相切换 避免闪烁
				dragList: {
					"A": [],
					"B": []
				},
				ListHeight: this.listHeight,
				listSwitch: true, // 控制切换列表
				//
				// 控制滑动
				scrollViewTop: 0, // 滚动条位置
				scrollCommand: 1, //传递renderjs数据
				isHoldTouch: false, //是否正在拖拽
				isScrolling: false, //是否正在滚动视图
				scrollTimer: null, //定时器-控制滚动 微信小程序端使用 实现类似requestAnimationFrame效果
				
				// PC端拖拽状态
				isDragging: false, // 是否正在拖拽
				dragStartY: 0, // 拖拽开始的Y坐标
				dragCurrentRow: null, // 当前拖拽的行数据
				dragCurrentIndex: null, // 当前拖拽行的索引
				dragCurrentListType: null, // 当前拖拽行的列表类型
				dragCurrentOffset: null, // 当前拖拽的目标位置
				dragStartScrollTop: 0 // 拖拽开始时的滚动位置
			}
		},
		props: {
			//是否开启拖动震动反馈
			feedbackGeneratorState: {
				value: Boolean,
				default: true
			},
			// 是否开启长按拖动
			isLongTouch: {
				value: Boolean,
				default: false
			},
			isAutoScroll: {
				value: Boolean,
				default: true
			},
			longTouchTime: {
				value: Number,
				default: 300
			},
			// 列表数据
			list: {
				value: Array,
				default: []
			},
			// 行高度 默认44行高
			rowHeight: {
				value: Number,
				default: 44
			},
			// 组件高度 默认windowHeight满屏
			listHeight: {
				value: Number,
				default: 0
			}
		},
		watch: {
			list: {
				handler(val) {
					this.initList(val); //数据变化重新初始化list
				},
				immediate: true,
				deep: true
			},
			listHeight: {
				handler(val) {
					this.ListHeight = val;
				},
				immediate: true
			}
		},

		mounted() {
			if (this.listHeight == 0) {
				this.ListHeight = uni.getSystemInfoSync().windowHeight;
			}
			this.guid = this.getGuid();
		},
		methods: {
			getGuid() {
				function S4() {
					return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
				}
				return (S4() + S4() + "_" + S4() + "_" + S4() + "_" + S4() + "_" + S4() + S4() + S4());
			},
			loadShadowRow(e) {
				this.shadowRow = JSON.parse(JSON.stringify(this.dragList[this.listSwitch ? "A" : "B"][e.rowIndex]));
			},
			initList() {
				let tmpList = JSON.parse(JSON.stringify(this.list));
				for (let i = 0, len = tmpList.length; i < len; i++) {
					// 如果列表没有id，则组件内赋予临时id 有id会提升一些渲染
					if (!tmpList[i].hasOwnProperty('id')) {
						tmpList[i].id = 'HMDragId_' + this.getGuid();
					} 
				}
				if (this.dragList.A.length > 0) {
					setTimeout(() => {
						this.dragList.A.splice(0,this.dragList.A.length,...tmpList);
						this.dragList.B.splice(0,this.dragList.B.length,...tmpList);
					}, 50)
				} else {
					this.dragList.A = JSON.parse(JSON.stringify(tmpList));
					this.dragList.B = JSON.parse(JSON.stringify(tmpList));
				}
			},
			triggerClick(index, row) {
				var tmpRow = JSON.parse(JSON.stringify(row));
				// 清除临时赋予的ID
				if (typeof(tmpRow.id) == "string" && tmpRow.id.indexOf('HMDragId_') > -1) {
					delete tmpRow.id;
				}
				this.$emit('onclick', {
					index: index,
					value: JSON.parse(JSON.stringify(tmpRow))
				});
			},
			//兼容微信小程序震动
			vibrate() {
				uni.vibrateShort()
			},
			// 控制自动滚动视图
			pageScroll(e) {
				// 滚动 up-上滚动 down-下滚动
				if (e.command == "up" || e.command == "down") {
					if (!this.isHoldTouch) {
						this.isHoldTouch = true;
						this.scrollViewTop = e.scrollTop;
					}
					if (this.isScrolling) {
						return;
					};
					this.isScrolling = true;

					// APP端和H5端 执行renderjs的滚动
					// #ifdef APP-PLUS || H5
					e.ListHeight = this.ListHeight;
					e.rowHeight = this.rowHeight;
					e.rowLength = this.list.length;
					this.scrollCommand = e;
					return;
					// #endif

					// 微信小程序执行以下逻辑
					this.scrollTimer != null && clearInterval(this.scrollTimer);
					let maxheight = this.rowHeight * this.list.length + 1 - this.ListHeight;
					// 16.6ms执行一次，尽可能接近60HZ，但逻辑层传递到视图层会有时间损耗，可能会出现滚动不流畅现象
					this.scrollTimer = setInterval(() => {
						if (e.command == "up") {
							this.scrollViewTop -= 3
						}
						if (e.command == "down") {
							this.scrollViewTop += 3;
						}
						if (this.scrollViewTop < 0) {
							this.scrollViewTop = 0;
							clearInterval(this.scrollTimer);
						}
						if (this.scrollViewTop > maxheight) {
							this.scrollViewTop = maxheight;
							clearInterval(this.scrollTimer);
						}
					}, 16.6)
				}
				// 停止滚动
				if (e.command == "stop") {
					// #ifdef APP-PLUS || H5
					// 停止指定传递到renderjs
					this.scrollCommand = e;
					// #endif
					this.isScrolling && this.stopScroll();
				}
			},
			//停止滚动
			stopScroll() {
				this.scrollTimer != null && clearInterval(this.scrollTimer);
				this.isScrolling = false;
				this.scrollingtop = 0;
			},
			// 
			change(e) {
				e.moveRow = JSON.parse(JSON.stringify(this.dragList[this.listSwitch ? "A" : "B"][e.index]));
				// 清除组件临时赋予的id
				if (typeof(e.moveRow.id) == "string" && e.moveRow.id.indexOf('HMDragId_') > -1) {
					delete e.moveRow.id;
				}
				this.$emit('change', e);
			},
			sort(e) {
				this.stopScroll();
				this.isHoldTouch = false;
				let tmpList = JSON.parse(JSON.stringify(this.dragList.A));
				tmpList.splice(e.offset, 0, tmpList.splice(e.index, 1)[0]);
				let moveRow = JSON.parse(JSON.stringify(this.dragList.A[e.index]));
				let listType = "A"
				if (this.listSwitch) {
					this.dragList.B = [];
					this.dragList.B = tmpList;

				} else {
					this.dragList.A = [];
					this.dragList.A = tmpList;
					listType = "B";
				}
				setTimeout(() => {
					this.resetList(listType, tmpList)
				}, 50)
				// 检测清除临时赋予的ID
				if (typeof(moveRow.id) == "string" && moveRow.id.indexOf('HMDragId_') > -1) {
					delete moveRow.id;
				}
				let list = JSON.parse(JSON.stringify(tmpList));
				for (let i = 0, len = list.length; i < len; i++) {
					if (typeof(list[i].id) == "string" && list[i].id.indexOf('HMDragId_') > -1) {
						delete list[i].id;
					}
				}
				// 触发组件confirm 并传递数据
				this.$emit('confirm', {
					list: list,
					index: e.index,
					moveTo: e.offset,
					moveRow: moveRow
				});
			},
			resetList(listType, tmpList) {
				this.listSwitch = !this.listSwitch;
				this.$nextTick(() => {
					this.dragList[listType] = [];
					this.dragList[listType] = tmpList;
				})
				this.shadowRow = {};
			},
			// PC端拖拽相关方法
			pcDragStart(event, row, listType, index) {
				// #ifdef H5
				if (!this.isAppH5) return;
				
				event.preventDefault();
				this.isDragging = true;
				this.dragStartY = event.clientY;
				this.dragCurrentRow = row;
				this.dragCurrentIndex = index;
				this.dragCurrentListType = listType;
				this.dragStartScrollTop = this.scrollViewTop;
				
				// 显示拖拽阴影
				this.shadowRow = JSON.parse(JSON.stringify(row));
				this.$nextTick(() => {
					const shadowBox = document.getElementById('shadowRowBox');
					if (shadowBox) {
						shadowBox.classList.add('show');
						shadowBox.style.top = (index * this.rowHeight - this.scrollViewTop) + 'px';
					}
					
					// 隐藏原始行
					const originalRow = document.getElementById('row' + listType + row.id);
					if (originalRow) {
						originalRow.classList.add('hide');
					}
					
					// 显示拖拽状态
					const shadowRow = document.getElementById('shadowRow');
					if (shadowRow) {
						shadowRow.classList.add('move');
					}
				});
				
				// 添加全局事件监听
				document.addEventListener('mousemove', this.pcDragMove);
				document.addEventListener('mouseup', this.pcDragEnd);
				// #endif
			},
			pcDragMove(event) {
				// #ifdef H5
				if (!this.isDragging) return;
				
				event.preventDefault();
				const moveY = event.clientY - this.dragStartY;
				
				// 更新拖拽阴影位置
				const shadowRow = document.getElementById('shadowRow');
				if (shadowRow) {
					shadowRow.style.transform = `translate3d(0, ${moveY}px, 10px)`;
					shadowRow.style.webkitTransform = `translate3d(0, ${moveY}px, 10px)`;
				}
				
				// 计算新位置
				const moveOffset = moveY + this.scrollViewTop - this.dragStartScrollTop;
				const newIndex = this.calcPCOffset(this.dragCurrentIndex, moveOffset);
				
				if (newIndex >= 0 && newIndex < this.list.length && newIndex !== this.dragCurrentOffset) {
					this.dragCurrentOffset = newIndex;
					this.updatePCRowPositions();
					
					// 触发change事件
					this.$emit('change', {
						index: this.dragCurrentIndex,
						moveTo: newIndex
					});
				}
				
				// 自动滚动处理
				this.handlePCAutoScroll(event.clientY);
				// #endif
			},
			pcDragEnd(event) {
				// #ifdef H5
				if (!this.isDragging) return;
				
				this.isDragging = false;
				
				// 移除全局事件监听
				document.removeEventListener('mousemove', this.pcDragMove);
				document.removeEventListener('mouseup', this.pcDragEnd);
				
				// 隐藏拖拽阴影
				const shadowBox = document.getElementById('shadowRowBox');
				if (shadowBox) {
					shadowBox.classList.remove('show');
				}
				
				const shadowRow = document.getElementById('shadowRow');
				if (shadowRow) {
					shadowRow.classList.remove('move');
					shadowRow.style.transform = 'none';
					shadowRow.style.webkitTransform = 'none';
				}
				
				// 显示原始行
				const originalRow = document.getElementById('row' + this.dragCurrentListType + this.dragCurrentRow.id);
				if (originalRow) {
					originalRow.classList.remove('hide');
				}
				
				// 如果位置发生变化，触发排序
				if (typeof this.dragCurrentOffset !== 'undefined' && 
					this.dragCurrentIndex !== this.dragCurrentOffset && 
					this.dragCurrentOffset !== null) {
					this.sort({
						index: this.dragCurrentIndex,
						offset: this.dragCurrentOffset
					});
				} else {
					// 重置行样式
					this.resetPCRowStyles();
				}
				
				// 清理状态
				this.dragCurrentOffset = null;
				this.dragCurrentRow = null;
				this.dragCurrentIndex = null;
				this.dragCurrentListType = null;
				// #endif
			},
			calcPCOffset(initIndex, moveY) {
				// #ifdef H5
				let offset = initIndex + parseInt(moveY / this.rowHeight);
				const rest = moveY % this.rowHeight;
				
				if (rest > 0) {
					offset = offset + (rest / this.rowHeight >= 0.6 ? 1 : 0);
				} else {
					offset = offset + (rest / this.rowHeight <= -0.6 ? -1 : 0);
				}
				
				return Math.max(0, Math.min(offset, this.list.length - 1));
				// #endif
			},
			updatePCRowPositions() {
				// #ifdef H5
				const listType = this.dragCurrentListType;
				const initIndex = this.dragCurrentIndex;
				const offset = this.dragCurrentOffset;
				
				const rows = document.querySelectorAll('.row' + listType);
				rows.forEach((row, i) => {
					if (i === initIndex) return;
					
					let translateY = 0;
					if ((i >= offset && i < initIndex) || (i <= offset && i > initIndex)) {
						translateY = i < initIndex ? this.rowHeight : -this.rowHeight;
					}
					
					row.style.transform = `translate3d(0, ${translateY}px, 5px)`;
					row.style.webkitTransform = `translate3d(0, ${translateY}px, 5px)`;
					row.classList.add('ani');
				});
				// #endif
			},
			resetPCRowStyles() {
				// #ifdef H5
				const listType = this.dragCurrentListType;
				const rows = document.querySelectorAll('.row' + listType);
				rows.forEach(row => {
					row.style.transform = 'none';
					row.style.webkitTransform = 'none';
					row.classList.remove('ani');
					row.classList.remove('hide');
				});
				// #endif
			},
			handlePCAutoScroll(clientY) {
				// #ifdef H5
				if (!this.isAutoScroll) return;
				
				const containerRect = document.getElementById('scrollView_' + this.guid)?.getBoundingClientRect();
				if (!containerRect) return;
				
				const threshold = this.rowHeight * 1.5;
				const relativeY = clientY - containerRect.top;
				
				if (relativeY < threshold) {
					// 向上滚动
					this.pageScroll({ command: 'up', scrollTop: this.scrollViewTop });
				} else if (relativeY > containerRect.height - threshold) {
					// 向下滚动
					this.pageScroll({ command: 'down', scrollTop: this.scrollViewTop });
				} else {
					// 停止滚动
					this.pageScroll({ command: 'stop' });
				}
				// #endif
			}
		}
	}
</script>

<style lang="scss">
	//默认
	$text-color : #843d13;
	$border-color :#c8c7cb;
	$background-color :rgb(255, 255, 255);
	$background-color-moveing :rgba(255, 255, 255, 0.8);
	$shadow-background-color-moveing :rgba(0, 0, 0, 0.5);
	$icon-drag-color:#c7c7cb;
	//Dark模式
	$Dark-text-color : #ffffff;
	$Dark-border-color :#3d3d40;
	$Dark-background-color :rgba(28, 28, 29, 1);
	$Dark-background-color-moveing :rgba(28, 28, 29, 0.8);
	$Dark-shadow-background-color-moveing :rgba(0, 0, 0, 0.5);
	$Dark-icon-drag-color:#5a5a5e;

	// 定义颜色 start
	//默认颜色
	.color,
	.rowBox-shadow {
		&.list {
			border-bottom: 1rpx $border-color solid;
			border-top: 1rpx $border-color solid;
		}

		.row {
			background-color: $background-color;

			&.move {
				background-color: $background-color-moveing;
				box-shadow: 0 1px 5px $shadow-background-color-moveing;
			}

			.modules {
				border-bottom: 1rpx $border-color solid;

				.content {
					color: $text-color;
				}

				.iconfont {
					color: $icon-drag-color;
				}
			}
		}

	}

	// 定义颜色 end 


	.HM-drag-sort {
		// touch-action: none;
		display: flex;
		flex-direction: column;
		position: relative;
		
		// PC端拖拽样式优化
		/* #ifdef H5 */
		user-select: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		/* #endif */
		
		//拖动时的动态盒子的CSS效果
		.rowBox-shadow {
			width: 100%;
			position: absolute;
			z-index: 100;
			display: none;
			transform: translateX(10px);

			&.show {
				display: flex !important;
			}

			.row {
				display: flex;
				flex-direction: row;
				width: calc(100% - 30rpx);
				padding-left:30rpx;

				&.move {
					.modules {
						border-bottom-width: 0;
					}
				}

				.modules {
					margin-left: 12px;
					padding-right: 12px;
					width: 100%;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;

					.drag {
								width: 22px;
								flex-shrink: 0;
								display: flex;
								flex-direction: row;
								justify-content: center;
								align-items: center;
								
								/* #ifdef H5 */
								cursor: grab;
								&:active {
									cursor: grabbing;
								}
								/* #endif */

								.iconfont {
									font-size: 20px;
								}
							}
				}

			}
		}
		
		//静态的列表的拖动效果
		.list {
			display: flex;
			flex-direction: column;
			transform: translateX(10px);

			&.show {
				// display: flex;
			}

			&.hide {
				// display: none;
				width: 0;
				height: 0;
				overflow: hidden;
				visibility: hidden;
				border-width: 0;
			}

			.rowBox {
				width: 100%;

				&:last-child {
					.row {
						.modules {
							border-bottom-width: 0;
						}
					}
				}

				.row {
					display: flex;
					flex-direction: row;
					width: calc(100% - 30rpx);
					padding-left:30rpx;

					&.hide {
						display: none !important;
					}

					&.ani {
						transition: all 0.2s;
						-webkit-transition: all 0.2s;
					}

					.modules {
						margin-left: 12px;
						padding-right: 12px;
						width: 100%;
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: space-between;
						font-size: 35rpx;

						.drag {
							width: 22px;
							flex-shrink: 0;
							display: flex;
							flex-direction: row;
							justify-content: center;
							align-items: center;
							
							/* #ifdef H5 */
							cursor: grab;
							&:active {
								cursor: grabbing;
							}
							/* #endif */

							.iconfont {
								font-size: 20px;
							}
						}
					}

				}
			}

		}

	}

	@font-face {
		font-family: "HM-DS-font";
		src: url('data:font/truetype;charset=utf-8;base64,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') format('truetype');
	}

	.iconfont {
		font-family: "HM-DS-font" !important;
		font-style: normal;

		&.icon-drag {
			&:before {
				content: "\e6e4";
			}
		}

	}
</style>
