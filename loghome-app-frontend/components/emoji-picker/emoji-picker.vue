<template>
	<view class="emoji-picker-container">
		<!-- 表情选择器按钮 -->
		<view class="emoji-trigger" @tap="toggleEmojiPicker">
			<svg v-show="!showEmojiPicker" t="1753160505618" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13932" id="mx_n_1753160505619" width="24" height="24"><path d="M512 64C264.576 64 64 264.576 64 512s200.576 448 448 448 448-200.576 448-448S759.424 64 512 64z m0 832C299.936 896 128 724.064 128 512S299.936 128 512 128s384 171.936 384 384-171.936 384-384 384z" p-id="13933" fill="#666666"></path><path d="M320 384m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" p-id="13934" fill="#666666"></path><path d="M704 384m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" p-id="13935" fill="#666666"></path><path d="M224 512c0 159.072 128.928 288 288 288s288-128.928 288-288H224z" p-id="13936" fill="#666666"></path></svg>
            <uni-icons type="closeempty" size="24" v-show="showEmojiPicker" color="#666666"></uni-icons>
        </view>
		
		<!-- 表情选择器面板 -->
		<view class="emoji-panel" v-if="showEmojiPicker">
			<!-- 表情类型切换 -->
			<view class="emoji-tabs">
				<view 
					class="emoji-tab" 
					:class="{active: activeTab === 'emoji'}"
					@tap="activeTab = 'emoji'"
				>
					<text>Emoji</text>
				</view>
				<view 
					class="emoji-tab" 
					:class="{active: activeTab === 'sticker'}"
					@tap="activeTab = 'sticker'"
				>
					<text>表情包</text>
				</view>
				<view 
					class="emoji-tab" 
					:class="{active: activeTab === 'favorite'}"
					@tap="activeTab = 'favorite'"
				>
					<text>收藏</text>
				</view>
			</view>
			
			<!-- Emoji表情 -->
			<scroll-view 
				scroll-y 
				class="emoji-content" 
				v-if="activeTab === 'emoji'"
			>
				<view class="emoji-grid">
					<view 
						class="emoji-item" 
						v-for="(emoji, index) in emojiList" 
						:key="index"
						@tap="selectEmoji(emoji)"
					>
						<text class="emoji-text">{{emoji}}</text>
					</view>
				</view>
			</scroll-view>
			
			<!-- 表情包 -->
			<view class="sticker-container" v-if="activeTab === 'sticker'">
				<!-- 表情包列表 -->
				<scroll-view 
					scroll-y 
					class="sticker-content" 
					@scrolltolower="loadMoreStickers"
					:scroll-top="0"
				>
					<view class="sticker-grid">
						<view 
							class="sticker-item" 
							v-for="(sticker, index) in stickerList" 
							:key="sticker.sticker_id"
							@tap="selectSticker(sticker)"
							@longpress="showStickerOptions(sticker)"
						>
							<log-image :src="sticker.url" mode="aspectFill" style="width: 100%; height: 100%;"></log-image>
						</view>
						<!-- 上传按钮 -->
						<view class="sticker-upload" @tap="uploadSticker">
							<uni-icons type="plusempty" size="30" color="#999"></uni-icons>
						</view>
					</view>
					<!-- 加载状态 -->
					<view class="loading-more" v-if="isLoading">
						<text>加载中...</text>
					</view>
					<!-- 加载更多按钮 -->
					<view class="load-more" v-if="currentPage < totalPages && !isLoading">
						<text @tap="loadMoreStickers">加载更多</text>
					</view>
					<!-- 无更多数据提示 -->
					<view class="no-more" v-if="currentPage >= totalPages && stickerList.length > 0">
						<text>没有更多了</text>
					</view>
					<!-- 空数据提示 -->
					<view class="empty-tip" v-if="stickerList.length === 0 && !isLoading">
						<text>暂无表情包</text>
					</view>
				</scroll-view>
				
				<!-- 表情包分类 -->
				<view class="sticker-categories">
					<scroll-view scroll-x class="category-scroll">
						<view class="category-list">
							<view 
								class="category-item" 
								:class="{active: activeCategory === 'all'}"
								@tap="selectCategory('all')"
							>
								<text>全部</text>
							</view>
							<view 
								class="category-item" 
								:class="{active: activeCategory === 'my'}"
								@tap="selectCategory('my')"
							>
								<text>我上传的</text>
							</view>
							<view 
								class="category-item" 
								:class="{active: activeCategory === 'public'}"
								@tap="selectCategory('public')"
							>
								<text>公开</text>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			
			<!-- 收藏的表情 -->
			<scroll-view 
				scroll-y 
				class="emoji-content" 
				v-if="activeTab === 'favorite'"
				@scrolltolower="loadMoreFavorites"
				:scroll-top="0"
			>
				<view class="sticker-grid">
					<view 
						class="sticker-item" 
						v-for="(sticker, index) in favoriteList" 
						:key="sticker.sticker_id"
						@tap="selectSticker(sticker)"
						@longpress="showStickerOptions(sticker, true)"
					>
						<log-image :src="sticker.url" mode="aspectFill" style="width: 100%; height: 100%;"></log-image>
					</view>
					<!-- 加载状态 -->
					<view class="loading-more" v-if="isLoading">
						<text>加载中...</text>
					</view>
					<!-- 加载更多按钮 -->
					<view class="load-more" v-if="favoriteCurrentPage < favoriteTotalPages && !isLoading">
						<text @tap="loadMoreFavorites">加载更多</text>
					</view>
					<!-- 无更多数据提示 -->
					<view class="no-more" v-if="favoriteCurrentPage >= favoriteTotalPages && favoriteList.length > 0">
						<text>没有更多了</text>
					</view>
					<!-- 空数据提示 -->
					<view class="empty-tip" v-if="favoriteList.length === 0 && !isLoading">
						<text>暂无收藏表情，长按表情包可收藏</text>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 表情包操作菜单 -->
		<uni-popup ref="stickerOptionsPopup" type="bottom" :z-index="2000">
			<view class="sticker-options">
				<view class="option-item" @tap="toggleFavorite">
					<text>{{ currentSticker.is_favorite ? '取消收藏' : '收藏' }}</text>
				</view>
				<view class="option-item" @tap="togglePrivate" v-if="currentSticker.user_id === userId">
					<text>{{ currentSticker.is_private ? '设为公开' : '设为私密' }}</text>
				</view>
				<view class="option-item delete" @tap="deleteSticker" v-if="currentSticker.user_id === userId">
					<text>删除</text>
				</view>
				<view class="option-item cancel" @tap="hideStickerOptions">
					<text>取消</text>
				</view>
			</view>
		</uni-popup>
		
		<!-- 上传表情包弹窗 -->
		<uni-popup ref="uploadPopup" type="bottom" :z-index="1000">
			<view class="upload-popup">
				<view class="popup-header">
					<text class="popup-title">上传表情包</text>
					<view class="close-btn" @tap="hideUploadPopup">
						<uni-icons type="closeempty" size="24" color="#999"></uni-icons>
					</view>
				</view>
				<view class="upload-content">
					<view class="upload-preview" v-if="uploadImage">
						<img :src="uploadImage" mode="aspectFill"></img>
						<view class="delete-btn" @tap="removeUploadImage">
							<uni-icons type="closeempty" size="20" color="#fff"></uni-icons>
						</view>
					</view>
					<view class="upload-btn" @tap="chooseImage" v-else>
						<uni-icons type="image" size="30" color="#999"></uni-icons>
						<text>选择图片</text>
					</view>
					<view class="privacy-setting">
						<text>设为私密</text>
						<switch :checked="isPrivate" @change="toggleUploadPrivacy" color="#EA7034" style="transform:scale(0.8)"/>
					</view>
					<button class="submit-btn" @tap="submitUpload" :disabled="!uploadImage">上传</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import axios from 'axios'
	
	export default {
		props: {
			// 是否默认显示表情选择器
			showPicker: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				showEmojiPicker: false,
				activeTab: 'emoji', // emoji, sticker, favorite
				activeCategory: 'all', // all, my, public
				emojiList: [
					'😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
					'🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
					'😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
					'🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
					'😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
					'🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
					'🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
					'😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
					'🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈',
					'👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾',
					'🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿',
					'😾', '👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️',
					'🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️',
					'👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲',
					'🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦵', '🦿', '🦶',
					'👣', '👂', '🦻', '👃', '🫀', '🫁', '🧠', '🦷', '🦴', '👀',
					'👁', '👅', '👄', '💋', '🩸', '🔥', '✨', '🌟', '💫', '💬'
				],
				stickerList: [],
				favoriteList: [],
				currentSticker: {},
				isFromFavorite: false,
				userId: null,
				// 上传相关
				uploadImage: '',
				isPrivate: false,
				isSubmitting: false,
				// 分页相关
				currentPage: 1,
				pageSize: 20,
				totalPages: 1,
				totalItems: 0,
				isLoading: false,
				// 收藏分页
				favoriteCurrentPage: 1,
				favoriteTotalPages: 1
			}
		},
		created() {
			this.showEmojiPicker = this.showPicker;
			// 获取用户ID
			const token = JSON.parse(window.localStorage.getItem('token'));
			if (token) {
				this.userId = token.id;
			}
			// 加载表情包和收藏
			this.loadStickers();
			this.loadFavorites();
			
			// 添加窗口大小变化的监听器
			window.addEventListener('resize', this.handleResize);
		},
		
		beforeDestroy() {
			// 移除窗口大小变化的监听器
			window.removeEventListener('resize', this.handleResize);
		},
		methods: {
			toggleEmojiPicker() {
				this.showEmojiPicker = !this.showEmojiPicker;
				this.$emit('toggle', this.showEmojiPicker);
				
				// 如果打开表情选择器，计算并设置其位置，并重新加载数据
				if (this.showEmojiPicker) {
					// 使用 nextTick 确保 DOM 已更新
					this.$nextTick(() => {
						this.updateEmojiPanelPosition();
						
						// 重新加载当前活动标签的数据
						if (this.activeTab === 'sticker') {
							this.loadStickers();
						} else if (this.activeTab === 'favorite') {
							this.loadFavorites();
						}
					});
				}
			},
			
			// 更新表情选择器面板位置
			updateEmojiPanelPosition() {
				const triggerEl = this.$el.querySelector('.emoji-trigger');
				const panelEl = this.$el.querySelector('.emoji-panel');
				
				if (!triggerEl || !panelEl) return;
				
				// 获取触发按钮的位置信息
				const triggerRect = triggerEl.getBoundingClientRect();
				const windowHeight = window.innerHeight || document.documentElement.clientHeight;
				
				// 获取面板的尺寸
				const panelRect = panelEl.getBoundingClientRect();
				const panelHeight = panelRect.height || 500;
				const safeDistance = 25; // 安全距离（px）
				
				// 默认将面板放在触发按钮上方
				let topPosition = triggerRect.top - panelHeight - safeDistance;
				
				// 如果上方空间不足，则将面板放在触发按钮下方
				if (topPosition < 0) {
					topPosition = triggerRect.bottom + safeDistance;
				}
				
				// 确保面板不会超出屏幕底部
				if (topPosition + panelHeight > windowHeight) {
					// 如果下方空间也不足，则选择空间较大的一侧
					if (triggerRect.top > (windowHeight - triggerRect.bottom)) {
						// 上方空间更大，放在上方并调整高度
						topPosition = 0;
						panelEl.style.height = `${triggerRect.top - safeDistance}px`;
					} else {
						// 下方空间更大，放在下方并调整高度
						topPosition = triggerRect.bottom + safeDistance;
						panelEl.style.height = `${windowHeight - topPosition - safeDistance}px`;
					}
				}
				
				// 设置面板位置
				panelEl.style.bottom = 'auto'; // 清除之前可能设置的 bottom 值
				panelEl.style.top = `${topPosition}px`;
			},
			// 选择Emoji表情
			selectEmoji(emoji) {
				this.$emit('select', {
					type: 'emoji',
					content: emoji
				});
				this.showEmojiPicker = false;
			},
			// 选择表情包
			selectSticker(sticker) {
				this.$emit('select', {
					type: 'sticker',
					content: sticker.url,
					sticker_id: sticker.sticker_id
				});
				this.showEmojiPicker = false;
			},
			// 加载表情包
			async loadStickers(resetPage = true) {
				try {
					if (resetPage) {
						this.currentPage = 1;
					}
					
					this.isLoading = true;
					const token = JSON.parse(window.localStorage.getItem('token')).tk;
					const res = await axios.get(this.$baseUrl + '/community/stickers', {
						params: { 
							category: this.activeCategory,
							page: this.currentPage,
							limit: this.pageSize
						},
						headers: { 'Authorization': 'Bearer ' + token }
					});
					
					// 根据分类显示不同的日志信息
					const categoryName = this.activeCategory === 'all' ? '全部' : 
										this.activeCategory === 'my' ? '我上传的' : 
										this.activeCategory === 'public' ? '公开' : this.activeCategory;
					console.log(`加载${categoryName}分类表情包:`, res.data);
					
					// 更新分页信息
					if (res.data.pagination) {
						this.totalPages = res.data.pagination.pages;
						this.totalItems = res.data.pagination.total;
					}
					
					// 如果是第一页，直接替换数据，否则追加数据
					if (this.currentPage === 1) {
						this.stickerList = res.data.stickers || [];
					} else {
						this.stickerList = [...this.stickerList, ...(res.data.stickers || [])];
					}
					
					// 检查是否有表情包
					if (this.stickerList.length === 0) {
						console.log(`${categoryName}分类没有表情包`);
					}
				} catch (error) {
					console.error('加载表情包失败', error);
					uni.showToast({
						title: '加载表情包失败',
						icon: 'none'
					});
				} finally {
					this.isLoading = false;
				}
			},
			// 加载更多表情包
			loadMoreStickers() {
				if (this.currentPage < this.totalPages && !this.isLoading) {
					this.currentPage++;
					this.loadStickers(false);
				}
			},
			// 加载收藏的表情包
			async loadFavorites(resetPage = true) {
				try {
					if (resetPage) {
						this.favoriteCurrentPage = 1;
					}
					
					this.isLoading = true;
					const token = JSON.parse(window.localStorage.getItem('token')).tk;
					const res = await axios.get(this.$baseUrl + '/community/stickers/favorites', {
						params: {
							page: this.favoriteCurrentPage,
							limit: this.pageSize
						},
						headers: { 'Authorization': 'Bearer ' + token }
					});
					
					// 更新分页信息
					if (res.data.pagination) {
						this.favoriteTotalPages = res.data.pagination.pages;
					}
					
					// 如果是第一页，直接替换数据，否则追加数据
					if (this.favoriteCurrentPage === 1) {
						this.favoriteList = res.data.stickers || [];
					} else {
						this.favoriteList = [...this.favoriteList, ...(res.data.stickers || [])];
					}
				} catch (error) {
					console.error('加载收藏表情包失败', error);
					uni.showToast({
						title: '加载收藏表情包失败',
						icon: 'none'
					});
				} finally {
					this.isLoading = false;
				}
			},
			// 加载更多收藏表情包
			loadMoreFavorites() {
				if (this.favoriteCurrentPage < this.favoriteTotalPages && !this.isLoading) {
					this.favoriteCurrentPage++;
					this.loadFavorites(false);
				}
			},
			// 选择表情包分类
			selectCategory(category) {
				this.activeCategory = category;
				this.loadStickers(true); // 重置页码并加载数据
			},
			// 显示表情包操作菜单
			showStickerOptions(sticker, fromFavorite = false) {
				this.currentSticker = sticker;
				this.isFromFavorite = fromFavorite;
				this.$refs.stickerOptionsPopup.open();
			},
			// 处理窗口大小变化
			handleResize() {
				if (this.showEmojiPicker) {
					this.updateEmojiPanelPosition();
				}
			},
			
			// 隐藏表情包操作菜单
			hideStickerOptions() {
				this.$refs.stickerOptionsPopup.close();
			},
			// 收藏/取消收藏表情包
			async toggleFavorite() {
				try {
					const token = JSON.parse(window.localStorage.getItem('token')).tk;
					if (this.currentSticker.is_favorite) {
						// 取消收藏
						await axios.delete(this.$baseUrl + '/community/stickers/favorites/' + this.currentSticker.sticker_id, {
							headers: { 'Authorization': 'Bearer ' + token }
						});
						uni.showToast({
							title: '已取消收藏',
							icon: 'none'
						});
					} else {
						// 添加收藏
						await axios.post(this.$baseUrl + '/community/stickers/favorites', {
							sticker_id: this.currentSticker.sticker_id
						}, {
							headers: { 'Authorization': 'Bearer ' + token }
						});
						uni.showToast({
							title: '收藏成功',
							icon: 'none'
						});
					}
					// 刷新列表
					this.loadFavorites();
					this.loadStickers();
					this.hideStickerOptions();
				} catch (error) {
					console.error('操作失败', error);
					uni.showToast({
						title: '操作失败，请重试',
						icon: 'none'
					});
				}
			},
			// 设置表情包为公开/私密
			async togglePrivate() {
				try {
					const token = JSON.parse(window.localStorage.getItem('token')).tk;
					const newPrivateStatus = !this.currentSticker.is_private;
					
					const response = await axios.put(this.$baseUrl + '/community/stickers/' + this.currentSticker.sticker_id, {
						is_private: newPrivateStatus
					}, {
						headers: { 'Authorization': 'Bearer ' + token }
					});
					
					console.log('设置表情包私密状态响应:', response.data);
					
					// 更新当前表情包的私密状态
					this.currentSticker.is_private = newPrivateStatus;
					
					uni.showToast({
						title: !newPrivateStatus ? '已设为公开' : '已设为私密',
						icon: 'none'
					});
					
					// 刷新列表
					this.loadStickers();
					// 如果是从收藏列表操作的，也刷新收藏列表
					if (this.isFromFavorite) {
						this.loadFavorites();
					}
					this.hideStickerOptions();
					
					// 提示用户表情包的私密状态变更
					setTimeout(() => {
						uni.showToast({
							title: newPrivateStatus ? '表情包已设为私密，仅自己可见' : '表情包已设为公开，所有人可见',
							icon: 'none',
							duration: 2000
						});
					}, 1000);
				} catch (error) {
					console.error('设置失败', error);
					uni.showToast({
						title: '设置失败，请重试',
						icon: 'none'
					});
				}
			},
			// 删除表情包
			async deleteSticker() {
				try {
					const token = JSON.parse(window.localStorage.getItem('token')).tk;
					await axios.delete(this.$baseUrl + '/community/stickers/' + this.currentSticker.sticker_id, {
						headers: { 'Authorization': 'Bearer ' + token }
					});
					
					uni.showToast({
						title: '删除成功',
						icon: 'none'
					});
					
					// 刷新列表
					this.loadStickers();
					this.loadFavorites();
					this.hideStickerOptions();
				} catch (error) {
					console.error('删除失败', error);
					uni.showToast({
						title: '删除失败，请重试',
						icon: 'none'
					});
				}
			},
			// 上传表情包
			uploadSticker() {
				this.uploadImage = '';
				// 默认设置为非私密，这样表情包会显示在全部中
				this.isPrivate = false;
				this.$refs.uploadPopup.open();
			},
			// 隐藏上传弹窗
			hideUploadPopup() {
				this.$refs.uploadPopup.close();
			},
			// 选择图片
			async chooseImage() {
				try {
					const res = await uni.chooseImage({
						count: 1,
						sizeType: ['compressed'],
						sourceType: ['album', 'camera']
					});
					
					if (res && res[1] && res[1].tempFilePaths && res[1].tempFilePaths.length > 0) {
						this.uploadImage = res[1].tempFilePaths[0];
					}
				} catch (error) {
					console.error('选择图片失败', error);
				}
			},
			// 移除上传图片
			removeUploadImage() {
				this.uploadImage = '';
			},
			// 切换上传图片的私密设置
			toggleUploadPrivacy(e) {
				this.isPrivate = e.detail.value;
			},
			// 提交上传
			async submitUpload() {
				if (!this.uploadImage || this.isSubmitting) return;
				
				this.isSubmitting = true;
				uni.showLoading({ title: '正在上传...' });
				
				try {
					// 先上传图片
					const uploadRes = await this.uploadFile(this.uploadImage);
					
					// 创建表情包记录
					const token = JSON.parse(window.localStorage.getItem('token')).tk;
					const response = await axios.post(this.$baseUrl + '/community/stickers', {
						url: uploadRes.url,
						is_private: this.isPrivate
					}, {
						headers: { 'Authorization': 'Bearer ' + token }
					});
					
					console.log('表情包上传响应:', response.data);
					
					uni.hideLoading();
					uni.showToast({
						title: '上传成功',
						icon: 'success'
					});
					
					// 保存当前分类
					const currentCategory = this.activeCategory;
					
					// 刷新列表
					this.loadStickers();
					this.hideUploadPopup();
					this.uploadImage = '';
					
					// 提示用户表情包的私密状态
					setTimeout(() => {
						uni.showToast({
							title: this.isPrivate ? '表情包已设为私密，仅自己可见' : '表情包已设为公开，所有人可见',
							icon: 'none',
							duration: 2000
						});
					}, 1000);
				} catch (error) {
					uni.hideLoading();
					console.error('上传失败', error);
					uni.showToast({
						title: '上传失败，请重试',
						icon: 'none'
					});
				} finally {
					this.isSubmitting = false;
				}
			},
			// 上传文件
			async uploadFile(filePath) {
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: 'https://storage.codesocean.top/api/resource/upload?container=172018735018984',
						filePath: filePath,
						name: 'file',
						header: {
							ServiceKey: "a24785bedb466b9733dd317771d4b69c08da07fd"
						},
						success: (uploadRes) => {
							try {
								const data = JSON.parse(uploadRes.data);
								resolve({
									url: "https://storage.codesocean.top/api/resource/get/" + data.data.resource_id
								});
							} catch (e) {
								reject(e);
							}
						},
						fail: (error) => {
							reject(error);
						}
					});
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.emoji-picker-container {
		position: relative;
		display: inline-block;
	}
	
	.emoji-trigger {
		padding: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.emoji-panel {
		position: fixed;
		/* bottom 值将通过 JS 动态设置 */
		left: 50%;
		transform: translateX(-50%);
		width: 100vw;
		max-width: 750rpx; /* 限制最大宽度 */
		height: 500rpx;
		max-height: 70vh; /* 限制最大高度 */
		background-color: #fff;
		border: 1rpx solid #eee;
		border-radius: 20rpx;
		box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		/* 确保在移动端能正常滚动 */
		-webkit-overflow-scrolling: touch;
	}
	
	.emoji-tabs {
		display: flex;
		height: 80rpx;
		min-height: 80rpx;
		border-bottom: 1rpx solid #eee;
		flex-shrink: 0;
	}
	
	.emoji-tab {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #666;
	}
	
	.emoji-tab.active {
		color: #EA7034;
		font-weight: bold;
		border-bottom: 4rpx solid #EA7034;
	}
	
	.emoji-content {
		flex: 1;
		overflow-y: auto;
		min-height: 0; /* 确保flex布局下正确计算高度 */
		-webkit-overflow-scrolling: touch; /* iOS平滑滚动 */
	}
	
	.emoji-grid {
		display: flex;
		flex-wrap: wrap;
		padding: 10rpx;
		min-height: min-content;
	}
	
	.emoji-item {
		width: 12.5%;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 40rpx;
	}
	
	.sticker-container {
		flex: 1;
		display: flex;
		flex-direction: column;
        overflow-y: auto;
	}
	
	.sticker-content {
		flex: 1;
		overflow-y: auto;
		min-height: 0; /* 确保flex布局下正确计算高度 */
		-webkit-overflow-scrolling: touch; /* iOS平滑滚动 */
	}
	
	.sticker-grid {
		display: flex;
		flex-wrap: wrap;
		padding: 10rpx;
		min-height: min-content;
	}
	
	.sticker-item, .sticker-upload {
		width: calc(25% - 20rpx);
		height: 150rpx;
		margin: 10rpx;
		border-radius: 8rpx;
		overflow: hidden;
	}
	
	.sticker-item log-image {
		width: 100%;
		height: 100%;
	}
	
	.sticker-upload {
		background-color: #f8f8f8;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 2rpx dashed #ddd;
	}
	
	.sticker-categories {
		height: 80rpx;
		min-height: 80rpx;
		border-top: 1rpx solid #eee;
		flex-shrink: 0;
		overflow: hidden;
	}
	
	.category-scroll {
		height: 100%;
		width: 100%;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}
	
	.category-list {
		display: flex;
		height: 100%;
		padding: 0 20rpx;
		width: max-content;
	}
	
	.category-item {
		padding: 0 30rpx;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #666;
		white-space: nowrap;
	}
	
	.category-item.active {
		color: #EA7034;
		font-weight: bold;
	}
	
	.empty-tip {
		width: 100%;
		padding: 40rpx 0;
		text-align: center;
		color: #999;
		font-size: 28rpx;
	}
	
	/* 加载更多相关样式 */
	.loading-more, .load-more, .no-more {
		width: 100%;
		padding: 20rpx 0;
		text-align: center;
		color: #999;
		font-size: 28rpx;
	}
	
	.load-more text {
		color: #EA7034;
		padding: 10rpx 30rpx;
		border-radius: 30rpx;
		border: 1rpx solid #EA7034;
		display: inline-block;
	}
	
	/* 表情包操作菜单 */
	.sticker-options {
		background-color: #fff;
		border-radius: 20rpx 20rpx 0 0;
		padding: 20rpx 0;
	}
	
	.option-item {
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		color: #333;
		border-bottom: 1rpx solid #f5f5f5;
	}
	
	.option-item.delete {
		color: #ff4d4f;
	}
	
	.option-item.cancel {
		margin-top: 20rpx;
		border-bottom: none;
		color: #999;
	}
	
	/* 上传表情包弹窗 */
	.upload-popup {
		background-color: #fff;
		border-radius: 20rpx 20rpx 0 0;
		padding-bottom: env(safe-area-inset-bottom);
	}
	
	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.popup-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	
	.close-btn {
		padding: 10rpx;
	}
	
	.upload-content {
		padding: 30rpx;
	}
	
	.upload-preview {
		width: 300rpx;
		height: 300rpx;
		margin: 0 auto 30rpx;
		position: relative;
		border-radius: 8rpx;
		overflow: hidden;
	}
	
	.upload-preview log-image {
		width: 100%;
		height: 100%;
	}
	
	.delete-btn {
		position: absolute;
		top: 10rpx;
		right: 10rpx;
		width: 40rpx;
		height: 40rpx;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.upload-btn {
		width: 300rpx;
		height: 300rpx;
		margin: 0 auto 30rpx;
		background-color: #f8f8f8;
		border: 2rpx dashed #ddd;
		border-radius: 8rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.upload-btn text {
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #999;
	}
	
	.privacy-setting {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
		margin-bottom: 30rpx;
	}
	
	.privacy-setting text {
		font-size: 28rpx;
		color: #333;
	}
	
	.submit-btn {
		width: 100%;
		height: 80rpx;
		background-color: #EA7034;
		color: #fff;
		font-size: 30rpx;
		border-radius: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.submit-btn[disabled] {
		background-color: #f5f5f5;
		color: #999;
	}
</style>