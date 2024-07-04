<template>
	<view>
		<view :style="{'height':soundState?'':0,bottom:markBottom}" class="mark"></view>
		<view @touchmove="touchmove" @touchstart="soundStart" @touchend="soundEnd" @touchcancel="soundEnd"
			class="sound-buttom" :class="{soundState}">
			<view v-if="soundProgress" class="sound-progress" :style="{'width':soundProgress}"></view>
			<text class="sound-text">{{soundState?'录音中（'+time+'s）':'按住 说话'}}</text>
			<view class="sound-tip" v-if="soundState">
				<text class="sound-tip-text" :style="{color:cancel?'#f70000':'#FFFFFF'}">{{cancel?'松手取消':'松手发送，上划取消'}}</text>
				<view class="closeIcon" :style="{'background-color':cancel?'#f70000':'#EEEEEE'}">
					<uni-im-icons code="e61a" size="10px" color="#FFFFFF"></uni-im-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// #ifndef H5
	const recorderManager = uni.getRecorderManager();
	// #endif

	import uniIm from '@/uni_modules/uni-im/lib/main.js';
	const systemInfo = uniIm.systemInfo

	let soundInterval,soundPath,startTime;
	export default {
		emits: ['success'],
		data() {
			return {
				soundState:0,
				soundProgress:0,
				cancel:false,
				time:0,
				phoneBH:0
			}
		},
		computed:{
			markBottom(){
				let markBottom = 58;
				// #ifdef MP-WEIXIN
				markBottom += (systemInfo.screenHeight - systemInfo.safeArea.bottom)
				// #endif
				return markBottom  + 'px'
			},
		},
		created() {
			// #ifndef H5
			recorderManager.onStop((res)=> {
				// console.log('recorderManager.onStop',{res});
				if(!this.cancel){
					if(this.time < 2){
						return uni.showToast({
							title: '语音时间过短',
							icon: 'none'
						});
					}
					uni.showLoading({
						title: '上传中',
						mask: false
					});
					uniCloud.uploadFile({
						filePath:res.tempFilePath,
						cloudPath:'uni-im/' + uniCloud.getCurrentUserInfo().uid + '/sound/' + Date.now() + '.mp3',
						// fileType:"audio",
						success: (e) => {
							console.log('uniCloud.uploadFile-success',e,'success',{"url":e.fileID,time:this.time});
							try{
								this.$emit('success',{"url":e.fileID,time:this.time})
							}catch(e){
								console.log(e);
								//TODO handle the exception
							}
							uni.hideLoading()
						},
						fail: (e) =>{
							console.log(e);
							uni.showModal({
								content: JSON.stringify(e),
								showCancel: false,
								confirmText: '知道了'
							});
						},
						complete: (e) =>{
							console.log('complete',e);
							uni.hideLoading()
						}
					})
				}else{
					console.log('用户取消了录音功能','this.time:'+this.time);
				}
			});
			
			recorderManager.onStart(e=>{
				// console.log(e);
			})
			recorderManager.onPause(e=>{
				// console.log(e);
			})
			recorderManager.onError(e=>{
				console.error(e);
			})
			// #endif
		},
		methods: {
			touchmove(e){
				// #ifndef APP-NVUE
				let y = e.touches[0].clientY + systemInfo.safeArea.top + (systemInfo.screenHeight - systemInfo.safeArea.bottom)
				// #endif
				// #ifdef APP-NVUE
				let y = e.touches[0].screenY
				// #endif
				
				
				if(systemInfo.safeArea.bottom - y > 58){
					this.cancel = true
				}else{
					this.cancel = false
				}
			},
			soundStart(e){
				// 关闭正在播放的sound
				uniIm.audioContext.stop()
				this.time = 0
				
				// #ifdef H5
				// 防止H5端 调试出现鼠标右键菜单
				window.oncontextmenu = function () { return false; }
				// #endif

				// #ifdef H5
				return uni.showToast({
					title: 'h5端不支持语音功能',
					icon: 'none'
				});
				// #endif

				// #ifndef H5
				recorderManager.start({
					sampleRate:16000,
					numberOfChannels:2,
					format:"mp3"
				});
				// #endif

				startTime = Date.now()

				console.log('soundStart');

				//进度条
				this.soundState = 1
				soundInterval = setInterval(()=>{
					this.soundProgress = parseInt(this.soundProgress) + uni.upx2px(450/60) +'px'
					// console.log('this.soundProgress',this.soundProgress);
					this.time = parseInt((Date.now() - startTime) / 1000)
				},1000)
				// e.preventDefault();
			},
			soundEnd(){
				// #ifndef H5
				recorderManager.stop();
				// #endif
				console.log('soundEnd');
				clearInterval(soundInterval)
				setTimeout(()=> {
					this.soundState = 0
					this.soundProgress = 0
					this.cancel = false
				}, 300);
			}
		}
	}
</script>

<style lang="scss">
	.sound-buttom {
		background-color: #ffffff;
		padding: 10px;
		width: 450rpx;
		height: 46px;
		// border-radius: 10px;
		font-size: 16px;
		align-items: flex-start;
		justify-content: center;
		/* #ifndef APP-NVUE */
		overflow:hidden;
		/* #endif */
	}
	.sound-text{
		position: relative;
		left: -20rpx;
		width: 450rpx;
		font-size: 14px;
		text-align: center;
	}
	.sound-tip{
		position: fixed;
		left: 0;
		bottom: 95px;
		width: 750rpx;
		text-align: center;
		justify-content: center;
		align-items: center;
	}
	.sound-tip-text{
		margin-bottom: 10px;
		color: #999999;
		font-size: 14px;
	}
	.closeIcon{
		width: 30px;
		height: 30px;
		background-color: #DDDDDD;
		border-radius: 100px;
		justify-content: center;
		align-items: center;
	}
	.sound-progress {
		// border-radius: 10px;
		height: 44px;
		position: absolute;
		left: 0;
		top: 0;
		padding: 0;
		transition: width 0.2s linear;
		background-color: #2faf4c;
		opacity: 0.3;
	}
	
	.soundState{
		background-color: #efefef;
	}
	
	.mark{
		width: 750rpx;
		position: fixed;
		top: 0;
		left: 0;
		bottom: 57px;
		right: 0;
		background:rgba(0,0,0,0.7);
		flex: 1;
	}
</style>
