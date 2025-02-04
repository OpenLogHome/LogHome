<template>
	<view class="edit_buttona">
		<view class="rm_img" @tap="del(mobileLocation)">
			<img src="../../static/del.png" class="imgup"></img>
		</view>
		<view class="top_img" @tap="top(mobileLocation)" v-if="mobileLocation!=0">
			<img src="../../static/up.png" class="imgup"></img>
		</view>
		<view class="top_img" @tap="bottom(mobileLocation)" v-show="mobileLocation != list.length && list.length >1">
			<img src="../../static/down.png" class="imgup"></img>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'btn-list',
		props: {
			list:{
				type: Array,
				default: () => {
					return []
				}
			},
			mobileLocation:{
				type:[Number,String],
				default:''
			},
			
		},
		data() {
			return {

			}
		},
		methods: {
			del(index) {
				this.$confirm('此操作不可撤销。', '是否确定删除段落？', {
					  confirmButtonText: '确定',
					  cancelButtonText: '取消',
					  type: 'warning'
					}).then(() => {
					  let mobileList = this.list[index]
					  this.list.splice(index, 1);
					  this.Emitt(mobileList,'del');
				}).catch(() => {
				})
			},
			/**
			 * @description  内容上移
			 * @param {Number} 上移第几项 
			 * */
			top(index) {
				if (index == 0) {
					uni.showToast({
						title: '已经是第一个了！',
						icon: 'none'
					})
					return
				}
				let mobileList = this.list[index]
				let arr = this.list
				this.list = this.swapArray(arr, index, index - 1);
				this.Emitt(mobileList,'top');
			},
			/**
			 * @description  内容下移
			 * @param {Number} 下移第几项 
			 * */
			bottom(index) {
				let mobileList = this.list[index]
				let arr = this.list
				if (index == arr.length - 1) {
					uni.showToast({
						title: '已经是最后一个了！',
						icon: 'none'
					})
					return
				}
				this.list = this.swapArray(arr, index, index + 1);
			},
			/**
			 * @description 回调方法
			 * */
			 Emitt(mobileList,type){
				 this.$emit('change',{
				 	list:this.list, //修改后的数组
				 	mobileList:mobileList ,//被移动或删除的数据
				 	type:type // 被移动还是删除
				 })
			 },
			/**
			 * @description 交换顺序
			 * */
			swapArray(arr, index1, index2) {
				arr[index1] = arr.splice(index2, 1, arr[index1])[0];
				return arr;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.edit_buttona {
		z-index: 99;
		position: absolute;
		right: 0;
		bottom: -14rpx;
		display: flex;
		align-items: center;

		.rm_img {
			background: #f3f3f3;
			color: #707070;
			border-radius: 20rpx;
			padding: 8upx 16upx;
			font-size: 28upx;
			opacity: 0.9;
			margin-right: 20rpx;
			margin-bottom: 20rpx;

			.imgup {
				width: 30rpx;
				height: 30rpx;
				padding: 10rpx;
			}
		}

		.top_img {
			background: #f3f3f3;
			color: #707070;
			border-radius: 20rpx;
			padding: 8upx 16upx;
			font-size: 28upx;
			opacity: 0.9;
			margin-right: 20rpx;
			margin-bottom: 20rpx;

			.imgup {
				width: 30rpx;
				height: 30rpx;
			}
		}
	}
</style>
