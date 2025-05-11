<template>
	<vk-data-dialog
		v-model="value.show"
		:title="page.title"
		:top="page.top"
		:width="page.width"
		:close-on-click-modal="false"
		:show-fullscreen="false"
		:show-close="false"
		:destroy-on-close="true"
		mode="form"
	>
		<!-- 页面主体内容开始 -->
			<view class="body" v-if="total>1">
				<view>
					<text>总进度：{{ currentIndex+1 }} / {{ total }}</text>
					<el-progress :percentage="totalPercentage"></el-progress>
				</view>
				<view style="margin-top: 10px;">
					<text>文件{{currentIndex+1}}进度：</text>
					<el-progress :percentage="currentPercentage"></el-progress>
				</view>
				<view style="margin-top: 10px;text-align: center;">正在上传第 {{currentIndex+1}} 个文件</view>
			</view>
			<view class="body" v-else>
				<view style="text-align: center;">
					<el-progress :percentage="currentPercentage" type="circle"></el-progress>
				</view>
			</view>
		<!-- 页面主体内容结束 -->
	</vk-data-dialog>
</template>

<script>
var that; // 当前页面对象
var vk = uni.vk; // vk实例
export default {
	props: {
		value: {
			Type: Object,
			default: function() {
				return {
					show: false,
					mode: "",
					item: {}
				};
			}
		}
	},
	data: function() {
		// 组件创建时,进行数据初始化
		return {
			page: {
				title: "上传进度",
				submitText: "确定",
				cancelText: "关闭",
				showCancel: true,
				top: "40vh",
				width: "500px"
			},
			total:0,
			totalPercentage: 0, // 总进度
			currentPercentage: 0, // 当前文件进度
			currentIndex: 0,
		};
	},
	mounted() {
		that = this;
		that.init();
	},
	methods: {
		// 初始化
		init() {
			let { value } = that;
			that.$emit("input", value);
		},
		// 监听 - 页面打开
		onOpen() {
			that = this;
			let { item={} } = that.value;
			that.upload(item);
		},
		// 监听 - 页面关闭
		onClose() {

		},
		async upload(item){
			let that = this;
			let { vk } = that;
			let { tempFilePaths, tempFiles, categoryId, fileType, cloudDirectory, cloudPathRemoveChinese, provider } = item;
			that.total = tempFilePaths.length;
			that.totalPercentage = 0;
			for (let i = 0; i < tempFilePaths.length; i++) {
				that.currentPercentage = 0;
				that.currentIndex = i;
				let percentage = vk.pubfn.toDecimal((i+1) / tempFilePaths.length * 100, 0);
				try {
					await new Promise((resolve, reject) => {
						vk.uploadFile({
							filePath: tempFilePaths[i],
							file: tempFiles[i],
							needSave: true,
							fileType,
							category_id: categoryId,
							cloudDirectory,
							cloudPathRemoveChinese,
							provider,
							uniCloud: item.uniCloud,
							env: item.env,
							onUploadProgress:(progressRes) => {
								// 上传过程中
								that.currentPercentage = progressRes.progress;
							},
							addSuccess:(res) => {
								resolve(res);
							},
							fail: (res) => {
								reject(res);
							},
							addFail: (res) => {
								reject(res);
							},
						});
					});
					that.totalPercentage = percentage;
				} catch(err){
					console.error(err);
				}
			}
			that.onSuccess();
		},
		// 监听 - 提交成功后
		onSuccess() {
			that.value.show = false; // 关闭页面
			that.$emit("success");
		}
	},
	watch: {
		"value.show": {
			handler(newValue, oldValue) {
				let that = this;
				if (newValue) {
					that.onOpen();
				} else {
					that.onClose();
				}
			}
		}
	},
	// 计算属性
	computed: {}
};
</script>

<style lang="scss" scoped>
	.body{
		padding: 30px;
	}
</style>
