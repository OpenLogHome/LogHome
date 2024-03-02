<template>
	<view class="arcbar_chart">
		<canvas :canvasId="canvasId" id="canvasId" :style="{ width: cWidth + 'px', height: cHeight + 'px' }" />
		<slot />
	</view>
</template>

<script>
import uCharts from '@/plugins/stan-ucharts/u-charts/u-charts.js'; //可以优化放全局 uCharts ==>使用全局
const arcbarCharts = {},
	optionAs = {};
export default {
	name: 'ArcbarChart',
	props: {
		dataAs: {
			//数据
			type: Object,
			default: () => ({})
		},
		basicAs: {
			////通用基础项设置
			type: Object,
			default: () => ({})
		},
		titleAs: {
			//只适用于适用于ring 环形、arcbar 弧线、gauge
			type: Object,
			default: () => ({})
		},
		legendAs: {
			//图例设置
			type: Object,
			default: () => ({})
		},
		extraAs: {
			//详情请看 http://doc.ucharts.cn/1172130
			type: Object,
			default: () => ({})
		},
		width: {
			//图标宽度
			type: Number,
			default: 250
		},
		height: {
			//图标高度
			type: Number,
			default: 250
		},
		valueKey: {
			type: String,
			default: 'series'
		},
		canvasId: {
			type: String,
			default: `arcbar_canvas_${Math.ceil(Math.random(5) * 10000)}`
		}
	},
	data() {
		return {};
	},
	computed: {
		cWidth() {
			return uni.upx2px(this.width);
		},
		cHeight() {
			return uni.upx2px(this.height);
		}
	},
	mounted() {
		let colors = ['#facc14', '#2fc25b', '#f04864', '#8543e0', '#90ed7d', '#ff7600'].sort(() => Math.random() - 0.5);
		let defaultOption = {
			//通用基础项设置 basicAs
			$this: this, //this实例组件内使用图表，必须传入this实例
			canvasId: this.canvasId, //页面组件canvas-id，支付宝中为id
			type: 'arcbar', //图表类型，可选值为pie、line、column、area、ring、radar、arcbar、gauge、candle、bar、mix、rose、word
			padding: [15, 15, 0, 15], //画布填充边距，顺序为上右下左，同css，但必须4位
			colors: colors, //图表配色方案，不传则使用系统默认配置
			rotate: false, //是否横屏展示
			rotateLock: true, //	锁定横屏模式，如果在支付宝和百度小程序中使用横屏模式，请赋值true，否则每次都会旋转90度。跨端使用通过uni-app的条件编译来赋值
			enableScroll: false, //是否开启图表可拖拽滚动 默认false 支持line, area, column, candle图表类型(需配合绑定@touchstart, @touchmove, @touchend方法)
			enableMarkLine: false, //是否显示辅助线 默认false 支持line, area, column, candle, mix图表类型
			animation: true, //是否动画展示
			duration: 1000, //动画展示时长单位毫秒
			dataLabel: true, //是否在图表中显示数据标签内容值
			fontSize: 12, //全局默认字体大小（可选，单位为px，默认13px）高分屏不必乘像素比，自动根据pixelRatio计算
			background: '#ffffff', //canvas背景颜色（如果页面背景颜色不是白色请设置为页面的背景颜色，默认#ffffff）无作用
			pixelRatio: 1, //像素比，默认为1，仅支付宝小程序需要大于1，其他平台必须为1
			width: this.cWidth, //canvas宽度，单位为px，支付宝高分屏需要乘像素比(pixelRatio)
			height: this.cHeight, //canvas高度，单位为px，支付宝高分屏需要乘像素比

			//数据列表配置项 dataAS
			series: this.dataAs[this.valueKey], //数据列表

			//titleAs
			title: {
				name: (this.dataAs[this.valueKey][0].data * 100).toFixed(0) + '%',
				color: this.basicAs.colors ? this.basicAs.colors[0] : colors[0]
			},
			subtitle: {
				name: this.dataAs[this.valueKey][0].name
			},

			//扩展配置 extraAs 详情请看 http://doc.ucharts.cn/1172130
			extra: {}
		};
		let propsData = { ...this.basicAs, ...this.titleAs, ...this.legendAs, ...this.extraAs };
		optionAs[this.canvasId] = Object.assign(defaultOption, propsData);
		arcbarCharts[this.canvasId] = new uCharts(optionAs[this.canvasId]);
	}
};
</script>

<style></style>
