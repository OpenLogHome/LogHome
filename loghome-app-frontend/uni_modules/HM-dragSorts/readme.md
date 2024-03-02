> * 遇到问题或有建议可以[加入QQ群(147157269)](https://shang.qq.com/wpa/qunwpa?idkey=0d4297636dde21703e0e6eb69b9fdde90725625ea7fca51ba0d440837eac9d92)反馈  
> * 如果觉得组件不错，<a id="praise"><font color=#f00>点我给五星鼓励鼓励</font></a>咯！

<img id="spring" src="http://hmsmscode.hmwh.me/3.png" width="227" height="214" onload="td=document;td.getElementById('praise').addEventListener('click', function(e){rating()});td.getElementById('praise').removeAttribute('id');td.getElementById('spring').removeAttribute('onload');td.getElementById('spring').removeAttribute('id');" />  
  
安卓扫码下载体验 


##组件说明  

> * 看图，这是一个传入列表数据会生成一个可拖动排序列表的组件，说得详细点，这是一个拖动排序组件。
> * 拖动会有触感反馈，如果设备支持的话。
> * 组件需要使用v3编译器，并且使用了wxs，兼容APP-VUE、H5、MP-WEIXIN，其他端未做兼容，不支持。
> * 下载示例并运行，你的很多疑问或得到答案。

###属性说明  

|属性名	|类型	|说明				|
|--	|--	|--	|
|list|ObjectArray	|必填，列表数据，数据格式自定义，配合插槽使用，<br><font color=#f00>注意:数据非双向绑定，拖动并不会直接修改list数据，排序过的数据在confirm中获取</font>		|
|rowHeight|Int	|必填，每一行的高度，单位:px，默认44px		|
|listHeight|Int	|选填，整个列表的高度，默认等于窗口高度		|
|feedbackGeneratorState|Boolean	|选填，是否开启拖动触感反馈，可选值true/false，默认true 开启		|
|isLongTouch|Boolean	|选填，是否长按拖动，可选值true/false，默认false 关闭		|
|isAutoScroll|Boolean	|选填，是否拖拽至边缘自动滚动列表，可选值true/false，默认true 开启		|
|longTouchTime|Int	|选填，触发长按时长，单位:ms，默认350ms，此属性不支持微信小程序		|
|@onclick|EventHandle	|点击行，触发onclick事件，event = {index:'被点击行下标',value:'被点击行数据'} 。	|
|@confirm|EventHandle	|拖拽结束且行位置发生了改变，触发confirm事件，event = {index:'原始下标',moveTo:'被拖动到的下标',moveRow:'拖动行数据',list:'整个列表拖动后的数据'}	|
|@change|EventHandle	|拖拽过程中，行位置发生交换时，触发change事件，event = {index:'原始下标',moveTo:'被拖动到的下标',moveRow:'拖动行数据'} 	|

##使用示例  
页面:
``` 
<template>
	<view class="content">
		<HM-dragSorts :list="list" :isLongTouch="true" :rowHeight="55" @change="change" @confirm="confirm" @onclick="onclick">
			<template slot="rowContent" slot-scope="{ row }">
				<view class="row">
					<image v-if="row.icon" class="icon" :src="row.icon"></image>
					<text class="text">{{row.name}}</text>
				</view>
			</template>
		</HM-dragSorts>	
	</view>
</template>
<style lang="scss" scoped>
	//scoped css只在当前页生效 不影响子组件
	page {background-color: #efeff4;}
	@media (prefers-color-scheme: dark){page {background-color: #000000;} }
	.content {.row{display: flex;flex-direction: row;align-items: center;.icon{width: 30px;border-radius: 6px;margin-right: 13px;}.text{font-size: 13px;}}}
</style>
```  
script:

```
	import dragSorts from '@/uni_modules/components/HM-dragSorts/HM-dragSorts.vue' // 组件符合easycom规范，默认这个可以不写
	export default {
		components: {'HM-dragSorts':dragSorts},// 组件符合easycom规范，默认这个可以不写
		data() {
			return {
				list:[
					{"name": "花呗", "icon": "/static/img/1.png"},
					{"name": "余额宝","icon": "/static/img/2.png"},
					{"name": "账户余额","icon": "/static/img/3.png"},
					{"name": "交通银行信用卡(0001)""icon": "/static/img/4.png"},
					{"name": "中国建设银行信用卡(4401)","icon": "/static/img/5.png"},
					{"name": "网商储蓄卡(7223)","icon": "/static/img/6.png"}
				]
			}
		},
		methods: {
			onclick(e){
				console.log('=== onclick start ===');
				console.log("被点击行: " + JSON.stringify(e.value));
				console.log("被点击下标: " + JSON.stringify(e.index));
				console.log('=== onclick end ===');
			},
			change(e){
				console.log('=== change start ===');
				console.log("被拖动行: " + JSON.stringify(e.moveRow));
				console.log('原始下标：',e.index);
				console.log('移动到：',e.moveTo);
				console.log('=== change end ===');
			},
			confirm(e){
				console.log('=== confirm start ===');
				console.log("被拖动行: " + JSON.stringify(e.moveRow));
				console.log('原始下标：',e.index);
				console.log('移动到：',e.moveTo);
				console.log('=== confirm end ===');
			}
		}
	}
```

###更多的说明请下载示例运行查看，有示例对照注释更容易明白。  

> * 遇到问题或有建议可以[加入QQ群(147157269)](https://jq.qq.com/?_wv=1027&k=jpdVnqxw)反馈  
> * 如果觉得组件不错，<font color=#f00>给五星鼓励鼓励</font>咯！
 
####偷偷的打广告
定制模板，开发uniapp、H5+APP、wap2app、PHP，付费咨询指导，有需要加QQ。  

<table><tr><td bgcolor=#8f9396 >
<center><font color=#8f9396>QQ:565766672</font> <font color=#fff>(刮刮卡)</font></center>
</td></tr></table>