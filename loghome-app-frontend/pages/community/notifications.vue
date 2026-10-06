<template>
	<view class="outer" v-dark>
		<!-- 消息/历史消息切换 -->
		<view class="tab-bar">
			<view class="tab-item" :class="{ active: viewTab === 'current' }" @click="switchTab('current')">消息</view>
			<view class="tab-item" :class="{ active: viewTab === 'history' }" @click="switchTab('history')">历史消息</view>
		</view>

		<!-- 系统消息筛选 -->
		<view class="filter-bar" v-if="viewTab === 'current'">
			<view class="filter-chip" :class="{ active: viewFilter === 'all' }" @click="viewFilter = 'all'">全部</view>
			<view class="filter-chip" :class="{ active: viewFilter === 'system' }" @click="viewFilter = 'system'">仅看系统消息</view>
			<view class="filter-chip" :class="{ active: viewFilter === 'other' }" @click="viewFilter = 'other'">其他</view>
		</view>

		<!-- 当前消息列表 -->
		<view class="list" v-if="viewTab === 'current'">
			<div v-for="group in currentGroups" :key="group.key" class="msg-group">
				<view class="swipe-delete clickable" v-if="swipeId === group.key || isDragging(group.key)"
					@click.stop="onDeleteTap(group)">
					<uni-icons type="trash" size="26" color="#ffffff"></uni-icons>
				</view>
				<view class="swipe-content" :class="{ anim: !isDragging(group.key) }"
					:style="{ transform: 'translateX(' + rowOffset(group.key) + 'px)' }"
					@touchstart="onTouchStart($event, group)" @touchmove="onTouchMove($event, group)"
					@touchend="onTouchEnd($event, group)" @mousedown="onTouchStart($event, group)"
					@mousemove="onTouchMove($event, group)" @mouseup="onTouchEnd($event, group)">
					<div class="users" @click="onRowClick(group)">
						<navigator class="avators" :url="'../users/personalPage?id='+group.items[0].from_id">
							<user-avatar class="message-avatar" :src="group.items[0].avatar_url"
								:frame="group.items[0].avatar_frame"
								:visual-scale="group.items[0].avatar_frame ? 1.25 : 1" />
						</navigator>
						<navigator class="users nav-body"
							:url="group.items[0].router ? '../' + group.items[0].router : './'">
							<div class="personInfo" style="display: flex; flex-direction: column; justify-content: center;">
								<div class="name_time" style="display: flex; justify-content: space-between;">
									<div class="name">{{group.items[0].name}}</div>
									<div class="name_time_right">
										<div class="count-badge"
											v-if="group.items.length > 1"
											@click.stop="toggleGroup(group.key)">
											{{ expandedGroups[group.key] ? '收起' : '共 ' + group.items.length + ' 条' }}
										</div>
										<div class="time" style="margin-right: 20rpx;">{{utc2beijing(group.items[0].time)}}</div>
									</div>
								</div>
								<div class="motto">{{group.items[0].message_content}}</div>
							</div>
						</navigator>
					</div>
				</view>
				<view class="folded-list" v-if="expandedGroups[group.key] && group.items.length > 1">
					<div class="folded-item" v-for="(sub, i) in group.items.slice(1)" :key="i">
						<text class="folded-time">{{utc2beijing(sub.time)}}</text>
						<text class="folded-content">{{sub.message_content}}</text>
					</div>
				</view>
			</div>

			<div class="nouser" v-if="!loading && currentGroups.length == 0" :style="{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '300rpx',
				backgroundColor: $store.state.isDarkMode ? 'var(--background-color)' : '#F2F2F2',
				color: $store.state.isDarkMode ? 'var(--text-color-regular)' : '#333'
			}">
				暂无消息
			</div>
		</view>

		<!-- 历史消息列表（超过14天的通知 + 已隐藏的消息，重复的折叠只显示最新一条） -->
		<view class="list" v-else>
			<div class="msg-group" v-for="group in historyGroups" :key="group.key">
				<div class="users">
					<navigator class="avators" :url="'../users/personalPage?id='+group.items[0].from_id">
						<user-avatar class="message-avatar" :src="group.items[0].avatar_url"
							:frame="group.items[0].avatar_frame"
							:visual-scale="group.items[0].avatar_frame ? 1.25 : 1" />
					</navigator>
					<navigator class="users nav-body"
						:url="group.items[0].router ? '../' + group.items[0].router : './'">
						<div class="personInfo" style="display: flex; flex-direction: column; justify-content: center;">
							<div class="name_time" style="display: flex; justify-content: space-between;">
								<div class="name">{{group.items[0].name}}</div>
								<div class="name_time_right">
									<div class="count-badge" v-if="group.items.length > 1">
										共 {{group.items.length}} 条
									</div>
									<div class="time" style="margin-right: 20rpx;">{{utc2beijing(group.items[0].time)}}</div>
								</div>
							</div>
							<div class="motto">{{group.items[0].message_content}}</div>
						</div>
					</navigator>
				</div>
			</div>

			<div class="nouser" v-if="!loading && historyGroups.length == 0" :style="{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '300rpx',
				backgroundColor: $store.state.isDarkMode ? 'var(--background-color)' : '#F2F2F2',
				color: $store.state.isDarkMode ? 'var(--text-color-regular)' : '#333'
			}">
				暂无历史消息
			</div>
		</view>
	</view>
