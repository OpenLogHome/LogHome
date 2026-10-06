<template>
  <div class="worldWrapper" v-dark>
    <div class="outer">
			<div class="portal" @click="createNewWorld">
				<div class="subtitle">共启创世之门</div>
				<div class="newWorld">点击创建一个全新的世界 → </div>
			</div>
		</div>
		<div class="nothing" v-show="worlds.length == 0"
			style="display:flex; flex-direction: column; align-items: center; justify-content: center; margin: 100rpx 0;">
			<img src="../static/loggirl-404-empty-chest.png" alt="" style="width: 220rpx; max-width: 50%; margin: 25rpx 0;"/>
			<div style="color:#777777; font-size: 25rpx;" :class="{'dark-mode': isDarkMode}">这里还什么都没有喔</div>
		</div>
		<div class="jiemian2" v-for="world in worlds" :key="world.world_id || world.novel_id" v-dark>
			<div class="hang1">
				<div class="biaoti">
					{{world.name}}
				</div>
			</div>
			<div class="hang2" style="margin: 5px 0;">
				<el-tag style="margin-right: 10px;" v-show="!world.is_personal">公开</el-tag>
				<el-tag type= "info" style="margin-right: 10px;" v-show="world.is_personal">私密</el-tag>
				<el-tag type="success" style="margin-right: 10px;" v-show="!world.is_personal && world.allow_fork">允许二创</el-tag>
				<el-tag type= "info" style="margin-right: 10px;" v-show="!world.allow_fork">不允许二创</el-tag>
				<el-tag type="warning" style="margin-right: 10px;" v-if="showCollaborativeTag(world)">协作作品</el-tag>
			</div>
			<div class="h2">
				{{world.content}}
			</div>
			<!-- <div class="articles" style="margin-top: 15px;">
				<div class="bn" v-for="i in [1,2,3,4]">
					<div class="y1">人物</div>
					<div class="z2">
						<div class="zh1">美食家AI</div>
						<div class="zh2">2030年，AI已经在多个领域大放异彩，无所不能，受到了人类的一致好评。在人类世界分为喜欢运aaaaaa</div>
					</div>
				</div>
			</div> -->
			<div class="enterButtons" style="display:flex; margin-top: 15rpx;">
				<div class="enterButton" @click="editWorld(world.novel_id, world.world_id)" style="margin-right: 15rpx;">{{ getEditButtonText(world) }}</div>
				<div class="enterButton" @click="enterWorld(world.world_id)" v-show="!world.is_personal">进入设定</div>
			</div>

		</div>
		<div class="bottom" style="height: 80px">
			
		</div>
		<view v-if="showCreateDialog" class="create-mask" :class="{ 'dark-mode': isDarkMode }" :style="maskStyle"
			@click.self="closeCreateDialog" @keydown.esc.stop.prevent="closeCreateDialog"
			@touchstart.stop @touchmove.stop @touchend.stop>
			<view class="create-panel" role="dialog" aria-modal="true" aria-labelledby="create-world-title" :aria-busy="String(creating)">
				<view class="create-header">
					<text id="create-world-title" class="create-title">创建世界</text>
					<button v-manga-a11y="creating" class="create-close" type="button" aria-label="关闭创建窗口" :disabled="creating" @click="closeCreateDialog"><manga-icon name="close" /></button>
				</view>
				<view class="create-field">
					<label class="field-label" for="new-world-name">世界名称</label>
					<input id="new-world-name" class="field-input" v-model="createForm.name" maxlength="50" :disabled="creating"
						placeholder="给你的世界起个名字" confirm-type="done" @confirm="createWorld" />
				</view>
				<view class="create-tip">创建后即可编辑世界简介、角色与其他设定。</view>
				<view class="create-actions">
					<button v-manga-a11y="creating" class="create-cancel" type="button" :disabled="creating" @click="closeCreateDialog">取消</button>
					<button v-manga-a11y="creating || !createForm.name.trim()" class="create-confirm" type="button" :disabled="creating || !createForm.name.trim()" @click="createWorld">{{ creating ? '创建中…' : '创建世界' }}</button>
				</view>
			</view>
		</view>
	</div>

</template>

