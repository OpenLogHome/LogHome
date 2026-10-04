<template>
    <view class="chat-container" v-dark>
        <followBtn class="follow-btn" :targetId="Number(friend_id)"/>
        <view class="messages">
            <div v-for="message in sortedMessages" :key="message.id" class="message-wrapper"
                :class="{ 'my-message-wrapper': message.sender_id === user_id }">
                <user-avatar v-if="message.sender_id !== user_id" class="avatar" :src="friend.avatar_url"
                    :frame="friend.avatar_frame" :visual-scale="friend.avatar_frame ? 1.2 : 1" />
                <user-avatar v-if="message.sender_id === user_id" class="avatar" :src="user.avatar_url"
                    :frame="user.avatar_frame" :visual-scale="user.avatar_frame ? 1.2 : 1" />
                <div class="message-content" :class="[
                    { 'my-message': message.sender_id === user_id },
                    message.displayType !== 'text' ? 'media-message' : ''
                ]">
                    <template v-if="message.displayType === 'image'">
                        <log-image class="message-image" :src="message.imageUrl" mode="aspectFill"
                            @click="previewMessageImage(message.imageUrl)" />
                    </template>
                    <template v-else-if="message.displayType === 'novel_share'">
                        <view class="shared-book-card" @click="openSharedNovel(message.novel)">
                            <log-image class="shared-book-cover" :src="getSharedNovelCover(message.novel)"
                                mode="aspectFill"
                                onerror="onerror=null;src='../../static/images/defaultBookCover.png'"></log-image>
                            <view class="shared-book-info">
                                <text class="shared-book-tag">分享了作品</text>
                                <text class="shared-book-title">{{ message.novel.name }}</text>
                                <text class="shared-book-author">{{ message.novel.author_name }}</text>
                                <text class="shared-book-desc">{{ getSharedNovelDescription(message.novel) }}</text>
                            </view>
                        </view>
                    </template>
                    <template v-else>
                        <text class="message-text">{{ message.displayText }}</text>
                    </template>
                    <view class="message-footer">
                        <text class="time">{{ utc2beijing(message.sent_at) }}</text>
                        <text v-if="message.sender_id === user_id" class="read-status">
                            {{ formatReadStatus(message) }}
                        </text>
                    </view>
                </div>
            </div>
        </view>

        <view v-if="showNewMessageToast" class="new-message-toast" @click="scrollToBottom">
            <view class="toast-content">
                <text>收到新消息</text>
                <i class="el-icon-arrow-down toast-arrow"></i>
            </view>
        </view>

        <view class="input-container">
            <view class="tool-row">
                <view class="tool-button" :class="{ disabled: imageUploadState.uploading }" @click="chooseAndSendImage">
                    <i class="el-icon-picture-outline tool-button-icon"></i>
                    <text>图片</text>
                </view>
                <view class="tool-button" :class="{ disabled: isAnyBookTabLoading }" @click="openBookSelector">
                    <i class="el-icon-reading tool-button-icon"></i>
                    <text>作品</text>
                </view>
                <text v-if="imageUploadState.uploading" class="tool-tip">
                    图片上传中 {{ imageUploadState.progress }}%
                </text>
                <text v-else-if="isAnyBookTabLoading" class="tool-tip">
                    作品列表加载中...
                </text>
            </view>
            <view class="input-row">
                <input class="message-input" v-model="newMessage" placeholder="输入消息..." confirm-type="send"
                    @confirm="sendMessage" />
                <view class="input-actions">
                    <emoji-picker class="chat-emoji-picker" @select="onEmojiSelect"></emoji-picker>
                    <button class="send-button" @click="sendMessage">发送</button>
                </view>
            </view>
        </view>

        <view v-if="showBookSelector" class="book-selector-mask" :class="{ visible: bookSelectorVisible }"
            @click="closeBookSelector">
            <view class="book-selector-panel" @click.stop>
                <view class="book-selector-header">
                    <text class="book-selector-title">分享作品</text>
                    <text class="book-selector-close" @click="closeBookSelector">关闭</text>
                </view>
                <view class="book-selector-tabs">
                    <view v-for="tab in bookSelectorTabs" :key="tab.key" class="book-selector-tab"
                        :class="{ active: activeBookTab === tab.key }" @click="switchBookSelectorTab(tab.key)">
                        <text>{{ tab.label }}</text>
                    </view>
                </view>
                <view class="book-search-row">
                    <input class="book-search-input" v-model="bookKeyword" :placeholder="currentBookSearchPlaceholder" />
                </view>
                <scroll-view scroll-y class="book-selector-list">
                    <view v-if="isCurrentBookTabLoading" class="book-selector-empty">{{ currentBookLoadingText }}</view>
                    <view v-else-if="filteredBooks.length === 0" class="book-selector-empty">{{ currentBookEmptyText }}</view>
                    <view v-for="book in filteredBooks" :key="activeBookTab + '_' + book.novel_id" class="book-item" @click="shareBook(book)">
                        <log-image class="book-item-cover" :src="getSharedNovelCover(book)" mode="aspectFill"
                            onerror="onerror=null;src='../../static/images/defaultBookCover.png'"></log-image>
                        <view class="book-item-info">
                            <text class="book-item-title">{{ book.name }}</text>
                            <text class="book-item-author">{{ book.author_name }}</text>
                            <text class="book-item-desc">{{ getSharedNovelDescription(book) }}</text>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </view>
    </view>
