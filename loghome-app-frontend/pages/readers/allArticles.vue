<template>
	<view class="content" v-dark>
		<div class="articles-skeleton" v-if="isLoading" aria-label="章节加载中">
			<div class="skeleton-volume-header">
				<div class="skeleton-block skeleton-volume-title"></div>
			</div>
			<div class="skeleton-chapter" v-for="index in 8" :key="index">
				<div class="skeleton-block skeleton-chapter-title" :class="`skeleton-width-${index % 3}`"></div>
			</div>
		</div>
		<nothing :msg="'这本书还没有章节哦\n快去评论区催更~'" v-else-if="articles.length == 0"></nothing>
		<div class="articles" ref="articlesContainer" v-else>
			<div class="volume" v-for="(volume, vIndex) in volumeList" :key="vIndex">
				<div class="volume-header" @click="toggleVolume(vIndex)" v-if="volumeList.length > 1 || volume.title !== '正文'">
					<div class="volume-title">{{ volume.title }}</div>
					<uni-icons :type="volume.isExpanded ? 'bottom' : 'right'" size="16" color="#666"></uni-icons>
				</div>
				<div class="chapter-list" v-show="volume.isExpanded">
					<navigator v-for="item in volume.chapters" :key="item.article_id"
							   :url="getReaderUrl(item.article_id)"
							   open-type="navigate">  
						<div class="article" :class="{'is-last-read': item.article_chapter === lastReadChapter}" :data-chapter="item.article_chapter">
							<div class="title">{{item.title}}</div>
							<div class="last-read-tag" v-if="item.article_chapter === lastReadChapter">阅读到这里</div>
						</div>
					</navigator>
				</div>
			</div>
		</div>
		<div class="jump-button" v-if="lastReadChapter && !isLastReadVisible" @click="scrollToLastRead">
			<uni-icons type="bottom" size="16" color="#ffffff"></uni-icons>
			<span>跳转到阅读进度</span>
		</div>
	</view>
</template>

