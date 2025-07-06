<template>
    <view class="chat-container"
        :style="{ '--statusBarHeight': 0 + 'px' }">
        <followBtn class="follow-btn" :targetId="Number(friend_id)"/>
        <view class="messages">
            <div v-for="message in sortedMessages" :key="message.id" class="message-wrapper"
                :class="{ 'my-message-wrapper': message.sender_id === user_id }">
                <log-image v-if="message.sender_id !== user_id" class="avatar" :src="friend.avatar_url"
                    onerror="onerror=null;src='../static/user/defaultAvatar.jpg'" />
                <log-image v-if="message.sender_id === user_id" class="avatar" :src="user.avatar_url"
                    onerror="onerror=null;src='../static/user/defaultAvatar.jpg'" />
                <div class="message-content" :class="{ 'my-message': message.sender_id === user_id }">
                    <text>{{ message.message_content }}</text>
                    <view class="message-footer">
                        <text class="time">{{ utc2beijing(message.sent_at) }}</text>
                        <text v-if="message.sender_id === user_id" class="read-status">
                            {{ message.is_read ? '已读' : '未读' }}
                        </text>
                    </view>
                </div>
            </div>
        </view>

        <!-- 新消息提示 -->
        <view v-if="showNewMessageToast" class="new-message-toast" @click="scrollToBottom">
            <view class="toast-content">
                <text>收到新消息</text>
                <i class="el-icon-arrow-down toast-arrow"></i>
            </view>
        </view>

        <view class="input-container">
            <input v-model="newMessage" placeholder="输入消息..." />
            <button @click="sendMessage">发送</button>
        </view>
    </view>
</template>

<script>
import axios from 'axios';
import followBtn from '../../components/follow.vue'

