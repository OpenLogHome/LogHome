<template>
	<view class="avatar-frame-page" v-dark>
		<view class="preview-card">
			<view class="preview-card__avatar">
				<user-avatar :src="user.avatar_url" :frame="previewFrame" :animate="true" />
			</view>
			<text class="preview-card__name">{{ previewFrame ? previewFrame.name : '不使用头像挂件' }}</text>
			<text class="preview-card__hint">选择喜欢的装饰，让头像更有辨识度</text>
		</view>

		<scroll-view class="filter-bar" scroll-x :show-scrollbar="false">
			<view class="filter-bar__inner">
				<view
					v-for="item in filters"
					:key="item.key"
					class="filter-chip"
					:class="{ active: filter === item.key }"
					@tap="filter = item.key"
				>{{ item.label }}</view>
			</view>
		</scroll-view>

		<view v-if="loading" class="state-text">头像挂件加载中…</view>
		<view v-else-if="loadError" class="load-error">
			<text class="load-error__text">{{ loadError }}</text>
			<button class="load-error__retry" @tap="loadPage">重新加载</button>
		</view>
		<view v-else class="frame-grid">
			<view
				v-if="filter === 'all' || filter === 'free'"
				class="frame-card"
				:class="{ selected: pendingFrameId === null }"
				@tap="chooseNone"
			>
				<view class="frame-card__avatar frame-card__none">
					<user-avatar :src="user.avatar_url" />
				</view>
				<text class="frame-card__name">不使用</text>
				<text class="frame-card__tier">免费</text>
			</view>

			<view
				v-for="item in filteredFrames"
				:key="item.frame_id"
				class="frame-card"
				:class="{ selected: pendingFrameId === item.frame_id, locked: !item.can_use }"
				@tap="chooseFrame(item)"
			>
				<view class="frame-card__avatar">
					<user-avatar :src="user.avatar_url" :frame="item" />
					<view v-if="!item.can_use" class="frame-card__lock">🔒</view>
				</view>
				<text class="frame-card__name">{{ item.name }}</text>
				<text class="frame-card__tier" :class="'tier--' + item.required_tier">{{ tierLabel(item.required_tier) }}</text>
			</view>
		</view>

		<view class="save-area">
			<button class="save-button" :disabled="saving || loading || !hasChanged" @tap="saveSelection">
				{{ saving ? '保存中…' : hasChanged ? '使用这个头像挂件' : '正在使用' }}
			</button>
		</view>
	</view>
</template>

<script>
	import axios from 'axios';
	import darkModeMixin from '@/mixins/dark-mode.js';
	import {
		getAvatarFrameAuthHeaders,
		getAvatarFrames,
		getAvatarFrameErrorMessage,
		selectAvatarFrame,
	} from '@/common/avatar-frames-api.js';

	export default {
		mixins: [darkModeMixin],
		data() {
			return {
				user: {},
				frames: [],
				selectedFrameId: null,
				pendingFrameId: null,
				filter: 'all',
				loading: true,
				saving: false,
				loadError: '',
				filters: [
					{ key: 'all', label: '全部' },
					{ key: 'free', label: '免费' },
					{ key: 'standard', label: '原木通行证' },
					{ key: 'super', label: '超级通行证' },
				],
			};
		},
		computed: {
			filteredFrames() {
				if (this.filter === 'all') return this.frames;
				return this.frames.filter((item) => item.required_tier === this.filter);
			},
			previewFrame() {
				return this.frames.find((item) => item.frame_id === this.pendingFrameId) || null;
			},
			hasChanged() {
				return this.pendingFrameId !== this.selectedFrameId;
			},
		},
		onShow() {
			this.loadPage();
		},
		methods: {
			async loadPage() {
				this.loading = true;
				this.loadError = '';
				try {
					const cached = window.localStorage.getItem('LogHomeUserInfo');
					if (cached) this.user = JSON.parse(cached);
					const catalog = await getAvatarFrames(this.$baseUrl);
					this.frames = catalog.frames || [];
					this.selectedFrameId = catalog.selected_frame_id == null ? null : Number(catalog.selected_frame_id);
					this.pendingFrameId = this.selectedFrameId;

					// 头像挂件目录已经加载成功后再刷新资料；资料接口失败不影响目录展示。
					try {
						const profile = await axios.get(`${this.$baseUrl}/users/userprofile`, {
							headers: getAvatarFrameAuthHeaders(),
						});
						this.user = profile.data || this.user;
					} catch (profileError) {
						console.warn('[avatar-frames] user profile refresh failed', profileError);
					}
				} catch (error) {
					this.frames = [];
					this.loadError = getAvatarFrameErrorMessage(error);
					console.error('[avatar-frames] catalog load failed', error);
					uni.showToast({ title: this.loadError, icon: 'none' });
				} finally {
					this.loading = false;
				}
			},
			chooseNone() {
				this.pendingFrameId = null;
			},
			chooseFrame(frame) {
				if (frame.can_use) {
					this.pendingFrameId = frame.frame_id;
					return;
				}
				const isSuper = frame.required_tier === 'super';
				uni.showModal({
					title: isSuper ? '超级通行证专属头像挂件' : '通行证专属头像挂件',
					content: `${frame.name}需要${isSuper ? '超级原木通行证' : '原木通行证或超级原木通行证'}才能使用。`,
					confirmText: '查看通行证',
					success: (result) => {
						if (result.confirm) uni.navigateTo({ url: `/pages/membership/index?tier=${isSuper ? 'super' : 'standard'}` });
					},
				});
			},
			async saveSelection() {
				if (!this.hasChanged || this.saving) return;
				this.saving = true;
				try {
					const result = await selectAvatarFrame(this.$baseUrl, this.pendingFrameId);
					this.selectedFrameId = result.selected_frame_id == null ? null : Number(result.selected_frame_id);
					this.user.selected_avatar_frame_id = this.selectedFrameId;
					this.user.avatar_frame = result.avatar_frame || null;
					window.localStorage.setItem('LogHomeUserInfo', JSON.stringify(this.user));
					uni.showToast({ title: this.selectedFrameId == null ? '已取消头像挂件' : '头像挂件已生效', icon: 'none' });
				} catch (error) {
					uni.showToast({ title: getAvatarFrameErrorMessage(error, '头像挂件保存失败'), icon: 'none' });
				} finally {
					this.saving = false;
				}
			},
			tierLabel(tier) {
				if (tier === 'super') return '超级通行证';
				if (tier === 'standard') return '原木通行证';
				return '免费';
			},
		},
	};
