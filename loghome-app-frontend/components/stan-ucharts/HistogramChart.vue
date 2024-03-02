<template>
	<view class="histogram_chart">
		<canvas
			:canvasId="canvasId"
			id="canvasId"
			disable-scroll="true"
			:style="{ width: cWidth + 'px', height: cHeight + 'px' }"
			@touchstart="touchstart"
			@touchmove="touchmove"
			@touchend="touchend"
		/>
		<slot />
	</view>
</template>

<script>
import uCharts from '@/plugins/stan-ucharts/u-charts/u-charts.js'; //可以优化放全局 uCharts ==>使用全局
const histogramuCharts = {},
	optionAs = {};
export default {
	name: 'HistogramChart',
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
		xAxisAs: {
			//xAxis YAxis等轴线基础设置(圆环饼图无轴线无需设置)
			type: Object,
			default: () => ({})
		},
		yAxisAs: {
			//xAxis YAxis等轴线基础设置(圆环饼图无轴线无需设置)
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
			default: 750
		},
		height: {
			//图标高度
			type: Number,
			default: 500
		},
		labelKey: {
			type: String,
			default: 'categories'
		},
		valueKey: {
			type: String,
			default: 'series'
		},
		canvasId: {
			type: String,
			default: `histogram_canvas_${Math.ceil(Math.random(5) * 10000)}`
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
		let defaultOption = {
			//通用基础项设置 basicAs
			$this: this, //this实例组件内使用图表，必须传入this实例
			canvasId: this.canvasId, //页面组件canvas-id，支付宝中为id
			type: 'column', //图表类型，可选值为pie、line、column、area、ring、radar、arcbar、gauge、candle、bar、mix、rose、word
			padding: [15, 15, 0, 15], //画布填充边距，顺序为上右下左，同css，但必须4位
			colors: ['#1890ff', '#2fc25b', '#facc14', '#f04864', '#8543e0', '#90ed7d'], //图表配色方案，不传则使用系统默认配置
			rotate: false, //是否横屏展示
			rotateLock: true, //	锁定横屏模式，如果在支付宝和百度小程序中使用横屏模式，请赋值true，否则每次都会旋转90度。跨端使用通过uni-app的条件编译来赋值
			enableScroll: true, //是否开启图表可拖拽滚动 默认false 支持line, area, column, candle图表类型(需配合绑定@touchstart, @touchmove, @touchend方法)
			enableMarkLine: false, //是否显示辅助线 默认false 支持line, area, column, candle, mix图表类型
			animation: true, //是否动画展示
			dataLabel: true, //是否在图表中显示数据标签内容值
			duration: 1000, //动画展示时长单位毫秒
			fontSize: 12, //全局默认字体大小（可选，单位为px，默认13px）高分屏不必乘像素比，自动根据pixelRatio计算
			background: '#fff', //canvas背景颜色（如果页面背景颜色不是白色请设置为页面的背景颜色，默认#ffffff）无作用
			pixelRatio: 1, //像素比，默认为1，仅支付宝小程序需要大于1，其他平台必须为1
			width: this.cWidth, //canvas宽度，单位为px，支付宝高分屏需要乘像素比(pixelRatio)
			height: this.cHeight, //canvas高度，单位为px，支付宝高分屏需要乘像素比

			//数据列表配置项 dataAS
			categories: this.dataAs[this.labelKey], //数据类别(饼图、圆环图不需要)
			series: this.dataAs[this.valueKey], //数据列表

			//坐标轴配置项 axisAs
			xAxis: {
				//	X轴配置
				type: 'grid',
				rotateLabel: true, //X轴刻度（数值）标签是否旋转（仅在文案超过单屏宽度时有效）
				itemCount: 5, //X轴可见区域数据数量（即X轴数据密度），配合拖拽滚动使用（即仅在启用enableScroll时有效）
				// labelCount:Number,//X轴可见区域标签数量（即X轴数刻度标签单屏幕限制显示的数量）
				scrollShow: true, //是否显示滚动条，配合拖拽滚动使用（即仅在启用enableScroll时有效）
				scrollAlign: 'left', //滚动条初始位置，left为数据整体左对齐，right为右对齐
				scrollBackgroundColor: '#EFEBEF', //	X轴滚动条背景颜色，配合拖拽滚动使用（即仅在启用enableScroll时有效）
				scrollColor: '#A6A6A6', //X轴滚动条颜色，配合拖拽滚动使用（即仅在启用enableScroll时有效）
				disabled: false, //不绘制X轴
				disableGrid: true, //不绘制X轴网格(即默认绘制网格)
				fontColor: '#666666', //X轴数据点颜色
				boundaryGap: 'center', //折线图、区域图起画点结束点方法：center为单元格中间起画，justify为0点起画即两端对齐
				axisLine: false, //坐标轴轴线是否显示
				axisLineColor: '#cccccc' //坐标轴轴线颜色
			},
			yAxis: {
				//如果是多坐标系则传数组型对象[{disabled:true},{disabled:false}]
				disabled: false, //不绘制Y轴
				position: 'left', //Y轴位置，可选值左侧left右侧right(未起效果)
				format: val => {
					let defaultSetting = { type: 'number', fixed: 0, name: '' };
					let { type, fixed, name } = this.yAxisAs && this.yAxisAs.formatter ? Object.assign(defaultSetting, this.yAxisAs.formatter) : defaultSetting;
					if (type == 'number') {
						return `${val.toFixed(fixed)}${name}`;
					} else if (type == 'percent') {
						let newName = name || '%';
						return `${(val * 100).toFixed(fixed)}${name}${newName}`;
					} else {
						return val.toFixed(0);
					}
				},
				title: '' //Y轴标题
			},

			//图列配置 legendAs
			legend: {
				show: true, //是否显示各类别的图例标识
				position: 'top',
				float: 'left',
				padding: 10,
				margin: 0
				// itemGap:10,//各个item之间的间隔，单位px，默认为10，横向布局时为水平间隔，纵向布局时为纵向间隔
				// fontColor:'666666',
				// lineHeight:17,//默认opts.fontSize+5
				// fontSize:12,//默认opts.fontSize
				// backgroundColor:rgba(0,0,0,0),//图例背景颜色
				// borderColor:rgba(0,0,0,0),//图例边框颜色
				// format:()=>{}//未来预留，暂未生效】自定义显示数据内容
			},

			//扩展配置 extraAs 详情请看 http://doc.ucharts.cn/1172130
			extra: {
				column: {
					//参考官网配置
					type: 'group',
					width: (this.cWidth * 0.45) / this.dataAs[this.labelKey].length
				}
			}
		};
		optionAs[this.canvasId] = Object.assign(defaultOption, this.basicAs, this.xAxisAS, this.yAxisAS, this.legendAs, this.extraAs);
		histogramuCharts[this.canvasId] = new uCharts(optionAs[this.canvasId]);
	},
	methods: {
		touchstart(e) {
			let that = this;
			histogramuCharts[this.canvasId].touchLegend(e, { animation: false });
			histogramuCharts[this.canvasId].scrollStart(e);
			histogramuCharts[this.canvasId].showToolTip(e, {
				//修改点击事弹出文字
				format: function(item, category) {
					let defaultSetting = { type: 'number', fixed: 0, name: '' };
					let newName;
					let { type, fixed, name } = that.yAxisAs && that.yAxisAs.formatter ? Object.assign(defaultSetting, that.yAxisAs.formatter) : defaultSetting;
					if (typeof item.data === 'object') {
						if (type == 'number') {
							return `${category} ${item.name}:${item.data.value.toFixed(fixed)}${name}`;
						} else if (type == 'percent') {
							newName = name || '%';
							return `${category} ${item.name}:${(item.data.value * 100).toFixed(fixed)}${newName}`;
						} else {
							return `${category} ${item.name}:${item.data.value}`;
						}
					} else {
						if (type == 'number') {
							return `${category} ${item.name}:${item.data.toFixed(fixed)}${name}`;
						} else if (type == 'percent') {
							newName = name || '%';
							return `${category} ${item.name}:${(item.data * 100).toFixed(fixed)}${newName}`;
						} else {
							return `${category} ${item.name}:${item.data}`;
						}
					}
				}
			});
		},
		touchmove(e) {
			histogramuCharts[this.canvasId].scroll(e);
		},
		touchend(e) {
			histogramuCharts[this.canvasId].scrollEnd(e);
		}
	}
};
</script>

<style scoped></style>
