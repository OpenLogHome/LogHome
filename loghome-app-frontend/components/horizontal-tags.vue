<template>
	<view class="horizontal-tags-container">
		<scroll-view scroll-x="true" class="tags-scroll" show-scrollbar="false">
			<view class="tags-wrapper">
				<view 
					v-for="tag in tags" 
					:key="tag.tag_id" 
					class="tag-item"
					:style="{ color: tag.tag_color }"
					@click="handleTagClick(tag)"
				>
					<image 
						v-if="tag.tag_icon" 
						:src="tag.tag_icon" 
						class="tag-icon"
						mode="aspectFit"
					></image>
					<text class="tag-name">{{ tag.tag_name }}</text>
					<text class="tag-arrow">
						<uni-icons type="right" size="14px" :color="tag.tag_color"></uni-icons>
					</text>
				</view>
				<div class="none" style="width: 25rpx; height: 25rpx; color: transparent">.</div>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import axios from 'axios'

export default {
	name: 'HorizontalTags',
	data() {
		return {
			tags: []
		};
	},
	mounted() {
		this.loadTags();
	},
	methods: {
		async loadTags() {
			try {
				const response = await axios.get(this.$baseUrl + '/library/get_index_tags');
				
				if (response.status === 200) {
					this.tags = response.data;
				} else {
					console.error('获取标签失败:', response);
				}
			} catch (error) {
				console.error('加载标签时出错:', error);
			}
		},
		
		handleTagClick(tag) {
			if (tag.jump_url) {
				// 判断是否为外部链接
				if (tag.jump_url.startsWith('http://') || tag.jump_url.startsWith('https://')) {
					// 外部链接，使用浏览器打开
					uni.navigateTo({
						url: '/pages/static/webview?url=' + encodeURIComponent(tag.jump_url)
					});
				} else {
					// 内部页面跳转
					uni.navigateTo({
						url: tag.jump_url
					});
				}
			}
		}
	}
};
</script>

<style scoped>
.horizontal-tags-container {
	width: 100%;
	padding: 10px 0 0 0;
}

.tags-scroll {
	width: 100%;
	white-space: nowrap;
}

.tags-wrapper {
	display: flex;
	flex-direction: row;
	padding: 0rpx 25rpx 0 25rpx;
	gap: 12px;
}

.tag-item {
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 8px 16px;
	background-color: #f8f9fa;
	border-radius: 20px;
	border: 1px solid #e9ecef;
	white-space: nowrap;
	flex-shrink: 0;
	transition: all 0.3s ease;
	color: #999999;
	font-size: 14px;
	font-weight: bold;
}

.tag-item:active {
	background-color: #e9ecef;
	transform: scale(0.98);
}

.tag-icon {
	width: 16px;
	height: 16px;
	margin-right: 6px;
	flex-shrink: 0;
}

.tag-name {
	font-size: 14px;
	margin-right: 4px;
	flex-shrink: 0;
}

.tag-arrow {
	font-size: 14px;
	font-weight: bold;
	opacity: 0.7;
	flex-shrink: 0;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
	.tag-item {
		background-color: #2d3748;
		border-color: #4a5568;
		color: #a0aec0;
	}
	
	.tag-item:active {
		background-color: #4a5568;
	}
}
</style>