<template>
	<view class="rich-text-box">
		<!-- #ifndef APP-NVUE -->
		<rich-text v-if="nodes.length" space="nbsp" :nodes="nodes" class="rich-text"></rich-text>
		<!-- #endif -->
		
		<!-- #ifdef APP-NVUE -->
		<web-view ref="web" @onPostMessage="onWebViewMsg" src="/static/app-plus/mp-html/uni-im-code-view-local.html" :style='{"height":webViewHeight}' class="web-view"></web-view>
		<!-- #endif -->
	</view>
</template>

<script>
	// 引入markdown-it库
	import MarkdownIt from '@/uni_modules/uni-im/lib/markdown-it.min.js';

	// hljs是由 Highlight.js 经兼容性修改后的文件，请勿直接升级。否则会造成uni-app-vue3-Android下有兼容问题
	import hljs from "@/uni_modules/uni-im/lib/highlight/highlight-uni.min.js";

	// 引入html-parser.js库
	import parseHtml from '@/uni_modules/uni-im/lib/html-parser.js';

	// 初始化 MarkdownIt库
	const markdownIt = MarkdownIt({
		// 在源码中启用 HTML 标签
		html: true,
		// 如果结果以 <pre ... 开头，内部包装器则会跳过。
		highlight: function(str, lang) {
			// if (lang && hljs.getLanguage(lang)) {
			// 	console.error('lang', lang)
			// 	try {
			// 		return '<pre class="hljs" style="tab-size: 4;padding: 5px 8px;margin: 5px 0;overflow: auto;"><code>' +
			// 			hljs.highlight('lang', str, true).value +
			// 			'</code></pre>';
			// 	} catch (__) {}
			// }
			try {
				return '<pre class="hljs" style="tab-size: 4;padding: 5px 8px;overflow: auto;"><code>' +
					hljs.highlightAuto(str).value +
					'</code></pre>';
			} catch (__) {}

			return '<pre class="hljs" style="tab-size: 4;padding: 5px 8px;overflow: auto;"><code>' +
				markdownIt.utils.escapeHtml(str) + '</code></pre>';
		}
	})
	
	let htmlString = ""
	export default {
		data() {
			return {
				nodes:[],
				// #ifdef APP-NVUE
				webViewHeight:"100px"
				// #endif
			}
		},
		props: {
			code: {
				type: String,
				default () {
					return `alert(5);`
				}
			}
		},
		watch: {
			code:{
				handler(code, oldValue) {
					// 判断markdown中代码块标识符的数量是否为偶数
					htmlString = markdownIt.render("``` \n\n" + code + " \n\n ```")
					// console.log('htmlString',htmlString);
					// #ifdef APP-NVUE
						this.setWebViewConetnt(htmlString)
					// #endif
					
					// #ifndef APP-NVUE
						this.nodes = htmlString
					// #endif
				},
				immediate:true
			}
		},
		mounted() {
		},
		methods: {
			// #ifdef APP-NVUE
			setWebViewConetnt(htmlString){
				if(this.$refs.web){
					// console.log('htmlString',htmlString);
					this.$refs.web.evalJs(`setHtml(${JSON.stringify(htmlString)})`)
				}
			},
			onWebViewMsg(e){
				// console.log(11,e);
				let [data] = e.detail.data
				if(data.action == 'onJSBridgeReady'){
					this.setWebViewConetnt(htmlString)
				}else if(data.action == 'onHeightChange'){
					this.webViewHeight = data.height
				}
			}
			// #endif
		}
	}
</script>

<style lang="scss">
	/* #ifndef APP-NVUE */
	@import '@/uni_modules/uni-im/lib/highlight/github-dark.min.css';
	/* #endif */

	.rich-text-box {
		width: 500rpx;
		position: relative;
		padding: 0 !important;
	}
	
	/* #ifdef H5 */
	.rich-text-box * {
		user-select:text;
		cursor: text;
	}
	/* #endif */

	.rich-text{
		width: 500rpx;
		font-size: 14px;
		border-radius: 10px;
	}
</style>