</script>

<style scoped lang="scss">
	.avatar-frame-page { min-height: 100vh; padding: 28rpx 24rpx 170rpx; box-sizing: border-box; color: var(--text-color-primary); background: var(--background-color, #f6f2ed); }
	.preview-card { display: flex; align-items: center; flex-direction: column; padding: 34rpx 24rpx 28rpx; border-radius: 30rpx; background: var(--card-background); box-shadow: 0 14rpx 40rpx rgba(75, 51, 32, .09); }
	.preview-card__avatar { width: 240rpx; height: 240rpx; }
	.preview-card__name { margin-top: 15rpx; font-size: 31rpx; font-weight: 700; }
	.preview-card__hint { margin-top: 7rpx; font-size: 22rpx; color: var(--text-color-secondary, #8d837a); }
	.filter-bar { display: block; width: 100%; height: 66rpx; margin: 28rpx 0 18rpx; white-space: nowrap; }
	.filter-bar__inner { display: inline-flex; align-items: center; height: 66rpx; gap: 12rpx; padding: 0 2rpx; }
	.filter-chip { padding: 13rpx 23rpx; border: 1rpx solid rgba(123, 91, 66, .12); border-radius: 999rpx; font-size: 23rpx; color: var(--text-color-secondary, #74685f); background: var(--card-background); }
	.filter-chip.active { border-color: #b46f58; color: #fff; background: #b46f58; }
	.frame-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16rpx; }
	.frame-card { position: relative; display: flex; align-items: center; flex-direction: column; min-width: 0; padding: 18rpx 10rpx 15rpx; border: 3rpx solid transparent; border-radius: 24rpx; background: var(--card-background); }
	.frame-card.selected { border-color: #b46f58; box-shadow: 0 10rpx 24rpx rgba(180, 111, 88, .18); }
	.frame-card.locked { opacity: .72; }
	.frame-card__avatar { position: relative; width: 150rpx; height: 150rpx; }
	.frame-card__none { width: 104rpx; height: 104rpx; margin: 23rpx; }
	.frame-card__lock { position: absolute; right: 0; bottom: 2rpx; display: flex; align-items: center; justify-content: center; width: 42rpx; height: 42rpx; border-radius: 50%; font-size: 20rpx; background: rgba(255,255,255,.94); box-shadow: 0 4rpx 12rpx rgba(0,0,0,.15); }
	.frame-card__name { max-width: 100%; margin-top: 7rpx; overflow: hidden; font-size: 23rpx; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
	.frame-card__tier { margin-top: 5rpx; font-size: 19rpx; color: #7b746e; }
	.tier--standard { color: #a76343; }
	.tier--super { color: #6f61b5; }
	.state-text { padding: 120rpx 0; text-align: center; color: #91877e; }
	.load-error { display: flex; align-items: center; flex-direction: column; padding: 90rpx 30rpx; text-align: center; }
	.load-error__text { font-size: 24rpx; color: #91877e; }
	.load-error__retry { min-width: 180rpx; height: 66rpx; margin-top: 24rpx; border: 0; border-radius: 18rpx; font-size: 24rpx; line-height: 66rpx; color: #fff; background: #b46f58; }
	.save-area { position: fixed; right: 0; bottom: 0; left: 0; z-index: 20; padding: 18rpx 28rpx calc(18rpx + env(safe-area-inset-bottom)); background: rgba(255,255,255,.94); box-shadow: 0 -8rpx 30rpx rgba(56, 39, 27, .08); backdrop-filter: blur(14px); }
	.save-button { height: 86rpx; border: 0; border-radius: 22rpx; font-size: 28rpx; font-weight: 700; line-height: 86rpx; color: #fff; background: #b46f58; }
	.save-button[disabled] { color: #8e857e; background: #e5dfda; }
	.dark-mode .save-area { background: rgba(28,28,28,.94); }
</style>
