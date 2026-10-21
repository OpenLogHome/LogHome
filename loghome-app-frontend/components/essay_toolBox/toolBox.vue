<template>
	<view class="toolBoxOuter">
		<div class="title">
			{{ $t('writer.editor.toolbox.title') }}
			<p class="help">{{ $t('writer.editor.toolbox.help') }}</p>
		</div>
		<div class="item">{{ $t('writer.editor.toolbox.targetText') }}</div>
		<div class="selectedText">
			{{selectText}}
		</div>
		<div class="item">{{ $t('writer.editor.toolbox.availableTools') }}</div>
		<div class="tool" v-for="tool in tools"
		@click="execute(tool.func)">{{tool.name}}</div>
		<div class="bottomBar"></div>
		
<!-- 		<el-dialog
		  title="结果"
		  :visible.sync="dialogVisible"
		  width="80vw"
		  :modal="false">
		  <span>{{result}}</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取消</el-button>
		    <el-button type="primary" @click="dialogVisible = false">保存到剪贴板</el-button>
		  </span>
		</el-dialog> -->
		
		<el-drawer
		  :title="$t('writer.editor.toolbox.resultPreview')"
		  :visible.sync="dialogVisible"
		  direction="btt"
		  :modal="false"
		  size="100%">
		  <div class="result">
			  {{result}}
		  </div>
		  <div class="button" @click="stickBoard">{{ $t('writer.editor.toolbox.copyToClipboard') }}</div>
		</el-drawer>

		
	</view>
</template>

<script>
	import axios from "axios"
	export default{
		props:["selectText","articleTitle"],
		computed:{
			tools(){
				return [
					{
						name:this.$t('writer.editor.toolbox.summary'),
						func:this.文本摘要提取,
					},
					{
						name:this.$t('writer.editor.toolbox.translate'),
						func:this.快速中英文互译,
					},
					{
						name:this.$t('writer.editor.toolbox.simpDiary'),
						func:this.获取舔狗日记,
					},
					{
						name:this.$t('writer.editor.toolbox.joke'),
						func:this.获取笑话,
					},
					{
						name:this.$t('writer.editor.toolbox.darkHumor'),
						func:this.获取毒鸡汤,
					},
					{
						name:this.$t('writer.editor.toolbox.compliments'),
						func:this.获取彩虹屁,
					}

				]
			}
		},
		data(){
			return{
				dialogVisible:false,
				result:""
			}
		},
		methods:{
			execute(func){
				func();
			},
			showResult(result){
				this.result = result;
				this.dialogVisible=true;
			},
			stickBoard(){
				uni.setClipboardData({
					data: this.result,
					success: function () {
					    console.log('success');
					}
				})
			},
			文本摘要提取(){
				let _this = this;
				axios.post(this.$baseUrl + '/essayTools/news_summary',
					{
						title: this.articleTitle,
						content: this.selectText,
						max_summary_len:300
					}
				)
				.then(function(response) {
					uni.showToast({
						title: _this.$t('writer.editor.toolbox.extractSuccess'),
						icon: 'none',
						duration: 2000
					});
					_this.showResult(response.data.data.summary);
				})
				.catch(function(error) {
					if (error) {
						uni.showToast({
							title: _this.$t('writer.editor.toolbox.extractFailed'),
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			获取舔狗日记(){
				let _this = this;
				axios.get('https://api.muxiaoguo.cn/api/tiangourj'
				)
				.then(function(response) {
					uni.showToast({
						title: _this.$t('writer.editor.toolbox.fetchSuccess'),
						icon: 'none',
						duration: 2000
					});
					console.log(response.data);
					_this.showResult(response.data.data.comment);
				})
				.catch(function(error) {
					if (error) {
						uni.showToast({
							title: _this.$t('writer.editor.toolbox.fetchFailed'),
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			快速中英文互译(){
				let _this = this;
				axios.get('https://api.muxiaoguo.cn/api/Tn_tencent?text=' + this.selectText
				)
				.then(function(response) {
					uni.showToast({
						title: _this.$t('writer.editor.toolbox.translateSuccess'),
						icon: 'none',
						duration: 2000
					});
					console.log(response.data);
					_this.showResult(response.data.data.Translation);
				})
				.catch(function(error) {
					if (error) {
						uni.showToast({
							title: _this.$t('writer.editor.toolbox.translateFailed'),
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			获取笑话(){
				let _this = this;
				axios.get('https://api.muxiaoguo.cn/api/xiaohua'
				)
				.then(function(response) {
					uni.showToast({
						title: _this.$t('writer.editor.toolbox.fetchSuccess'),
						icon: 'none',
						duration: 2000
					});
					console.log(response.data);
					_this.showResult(response.data.data.content);
				})
				.catch(function(error) {
					if (error) {
						uni.showToast({
							title: _this.$t('writer.editor.toolbox.fetchFailed'),
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			获取毒鸡汤(){
				let _this = this;
				axios.get('https://api.muxiaoguo.cn/api/dujitang'
				)
				.then(function(response) {
					uni.showToast({
						title: _this.$t('writer.editor.toolbox.fetchSuccess'),
						icon: 'none',
						duration: 2000
					});
					console.log(response.data);
					_this.showResult(response.data.data.comment);
				})
				.catch(function(error) {
					if (error) {
						uni.showToast({
							title: _this.$t('writer.editor.toolbox.fetchFailed'),
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			获取彩虹屁(){
				let _this = this;
				axios.get('https://api.muxiaoguo.cn/api/caihongpi'
				)
				.then(function(response) {
					uni.showToast({
						title: _this.$t('writer.editor.toolbox.fetchSuccess'),
						icon: 'none',
						duration: 2000
					});
					console.log(response.data);
					_this.showResult(response.data.data.comment);
				})
				.catch(function(error) {
					if (error) {
						uni.showToast({
							title: _this.$t('writer.editor.toolbox.fetchFailed'),
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
		}
	}
</script>

<style scoped lang="scss">
	.toolBoxOuter{
		min-height:70vh;
		background-color: rgb(255,248,234);
		div.title{
			padding:30rpx 30rpx 0rpx 30rpx;
			font-size: 45rpx;
			font-weight: bold;
			color:rgb(113, 52, 24);
			p.help{
				font-size: 28rpx;
				font-weight: normal;
				color:#555555;
			}
		}
		div.item{
			margin:10rpx 30rpx;
			font-size: 30rpx;
			color:rgb(113, 52, 24);
		}
		div.selectedText{
			margin:0 30rpx;
			height:20vh;
			border:#cacaca 1rpx solid;
			overflow: auto;
			font-size: 20rpx;
		}
		.tool{
			padding:15rpx 30rpx;
			color:rgb(113, 52, 24);
			border-top:#cacaca .5rpx solid;
			font-size: 30rpx;
		}
		.bottomBar{
			height:30rpx;
		}
		.result{
			margin:0 30rpx;
			height:83%;
			overflow: auto;
		}
		.button {
			height: 40px;
			width: calc(100vw - 20px);
			text-align: center;
			margin-top: 15px;
			margin-left: 10px;
			margin-right: 10px;
			font-size: 16px;
			font-weight: bold;
			line-height: 38px;
			border-radius: 5px;
			color: #ffffff;
			background-color: rgb(234, 112, 52);
		}
	}
</style>
