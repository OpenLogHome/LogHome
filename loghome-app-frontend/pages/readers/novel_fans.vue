<template>
	<view class="fans-page" v-dark>
		<view class="board-toolbar">
			<view class="board-switch" role="tablist" aria-label="贡献榜周期">
				<view
					class="switch-highlight"
					:class="{ 'is-total': isActive === 1 }"
				></view>
				<view
					v-for="(title, index) in topTitle"
					:key="title"
					class="board-tab"
					:class="{ active: isActive === index }"
					role="tab"
					:aria-selected="isActive === index"
					@click="changeList(index)"
				>
					{{ title }}
				</view>
			</view>
		</view>
		<view v-if="loading" class="state-panel" role="status">
			正在加载贡献榜…
		</view>
		<view v-else-if="loadError" class="state-panel">
			<text>贡献榜加载失败</text>
			<view class="retry-button" @click="getStatistics">重新加载</view>
		</view>
		<view v-else-if="!fanInfo.length" class="state-panel">
			<text class="empty-title">
				{{ isActive === 0 ? '本月暂无贡献记录' : '暂无贡献记录' }}
			</text>
			<text class="empty-hint">成为第一位支持这部作品的读者吧</text>
		</view>
		<view v-else class="fans-list">
			<view
				v-for="(fan, index) in fanInfo"
				:key="fan.user_id"
				class="fan-row"
				:class="index < 3 ? 'medal-' + index : ''"
			>
				<text class="rank-number" :class="{ 'rank-top': index < 3 }">
					{{ index + 1 }}
				</text>
				<navigator
					class="avatar-wrap"
					:class="{ 'medal-avatar': index < 3 }"
					:url="'/pages/users/personalPage?id=' + fan.user_id"
				>
					<user-avatar
						:src="fan.avatar_url"
						:frame="fan.avatar_frame"
						class="fan-avatar"
						:visual-scale="fan.avatar_frame ? 1.15 : 1"
					/>
					<image
						v-if="index < 3"
						class="medal-frame"
						:src="'/static/fans/medal-' + index + '.svg'"
						mode="aspectFit"
					/>
				</navigator>
				<view class="fan-info">
					<navigator
						class="fan-name"
						:url="'/pages/users/personalPage?id=' + fan.user_id"
					>
						{{ fan.user_name }}
					</navigator>
					<view
						v-if="fan.message || isMe(fan)"
						class="fan-message"
						:class="{ editable: isMe(fan) }"
						@click="editMessage(fan)"
					>
						<text>{{ fan.message || '写下支持留言' }}</text>
						<text v-if="isMe(fan)" class="edit-icon">✎</text>
					</view>
				</view>
				<view class="contribution">
					<text class="contribution-value">
						{{ formatValue(fan.fans_value) }}
					</text>
					<text class="contribution-unit">贡献值</text>
				</view>
			</view>
		</view>
		<view class="my-contribution">
			<text class="my-rank">{{ myInfo.rank }}</text>
			<user-avatar
				:src="myInfo.avatar_url"
				:frame="myInfo.avatar_frame"
				class="my-avatar"
				:visual-scale="myInfo.avatar_frame ? 1.1 : 1"
			/>
			<view class="my-summary">
				<text class="my-name">
					{{ myInfo.user_id ? myInfo.name : '登录查看我的排名' }}
				</text>
				<text class="my-hint">
					{{
						myInfo.user_id
							? myInfo.fans_value > 0
								? '感谢你对作品的支持'
								: '送出第一份礼物，支持这部作品'
							: '与喜欢的作品一起成长'
					}}
				</text>
			</view>
			<view class="my-actions">
				<view class="gift-button" @click="openGift">
					{{ myInfo.user_id ? '送礼物' : '登录' }}
				</view>
				<text class="my-value">
					{{ formatValue(myInfo.fans_value) }}
					{{ isActive === 0 ? '本月' : '累计' }}贡献值
				</text>
			</view>
		</view>
		<uni-popup ref="messagePopup" type="dialog">
			<uni-popup-dialog
				mode="input"
				title="编辑留言"
				:value="editingMessage"
				placeholder="请输入留言内容"
				@confirm="confirmEditMessage"
			/>
		</uni-popup>
		<uni-popup ref="giftPopup" type="bottom">
			<view class="tipping-sheet">
				<TippingBar v-if="giftMounted" :novel_id="uid" @tip="onTip" />
			</view>
		</uni-popup>
	</view>
