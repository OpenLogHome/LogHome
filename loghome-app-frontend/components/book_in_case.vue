<template>
	<div class="outer">
		<div class="book" :class="certShell ? 'cert-shell cert-shell-' + certShell : ''">
			<cert-emblem v-if="certShell" class="cert-emblem-slot" :variant="certShell" />
			<log-image :src="picUrl  + '?thumbnail=1' " alt="" :style="{display: picUrl=='' ? 'none' : 'block'}"
			onerror="onerror=null;src='https://s2.loli.net/2021/12/06/iTkPD6cudGrsEKR.png'"/>
			<text v-if="manga" class="manga-badge">{{ $t('library.bookInCase.badgeManga') }}</text>
			<text v-if="world" class="world-badge">{{ $t('library.bookInCase.badgeWorld') }}</text>
			<!-- 更新标签 -->
			<div 
				v-if="updateInfo && updateInfo.has_updates" 
				class="update-badge"
			>
				<text class="update-text">{{ $t('library.bookInCase.updateChapters', { count: updateInfo.new_chapters_count }) }}</text>
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
	import CertEmblem from './cert-emblem.vue'

	export default{
		components: {
			HaycraftMark,
			CertEmblem
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
			},
			certShell: {
				type: String,
				default: ""
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
		div.book.cert-shell{
			border: 4rpx solid var(--shell-edge);
			animation: cert-shell-pulse 2.8s ease-in-out infinite;
		}
		.cert-emblem-slot{
			position: absolute;
			top: -18rpx;
			left: -18rpx;
			z-index: 3;
		}
		@keyframes cert-shell-pulse {
			0%, 100% {
				box-shadow: 0 0 10rpx var(--shell-glow);
			}
			50% {
				box-shadow: 0 0 24rpx var(--shell-glow);
			}
		}
		.cert-shell-gold{
			--shell-edge: #d4a017;
			--shell-glow: rgba(255, 196, 64, 0.45);
		}
		.cert-shell-silver{
			--shell-edge: #9aa4ad;
			--shell-glow: rgba(190, 205, 220, 0.4);
		}
		.cert-shell-bronze{
			--shell-edge: #b06a2a;
			--shell-glow: rgba(220, 140, 60, 0.4);
		}
		.cert-shell-green{
			--shell-edge: #2f9e44;
			--shell-glow: rgba(80, 200, 120, 0.4);
		}
		.cert-shell-blue{
			--shell-edge: #2f7fd4;
			--shell-glow: rgba(80, 160, 255, 0.4);
		}
		.cert-shell-purple{
			--shell-edge: #7048e8;
			--shell-glow: rgba(150, 110, 255, 0.4);
		}
		.cert-shell-ender{
			--shell-edge: #8a5cf6;
			--shell-glow: rgba(160, 104, 255, 0.55);
		}
	}
</style>
