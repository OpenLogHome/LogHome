<template>
	<view class="container" v-dark>
		<view class="task-list" v-if="tasks.length > 0">
			<view class="task-item" v-for="task in tasks" :key="task.task_id">
				<view class="task-info">
					<view class="novel-name">《{{ task.novel_name }}》</view>
					<view class="article-title">{{ $t('writer.work.scheduled.chapterLine', { chapter: task.article_chapter, title: task.article_title }) }}</view>
					<view class="publish-time">{{ $t('writer.work.scheduled.scheduledTime', { time: formatTime(task.publish_time) }) }}</view>
				</view>
				<view class="task-actions">
					<button size="mini" type="warn" @click="cancelTask(task)">{{ $t('writer.work.scheduled.cancelPublish') }}</button>
				</view>
			</view>
		</view>

		<view class="empty-state" v-else>
			<text>{{ $t('writer.work.scheduled.empty') }}</text>
		</view>
	</view>
</template>

<script>
	import axios from 'axios';

	export default {
		data() {
			return {
				tasks: []
			};
		},
		onShow() {
			this.fetchTasks();
		},
		methods: {
			formatTime(timeStr) {
				if (!timeStr) return '';
				const date = new Date(timeStr);
				return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
			},
			async fetchTasks() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;

				try {
					const res = await axios.get(this.$baseUrl + '/essays/get_scheduled_tasks', {
						headers: {
							'Authorization': 'Bearer ' + tk
						}
					});
					this.tasks = res.data;
				} catch (error) {
					console.error(error);
					uni.showToast({
						title: this.$t('writer.work.scheduled.loadTasksFailed'),
						icon: 'none'
					});
				}
			},
			async cancelTask(task) {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;

				uni.showModal({
					title: this.$t('writer.work.scheduled.confirmCancel'),
					content: this.$t('writer.work.scheduled.cancelConfirm', { name: task.novel_name }),
					success: async (res) => {
						if (res.confirm) {
							try {
								await axios.post(this.$baseUrl + '/essays/cancel_scheduled_task',
									{ task_id: task.task_id },
									{
										headers: {
											'Authorization': 'Bearer ' + tk,
											'Content-Type': 'application/json'
										}
									}
								);
								uni.showToast({
									title: this.$t('writer.work.scheduled.cancelled'),
									icon: 'success'
								});
								this.fetchTasks();
							} catch (error) {
								console.error(error);
								uni.showToast({
									title: this.$t('writer.work.scheduled.cancelFailed'),
									icon: 'none'
								});
							}
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 20px;
		max-width: 800px;
		margin: 0 auto;
	}

	.header {
		margin-bottom: 20px;
		border-bottom: 1px solid var(--border-color);
		padding-bottom: 10px;

		.title {
			font-size: 20px;
			font-weight: bold;
		}
	}

	.task-item {
		background-color: var(--card-background);
		border-radius: 8px;
		padding: 15px;
		margin-bottom: 15px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: space-between;
		align-items: center;

		.task-info {
			.novel-name {
				font-size: 14px;
				color: var(--text-color-regular);
				margin-bottom: 5px;
			}

			.article-title {
				font-size: 16px;
				font-weight: bold;
				margin-bottom: 5px;
				color: var(--text-color-primary);
			}

			.publish-time {
				font-size: 14px;
				color: var(--text-color-secondary);
			}
		}
	}

	.empty-state {
		text-align: center;
		color: var(--text-color-secondary);
		padding: 50px 0;
	}
</style>