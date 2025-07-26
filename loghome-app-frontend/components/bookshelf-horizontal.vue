<template>
	<view class="bookshelf-horizontal" v-dark>
		<scroll-view class="book-scroll" scroll-x="true" show-scrollbar="false">
			<view class="book-list">
				<view 
					v-for="(book, index) in sortedBooks" 
					:key="book.novel_id || index"
					class="book-item"
					@click="readBook(book.novel_id)"
				>
					<view class="book-cover-container">
						<image 
							:src="book.picUrl" 
							class="book-cover"
							mode="aspectFill"
							@error="handleImageError"
						/>
						<!-- 更新标签 -->
						<view 
							v-if="book.updateInfo && book.updateInfo.has_updates" 
							class="update-badge"
						>
							<text class="update-text">更新{{ book.updateInfo.new_chapters_count }}章</text>
						</view>
					</view>
					<!-- <text class="book-title">{{ book.name }}</text> -->
				</view>
				<!-- 查看更多按钮 -->
				<view class="more-item" @click="gotoBookcase">
					<view class="more-cover">
						<text class="more-text">查看\n更多</text>
					</view>
					<!-- <text class="book-title">更多书籍</text> -->
				</view>
                <div class="none" style="width: 25rpx; height: 25rpx; color: transparent">.</div>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import axios from 'axios'
import { articleDB } from '../lib/db.js'

export default {
	name: 'BookshelfHorizontal',
	data() {
		return {
			likedBooks: [], // 收藏的书籍
			historyBooks: [], // 阅读历史
			sortedBooks: [], // 排序后的书籍
			isOffline: false,
			updateInfo: new Map() // 存储书籍更新信息
		}
	},
	mounted() {
		this.loadBooks()
	},
	methods: {
		// 加载书籍数据
		async loadBooks() {
			try {
                this.likedBooks = [];
                this.historyBooks = [];
                this.updateInfo = new Map();
                console.log("loadbooks");
				// 并行获取收藏书籍和阅读历史
				await Promise.all([
					this.getLikedBooks(),
					this.getHistoryBooks()
				])
				// 检查书籍更新
				await this.checkBooksUpdates()
				// 合并并排序书籍
				this.sortBooksByHistory()
			} catch (error) {
				console.error('加载书籍失败:', error)
			}
		},
		
		// 获取收藏的书籍
		getLikedBooks() {
			return new Promise((resolve, reject) => {
				let tk = JSON.parse(window.localStorage.getItem('token'))
				if (tk) tk = tk.tk
				
				axios.get(this.$baseUrl + '/bookcase/get_likes_of', {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': "Bearer " + tk
					}
				}).then((res) => {
					this.likedBooks = res.data || []
					// 缓存到本地
					window.localStorage.setItem("LogHomeLikedBooks", JSON.stringify(res.data))
					resolve()
				}).catch((error) => {
					console.log('获取收藏书籍失败:', error)
					if (error.message == "Request failed with status code 401") {
						window.localStorage.removeItem('token')
						// 可以触发登录跳转
					} else {
						// 获取本地缓存数据
						this.isOffline = true
						let localData = window.localStorage.getItem("LogHomeLikedBooks")
						if (localData) {
							this.likedBooks = JSON.parse(localData) || []
						}
					}
					resolve()
				})
			})
		},
		
		// 获取阅读历史
		getHistoryBooks() {
			return new Promise((resolve) => {
				let readerHistory = JSON.parse(window.localStorage.getItem("loghomeReaderHistory"))
				if (readerHistory != null) {
					// 从旧到新排序（reverse后变成从新到旧）
					readerHistory.reverse()
					this.historyBooks = readerHistory
				}
				resolve()
			})
		},
		
		// 检查书籍更新
		async checkBooksUpdates() {
			if (this.isOffline) return
			
			try {
				// 为每本收藏的书籍检查更新
				const updatePromises = this.likedBooks.map(async (book) => {
					try {
						// 从本地数据库获取该书籍的最新章节
						const localArticles = await articleDB.articles
							.where('novel_id')
							.equals(book.novel_id)
							.toArray()
						
						let localLatestChapter = 0
						if (localArticles.length > 0) {
							localLatestChapter = Math.max(...localArticles.map(a => a.article_chapter || 0))
						}
						
						// 调用后端API检查更新
						const response = await axios.get(this.$baseUrl + '/library/check_novel_updates', {
							params: {
								novel_id: book.novel_id,
								latest_chapter: localLatestChapter
							}
						})
						
						if (response.data && response.data.has_updates) {
							this.updateInfo.set(book.novel_id, {
								new_chapters_count: response.data.new_chapters_count,
								has_updates: true,
								latest_update_time: response.data.latest_update_time
							})
						}
					} catch (error) {
						console.error(`检查书籍 ${book.novel_id} 更新失败:`, error)
					}
				})
				
				await Promise.all(updatePromises)
			} catch (error) {
				console.error('检查书籍更新失败:', error)
			}
		},
		
		// 根据阅读历史排序书籍
		sortBooksByHistory() {
			let result = []
			
			// 创建历史书籍的映射，用于快速查找
			let historyMap = new Map()
			this.historyBooks.forEach((book, index) => {
				historyMap.set(book.novel_id, {
					...book,
					historyIndex: index // 历史顺序，越小越新
				})
			})
			
			// 先添加有阅读历史的收藏书籍，按历史顺序排序
			let booksWithHistory = []
			let booksWithoutHistory = []
			let booksWithUpdates = []
			
			this.likedBooks.forEach(book => {
				const updateInfo = this.updateInfo.get(book.novel_id)
				const bookWithInfo = {
					...book,
					updateInfo: updateInfo
				}
				
				// 如果有更新，优先排序
				if (updateInfo && updateInfo.has_updates) {
					booksWithUpdates.push(bookWithInfo)
				} else if (historyMap.has(book.novel_id)) {
					let historyBook = historyMap.get(book.novel_id)
					booksWithHistory.push({
						...bookWithInfo,
						historyIndex: historyBook.historyIndex
					})
				} else {
					booksWithoutHistory.push(bookWithInfo)
				}
			})
			
			// 按更新时间排序（更新时间越新排越前）
			booksWithUpdates.sort((a, b) => {
				const aTime = a.updateInfo?.latest_update_time ? new Date(a.updateInfo.latest_update_time) : new Date(0)
				const bTime = b.updateInfo?.latest_update_time ? new Date(b.updateInfo.latest_update_time) : new Date(0)
				return bTime - aTime
			})
			
			// 按历史顺序排序（historyIndex越小越靠前，即最近阅读的在最左侧）
			booksWithHistory.sort((a, b) => a.historyIndex - b.historyIndex)
			
			// 合并结果：有更新的在最前，然后是有历史的，最后是没历史的
			result = [...booksWithUpdates, ...booksWithHistory, ...booksWithoutHistory]
			
			// 限制显示数量，避免横向滚动过长
			this.sortedBooks = result.slice(0, 10)
            this.$forceUpdate();
		},
		
		// 阅读书籍
		async readBook(novel_id) {
			if (novel_id > 0) {
				if (this.isOffline) {
					// 离线模式处理
					let history = 0
					let readingHistory = window.localStorage.getItem("ReaderHistory_" + novel_id)
					if (readingHistory != null) {
						history = readingHistory
					}
					// 这里需要根据实际情况处理离线阅读
					uni.showToast({
						title: "离线模式，请检查网络",
						icon: 'none'
					})
				} else {
					uni.navigateTo({
						url: '/pages/readers/bookInfo?id=' + novel_id
					})
				}
			}
		},
		
		// 跳转到书架页面
		gotoBookcase() {
			uni.navigateTo({
				url: '/pages/bookcase/index'
			})
		},
		
		// 图片加载失败处理
		handleImageError(e) {
			console.log('图片加载失败:', e)
		}
	}
}
</script>

