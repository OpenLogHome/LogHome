<template>
  <div class="worldWrapper" v-dark>
    <div class="outer">
			<div class="title">
			</div>
			<div class="portal" @click="createNewWorld">
				<div class="subtitle">共启创世之门</div>
				<div class="newWorld">点击创建一个全新的世界 → </div>
			</div>
		</div>
		<div class="nothing" v-show="worlds.length == 0"
			style="display:flex; flex-direction: column; align-items: center; justify-content: center; margin: 100rpx 0;">
			<img src="../static/nothing.png" alt="" style="width: 15vw; margin: 25rpx 0;"/>
			<div style="color:#777777; font-size: 25rpx;" :class="{'dark-mode': isDarkMode}">这是一片什么都没有的荒原</div>
		</div>
		<div class="jiemian2" v-for="world in worlds" v-dark>
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
				<div class="enterButton" @click="editWorld(world.novel_id, world.world_id)" style="margin-right: 15rpx;">编辑设定</div>
				<div class="enterButton" @click="enterWorld(world.world_id)" v-show="!world.is_personal">进入设定</div>
			</div>

		</div>
		<div class="bottom" style="height: 80px">
			
		</div>
	</div>

</template>

<script>
	import axios from "axios";
	import darkModeMixin from '@/mixins/dark-mode.js';
	export default {
		mixins: [darkModeMixin],
		data() {
			return {
				worlds: [],
			}
		},
		methods: {
			createNewWorld() {
				let _this = this;
				uni.showModal({
					title: '创建世界',
					content: '',
					editable: true,
					placeholderText: "输入世界名称",
					success: (res) => {
						if (res.confirm) {
							if(res.content.trim() != ""){
								let tk = JSON.parse(window.localStorage.getItem('token'));
								if (tk) tk = tk.tk;
								axios.get(this.$baseUrl + '/world/create_world?world_name=' +  res.content, {
									headers: {
										'Content-Type': 'application/json', //设置请求头请求格式为JSON
										'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
									}
								}).then((res) => {
									uni.showToast({
										title: "创建成功",
										icon: 'none',
										duration: 2000
									});
									_this.refreshPage();
								}).catch(function(error) {
									uni.showToast({
										title: error.toString(),
										icon: 'none',
										duration: 2000
									});
								}).then(function() {
									uni.hideLoading();
								})
							}
						} else if (res.cancel) {}
					}
				});
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
	.worldWrapper {
	background-image: linear-gradient(to top, #f7f7f7, #f7f7f7, #fff2d0);
	min-height: calc(100vh - 44px);
	
	&.dark-mode {
		background-image: none;
		background-color: var(--background-color-secondary);
	}
}

	.outer {
	padding: 20px;
	padding-top: calc(10px);


	.title {
		font-size: 24px;
		margin-top: 50px;
		font-weight: bold;
		
		.dark-mode & {
			color: var(--text-color-primary);
		}
	}

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