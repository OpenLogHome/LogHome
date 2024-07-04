<template>
	<view>
		<view class="scrollView" scroll-x show-scrollbar="false" :scroll-left="scrollLeft" scroll-with-animation>
			<view class="tabBox" :style="{ 'justify-content': isOutWindow ? 'space-around' : 'space-around' }">
				<view class="items" v-for="(item, index) in tabValue" :key="index" @click="clickTab(index)">
					<el-badge is-dot class="item" v-if="tabBadge[index]">
						<text class="tabText" :class="index == tIndex ? 'active' : ''"
							:style="{ 'font-size': fontSize + ((index == tIndex)?5:0) + 'rpx', color: index == tIndex ? textColor : ''}">
							{{item}}
						</text>
					</el-badge>
					<text class="tabText" :class="index == tIndex ? 'active' : ''" v-if="!tabBadge[index]"
						:style="{ 'font-size': fontSize + ((index == tIndex)?5:0) + 'rpx', color: index == tIndex ? textColor : ''}">
						{{item}}
					</text>
				</view>
			</view>
			<view class="underscore"
				:style="{ width: inderWidth + 'px', 'margin-left': indexLeft + boxLeft + 'px', 'background-color': 'rgb(161,255,127)', height: '25rpx' }" />
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
			tabBadge: { // tab数据
				type: Array,
				default: () => []
			},
			textColor: { // 颜色
				type: String,
				default: '#34b2fa'
			},
			fontSize: { // 字体大小
				type: Number,
				default: 30
			},
			firstTab: {
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
			};
		},
		methods: {
			clickTab(index) {
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
				uni.createSelectorQuery().in(this).selectAll(".items").boundingClientRect().exec((data) => {
					let width = data[0][index].width
					let left = data[0][index].left
					let newLeft = 0

					// 点击tab宽度
					this.inderWidth = width;

					// 移动距离
					this.indexLeft = left
				})
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
			setTimeout(() => {
				this.clickTab(this.firstTab)
			}, 600)
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
		position: relative;
		z-index: 1;
	}

	.items {
		padding: 6px 20rpx;
	}

	.tabText {
		color: #666666;
		transition: .3s all;
		line-height: 50rpx;
	}

	.active {
		font-weight: bold;
	}

	.underscore {
		transition: .3s all;
		transform: translate(0, -40rpx);
		border-radius: 10rpx;
		position: absolute;
	}
</style>