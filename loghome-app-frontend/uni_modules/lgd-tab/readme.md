# 组件说明
## 参数说明
| 参数名 | 说明 | 例子 | 是否必填 | 参数类型 |
|:-----|---|-----|:-----:|:-----:|
|tabValue|Tab数组|["放入所需显示文字","测试"]|是| Array |
|textColor|文字/下划线颜色|"#34b2fa"|否|String|
|fontSize|字体大小|16|否|NumBer|

## 示例
* 父页面获取当前tab下标

> template

	<lgd-tab :tabValue="tabValue" @getIndex ="getIndex"/>

> script

	getIndex(index) { console.log("当前下标:" + index) }

* 父页面更改当前tab下标

> template

	<lgd-tab :tabValue="tabValue" ref="tabs"/>

> script

	this.$refs.tabs.clickTab(0)

## 隐藏滚动条

在App.vue样式中引入css，参考: <https://ask.dcloud.net.cn/article/36090>

	<style>
		@import url("./components/lgd-tab/lgd-tab.css");
	</style>

### 组件文档：<https://uniapp.dcloud.io/vue-components>