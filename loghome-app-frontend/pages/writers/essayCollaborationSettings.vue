<template>
	<view v-dark>
		<view class="list-content">
			<view class="list">
				<view class="li">
					<view class="text">当前身份：{{ roleText }}</view>
				</view>
				<view class="li high">
					<view class="text">
						协作作者：
						<div class="tag" v-for="item in activeCollaborators" :key="item.user_id">
							{{ item.name }}
						</div>
						<div class="nontag" v-show="activeCollaborators.length == 0">暂无协作者</div>
					</view>
				</view>
				<view class="li noborder" @click="gotoCollaborators">
					<view class="text">{{ isOwner ? "协作作者管理" : "查看协作信息" }}</view>
					<img class="to" src="../../static/user/to.png"></img>
				</view>
			</view>
			<view class="list" v-if="canRespondInvitation">
				<view class="li" @click="acceptInvite">
					<view class="text">接受协作邀请</view>
					<img class="to" src="../../static/user/to.png"></img>
				</view>
				<view class="li noborder" @click="rejectInvite">
					<view class="text" style="color:#d9534f">拒绝协作邀请</view>
					<img class="to" src="../../static/user/to.png"></img>
				</view>
			</view>
			<view class="list" v-if="isCollaborator">
				<view class="li collaboration-notice" v-if="collaborationPolicy.permissions_restricted">
					<view class="text">
						当前为三人及以上协作，主作者尚未开通原木通行证，你目前只能预览作品。
					</view>
				</view>
				<view class="li noborder" @click="quitCollaboration">
					<view class="text" style="color:#d9534f">退出协作</view>
					<img class="to" src="../../static/user/to.png"></img>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import axios from 'axios'
	import darkModeMixin from '@/mixins/dark-mode.js'
	export default {
		data() {
			return {
				id:-1,
				access: {
					access_role: 'owner',
					can_manage_collaborators: true,
					can_manage_structure: true,
					can_respond_invitation: false,
				},
				collaborators: [],
			}
		},
		mixins: [darkModeMixin],
		computed: {
			isOwner() {
				return this.access && this.access.access_role === 'owner';
			},
			isCollaborator() {
				return this.access && this.access.access_role === 'collaborator';
			},
			canRespondInvitation() {
				return this.access && this.access.can_respond_invitation === true;
			},
			activeCollaborators() {
				return this.collaborators.filter((item) => item.status === 'active');
			},
			collaborationPolicy() {
				return (this.access && this.access.collaboration_policy) || {
					permissions_restricted: false,
				};
			},
			roleText() {
				if (this.isOwner) return '所有者';
				if (this.isCollaborator) return '协作者';
				if (this.canRespondInvitation) return '待接受邀请';
				return '访客';
			},
		},
		onLoad(params) {
			this.id = params.id;
			this.refreshPage();
		},
		onShow(){
			this.refreshPage();
		},
		methods: {
			getTokenInfo() {
				let token = JSON.parse(window.localStorage.getItem('token'));
				return token || null;
			},
			getAuthToken() {
				const token = this.getTokenInfo();
				return token ? token.tk : null;
			},
			async refreshPage() {
				const tk = this.getAuthToken();
				axios.get(this.$baseUrl + '/essays/get_novel_collaboration_info?novel_id=' + this.id, {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + tk
					}
				}).then((res) => {
					this.access = res.data.access || this.access;
					this.collaborators = res.data.collaborators || [];
				}).catch((error) => {
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				});
			},
			gotoCollaborators(){
				uni.navigateTo({
					url:"./novelCollaborators?id=" + this.id
				})
			},
			acceptInvite() {
				const tk = this.getAuthToken();
				axios.post(this.$baseUrl + '/essays/accept_novel_collaborator_invite',
					{
						novel_id: this.id
					},
					{
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + tk
						}
					}
				).then(() => {
					uni.showToast({
						title: '已接受协作邀请',
						icon: 'none',
						duration: 2000
					});
					this.refreshPage();
				}).catch((error) => {
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				})
			},
			rejectInvite() {
				const tk = this.getAuthToken();
				axios.post(this.$baseUrl + '/essays/reject_novel_collaborator_invite',
					{
						novel_id: this.id
					},
					{
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + tk
						}
					}
				).then(() => {
					uni.showToast({
						title: '已拒绝协作邀请',
						icon: 'none',
						duration: 2000
					});
					uni.reLaunch({
						url:"/pages/essays"
					})
				}).catch((error) => {
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				})
			},
			quitCollaboration() {
				const tk = this.getAuthToken();
				uni.showModal({
					title: '提示',
					content: '退出后将失去这本小说的编辑权限，确定继续吗？',
					confirmColor:"#F00",
					success: (modalRes) => {
						if (!modalRes.confirm) return;
						axios.post(this.$baseUrl + '/essays/quit_novel_collaboration',
							{
								novel_id: this.id
							},
							{
								headers: {
									'Content-Type': 'application/json',
									'Authorization': 'Bearer ' + tk
								}
							}
						).then(() => {
							uni.showToast({
								title: '已退出协作',
								icon: 'none',
								duration: 2000
							});
							uni.reLaunch({
								url:"/pages/essays"
							})
						}).catch((error) => {
							uni.showToast({
								title: error.toString(),
								icon: 'none',
								duration: 2000
							});
						})
					}
				});
			}
		}
	}