</template>

<script>
import axios from 'axios';
import i18n from '@/i18n';
import followBtn from '../../components/follow.vue'
import emojiPicker from '../../components/emoji-picker/emoji-picker.vue'

const PRIVATE_MESSAGE_PREFIX = '__LOGHOME_DM__:';
const PRIVATE_MESSAGE_VERSION = 1;
const PRIVATE_MESSAGE_TYPES = {
    IMAGE: 'image',
    NOVEL_SHARE: 'novel_share'
};
const BOOK_SELECTOR_ANIMATION_DURATION = 260;
const IMAGE_UPLOAD_URL = 'https://storage.codesocean.top/api/resource/upload?container=172018735018984';
const IMAGE_UPLOAD_SERVICE_KEY = 'a24785bedb466b9733dd317771d4b69c08da07fd';

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
            isAtBottom: true,
            showBookSelector: false,
            bookSelectorVisible: false,
            bookSelectorAnimationTimer: null,
            activeBookTab: 'mine',
            bookSelectorTabs: [
                {
                    key: 'mine',
                    label: '我的作品',
                    searchPlaceholder: '搜索我的作品',
                    emptyText: '暂无可分享的作品',
                    loadingText: '正在加载我的作品...'
                },
                {
                    key: 'liked',
                    label: '收藏作品',
                    searchPlaceholder: '搜索收藏作品',
                    emptyText: '暂无收藏作品',
                    loadingText: '正在加载收藏作品...'
                },
                {
                    key: 'history',
                    label: '阅读历史',
                    searchPlaceholder: '搜索阅读历史',
                    emptyText: '暂无阅读历史',
                    loadingText: '正在加载阅读历史...'
                }
            ],
            loadingBookTabs: {
                mine: false,
                liked: false,
                history: false
            },
            loadedBookTabs: {
                mine: false,
                liked: false,
                history: false
            },
            sharedNovelGroups: {
                mine: [],
                liked: [],
                history: []
            },
            myNovels: [],
            bookKeyword: '',
            novelDetailCache: {},
            imageUploadState: {
                uploading: false,
                progress: 0
            }
        };
    },
    components: {
        followBtn,
        emojiPicker
    },
    computed: {
        sortedMessages() {
            return [...this.messages]
                .map(message => this.normalizeMessage(message))
                .sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at));
        },
        currentBookTabConfig() {
            return this.bookSelectorTabs.find(tab => tab.key === this.activeBookTab) || this.bookSelectorTabs[0];
        },
        currentBookSearchPlaceholder() {
            return this.currentBookTabConfig.searchPlaceholder || '搜索作品';
        },
        currentBookEmptyText() {
            return this.currentBookTabConfig.emptyText || '暂无可分享的作品';
        },
        currentBookLoadingText() {
            return this.currentBookTabConfig.loadingText || '正在加载作品...';
        },
        currentBookList() {
            return this.sharedNovelGroups[this.activeBookTab] || [];
        },
        isCurrentBookTabLoading() {
            return !!(this.loadingBookTabs && this.loadingBookTabs[this.activeBookTab]);
        },
        isAnyBookTabLoading() {
            return Object.keys(this.loadingBookTabs || {}).some(key => this.loadingBookTabs[key]);
        },
        filteredBooks() {
            const keyword = (this.bookKeyword || '').trim().toLowerCase();
            if (!keyword) return this.currentBookList;
            return this.currentBookList.filter(book => {
                const targets = [
                    book.name,
                    book.author_name,
                    book.content
                ].filter(Boolean).map(item => String(item).toLowerCase());
                return targets.some(item => item.includes(keyword));
            });
        }
    },
    methods: {
        isMeaningfulText(value) {
            if (value === undefined || value === null) return false;
            const text = String(value).trim();
            return !!text && text !== '未知作者' && text !== '匿名作者';
        },
        pickMeaningfulText(values = []) {
            const matched = values.find(value => this.isMeaningfulText(value));
            return matched === undefined || matched === null ? '' : String(matched).trim();
        },
        getTokenPayload() {
            try {
                return JSON.parse(window.localStorage.getItem('token') || 'null');
            } catch (error) {
                return null;
            }
        },
        getAuthToken() {
            const token = this.getTokenPayload();
            return token && token.tk ? token.tk : '';
        },
        getCurrentUserDisplayName() {
            return this.pickMeaningfulText([
                this.user && this.user.name,
                this.user && this.user.user_name,
                this.user && this.user.nickname
            ]);
        },
        isBookFromCurrentUser(book = {}, source = '') {
            if (source === 'mine') return true;
            const authorId = Number(book.author_id || book.auther_id || book.author_user_id || 0);
            return !!authorId && !!this.user_id && authorId === Number(this.user_id);
        },
        getNovelAuthorName(book = {}, source = '') {
            const authorName = this.pickMeaningfulText([
                book.author_name,
                book.user_name,
                book.username,
                book.pen_name,
                book.penName,
                book.nickname,
                book.creator_name,
                book.author && book.author.name,
                book.user && book.user.name
            ]);
            if (authorName) return authorName;

            if (this.isBookFromCurrentUser(book, source)) {
                return this.getCurrentUserDisplayName();
            }

            return '';
        },
        normalizeNovel(book = {}, source = '') {
            const novelId = Number(book.novel_id || book.id) || 0;
            const cachedDetail = novelId && this.novelDetailCache ? this.novelDetailCache[novelId] : null;
            const rawBook = cachedDetail ? { ...book, ...cachedDetail } : book;
            const authorName = this.getNovelAuthorName(rawBook, source);
            const authorId = Number(rawBook.author_id || rawBook.auther_id || rawBook.author_user_id || 0) || 0;
            return {
                novel_id: novelId,
                name: rawBook.name || '未命名作品',
                author_id: authorId,
                author_name: authorName || '未知作者',
                content: rawBook.content || rawBook.description || rawBook.intro || '',
                picUrl: rawBook.picUrl || '',
                avatar_url: rawBook.avatar_url || rawBook.auther_avatar || rawBook.author_avatar || '',
                source_type: source || rawBook.source_type || ''
            };
        },
        getStructuredMessagePayload(messageContent) {
            if (typeof messageContent !== 'string' || !messageContent.startsWith(PRIVATE_MESSAGE_PREFIX)) {
                return null;
            }

            try {
                const payload = JSON.parse(messageContent.slice(PRIVATE_MESSAGE_PREFIX.length));
                if (!payload || payload.version !== PRIVATE_MESSAGE_VERSION) {
                    return null;
                }
                return payload;
            } catch (error) {
                console.error('解析私信内容失败', error);
                return null;
            }
        },
        parseMessageContent(messageContent) {
            const fallbackText = typeof messageContent === 'string' ? messageContent : '';
            const payload = this.getStructuredMessagePayload(messageContent);
            if (!payload) {
                return {
                    type: 'text',
                    text: fallbackText,
                    previewText: fallbackText
                };
            }

            if (payload.type === PRIVATE_MESSAGE_TYPES.IMAGE && payload.url) {
                return {
                    type: PRIVATE_MESSAGE_TYPES.IMAGE,
                    text: '',
                    previewText: '[图片]',
                    imageUrl: payload.url
                };
            }

            if (payload.type === PRIVATE_MESSAGE_TYPES.NOVEL_SHARE && payload.novel) {
                const novel = this.normalizeNovel(payload.novel, payload.novel.source_type || '');
                return {
                    type: PRIVATE_MESSAGE_TYPES.NOVEL_SHARE,
                    text: '',
                    previewText: `分享了作品《${novel.name}》`,
                    novel
                };
            }

            return {
                type: 'text',
                text: fallbackText,
                previewText: fallbackText
            };
        },
        normalizeMessage(message) {
            const parsed = this.parseMessageContent(message.message_content);
            return {
                ...message,
                displayType: parsed.type,
                displayText: parsed.text,
                previewText: parsed.previewText,
                imageUrl: parsed.imageUrl || '',
                novel: parsed.novel || null
            };
        },
        buildStructuredMessage(payload) {
            return PRIVATE_MESSAGE_PREFIX + JSON.stringify({
                version: PRIVATE_MESSAGE_VERSION,
                ...payload
            });
        },
        formatReadStatus(message) {
            if (message.isTemp) return '发送中';
            return message.is_read ? '已读' : '未读';
        },
        getSharedNovelCover(novel = {}) {
            const cover = novel.picUrl || (this.$backupResources && this.$backupResources.bookCover) || '../../static/images/defaultBookCover.png';
            if (!cover || cover.indexOf('?') !== -1 || cover.indexOf('data:') === 0 || cover.indexOf('http') !== 0) {
                return cover;
            }
            return cover + '?thumbnail=1';
        },
        getSharedNovelDescription(novel = {}) {
            const desc = novel.content || '点击查看作品详情';
            if (desc.length <= 48) return desc;
            return desc.substr(0, 48) + '...';
        },
        previewMessageImage(imageUrl) {
            if (!imageUrl) return;
            uni.previewImage({
                urls: [imageUrl],
                current: imageUrl
            });
        },
        openSharedNovel(novel) {
            if (!novel || !novel.novel_id) return;
            uni.navigateTo({
                url: '/pages/readers/bookInfo?id=' + novel.novel_id
            });
        },
        setBookTabLoading(tabKey, loading) {
            this.$set(this.loadingBookTabs, tabKey, loading);
        },
        setBookTabBooks(tabKey, books = []) {
            this.$set(this.sharedNovelGroups, tabKey, books);
            this.$set(this.loadedBookTabs, tabKey, true);
            if (tabKey === 'mine') {
                this.myNovels = books;
            }
        },
        readLocalBookCache(cacheKey) {
            try {
                const value = JSON.parse(window.localStorage.getItem(cacheKey) || 'null');
                return Array.isArray(value) ? value : [];
            } catch (error) {
                return [];
            }
        },
        async ensureCurrentUserProfile() {
            if (this.getCurrentUserDisplayName()) return;

            const token = this.getAuthToken();
            if (!token) return;

            try {
                const res = await axios.get(this.$baseUrl + '/users/userprofile', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                this.user = res.data || {};
            } catch (error) {
                console.error('加载当前用户信息失败', error);
            }
        },
        needsNovelDetailHydration(book = {}, source = '') {
            if (!book || !book.novel_id || source === 'mine') return false;
            return !this.isMeaningfulText(book.author_name);
        },
        async getNovelDetailForShare(novelId) {
            if (!novelId) return null;
            if (Object.prototype.hasOwnProperty.call(this.novelDetailCache, novelId)) {
                return this.novelDetailCache[novelId];
            }

            const res = await axios.get(this.$baseUrl + '/library/get_novel_by_id', {
                params: {
                    id: novelId
                }
            });
            const detail = Array.isArray(res.data) ? res.data[0] : res.data;
            this.$set(this.novelDetailCache, novelId, detail || null);
            return detail || null;
        },
        async hydrateMissingNovelAuthors(books = [], source = '') {
            const nextBooks = [...books];
            await Promise.all(nextBooks.map(async (book, index) => {
                if (!this.needsNovelDetailHydration(book, source)) return;

                try {
                    const detail = await this.getNovelDetailForShare(book.novel_id);
                    if (detail) {
                        nextBooks[index] = this.normalizeNovel({ ...book, ...detail }, source);
                    }
                } catch (error) {
                    console.error('补齐作品作者失败', error);
                }
            }));
            return nextBooks;
        },
        async normalizeAndHydrateNovels(books = [], source = '') {
            const normalizedBooks = (Array.isArray(books) ? books : [])
                .map(book => this.normalizeNovel(book, source))
                .filter(book => book.novel_id > 0);
            return this.hydrateMissingNovelAuthors(normalizedBooks, source);
        },
        async loadMyNovels(force = false) {
            const tabKey = 'mine';
            if (this.loadingBookTabs[tabKey] || (!force && this.loadedBookTabs[tabKey])) return;

            this.setBookTabLoading(tabKey, true);
            try {
                const token = this.getAuthToken();
                if (!token) {
                    this.setBookTabBooks(tabKey, []);
                    uni.showToast({
                        title: '请先登录',
                        icon: 'none'
                    });
                    return;
                }

                await this.ensureCurrentUserProfile();
                const res = await axios.get(this.$baseUrl + '/essays/get_novels_of', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                const books = await this.normalizeAndHydrateNovels(res.data || [], tabKey);
                this.setBookTabBooks(tabKey, books);
            } catch (error) {
                console.error('加载我的作品失败', error);
                uni.showToast({
                    title: '加载作品失败',
                    icon: 'none'
                });
            } finally {
                this.setBookTabLoading(tabKey, false);
            }
        },
        async loadLikedNovels(force = false) {
            const tabKey = 'liked';
            if (this.loadingBookTabs[tabKey] || (!force && this.loadedBookTabs[tabKey])) return;

            this.setBookTabLoading(tabKey, true);
            try {
                let rawBooks = [];
                const token = this.getAuthToken();

                if (token) {
                    try {
                        const res = await axios.get(this.$baseUrl + '/bookcase/get_likes_of', {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            }
                        });
                        rawBooks = Array.isArray(res.data) ? res.data : [];
                        window.localStorage.setItem('LogHomeLikedBooks', JSON.stringify(rawBooks));
                    } catch (error) {
                        if (error && error.message === 'Request failed with status code 401') {
                            window.localStorage.removeItem('token');
                        }
                        rawBooks = this.readLocalBookCache('LogHomeLikedBooks');
                        if (rawBooks.length === 0) {
                            throw error;
                        }
                    }
                } else {
                    rawBooks = this.readLocalBookCache('LogHomeLikedBooks');
                }

                const books = await this.normalizeAndHydrateNovels(rawBooks, tabKey);
                this.setBookTabBooks(tabKey, books);
            } catch (error) {
                console.error('加载收藏作品失败', error);
                uni.showToast({
                    title: '加载收藏失败',
                    icon: 'none'
                });
            } finally {
                this.setBookTabLoading(tabKey, false);
            }
        },
        async loadHistoryNovels(force = false) {
            const tabKey = 'history';
            if (this.loadingBookTabs[tabKey] || (!force && this.loadedBookTabs[tabKey])) return;

            this.setBookTabLoading(tabKey, true);
            try {
                let rawBooks = [];
                const token = this.getAuthToken();

                if (token) {
                    try {
                        const res = await axios.get(this.$baseUrl + '/library/reading_history', {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            }
                        });
                        rawBooks = Array.isArray(res.data) ? res.data : [];
                        window.localStorage.setItem('loghomeReaderHistory', JSON.stringify(rawBooks));
                    } catch (error) {
                        if (error && error.message === 'Request failed with status code 401') {
                            window.localStorage.removeItem('token');
                        }
                        rawBooks = this.readLocalBookCache('loghomeReaderHistory').reverse();
                        if (rawBooks.length === 0) {
                            throw error;
                        }
                    }
                } else {
                    rawBooks = this.readLocalBookCache('loghomeReaderHistory').reverse();
                }

                const books = await this.normalizeAndHydrateNovels(rawBooks, tabKey);
                this.setBookTabBooks(tabKey, books);
            } catch (error) {
                console.error('加载阅读历史失败', error);
                uni.showToast({
                    title: '加载历史失败',
                    icon: 'none'
                });
            } finally {
                this.setBookTabLoading(tabKey, false);
            }
        },
        loadBooksForActiveTab(force = false) {
            if (this.activeBookTab === 'liked') {
                return this.loadLikedNovels(force);
            }
            if (this.activeBookTab === 'history') {
                return this.loadHistoryNovels(force);
            }
            return this.loadMyNovels(force);
        },
        async hydrateSharedNovelMessages() {
            const novelIds = new Set();
            this.messages.forEach(message => {
                const payload = this.getStructuredMessagePayload(message.message_content);
                if (!payload || payload.type !== PRIVATE_MESSAGE_TYPES.NOVEL_SHARE || !payload.novel) return;

                const novel = this.normalizeNovel(payload.novel, payload.novel.source_type || '');
                if (this.needsNovelDetailHydration(novel, novel.source_type)) {
                    novelIds.add(novel.novel_id);
                }
            });

            if (novelIds.size === 0) return;

            await Promise.all(Array.from(novelIds).map(async novelId => {
                try {
                    await this.getNovelDetailForShare(novelId);
                } catch (error) {
                    console.error('补齐分享消息作品作者失败', error);
                }
            }));
            this.$forceUpdate();
        },
        async onEmojiSelect(data) {
            if (!data) return;

            if (data.type === 'emoji') {
                this.newMessage += data.content || '';
                return;
            }

            if (data.type === 'sticker' && data.content) {
                try {
                    await this.sendMessageContent(this.buildStructuredMessage({
                        type: PRIVATE_MESSAGE_TYPES.IMAGE,
                        url: data.content
                    }));
                } catch (error) {}
            }
        },
        openBookSelector() {
            if (this.bookSelectorAnimationTimer) {
                clearTimeout(this.bookSelectorAnimationTimer);
                this.bookSelectorAnimationTimer = null;
            }
            this.showBookSelector = true;
            this.bookSelectorVisible = false;
            this.activeBookTab = 'mine';
            this.bookKeyword = '';
            this.$nextTick(() => {
                this.bookSelectorVisible = true;
            });
            this.loadBooksForActiveTab();
        },
        switchBookSelectorTab(tabKey) {
            if (this.activeBookTab === tabKey) return;
            this.activeBookTab = tabKey;
            this.bookKeyword = '';
            this.loadBooksForActiveTab();
        },
        closeBookSelector() {
            if (!this.showBookSelector) return;

            this.bookSelectorVisible = false;
            if (this.bookSelectorAnimationTimer) {
                clearTimeout(this.bookSelectorAnimationTimer);
            }
            this.bookSelectorAnimationTimer = setTimeout(() => {
                this.showBookSelector = false;
                this.bookSelectorAnimationTimer = null;
            }, BOOK_SELECTOR_ANIMATION_DURATION);
        },
        async shareBook(book) {
            let novel = this.normalizeNovel(book, this.activeBookTab);
            if (this.needsNovelDetailHydration(novel, this.activeBookTab)) {
                const hydratedBooks = await this.hydrateMissingNovelAuthors([novel], this.activeBookTab);
                novel = hydratedBooks[0] || novel;
            }
            this.closeBookSelector();
            try {
                await this.sendMessageContent(this.buildStructuredMessage({
                    type: PRIVATE_MESSAGE_TYPES.NOVEL_SHARE,
                    novel
                }));
            } catch (error) {}
        },
        async chooseAndSendImage() {
            if (this.imageUploadState.uploading) return;

            try {
                const chooseResult = await uni.chooseImage({
                    count: 1,
                    sizeType: ['compressed'],
                    sourceType: ['album', 'camera']
                });
                const tempFilePaths = (chooseResult && chooseResult[1] && chooseResult[1].tempFilePaths) ?
                    chooseResult[1].tempFilePaths :
                    (chooseResult && chooseResult.tempFilePaths) ? chooseResult.tempFilePaths : [];

                if (!tempFilePaths || tempFilePaths.length === 0) return;

                this.imageUploadState.uploading = true;
                this.imageUploadState.progress = 0;

                const uploadRes = await this.uploadFile(tempFilePaths[0], (progress) => {
                    this.imageUploadState.progress = Math.max(0, Math.min(100, Math.floor(progress)));
                });

                await this.sendMessageContent(this.buildStructuredMessage({
                    type: PRIVATE_MESSAGE_TYPES.IMAGE,
                    url: uploadRes.url
                }));
            } catch (error) {
                if (error && error.errMsg && error.errMsg.indexOf('cancel') !== -1) {
                    return;
                }
                if (!error || !error.__privateMessageHandled) {
                    console.error('发送图片失败', error);
                    uni.showToast({
                        title: '发送图片失败',
                        icon: 'none',
                        duration: 2000
                    });
                }
            } finally {
                this.imageUploadState.uploading = false;
                this.imageUploadState.progress = 0;
            }
        },
        async uploadFile(filePath, onProgress) {
            return new Promise((resolve, reject) => {
                const uploadTask = uni.uploadFile({
                    url: IMAGE_UPLOAD_URL,
                    filePath: filePath,
                    name: 'file',
                    header: {
                        ServiceKey: IMAGE_UPLOAD_SERVICE_KEY
                    },
                    success: (uploadRes) => {
                        try {
                            let data = uploadRes.data;
                            if (typeof data === 'string') data = JSON.parse(data);
                            resolve({
                                url: 'https://storage.codesocean.top/api/resource/get/' + data.data.resource_id
                            });
                        } catch (error) {
                            reject(error);
                        }
                    },
                    fail: (error) => {
                        reject(error);
                    }
                });

                if (uploadTask && typeof uploadTask.onProgressUpdate === 'function') {
                    uploadTask.onProgressUpdate((progressRes) => {
                        if (!progressRes || typeof progressRes.progress !== 'number') return;
                        if (typeof onProgress === 'function') {
                            onProgress(progressRes.progress);
                        }
                    });
                }
            });
        },
        async fetchMessages(loadMore = false) {
            if (this.loading || (loadMore && this.noMoreMessages)) return;

            this.loading = true;
            try {
                const numericMessageIds = this.messages
                    .map(m => Number(m.id))
                    .filter(id => Number.isFinite(id) && id > 0);
                const lastMessageId = loadMore && numericMessageIds.length > 0 ?
                    Math.min(...numericMessageIds) : null;

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

                    const numericIds = this.messages
                        .map(m => Number(m.id))
                        .filter(id => Number.isFinite(id) && id > 0);
                    if (numericIds.length > 0) {
                        this.latestMessageId = Math.max(...numericIds);
                    }

                    this.hydrateSharedNovelMessages();

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
            const unreadMessages = this.messages.filter(m =>
                !m.is_read &&
                m.sender_id !== this.user_id &&
                !m.isTemp &&
                typeof m.id === 'number'
            );

            for (const message of unreadMessages) {
                try {
                    await axios.post(this.$baseUrl + '/community/mark_as_read', {
                        message_id: message.id
                    }, {
                        headers: {
                            'Authorization': 'Bearer ' + JSON.parse(window.localStorage.getItem('token')).tk
                        }
                    });

                    message.is_read = true;
                } catch (error) {
                    console.error('标记消息已读失败', error);
                }
            }

            if (unreadMessages.length > 0) {
                this.updateUnreadMessagesCount();
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
                    this.hydrateSharedNovelMessages();

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
                this.isAtBottom = true;
            }
            this.hideNewMessageToast();
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
                    title: '努力加载中',
                    mask: true
                });
                this.fetchMessages(true);
            }
        },

        async sendMessage() {
            if (!this.newMessage.trim()) return;
            const messageContent = this.newMessage.trim();
            this.newMessage = '';

            try {
                await this.sendMessageContent(messageContent);
            } catch (error) {
                this.newMessage = messageContent;
            }
        },
        async sendMessageContent(messageContent) {
            const tempId = 'temp_' + Date.now();
            try {
                const tempMessage = {
                    id: tempId,
                    sender_id: this.user_id,
                    message_content: messageContent,
                    sent_at: new Date().toISOString(),
                    isTemp: true,
                    is_read: false
                };

                this.messages.push(tempMessage);

                this.$nextTick(() => {
                    this.scrollToBottom();
                });

                const response = await axios.post(this.$baseUrl + '/community/send_message', {
                    to_id: this.friend_id,
                    message_content: messageContent
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + JSON.parse(window.localStorage.getItem('token')).tk
                    }
                });

                if (response.data && response.data.id) {
                    const index = this.messages.findIndex(m => m.id === tempId);
                    if (index !== -1) {
                        this.messages[index].id = response.data.id;
                        this.messages[index].isTemp = false;
                        this.latestMessageId = Math.max(this.latestMessageId || 0, response.data.id);
                    }
                }
            } catch (error) {
                error.__privateMessageHandled = true;
                this.messages = this.messages.filter(m => m.id !== tempId);
                uni.showToast({
                    title: error.response && error.response.data.code === 'PRIVATE_MESSAGE_FORBIDDEN'
                        ? i18n.t('settings.privacy.messageForbidden') : '发送失败',
                    icon: 'none',
                    duration: 2000
                });
                throw error;
            }
        },
        utc2beijing(utc_datetime) {
            const T_pos = utc_datetime.indexOf('T');
            const Z_pos = utc_datetime.indexOf('Z');
            const year_month_day = utc_datetime.substr(0, T_pos);
            const hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1);
            const new_datetime = year_month_day + ' ' + hour_minute_second;

            let timestamp = new Date(Date.parse(new_datetime));
            timestamp = timestamp.getTime();
            timestamp = timestamp / 1000;
            timestamp = timestamp + 8 * 60 * 60;

            return this.timeConvert(new Date(parseInt(timestamp) * 1000));
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

        if (this.bookSelectorAnimationTimer) {
            clearTimeout(this.bookSelectorAnimationTimer);
            this.bookSelectorAnimationTimer = null;
        }
    }
};
</script>

