<template>
	<div class="outer">
		<div class="book">
			<log-image :src="picUrl  + '?thumbnail=1' " alt="" :style="{display: picUrl=='' ? 'none' : 'block'}"
			onerror="onerror=null;src='https://s2.loli.net/2021/12/06/iTkPD6cudGrsEKR.png'"/>
			<!-- 更新标签 -->
			<div 
				v-if="updateInfo && updateInfo.has_updates" 
				class="update-badge"
			>
				<text class="update-text">更新{{ updateInfo.new_chapters_count }}章</text>
			</div>
		</div>
		<div :class="{nameTag:true, empty:bookName==''}" v-dark>
			{{bookName}}
		</div>
	</div>

</template>

<script>
	export default{
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
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
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
