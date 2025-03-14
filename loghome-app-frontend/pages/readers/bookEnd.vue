<template>
	<view class="outer">
		<div class="container">
			<div class="end-mark">{{bookInfo.is_complete ? '已完结，感谢陪伴' : '尚未完结 · 敬请期待'}}</div>

			<div class="action-buttons">
				<button class="btn comment-btn" @click="navtoComment">
					写个书评
				</button>
				<button class="btn subscribe-btn" @click="toggleSubscribe">
					{{isInBookcase ? '已收藏' : '收藏作品'}}
				</button>
				<!-- 		            <button class="btn rate-btn" onclick="rateNovel()">
		                <i class="fas fa-star"></i>评分
		            </button> -->
			</div>
<!-- 			<div class="rate">
				<div>如果可以，打个分吧？</div>
				<el-rate v-model="rate" @change="handleRateChange"></el-rate>
				<el-button  class="rate-btn" type="primary" size="small" v-show="showRateConfirmButton">确认</el-button>
			</div> -->

			<div class="message">
				作者没跑路！只是鸽了！<br>
				<!-- 当前收藏人数：<span id="subscribers">1</span> -->
			</div>

			<div class="navigation">
				<button class="nav-btn" @click="goToCatalog">
					<i class="fas fa-arrow-left"></i>返回详情
				</button>
			</div>
		</div>

		<!-- 将推荐部分移到 container 外 -->
		<div class="recommend-container">
			<div class="recommend-section">
				<div class="section-title">
					<h3>猜你喜欢</h3>
				</div>
				<div class="recommend-books">
					<div v-for="(book, index) in recommendBooks" :key="index" class="book-item" @click="readBook(book.novel_id)">
						<log-image :src="book.picUrl + '?thumbnail=1'" :onerror="`onerror=null;src='`+ $backupResources.bookCover +`'`" />
						<div class="book-info">
							<div class="book-title">{{book.name}}</div>
							<div class="book-author">
								<log-image :src="book.avatar_url" class="author-avatar" onerror="onerror=null;src='../static/user/defaultAvatar.jpg'"/>
								<span>{{book.user_name}}</span>
							</div>
							<div class="book-desc">{{book.content}}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	import axios from 'axios'
	
	export default {
		data() {
			return {
				rate: null,
				showRateConfirmButton: false,
				novelId: null,
				recommendBooks: [],
				isInBookcase: false,
				bookInfo: {
					is_complete: false,
					name: '',
					author_name: '',
					content: ''
				}
			}
		},
		methods: {
			handleRateChange(newRate) {
				this.showRateConfirmButton = true;
			},
			goToCatalog() {
				// 跳转到书籍详情页
				uni.redirectTo({
					url: `/pages/readers/bookInfo?id=${this.novelId}`
				});
			},
			readBook(novel_id) {
				if(novel_id > 0) {
					uni.navigateTo({
						url:'./bookInfo?id=' + novel_id
					})
				}
			},
			// 获取推荐书籍
			async getRecommendBooks() {
				try {
					const res = await axios.get(this.$baseUrl + '/library/recommand/get_library_recommend_titles?title=原木力飙升&page=1&amount=4')
					this.recommendBooks = res.data
				} catch (error) {
					uni.showToast({
						title: '获取推荐书籍失败',
						icon: 'none',
						duration: 2000
					})
				}
			},
			// 跳转到评论页面
			navtoComment() {
				uni.navigateTo({
					url: `/pages/readers/bookComment?id=${this.novelId}`
				})
			},
			// 切换收藏状态
			async toggleSubscribe() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (!tk) {
					uni.navigateTo({
						url: '../users/login'
					});
					return;
				}
				tk = tk.tk;
				
				if (!this.isInBookcase) {
					this.addToBookcase();
				} else {
					this.removeFromBookcase();
				}
			},
			// 添加到书架
			async addToBookcase() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (!tk) return;
				tk = tk.tk;
				
				try {
					await axios.post(this.$baseUrl + '/bookcase/like_novel', 
						{ novel_id: Number(this.novelId) },
						{
							headers: {
								'Content-Type': 'application/json',
								'Authorization': 'Bearer ' + tk
							}
						}
					);
					uni.showToast({
						title: "收藏成功",
						icon: 'success',
						duration: 2000
					});
					this.isInBookcase = true;
				} catch (error) {
					if (error.message === "Request failed with status code 401") {
						window.localStorage.removeItem('token');
						uni.navigateTo({
							url: '../users/login'
						});
					} else {
						uni.showToast({
							title: "收藏失败",
							icon: 'none',
							duration: 2000
						});
					}
				}
			},
			// 从书架移除
			async removeFromBookcase() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (!tk) return;
				tk = tk.tk;
				
				uni.showModal({
					title: '提示',
					content: '确定取消收藏吗？',
					cancelText: "取消",
					confirmText: "确认",
					showCancel: true,
					confirmColor: '#f59037',
					cancelColor: '#343434',
					success: async (res) => {
						if (res.confirm) {
							try {
								await axios.post(this.$baseUrl + '/bookcase/remove_like_novel',
									{ novel_id: this.novelId },
									{
										headers: {
											'Content-Type': 'application/json',
											'Authorization': 'Bearer ' + tk
										}
									}
								);
								uni.showToast({
									title: "已从书架移除",
									icon: 'success',
									duration: 2000
								});
								this.isInBookcase = false;
							} catch (error) {
								if (error.message === "Request failed with status code 401") {
									window.localStorage.removeItem('token');
									uni.navigateTo({
										url: '../users/login'
									});
								} else {
									uni.showToast({
										title: "移除失败",
										icon: 'none',
										duration: 2000
									});
								}
							}
						}
					}
				});
			},
			// 检查是否已收藏
			async checkBookcaseStatus() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (!tk) return;
				tk = tk.tk;
				
				try {
					const res = await axios.get(this.$baseUrl + '/bookcase/get_likes_of', {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': tk
						}
					});
					
					this.isInBookcase = res.data.some(item => item.novel_id == this.novelId);
				} catch (error) {
					if (error.message === "Request failed with status code 401") {
						window.localStorage.removeItem('token');
					}
				}
			},
			// 获取小说信息
			async getNovelInfo() {
				try {
					const res = await axios.get(this.$baseUrl + '/library/get_novel_by_id?id=' + this.novelId);
					if (res.data && res.data[0]) {
						this.bookInfo = res.data[0];
					}
				} catch (error) {
					uni.showToast({
						title: '获取小说信息失败',
						icon: 'none',
						duration: 2000
					});
				}
			}
		},
		onLoad(option) {
			// 获取路由参数中的 novelId
			if (option.novelId) {
				this.novelId = option.novelId;
				this.getNovelInfo(); // 获取小说信息
				this.getRecommendBooks();
				this.checkBookcaseStatus();
			} else {
				uni.showToast({
					title: '获取小说ID失败',
					icon: 'none',
					duration: 2000
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.outer {
		font-family: 'Microsoft Yahei', sans-serif;
		background: #f8f9fa;
		padding: 40rpx 30rpx;
		line-height: 1.6;
		min-height: 100vh;
		box-sizing: border-box;

		.container {
			max-width: 600px;
			margin: 0 auto;
			background: white;
			padding: 40px;
			border-radius: 16px;
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
		}

		.end-mark {
			text-align: center;
			font-size: 28px;
			font-weight: 600;
			color: #2c3e50;
			margin: 30px 0 40px;
			padding: 20px 0;
			border-bottom: 1px dashed #e9ecef;
			
			&.complete {
				color: #20bf6b;
			}
		}

		.action-buttons {
			display: flex;
			text-align: center;
			justify-content: center;
			margin: 40px 0;
			flex-wrap: wrap;
			gap: 20px;

			.btn {
				flex: 0 1 240rpx;
				padding: 24rpx 40rpx;
				border: none;
				border-radius: 50rpx;
				font-size: 32rpx;
				cursor: pointer;
				transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				display: flex;
				align-items: center;
				justify-content: center;
				color: white;
				font-weight: 500;
				box-shadow: 0 4px 12px rgba(0,0,0,0.1);

				&:active {
					transform: translateY(2px);
					box-shadow: 0 2px 6px rgba(0,0,0,0.1);
				}
			}

			.comment-btn {
				background: linear-gradient(135deg, #ff6b6b, #ff4757);
				
				&:active {
					background: linear-gradient(135deg, #ff5b5b, #ff3747);
				}
			}

			.subscribe-btn {
				background: linear-gradient(135deg, #20bf6b, #2ed573);
				
				&:active {
					background: linear-gradient(135deg, #10af5b, #1ec563);
				}
			}
		}
		
		.message {
			text-align: center;
			color: #6c757d;
			margin: 30px 0;
			font-size: 28rpx;
			letter-spacing: 1px;
		}

		.navigation {
			margin-top: 40px;
			display: flex;
			justify-content: center;

			.nav-btn {
				padding: 20rpx 40rpx;
				border: none;
				background: #f8f9fa;
				border-radius: 40rpx;
				cursor: pointer;
				font-size: 28rpx;
				color: #495057;
				display: flex;
				align-items: center;
				gap: 12rpx;
				transition: all 0.3s ease;
				box-shadow: 0 2px 8px rgba(0,0,0,0.05);

				i {
					font-size: 24rpx;
				}

				&:hover {
					background: #f1f3f5;
					color: #212529;
				}

				&:active {
					transform: translateY(1px);
					box-shadow: 0 1px 4px rgba(0,0,0,0.05);
				}
			}
		}

		.recommend-container {
			max-width: 800px;
			margin: 40px auto 0;
			padding: 0 20px;

			.recommend-section {
				.section-title {
					margin-bottom: 30px;
					text-align: center;
					
					h3 {
						font-size: 32rpx;
						color: #2c3e50;
						margin: 0;
						padding: 0;
						font-weight: 600;
						position: relative;
						display: inline-block;

						&:after {
							content: '';
							position: absolute;
							bottom: -10rpx;
							left: 50%;
							transform: translateX(-50%);
							width: 40rpx;
							height: 4rpx;
							background: linear-gradient(90deg, #ff6b6b, #ff4757);
							border-radius: 2rpx;
						}
					}
				}

				.recommend-books {
					.book-item {
						display: flex;
						margin-bottom: 30rpx;
						padding: 20px;
						background: white;
						border-radius: 12px;
						cursor: pointer;
						transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
						box-shadow: 0 2px 8px rgba(0,0,0,0.06);

						&:last-child {
							margin-bottom: 0;
						}

						&:hover {
							transform: translateY(-2px);
							box-shadow: 0 6px 16px rgba(0,0,0,0.1);
						}

						img {
							width: 100px;
							height: 140px;
							border-radius: 8px;
							object-fit: cover;
							box-shadow: 0 2px 6px rgba(0,0,0,0.1);
						}

						.book-info {
							flex: 1;
							margin-left: 20px;
							overflow: hidden;

							.book-title {
								font-size: 32rpx;
								font-weight: 600;
								color: #2c3e50;
								margin-bottom: 12px;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}

							.book-author {
								display: flex;
								align-items: center;
								margin-bottom: 12px;
								font-size: 26rpx;
								color: #495057;

								.author-avatar {
									width: 36rpx;
									height: 36rpx;
									border-radius: 50%;
									margin-right: 12rpx;
									box-shadow: 0 2px 4px rgba(0,0,0,0.1);
								}
							}

							.book-desc {
								font-size: 26rpx;
								color: #6c757d;
								line-height: 1.6;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 2;
								-webkit-box-orient: vertical;
							}
						}
					}
				}
			}
		}
	}
</style>