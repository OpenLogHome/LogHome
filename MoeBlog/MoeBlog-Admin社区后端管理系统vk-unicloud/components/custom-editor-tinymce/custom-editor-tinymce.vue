<template>
	<!-- 万能表单 -->
	<view
		v-if="scene === 'form'"
		:style="{ width: widthCom }"
		:class="{ fullscreen: fullscreen }"
		class="tinymce-editor editor-container"
	>
		<view v-if="!hasInit && showLoading" v-loading="!hasInit" class="loading-box"></view>
		<textarea :id="editorId" class="editor-textarea" />

		<vk-data-input-file-select
			v-if="fileSelect.fileType"
			ref="fileSelectDialog"
			:controls="false"
			:file-type="fileSelect.fileType"
			:multiple="fileSelect.multipleLimit > 1 ? true : false"
			:multipleLimit="fileSelect.multipleLimit"
			:category_id="_getProp('category_id')"
			:cloudDirectory="_getProp('cloudDirectory')"
			:env="_getProp('env')"
			:cloudPathRemoveChinese="_getProp('cloudPathRemoveChinese')"
			placeholder="请选择文件"
			@selected="_selected"
		></vk-data-input-file-select>
	</view>
	<!-- 万能表格 -->
	<view v-else-if="scene === 'table'" class="tinymce-editor editor-table">
		{{ value }}
	</view>
	<!-- 万能表格详情 -->
	<view v-else-if="scene === 'detail'" class="tinymce-editor editor-detail">
		<textarea v-html="value" :style="{ width: widthCom }" style="display: block;"></textarea>
	</view>
</template>
<script>
import defaultConfig from "./config.js";
import { PopupManager } from "element-ui/lib/utils/popup";
/**
 * custom-editor-tinymce 富文本编辑器 - tinymce
 * 作者: VK
 * 基于 tinymce 实现的富文本编辑器，仅支持PC端，移动版H5只支持部分浏览器，微信浏览器不支持
 * vk-admin 文档：https://www.tiny.cloud
 * tinymce 官方文档：https://www.tiny.cloud
 * @property {String} value 双向绑定的值
 * @property {Object} column 万能表单或万能表格里的columns对应的字段规则
 * @property {String} scene 当前场景 form 万能表单 table 万能表格 detail 表格详情页
 * 	@value form					万能表单
 * 	@value table 				万能表格
 * 	@value detail 			表格详情页
 * @property {String} id 编辑器id
 * @property {String} placeholder 输入前的提示
 * @property {Array} toolbar 工具栏
 * @property {String} menubar 菜单栏
 * @property {Number String} width 宽度
 * @property {Number String} height 高度
 * @property {Object} editorConfig 编辑器其他配置透传 配置参考 https://www.tiny.cloud/docs/tinymce/latest/basic-setup/
 * @property {String} language 多语言
 * 	@value zh-Hans          中文简体
 * 	@value zh-Hant          中文繁体
 * 	@value en               英语
 * @property {Boolean} disabled 是否禁止编辑
 * @property {Boolean} needSave 上传的图片是否需要保存到素材库
 * @property {String} category_id 当 needSave 为true时，上传的分类id
 * @property {String} cloudDirectory 上传的目录
 * @property {String} env 上传文件使用的uniCloud环境
 * @property {Boolean} cloudPathRemoveChinese 上传后的文件名是否需要删除中文
 * @property {Boolean} showLoading 初始化时是否显示loading
 * @event {Function} input
 * @event {Function} change
 * @example <custom-editor-tinymce  seconds="60" :mobile="form1.mobile" type="register" custom-style="font-size: 28rpx;"></custom-editor-tinymce>
 */
