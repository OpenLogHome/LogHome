<template>
	<view class="post-edit-container">
		<!-- 内容区域 -->
		<view class="content-area">
			<!-- 标题输入 -->
			<input
				class="title-input"
				v-model="postData.title"
				placeholder="标题（必填）"
				maxlength="50"
				@input="updateTitleCount"
			/>
			<text class="count-text">{{titleCount}}/50</text>
			
			<!-- 内容输入 -->
			<textarea
				class="content-input"
				v-model="postData.content"
				placeholder="分享你的想法..."
				maxlength="2000"
				@input="updateContentCount"
			/>
			<text class="count-text">{{contentCount}}/2000</text>
			
			<!-- 图片上传区域 -->
			<view class="image-upload-area">
				<view class="image-grid">
					<view 
						class="image-item" 
						v-for="(image, index) in postData.media_urls" 
						:key="index"
					>
						<log-image :src="image" mode="aspectFill"></log-image>
						<view class="delete-btn" @tap.stop="deleteImage(index)">
							<uni-icons type="closeempty" size="20" color="#fff"></uni-icons>
						</view>
					</view>
					<view 
						class="upload-btn" 
						v-if="postData.media_urls.length < 9"
						@tap="chooseImage"
					>
						<uni-icons type="plusempty" size="30" color="#999"></uni-icons>
					</view>
				</view>
			</view>
			
			<!-- 选择圈子 -->
			<view class="circle-selector" @tap="showCirclePopup">
				<text class="label">发布到</text>
				<text class="selected-circle" v-if="selectedCircle">{{selectedCircle.name}}</text>
				<text class="placeholder" v-else>选择圈子</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
		</view>
		
		<!-- 圈子选择弹窗 -->
		<uni-popup ref="circlePopup" type="bottom">
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">选择圈子</text>
					<view class="close-btn" @tap="hideCirclePopup">
						<uni-icons type="closeempty" size="24" color="#999"></uni-icons>
					</view>
				</view>
				<scroll-view scroll-y class="circle-list">
					<view 
						class="circle-item"
						v-for="(circle, index) in circles"
						:key="index"
						@tap="selectCircle(circle)"
					>
						<log-image class="circle-icon" :src="circle.icon" mode="aspectFill"></log-image>
						<view class="circle-info">
							<text class="circle-name">{{circle.name}}</text>
							<text class="circle-desc">{{circle.member_count}}人</text>
						</view>
						<uni-icons 
							:type="selectedCircle && selectedCircle.circle_id === circle.circle_id ? 'checkbox-filled' : 'circle'"
							size="20"
							:color="selectedCircle && selectedCircle.circle_id === circle.circle_id ? '#EA7034' : '#999'"
						></uni-icons>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import axios from 'axios'

	export default {
		data() {
			return {
				postData: {
					title: '',
					content: '',
					media_urls: [],
					circle_id: ''
				},
				titleCount: 0,
				contentCount: 0,
				circles: [],
				selectedCircle: null,
				isSubmitting: false
			}
		},
		onLoad() {
			this.loadCircles()
		},
		onNavigationBarButtonTap() {
			this.submitPost()
		},
		methods: {
			async loadCircles() {
				try {
					const token = JSON.parse(window.localStorage.getItem('token')).tk
					const res = await axios.get(this.$baseUrl + '/community/circles/my-circles', {
						headers: {
							'Authorization': 'Bearer ' + token
						}
					})
					this.circles = res.data
				} catch (error) {
					console.error('加载圈子失败', error)
					uni.showToast({
						title: '加载圈子失败',
						icon: 'none'
					})
				}
			},
			updateTitleCount(e) {
				this.titleCount = this.postData.title.length
			},
			updateContentCount(e) {
				this.contentCount = this.postData.content.length
			},
			async chooseImage() {
				try {
					const res = await uni.chooseImage({
						count: 9 - this.postData.media_urls.length,
						sizeType: ['compressed'],
						sourceType: ['album', 'camera']
					})
					
					for (let tempFile of res.tempFilePaths) {
						const token = JSON.parse(window.localStorage.getItem('token')).tk
						const uploadRes = await uni.uploadFile({
							url: this.$baseUrl + '/upload/image',
							filePath: tempFile,
							name: 'file',
							header: {
								'Authorization': 'Bearer ' + token
							}
						})
						
						const data = JSON.parse(uploadRes.data)
						if (data.url) {
							this.postData.media_urls.push(data.url)
						}
					}
				} catch (error) {
					console.error('上传图片失败', error)
					uni.showToast({
						title: '上传图片失败',
						icon: 'none'
					})
				}
			},
			deleteImage(index) {
				this.postData.media_urls.splice(index, 1)
			},
			showCirclePopup() {
				this.$refs.circlePopup.open()
			},
			hideCirclePopup() {
				this.$refs.circlePopup.close()
			},
			selectCircle(circle) {
				this.selectedCircle = circle
				this.postData.circle_id = circle.circle_id
				this.hideCirclePopup()
			},
			async submitPost() {
				if (this.isSubmitting) return
				
				if (!this.postData.title.trim()) {
					uni.showToast({
						title: '请输入标题',
						icon: 'none'
					})
					return
				}
				
				if (!this.postData.content.trim()) {
					uni.showToast({
						title: '请输入内容',
						icon: 'none'
					})
					return
				}
				
				if (!this.postData.circle_id) {
					uni.showToast({
						title: '请选择圈子',
						icon: 'none'
					})
					return
				}
				
				this.isSubmitting = true
				
				try {
					const token = JSON.parse(window.localStorage.getItem('token')).tk
					const res = await axios.post(this.$baseUrl + '/community/posts/create', {
						circle_id: this.postData.circle_id,
						title: this.postData.title.trim(),
						content: this.postData.content.trim(),
						type: 0,
						media_urls: this.postData.media_urls
					}, {
						headers: {
							'Authorization': 'Bearer ' + token
						}
					})
					
					uni.showToast({
						title: res.data.status === 1 ? '发布成功' : '提交成功，等待审核',
						icon: 'none'
					})
					
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				} catch (error) {
					console.error('发布失败', error)
					uni.showToast({
						title: '发布失败，请重试',
						icon: 'none'
					})
				} finally {
					this.isSubmitting = false
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.post-edit-container {
		min-height: 100vh;
		background-color: #fff;
		padding: 30rpx;
	}

	.content-area {
		padding-bottom: 100rpx;
	}

	.title-input {
		font-size: 32rpx;
		font-weight: bold;
		padding: 20rpx 0;
		width: 100%;
	}

	.content-input {
		font-size: 28rpx;
		line-height: 1.6;
		padding: 20rpx 0;
		width: 100%;
		height: 300rpx;
	}

	.count-text {
		font-size: 24rpx;
		color: #999;
		text-align: right;
		display: block;
		margin-top: 10rpx;
	}

	.image-upload-area {
		margin: 30rpx 0;
	}

	.image-grid {
		display: flex;
		flex-wrap: wrap;
		margin: -10rpx;
	}

	.image-item, .upload-btn {
		width: calc(33.33% - 20rpx);
		height: 200rpx;
		margin: 10rpx;
		border-radius: 8rpx;
		overflow: hidden;
		position: relative;
	}

	.image-item log-image {
		width: 100%;
		height: 100%;
	}

	.delete-btn {
		position: absolute;
		top: 10rpx;
		right: 10rpx;
		width: 40rpx;
		height: 40rpx;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.upload-btn {
		background-color: #f8f8f8;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 2rpx dashed #ddd;
	}

	.circle-selector {
		display: flex;
		align-items: center;
		padding: 30rpx 0;
		border-top: 1rpx solid #f0f0f0;
	}

	.label {
		font-size: 28rpx;
		color: #333;
		margin-right: 20rpx;
	}

	.selected-circle {
		font-size: 28rpx;
		color: #EA7034;
		flex: 1;
	}

	.placeholder {
		font-size: 28rpx;
		color: #999;
		flex: 1;
	}

	.popup-content {
		background-color: #fff;
		border-radius: 20rpx 20rpx 0 0;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.popup-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.close-btn {
		padding: 10rpx;
	}

	.circle-list {
		max-height: 60vh;
	}

	.circle-item {
		display: flex;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.circle-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.circle-info {
		flex: 1;
	}

	.circle-name {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 6rpx;
	}

	.circle-desc {
		font-size: 24rpx;
		color: #999;
	}
</style>