</template>
<script>
import axios from 'axios';
import darkModeMixin from '@/mixins/dark-mode.js';
import TippingBar from '@/components/tipping/tippingBar.vue';
export default {
	components: { TippingBar },
	mixins: [darkModeMixin],
	data() {
		return {
			topTitle: ['月榜', '总榜'],
			isActive: 0,
			fanInfo: [],
			myInfo: { rank: '未上榜', fans_value: 0 },
			uid: 0,
			editingMessage: '',
			currentEditingFan: null,
			loading: true,
			loadError: false,
			requestVersion: 0,
			giftMounted: false,
			giftOpening: false,
		};
	},
	methods: {
		token() {
			try {
				return JSON.parse(window.localStorage.getItem('token'));
			} catch (_) {
				return null;
			}
		},
		isMe(fan) {
			return (
				!!this.myInfo.user_id &&
				String(fan.user_id) === String(this.myInfo.user_id)
			);
		},
		formatValue(value) {
			return String(Math.floor(Number(value) || 0));
		},
		changeList(index) {
			if (this.isActive === index) return;
			this.isActive = index;
			this.getStatistics();
		},
		syncMyRank() {
			const index = this.fanInfo.findIndex(fan => this.isMe(fan));
			this.myInfo = {
				...this.myInfo,
				rank: index < 0 ? '未上榜' : String(index + 1),
				fans_value: index < 0 ? 0 : Number(this.fanInfo[index].fans_value) || 0,
			};
		},
		async getStatistics() {
			const version = ++this.requestVersion;
			this.loading = true;
			this.loadError = false;
			this.fanInfo = [];
			this.syncMyRank();
			try {
				const res = await axios.get(
					this.$baseUrl +
						'/library/get_all_novel_fans?novel_id=' +
						this.uid +
						'&type=' +
						(this.isActive === 0 ? 'month' : 'total'),
				);
				if (version !== this.requestVersion) return;
				this.fanInfo = Array.isArray(res.data) ? res.data : [];
				this.syncMyRank();
			} catch (_) {
				if (version === this.requestVersion) this.loadError = true;
			} finally {
				if (version === this.requestVersion) this.loading = false;
			}
		},
		async getMyInfo() {
			const token = this.token();
			if (!token || !token.tk) return;
			try {
				const res = await axios.get(this.$baseUrl + '/users/userprofile', {
					headers: { Authorization: token.tk },
				});
				this.myInfo = { ...res.data, rank: '未上榜', fans_value: 0 };
				this.syncMyRank();
			} catch (error) {
				if (error.response && error.response.status === 401)
					window.localStorage.removeItem('token');
			}
		},
		login() {
			uni.navigateTo({ url: '/pages/users/login?msg=unAuthorized' });
		},
		async openGift() {
			if (!this.token() || !this.myInfo.user_id) {
				this.login();
				return;
			}
			if (this.giftOpening) return;
			this.giftOpening = true;
			try {
				const res = await axios.get(
					this.$baseUrl + '/library/get_novel_by_id?id=' + this.uid,
				);
				const novel = Array.isArray(res.data) ? res.data[0] : res.data;
				if (!novel) throw new Error('missing work');
				if (
					String(novel.auther_id || novel.author_id) ===
					String(this.myInfo.user_id)
				) {
					uni.showToast({ title: '不能给自己的作品打赏哦', icon: 'none' });
					return;
				}
				this.giftMounted = true;
				this.$nextTick(() => this.$refs.giftPopup.open('bottom'));
			} catch (_) {
				uni.showToast({
					title: '暂时无法打开礼物菜单，请稍后重试',
					icon: 'none',
				});
			} finally {
				this.giftOpening = false;
			}
		},
		onTip() {
			this.$refs.giftPopup.close();
			this.getStatistics();
		},
		editMessage(fan) {
			if (!this.isMe(fan)) return;
			this.currentEditingFan = fan;
			this.editingMessage = fan.message || '此书只应天上有，当赏当赏！';
			this.$refs.messagePopup.open();
		},
		async confirmEditMessage(value) {
			if (!this.currentEditingFan || !this.isMe(this.currentEditingFan)) return;
			const token = this.token();
			if (!token || !token.tk) {
				this.login();
				return;
			}
			try {
				const res = await axios.post(
					this.$baseUrl + '/library/update_fan_message',
					{ novel_id: this.uid, message: value },
					{ headers: { Authorization: token.tk } },
				);
				if (!res.data.success) throw new Error('failed');
				this.fanInfo.forEach(fan => {
					if (this.isMe(fan)) fan.message = value;
				});
				uni.showToast({ title: '留言已更新', icon: 'success' });
			} catch (_) {
				uni.showToast({ title: '更新留言失败', icon: 'none' });
			}
		},
	},
	onLoad(params) {
		this.uid = Number(params.id) || 0;
		this.getMyInfo();
		this.getStatistics();
	},
	onReady() {
		uni.setNavigationBarTitle({ title: '粉丝贡献榜' });
	},
	onUnload() {
		this.requestVersion++;
	},
};
</script>
<style scoped lang="scss">
.fans-page {
	--text: #252525;
	--muted: #999;
	--gold: #ae8137;
	--footer: #fff9e5;
	min-height: calc(100vh - var(--window-top, 0px));
	box-sizing: border-box;
	color: var(--text);
	background: linear-gradient(180deg, #fff7dc 0, #fffdf4 210rpx, #fff 480rpx);
	padding: 0 12rpx calc(176rpx + env(safe-area-inset-bottom));
	&.dark-mode {
		--text: #eee;
		--muted: #999;
		--gold: #e2bf77;
		--footer: #302b20;
		background: linear-gradient(180deg, #302b20, #1b1b1b 480rpx);
	}
}
.board-toolbar {
	height: 112rpx;
	display: flex;
	justify-content: flex-end;
	align-items: flex-start;
	padding: 16rpx 14rpx 0;
	box-sizing: border-box;
}
.board-switch {
	display: flex;
	position: relative;
	border-radius: 60rpx;
	padding: 6rpx;
	background: rgba(255, 255, 255, 0.88);
	height: 58rpx;
}
.switch-highlight {
	position: absolute;
	top: 6rpx;
	bottom: 6rpx;
	left: 6rpx;
	width: 96rpx;
	background: #fff0ac;
	border-radius: 40rpx;
	transition: transform 0.25s ease;
	&.is-total {
		transform: translateX(96rpx);
	}
}
.board-tab {
	position: relative;
	z-index: 1;
	width: 96rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #858585;
	font-size: 28rpx;
	transition: color 0.25s ease;
	&.active {
		font-weight: 700;
		color: #302819;
	}
}
.fan-row {
	display: flex;
	align-items: center;
	position: relative;
	min-height: 128rpx;
	margin-bottom: 6rpx;
	padding: 14rpx 22rpx 14rpx 12rpx;
	border-radius: 16rpx;
	box-sizing: border-box;
}
.rank-number {
	width: 48rpx;
	flex-shrink: 0;
	text-align: center;
	font-size: 32rpx;
	font-weight: 700;
	color: #696969;
}
.rank-top {
	font-size: 88rpx;
	font-style: italic;
	line-height: 1;
	font-weight: 900;
	position: absolute;
	left: 10rpx;
	top: 40rpx;
	opacity: 0.32;
}
.medal-0 {
	background: linear-gradient(100deg, #fff2c1, rgba(255, 255, 255, 0));
}
.medal-1 {
	background: linear-gradient(100deg, #edf2ff, rgba(255, 255, 255, 0));
}
.medal-2 {
	background: linear-gradient(100deg, #fff2e5, rgba(255, 255, 255, 0));
}
.medal-0 .fan-name {
	color: var(--gold);
}
.medal-0 .rank-top {
	color: #e8ad47;
}
.medal-1 .rank-top {
	color: #a6bbe6;
}
.medal-2 .rank-top {
	color: #e7b180;
}
.avatar-wrap {
	position: relative;
	width: 84rpx;
	height: 84rpx;
	flex-shrink: 0;
	margin: 0 20rpx 0 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.medal-avatar {
	margin-left: 48rpx;
}
.fan-avatar {
	width: 76rpx;
	height: 76rpx;
}
.medal-frame {
	position: absolute;
	inset: -22rpx -13rpx -14rpx;
	width: 110rpx;
	height: 120rpx;
	pointer-events: none;
}
.fan-info {
	flex: 1;
	min-width: 0;
}
.fan-name {
	font-size: 30rpx;
	line-height: 42rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.fan-message {
	display: flex;
	align-items: center;
	gap: 6rpx;
	font-size: 22rpx;
	color: var(--muted);
	line-height: 30rpx;
	margin-top: 4rpx;
	text {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	&.editable {
		color: #b68b48;
	}
	.edit-icon {
		flex-shrink: 0;
	}
}
.contribution {
	display: flex;
	align-items: baseline;
	margin-left: 16rpx;
	gap: 4rpx;
	flex-shrink: 0;
}
.contribution-value {
	font-size: 30rpx;
	font-weight: 800;
	font-style: italic;
	color: #53534f;
}
.contribution-unit {
	font-size: 20rpx;
	color: var(--muted);
}
.my-contribution {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	gap: 12rpx;
	padding: 24rpx 24rpx calc(24rpx + env(safe-area-inset-bottom));
	min-height: 140rpx;
	box-sizing: border-box;
	z-index: 20;
	border-radius: 24rpx 24rpx 0 0;
	border-top: 1rpx solid #f0e5bd;
	background: var(--footer);
	box-shadow: 0 -6rpx 24rpx rgba(152, 121, 52, 0.06);
}
.my-rank {
	width: 80rpx;
	white-space: nowrap;
	flex-shrink: 0;
	text-align: center;
	font-size: 22rpx;
	color: var(--text);
}
.my-avatar {
	width: 76rpx;
	height: 76rpx;
	flex-shrink: 0;
}
.my-summary {
	min-width: 0;
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}
.my-name {
	font-size: 28rpx;
	font-weight: 700;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.my-hint {
	font-size: 21rpx;
	color: var(--muted);
	line-height: 28rpx;
}
.my-actions {
	display: flex;
	flex-shrink: 0;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
}
.gift-button {
	padding: 10rpx 24rpx;
	border-radius: 40rpx;
	background: #ffde50;
	color: #322b11;
	font-size: 26rpx;
	font-weight: 700;
}
.my-value {
	font-size: 19rpx;
	color: var(--muted);
}
.state-panel {
	min-height: 520rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 18rpx;
	color: var(--muted);
	font-size: 28rpx;
}
.empty-title {
	color: var(--text);
	font-weight: 600;
}
.empty-hint {
	font-size: 24rpx;
}
.retry-button {
	color: var(--gold);
	padding: 12rpx 24rpx;
}
.tipping-sheet {
	max-height: 76vh;
	overflow-y: auto;
	background: #fafafa;
	border-radius: 24rpx 24rpx 0 0;
	padding-bottom: env(safe-area-inset-bottom);
}
.dark-mode {
	.board-switch {
		background: #3b3529;
	}
	.board-tab {
		color: #b9b5ab;
		&.active {
			color: #fff1b7;
		}
	}
	.switch-highlight {
		background: #615126;
	}
	.medal-0 {
		background: linear-gradient(100deg, #3e3420, transparent);
	}
	.medal-1 {
		background: linear-gradient(100deg, #273142, transparent);
	}
	.medal-2 {
		background: linear-gradient(100deg, #3b2d24, transparent);
	}
	.contribution-value,
	.rank-number {
		color: #ddd;
	}
	.my-contribution {
		border-color: #4b4025;
	}
	.tipping-sheet {
		background: #222;
	}
}
@media (prefers-reduced-motion: reduce) {
	.switch-highlight,
	.board-tab {
		transition: none;
	}
}
</style>