<script>
	import axios from "axios";
	import darkModeMixin from '@/mixins/dark-mode.js';
	import MangaIcon from '@/components/manga-icon.vue';
	import MangaA11y from '@/common/manga-a11y.js';
	export default {
		components: { MangaIcon },
		directives: { mangaA11y: MangaA11y },
		mixins: [darkModeMixin],
		props: {
			activeIndex: { type: Number, default: 0 },
		},
		data() {
			return {
				worlds: [],
				showCreateDialog: false,
				creating: false,
				createForm: { name: '' },
			}
		},
		computed: {
			maskStyle() {
				// 滑动轨道的 transform 会成为 fixed 定位的包含块，与漫画弹窗保持一致。
				return { left: (this.activeIndex * 100) + 'vw', width: '100vw' };
			},
		},
		methods: {
			isWorldOwner(world) {
				return !!(world && (world.is_owner === true || world.access_role === 'owner' || !world.access_role));
			},
			showCollaborativeTag(world) {
				if (!world) return false;
				return (
					world.access_role === 'collaborator' ||
					world.is_collaborator === true ||
					Number(world.has_active_collaborators || 0) === 1
				);
			},
			getEditButtonText(world) {
				return this.isWorldOwner(world) ? '编辑设定' : '协作设定';
			},
			createNewWorld() {
				if (this.creating) return;
				this.createForm = { name: '' };
				this.showCreateDialog = true;
			},
			closeCreateDialog() {
				if (this.creating) return;
				this.showCreateDialog = false;
			},
			async createWorld() {
				const name = (this.createForm.name || '').trim();
				if (!name || this.creating) return;
				this.creating = true;
				try {
					const token = JSON.parse(window.localStorage.getItem('token'));
					if (!token || !token.tk) {
						uni.showToast({ title: '请先登录后再创建世界', icon: 'none' });
						return;
					}
					await axios.get(this.$baseUrl + '/world/create_world', {
						params: { world_name: name },
						headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token.tk },
					});
					this.showCreateDialog = false;
					uni.showToast({ title: '创建成功', icon: 'none', duration: 2000 });
					this.refreshPage();
				} catch (error) {
					uni.showToast({ title: '创建失败，请稍后重试', icon: 'none', duration: 2000 });
				} finally {
					this.creating = false;
				}
			},
			refreshPage(){
				let _this = this;
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;
				axios.get(this.$baseUrl + '/world/get_my_worlds', {
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}).then((res) => {
					_this.worlds = res.data;
					console.log(_this.worlds);
				}).catch(function(error) {
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				}).then(function() {
					uni.hideLoading();
				})
			},
			enterWorld(world_id){
				uni.navigateTo({
					url: "../pages/worlds/worldPage?id=" + world_id
				})
			},
			editWorld(uid,world_id) {
				uni.navigateTo({
					url: "../pages/writers/allArticles?id=" + uid + '&worldId=' + world_id
				})
			},
		},
		mounted(){
			this.refreshPage();
		}
	}
</script>

