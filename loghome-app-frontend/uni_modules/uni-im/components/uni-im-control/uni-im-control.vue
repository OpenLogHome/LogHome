<template>
	<view v-if="isShow">
		<view class="uni-im-control-mark" @touchstart="closeMe" @click="closeMe">
		</view>
		<view class="control" :style="{top:data.top,left:data.left,right:data.right}">
			<template v-if="data.msg.type == 'text'">
				<view class="control-item" @click="copyText">
					<!-- <uni-icons custom-prefix="uni-im-font" type="uni-im-copy" size="16" color="#FFF"></uni-icons> -->
					<text class="control-item-text">复制</text>
				</view>
				<view class="control-item" @click="answer">
					<!-- #ifdef H5 -->
					<!-- <uni-icons type="undo" size="18" color="#FFF"></uni-icons> -->
					<!-- #endif -->
					<text class="control-item-text">回复</text>
				</view>
				<view class="control-item" @click="revokeMsg" v-if="canRevoke()">
					<!-- #ifdef H5 -->
					<!-- <uni-icons type="undo" size="18" color="#FFF"></uni-icons> -->
					<!-- #endif -->
					<text class="control-item-text">撤回</text>
				</view>
			</template>
			<view class="control-item" @click="deleteMsg">
				<!-- <uni-icons custom-prefix="uni-im-font" type="uni-im-delete" size="16" color="#FFF"></uni-icons> -->
				<text class="control-item-text">删除</text>
			</view>
<!-- 			<view class="control-item" @click="other">
				<!-- <uni-icons custom-prefix="uni-im-font" type="uni-im-share" size="16" color="#FFF"></uni-icons> -->
<!-- 				<text class="control-item-text">转发</text>
			</view> -->
		</view>
		<!-- #ifdef APP-NVUE -->
		<view class="icon-box" :class="{isInTop:data.isInTop}" :style="{top:data.top}">
			<view class="icon" :style="{right:iconBoxRight,left:iconBoxLeft}"></view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import uniIm from '@/uni_modules/uni-im/lib/main.js';
	let fn;
	export default {
		// #ifdef APP-NVUE
		beforeCreate() {
			// const domModule = uni.requireNativePlugin('dom')
			// domModule.addRule('fontFace', {
			// 	'fontFamily': "uni-im-font",
			// 	'src': "url('https://at.alicdn.com/t/c/font_3726059_lz2adc1jfve.ttf')"
			// });
		},
		// #endif
		data(){
			return {
				isShow:false,
				data: {
					top:'',
					left:'',
					right:'',
					width:'',
					msg:{},
					isInTop:false
				}
			}
		},
		computed: {
			iconBoxLeft(){
				let n = parseInt(this.data.left)
				return n ? n*3/2+55+'px' : ''
			},
			iconBoxRight(){
				let n = parseInt(this.data.right)
				return n ? n*3/2+50+'px' : ''
			}
		},
		watch: {
			isShow(isShow) {
				// #ifdef H5
				// 当蒙版弹出，鼠标右键就关闭uni-im-control
				window.addEventListener('contextmenu', (e)=>{
					if(fn){
						fn(e)
					}
				})
				if(isShow){
					setTimeout(()=> {
						fn = (e)=> {
							if(this.isShow){
								if(uniIm.isWidescreen){
									this.isShow = false
								}
								e.preventDefault()
							}
						}
					}, 0);
				}else{
					fn = false
				}
				// #endif
			}
		},
		mounted() {
			// console.log('this.isShow',this.isShow);
		},
		methods:{
			show(data){
				this.data = data
				this.isShow = true
			},
			copyText(){
				// console.log('setClipboardData');
				console.log('this.data',this.data);
				uni.setClipboardData({
					data:this.data.msg.body,
					complete:(e)=> {
						uni.hideToast()
						console.log(e);
						this.isShow = false
					}
				})
			},
			canRevoke() {
				let current_uid = uniCloud.getCurrentUserInfo().uid
				let {group_id,from_uid,conversation_id,create_time} = this.data.msg || {}
				// console.log('create_time',create_time);
				// console.log('from_uid current_uid',this.data.msg,from_uid,current_uid);
				
				// 判断是不是群主
				let isGroupAdmin = false
				if(group_id){
					let conversation = uniIm.conversation.dataList.find(i=>i.id == conversation_id)
					isGroupAdmin = conversation.group_info.user_id == current_uid
				}
				
				// console.log('isGroupAdmin',isGroupAdmin);
				
				//如果是群主
				if(isGroupAdmin){
					return true
				}else{
					// 消息发送者为“当前用户”，且时间小于2分钟
					return from_uid == current_uid && ( Date.now() - create_time < 1000*60*2 )
				}
			},
			async revokeMsg(){
				// 再判断一遍防止，分钟在2分钟的时候右键了，然后到了第3分钟才点下的情况
				if(this.canRevoke()){
					await uniIm.conversation.revokeMsg(this.data.msg)
				}else{
					uni.showToast({
						title: '已超过2分钟，不能撤回',
						icon: 'none'
					});
				}
				this.isShow = false
				// console.log('this.data.msg',this.data.msg);
			},
			async answer(){
				// console.log('answer')
				this.$emit('answer',this.data.msgIndex)
				this.isShow = false
			},
			async deleteMsg(){
				// #ifndef H5
				return this.other()
				// #endif
				this.data.msg.is_delete = true
				// 存到本地
				let conversation = await uniIm.conversation.get(this.data.msg.conversation_id)
				conversation.msgManager.localMsg.update(this.data.msg.unique_id,this.data.msg)
				this.isShow = false
			},
			other(){
				uni.showToast({
					title: '暂不支持',
					icon: 'none',
					complete: () => {
						this.isShow = false
					}
				});
			},
			closeMe(){
				setTimeout(()=>{
					this.isShow = false
					// console.log('closeMe');
				},300)
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* #ifndef APP-NVUE */
	view {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}
	/* #endif */
	.control{
		background-color:#252a30;
		height: 55px;
		// width: 375rpx;
		position:fixed;
		top:0;
		border-radius: 5px;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		/* #ifndef APP-NVUE */
		z-index: 9999;
		/* #endif */
	}
	.control-item{
		width: 100rpx;
		justify-content: center;
		align-items: center;
	}
	.control-item-text{
		font-size: 12px;
		color:#FFFFFF;
		margin-top: 1px;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}
	/* #ifdef H5 */
	.control-item-text:hover{
		color:#4CD964;
	}
	/* #endif */
	.uni-im-control-mark{
		position: fixed;
		top: 0;
		left: 0;
		width: 750rpx;
		flex: 1;
		height: 9000px;
		
		/* #ifndef APP-NVUE */
		width: 100vw !important;
		height: 100vh !important;
		z-index: 9999;
		/* #endif */
		
		/* #ifdef H5 */
		max-height:100vh !important;
		max-width:100vw !important;
		/* #endif */
		background-color: rgba(0,0,0,0.1);
	}
	
	/* #ifdef H5 */
	@media screen and (min-width:960px){
		.uni-im-control-mark{
			background-color: rgba(255,255,255,0.05);
		}
	}
	/* #endif */
	
	.icon-box{
		width: 750rpx;
		height: 20px;
		position: fixed;
		transform:translate(0,-10px);
		justify-content: center;
		align-items: center;
		/* #ifndef APP-NVUE */
		z-index: 9999;
		/* #endif */
	}
	.icon{
		position: absolute;
		background-color: #252a30;
		width: 10px;
		height: 10px;
		transform: rotate(45deg);
	}
	.isInTop{
		transform:translate(0,45px);
	}
</style>