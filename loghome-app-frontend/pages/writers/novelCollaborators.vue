<template>
	<view class="page" v-dark>
		<view class="panel">
			<view class="sectionTitle">作品信息</view>
			<view class="ownerCard">
				<img class="avatar" :src="collaborationInfo.novel.owner_avatar_url || '/static/user/defaultAvatar.jpg'" />
				<view class="ownerInfo">
					<view class="name">{{ collaborationInfo.novel.name || '协作作品' }}</view>
					<view class="meta">所有者：{{ collaborationInfo.novel.owner_name || '未知' }}</view>
				</view>
			</view>
		</view>

		<view class="panel" v-if="isOwner">
			<view class="sectionTitle">邀请协作者</view>
			<uni-search-bar
				bgColor="#ffffff"
				:radius="8"
				cancelButton="none"
				placeholder="搜索用户名或账号"
				@input="searchUsers"
			/>
			<view class="emptyHint" v-if="searchKeyword && searchResults.length === 0 && !searching">
				没有找到可邀请的用户
			</view>
			<view class="userRow" v-for="item in searchResults" :key="item.user_id">
				<img class="avatar" :src="item.avatar_url || '/static/user/defaultAvatar.jpg'" />
				<view class="userInfo">
					<view class="name">{{ item.name }}</view>
					<view class="meta">ID: {{ item.user_id }}</view>
				</view>
				<view class="actionButton" @click="inviteUser(item)">邀请</view>
			</view>
		</view>

		<view class="panel" v-if="canRespondInvitation">
			<view class="sectionTitle">待处理邀请</view>
			<view class="inviteActions">
				<view class="primaryButton" @click="acceptInvite">接受协作邀请</view>
				<view class="dangerButton" @click="rejectInvite">拒绝邀请</view>
			</view>
		</view>

		<view class="panel">
			<view class="sectionTitle">当前协作者</view>
			<view class="emptyHint" v-if="activeCollaborators.length === 0">暂无协作者</view>
			<view class="collaboratorCard" v-for="item in activeCollaborators" :key="`active-${item.user_id}`">
				<view class="userRow">
					<img class="avatar" :src="item.avatar_url || '/static/user/defaultAvatar.jpg'" />
					<view class="userInfo">
						<view class="name">{{ item.name }}</view>
						<view class="meta">状态：协作中</view>
					</view>
					<view class="dangerButton mini" v-if="isOwner" @click="removeCollaborator(item)">移除</view>
				</view>
				<view class="permissionSummary">
					<view
						class="permissionChip"
						v-for="permission in permissionOptions"
						:key="`${item.user_id}-${permission.key}`"
						:class="{ enabled: !!item[permission.key] }"
					>
						{{ permission.label }}
					</view>
				</view>
				<view class="permissionEditor" v-if="isOwner">
					<view class="permissionToggle" v-for="permission in permissionOptions" :key="permission.key">
						<view class="toggleLabel">{{ permission.label }}</view>
						<el-switch
							:value="!!item[permission.key]"
							:disabled="permissionSavingUserId === item.user_id"
							@change="updateCollaboratorPermission(item, permission.key, $event)"
						/>
					</view>
				</view>
			</view>
		</view>

		<view class="panel" v-if="isOwner && pendingCollaborators.length > 0">
			<view class="sectionTitle">待接受邀请</view>
			<view class="collaboratorCard" v-for="item in pendingCollaborators" :key="`pending-${item.user_id}`">
				<view class="userRow">
					<img class="avatar" :src="item.avatar_url || '/static/user/defaultAvatar.jpg'" />
					<view class="userInfo">
						<view class="name">{{ item.name }}</view>
						<view class="meta">状态：待接受</view>
					</view>
					<view class="dangerButton mini" @click="removeCollaborator(item)">撤回</view>
				</view>
				<view class="permissionSummary">
					<view
						class="permissionChip"
						v-for="permission in permissionOptions"
						:key="`${item.user_id}-${permission.key}`"
						:class="{ enabled: !!item[permission.key] }"
					>
						{{ permission.label }}
					</view>
				</view>
				<view class="permissionEditor">
					<view class="permissionToggle" v-for="permission in permissionOptions" :key="permission.key">
						<view class="toggleLabel">{{ permission.label }}</view>
						<el-switch
							:value="!!item[permission.key]"
							:disabled="permissionSavingUserId === item.user_id"
							@change="updateCollaboratorPermission(item, permission.key, $event)"
						/>
					</view>
				</view>
			</view>
		</view>

		<view class="panel" v-if="isCollaborator">
			<view class="sectionTitle">协作操作</view>
			<view class="dangerButton full" @click="quitCollaboration">退出协作</view>
		</view>
	</view>
</template>

<script>
import axios from 'axios'
import darkModeMixin from '@/mixins/dark-mode.js'

