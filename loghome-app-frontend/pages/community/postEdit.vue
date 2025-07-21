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
			
			<!-- 绑定作品 -->
			<view class="book-selector" @tap="showBookPopup">
				<text class="label">绑定作品（可选）</text>
				<text class="selected-book" v-if="selectedBook">{{selectedBook.name}}</text>
				<text class="placeholder" v-else>选择作品</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<!-- 如果已选择作品，显示作品卡片 -->
			<view class="selected-book-card" v-if="selectedBook">
				<view class="book-card">
					<log-image class="book-cover" :src="selectedBook.picUrl" mode="aspectFill" 
						:onerror="`onerror=null;src='`+ $backupResources.bookCover +`'`"></log-image>
					<view class="book-info">
						<text class="book-name">{{selectedBook.name}}</text>
						<text class="book-author">{{selectedBook.author_name}}</text>
						<text class="book-desc">{{selectedBook.content && selectedBook.content.length > 50 ? selectedBook.content.substr(0, 50) + '...' : selectedBook.content}}</text>
					</view>
					<view class="remove-book" @tap.stop="removeBook">
						<uni-icons type="trash" size="20" color="#999"></uni-icons>
					</view>
				</view>
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
		
		<!-- 作品选择抽屉 -->
		<el-drawer 
			:visible.sync="bookSelectDrawer" 
			:with-header="false" 
			:direction="'btt'" 
			size="80%"
			class="book-select-drawer"
			custom-class="book-select-wrapper"
			modal-class="book-select-overlay">
			<div class="searchBar" style="position:absolute; background-color: #ffe6b4; width:100%; z-index:100;">
				<uni-search-bar bgColor="#ffffff" :radius="0" @input="searchLibrary" placeholder="搜索我的作品"
					cancelButton="none">
					<img src="../../static/icons/icon_search.png" alt="" slot="searchIcon" style="height:25px;width:25px;"/>
					<img src="../../static/icons/icon_r_x.png" alt="" slot="clearIcon" style="height:20px;width:20px;"/>
				</uni-search-bar>
			</div>
			<div style="height:52px; width:100%;"></div>
			<view v-for="item in searchBooks" :key="item.novel_id" @click="selectBook(item)">
				<div class="books" style="margin:20rpx;">
					<log-image :src="item.picUrl + '?thumbnail=1'" alt=""
						:onerror="`onerror=null;src='`+ $backupResources.bookCover +`'`"/>
					<div class="bookInfo">
						<div class="book-title">{{item.name}}</div>
						<view class="author">
							<log-image :src="item.avatar_url || item.auther_avatar" alt="" class="auther_avatar"
								onerror="onerror=null;src='../../static/user/defaultAvatar.jpg'"/>
							<div class="auther_name">{{item.user_name || item.author_name}}</div>
						</view>
						<div class="description">{{item.content}}</div>
					</div>
				</div>
			</view>
		</el-drawer>
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
					circle_id: '',
					novel_id: null // 添加novel_id字段保存绑定的作品ID
				},
				titleCount: 0,
				contentCount: 0,
				circles: [],
				selectedCircle: null,
				selectedBook: null, // 添加selectedBook用于保存选中的作品
				isSubmitting: false,
				isBanned: false, // 是否被禁言
				banInfo: null, // 禁言信息
				isEdit: false, // 是否为编辑模式
				postId: null, // 帖子ID
				bookSelectDrawer: false, // 是否显示作品选择抽屉
				searchBooks: [], // 搜索到的作品
				timer: undefined
			}
		},
		onLoad(options) {
			if (options.circle_id) {
				this.postData.circle_id = Number(options.circle_id);
				this.checkCircleBanStatus(options.circle_id);
			}
			if (options.post_id) {
				this.isEdit = true;
				this.postId = options.post_id;
				this.loadPostDetail(options.post_id);
			}
			this.loadCircles();
			this.loadMyNovels(); // 加载用户的作品
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
					if(this.postData.circle_id != "") {
						for(let circle of this.circles) {
							if(circle.circle_id == this.postData.circle_id) {
								this.selectCircle(circle);
							}
						}
					}
				} catch (error) {
					console.error('加载圈子失败', error)
					uni.showToast({
						title: '加载圈子失败',
						icon: 'none'
					})
				}
			},
			// 加载用户的作品
			async loadMyNovels() {
				try {
					const token = JSON.parse(window.localStorage.getItem('token')).tk
					const res = await axios.get(this.$baseUrl + '/essays/get_novels_of', {
						headers: {
							'Authorization': 'Bearer ' + token
						}
					})
					this.searchBooks = res.data
				} catch (error) {
					console.error('加载作品失败', error)
					uni.showToast({
						title: '加载作品失败',
						icon: 'none'
					})
				}
			},
			// 搜索作品
			searchLibrary(e) {
				clearTimeout(this.timer);
				let _this = this;
				this.timer = setTimeout(() => {
					if (e == "") {
						this.loadMyNovels();
					} else {
						axios.get(_this.$baseUrl + '/library/get_novels_search?keyword=' + e, {}).then((res) => {
							_this.searchBooks = res.data;
						}).catch(function(error) {
							uni.showToast({
								title: error.toString(),
								icon: 'none',
								duration: 2000
							});
						}).then(function() {
							uni.hideLoading();
						})
					}
				}, 500)
			},
			// 显示作品选择抽屉
			showBookPopup() {
				this.bookSelectDrawer = true
			},
			// 选择作品
			selectBook(book) {
				this.selectedBook = book;
				this.postData.novel_id = book.novel_id;
				this.bookSelectDrawer = false;
			},
			// 移除绑定的作品
			removeBook() {
				this.selectedBook = null;
				this.postData.novel_id = null;
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

					console.log(res);
					
					uni.showLoading({ title: '正在上传图片...' })
					
					for (let tempFile of res[1].tempFilePaths) {
						const uploadRes = await this.uploadFile(tempFile)
						this.postData.media_urls.push(uploadRes.url)
					}
					
					uni.hideLoading()
				} catch (error) {
					uni.hideLoading()
					console.error('上传图片失败', error)
					uni.showToast({
						title: '上传图片失败',
						icon: 'none'
					})
				}
			},
			async uploadFile(filePath) {
				return new Promise((resolve, reject) => {
					uni.showToast({
						title: "图片上传中",
						icon: 'loading',
						duration: 2000
					});
					uni.uploadFile({
						url: 'https://storage.codesocean.top/api/resource/upload?container=172018735018984',
						filePath: filePath,
						name: 'file',
						header: {
							ServiceKey: "a24785bedb466b9733dd317771d4b69c08da07fd"
						},
						success: (uploadRes) => {
							try {
								const data = JSON.parse(uploadRes.data);
								resolve({
									url: "https://storage.codesocean.top/api/resource/get/" + data.data.resource_id
								});
							} catch (e) {
								reject(e);
							}
						},
						fail: (error) => {
							reject(error);
						}
					});
				});
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
			// 检查用户在圈子中的禁言状态
			async checkCircleBanStatus(circleId) {
				try {
					const token = JSON.parse(window.localStorage.getItem('token')).tk;
					const res = await axios.get(this.$baseUrl + `/community/circles/${circleId}/my-status`, {
						headers: {
							'Authorization': 'Bearer ' + token
						}
					});
					
					if (res.data) {
						this.isBanned = res.data.is_banned;
						this.banInfo = res.data.ban_info;
						
						// 如果被禁言，显示提示
						if (this.isBanned) {
							const endTimeText = this.banInfo.end_time ? 
								`，将于 ${this.formatBanEndTime(this.banInfo.end_time)} 解除` : 
								'，永久禁言';
								
							uni.showModal({
								title: '禁言提示',
								content: `您在该圈子中已被禁言${endTimeText}，无法发布帖子`,
								showCancel: false,
								success: () => {
									uni.navigateBack();
								}
							});
						}
					}
				} catch (error) {
					console.error('获取禁言状态失败', error);
				}
			},
			
			// 格式化禁言结束时间
			formatBanEndTime(time) {
				if (!time) return '永久';
				return new Date(time).toLocaleString();
			},
			
			selectCircle(circle) {
				this.selectedCircle = circle;
				this.postData.circle_id = circle.circle_id;
				this.hideCirclePopup();
				
				// 检查选择的圈子的禁言状态
				this.checkCircleBanStatus(circle.circle_id);
			},

			async loadPostDetail(postId) {
				try {
					const res = await axios.get(this.$baseUrl + '/community/posts/detail/' + postId);
					const post = res.data;
					this.postData.title = post.title;
					this.postData.content = post.content;
					this.postData.media_urls = post.media_urls || [];
					this.postData.circle_id = post.circle_id;
					this.postData.novel_id = post.novel_id || null;
					this.selectedCircle = this.circles.find(c => c.circle_id == post.circle_id) || null;
					this.titleCount = post.title.length;
					this.contentCount = post.content.length;
					
					// 加载绑定的作品信息
					if (post.novel_id) {
						try {
							const novelRes = await axios.get(this.$baseUrl + '/library/get_novel_by_id?id=' + post.novel_id);
							if (novelRes.data && novelRes.data.length > 0) {
								this.selectedBook = novelRes.data[0];
							}
						} catch (error) {
							console.error('获取作品信息失败', error);
						}
					}
				} catch (error) {
					uni.showToast({ title: '加载帖子失败', icon: 'none' });
				}
			},
			
			async submitPost() {
				if (this.isSubmitting) return
				if (!this.postData.title.trim()) {
					uni.showToast({ title: '请输入标题', icon: 'none' })
					return
				}
				if (!this.postData.content.trim()) {
					uni.showToast({ title: '请输入内容', icon: 'none' })
					return
				}
				if (!this.postData.circle_id) {
					uni.showToast({ title: '请选择圈子', icon: 'none' })
					return
				}
				if (this.isBanned) {
					const endTimeText = this.banInfo && this.banInfo.end_time ? `，将于 ${this.formatBanEndTime(this.banInfo.end_time)} 解除` : '，永久禁言';
					uni.showModal({ title: '禁言提示', content: `您在该圈子中已被禁言${endTimeText}，无法发布帖子`, showCancel: false });
					return;
				}
				this.isSubmitting = true
				try {
					const token = JSON.parse(window.localStorage.getItem('token')).tk
					let res;
					if (this.isEdit && this.postId) {
						// 编辑模式
						res = await axios.put(this.$baseUrl + `/community/posts/${this.postId}`, {
							title: this.postData.title.trim(),
							content: this.postData.content.trim(),
							media_urls: this.postData.media_urls,
							novel_id: this.postData.novel_id // 添加作品ID
						}, {
							headers: { 'Authorization': 'Bearer ' + token }
						});
					} else {
						res = await axios.post(this.$baseUrl + '/community/posts/create', {
							circle_id: this.postData.circle_id,
							title: this.postData.title.trim(),
							content: this.postData.content.trim(),
							type: 0,
							media_urls: this.postData.media_urls,
							novel_id: this.postData.novel_id // 添加作品ID
						}, {
							headers: {
								'Authorization': 'Bearer ' + token
							}
						})
					}
					uni.showToast({
						title: res.data.status === 1 ? (this.isEdit ? '编辑成功' : '发布成功') : '提交成功，等待审核',
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				} catch (error) {
					console.error('发布失败', error)
					uni.showToast({ title: this.isEdit ? '编辑失败，请重试' : '发布失败，请重试', icon: 'none' })
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

	.circle-selector, .book-selector {
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

	.selected-circle, .selected-book {
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
	
	/* 作品卡片样式 */
	.selected-book-card {
		margin: 20rpx 0;
		background-color: #f9f9f9;
		border-radius: 8rpx;
		padding: 15rpx;
	}
	
	.book-card {
		display: flex;
		position: relative;
	}
	
	.book-cover {
		width: 140rpx;
		height: 200rpx;
		border-radius: 6rpx;
		margin-right: 20rpx;
	}
	
	.book-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		overflow: hidden;
	}
	
	.book-name {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}
	
	.book-author {
		font-size: 24rpx;
		color: #666;
		margin-bottom: 10rpx;
	}
	
	.book-desc {
		font-size: 24rpx;
		color: #999;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	
	.remove-book {
		position: absolute;
		top: 10rpx;
		right: 10rpx;
		padding: 10rpx;
	}
	
	/* 书籍列表样式 */
	.books {
		height: 260rpx;
		width: calc(100vw - 65rpx);
		margin: 0 30rpx;
		display: flex;
		background-color: rgb(255, 255, 255);
		border-radius: 10rpx;
		
		log-image {
			height: 260rpx;
			width: 200rpx;
			border-radius: 10rpx 0 0 10rpx;
			margin: 0rpx;
			flex-shrink: 0;
		}
		
		.bookInfo {
			margin-left: 30rpx;
			margin-top: 22rpx;
			
			.book-title {
				font-size: 34rpx;
				height: 42rpx;
				margin-bottom: 10rpx;
				overflow: hidden;
				display: -webkit-box;
				font-weight: bold;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				color: rgb(45, 45, 45);
				margin: 5rpx;
			}
			
			.author {
				position: relative;
				margin-top: 15rpx;
				margin-bottom: 10rpx;
				display: flex;
				
				.auther_avatar {
					position: absolute;
					top: 0rpx;
					left: 5rpx;
					height: 35rpx;
					width: 35rpx;
					border-radius: 5rpx;
				}
				
				.auther_name {
					font-size: 25rpx;
					color: rgb(45, 45, 45);
					overflow: hidden;
					margin-left: 45rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
				}
			}
			
			.description {
				font-size: 25rpx;
				color: rgb(142, 130, 109);
				margin: 5rpx 0;
				overflow: hidden;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 3;
			}
		}
	}
</style>