<style>
.chat-container {
    display: flex;
    flex-direction: column;
    /* The native header uses 44px plus the Android status-bar inset. */
    height: calc(100vh - 44px - var(--loghome-safe-top, 0px));
    background-color: var(--background-color-secondary);
    position: relative;
}

.chat-container .follow-btn {
    position: fixed;
    top: calc(var(--loghome-safe-top, 0px) + 10rpx);
    right: -6rpx;
    z-index: 99999;
    transform: scale(0.8);
}

.messages {
    flex: 1;
    min-height: 0;
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
    background-color: var(--card-background);
    position: relative;
    box-sizing: border-box;
}

.message-content.media-message {
    width: 380rpx;
    max-width: 72%;
    padding: 12rpx;
}

.my-message {
    background-color: #95ec69;
}

.message-text {
    font-size: 28rpx;
    color: var(--text-color-primary);
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-all;
}

.message-image {
    width: 100%;
    height: 360rpx;
    border-radius: 12rpx;
    background-color: var(--background-color-secondary);
}

.shared-book-card {
    display: flex;
    align-items: flex-start;
    width: 100%;
}

.shared-book-cover {
    width: 120rpx;
    height: 160rpx;
    border-radius: 10rpx;
    margin-right: 16rpx;
    flex-shrink: 0;
}