export default {
	data() {
		return {
			novelId: 0,
			collaborationInfo: {
				novel: {},
				access: {
					access_role: 'owner',
					can_manage_collaborators: true,
					can_respond_invitation: false,
				},
				collaborators: [],
			},
			searchKeyword: '',
			searchResults: [],
			searching: false,
			searchTimer: null,
			permissionSavingUserId: 0,
		}
	},
	mixins: [darkModeMixin],
	computed: {
		permissionOptions() {
			return [
				{ key: 'can_edit_article', label: '编辑章节' },
				{ key: 'can_add_article', label: '新增章节' },
				{ key: 'can_delete_article', label: '删除章节' },
				{ key: 'can_sort_article', label: '章节排序' },
				{ key: 'can_publish_article', label: '发布章节' },
			];
		},
		isOwner() {
			return this.collaborationInfo.access && this.collaborationInfo.access.access_role === 'owner';
		},
		isCollaborator() {
			return this.collaborationInfo.access && this.collaborationInfo.access.access_role === 'collaborator';
		},
		canRespondInvitation() {
			return this.collaborationInfo.access && this.collaborationInfo.access.can_respond_invitation === true;
		},
		activeCollaborators() {
			return (this.collaborationInfo.collaborators || []).filter((item) => item.status === 'active');
		},
		pendingCollaborators() {
			return (this.collaborationInfo.collaborators || []).filter((item) => item.status === 'pending');
		},
	},
	onLoad(params) {
		this.novelId = Number(params.id || params.novel_id || 0);
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
			if (!this.novelId) {
				return;
			}
			try {
				const tk = this.getAuthToken();
				const res = await axios.get(this.$baseUrl + '/essays/get_novel_collaboration_info?novel_id=' + this.novelId, {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + tk
					}
				});
				this.collaborationInfo = res.data;
			} catch (error) {
				uni.showToast({
					title: error.toString(),
					icon: 'none',
					duration: 2000
				});
			}
		},
		searchUsers(event) {
			this.searchKeyword = event;
			clearTimeout(this.searchTimer);
			if (!this.searchKeyword) {
				this.searchResults = [];
				return;
			}
			this.searchTimer = setTimeout(async () => {
				try {
					this.searching = true;
					const res = await axios.get(this.$baseUrl + '/community/search/users?keyword=' + encodeURIComponent(this.searchKeyword));
					const existingUserIds = new Set([
						Number(this.collaborationInfo.novel.author_id || 0),
						...(this.collaborationInfo.collaborators || []).map((item) => Number(item.user_id)),
					]);
					this.searchResults = (res.data || []).filter((item) => !existingUserIds.has(Number(item.user_id)));
				} catch (error) {
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				} finally {
					this.searching = false;
				}
			}, 300);
		},
		async updateCollaboratorPermission(user, permissionKey, value) {
			const tk = this.getAuthToken();
			const previousState = this.permissionOptions.reduce((state, permission) => {
				state[permission.key] = !!user[permission.key];
				return state;
			}, {});

			user[permissionKey] = !!value;
			this.permissionSavingUserId = Number(user.user_id);

			try {
				await axios.post(this.$baseUrl + '/essays/update_novel_collaborator_permissions',
					{
						novel_id: this.novelId,
						user_id: user.user_id,
						can_edit_article: !!user.can_edit_article,
						can_add_article: !!user.can_add_article,
						can_delete_article: !!user.can_delete_article,
						can_sort_article: !!user.can_sort_article,
						can_publish_article: !!user.can_publish_article,
					},
					{
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + tk
						}
					}
				);
			} catch (error) {
				Object.assign(user, previousState);
				uni.showToast({
					title: error.toString(),
					icon: 'none',
					duration: 2000
				});
			} finally {
				this.permissionSavingUserId = 0;
			}
		},
		inviteUser(user) {
			const tk = this.getAuthToken();
			axios.post(this.$baseUrl + '/essays/invite_novel_collaborator',
				{
					novel_id: this.novelId,
					user_id: user.user_id,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + tk
					}
				}
			).then(() => {
				uni.showToast({
					title: '邀请已发送',
					icon: 'none',
					duration: 2000
				});
				this.searchResults = this.searchResults.filter((item) => Number(item.user_id) !== Number(user.user_id));
				this.refreshPage();
			}).catch((error) => {
				uni.showToast({
					title: error.toString(),
					icon: 'none',
					duration: 2000
				});
			});
		},
		removeCollaborator(user) {
			const tk = this.getAuthToken();
			axios.post(this.$baseUrl + '/essays/remove_novel_collaborator',
				{
					novel_id: this.novelId,
					user_id: user.user_id,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + tk
					}
				}
			).then(() => {
				uni.showToast({
					title: '操作成功',
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
			});
		},
		acceptInvite() {
			const tk = this.getAuthToken();
			axios.post(this.$baseUrl + '/essays/accept_novel_collaborator_invite',
				{
					novel_id: this.novelId,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + tk
					}
				}
			).then(() => {
				uni.showToast({
					title: '已加入协作',
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
			});
		},
		rejectInvite() {
			const tk = this.getAuthToken();
			axios.post(this.$baseUrl + '/essays/reject_novel_collaborator_invite',
				{
					novel_id: this.novelId,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + tk
					}
				}
			).then(() => {
				uni.showToast({
					title: '已拒绝邀请',
					icon: 'none',
					duration: 2000
				});
				uni.navigateBack();
			}).catch((error) => {
				uni.showToast({
					title: error.toString(),
					icon: 'none',
					duration: 2000
				});
			});
		},
		quitCollaboration() {
			const tk = this.getAuthToken();
			axios.post(this.$baseUrl + '/essays/quit_novel_collaboration',
				{
					novel_id: this.novelId,
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
					url: '/pages/essays'
				});
			}).catch((error) => {
				uni.showToast({
					title: error.toString(),
					icon: 'none',
					duration: 2000
				});
			});
		},
	}
}
</script>