</template>

<script>
	import axios from 'axios'
	import darkModeMixin from '@/mixins/dark-mode.js'

	// 通知超过该天数自动进入历史消息
	const AUTO_HISTORY_DAYS = 14;

	export default{
		mixins: [darkModeMixin],
		data(){
			return{
				id: -1,
				user: {},
				notifications: [], // 全部当前消息（系统通知 + 私信/活动等其他消息）
				historyNotifications: [], // 历史消息（已隐藏 + 超过14天的通知）
				expandedGroups: {}, // 折叠分组的展开状态
				viewTab: 'current', // current-当前消息 history-历史消息
				viewFilter: 'all', // all-全部 system-仅看系统消息 other-其他
				swipeId: null, // 当前左滑展开删除按钮的分组 key
				drag: null, // 跟手拖动状态 { key, startX, startY, base, horizontal, dx }
				deleteWidth: 70, // 删除按钮宽度(px)，created 时按 rpx 换算
				loading: true, // 消息加载中，避免显示"暂无消息"误导
			}
		},
		created() {
			// 140rpx 按钮宽 + 10rpx 右边距，换算为 px，保证拖动位移与按钮完全露出对齐
			if (typeof uni !== 'undefined' && uni.upx2px) {
				this.deleteWidth = uni.upx2px(150);
			}
		},
		computed: {
			filteredNotifications() {
				if (this.viewFilter === 'system') {
					return this.notifications.filter(i => i.message_type === 'notification');
				}
				if (this.viewFilter === 'other') {
					return this.notifications.filter(i => i.message_type !== 'notification');
				}
				return this.notifications;
			},
			currentGroups() {
				return this.groupItems(this.filteredNotifications);
			},
			historyGroups() {
				return this.groupItems(this.historyNotifications);
			}
		},
		onShow(){
			let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
			let _this = this;
			if(tk == null){
				uni.navigateTo({
					url: './users/login?msg=' + 'unAuthorized'
				});
				return;
			}
			this.loading = true;
			//验活
			axios.get( this.$baseUrl + '/users/userprofile', {
				headers: {
				     'Content-Type': 'application/json',
				     'Authorization': tk
				}
			}).then((res) => {
				_this.user = JSON.parse(JSON.stringify(res.data));
				_this.id = _this.user.user_id;

				// 先把内容完全相同的重复系统通知隐藏，只保留最新一条，再拉取列表
				axios.post(this.$baseUrl + '/users/hide_duplicate_messages', {}, {
					headers: {
					     'Content-Type': 'application/json',
					     'Authorization': tk
					}
				}).catch(() => {}).then(() => {
					// 获取消息列表
					axios.get( this.$baseUrl + '/users/get_history_message', {
						headers: {
						     'Content-Type': 'application/json',
						     'Authorization': tk
						}
					}).then((res) => {
						let messages = res.data;
						let current = [];
						let history = [];
						let cutoff = Date.now() - AUTO_HISTORY_DAYS * 24 * 60 * 60 * 1000;

						for(let i = 0 ; i < messages.length ; i ++){
							let m = messages[i];
							if(m.to_id != _this.user.user_id) continue;
							if(m.message_type === 'activity') continue; // 活动消息由 activityMessages 页单独展示
							if(m.is_read == 2){
								// 已隐藏的历史消息
								history.push(m);
							}else if(m.message_type === 'notification' && _this.msgTime(m) < cutoff){
								// 超过14天的系统通知自动进入历史消息
								history.push(m);
							}else{
								// 标记为已读
								m.is_read = 1;
								current.push(m);
							}
						}

						_this.notifications = current;
						_this.historyNotifications = history;
						_this.loading = false;
						window.localStorage.setItem("messages",JSON.stringify(messages));

						// 清除系统通知的小红点
						window.localStorage.setItem('unreadNotifications', '0');
					});
				});
			}).catch(function(error) {
				if(error.message == "Request failed with status code 401"){
					window.localStorage.removeItem('token');
					uni.navigateTo({
						url: './users/login'
					});
				}
			})
		},
		methods:{
			groupItems(list) {
				// 相同发送者 + 相同内容 + 相同类型的消息折叠为一组，保留最新时间排序
				const groups = [];
				const indexMap = {};
				for (const item of list) {
					const key = item.name + '|' + item.message_content + '|' + (item.message_type || '');
					if (indexMap[key] === undefined) {
						indexMap[key] = groups.length;
						groups.push({ key, items: [item] });
					} else {
						groups[indexMap[key]].items.push(item);
					}
				}
				return groups;
			},
			msgTime(item) {
				// 消息时间按 UTC 解析（与 utc2beijing 的 +8 小时处理一致）
				if (!item.time) return 0;
				let t = item.time;
				if (!/Z$|[+-]\d{2}:?\d{2}$/.test(t)) t = t + 'Z';
				return Date.parse(t) || 0;
			},
			toggleGroup(key) {
				this.$set(this.expandedGroups, key, !this.expandedGroups[key]);
			},
			switchTab(tab) {
				this.viewTab = tab;
				this.swipeId = null;
				this.drag = null;
			},
			isDragging(key) {
				return !!(this.drag && this.drag.key === key && this.drag.horizontal);
			},
			rowOffset(key) {
				if (this.drag && this.drag.key === key && this.drag.horizontal) {
					// 跟手拖动，限制在 [-(deleteWidth+30), 0] 区间
					return Math.max(-(this.deleteWidth + 30), Math.min(0, this.drag.base + this.drag.dx));
				}
				if (this.swipeId === key) return -this.deleteWidth;
				return 0;
			},
			onRowClick(group) {
				// 已展开删除按钮时，点击行先收起
				if (this.swipeId === group.key) this.swipeId = null;
			},
			onDeleteTap(group) {
				// 拖动过程中按钮仅展示不可点击，松手展开后才能删除
				if (this.swipeId !== group.key) return;
				this.hideMessage(group.items[0]);
			},
			pointX(e) {
				if (e.touches && e.touches.length > 0) return e.touches[0].clientX;
				if (e.changedTouches && e.changedTouches.length > 0) return e.changedTouches[0].clientX;
				return e.clientX;
			},
			pointY(e) {
				if (e.touches && e.touches.length > 0) return e.touches[0].clientY;
				if (e.changedTouches && e.changedTouches.length > 0) return e.changedTouches[0].clientY;
				return e.clientY;
			},
			onTouchStart(e, group) {
				this.drag = {
					key: group.key,
					startX: this.pointX(e),
					startY: this.pointY(e),
					base: this.swipeId === group.key ? -this.deleteWidth : 0,
					horizontal: false,
					dx: 0
				};
			},
			onTouchMove(e, group) {
				if (!this.drag || this.drag.key !== group.key) return;
				const dx = this.pointX(e) - this.drag.startX;
				const dy = this.pointY(e) - this.drag.startY;
				if (!this.drag.horizontal && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
					this.drag.horizontal = true;
				}
				if (this.drag.horizontal) this.drag.dx = dx;
			},
			onTouchEnd(e, group) {
				if (!this.drag || this.drag.key !== group.key) return;
				const d = this.drag;
				this.drag = null;
				if (!d.horizontal) return;
				const offset = Math.max(-(this.deleteWidth + 30), Math.min(0, d.base + d.dx));
				if (offset < -this.deleteWidth * 0.4) {
					// 松手吸附展开删除按钮，点击删除后才移入历史消息
					this.swipeId = group.key;
				} else {
					this.swipeId = null;
				}
			},
			hideMessage(item) {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;
				axios.post(this.$baseUrl + '/users/hide_message', { message_id: item.message_id }, {
					headers: {
					     'Content-Type': 'application/json',
					     'Authorization': tk
					}
				}).then(() => {
					this.notifications = this.notifications.filter(m => m.message_id !== item.message_id);
					item.is_read = 2;
					this.historyNotifications.unshift(item);
					this.swipeId = null;
					uni.showToast({ title: '已移入历史消息', icon: 'none' });
				}).catch(() => {
					uni.showToast({ title: '操作失败', icon: 'none' });
				});
			},
			utc2beijing(utc_datetime) {
			    // 转为正常的时间格式 年-月-日 时:分:秒
			    var T_pos = utc_datetime.indexOf('T');
			    var Z_pos = utc_datetime.indexOf('Z');
			    var year_month_day = utc_datetime.substr(0,T_pos);
			    var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
			    var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06

			    // 处理成为时间戳
			    timestamp = new Date(Date.parse(new_datetime));
			    timestamp = timestamp.getTime();
			    timestamp = timestamp/1000;

			    // 增加8个小时，北京时间比utc时间多八个时区
			    var timestamp = timestamp+8*60*60;

			    // 时间戳转为时间
				var beijing_datetime = this.timeConvert(new Date(parseInt(timestamp) * 1000))
			    return beijing_datetime; // 2017-03-31 16:02:06
			},
		}
	}
