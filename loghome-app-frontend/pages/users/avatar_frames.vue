<template>
	<view class="avatar-frame-page" v-dark>
		<view class="frame-header">
			<view class="preview-card">
				<view class="preview-card__avatar">
					<user-avatar :src="user.avatar_url" :frame="previewFrame" :animate="true" />
				</view>
				<text class="preview-card__name">{{ previewFrame ? previewFrame.name : $t('me.frames.noneSelected') }}</text>
				<text class="preview-card__hint">{{ $t('me.frames.hint') }}</text>
			</view>

			<scroll-view class="filter-bar" scroll-x :show-scrollbar="false">
				<view class="filter-bar__inner">
					<view
						v-for="item in filters"
						:key="item.key"
						class="filter-chip"
						:class="{ active: filter === item.key }"
						@tap="filter = item.key"
					>{{ $t('me.frames.filter.' + item.key) }}</view>
				</view>
			</scroll-view>

		</view>

		<scroll-view class="frame-list" scroll-y :show-scrollbar="false">
			<view v-if="loading" class="state-text">{{ $t('me.frames.loading') }}</view>
			<view v-else-if="loadError" class="load-error">
				<text class="load-error__text">{{ loadError }}</text>
				<button class="load-error__retry" @tap="loadPage">{{ $t('common.retry') }}</button>
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
					<text class="frame-card__name">{{ $t('me.frames.none') }}</text>
					<text class="frame-card__tier">{{ $t('me.frames.filter.free') }}</text>
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
		</scroll-view>

		<view class="save-area">
			<button class="save-button" :disabled="saving || loading || !hasChanged" @tap="saveSelection">
				{{ saving ? $t('me.frames.saving') : hasChanged ? $t('me.frames.useThis') : $t('me.frames.inUse') }}
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
					{ key: 'all' },
					{ key: 'free' },
					{ key: 'standard' },
					{ key: 'super' },
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
					title: this.$t(isSuper ? 'me.frames.lockedSuper' : 'me.frames.locked'),
					content: this.$t('me.frames.lockedContent', {
						name: frame.name,
						tier: isSuper ? this.$t('me.frames.needSuper') : this.$t('me.frames.needAny'),
					}),
					confirmText: this.$t('me.frames.viewPass'),
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
					uni.showToast({ title: this.selectedFrameId == null ? this.$t('me.frames.removed') : this.$t('me.frames.applied'), icon: 'none' });
				} catch (error) {
					uni.showToast({ title: getAvatarFrameErrorMessage(error, this.$t('me.frames.saveFailed')), icon: 'none' });
				} finally {
					this.saving = false;
				}
			},
			tierLabel(tier) {
				return this.$t('me.frames.filter.' + (tier === 'super' || tier === 'standard' ? tier : 'free'));
			},
		},
	};
</script>

<style scoped lang="scss">
	.avatar-frame-page { position: fixed; top: var(--window-top, 0px); right: 0; bottom: 0; left: 0; display: flex; flex-direction: column; overflow: hidden; padding: 28rpx 24rpx 0; box-sizing: border-box; color: var(--text-color-primary); background: var(--background-color, #f6f2ed); }
	.frame-header { flex: none; }
	.frame-list { flex: 1; min-height: 0; height: 0; width: 100%; }
	.preview-card { display: flex; align-items: center; flex-direction: column; padding: 34rpx 24rpx 28rpx; border-radius: 30rpx; background: var(--card-background); box-shadow: 0 14rpx 40rpx rgba(75, 51, 32, .09); }
	.preview-card__avatar { width: 240rpx; height: 240rpx; }
	.preview-card__name { margin-top: 15rpx; font-size: 31rpx; font-weight: 700; }
	.preview-card__hint { margin-top: 7rpx; font-size: 22rpx; color: var(--text-color-secondary, #8d837a); }
	.filter-bar { display: block; width: 100%; height: 66rpx; margin: 28rpx 0 18rpx; white-space: nowrap; }
	.filter-bar__inner { display: inline-flex; align-items: center; height: 66rpx; gap: 12rpx; padding: 0 2rpx; }
	.filter-chip { padding: 13rpx 23rpx; border: 1rpx solid rgba(123, 91, 66, .12); border-radius: 999rpx; font-size: 23rpx; color: var(--text-color-secondary, #74685f); background: var(--card-background); }
	.filter-chip.active { border-color: #b46f58; color: #fff; background: #b46f58; }
	.frame-grid { padding: 8rpx 0 24rpx; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16rpx; }
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
	.save-area { position: relative; flex: none; margin: 0 -24rpx; z-index: 20; padding: 18rpx 28rpx calc(18rpx + env(safe-area-inset-bottom)); background: rgba(255,255,255,.94); box-shadow: 0 -8rpx 30rpx rgba(56, 39, 27, .08); backdrop-filter: blur(14px); }
	.save-button { height: 86rpx; border: 0; border-radius: 22rpx; font-size: 28rpx; font-weight: 700; line-height: 86rpx; color: #fff; background: #b46f58; }
	.save-button[disabled] { color: #8e857e; background: #e5dfda; }
	.dark-mode .save-area { background: rgba(28,28,28,.94); }
</style>
