<template>
	<view>
		<view class="scrollView" scroll-x show-scrollbar="false" :scroll-left="scrollLeft" scroll-with-animation :style="{ 'width': scrollWidth}">
			<view class="tabBox" :style="{ 'justify-content': isOutWindow ? 'space-around' : 'space-around' }">
				<view class="items" v-for="(item, index) in tabValue" :key="index" @click="clickTab(index)">
					<view class="tab-item-wrapper">
						<text class="tabText" :class="[index == tIndex ? 'active' : '', isAnimating ? 'animating' : '']" v-dark
						:style="{ 'font-size': fontSize + ((index == tIndex)?5:0) + 'rpx', color: index == tIndex ? textColor : ''}">
							{{item}}
						</text>
						<view v-if="showBadge && badgeIndexes.includes(index)" class="tab-badge"></view>
					</view>
				</view>
			</view>
			<view class="underscore" v-dark :class="{'animating': isAnimating}"
				:style="{ width: inderWidth + 'px', 'margin-left': indexLeft + boxLeft + 'px', height: '25rpx' }" />
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			tabValue: { // tab数据
				type: Array,
				default: [],
				required: true
			},
			textColor: { // 颜色
				type: String,
				default: '#34b2fa'
			},
			fontSize: { // 字体大小
				type: Number,
				default: 30
			},
			firstTab:{
				default: 0
			},
			showBadge: { // 是否显示小红点
				type: Boolean,
				default: false
			},
			badgeIndexes: { // 需要显示小红点的tab索引数组
				type: Array,
				default: () => []
			},
			scrollWidth: {
				type: String,
				default: '100vw'
			},
			underBarBias: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				windowsWidth: 0,
				boxLeft: 0,
				isOutWindow: false,
				inderWidth: 0,
				indexLeft: 0,
				scrollLeft: 0,
				tIndex: 0,
				isAnimating: false // 是否正在执行过渡动画
			};
		},
		methods: {
			clickTab(index) {
				// 如果正在动画中或点击了当前活跃的tab，则不处理
				// if (this.isAnimating || this.tIndex === index) {
				// 	return;
				// }
                
                // 设置动画状态
                this.isAnimating = true;
                
				// 更改选中下标
				this.tIndex = index
				this.$emit("getIndex", index)
				
				// 获取盒子移动距离
				if (this.isOutWindow && index >= 0) {
					uni.createSelectorQuery().in(this).select(".tabBox").boundingClientRect().exec((data) => {
						if (index == 0) {
							this.boxLeft = 0
						} else {
							// 移动距离
							this.boxLeft = -data[0].left
						}
					})
				}
				
				// 设置下划线动画
				uni.createSelectorQuery().in(this).selectAll(".items").boundingClientRect().exec((data) => {
					let width = data[0][index].width
					let left = data[0][index].left
					
					// 点击tab宽度
					this.inderWidth = width;
					console.log(this.underBarBias)
					// 移动距离
					this.indexLeft = left + Number(this.underBarBias)
					
					// 动画结束后重置动画状态
					setTimeout(() => {
						this.isAnimating = false;
					}, 300);
				})
				
				// 点击后触发事件，通知父组件该tab已被点击
				this.$emit("tabClicked", index)
			},
			// 清除指定tab的小红点
			clearBadge(index) {
				if (this.badgeIndexes.includes(index)) {
					const newBadgeIndexes = this.badgeIndexes.filter(i => i !== index);
					this.$emit('update:badgeIndexes', newBadgeIndexes);
				}
			}
		},
		created() {
			let that = this;
			// 获取屏幕宽度
			uni.getSystemInfo({
				success(res) {
					that.windowsWidth = res.windowWidth
				}
			})
		},
		mounted() {
			setTimeout(()=>{
				this.clickTab(this.firstTab)
			},1000)
		}
	}
</script>

<style>
	.scrollView {
		width: 100vw;
		white-space: nowrap;
	}

	.tabBox {
		display: flex;
		align-items: center;
		position:relative;
		z-index:1;
	}

	.items {
		padding: 6px 20rpx;
	}
	
	.tab-item-wrapper {
		position: relative;
		display: inline-block;
	}

	.tabText {
		color: #666666;
		transition: .3s all;
		line-height: 50rpx;
		&.dark-mode{
			color: #cecece;
		}
	}

	.active {
		font-weight: bold;
	}
	
	.animating {
		transition: all 0.3s ease-in-out;
	}

	.underscore {
		transition: .3s all;
		transform: translate(0,-40rpx);
		border-radius: 10rpx;
		position:absolute;
		background-color: rgb(161,255,127);
		&.dark-mode{
			background-color: #39582E;
		}
		&.animating {
			transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
		}
	}
	
	.tab-badge {
		position: absolute;
		top: 0;
		right: -10rpx;
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		background-color: #ff4d4f;
	}
</style>