export default {
	props: {
		// 双向绑定的值
		value: {
			type: String,
			default: ""
		},
		// 字段规则
		column: {
			type: Object,
			default: function () {
				return {};
			}
		},
		// 当前场景 form 万能表单 table 万能表格 detail 表格详情页
		scene: {
			type: String,
			default: "form"
		},

		// 其他属性
		// id
		id: {
			type: String,
			default() {
				return "vue-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + "");
			}
		},
		placeholder: {
			type: String,
			default: "开始输入..."
		},
		// 工具栏
		toolbar: {
			type: Array
		},
		menubar: {
			type: String
		},
		width: {
			type: [Number, String],
			required: false,
			default: "auto"
		},
		height: {
			type: [Number, String]
		},
		// 编辑器其他配置参考 http://tinymce.ax-z.cn/configure/integration-and-setup.php
		editorConfig: {
			type: Object,
			default() {
				return {};
			}
		},
		language: {
			type: String,
			default: "zh-Hans"
		},
		disabled: {
			type: Boolean,
			default: false
		},
		needSave: {
			type: Boolean
		},
		category_id: {
			type: String
		},
		cloudDirectory: {
			type: String
		},
		env: {
			type: String
		},
		cloudPathRemoveChinese: {
			type: Boolean,
			default: false
		},
		showLoading: {
			type: Boolean,
			default: true
		},
	},
	data() {
		let editorId = this._getProp("id");
		return {
			editorData: "", // 编辑器数据
			hasInit: false, // 是否已完成初始化
			editorId, // 编辑器id
			fullscreen: false, // 是否全屏
			// 多语言
			languageTypeList: {
				"en": "en",
				"zh-Hans": "zh_CN",
				"zh-Hant": "zh_HK"
			},
			// 文件选择弹窗
			fileSelect: {
				fileType: "",
				multipleLimit: 1
			}
		};
	},
	mounted() {
		this.init();
	},
	destroyed() {
		this.destroyEditor();
	},
	activated() {
		this.init();
	},
	deactivated() {
		this.destroyEditor();
	},
	methods: {
		// 初始化
		async init() {
			if (!window.tinymce) {
				// 如果 window.tinymce 不存在，则最多等待5秒
				for (let i = 0; i < 50; i++) {
					await vk.pubfn.sleep(100);
					if (window.tinymce) {
						break;
					}
				}
			}
			// 销毁编辑器
			if (this.hasInit) {
				this.destroyEditor();
			}
			this.initEditor();
		},
		// 初始化 editor
		initEditor() {
			const that = this;
			let editorConfig = that._getProp("editorConfig") || {};
			let toolbar = that._getProp("toolbar") || defaultConfig.toolbar;
			let menubar = that._getProp("menubar") || defaultConfig.menubar;
			let language = that.languageTypeList[that._getProp("language")] || "zh_CN";
			window.tinymce.init({
				selector: `#${that.editorId}`,
				...defaultConfig,
				placeholder: that._getProp("placeholder"),
				language,
				height: that._getProp("height") || 600,
				readonly: that._getProp("disabled"),
				toolbar,
				menubar,
				init_instance_callback: editor => {
					editor.setContent(that.value || "");
					that.hasInit = true;
					editor.on("input change", (e) => {
						let content = editor.getContent();
						if (content !== that.editorData) {
							that.editorData = content;
							that._updateValue(content);
						}
					});
					// 处理弹窗z-index问题
					let zIndex = PopupManager.nextZIndex();
					let body = document.querySelector("body");
					body.style.setProperty("--el-zindex", zIndex);
				},
				// 没有用到images_upload_handler方法上传文件用的是下面的file_picker_callback方法
				images_upload_handler: (blobInfo, progress) => {
					return new Promise(async (resolve, reject) => {
						progress(0);
						let file = blobInfo.blob();
						let filePath = blobInfo.blobUri();
						uni.vk.uploadFile({
							file,
							filePath,
							needSave: this._getProp("needSave"),
							category_id: this._getProp("category_id"),
							cloudDirectory: this._getProp("cloudDirectory"),
							env: this._getProp("env"),
							cloudPathRemoveChinese: this._getProp("cloudPathRemoveChinese"),
							onUploadProgress: progressEvent => {
								progress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
							},
							success: (res) => {
								// 上传成功
								resolve(res.fileURL);
							},
							fail: (err) => {
								// 上传失败
								let errMsg = err.msg || err.errMsg || err.message;
								reject("上传失败: "+ errMsg);
							}
						});
					});
				},
				// 文件上传
				file_picker_callback: async (callback, value, meta) => {
					//文件分类
					let filetype = ".pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4";
					let fileSelectType = "other";
					switch (meta.filetype) {
						case "image":
							filetype = ".jpg, .jpeg, .png, .gif";
							fileSelectType = "image";
							break;
						case "media":
							filetype = ".mp3, .mp4";
							fileSelectType = "video";
							break;
						case "file":
							fileSelectType = "other";
						default:
					}
					if (fileSelectType !== this.fileSelect.fileType) {
						this.fileSelect.fileType = fileSelectType;
					}
					this.fileSelect.multipleLimit = 1;
					this._openFileSelectDialog();
					this.callback = callback;

					//模拟出一个input用于添加本地文件
					// const input = document.createElement('input');
					// input.setAttribute('type', 'file');
					// input.setAttribute('accept', filetype);
					// input.click();
					// input.onchange = function() {
					// 	let file = this.files[0];
					// 	let xhr, formData;
					// 	console.log(file.name);
					// 	if (meta.filetype == 'file') {
					// 		callback('mypage.html', {text: 'My text'});
					// 	}
					// 	if (meta.filetype == 'image') {
					// 		callback('myimage.jpg', {alt: 'My alt text'});
					// 	}
					// 	if (meta.filetype == 'media') {
					// 		callback('movie.mp4', {source2: 'alt.ogg', poster: 'image.jpg'});
					// 	}
					// };
				},
				video_template_callback: function (data) {
					let htmlStr = "";
					if (data.source.indexOf(".html") > -1) {
						htmlStr = `<iframe height=498 width=510 src="${data.source}" frameborder=0 'allowfullscreen'></iframe>`;
					} else {
						htmlStr = `
						<video controls width="${data.width}" height="${data.height}" class="editor-video" style="max-width:100%;">
							<source src="${data.source}" :type="${data.sourcemime}">
							您的浏览器不支持播放此视频
						</video>
						`;
					}
					return htmlStr;

				},
				...editorConfig,
				setup(editor) {
					editor.on("FullscreenStateChanged", e => {
						that.fullscreen = e.state;
					});
					// 注册多图上传按钮
					editor.ui.registry.addButton("images", {
						icon: "images",
						tooltip: "多图上传",
						enabled: true,
						onAction: () => {
							that.fileSelect.fileType = "image";
							that.fileSelect.multipleLimit = 99;
							that._openFileSelectDialog();
						}
					});
				}
			});
		},
		// 销毁 editor 实例
		destroyEditor() {
			const editor = this.getEditor();
			if (this.fullscreen) {
				editor.execCommand("mceFullScreen");
			}
			if (editor) {
				editor.destroy();
				this.hasInit = false;
			}
		},
		// 获取 editor 实例
		getEditor(){
			return window.tinymce.get(this.editorId);
		},
		// 设置内容
		setContent(value) {
			this._updateValue(value);
			//this.getEditor().setContent(value);
		},
		// 获取内容
		getContent() {
			return this.getEditor().getContent();
		},
		// 保存草稿
		save(){
			let page = uni.vk.pubfn.getCurrentPageRoute();
			uni.vk.setStorageSync(`editor-draft-${page}`, this.getContent());
		},
		// 从草稿恢复
		restore(){
			let page = vk.pubfn.getCurrentPageRoute();
			let content = vk.getStorageSync(`editor-draft-${page}`);
			this.setContent(content);
		},
		// 清空内容
		clean(){
			this.setContent("");
		},
		// 插入单张图片
		insertImage(image) {
			let { url, width = 0 } = image;
			let styleStr = "max-width:100%;";
			if (width > 500) {
				styleStr += "display: block;";
			}
			this.getEditor().insertContent(`<img class="editor-image" src="${url}" style="${styleStr}">`);
		},
		// 插入多张图片
		insertImages(arr) {
			arr.forEach(item => {
				this.insertImage(item);
			});
		},
		// 插入单个视频
		insertVideo(data) {
			let { width, height, url, type } = data;
			let htmlStr = `
			<video controls width="${width}" height="${height}" class="editor-video" style="max-width:100%;">
				<source src="${url}" :type="${type}">
				您的浏览器不支持播放此视频
			</video>
			`;
			this.getEditor().insertContent(htmlStr);
		},
		// 插入多个视频
		insertVideos(arr) {
			arr.forEach(item => {
				this.insertVideo(item);
			});
		},
		// 触发修改双向绑定的值
		_updateValue(value){
			this.$emit("input", value);
			this.$emit("change", value);
		},
		// 获取属性值
		_getProp(name) {
			return typeof this.column[name] !== "undefined" && this.column[name] !== "" ? this.column[name] : this[name];
		},
		// 打开素材库弹窗
		_openFileSelectDialog() {
			setTimeout(() => {
				this.$refs.fileSelectDialog.open();
			}, 50);
		},
		// 素材库选择结束事件
		_selected(url, file = {}) {
			if (typeof url === "object" && url.length > 0) {
				// 多图上传
				this.insertImages(file);
			} else {
				let { display_name = "附件" } = file;
				this.callback(url, { text: display_name });
			}
		}
	},
	watch: {
		value(val = "") {
			if (this.hasInit && (this.editorData !== val || val == "")) {
				this.getEditor().setContent(val);
			}
		},
		language(val){
			this.init();
		}
	},
	computed: {
		widthCom() {
			const width = this.width;
			if (/^[\d]+(\.[\d]+)?$/.test(width)) {
				return `${width}px`;
			}
			return width;
		}
	}
};
</script>
<style scoped lang="scss">
.editor-container {
	position: relative;
	line-height: normal;
	.editor-textarea {
		visibility: hidden;
		z-index: -1;
	}
}
.editor-detail {
	line-height: 1.4;
	margin: 14px 0;
}
.loading-box{
	display: flex;
	justify-content: center;
	align-items: center;
	height: 200px;
	color: #999999;
}
</style>
