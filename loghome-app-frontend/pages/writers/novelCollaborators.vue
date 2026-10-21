<template>
	<view class="page" v-dark>
		<view class="panel">
			<view class="sectionTitle">{{ $t('writer.collab.novel.workInfo') }}</view>
			<view class="ownerCard">
				<img class="avatar" :src="collaborationInfo.novel.owner_avatar_url || '/static/user/defaultAvatar.jpg'" />
				<view class="ownerInfo">
					<view class="name">{{ collaborationInfo.novel.name || $t('writer.collab.novel.untitledCollaboration') }}</view>
					<view class="meta">{{ $t('writer.collab.novel.ownerLabel', { name: collaborationInfo.novel.owner_name || $t('common.unknown') }) }}</view>
				</view>
			</view>
		</view>

		<view class="policyPanel" :class="policyPanelClass">
			<view class="policyIcon">{{ collaborationPolicy.permissions_restricted ? '!' : '✓' }}</view>
			<view class="policyContent">
				<view class="policyTitle">{{ policyTitle }}</view>
				<view class="policyDescription">{{ policyDescription }}</view>
			</view>
			<view class="membershipButton" v-if="showMembershipAction" @click="openMembership">
				{{ $t('writer.collab.novel.openPass') }}
			</view>
		</view>

		<view class="panel" v-if="isOwner">
			<view class="sectionTitle">{{ $t('writer.collab.novel.inviteCollaborators') }}</view>
			<uni-search-bar
				bgColor="#ffffff"
				:radius="8"
				cancelButton="none"
				:placeholder="$t('writer.collab.novel.searchPlaceholder')"
				@input="searchUsers"
			/>
			<view class="emptyHint" v-if="searchKeyword && searchResults.length === 0 && !searching">
				{{ $t('writer.collab.novel.noInvitableUsers') }}
			</view>
			<view class="userRow" v-for="item in searchResults" :key="item.user_id">
				<img class="avatar" :src="item.avatar_url || '/static/user/defaultAvatar.jpg'" />
				<view class="userInfo">
					<view class="name">{{ item.name }}</view>
					<view class="meta">ID: {{ item.user_id }}</view>
				</view>
				<view class="actionButton" @click="inviteUser(item)">{{ $t('writer.collab.novel.invite') }}</view>
			</view>
		</view>

		<view class="panel" v-if="canRespondInvitation">
			<view class="sectionTitle">{{ $t('writer.collab.novel.pendingInvitations') }}</view>
			<view class="inviteActions">
				<view class="primaryButton" @click="acceptInvite">{{ $t('writer.collab.novel.acceptInvite') }}</view>
				<view class="dangerButton" @click="rejectInvite">{{ $t('writer.collab.novel.rejectInvite') }}</view>
			</view>
		</view>

		<view class="panel">
			<view class="sectionTitle">{{ $t('writer.collab.novel.currentCollaborators') }}</view>
			<view class="emptyHint" v-if="activeCollaborators.length === 0">{{ $t('writer.collab.novel.noCollaborators') }}</view>
			<view class="collaboratorCard" v-for="item in activeCollaborators" :key="`active-${item.user_id}`">
				<view class="userRow">
					<img class="avatar" :src="item.avatar_url || '/static/user/defaultAvatar.jpg'" />
					<view class="userInfo">
						<view class="name">{{ item.name }}</view>
						<view class="meta">{{ $t('writer.collab.novel.statusActive') }}</view>
					</view>
					<view class="dangerButton mini" v-if="isOwner" @click="removeCollaborator(item)">{{ $t('writer.collab.novel.remove') }}</view>
				</view>
				<view class="permissionSummary">
					<view class="permissionChip enabled">{{ $t('writer.collab.novel.permissionPreview') }}</view>
					<view
						class="permissionChip"
						v-for="permission in permissionOptions"
						:key="`${item.user_id}-${permission.key}`"
						:class="{ enabled: !!item[permission.key] }"
					>
						{{ permission.label }}
					</view>
				</view>
				<view class="permissionLockedHint" v-if="item.permissions_locked">
					{{ $t('writer.collab.novel.permissionLockedHintActive') }}
				</view>
				<view class="permissionEditor" v-if="isOwner">
					<view class="permissionToggle" v-for="permission in permissionOptions" :key="permission.key">
						<view class="toggleLabel">{{ permission.label }}</view>
						<el-switch
							:value="!!item[permission.key]"
							:disabled="permissionSavingUserId === item.user_id || item.permissions_locked"
							@change="updateCollaboratorPermission(item, permission.key, $event)"
						/>
					</view>
				</view>
			</view>
		</view>

		<view class="panel" v-if="isOwner && pendingCollaborators.length > 0">
			<view class="sectionTitle">{{ $t('writer.collab.novel.pendingAcceptTitle') }}</view>
			<view class="collaboratorCard" v-for="item in pendingCollaborators" :key="`pending-${item.user_id}`">
				<view class="userRow">
					<img class="avatar" :src="item.avatar_url || '/static/user/defaultAvatar.jpg'" />
					<view class="userInfo">
						<view class="name">{{ item.name }}</view>
						<view class="meta">{{ $t('writer.collab.novel.statusPending') }}</view>
					</view>
					<view class="dangerButton mini" @click="removeCollaborator(item)">{{ $t('writer.collab.novel.withdraw') }}</view>
				</view>
				<view class="permissionSummary">
					<view class="permissionChip enabled">{{ $t('writer.collab.novel.permissionPreview') }}</view>
					<view
						class="permissionChip"
						v-for="permission in permissionOptions"
						:key="`${item.user_id}-${permission.key}`"
						:class="{ enabled: !!item[permission.key] }"
					>
						{{ permission.label }}
					</view>
				</view>
				<view class="permissionLockedHint" v-if="item.permissions_locked">
					{{ $t('writer.collab.novel.permissionLockedHintPending') }}
				</view>
				<view class="permissionEditor">
					<view class="permissionToggle" v-for="permission in permissionOptions" :key="permission.key">
						<view class="toggleLabel">{{ permission.label }}</view>
						<el-switch
							:value="!!item[permission.key]"
							:disabled="permissionSavingUserId === item.user_id || item.permissions_locked"
							@change="updateCollaboratorPermission(item, permission.key, $event)"
						/>
					</view>
				</view>
			</view>
		</view>

		<view class="panel" v-if="isCollaborator">
			<view class="sectionTitle">{{ $t('writer.collab.novel.collaborationActions') }}</view>
			<view class="dangerButton full" @click="quitCollaboration">{{ $t('writer.collab.novel.quitCollaboration') }}</view>
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
					collaboration_policy: {
						active_collaborator_count: 0,
						participant_count: 1,
						owner_has_required_membership: false,
						permissions_restricted: false,
					},
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
				{ key: 'can_edit_article', label: this.$t('writer.collab.novel.permissions.editChapter') },
				{ key: 'can_add_article', label: this.$t('writer.collab.novel.permissions.addChapter') },
				{ key: 'can_delete_article', label: this.$t('writer.collab.novel.permissions.deleteChapter') },
				{ key: 'can_sort_article', label: this.$t('writer.collab.novel.permissions.sortChapters') },
				{ key: 'can_publish_article', label: this.$t('writer.collab.novel.permissions.publishChapter') },
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
		collaborationPolicy() {
			return (this.collaborationInfo.access && this.collaborationInfo.access.collaboration_policy) || {
				active_collaborator_count: 0,
				participant_count: 1,
				owner_has_required_membership: false,
				permissions_restricted: false,
			};
		},
		policyPanelClass() {
			if (this.collaborationPolicy.permissions_restricted) return 'restricted';
			if (this.collaborationPolicy.owner_has_required_membership) return 'unlocked';
			return 'free';
		},
		showMembershipAction() {
			return this.isOwner &&
				!this.collaborationPolicy.owner_has_required_membership &&
				(
					this.collaborationPolicy.permissions_restricted ||
					(this.collaborationInfo.collaborators || []).some((item) => item.permissions_locked)
				);
		},
		policyTitle() {
			if (this.collaborationPolicy.permissions_restricted) return this.$t('writer.collab.novel.policies.restrictedTitle');
			if (this.collaborationPolicy.owner_has_required_membership) return this.$t('writer.collab.novel.policies.unlockedTitle');
			return this.$t('writer.collab.novel.policies.freeTitle');
		},
		policyDescription() {
			const count = Number(this.collaborationPolicy.participant_count || 1);
			if (this.collaborationPolicy.permissions_restricted) {
				return this.$t('writer.collab.novel.policies.restrictedDesc', { count });
			}
			if (this.collaborationPolicy.owner_has_required_membership) {
				return this.$t('writer.collab.novel.policies.unlockedDesc', { count });
			}
			return this.$t('writer.collab.novel.policies.freeDesc');
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
			if (user.permissions_locked) {
				this.showMembershipRequired();
				return;
			}
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
			const willRequireMembership =
				!this.collaborationPolicy.owner_has_required_membership &&
				Number(this.collaborationPolicy.active_collaborator_count || 0) >= 1;
			if (willRequireMembership) {
				uni.showModal({
					title: this.$t('writer.collab.novel.threeMemberTitle'),
					content: this.$t('writer.collab.novel.threeMemberContent'),
					confirmText: this.$t('writer.collab.novel.continueInvite'),
					cancelText: this.$t('writer.collab.novel.notNowInvite'),
					success: (result) => {
						if (result.confirm) this.performInvite(user);
					},
				});
				return;
			}
			this.performInvite(user);
		},
		performInvite(user) {
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
					title: this.$t('writer.collab.novel.inviteSent'),
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
		showMembershipRequired() {
			uni.showModal({
				title: this.$t('writer.collab.novel.membershipRequiredTitle'),
				content: this.$t('writer.collab.novel.membershipRequiredContent'),
				confirmText: this.$t('writer.collab.novel.viewPass'),
				success: (result) => {
					if (result.confirm) this.openMembership();
				},
			});
		},
		openMembership() {
			uni.navigateTo({ url: '/pages/membership/index' });
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
					title: this.$t('writer.collab.novel.operationSuccess'),
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
					title: this.$t('writer.collab.novel.joinedCollaboration'),
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
					title: this.$t('writer.collab.novel.inviteRejected'),
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
					title: this.$t('writer.collab.novel.quitDone'),
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

.policyPanel{
	display:flex;
	align-items:center;
	gap: 18rpx;
	padding: 22rpx 24rpx;
	margin-bottom: 20rpx;
	border: 1rpx solid #efd8b9;
	border-radius: 18rpx;
	background: #fff7eb;

	&.restricted{
		border-color: #f0c4b6;
		background: #fff1eb;
	}

	&.unlocked{
		border-color: #c9e1c9;
		background: #f2faf1;
	}

	.dark-mode & {
		border-color: rgba(255, 221, 183, 0.2);
		background: rgba(255, 221, 183, 0.07);
	}
}

.policyIcon{
	display:flex;
	align-items:center;
	justify-content:center;
	flex-shrink:0;
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	font-size: 26rpx;
	font-weight: bold;
	color: #9a592a;
	background: #ffe0b8;

	.restricted & {
		color: #b64b36;
		background: #ffd8cd;
	}

	.unlocked & {
		color: #4e8751;
		background: #d7ecd5;
	}
}

.policyContent{
	flex:1;
	min-width:0;
}

.policyTitle{
	font-size: 27rpx;
	font-weight: 650;
	color: #5d3c27;

	.dark-mode & { color: var(--text-color-primary); }
}

.policyDescription{
	margin-top: 7rpx;
	font-size: 22rpx;
	line-height: 1.55;
	color: #8b705d;

	.dark-mode & { color: var(--text-color-regular); }
}

.membershipButton{
	flex-shrink:0;
	padding: 10rpx 18rpx;
	border-radius: 999rpx;
	font-size: 22rpx;
	font-weight: 600;
	color: #754214;
	background: #ffdda5;
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

.permissionLockedHint{
	margin-top: 14rpx;
	padding: 14rpx 16rpx;
	border-radius: 12rpx;
	font-size: 22rpx;
	line-height: 1.5;
	color: #a1583f;
	background: #fff2ec;

	.dark-mode & {
		color: #f0b49f;
		background: rgba(205, 100, 65, 0.12);
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
