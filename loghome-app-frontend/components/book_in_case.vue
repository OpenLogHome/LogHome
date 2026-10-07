<template>
	<div class="outer">
		<div class="book">
			<log-image :src="picUrl  + '?thumbnail=1' " alt="" :style="{display: picUrl=='' ? 'none' : 'block'}"
			onerror="onerror=null;src='https://s2.loli.net/2021/12/06/iTkPD6cudGrsEKR.png'"/>
			<text v-if="manga" class="manga-badge">漫画</text>
			<text v-if="world" class="world-badge">世界</text>
			<!-- 更新标签 -->
			<div 
				v-if="updateInfo && updateInfo.has_updates" 
				class="update-badge"
			>
				<text class="update-text">更新{{ updateInfo.new_chapters_count }}章</text>
			</div>
		</div>
		<div :class="{nameTag:true, empty:bookName==''}" v-dark>
			<text>{{bookName}}</text>
			<haycraft-mark v-if="haycraft" size="small" />
		</div>
	</div>

</template>

<script>
	import HaycraftMark from './haycraft-mark.vue'

	export default{
		components: {
			HaycraftMark
		},
		props:{
			bookName:{
				type: String,
				default:""
			},
			picUrl:{
				type:String,
				default:""
			},
			updateInfo:{
				type: Object,
				default: null
			},
			haycraft: {
				type: Boolean,
				default: false
			},
			manga: {
				type: Boolean,
				default: false
			},
			world: {
				type: Boolean,
				default: false
			}
		}
	}
</script>

<style scoped lang="less">
	div.outer{
		margin:20rpx;
		margin-top:20rpx;
		div.book{
			height:240rpx;
			width:180rpx;
			background-color: #d3d3d3;
			margin-bottom:20rpx;
			border-radius: 7rpx;
			position: relative;
			img{
				height:100%;
				width:100%;
				border-radius: 7rpx;
			}

			.manga-badge {
				position: absolute;
				left: 8rpx;
				bottom: 8rpx;
				z-index: 1;
				padding: 2rpx 10rpx;
				border-radius: 7rpx;
				background: rgba(178, 64, 18, 0.94);
				color: #fff;
				font-size: 20rpx;
				font-weight: 600;
				line-height: 32rpx;
				pointer-events: none;
			}

			/* 世界书籍角标：与漫画角标同款布局，配色区分 */
			.world-badge {
				position: absolute;
				left: 8rpx;
				bottom: 8rpx;
				z-index: 1;
				padding: 2rpx 10rpx;
				border-radius: 7rpx;
				background: rgba(184, 134, 11, 0.94);
				color: #fff;
				font-size: 20rpx;
				font-weight: 600;
				line-height: 32rpx;
				pointer-events: none;
			}
			
			.update-badge {
				position: absolute;
				top: 0rpx;
				right: 0rpx;
				background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
				padding: 4rpx 8rpx;
				max-width: 180rpx;
				overflow: hidden;
				border-radius: 0 7rpx 0 12rpx;
			}
			
			.update-text {
				color: white;
				font-size: 20rpx;
				font-weight: 600;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
		}
		div.nameTag{
			width:180rpx;
			height:60rpx;
			overflow:hidden;
			text-align: center;
			color:#535353;
			line-height: 30rpx;
			font-size:28rpx !important;
			&.dark-mode{
				color:#E5E5E5;
			}
		}
		div.nameTag.empty{
			margin-bottom: 30rpx;
			height:30rpx;
			width:180rpx;
			background-color: #d3d3d3;
			border-radius: 7rpx;
		}
	}
</style>
