<template>
	<view class="outer" v-dark>
		<view class="search-container">
			<uni-search-bar v-model="keyword" placeholder="搜索感兴趣的标签" @input="input" bgColor="#f5f5f5" radius="100" cancelButton="none"></uni-search-bar>
		</view>
		
		<view class="tabs">
			<view class="tab-item" :class="{active: currentFilter === 'all'}" @click="currentFilter = 'all'">全部</view>
			<view class="tab-item" :class="{active: currentFilter === 'activity'}" @click="currentFilter = 'activity'">活动</view>
			<view class="tab-item" :class="{active: currentFilter === 'suggested'}" @click="currentFilter = 'suggested'">官方</view>
		</view>

		<view class="tags">
			<div class="tag" v-for="(item,index) in filteredTags" :key="item.tag_id"
			:class="{'activity':item.is_activity_tag, 'suggested': item.is_suggested}"
			@click="gotoTagNovels(item.tag_id, item.tag_name)">
				<text class="tag-name">{{item.tag_name}}</text>
				<text class="tag-count">{{item.count}}</text>
			</div>
			<view v-if="filteredTags.length === 0" class="empty-state">
				<text>没有找到相关标签</text>
			</view>
		</view>
	</view>
</template>

<script>
	import axios from "axios"
	import uniSearchBar from '../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.vue'
	
	export default{
		components: {
			uniSearchBar
		},
		data(){
			return{
				tags: [],
				keyword: '',
				currentFilter: 'all'
			}
		},
		computed: {
			filteredTags() {
				let result = this.tags;
				
				// 搜索过滤
				if (this.keyword) {
					const lowerKeyword = this.keyword.toLowerCase();
					result = result.filter(tag => tag.tag_name.toLowerCase().includes(lowerKeyword));
				}
				
				// 类型过滤
				if (this.currentFilter === 'activity') {
					result = result.filter(tag => tag.is_activity_tag == 1);
				} else if (this.currentFilter === 'suggested') {
					result = result.filter(tag => tag.is_suggested == 1);
				}
				
				return result;
			}
		},
		methods:{
			getNovelTags(){
				let _this = this;
				axios.get(_this.$baseUrl + '/library/get_all_tags', {}).then((res) => {
					_this.tags = res.data;
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
				}).then(function(){})
			},
			gotoTagNovels(tag_id, tag_name){
				uni.navigateTo({
					url:"./tagCollections?tag_id=" + tag_id + "&title=" + tag_name
				})
			},
			input(e) {
				this.keyword = e;
			}
		},
		onLoad(params){
			this.getNovelTags();
		}
	}
</script>

<style scoped lang="scss">
	.outer{
		background-color: #ffffff;
		min-height: 100vh;
		
		&.dark-mode{
			background-color: #1E1E1E;
		}
	}

	.search-container {
		padding: 20rpx 30rpx 10rpx;
		background-color: #ffffff;
		
		.dark-mode & {
			background-color: #1E1E1E;
		}
	}

	.tabs {
		display: flex;
		padding: 20rpx 30rpx;
		background-color: #ffffff;
		border-bottom: 1px solid #f0f0f0;
		
		.dark-mode & {
			background-color: #1E1E1E;
			border-bottom-color: #333;
		}
		
		.tab-item {
			margin-right: 40rpx;
			font-size: 30rpx;
			color: #666;
			padding-bottom: 10rpx;
			position: relative;
			transition: all 0.3s;
			
			&.active {
				color: #ec8600;
				font-weight: bold;
				
				&:after {
					content: '';
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					width: 40rpx;
					height: 4rpx;
					background-color: #ec8600;
					border-radius: 4rpx;
				}
			}
			
			.dark-mode & {
				color: #999;
				
				&.active {
					color: #ec8600;
				}
			}
		}
	}

	.tags{
		display:flex;
		flex-wrap: wrap;
		padding: 30rpx;
		
		.tag{
			background-color: #f8f9fa;
			height:70rpx;
			line-height: 70rpx;
			padding:0 30rpx;
			border-radius: 35rpx;
			margin-right: 20rpx;
			margin-bottom: 20rpx;
			display:flex;
			align-items: center;
			transition: all 0.2s;
			border: 1px solid transparent;
			
			.tag-name {
				font-size: 28rpx;
				color:#333;
				margin-right: 10rpx;
			}
			
			.tag-count {
				font-size: 24rpx;
				color: #999;
			}
			
			&:active {
				transform: scale(0.96);
			}
		}
		
		.tag.activity{
			background-color: #fff7eb;
			border-color: #ffecd4;
			
			.tag-name {
				color: #ec8600;
			}
			
			.tag-count {
				color: #ffb55e;
			}
		}
		
		.tag.suggested{
			background-color: #f0f7ff;
			border-color: #dbeeff;
			
			.tag-name {
				color: #007aff;
			}
			
			.tag-count {
				color: #6eb5ff;
			}
		}
		
		.empty-state {
			width: 100%;
			text-align: center;
			padding: 100rpx 0;
			color: #999;
			font-size: 28rpx;
		}
	}
	
	.dark-mode {
		.tags {
			.tag {
				background-color: #2C2C2C;
				
				.tag-name {
					color: #ccc;
				}
				
				.tag-count {
					color: #666;
				}
				
				&.activity {
					background-color: rgba(236, 134, 0, 0.1);
					border-color: rgba(236, 134, 0, 0.2);
					
					.tag-name {
						color: #ec8600;
					}
				}
				
				&.suggested {
					background-color: rgba(0, 122, 255, 0.1);
					border-color: rgba(0, 122, 255, 0.2);
					
					.tag-name {
						color: #4da6ff;
					}
					
					.tag-count {
						color: #4da6ff;
						opacity: 0.7;
					}
				}
			}
		}
	}
</style>