<style scoped lang="scss">
.page{
	padding: 20rpx;
	background-color:rgb(255, 248, 234);
	min-height: calc(100vh - 44px);

	&.dark-mode {
		background-color: var(--background-color-secondary);
	}
}

.panel{
	background: #fff;
	border-radius: 18rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;

	.dark-mode & {
		background: var(--card-background);
	}
}

.sectionTitle{
	font-size: 30rpx;
	font-weight: bold;
	margin-bottom: 18rpx;

	.dark-mode & {
		color: var(--text-color-primary);
	}
}

.ownerCard,
.userRow{
	display:flex;
	align-items:center;
	padding: 12rpx 0;
}

.collaboratorCard{
	padding: 8rpx 0 18rpx;
	border-bottom: 1rpx solid rgba(0, 0, 0, 0.06);

	&:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.dark-mode & {
		border-bottom-color: rgba(255, 255, 255, 0.08);
	}
}

.avatar{
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	margin-right: 18rpx;
	background: #f3f3f3;
	object-fit: cover;
}

.ownerInfo,
.userInfo{
	flex:1;
}

.name{
	font-size: 28rpx;
	font-weight: 600;

	.dark-mode & {
		color: var(--text-color-primary);
	}
}

.meta{
	font-size: 24rpx;
	color:#8a8a8a;
	margin-top: 6rpx;

	.dark-mode & {
		color: var(--text-color-regular);
	}
}

.actionButton,
.primaryButton,
.dangerButton{
	padding: 10rpx 22rpx;
	border-radius: 999rpx;
	font-size: 24rpx;
	text-align:center;
}

.actionButton,
.primaryButton{
	background: #ffddb7;
	color:#8a481a;
}

.dangerButton{
	background: #ffe1df;
	color:#c94840;
}

.dangerButton.mini{
	padding: 8rpx 18rpx;
}

.dangerButton.full{
	width: 100%;
	box-sizing: border-box;
}

.permissionSummary{
	display:flex;
	flex-wrap:wrap;
	margin-top: 4rpx;
}

.permissionChip{
	padding: 6rpx 16rpx;
	margin-right: 12rpx;
	margin-top: 10rpx;
	border-radius: 999rpx;
	background: #f3f3f3;
	color: #9c9c9c;
	font-size: 22rpx;

	&.enabled{
		background: #ffddb7;
		color:#8a481a;
	}

	.dark-mode & {
		background: rgba(255, 255, 255, 0.08);
		color: var(--text-color-regular);
	}

	.dark-mode &.enabled{
		background: rgba(255, 221, 183, 0.2);
		color: #ffd6aa;
	}
}

.permissionEditor{
	margin-top: 14rpx;
	padding: 16rpx 18rpx;
	border-radius: 14rpx;
	background: #faf7f2;

	.dark-mode & {
		background: rgba(255, 255, 255, 0.04);
	}
}

.permissionToggle{
	display:flex;
	align-items:center;
	justify-content:space-between;
	padding: 8rpx 0;
}

.toggleLabel{
	font-size: 24rpx;
	color: #6a6a6a;

	.dark-mode & {
		color: var(--text-color-regular);
	}
}

.inviteActions{
	display:flex;
	gap: 20rpx;
}

.inviteActions .primaryButton,
.inviteActions .dangerButton{
	flex:1;
}

.emptyHint{
	font-size: 24rpx;
	color:#8a8a8a;
	padding: 10rpx 0;

	.dark-mode & {
		color: var(--text-color-regular);
	}
}
</style>