<style scoped lang="scss">
	@import '@/common/manga-theme.scss';

	.create-mask {
		@include manga-theme;
		position: fixed;
		top: 0;
		height: 100vh;
		z-index: 300;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		padding: calc(24rpx + var(--manga-safe-top)) 0 calc(24rpx + var(--manga-safe-bottom));
		background: rgba(7, 10, 12, .55);
	}
	.create-panel { width: min(86%, 640rpx); max-height: 100%; overflow-y: auto; box-sizing: border-box; padding: 32rpx; border-radius: 24rpx; background: var(--manga-card); color: var(--manga-text); box-shadow: 0 30rpx 90rpx rgba(0,0,0,.18); animation: world-panel-in .2s ease both; }
	.create-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18rpx; }
	.create-title { font-size: 31rpx; font-weight: 700; }
	.create-close { display: grid; place-items: center; width: 76rpx; height: 76rpx; flex: none; font-size: 26rpx; }
	.create-field { margin-bottom: 20rpx; }
	.field-label { display: block; margin-bottom: 9rpx; font-size: 23rpx; font-weight: 600; }
	.field-input { width: 100%; height: 84rpx; box-sizing: border-box; padding: 14rpx 18rpx; border: 1rpx solid var(--manga-line); border-radius: 12rpx; background: var(--manga-bg); color: var(--manga-text); font-size: 25rpx; }
	.field-input:focus { border-color: var(--manga-accent); outline: 2px solid var(--manga-accent); outline-offset: 2px; }
	.create-tip { margin: 2rpx 0 22rpx; color: var(--manga-muted); font-size: 21rpx; }
	.create-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16rpx; }
	.create-actions button { box-sizing: border-box; display: flex; align-items: center; justify-content: center; width: 100%; min-width: 0; min-height: 88rpx; margin: 0; padding: 0 12rpx; border-radius: 14rpx; font-size: 25rpx; font-weight: 600; line-height: 1.2; text-align: center; white-space: nowrap; }
	.create-cancel { border: 1rpx solid var(--manga-line); background: var(--manga-card); color: var(--manga-text); }
	.create-confirm { border: 1rpx solid transparent; background: var(--manga-action); color: #fff; }
	@keyframes world-panel-in { from { opacity: .5; transform: scale(.97); } to { opacity: 1; transform: scale(1); } }

	.worldWrapper {
		background-image: linear-gradient(to top, #f7f7f7, #f7f7f7, #fff2d0);
		box-sizing: border-box;
		min-height: 100vh;
		padding-top: calc(44px + var(--loghome-safe-top, 0px));
	
		&.dark-mode {
			background-image: none;
			background-color: var(--background-color-secondary);
		}
	}

	.outer {
		padding: 20px;
		padding-top: calc(10px);

		.portal {
			background-color: #bfa;
			height: 100px;
			margin-top: 15px;
			border-radius: 8px;
			background: url("@/static/worldPage/portalBackground.jpg");
			background-size: cover;
			background-position: right;
			display: flex;
			flex-direction: column;
			justify-content: center;

			.subtitle {
				margin-left: 25px;
				font-size: 20px;
				font-weight: bold;
				color: white;
				margin-bottom: 5px;
			}

			div.newWorld {
				margin-left: 25px;
				font-size: 14px;
				color: #ffffffee;
			}

		}
	}

	.tab {
		height: 70px;
		width: 100vw;
		background-color: #bfa;
		position: absolute;
		left: 0;
		bottom: 0;
		display: flex;
		justify-content: space-around;
		align-items: center;

		.btn {
			width: 50px;
			height: 50px;
			border: 1px solid black;
			background-color: aqua;
		}
	}

	.jiemian2 {
		padding: 20px 20px 10px 20px;
		background-color: rgb(254, 254, 254);
		margin: 0 auto;
		border-radius: 14px;
		width: calc(100vw - 140rpx);
		margin-bottom: 20px;
		
		.dark-mode & {
			background-color: var(--background-color-tertiary);
		}

		.hang1 {
			display: flex;
			justify-content: space-between;

			.biaoti {
				font-size: 24px;
				font-weight: bold;
				background-image: linear-gradient(to right, black, rgb(142, 78, 76));
				-webkit-background-clip: text;
				color: transparent;
				letter-spacing: -1px;
				
				.dark-mode & {
					background-image: linear-gradient(to right, #e5e5e5, rgb(192, 128, 126));
				}
			}

			.jinru {
				width: 85px;
				height: 28px;
				font-size: 14px;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 20px;
				border: 1.4px solid #4c4c4c55;
				margin-left: 30px;
				color: #575757;
				
				.dark-mode & {
					color: var(--text-color-regular);
					border-color: var(--border-color-lighter);
				}
			}

		}

		.h2 {
			letter-spacing: -1px;
			height: 40px;
			font-size: 15px;
			margin-top: 5px;
			color: #575757;
			//省略号
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
			
			.dark-mode & {
				color: var(--text-color-regular);
			}
		}


		.bn {
			width: 88vw;
			height: 60px;
			display: flex;
			margin-top: 0px;

			.y1 {
				background-color: rgb(91, 129, 252);
				width: 25px;
				height: 50px;
				font-size: 10px;
				color: white;
				display: flex;
				justify-content: center;
				line-height: 25px;
				writing-mode: vertical-lr;
			}

			.z2 {
				padding-left: 10px;
			}

			.zh1 {
				font-size: 32rpx;
				
				.dark-mode & {
					color: var(--text-color-primary);
				}
			}

			.zh2 {
				width: calc(100% - 20px);
				font-size: 28rpx;
				color: #575757;
				overflow: hidden;
				height: 35rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				margin-top: 3rpx;
				
				.dark-mode & {
					color: var(--text-color-regular);
				}
			}

			.t3 {
				height: 35px;
				width: 35px;
				background-color: rgb(237, 111, 114);
				border-radius: 100px;
				background-image: url("@/static/worldPage/info.png");
				background-size: cover;
				margin: 5px 0px 0px 30px;
			}
		}
		
		.enterButton{
			width: 100%;
			border: 1rpx solid #4c4c4c55;
			border-radius: 30rpx;
			height: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #4c4c4cee;
			margin: 10rpx 0;
			transition: all .3s;
			font-size: 26rpx;
			
			.dark-mode & {
				color: var(--text-color-regular);
				border-color: var(--border-color-lighter);
			}
		}
		
		.enterButton:active{
			transform: scale(0.95);
			background-color: #4c4c4c22;
			
			.dark-mode & {
				background-color: #6c6c6c22;
			}
		}


	}

	.jiemian2.dark-mode{
		background-color: #333333;
	}
</style>