.shared-book-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.shared-book-tag {
    font-size: 22rpx;
    color: var(--text-color-regular);
    margin-bottom: 6rpx;
}

.shared-book-title {
    font-size: 28rpx;
    font-weight: bold;
    color: var(--text-color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.shared-book-author {
    font-size: 24rpx;
    color: var(--text-color-regular);
    margin-top: 8rpx;
}

.shared-book-desc {
    font-size: 24rpx;
    color: var(--text-color-regular);
    margin-top: 10rpx;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}

.message-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10rpx;
}

.time {
    font-size: 24rpx;
    color: var(--text-color-regular);
    display: block;
}

.read-status {
    font-size: 24rpx;
    color: var(--text-color-regular);
    margin-left: 10rpx;
}

.my-message .message-text,
.my-message .shared-book-tag,
.my-message .shared-book-title,
.my-message .shared-book-author,
.my-message .shared-book-desc,
.my-message .time,
.my-message .read-status {
    color: #1f2a10;
}

.input-container {
    padding: 20rpx;
    background-color: var(--card-background);
    border-top: 1px solid var(--border-color);
}

.tool-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 16rpx;
}

.tool-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 92rpx;
    padding: 10rpx 18rpx;
    margin-right: 16rpx;
    border-radius: 999rpx;
    background-color: var(--background-color-secondary);
    color: var(--text-color-primary);
    font-size: 24rpx;
    text-align: center;
}