</script>

<style scoped lang="less">
	.outer{
		background-color: #ffffff;
		padding-top: 4px;

		&.dark-mode {
			background-color: var(--background-color);
		}
	}

	.tab-bar {
		display: flex;
		gap: 40rpx;
		padding: 20rpx 30rpx;
		border-bottom: #ececec solid 1px;

		.dark-mode & {
			border-bottom: #333 solid 1px;
		}

		.tab-item {
			font-size: 30rpx;
			color: #666;
			padding-bottom: 8rpx;
			border-bottom: 4rpx solid transparent;

			.dark-mode & {
				color: #999;
			}

			&.active {
				color: rgb(180, 111, 88);
				border-bottom-color: rgb(180, 111, 88);
				font-weight: 600;

				.dark-mode & {
					color: rgb(220, 151, 128);
					border-bottom-color: rgb(220, 151, 128);
				}
			}
		}
	}

	.filter-bar {
		display: flex;
		gap: 16rpx;
		padding: 18rpx 30rpx;

		.filter-chip {
			padding: 6rpx 22rpx;
			border-radius: 100rpx;
			font-size: 24rpx;
			color: #666;
			background-color: #f2f2f2;
			border: 1px solid transparent;

			.dark-mode & {
				color: #aaa;
				background-color: var(--background-color-secondary);
			}

			&.active {
				color: rgb(180, 111, 88);
				background-color: rgba(180, 111, 88, 0.12);
				border-color: rgba(180, 111, 88, 0.4);
				font-weight: 600;

				.dark-mode & {
					color: rgb(220, 151, 128);
					background-color: rgba(220, 151, 128, 0.15);
					border-color: rgba(220, 151, 128, 0.4);
				}
			}
		}
	}

	.msg-group {
		position: relative;
		overflow: hidden;
	}

	.swipe-delete {
		position: absolute;
		top: 10rpx;
		right: 10rpx;
		bottom: 10rpx;
		width: 140rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 24rpx;
		background-color: #ec4e63;
		color: #ffffff;
		font-size: 28rpx;

		.dark-mode & {
			background-color: #c23a4d;
		}
	}

	.swipe-content {
		position: relative;
		z-index: 1;
		background-color: #ffffff;

		&.anim {
			transition: transform 0.25s ease;
		}

		.dark-mode & {
			background-color: var(--background-color-secondary);
		}
	}

	.users {
		width: 100vw;
		display: flex;
		position: relative;

		.dark-mode & {
			background-color: var(--background-color-secondary);
		}

		.avators {
			position: relative;

			.message-avatar {
				width: 100rpx;
				height: 100rpx;
				margin: 15rpx;
			}
		}

		.nav-body {
			width: auto;
			flex: 1;
		}

		.personInfo{
			position: relative;
			border-bottom: #cacaca solid 1px;
			flex: 1;

			.dark-mode & {
				border-bottom: #444 solid 1px;
			}

			.name_time {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 15rpx;
				padding-right: 15rpx;
			}

			.name_time_right {
				display: flex;
				align-items: center;
				gap: 14rpx;
			}

			.count-badge {
				padding: 4rpx 18rpx;
				border-radius: 100rpx;
				background-color: rgba(180, 111, 88, 0.12);
				color: rgb(180, 111, 88);
				font-size: 22rpx;
				font-weight: 600;
				white-space: nowrap;

				.dark-mode & {
					background-color: rgba(220, 151, 128, 0.15);
					color: rgb(220, 151, 128);
				}
			}

			.time{
				font-size: 30rpx;
				color: #999;

				.dark-mode & {
					color: #777;
				}
			}
		}

		.name {
			font-size: 32rpx;
			height: 40rpx;
			overflow: hidden;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			color: rgb(180, 111, 88);

			.dark-mode & {
				color: rgb(220, 151, 128);
			}
		}

		.motto{
			color: rgb(97, 97, 97);
			width: 80vw;
			margin-top: 8rpx;
			font-size: 28rpx;
			margin-bottom: 10rpx;

			.dark-mode & {
				color: var(--text-color-regular);
			}
		}
	}

	.folded-list {
		margin-left: 130rpx;
		padding: 0 30rpx 12rpx 0;
		border-bottom: #cacaca solid 1px;

		.dark-mode & {
			border-bottom: #444 solid 1px;
			background-color: var(--background-color-secondary);
		}

		.folded-item {
			display: flex;
			flex-direction: column;
			padding: 12rpx 0;
			border-bottom: dashed 1px #e5e5e5;

			&:last-child {
				border-bottom: none;
			}

			.dark-mode & {
				border-bottom-color: #3a3a3a;
			}

			.folded-time {
				font-size: 22rpx;
				color: #999;

				.dark-mode & {
					color: #777;
				}
			}

			.folded-content {
				margin-top: 4rpx;
				font-size: 26rpx;
				color: rgb(97, 97, 97);

				.dark-mode & {
					color: var(--text-color-regular);
				}
			}
		}
	}
</style>