export default {
    data() {
        return {
            messages: [],
            newMessage: '',
            user_id: -1,
            friend_id: -1,
            user: {},
            friend: {},
            page: 1,
            pageSize: 10,
            loading: false,
            noMoreMessages: false,
            pollingInterval: null,
            latestMessageId: null,
            showNewMessageToast: false,
            toastTimer: null,
            isAtBottom: true // 标记用户是否在查看最新消息
        };
    },
    components: {
        followBtn
    },
    computed: {
        sortedMessages() {
            // 按照发送时间排序，确保最新的消息在底部
            return [...this.messages].sort((a, b) => {
                return new Date(a.sent_at) - new Date(b.sent_at);
            });
        }
    },
    methods: {
        async fetchMessages(loadMore = false) {
            if (this.loading || (loadMore && this.noMoreMessages)) return;

            this.loading = true;
            try {
                // 获取当前消息列表中最早的消息ID
                const lastMessageId = loadMore && this.messages.length > 0 ?
                    Math.min(...this.messages.map(m => m.id)) : null;

                // 在加载更多消息前记录当前滚动位置和高度
                let scrollContainer = null;
                let oldScrollHeight = 0;
                let oldScrollTop = 0;

                if (loadMore) {
                    scrollContainer = document.querySelector('.messages');
                    if (scrollContainer) {
                        oldScrollHeight = scrollContainer.scrollHeight;
                        oldScrollTop = scrollContainer.scrollTop;
                    }
                }

                const response = await axios.get(this.$baseUrl + '/community/message_history', {
                    params: {
                        friend_id: this.friend_id,
                        pageSize: this.pageSize,
                        lastMessageId: lastMessageId
                    },
                    headers: {
                        'Authorization': 'Bearer ' + JSON.parse(window.localStorage.getItem('token')).tk
                    }
                });

                if (response.data.length === 0) {
                    this.noMoreMessages = true;
                } else {
                    if (loadMore) {
                        // 确保不添加重复消息
                        const existingIds = new Set(this.messages.map(m => m.id));
                        const newMessages = response.data.filter(m => !existingIds.has(m.id));

                        this.messages = [...newMessages, ...this.messages];

                        // 在DOM更新后调整滚动位置
                        this.$nextTick(() => {
                            if (scrollContainer) {
                                // 计算新增内容的高度，并相应调整滚动位置
                                const newScrollHeight = scrollContainer.scrollHeight;
                                const heightDifference = newScrollHeight - oldScrollHeight;
                                scrollContainer.scrollTop = oldScrollTop + heightDifference;
                            }
                        });
                    } else {
                        this.messages = response.data;
                        this.noMoreMessages = false;

                        // 初次加载时滚动到底部
                        this.$nextTick(() => {
                            this.scrollToBottom();
                        });
                    }

                    // 更新最新消息ID
                    if (this.messages.length > 0) {
                        this.latestMessageId = Math.max(...this.messages.map(m => m.id));
                    }

                    // 标记接收到的消息为已读
                    this.markReceivedMessagesAsRead();
                }
            } catch (error) {
                console.error('获取消息失败', error);
            } finally {
                this.loading = false;
                uni.hideLoading();
            }
        },

        // 标记接收到的消息为已读
        async markReceivedMessagesAsRead() {
            // 找出所有未读的且不是自己发送的消息
            const unreadMessages = this.messages.filter(m =>
                !m.is_read &&
                m.sender_id !== this.user_id &&
                !m.isTemp &&
                typeof m.id === 'number'
            );

            // 标记这些消息为已读
            for (const message of unreadMessages) {
                try {
                    await axios.post(this.$baseUrl + '/community/mark_as_read', {
                        message_id: message.id
                    }, {
                        headers: {
                            'Authorization': 'Bearer ' + JSON.parse(window.localStorage.getItem('token')).tk
                        }
                    });

                    // 更新本地消息状态
                    message.is_read = true;
                } catch (error) {
                    console.error('标记消息已读失败', error);
                }
            }
        },

        // 轮询获取新消息
        async pollNewMessages() {
            if (!this.friend_id) return;

            try {
                // 获取最新的非临时消息ID
                const realMessages = this.messages.filter(m => !m.isTemp);
                const latestRealId = realMessages.length > 0 ?
                    Math.max(...realMessages.map(m => typeof m.id === 'string' ? 0 : m.id)) : 0;

                // 1. 获取新消息
                const response = await axios.get(this.$baseUrl + '/community/new_messages', {
                    params: {
                        friend_id: this.friend_id,
                        since_id: latestRealId
                    },
                    headers: {
                        'Authorization': 'Bearer ' + JSON.parse(window.localStorage.getItem('token')).tk
                    }
                });

                let hasNewMessages = false;
                let hasNewIncomingMessages = false; // 是否有新的接收消息

                if (response.data.length > 0) {
                    // 处理每一条新消息
                    for (const newMsg of response.data) {
                        // 检查是否已存在相同ID的消息
                        const existingMsgIndex = this.messages.findIndex(m => m.id === newMsg.id);
                        if (existingMsgIndex !== -1) {
                            // 已存在相同ID的消息，更新其已读状态
                            this.messages[existingMsgIndex].is_read = newMsg.is_read;
                            continue;
                        }

                        // 检查是否有内容相同的临时消息
                        const tempMsgIndex = this.messages.findIndex(m =>
                            m.isTemp &&
                            m.sender_id === newMsg.sender_id &&
                            m.message_content === newMsg.message_content
                        );

                        if (tempMsgIndex !== -1) {
                            // 找到了对应的临时消息，替换它
                            this.messages.splice(tempMsgIndex, 1, newMsg);
                        } else {
                            // 没有找到对应的临时消息，添加新消息
                            this.messages.push(newMsg);
                            hasNewMessages = true;

                            // 如果是接收到的消息（不是自己发的），标记为有新的接收消息
                            if (newMsg.sender_id !== this.user_id) {
                                hasNewIncomingMessages = true;
                            }
                        }
                    }
                }

                // 2. 获取现有消息的已读状态更新
                if (realMessages.length > 0) {
                    // 获取所有自己发送的消息ID
                    const sentMessageIds = realMessages
                        .filter(m => m.sender_id === this.user_id)
                        .map(m => m.id);

                    if (sentMessageIds.length > 0) {
                        const readStatusResponse = await axios.get(this.$baseUrl + '/community/messages_read_status', {
                            params: {
                                message_ids: sentMessageIds.join(',')
                            },
                            headers: {
                                'Authorization': 'Bearer ' + JSON.parse(window.localStorage.getItem('token')).tk
                            }
                        });

                        if (readStatusResponse.data && readStatusResponse.data.length > 0) {
                            // 更新消息的已读状态
                            for (const statusUpdate of readStatusResponse.data) {
                                const msgIndex = this.messages.findIndex(m => m.id === statusUpdate.id);
                                if (msgIndex !== -1) {
                                    this.messages[msgIndex].is_read = statusUpdate.is_read;
                                }
                            }
                        }
                    }
                }

                // 重新排序消息
                this.messages.sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at));

                // 如果有新消息
                if (hasNewMessages) {
                    // 检查用户是否在底部
                    const messagesContainer = document.querySelector('.messages');
                    if (messagesContainer) {
                        // 更新isAtBottom状态
                        this.isAtBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight < 50;

                        // 如果用户在底部，则滚动到底部显示新消息
                        if (this.isAtBottom) {
                            this.$nextTick(() => {
                                this.scrollToBottom();
                            });
                        }
                        // 如果用户不在底部且收到了新的接收消息，显示新消息提示
                        else if (hasNewIncomingMessages) {
                            this.showNewMessageNotification();
                        }
                    }

                    // 标记新接收到的消息为已读
                    this.markReceivedMessagesAsRead();
                }
            } catch (error) {
                console.error('轮询新消息失败', error);
            }
        },

        // 开始轮询
        startPolling() {
            // 每3秒轮询一次新消息
            this.pollingInterval = setInterval(() => {
                this.pollNewMessages();
            }, 3000);
        },

        // 停止轮询
        stopPolling() {
            if (this.pollingInterval) {
                clearInterval(this.pollingInterval);
                this.pollingInterval = null;
            }
        },

        scrollToBottom() {
            const messagesContainer = document.querySelector('.messages');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        },

        handleScroll(e) {
            const messagesContainer = e.target;

            // 检测用户是否在底部
            this.isAtBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight < 50;

            // 如果用户滚动到底部，隐藏新消息提示
            if (this.isAtBottom && this.showNewMessageToast) {
                this.hideNewMessageToast();
            }

            // 当滚动到顶部时加载更多消息
            if (messagesContainer.scrollTop === 0 && !this.loading && !this.noMoreMessages) {
                uni.showLoading({
                    title: '加载中',
                    mask: true
                });
                this.fetchMessages(true);
            }
        },

        async sendMessage() {
            if (!this.newMessage.trim()) return;
            try {
                const messageContent = this.newMessage.trim();
                this.newMessage = '';

                // 创建临时消息对象
                const tempMessage = {
                    id: 'temp_' + Date.now(), // 添加temp_前缀标记为临时消息
                    sender_id: this.user_id,
                    message_content: messageContent,
                    sent_at: new Date().toISOString(),
                    isTemp: true, // 添加标记表示这是临时消息
                    is_read: false // 初始状态为未读
                };

                // 添加临时消息到列表
                this.messages.push(tempMessage);

                // 发送消息后滚动到底部
                this.$nextTick(() => {
                    this.scrollToBottom();
                });

                // 发送消息到服务器
                const response = await axios.post(this.$baseUrl + '/community/send_message', {
                    to_id: this.friend_id,
                    message_content: messageContent
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + JSON.parse(window.localStorage.getItem('token')).tk
                    }
                });

                // 如果服务器返回了消息ID，更新临时消息
                if (response.data && response.data.id) {
                    const index = this.messages.findIndex(m => m.id === tempMessage.id);
                    if (index !== -1) {
                        this.messages[index].id = response.data.id;
                        this.messages[index].isTemp = false;
                        // 更新最新消息ID
                        this.latestMessageId = Math.max(this.latestMessageId || 0, response.data.id);
                    }
                }
            } catch (error) {
                uni.showToast({
                    title: "发送失败",
                    icon: 'none',
                    duration: 2000
                });
            }
        },
        utc2beijing(utc_datetime) {
            // 转为正常的时间格式 年-月-日 时:分:秒
            var T_pos = utc_datetime.indexOf('T');
            var Z_pos = utc_datetime.indexOf('Z');
            var year_month_day = utc_datetime.substr(0, T_pos);
            var hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1);
            var new_datetime = year_month_day + " " + hour_minute_second; // 2017-03-31 08:02:06

            // 处理成为时间戳
            timestamp = new Date(Date.parse(new_datetime));
            timestamp = timestamp.getTime();
            timestamp = timestamp / 1000;

            // 增加8个小时，北京时间比utc时间多八个时区
            var timestamp = timestamp + 8 * 60 * 60;

            // 时间戳转为时间
            var beijing_datetime = this.timeConvert(new Date(parseInt(timestamp) * 1000))
            return beijing_datetime;
        },
        // 显示新消息提示
        showNewMessageNotification() {
            this.showNewMessageToast = true;

            // 5秒后自动隐藏提示
            if (this.toastTimer) {
                clearTimeout(this.toastTimer);
            }

            this.toastTimer = setTimeout(() => {
                this.hideNewMessageToast();
            }, 5000);
        },
        // 隐藏新消息提示
        hideNewMessageToast() {
            this.showNewMessageToast = false;
            if (this.toastTimer) {
                clearTimeout(this.toastTimer);
                this.toastTimer = null;
            }
        },
        // 更新未读私信计数
        async updateUnreadMessagesCount() {
            try {
                // 获取当前未读私信总数
                const token = JSON.parse(window.localStorage.getItem('token'));
                const response = await axios.get(this.$baseUrl + '/community/unread_messages_count', {
                    headers: {
                        'Authorization': 'Bearer ' + token.tk
                    }
                });

                // 更新本地存储
                window.localStorage.setItem('unreadPrivateMessages', response.data.count);
            } catch (error) {
                console.error('更新未读私信计数失败', error);
            }
        },
    },
    onLoad(params) {
        if (params.id) {
            this.friend_id = parseInt(params.id);
            const token = JSON.parse(window.localStorage.getItem('token'));
            this.user_id = token.id;

            // 获取好友信息
            axios.get(this.$baseUrl + '/users/user_profile_of?id=' + this.friend_id).then((res) => {
                this.friend = JSON.parse(JSON.stringify(res.data))[0];
                uni.setNavigationBarTitle({
                    title: this.friend.name
                });
            });

            // 获取自己的信息
            axios.get(this.$baseUrl + '/users/userprofile', {
                headers: {
                    'Authorization': 'Bearer ' + token.tk
                }
            }).then((res) => {
                this.user = res.data;
            });

            this.fetchMessages();

            // 更新未读私信计数
            this.updateUnreadMessagesCount();
        }
    },
    mounted() {
        // 添加滚动事件监听
        const messagesContainer = document.querySelector('.messages');
        if (messagesContainer) {
            messagesContainer.addEventListener('scroll', this.handleScroll);
        }

        // 开始轮询新消息
        this.startPolling();
    },
    beforeDestroy() {
        // 移除滚动事件监听
        const messagesContainer = document.querySelector('.messages');
        if (messagesContainer) {
            messagesContainer.removeEventListener('scroll', this.handleScroll);
        }

        // 停止轮询
        this.stopPolling();

        // 清除toast定时器
        if (this.toastTimer) {
            clearTimeout(this.toastTimer);
            this.toastTimer = null;
        }
    }
};
</script>

