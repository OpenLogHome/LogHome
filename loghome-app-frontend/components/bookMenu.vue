<template>
	<div class="outer">
		<div class="articles">
			<div class="volume" v-for="(volume, vIndex) in volumeList" :key="vIndex">
				<div class="volume-header" @click="toggleVolume(vIndex)" v-if="volumeList.length > 1 || volume.title !== '正文'">
					<div class="volume-title">{{ volume.title }}</div>
					<uni-icons :type="volume.isExpanded ? 'bottom' : 'right'" size="16" color="#dddddd"></uni-icons>
				</div>
				<div class="chapter-list" v-show="volume.isExpanded">
					<navigator v-for="(item, idx) in volume.chapters" :key="item.article_id"
							   :url="'./newReader/article?id=' +  item.article_id"
							   open-type="redirect" @click="$emit('change', item.originalIndex)">  
						<div class="article" :key="item.article_id" :id="'chapter-' + item.originalIndex" :class="{'current': item.originalIndex === currentIdx}">
							<div class="title">{{item.title}}</div>
						</div>
					</navigator>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from "axios"
	export default{
		data(){
			return{
				uid:0,
				bookInfo:{},
				articles:[],
				volumeList: []
			}
		},
		props:['novel_id', 'currentIdx'],
		mounted(){
			uni.showLoading({
				title: '努力加载中'
			});
			const uid = this.novel_id;
			axios.get(this.$baseUrl + '/library/get_articles?id=' + uid, {}).then((res) => {
				this.articles = res.data;
				this.processVolumes();
				console.log(this.articles)
				this.$nextTick(() => {
					this.scrollToCurrent();
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

				this.articles.forEach((item, index) => {
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
						item.originalIndex = index;
						currentVolume.chapters.push(item);
					}
				});
				if (currentVolume.chapters.length > 0 || hasSpliters) {
					volumes.push(currentVolume);
				} else if (volumes.length === 0) {
					volumes.push(currentVolume);
				}

				this.volumeList = volumes;
				
				// Ensure the volume containing the current chapter is expanded
				if (this.currentIdx !== undefined) {
					this.volumeList.forEach(volume => {
						const hasCurrent = volume.chapters.some(ch => ch.originalIndex === this.currentIdx);
						if (hasCurrent) {
							volume.isExpanded = true;
						}
					});
				}
			},
			toggleVolume(index) {
				this.volumeList[index].isExpanded = !this.volumeList[index].isExpanded;
				this.$forceUpdate();
			},
			scrollToCurrent() {
				if (this.currentIdx !== undefined) {
					const targetId = 'chapter-' + this.currentIdx;
					const element = document.getElementById(targetId);
					if (element) {
						element.scrollIntoView({ behavior: 'auto', block: 'center' });
					}
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.articles{
		width:100%;
		background-color: #000a;
		color: #dddddd;
		
		.volume-header {
			padding: 20rpx 35rpx;
			background-color: rgba(255, 255, 255, 0.1);
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: #cacaca 1rpx solid;
			
			.volume-title {
				font-size: 30rpx;
				font-weight: bold;
				color: #ffffff;
			}
		}

		.article{
			padding-left:35rpx;
			border-bottom: #cacaca 1rpx solid;
			background-color: transparent;
			
			&.current {
				background-color: rgba(255, 255, 255, 0.2);
				.title {
					color: #ffd700;
					font-weight: bold;
				}
			}

			.title{
				background-color: transparent;
				font-size: 35rpx;
				color:white;
				line-height: 100rpx;
			}
		}
		
	}
</style>
