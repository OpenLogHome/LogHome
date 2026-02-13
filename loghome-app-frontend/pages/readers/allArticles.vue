<template>
	<view class="content" v-dark>
		<nothing :msg="'这本书还没有章节哦\n快去评论区催更~'" v-show="articles.length == 0"></nothing>
		<div class="articles">
			<div class="volume" v-for="(volume, vIndex) in volumeList" :key="vIndex">
				<div class="volume-header" @click="toggleVolume(vIndex)" v-if="volumeList.length > 1 || volume.title !== '正文'">
					<div class="volume-title">{{ volume.title }}</div>
					<uni-icons :type="volume.isExpanded ? 'bottom' : 'right'" size="16" color="#666"></uni-icons>
				</div>
				<div class="chapter-list" v-show="volume.isExpanded">
					<navigator v-for="item in volume.chapters" :key="item.article_id"
							   :url="'./newReader/article?id=' +  item.article_id"
							   open-type="navigate">  
						<div class="article">
							<div class="title">{{item.title}}</div>
						</div>
					</navigator>
				</div>
			</div>
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
			volumeList: []
		}
	},
	onLoad(option){
		uni.showLoading({
			title: '努力加载中'
		});
		if(JSON.stringify(option) == "{}"){
			uni.showToast({
				title: "undefined",
				icon:'none',
				duration: 2000
			});
			return;
		}
		const uid = option.id;
		axios.get(this.$baseUrl + '/library/get_articles?id=' + uid, {}).then((res) => {
			this.articles = res.data;
			this.processVolumes();
			console.log(this.articles)
			uni.setNavigationBarTitle({
				title:this.bookInfo.name
			});
		}).catch(function (error) {
			uni.showToast({
				title: error.toString(),
				icon:'none',
				duration: 2000
			});
		}).then(function(){
			uni.hideLoading();
		})
	},
	methods: {
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
					}
				}
			}
		}
		div.underBar{
			height: 150rpx
		}
	}
</style>