.tool-button-icon {
    margin-right: 8rpx;
    font-size: 26rpx;
}

.tool-button.disabled {
    opacity: 0.55;
}

.tool-tip {
    font-size: 24rpx;
    color: var(--text-color-regular);
    line-height: 1.4;
}

.input-row {
    display: flex;
    align-items: center;
}

.input-actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.chat-emoji-picker {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 12rpx;
    background: var(--background-color-secondary);
    border-radius: 999rpx;
}

.message-input {
    flex: 1;
    padding: 20rpx;
    border: 1px solid var(--border-color);
    border-radius: 15rpx;
    height: 80rpx;
    box-sizing: border-box;
    margin-right: 20rpx;
    background-color: var(--background-color);
    color: var(--text-color-primary);
}

.send-button {
    height: 80rpx !important;
    padding: 0 30rpx !important;
    background-color: #007aff;
    color: #fff;
    border: none;
    border-radius: 10rpx;
}

.chat-emoji-picker .emoji-trigger {
    padding: 14rpx 18rpx;
}

.send-button:active {
    background-color: #0056b3;
}

.new-message-toast {
    position: fixed;
    bottom: 170rpx;
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

.book-selector-mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 100001;
    display: flex;
    align-items: flex-end;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.26s ease;
}

.book-selector-mask.visible {
    opacity: 1;
    pointer-events: auto;
}

