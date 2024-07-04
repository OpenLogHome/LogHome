<template>
<view class="list-root">
	<!-- #ifdef APP-NVUE -->
	<list class="list" :bounce="false" :render-reverse="true">
		<slot></slot>
		<!-- #ifdef APP-NVUE -->
		<!-- 解决APP端的滚动锚定问题，在最后一个cell 设置 keep-scroll-position 和 render-reverse-position -->
		<cell :keep-scroll-position="true" :render-reverse-position="true"  ref="uni-im-list-last-item">
			<!-- 高度为0的 最后一个元素用于方便滚动到最后一个元素 -->
		</cell>
		<!-- #endif -->
	</list>
	<!-- <view :style="{height:paddingBottom}"></view> -->
	<!-- #endif -->
	
	<!-- #ifndef APP-NVUE -->
		<scroll-view @scroll="scroll" :scroll-top="scrollTop" :scroll-into-view="scrollIntoView" :bounces="false"
			:enhanced="true" :fast-deceleration="true" :upper-threshold="10" :scroll-anchoring="true"
			:enable-passive="true" class="scroll-view" :scroll-y="true" :scroll-with-animation="false"
			:style="{paddingBottom}" :enable-flex="true"
		>
			<slot></slot>
			<view id="uni-im-list-last-item" key="uni-im-list-last-item">
				<!-- 高度为0的 最后一个元素用于方便滚动到最后一个元素 -->
			</view>
		</scroll-view>
	<!-- #endif -->
</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		props: {
			scrollTop: {
				default: 0
			},
			scrollIntoView: {
				type: String,
				default: ''
			},
			paddingBottom: {
				default: 0
			}
		},
		methods: {
			scroll(e) {
				this.$emit('scroll', e)
			}
		},
		mounted() {
		}
	}
</script>

<style lang="scss" scoped>
	/* #ifndef APP-NVUE */
	.scroll-view{
		overflow-anchor: auto;
		
		/* #ifdef MP-WEIXIN */
		height: 100vh;
		/* #endif */
		
		/* #ifdef H5 */
		height: calc(100vh - 44px);
		/* #endif */
		
	}
	/* #endif */
	
	/* #ifdef APP-NVUE */
	.list-root,.list{
		flex: 1;
	}
	/* #endif */
</style>