</script>

<style scoped lang="scss">

.text{
	font-size: 30rpx;
	width: 100%;

	.dark-mode & {
		color: var(--text-color-primary);
	}
}

.collaboration-notice{
	height: auto !important;
	padding-top: 22rpx !important;
	padding-bottom: 22rpx !important;
	background: #fff2ec;

	.text{
		font-size: 25rpx;
		line-height: 1.55;
		color: #a1583f;
	}

	.dark-mode &{
		background: rgba(205, 100, 65, 0.12);

		.text{ color: #f0b49f; }
	}
}

page{
	background-color:rgb(255, 248, 234);
	font-size: 30upx;

	&.dark-mode {
		background-color: var(--background-color-secondary);
	}
}
.list-content{
	background: #fff;
	margin-top:20upx;

	.dark-mode & {
		background: var(--card-background);
	}
}
.list{
	width:100%;
	border-bottom:15upx solid #f2f2f2;
	background: #fff;

	.dark-mode & {
		background: var(--card-background);
		border-bottom:15upx solid var(--border-color);
	}

	&:last-child{
		border: none;
	}
	.li{
		width:92%;
		height:100upx;
		padding:0 4%;
		border-bottom:1px solid rgb(255, 248, 234);
		display:flex;
		align-items:center;

		.dark-mode & {
			border-bottom:1px solid var(--border-color);
		}

		&.noborder{
			border-bottom:0
		}
		.icon{
			flex-shrink:0;
			width:50upx;
			height:50upx;
			img{
				width:50upx;
				height:50upx;
			}
		}
		.text{
			display: flex;
			flex-wrap: wrap;
			padding-left:20upx;
			width:100%;
			color:#666;

			.dark-mode & {
				color: var(--text-color-regular);
			}
		}
		.to{
			flex-shrink:0;
			width:40upx;
			height:40upx;
		}
	}
	.li.high{
		height:auto;
		min-height:100upx;
	}
	.li{
		.tag{
			background-color: #eeeeee;
			height:55upx;
			line-height: 55upx;
			padding:0 10upx;
			border-radius: 10upx;
			margin-right: 10upx;

			.dark-mode & {
				background-color: var(--background-color-secondary);
			}
		}
		.tag.activity{
			color:#ec8600;
			background-color: #ffcfa5;

			.dark-mode & {
				background-color: rgba(236, 134, 0, 0.2);
			}
		}
	}
}
</style>