<style>
.chat-container {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 44px - var(--statusBarHeight));
    background-color: #f5f5f5;
    position: relative;

    .follow-btn{
        position: fixed;
        top: calc(var(--statusBarHeight) + 10rpx);
        right: -6rpx;
        z-index:99999;
        transform: scale(0.8);
    }
}

.messages {
    flex: 1;
    overflow-y: auto;
    padding: 20rpx;
}

.message-wrapper {
    display: flex;
    margin: 20rpx 0;
    align-items: flex-start;
}

.my-message-wrapper {
    flex-direction: row-reverse;
}

.avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin: 0 20rpx;
}

.message-content {
    max-width: 60%;
    padding: 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
    position: relative;
}

.my-message {
    background-color: #95ec69;
}

.message-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10rpx;
}

.time {
    font-size: 24rpx;
    color: #999;
    display: block;
}

.read-status {
    font-size: 24rpx;
    color: #999;
    margin-left: 10rpx;
}

.input-container {
    display: flex;
    padding: 20rpx;
    background-color: #fff;
    border-top: 1px solid #eee;
}

input {
    flex: 1;
    padding: 20rpx;
    border: 1px solid #ddd;
    border-radius: 15rpx;
    /* margin-right: 20rpx; */
    height: 80rpx;
    box-sizing: border-box;
    margin-right:20rpx;
}

button {
    height: 80rpx !important;
    padding: 0 30rpx !important;
    background-color: #007aff;
    color: #fff;
    border: none;
    border-radius: 10rpx;
}

button:active{
    background-color: #0056b3;
}

.new-message-toast {
    position: fixed;
    bottom: 150rpx;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.7);
    padding: 15rpx 30rpx;
    border-radius: 30rpx;
    z-index: 1000;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2);
    animation: fadeIn 0.3s ease-in-out;
}

.toast-content {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 28rpx;
}

.toast-arrow {
    font-size: 28rpx;
    margin-left: 10rpx;
    animation: bounce 1s infinite;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translate(-50%, 20rpx);
    }

    to {
        opacity: 1;
        transform: translate(-50%, 0);
    }
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(5rpx);
    }
}
</style>