<style scoped lang="scss">
.bookshelf-horizontal {
	padding: 30rpx 0 0 25rpx;
	border-radius: 16rpx;
}

.section-header {
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333333;
	
	.dark-mode & {
		color: #ffffff;
	}
}

.book-scroll {
	width: 100%;
	height: 210rpx;
}

.book-list {
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	gap: 20rpx;
	padding-right: 20rpx;
}

.book-item, .more-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	flex-shrink: 0;
	width: 144rpx;
}

.book-cover-container {
	position: relative;
	width: 144rpx;
	height: 192rpx;
    transition: transform .5s;
}

.book-cover-container:active{
    transform: scale(0.95);
}

.book-cover {
	width: 100%;
	height: 100%;
	border-radius: 8rpx;
	background-color: #f5f5f5;
}

.update-badge {
	position: absolute;
	top: 0rpx;
	right: 0rpx;
	background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
	// border-radius: 12rpx;
	padding: 4rpx 8rpx;
	max-width: 144rpx;
	overflow: hidden;
}

.update-text {
	color: white;
	font-size: 20rpx;
	font-weight: 600;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.more-cover {
	width: 144rpx;
	height: 192rpx;
	border-radius: 8rpx;
	// background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    background-color: #b2b2b2;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
}

.more-text {
	color: #ffffff;
	font-size: 28rpx;
	font-weight: 600;
	text-align: center;
	line-height: 1.4;
}

.book-title {
	font-size: 24rpx;
	color: #666666;
	text-align: center;
	margin-top: 8rpx;
	max-width: 144rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	
	.dark-mode & {
		color: #cccccc;
	}
}

// 隐藏滚动条
::-webkit-scrollbar {
	display: none;
}
</style>