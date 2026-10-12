<!-- 回到顶部的按钮 -->
<template>
	<view v-if="mOption.theme === 'minecraft'"
		class="mescroll-totop mescroll-totop-minecraft"
		:class="[value ? 'mescroll-totop-in' : 'mescroll-totop-out', {'mescroll-totop-safearea': mOption.safearea, 'mescroll-totop-dark': isDarkMode}]"
		:style="{'z-index':mOption.zIndex, 'left': left, 'right': right, 'bottom':addUnit(mOption.bottom), 'width':addUnit(mOption.width), 'height':addUnit(mOption.width)}"
		role="button" aria-label="回到顶部" :aria-hidden="!value"
		@click="toTopClick">
		<view class="mescroll-totop-pixel-icon" aria-hidden="true">
			<view class="mescroll-totop-pixel-cap"></view>
			<view class="mescroll-totop-pixel-arrow"></view>
		</view>
	</view>
	<img
		v-else-if="mOption.src"
		class="mescroll-totop"
		:class="[value ? 'mescroll-totop-in' : 'mescroll-totop-out', {'mescroll-totop-safearea': mOption.safearea}]"
		:style="{'z-index':mOption.zIndex, 'left': left, 'right': right, 'bottom':addUnit(mOption.bottom), 'width':addUnit(mOption.width), 'border-radius':addUnit(mOption.radius)}"
		:src="mOption.src"
		mode="widthFix"
		@click="toTopClick"
	/>
</template>

<script>
export default {
	props: {
		// up.toTop的配置项
		option: Object,
		// 是否显示
		value: false
	},
	computed: {
		isDarkMode() {
			return Boolean(this.$store && this.$store.state.isDarkMode);
		},
		// 支付宝小程序需写成计算属性,prop定义default仍报错
		mOption(){
			return this.option || {}
		},
		// 优先显示左边
		left(){
			return this.mOption.left ? this.addUnit(this.mOption.left) : 'auto';
		},
		// 右边距离 (优先显示左边)
		right() {
			return this.mOption.left ? 'auto' : this.addUnit(this.mOption.right);
		}
	},
	methods: {
		addUnit(num){
			if(!num) return 0;
			if(typeof num === 'number') return num + 'rpx';
			return num
		},
		toTopClick() {
			this.$emit('input', false); // 使v-model生效
			this.$emit('click'); // 派发点击事件
		}
	}
};
</script>

<style>
/* 回到顶部的按钮 */
.mescroll-totop {
	z-index: 9990;
	position: fixed !important; /* 加上important避免编译到H5,在多mescroll中定位失效 */
	right: 20rpx;
	bottom: 120rpx;
	width: 72rpx;
	height: auto;
	border-radius: 10rpx;
	opacity: 0;
	transition: opacity 0.5s; /* 过渡 */
	margin-bottom: var(--window-bottom); /* css变量 */
}

/* 适配 iPhoneX */
@supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {
	.mescroll-totop-safearea {
		margin-bottom: calc(var(--window-bottom) + constant(safe-area-inset-bottom)); /* window-bottom + 适配 iPhoneX */
		margin-bottom: calc(var(--window-bottom) + env(safe-area-inset-bottom));
	}
}

/* 显示 -- 淡入 */
.mescroll-totop-in {
	opacity: 1;
}

/* 隐藏 -- 淡出且不接收事件*/
.mescroll-totop-out {
	opacity: 0;
	pointer-events: none;
}
</style>

<style scoped>
/* Stone-style square button with hard pixel edges and an inset bevel. */
.mescroll-totop-minecraft {
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 4rpx solid #48483f;
	border-radius: 0;
	background-color: #858579;
	background-image: repeating-linear-gradient(0deg, transparent 0, transparent 12rpx, rgba(255, 255, 255, 0.04) 12rpx, rgba(255, 255, 255, 0.04) 24rpx);
	box-shadow: inset 4rpx 4rpx 0 #b9b9a8, inset -4rpx -4rpx 0 #5b5b50, 0 5rpx 0 rgba(38, 38, 32, 0.28);
	transition: opacity 0.2s;
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
}

.mescroll-totop-pixel-icon {
	width: 36rpx;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
	filter: drop-shadow(2rpx 2rpx 0 #505046);
}

.mescroll-totop-pixel-cap {
	width: 36rpx;
	height: 4rpx;
	background: #fff9e8;
}

.mescroll-totop-pixel-arrow {
	width: 36rpx;
	height: 36rpx;
	background: #fff9e8;
	clip-path: polygon(44% 0, 56% 0, 56% 12%, 68% 12%, 68% 24%, 80% 24%, 80% 36%, 92% 36%, 92% 48%, 68% 48%, 68% 36%, 56% 36%, 56% 100%, 44% 100%, 44% 36%, 32% 36%, 32% 48%, 8% 48%, 8% 36%, 20% 36%, 20% 24%, 32% 24%, 32% 12%, 44% 12%);
}

.mescroll-totop-minecraft:active {
	background-color: #737367;
	box-shadow: inset 4rpx 4rpx 0 #515148, inset -4rpx -4rpx 0 #a6a695;
}

.mescroll-totop-minecraft:active .mescroll-totop-pixel-icon {
	transform: translateY(2rpx);
}

.mescroll-totop-minecraft.mescroll-totop-dark {
	border-color: #252821;
	background-color: #52594a;
	box-shadow: inset 4rpx 4rpx 0 #78816b, inset -4rpx -4rpx 0 #363c30, 0 5rpx 0 rgba(0, 0, 0, 0.35);
}

.mescroll-totop-minecraft.mescroll-totop-dark:active {
	background-color: #414838;
	box-shadow: inset 4rpx 4rpx 0 #30372a, inset -4rpx -4rpx 0 #707963;
}
</style>
