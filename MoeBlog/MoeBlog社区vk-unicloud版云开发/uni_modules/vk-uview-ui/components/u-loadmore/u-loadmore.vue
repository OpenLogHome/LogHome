<template>
	<view class="u-load-more-wrap" :style="{
		backgroundColor: bgColor,
		marginBottom: marginBottom + 'rpx',
		marginTop: marginTop + 'rpx',
		height: $u.addUnit(height)
	}">
		<u-line color="#d4d4d4" length="50"></u-line>
		<!-- 努力加载中和没有更多的状态才显示两边的横线 -->
		<view :class="status == 'loadmore' || status == 'nomore' ? 'u-more' : ''" class="u-load-more-inner">
			<view class="u-loadmore-icon-wrap">
				<u-loading class="u-loadmore-icon" :color="iconColor" :mode="iconType == 'circle' ? 'circle' : 'flower'" :show="status == 'loading' && icon"></u-loading>
			</view>
			<!-- 如果没有更多的状态下，显示内容为dot（粗点），加载特定样式 -->
			<view class="u-line-1" :style="[loadTextStyle]" :class="[(status == 'nomore' && isDot == true) ? 'u-dot-text' : 'u-more-text']" @tap="loadMore">
				{{ showText }}
			</view>
		</view>
		<u-line color="#d4d4d4" length="50"></u-line>
	</view>
</template>

<script>
	/**
	 * loadmore 加载更多
	 * @description 此组件一般用于标识页面底部加载数据时的状态。
	 * @tutorial https://www.uviewui.com/components/loadMore.html
	 * @property {String} status 组件状态（默认loadmore）
	 * @property {String} bg-color 组件背景颜色，在页面是非白色时会用到（默认#ffffff）
	 * @property {Boolean} icon 努力加载中时是否显示图标（默认true）
	 * @property {String} icon-type 努力加载中时的图标类型（默认circle）
	 * @property {String} icon-color icon-type为circle时有效，努力加载中的动画图标的颜色（默认#b7b7b7）
	 * @property {Boolean} is-dot status为nomore时，内容显示为一个"●"（默认false）
	 * @property {String} color 字体颜色（默认#606266）
	 * @property {String Number} margin-top 到上一个相邻元素的距离
	 * @property {String Number} margin-bottom 到下一个相邻元素的距离
	 * @property {Object} load-text 自定义显示的文字，见上方说明示例
	 * @event {Function} loadmore status为loadmore时，点击组件会发出此事件
	 * @example <u-loadmore :status="status" icon-type="iconType" load-text="loadText" />
	 */
	export default {
		name: "u-loadmore",
    emits: ["loadmore"],
		props: {
			// 组件背景色
			bgColor: {
				type: String,
				default: 'transparent'
			},
			// 是否显示努力加载中的图标
			icon: {
				type: Boolean,
				default: true
			},
			// 字体大小
			fontSize: {
				type: String,
				default: '28'
			},
			// 字体颜色
			color: {
				type: String, 
				default: '#606266'
			},
			// 组件状态，loadmore-加载前的状态，loading-努力加载中的状态，nomore-没有更多的状态
			status: {
				type: String,
				default: 'loadmore'
			},
			// 努力加载中状态的图标，flower-花朵状图标，circle-圆圈状图标
			iconType: {
				type: String,
				default: 'circle'
			},
			// 显示的文字
			loadText: {
				type: Object,
				default () {
					return {
						loadmore: '加载更多',
						loading: '正在加载...',
						nomore: '没有更多了'
					}
				}
			},
			// 在“没有更多”状态下，是否显示粗点
			isDot: {
				type: Boolean,
				default: false
			},
			// 努力加载中显示圆圈动画时，动画的颜色
			iconColor: {
				type: String,
				default: '#b7b7b7'
			},
			// 上边距
			marginTop: {
				type: [String, Number],
				default: 0
			},
			// 下边距
			marginBottom: {
				type: [String, Number],
				default: 0
			},
			// 高度，单位rpx
			height: {
				type: [String, Number],
				default: 'auto'
			}
		},
		data() {
			return {
				// 粗点
				dotText: "●"
			}
		},
		computed: {
			// 加载的文字显示的样式
			loadTextStyle() {
				return {
					color: this.color,
					fontSize: this.fontSize + 'rpx',
					position: 'relative',
					zIndex: 1,
					backgroundColor: this.bgColor,
					// 如果是努力加载中状态，动画和文字需要距离近一点
				}
			},
			// 努力加载中圆圈动画的样式
			cricleStyle() {
				return {
					borderColor: `#e5e5e5 #e5e5e5 #e5e5e5 ${this.circleColor}`
				}
			},
			// 努力加载中花朵动画形式
			// 动画由base64图片生成，暂不支持修改
			flowerStyle() {
				return {
				}
			},
			// 显示的提示文字
			showText() {
				let text = '';
				if(this.status == 'loadmore') text = this.loadText.loadmore;
				else if(this.status == 'loading') text = this.loadText.loading;
				else if(this.status == 'nomore' && this.isDot) text = this.dotText;
				else text = this.loadText.nomore;
				return text;
			}
		},
		methods: {
			loadMore() {
				// 只有在“加载更多”的状态下才发送点击事件，内容不满一屏时无法触发底部上拉事件，所以需要点击来触发
				if(this.status == 'loadmore') this.$emit('loadmore');
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../libs/css/style.components.scss";
	
	/* #ifdef MP */
	// 在mp.scss中，赋予了u-line为flex: 1，这里需要一个明确的长度，所以重置掉它
	// 在组件内部，把组件名(u-line)当做选择器，在微信开发工具会提示不合法，但不影响使用
	u-line {
		flex: none;
	}
	/* #endif */
	
	.u-load-more-wrap {
		@include vue-flex;
		justify-content: center;
		align-items: center;
	}
	
	.u-load-more-inner {
		@include vue-flex;
		justify-content: center;
		align-items: center;
		padding: 0 12rpx;
	}
	
	.u-more {
		position: relative;
		@include vue-flex;
		justify-content: center;
	}
	
	.u-dot-text {
		font-size: 28rpx;
	}
	
	.u-loadmore-icon-wrap {
		margin-right: 8rpx;
	}
	
	.u-loadmore-icon {
		@include vue-flex;
		align-items: center;
		justify-content: center;
	}
</style>