.book-selector-panel {
    width: 100%;
    height: 75vh;
    max-height: 75vh;
    background: var(--card-background);
    border-radius: 28rpx 28rpx 0 0;
    padding-bottom: var(--loghome-safe-bottom, 0px);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 -12rpx 36rpx rgba(0, 0, 0, 0.16);
    transform: translate3d(0, 100%, 0);
    transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform;
}

.book-selector-mask.visible .book-selector-panel {
    transform: translate3d(0, 0, 0);
}

.book-selector-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28rpx 30rpx 20rpx;
    border-bottom: 1px solid var(--border-color);
}

.book-selector-title {
    font-size: 32rpx;
    font-weight: bold;
    color: var(--text-color-primary);
}

.book-selector-close {
    font-size: 26rpx;
    color: var(--text-color-regular);
}

.book-selector-tabs {
    display: flex;
    gap: 12rpx;
    padding: 18rpx 30rpx 0;
}

.book-selector-tab {
    flex: 1;
    height: 64rpx;
    border-radius: 14rpx;
    background: var(--background-color-secondary);
    color: var(--text-color-regular);
    font-size: 26rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.book-selector-tab.active {
    background: #f56c6c;
    color: #ffffff;
    font-weight: bold;
}

.book-search-row {
    padding: 20rpx 30rpx;
    border-bottom: 1px solid var(--border-color);
}

.book-search-input {
    width: 100%;
    height: 76rpx;
    padding: 0 24rpx;
    border-radius: 14rpx;
    background: var(--background-color-secondary);
    box-sizing: border-box;
    color: var(--text-color-primary);
}

.book-selector-list {
    flex: 1;
    height: calc(75vh - 250rpx - var(--loghome-safe-bottom, 0px));
    min-height: 240rpx;
}

.book-selector-empty {
    padding: 60rpx 30rpx;
    text-align: center;
    color: var(--text-color-regular);
    font-size: 26rpx;
}

.book-item {
    display: flex;
    padding: 24rpx 30rpx;
    border-bottom: 1px solid var(--border-color);
}

.book-item-cover {
    width: 140rpx;
    height: 188rpx;
    border-radius: 10rpx;
    margin-right: 20rpx;
    flex-shrink: 0;
}

.book-item-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.book-item-title {
    font-size: 30rpx;
    font-weight: bold;
    color: var(--text-color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.book-item-author {
    font-size: 24rpx;
    color: var(--text-color-regular);
    margin-top: 12rpx;
}

.book-item-desc {
    font-size: 24rpx;
    color: var(--text-color-regular);
    margin-top: 14rpx;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
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