<script>
import axios from 'axios'
import nothing from '../../components/nothing.vue'
import darkModeMixin from '@/mixins/dark-mode.js'
export default{
	components:{
		nothing
	},
	mixins: [darkModeMixin],
	data(){
		return{
			uid:0,
			bookInfo:{},
			articles:[],
			volumeList: [],
			lastReadChapter: null,
			isLastReadVisible: true,
			isLoading: true
		}
	},
	onLoad(option){
		if(JSON.stringify(option) == "{}"){
			this.isLoading = false;
			uni.showToast({
				title: "undefined",
				icon:'none',
				duration: 2000
			});
			return;
		}
		this.uid = option.id;
		this.lastReadChapter = Number(window.localStorage.getItem("ReaderHistory_" + this.uid));
		axios.get(this.$baseUrl + '/library/get_articles?id=' + this.uid, {}).then((res) => {
			this.articles = res.data;
			this.processVolumes();
			console.log(this.articles)
			uni.setNavigationBarTitle({
				title:this.bookInfo.name
			});
			this.$nextTick(() => {
				this.checkLastReadVisibility();
			});
		}).catch(function (error) {
			uni.showToast({
				title: error.toString(),
				icon:'none',
				duration: 2000
			});
		}).then(() => {
			this.isLoading = false;
		})
	},
	onPageScroll(e) {
		this.checkLastReadVisibility();
	},
	methods: {
		getReaderUrl(articleId) {
			const readerProps = window.localStorage.getItem("readerProps");
			const isPageReader = readerProps !== "text";
			let url = isPageReader
				? `/pages/readers/newReader/article?id=${articleId}`
				: `/pages/readers/article_rich?id=${articleId}`;
			if (this.uid) {
				url += `&novelId=${this.uid}`;
			}
			return url;
		},
		checkLastReadVisibility() {
			if (!this.lastReadChapter) {
				this.isLastReadVisible = true;
				return;
			}
			const targetEl = document.querySelector(`.article[data-chapter="${this.lastReadChapter}"]`);
			if (!targetEl) {
				this.isLastReadVisible = false;
				return;
			}
			const rect = targetEl.getBoundingClientRect();
			const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
			this.isLastReadVisible = rect.top >= 0 && rect.bottom <= viewportHeight;
		},
		scrollToLastRead() {
			if (!this.lastReadChapter) return;
			const targetEl = document.querySelector(`.article[data-chapter="${this.lastReadChapter}"]`);
			if (targetEl) {
				targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		},
		processVolumes() {
			let volumes = [];
			let currentVolume = {
				title: '正文',
				isExpanded: true,
				chapters: []
			};
			let hasSpliters = false;

			this.articles.forEach(item => {
				if (item.article_type === 'spliter') {
					if (currentVolume.chapters.length > 0 || hasSpliters) {
						volumes.push(currentVolume);
					}
					currentVolume = {
						title: item.title,
						isExpanded: true,
						chapters: []
					};
					hasSpliters = true;
				} else {
					currentVolume.chapters.push(item);
				}
			});
			// Push the last volume if it has chapters or if it's a spliter volume (even empty)
			if (currentVolume.chapters.length > 0 || hasSpliters) {
				volumes.push(currentVolume);
			} else if (volumes.length === 0) {
				// Handle empty case or just default volume
				volumes.push(currentVolume);
			}

			this.volumeList = volumes;
		},
		toggleVolume(index) {
			this.volumeList[index].isExpanded = !this.volumeList[index].isExpanded;
			this.$forceUpdate(); // Ensure view updates
		}
	}
}
</script>

<style scoped lang="less">
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex-flow: wrap;
		background-color: #ffffff;
		width:100vw;
		min-height: 100vh;
		
		&.dark-mode {
			background-color: var(--background-color-secondary);
		}
		
		.articles{
			width:100%;
			
			.volume {
				width: 100%;
				
				.volume-header {
					padding: 20rpx 35rpx;
					background-color: #f8f8f8;
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-bottom: 1rpx solid #eeeeee;
					
					.volume-title {
						font-size: 30rpx;
						font-weight: bold;
						color: #666666;
					}
					
					.dark-mode & {
						background-color: #333333;
						border-bottom: 1rpx solid #444444;
						
						.volume-title {
							color: #aaaaaa;
						}
					}
				}
				
				.chapter-list {
					.article{
						padding-left:35rpx;
						border-bottom: #eeeeee 1rpx solid;
						background-color: #ffffff;
						position: relative;
						
						.dark-mode & {
							border-bottom: #444 1rpx solid;
							background-color: var(--background-color-secondary);
						}
						
						.title{
							font-size: 35rpx;
							font-weight: normal;
							color: #333333;
							line-height: 100rpx;
							
							.dark-mode & {
								color: var(--text-color-primary);
							}
						}
						
						.last-read-tag{
							position: absolute;
							right: 35rpx;
							top: 50%;
							transform: translateY(-50%);
							font-size: 22rpx;
							color: #ff6600;
							background-color: #fff3e6;
							padding: 6rpx 16rpx;
							border-radius: 20rpx;
							
							.dark-mode & {
								color: #ffaa55;
								background-color: #3d2a1a;
							}
						}
						
						&.is-last-read{
							background-color: #fff8f0;
							
							.dark-mode & {
								background-color: #2d2218;
							}
						}
					}
				}
			}
		}

		.articles-skeleton {
			width: 100%;
			background-color: #ffffff;

			.skeleton-volume-header {
				height: 80rpx;
				padding: 0 35rpx;
				display: flex;
				align-items: center;
				background-color: #f8f8f8;
				border-bottom: 1rpx solid #eeeeee;
			}

			.skeleton-chapter {
				height: 100rpx;
				padding: 0 35rpx;
				display: flex;
				align-items: center;
				border-bottom: 1rpx solid #eeeeee;
				box-sizing: border-box;
			}

			.skeleton-block {
				position: relative;
				overflow: hidden;
				border-radius: 8rpx;
				background-color: #eeeeee;

				&::after {
					content: '';
					position: absolute;
					top: 0;
					left: -100%;
					width: 100%;
					height: 100%;
					background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.75), transparent);
					animation: skeleton-shimmer 1.4s ease-in-out infinite;
				}
			}

			.skeleton-volume-title {
				width: 180rpx;
				height: 28rpx;
			}

			.skeleton-chapter-title {
				width: 62%;
				height: 32rpx;
			}

			.skeleton-width-0 { width: 48%; }
			.skeleton-width-1 { width: 72%; }

			.dark-mode & {
				background-color: var(--background-color-secondary);

				.skeleton-volume-header,
				.skeleton-chapter {
					border-bottom-color: #444444;
				}

				.skeleton-volume-header {
					background-color: #333333;
				}

				.skeleton-block {
					background-color: #444444;

					&::after {
						background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
					}
				}
			}
		}
		div.underBar{
			height: 150rpx
		}
	}

	@keyframes skeleton-shimmer {
		100% {
			left: 100%;
		}
	}
	.jump-button{
		position: fixed;
		bottom: 150rpx;
		right: 30rpx;
		background-color: #ff6600;
		color: #ffffff;
		padding: 16rpx 24rpx;
		border-radius: 40rpx;
		font-size: 26rpx;
		display: flex;
		align-items: center;
		gap: 8rpx;
		box-shadow: 0 4rpx 12rpx rgba(255, 102, 0, 0.4);
		z-index: 100;
		
		.dark-mode & {
			background-color: #ff8533;
			box-shadow: 0 4rpx 12rpx rgba(255, 133, 51, 0.4);
		}
	}
</style>
