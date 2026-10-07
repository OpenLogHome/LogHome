<template>
  <view class="post-detail" v-dark @scroll="onPageScroll">
    <!-- 帖子内容 -->
    <scroll-view 
      scroll-y 
      class="content-scroll"
      :refresher-triggered="isRefreshing"
    >
      <!-- 主帖内容 -->
      <view class="post-content">
        <view
          v-if="post.circle_id || post.circle_name"
          class="post-circle clickable"
          @tap="navigateToCircle(post.circle_id)"
        >
          <log-image
            v-if="post.circle_icon"
            class="post-circle-icon"
            :src="post.circle_icon"
            mode="aspectFill"
          ></log-image>
          <view v-else class="post-circle-icon post-circle-icon-fallback">
            <uni-icons type="home-filled" size="18" color="#EA7034"></uni-icons>
          </view>
          <text class="post-circle-name">{{post.circle_name || '未知圈子'}}</text>
        </view>
        <view class="post-header">
          <view class="user-info clickable" @tap="navigateToUser(post.user_id)">
            <user-avatar class="user-avatar" :src="post.author_avatar" :frame="post.author_avatar_frame" :animate="true" :visual-scale="post.author_avatar_frame ? 1.2 : 1" />
            <view class="user-meta">
              <view class="user-name-row">
                <text class="user-name">{{post.author_name}}</text>
				<membership-badge class="community-membership-badge" :tier="post.author_membership_type" size="sm" :show-label="false" />
                <view
                  v-if="post.author_badge"
                  class="user-badge-tap"
                  @tap.stop="goToBadgeDetail(post.author_badge, post.user_id)"
                >
                  <honor-badge :badge="post.author_badge" size="sm" class="user-badge" scale="1.2" />
                </view>
                <view v-if="post.author_title_text" class="title-chip user-title-chip">
                  {{post.author_title_text}}
                </view>
              </view>
              <text class="post-time">{{formatTime(post.create_time)}}</text>
            </view>
          </view>
        </view>
        
        <view class="post-body">
          <text class="post-title">{{post.title}}</text>
          <view class="post-text">
            {{post.content}}
          </view>
          
          <!-- 显示绑定的作品 -->
          <view class="bound-novel clickable" v-if="post.novel_info" @tap="navigateToNovel(post.novel_info.novel_id)">
            <view class="novel-card">
              <log-image class="novel-cover" :src="post.novel_info.picUrl" mode="aspectFill" 
                onerror="onerror=null;src='../../static/images/defaultBookCover.png'"></log-image>
              <view class="novel-info">
                <text class="novel-title">《{{post.novel_info.name}}》</text>
                <view class="novel-author">
                  <text>作者: {{post.novel_info.author_name}}</text>
                </view>
                <text class="novel-desc">{{post.novel_info.content && post.novel_info.content.length > 100 ? post.novel_info.content.substring(0, 100) + '...' : post.novel_info.content}}</text>
              </view>
            </view>
          </view>
          
          <!-- 图片展示 -->
          <view class="post-images" v-if="post.media_urls && post.media_urls.length > 0">
            <view class="image-grid" :class="'grid-' + (post.media_urls.length > 3 ? 'multi' : post.media_urls.length)">
              <image 
                v-for="(img, imgIndex) in post.media_urls" 
                :key="imgIndex" 
                :src="img" 
                mode="aspectFill" 
                class="post-image"
                @tap="previewImage(post.media_urls, imgIndex)"
                @longpress="showImageOptions(img)"
              ></image>
            </view>
          </view>
        </view>
        
        <view class="post-actions">
          <view
            class="action-btn action-btn-like clickable"
            :class="{
              'is-liked': post.is_liked,
              'is-bursting': postLikeAnimating
            }"
            @tap="likePost"
          >
            <view class="post-like-icon-wrap">
              <view
                v-if="postLikeAnimating"
                :key="'burst-' + likeAnimationTick"
                class="pixel-heart-burst"
              >
                <view
                  v-for="burst in likeBurstParticles"
                  :key="burst.key"
                  class="pixel-heart pixel-heart-float"
                  :style="getLikeBurstStyle(burst)"
                ></view>
              </view>
              <view
                v-if="postLikeAnimating"
                :key="'core-' + likeAnimationTick"
                class="pixel-heart pixel-heart-core"
              ></view>
              <view class="heart-icon-shell">
                <uni-icons :type="post.is_liked ? 'heart-filled' : 'heart'" size="24" :color="post.is_liked ? '#EA7034' : (isDarkMode ? '#b8b8b8' : '#666')"></uni-icons>
              </view>
            </view>
            <text :class="{'liked': post.is_liked}">{{post.like_count}}</text>
          </view>
          <view class="action-btn clickable" @tap="focusComment">
            <uni-icons type="chat" size="24" :color="isDarkMode ? '#b8b8b8' : '#666'"></uni-icons>
            <text>{{post.comment_count}}</text>
          </view>
          <view class="action-btn clickable" @tap="sharePost">
            <uni-icons type="redo" size="24" :color="isDarkMode ? '#b8b8b8' : '#666'"></uni-icons>
            <text>分享</text>
          </view>
        </view>
      </view>
      
      <!-- 评论列表 -->
      <view class="comments-section">
        <view class="section-title">评论 {{post.comment_count || 0}}</view>
        <view class="comments-list" v-if="comments.length > 0">
          <view v-for="comment in comments" :key="comment.comment_id" class="comment-item">
            <!-- 主评论 -->
            <view class="comment-main">
              <user-avatar class="comment-avatar clickable" :src="comment.user_avatar" @tap="navigateToUser(comment.user_id)" />
              <view class="comment-content">
                <view class="comment-header">
                  <view class="comment-username-row">
                    <text class="comment-username">{{comment.user_name}}</text>
					<membership-badge class="community-membership-badge" :tier="comment.user_membership_type" size="xs" />
                    <view
                      v-if="comment.user_badge"
                      class="comment-badge-tap"
                      @tap.stop="goToBadgeDetail(comment.user_badge, comment.user_id)"
                    >
                      <honor-badge :badge="comment.user_badge" size="sm" class="comment-badge" scale="1.0" />
                    </view>
                    <view v-if="comment.user_title_text" class="title-chip comment-title-chip">
                      {{comment.user_title_text}}
                    </view>
                  </view>
                  <text class="comment-time">{{formatTime(comment.create_time)}}</text>
                </view>
                <text class="comment-text">{{comment.content}}</text>
                <!-- 评论图片 -->
                <view class="comment-images" v-if="comment.media_urls && comment.media_urls.length > 0">
                  <log-image 
                    v-for="(img, index) in comment.media_urls" 
                    :key="index"
                    :src="img"
                    mode="aspectFill"
                    class="comment-image"
                    @tap="previewImage(comment.media_urls, index)"
                    @longpress="showImageOptions(img)"
                  ></log-image>
                </view>
                <view class="comment-actions">
                  <view class="comment-like clickable" @tap="likeComment(comment)">
                    <uni-icons :type="comment.is_liked ? 'heart-filled' : 'heart'" size="14" :color="comment.is_liked ? '#EA7034' : (isDarkMode ? '#b8b8b8' : '#999')"></uni-icons>
                    <text :class="{'liked': comment.is_liked}">{{comment.like_count || 0}}</text>
                  </view>
                  <text class="comment-reply clickable" @tap="replyToComment(comment)">回复</text>
                  <text v-if="canDeleteComment(comment)" class="comment-delete clickable" @tap="deleteComment(comment)">删除</text>
                </view>
              </view>
            </view>
            
            <!-- 子评论 -->
            <view class="replies-list" v-if="comment.replies && comment.replies.length > 0">
              <view v-for="reply in comment.replies" :key="reply.comment_id" class="reply-item">
                <user-avatar class="reply-avatar clickable" :src="reply.user_avatar" @tap="navigateToUser(reply.user_id)" />
                <view class="reply-content">
                  <view class="reply-header">
                    <view class="reply-username-row">
                      <text class="reply-username">{{reply.user_name}}</text>
					  <membership-badge class="community-membership-badge" :tier="reply.user_membership_type" size="xs" />
                      <view
                        v-if="reply.user_badge"
                        class="reply-badge-tap"
                        @tap.stop="goToBadgeDetail(reply.user_badge, reply.user_id)"
                      >
                        <honor-badge :badge="reply.user_badge" size="sm" class="reply-badge" scale="1.0" />
                      </view>
                      <view v-if="reply.user_title_text" class="title-chip reply-title-chip">
                        {{reply.user_title_text}}
                      </view>
                    </view>
                    <text class="reply-target" v-if="reply.reply_user_name">回复 {{reply.reply_user_name}}</text>
                    <text class="reply-time">{{formatTime(reply.create_time)}}</text>
                  </view>
                  <text class="reply-text">{{reply.content}}</text>
                  <!-- 回复图片 -->
                  <view class="reply-images" v-if="reply.media_urls && reply.media_urls.length > 0">
                    <log-image 
                      v-for="(img, index) in reply.media_urls" 
                      :key="index"
                      :src="img"
                      mode="aspectFill"
                      class="reply-image"
                      @tap="previewImage(reply.media_urls, index)"
                      @longpress="showImageOptions(img)"
                    ></log-image>
                  </view>
                  <view class="reply-actions">
                    <view class="reply-like clickable" @tap="likeComment(reply)">
                      <uni-icons :type="reply.is_liked ? 'heart-filled' : 'heart'" size="14" :color="reply.is_liked ? '#EA7034' : (isDarkMode ? '#b8b8b8' : '#999')"></uni-icons>
                      <text :class="{'liked': reply.is_liked}">{{reply.like_count || 0}}</text>
                    </view>
                    <text class="reply-btn clickable" @tap="replyToComment(reply, comment)">回复</text>
                    <text v-if="canDeleteComment(reply)" class="reply-delete clickable" @tap="deleteComment(reply, comment)">删除</text>
                  </view>
                </view>
              </view>
              <text class="show-more clickable" v-if="comment.total_replies > comment.replies.length" @tap="loadMoreReplies(comment)">
                展开更多回复
              </text>
            </view>
          </view>
        </view>
        
        <view class="no-comments" v-if="comments.length === 0 && !isLoading">
          <text>暂无评论，快来发表第一条评论吧</text>
        </view>
        
        <!-- 加载状态提示 -->
        <view class="loading-more" v-if="loadingStatus === 'loading'">
          <view class="loading-spinner"></view>
          <text>努力加载中...</text>
        </view>
        <view class="loading-more" v-if="loadingStatus === 'noMore'">
          <text>没有更多数据了</text>
        </view>
      </view>
    </scroll-view>
    
    <!-- 评论输入框 -->
    <view class="comment-input" :class="{'with-image': selectedImages.length > 0}">
      <view class="input-wrapper">
        <view class="textarea-wrapper" :class="{'is-expanded': commentText.length > 0}">
          <textarea
            class="comment-textarea"
            v-model="commentText"
            :placeholder="replyTo ? `回复 ${replyTo.user_name}` : '写下你的评论...'"
            :auto-height="false"
            :maxlength="commentMaxLength"
            :focus="inputFocus"
            @input="onCommentInput"
            @blur="onInputBlur"
            adjust-position="false"
          ></textarea>
          <text v-if="commentText.length > 0" class="comment-length"
            :class="{'is-near-limit': commentLength >= commentMaxLength * 0.9}">
            {{commentLength}} / {{commentMaxLength}}
          </text>
        </view>
        <view class="input-actions">
          <emoji-picker @select="onEmojiSelect"></emoji-picker>
          <view class="image-upload clickable" @tap="chooseImage">
            <uni-icons type="image" size="24" :color="isDarkMode ? '#b8b8b8' : '#666'"></uni-icons>
          </view>
          <button class="send-btn clickable" :disabled="isSubmitting || (!commentText && selectedImages.length === 0)" @tap="submitComment">
            {{ isSubmitting ? '发送中...' : '发送' }}
          </button>
        </view>
      </view>
      <!-- 已选图片预览 -->
      <view class="selected-images" v-if="selectedImages.length > 0">
        <view v-for="(image, index) in selectedImages" :key="index" class="image-preview">
          <image :src="image" mode="aspectFill"></image>
          <view class="remove-image" @tap="removeImage(index)">
            <uni-icons type="closeempty" size="20" color="#fff"></uni-icons>
          </view>
        </view>
        <view class="add-image" v-if="selectedImages.length < 9" @tap="chooseImage">
          <uni-icons type="plusempty" size="32" :color="isDarkMode ? '#b8b8b8' : '#999'"></uni-icons>
        </view>
      </view>
    </view>
    
    <!-- 图片长按菜单 -->
    <uni-popup ref="imageOptionsPopup" type="bottom">
      <view class="popup-content">
        <view class="popup-item" @tap="saveAsSticker">
          <uni-icons type="star" size="20" color="#EA7034"></uni-icons>
          <text>收藏为表情</text>
        </view>
        <view class="popup-item cancel" @tap="hideImageOptions">
          <text>取消</text>
        </view>
      </view>
    </uni-popup>
    
    <task-reward-modal 
      ref="taskRewardModal"
      @harvest="handleHarvestFromModal">
    </task-reward-modal>
  </view>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import emojiPicker from '../../components/emoji-picker/emoji-picker.vue'
import TaskRewardModal from "../../components/TaskRewardModal.vue"
import HonorBadge from '../../components/honor-badge.vue'
import MembershipBadge from '../../components/membership-badge.vue'
import { settleAndNotifyExpTaskCompletion } from '../../lib/treeExpTaskNotifier.js'
import darkModeMixin from '@/mixins/dark-mode.js'

export default {
  components: {
    emojiPicker,
    TaskRewardModal,
    HonorBadge,
    MembershipBadge
  },
  mixins: [darkModeMixin],
  data() {
    return {
      post: {},
      comments: [],
      commentText: '',
      selectedImages: [],
      isRefreshing: false,
      loadingStatus: 'more',
      page: 1,
      pageSize: 10,
      hasMore: true,
      inputFocus: false,
      replyTo: null,
      parentComment: null,
      isSubmitting: false,
      commentMaxLength: 500,
      isLoading: true,
      userRole: -1, // -1: 未知, 0: 普通成员, 1: 管理员, 2: 圈主
      currentImageUrl: '', // 当前长按选中的图片URL
      postLikeAnimating: false,
      likeAnimationTick: 0,
      likeAnimationTimer: null,
      likeBurstParticles: [
        { key: 'tl', left: '4rpx', top: '8rpx', driftX: '-14rpx', driftY: '-20rpx', delay: '0ms', duration: '520ms', scale: '0.72' },
        { key: 'tm', left: '12rpx', top: '2rpx', driftX: '0rpx', driftY: '-28rpx', delay: '40ms', duration: '560ms', scale: '0.88' },
        { key: 'tr', left: '22rpx', top: '8rpx', driftX: '14rpx', driftY: '-18rpx', delay: '80ms', duration: '520ms', scale: '0.72' },
        { key: 'ml', left: '2rpx', top: '18rpx', driftX: '-18rpx', driftY: '-10rpx', delay: '30ms', duration: '500ms', scale: '0.64' },
        { key: 'mr', left: '24rpx', top: '18rpx', driftX: '18rpx', driftY: '-10rpx', delay: '70ms', duration: '500ms', scale: '0.64' },
        { key: 'bm', left: '12rpx', top: '24rpx', driftX: '0rpx', driftY: '-16rpx', delay: '110ms', duration: '480ms', scale: '0.58' }
      ]
    }
  },
  onLoad(params) {
    this.postId = params.id
    this.loadPostDetail()
    this.loadComments()
  },
  onReady() {
  },
  onShow() {
  },
  onUnload() {
    this.clearPostLikeAnimation()
  },
  onPullDownRefresh() {
    Promise.all([
      this.loadPostDetail(),
      this.loadComments(true)
    ]).finally(() => {
      uni.stopPullDownRefresh();
    })
  },
  onNavigationBarButtonTap(e) {
		let _this = this;
		if(e.text=="\ue790 "){
			let itemList = ["分享贴子"];
      let user = localStorage.getItem("LogHomeUserInfo");
      if(user) {
        user = JSON.parse(user);
        // 管理员/圈主/作者可删除，作者可编辑
        const canDelete = user.is_admin == 1 || user.user_id == this.post.user_id || this.userRole == 1 || this.userRole == 2;
        const canEdit = user.user_id == this.post.user_id;
        if(canDelete) itemList.push("删除帖子");
        if(canEdit) itemList.push("编辑帖子");
      }
      uni.showActionSheet({
          itemList,
          success: function (res) {
              if(itemList[res.tapIndex] == '分享贴子') {
                _this.sharePost();
              } else if(itemList[res.tapIndex] == '编辑帖子') {
                uni.navigateTo({
                  url: `/pages/community/postEdit?post_id=${_this.post.post_id}`
                });
              } else if(itemList[res.tapIndex] == '删除帖子') {
                uni.showModal({
                  title: '确认删除',
                  content: '确定要删除该帖子吗？',
                  success: async (modalRes) => {
                    if(modalRes.confirm) {
                      try {
                        const token = JSON.parse(window.localStorage.getItem('token')).tk;
                        await axios.delete(_this.$baseUrl + `/community/posts/${_this.post.post_id}`, {
                          headers: { 'Authorization': 'Bearer ' + token }
                        });
                        uni.showToast({ title: '删除成功', icon: 'success' });
                        setTimeout(() => { uni.navigateBack(); }, 1200);
                      } catch (err) {
                        uni.showToast({ title: '删除失败', icon: 'none' });
                      }
                    }
                  }
                });
              }
          },
          fail: function (res) {
              console.log(res.errMsg);
          }
      });
		}
	},
  methods: {
    getLikeBurstStyle(burst) {
      return {
        left: burst.left,
        top: burst.top,
        animationDelay: burst.delay,
        animationDuration: burst.duration,
        '--drift-x': burst.driftX,
        '--drift-y': burst.driftY,
        '--heart-scale': burst.scale
      }
    },
    triggerPostLikeAnimation() {
      this.clearPostLikeAnimation()
      this.likeAnimationTick += 1
      this.$nextTick(() => {
        this.postLikeAnimating = true
        this.likeAnimationTimer = setTimeout(() => {
          this.postLikeAnimating = false
          this.likeAnimationTimer = null
        }, 760)
      })
    },
    clearPostLikeAnimation() {
      if (this.likeAnimationTimer) {
        clearTimeout(this.likeAnimationTimer)
        this.likeAnimationTimer = null
      }
      this.postLikeAnimating = false
    },
    async loadPostDetail() {
      try {
        const res = await axios.get(this.$baseUrl + '/community/posts/detail/' + this.postId)
        this.post = res.data
        await this.loadCircleInfo(this.post.circle_id)
        
        // 获取帖子的点赞状态
        await this.getLikeStatus()
        // 获取当前用户在圈子的角色
        await this.getUserRole()
      } catch (error) {
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    },

    async loadCircleInfo(circleId) {
      if (!circleId) return

      try {
        const res = await axios.get(this.$baseUrl + '/community/circles/detail/' + circleId)
        this.$set(this.post, 'circle_icon', res.data.icon || '')
      } catch (error) {
        // 圈子信息加载失败时保留默认图标，不影响帖子内容展示
        this.$set(this.post, 'circle_icon', '')
      }
    },
    
    async getLikeStatus() {
      try {
        const token = JSON.parse(window.localStorage.getItem('token')).tk
        const res = await axios.get(this.$baseUrl + '/community/interactions/like/status', {
          params: {
            target_id: this.postId,
            target_type: 1
          },
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
        
        this.post.is_liked = res.data.liked
        this.$forceUpdate();
      } catch (error) {
        console.error('获取点赞状态失败:', error)
      }
    },
    
    async loadComments(refresh = false) {
      if (!refresh && (!this.hasMore || this.loadingStatus === 'loading')) return
      this.loadingStatus = 'loading'
      this.isLoading = true
      try {
        const token = window.localStorage.getItem('token');
        const headers = token ? { 'Authorization': 'Bearer ' + JSON.parse(token).tk } : {};
        
        const res = await axios.get(this.$baseUrl + '/community/comments/list', {
          params: {
            post_id: this.postId,
            page: refresh ? 1 : this.page,
            pageSize: this.pageSize
          },
          headers
        })
        
        const comments = res.data.list || [];
        for (let comment of comments) {
          if (comment.image_url) {
            comment.media_urls = [comment.image_url];
          } else {
            comment.media_urls = [];
          }
          comment.replies = [];
          comment.total_replies = comment.reply_count || 0;
          await this.loadRepliesForComment(comment, 1, 3);
        }
        if (refresh) {
          this.comments = comments;
          this.page = 1;
        } else {
          this.comments.push(...comments);
          this.page++;
        }
        this.hasMore = comments.length === this.pageSize;
        this.loadingStatus = this.hasMore ? 'more' : 'noMore';
      } catch (error) {
        this.loadingStatus = 'more';
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.isLoading = false
      }
    },
    async loadRepliesForComment(comment, page = 1, pageSize = 3) {
      try {
        const token = window.localStorage.getItem('token');
        const headers = token ? { 'Authorization': 'Bearer ' + JSON.parse(token).tk } : {};
        
        const res = await axios.get(this.$baseUrl + '/community/comments/replies', {
          params: {
            comment_id: comment.comment_id,
            page,
            pageSize
          },
          headers
        });
        const replies = res.data.list || [];
        for (let reply of replies) {
          if (reply.image_url) {
            reply.media_urls = [reply.image_url];
          } else {
            reply.media_urls = [];
          }
        }
        comment.replies = replies;
        comment.total_replies = res.data.total || replies.length;
      } catch (error) {
        console.error('加载回复失败:', error);
      }
    },
    async getCommentLikeStatus(comment) {
      try {
        const token = JSON.parse(window.localStorage.getItem('token')).tk
        const res = await axios.get(this.$baseUrl + '/community/interactions/like/status', {
          params: {
            target_id: comment.comment_id,
            target_type: 2
          },
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
        
        comment.is_liked = res.data.liked
      } catch (error) {
        console.error('获取评论点赞状态失败:', error)
      }
    },
    
    async loadMoreReplies(comment) {
      try {
        const token = window.localStorage.getItem('token');
        const headers = token ? { 'Authorization': 'Bearer ' + JSON.parse(token).tk } : {};
        
        const nextPage = Math.floor(comment.replies.length / 10) + 1;
        const res = await axios.get(this.$baseUrl + '/community/comments/replies', {
          params: {
            comment_id: comment.comment_id,
            page: nextPage,
            pageSize: 10
          },
          headers
        })
        const replies = res.data.list || [];
        for (let reply of replies) {
          if (reply.image_url) {
            reply.media_urls = [reply.image_url];
          } else {
            reply.media_urls = [];
          }
        }
        const existingIds = new Set(comment.replies.map(r => r.comment_id));
        const newReplies = replies.filter(r => !existingIds.has(r.comment_id));
        comment.replies.push(...newReplies);
        comment.total_replies = res.data.total || comment.replies.length;
      } catch (error) {
        console.error('加载更多回复失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    },
    
    async likePost() {
      try {
        const token = JSON.parse(window.localStorage.getItem('token')).tk
        await axios.post(this.$baseUrl + '/community/interactions/like', {
          target_id: this.post.post_id,
          target_type: 1
        }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
        
        const nextLiked = !this.post.is_liked
        const currentLikeCount = Number(this.post.like_count) || 0

        this.post.is_liked = nextLiked
        this.post.like_count = Math.max(0, currentLikeCount + (nextLiked ? 1 : -1))

        if (nextLiked) {
          this.triggerPostLikeAnimation()
        } else {
          this.clearPostLikeAnimation()
        }
      } catch (error) {
        console.error('点赞失败:', error);
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    },
    
    async likeComment(comment) {
      try {
        const token = JSON.parse(window.localStorage.getItem('token')).tk
        await axios.post(this.$baseUrl + '/community/interactions/like', {
          target_id: comment.comment_id,
          target_type: 2
        }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
        
        comment.is_liked = !comment.is_liked
        comment.like_count += comment.is_liked ? 1 : -1
      } catch (error) {
        console.error('点赞失败:', error);
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    },
    
    replyToComment(comment, parent = null) {
      // parent: 如果是主评论，parent=null；如果是子评论，parent=主评论
      if (!parent) {
        // 回复主评论
        this.replyTo = comment;
        this.parentComment = comment;
      } else {
        // 回复子评论
        this.replyTo = comment;
        this.parentComment = parent;
      }
      this.inputFocus = true;
    },
    
    async submitComment() {
      if (this.isSubmitting || (!this.commentText && this.selectedImages.length === 0)) return
      if (this.commentText.length > this.commentMaxLength) {
        uni.showToast({
          title: `回复不能超过${this.commentMaxLength}字`,
          icon: 'none'
        })
        return
      }
      this.isSubmitting = true
      uni.showLoading({
        title: '发送中...',
        mask: true
      })
      try {
        // 使用评论文本，不需要处理表情包标记
        let processedText = this.commentText;
        
        // 处理图片上传
        let image_url = null;
        if (this.selectedImages.length > 0) {
          uni.showLoading({
            title: '正在上传图片...',
            mask: true
          })
          // 检查图片URL是否已经是完整的网络URL（表情包的情况）
          if (this.selectedImages[0].startsWith('http')) {
            image_url = this.selectedImages[0];
          } else {
            // 本地图片需要上传
            const uploadRes = await this.uploadFile(this.selectedImages[0]);
            image_url = uploadRes.url;
          }
        }
        // 发送评论
        const data = {
          post_id: this.postId,
          content: processedText.trim(),
          image_url: image_url
        }
        if (this.replyTo) {
          data.reply_to_user_id = this.replyTo.user_id;
          // parent_id 必须为被回复的评论id
          data.parent_id = this.replyTo.comment_id;
        }
        // 获取token并添加到请求头
        const token = JSON.parse(window.localStorage.getItem('token')).tk
        const response = await axios.post(this.$baseUrl + '/community/comments/create', data, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
        
        // 获取新创建的评论数据
        const newComment = response.data.comment;
        
        // 处理新评论的媒体URL
        if (newComment.image_url) {
          newComment.media_urls = [newComment.image_url];
        } else {
          newComment.media_urls = [];
        }
        
        // 添加用户信息
        const userInfo = JSON.parse(localStorage.getItem('LogHomeUserInfo') || '{}');
        newComment.user_name = userInfo.name;
        newComment.user_avatar = userInfo.avatar_url;
        
        // 增加帖子评论计数
        this.post.comment_count++;
        
        // 根据评论类型决定如何插入
        if (!this.replyTo) {
          // 新的主评论，直接添加到评论列表末尾
          newComment.replies = [];
          newComment.total_replies = 0;
          newComment.reply_count = 0;
          newComment.is_liked = false;
          newComment.like_count = 0;
          
          // 添加到列表末尾（因为是时间升序）
          this.comments.push(newComment);
        } else if (this.parentComment) {
          // 回复某个评论
          newComment.is_liked = false;
          newComment.like_count = 0;
          
          // 如果是回复主评论
          if (this.replyTo.comment_id === this.parentComment.comment_id) {
            // 更新主评论的回复计数
            this.parentComment.total_replies++;
            this.parentComment.reply_count = this.parentComment.total_replies;
            
            // 添加到回复列表末尾
            if (!this.parentComment.replies) {
              this.parentComment.replies = [];
            }
            this.parentComment.replies.push(newComment);
          } else {
            // 回复子评论，更新父主评论的回复区域
            this.parentComment.total_replies++;
            this.parentComment.reply_count = this.parentComment.total_replies;
            
            // 添加回复用户名称
            newComment.reply_user_name = this.replyTo.user_name;
            
            // 添加到回复列表末尾
            if (!this.parentComment.replies) {
              this.parentComment.replies = [];
            }
            this.parentComment.replies.push(newComment);
          }
        }
        
        // 重置状态
        this.commentText = ''
        this.selectedImages = []
        this.replyTo = null
        this.parentComment = null
        this.inputFocus = false
        
        uni.showToast({
          title: '发送成功',
          icon: 'success'
        })

        // 触发回帖任务
        settleAndNotifyExpTaskCompletion(this, 'community_reply', 1).catch(() => {})
        axios.post(this.$baseUrl + '/treePlant/do_task', 
          { task_code: 'daily_reply' },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            }
          }
        ).then((taskRes) => {
          const data = taskRes.data || {};
          const modal = this.$refs.taskRewardModal;
          if (modal) {
            modal.show({
              reward: typeof data.reward === 'number' ? data.reward : 15,
              taskName: '每日任务：首次回帖',
              icon: data.task_icon,
              currentGrowth: typeof data.growth_val === 'number' ? data.growth_val : 0,
              maxGrowth: 100,
              canHarvest: data.tree_status === '结果'
            });
          }
        }).catch((err) => {
          // 忽略错误
        });

      } catch (error) {
        console.error('评论发送失败:', error);
        uni.showToast({
          title: (error.response && error.response.data && (error.response.data.msg || error.response.data.message)) || '发送失败',
          icon: 'none'
        })
      } finally {
        this.isSubmitting = false
        uni.hideLoading()
      }
    },
    
    handleHarvestFromModal() {
      uni.navigateTo({
        url: '/pages/treePlant/treeplant'
      });
    },

    async uploadFile(filePath) {
      return new Promise((resolve, reject) => {
        uni.showToast({
          title: "图片上传中",
          icon: 'loading',
          duration: 2000
        });
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
    },
    
    chooseImage() {
      if (this.selectedImages.length >= 9) {
        uni.showToast({
          title: '最多选择9张图片',
          icon: 'none'
        })
        return
      }
      
      uni.chooseImage({
        count: 9 - this.selectedImages.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.selectedImages.push(...res.tempFilePaths)
        }
      })
    },
    
    removeImage(index) {
      this.selectedImages.splice(index, 1)
    },
    
    previewImage(images, index) {
      uni.previewImage({
        urls: images,
        current: images[index]
      })
    },
    
    showImageOptions(imageUrl) {
      this.currentImageUrl = imageUrl;
      this.$refs.imageOptionsPopup.open();
    },
    
    hideImageOptions() {
      this.$refs.imageOptionsPopup.close();
    },
    
    async saveAsSticker() {
       try {
         uni.showLoading({ title: '处理中...' });
         const token = JSON.parse(window.localStorage.getItem('token')).tk;
         const userId = JSON.parse(window.localStorage.getItem('token')).id;
         
         // 1. 检查图片链接是否已存在对应的sticker项目
         const checkRes = await axios.get(this.$baseUrl + '/community/stickers', {
           params: { url: this.currentImageUrl },
           headers: { 'Authorization': 'Bearer ' + token }
         });
         
         let stickerId = null;
         let needCreateSticker = false;
         
         if (checkRes.data && checkRes.data.length > 0) {
           // 图片已存在对应的sticker
           const existingSticker = checkRes.data[0];
           
           if (existingSticker.is_private === 0) {
             // 公开的，直接收藏
             stickerId = existingSticker.sticker_id;
           } else if (existingSticker.user_id === userId) {
             // 私密的，但是是自己的，直接收藏
             stickerId = existingSticker.sticker_id;
           } else {
             // 私密的，且不是自己的，需要重新创建
             needCreateSticker = true;
           }
         } else {
           // 不存在，需要创建
           needCreateSticker = true;
         }
         
         // 2. 如果需要创建新的sticker
         if (needCreateSticker) {
           const createRes = await axios.post(this.$baseUrl + '/community/stickers', {
             url: this.currentImageUrl,
             is_private: false // 默认创建为公开的
           }, {
             headers: { 'Authorization': 'Bearer ' + token }
           });
           
           stickerId = createRes.data.sticker_id;
         }
         
         // 3. 收藏sticker
         if (stickerId) {
           // 检查是否已收藏
           const favoritesRes = await axios.get(this.$baseUrl + '/community/stickers/favorites', {
             headers: { 'Authorization': 'Bearer ' + token }
           });
           
           // 适配新的API返回结构，data.stickers 是表情列表
           const stickers = favoritesRes.data.stickers || favoritesRes.data;
           const isAlreadyFavorite = Array.isArray(stickers) && stickers.some(item => item.sticker_id === stickerId);
           
           if (!isAlreadyFavorite) {
             await axios.post(this.$baseUrl + '/community/stickers/favorites', {
               sticker_id: stickerId
             }, {
               headers: { 'Authorization': 'Bearer ' + token }
             });
           }
           
           uni.hideLoading();
           uni.showToast({
             title: '已添加到表情收藏',
             icon: 'success'
           });
         } else {
           uni.hideLoading();
           uni.showToast({
             title: '收藏失败',
             icon: 'none'
           });
         }
         
         this.hideImageOptions();
       } catch (error) {
         uni.hideLoading();
         console.error('收藏表情失败:', error);
         uni.showToast({
           title: '收藏失败',
           icon: 'none'
         });
       }
     },
    
    sharePost() {
      this.createShareCode();
    },
    
    traditionalShare() {
      return `来自原木社区的分享：${this.post.title}\n${this.post.content.substring(0, 50)}${this.post.content.length > 50 ? '...' : ''}\n点击链接查看详情：https://loghome.ink/community/post/${this.post.post_id}`;
    },
    
    createShareCode() {
      uni.showLoading({
        title: '创建口令中...'
      });

      let tk = JSON.parse(window.localStorage.getItem('token'));
      if (!tk || !tk.tk) {
        uni.hideLoading();
        uni.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      axios.post(this.$baseUrl + '/community/posts/create_share_code', {
        post_id: this.post.post_id,
        share_message: this.traditionalShare(),
        expires_hours: 24 * 30 // 30天有效期
      }, {
        headers: {
          'Authorization': 'Bearer ' + tk.tk
        }
      }).then((res) => {
        uni.hideLoading();

        if (res.data.success) {
          // 复制口令到剪贴板
          this.$bus.$emit("clipboardChange", res.data.share_text)
          uni.setClipboardData({
            data: res.data.share_text,
            success: () => {
              uni.showModal({
                title: '口令创建成功',
                content: `口令：${res.data.code}\n\n口令已复制到剪贴板，分享给好友即可！`,
                showCancel: false,
                confirmText: '知道了'
              });
            }
          });
        } else {
          uni.showToast({
            title: res.data.msg || '口令创建失败',
            icon: 'none',
            duration: 2000
          });
        }
      }).catch((error) => {
        uni.hideLoading();
        console.error('创建口令失败:', error);
        uni.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none',
          duration: 2000
        });
      });
    },
    
    formatTime(time) {
      const now = moment();
      const postTime = moment(time);
      const diff = now.diff(postTime, 'minutes');
      
      if (diff < 1) return '刚刚';
      if (diff < 60) return `${diff}分钟前`;
      
      const hourDiff = now.diff(postTime, 'hours');
      if (hourDiff < 24) return `${hourDiff}小时前`;
      
      const dayDiff = now.diff(postTime, 'days');
      if (dayDiff < 30) return `${dayDiff}天前`;
      
      const monthDiff = now.diff(postTime, 'months');
      if (monthDiff < 12) return `${monthDiff}个月前`;
      
      const yearDiff = now.diff(postTime, 'years');
      return `${yearDiff}年前`;
    },
    
    navigateToUser(userId) {
      uni.navigateTo({
        url: '/pages/users/personalPage?id=' + userId
      })
    },
    
    goToBadgeDetail(badge, ownerId) {
      if (!badge) return
      uni.setStorageSync('badgeDetailPayload', badge)
      const ownerIdNum = Number(ownerId)
      if (Number.isFinite(ownerIdNum) && ownerIdNum > 0) {
        uni.setStorageSync('badgeDetailOwnerId', ownerIdNum)
      }
      let encodedBadge = ''
      try {
        encodedBadge = encodeURIComponent(JSON.stringify(badge))
      } catch (e) {
        encodedBadge = ''
      }
      const query = []
      if (encodedBadge) query.push('badge=' + encodedBadge)
      if (Number.isFinite(ownerIdNum) && ownerIdNum > 0) query.push('owner_id=' + ownerIdNum)
      query.push('is_selected=1')
      uni.navigateTo({
        url: '/pages/users/badgeDetail' + (query.length ? ('?' + query.join('&')) : ''),
        fail() {
          uni.navigateTo({
            url: Number.isFinite(ownerIdNum) && ownerIdNum > 0
              ? '/pages/users/badgeDetail?owner_id=' + ownerIdNum
              : '/pages/users/badgeDetail'
          })
        }
      })
    },
    
    navigateToCircle(circleId) {
      uni.navigateTo({
        url: '/pages/community/circle?id=' + circleId
      })
    },
    
    navigateToNovel(novelId) {
      uni.navigateTo({
        url: '/pages/readers/bookInfo?id=' + novelId
      })
    },
    
    onPageScroll(ev) {
      let pageHeight = document.querySelector('.content-scroll').scrollHeight;
      let scrollTop = ev.scrollTop;
      let screenHeight = uni.getSystemInfoSync().windowHeight;
      if (scrollTop + screenHeight + 100 >= pageHeight) {
        this.loadComments()
      }
    },
    
    focusComment() {
      this.inputFocus = true
    },
    
    onInputBlur() {
      setTimeout(() => {
        if (!this.commentText) {
          this.replyTo = null
          this.parentComment = null
        }
      }, 100)
    },

    onCommentInput(event) {
      const value = event && event.detail ? String(event.detail.value || '') : this.commentText;
      if (value.length > this.commentMaxLength) {
        this.commentText = value.slice(0, this.commentMaxLength);
      }
    },
    
    // 处理表情选择
    onEmojiSelect(data) {
      if (data.type === 'emoji') {
        // 直接插入Emoji表情
        this.commentText = (this.commentText + data.content).slice(0, this.commentMaxLength);
      } else if (data.type === 'sticker') {
        // 直接将表情包作为图片添加到 selectedImages 中
        this.selectedImages.push(data.content);
      }
    },
    async getUserRole() {
      try {
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
        const res = await axios.get(this.$baseUrl + '/community/circles/my-circles', {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        if (res.data && res.data.length > 0 && this.post.circle_id) {
          const circle = res.data.find(c => c.circle_id == this.post.circle_id);
          if (circle) {
            this.userRole = circle.role;
          } else {
            this.userRole = 0;
          }
        }
      } catch (error) {
        this.userRole = 0;
      }
    },
    canDeleteComment(comment) {
      const user = JSON.parse(localStorage.getItem('LogHomeUserInfo') || '{}');
      return (
        user.user_id === comment.user_id || // 评论作者
        user.user_id === this.post.user_id || // 帖子作者
        user.is_admin == 1 || // 超级管理员
        this.userRole == 1 || this.userRole == 2 // 圈主/管理员
      );
    },
    async refreshRepliesForComment(parentComment) {
      // 刷新父主评论的 replies 区域，数量与当前显示一致
      await this.loadRepliesForComment(parentComment, 1, parentComment.replies.length || 3);
    },
    async deleteComment(comment, parentComment = null) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除该评论吗？',
        success: async (modalRes) => {
          if (modalRes.confirm) {
            try {
              const token = JSON.parse(window.localStorage.getItem('token')).tk;
              await axios.delete(this.$baseUrl + `/community/comments/${comment.comment_id}`, {
                headers: { 'Authorization': 'Bearer ' + token }
              });
              uni.showToast({ title: '删除成功', icon: 'success' });
              
              // 判断是主评论还是子评论
              if (comment.parent_id === 0) {
                // 主评论，直接从数组中移除
                const index = this.comments.findIndex(c => c.comment_id === comment.comment_id);
                if (index !== -1) {
                  this.comments.splice(index, 1);
                  
                  // 更新帖子评论计数
                  if (this.post.comment_count > 0) {
                    this.post.comment_count -= 1 + (comment.reply_count || 0);
                  }
                }
              } else {
                // 子评论，刷新父主评论的 replies
                // parentComment 传递自模板
                let parent = parentComment;
                if (!parent) {
                  // fallback: 尝试在 this.comments 中查找
                  parent = this.comments.find(c => c.comment_id === comment.root_id || c.comment_id === comment.parent_id);
                }
                
                if (parent) {
                  // 直接从父评论的 replies 数组中移除这条回复
                  const replyIndex = parent.replies.findIndex(r => r.comment_id === comment.comment_id);
                  if (replyIndex !== -1) {
                    parent.replies.splice(replyIndex, 1);
                    
                    // 更新回复计数
                    if (parent.total_replies > 0) {
                      parent.total_replies--;
                    }
                    
                    // 更新帖子评论计数
                    if (this.post.comment_count > 0) {
                      this.post.comment_count--;
                    }
                  }
                } else {
                  // 如果找不到父评论，则刷新全部（应该很少发生）
                  this.loadComments(true);
                }
              }
            } catch (err) {
              console.error('删除评论失败:', err);
              uni.showToast({ title: '删除失败', icon: 'none' });
            }
          }
        }
      });
    }
  },
  computed: {
    commentLength() {
      return this.commentText.length
    }
  }
}
</script>

<style lang="scss" scoped>
.post-detail {
  display: flex;
  flex-direction: column;
  // height: 100vh;
  background-color: var(--background-color-secondary);
  position: relative;
}

/* 表情选择器样式 */
.input-actions {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

/* 确保表情选择器在移动端正确显示 */
.emoji-picker-container {
  position: relative;
  z-index: 100;
}

.content-scroll {
  flex: 1;
  box-sizing: border-box;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}

.post-content {
  background-color: var(--card-background);
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.user-meta {
  display: flex;
  flex-direction: column;
}

.user-name-row {
  display: inline-flex;
  align-items: center;
}

.community-membership-badge {
  margin-left: 8rpx;
}

.user-name {
  font-size: 28rpx;
  font-weight: bold;
  color: var(--text-color-primary);
}

.user-badge-tap {
  display: inline-flex;
  align-items: center;
  margin-left: 10rpx;
}

.user-badge {
  transform: translateY(2rpx);
}

.title-chip {
  display: inline-flex;
  align-items: center;
  padding: 6rpx 14rpx;
  border-radius: 999rpx;
  line-height: 1.2;
  max-width: 220rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #fff4df;
  background: linear-gradient(120deg, rgba(160, 104, 54, 0.94) 0%, rgba(117, 69, 33, 0.94) 100%);
  box-shadow: 0 6rpx 14rpx rgba(117, 69, 33, 0.16);
}

.user-title-chip {
  margin-left: 8rpx;
  font-size: 20rpx;
}

.post-time {
  font-size: 24rpx;
  color: var(--text-color-regular);
  margin-top: 4rpx;
}

.post-circle {
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 4rpx 0 20rpx;
  margin-bottom: 20rpx;
  border-bottom: 1rpx solid var(--background-color-secondary);
}

.post-circle-icon {
  width: 56rpx;
  height: 56rpx;
  flex-shrink: 0;
  margin-right: 16rpx;
  border-radius: 50%;
  overflow: hidden;
}

.post-circle-icon-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background-color-secondary);
}

.post-circle-name {
  min-width: 0;
  overflow: hidden;
  color: var(--text-color-primary);
  font-size: 28rpx;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-body {
  margin-bottom: 20rpx;
}

.post-title {
  font-size: 32rpx;
  font-weight: bold;
  color: var(--text-color-primary);
  margin-bottom: 16rpx;
}

.post-text {
  font-size: 28rpx;
  color: var(--text-color-regular);
  line-height: 1.6;
  word-break: break-all;
  white-space: pre-wrap;
}

.bound-novel {
  margin-top: 20rpx;
  padding: 20rpx;
  background-color: var(--background-color-secondary);
  border-radius: 12rpx;
}

.novel-card {
  display: flex;
  align-items: center;
  // background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  // box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.novel-cover {
  width: 120rpx;
  height: 160rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.novel-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.novel-title {
  font-size: 30rpx;
  font-weight: bold;
  color: var(--text-color-primary);
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.novel-author {
  font-size: 24rpx;
  color: var(--text-color-regular);
  margin-bottom: 8rpx;
}

.novel-desc {
  font-size: 24rpx;
  color: var(--text-color-regular);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.post-images {
  margin-top: 20rpx;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  margin: -5rpx;
}

.post-image {
  margin: 5rpx;
  border-radius: 8rpx;
  background-color: var(--background-color-secondary);
}

.grid-1 .post-image {
  width: calc(100% - 10rpx);
  height: 400rpx;
}

.grid-2 .post-image, .grid-3 .post-image, .grid-multi .post-image {
  width: calc(33.33% - 10rpx);
  height: 200rpx;
}

.post-actions {
  display: flex;
  justify-content: space-around;
  padding-top: 20rpx;
  border-top: 1rpx solid var(--border-color);
}

.action-btn {
  display: flex;
  align-items: center;
  padding: 10rpx 30rpx;
}

.action-btn text {
  display: inline-flex;
  align-items: center;
  font-size: 28rpx;
  color: var(--text-color-regular);
  margin-left: 10rpx;
}

.action-btn .liked {
  color: #EA7034;
}

.action-btn-like.clickable {
  position: relative;
  overflow: visible;
}

.post-like-icon-wrap {
  position: relative;
  width: 44rpx;
  height: 44rpx;
  margin-right: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.heart-icon-shell {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center;
}

.action-btn-like.is-liked .heart-icon-shell {
  filter: drop-shadow(0 0 10rpx rgba(234, 112, 52, 0.18));
}

.action-btn-like.is-bursting .heart-icon-shell {
  animation: post-like-heart-pop 460ms steps(4, end);
}

.action-btn-like.is-bursting > text {
  animation: post-like-count-pop 420ms steps(4, end);
}

.pixel-heart-burst {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.pixel-heart {
  position: absolute;
  width: 4rpx;
  height: 4rpx;
  background: transparent;
  // 5x5 像素心：顶行两个凸起（0,1 和 3,4），旧版缺右上凸起导致心形残缺
  box-shadow:
    0 0 #ff7a59,
    4rpx 0 #ff7a59,
    12rpx 0 #ff7a59,
    16rpx 0 #ff7a59,
    0 4rpx #ff7a59,
    4rpx 4rpx #ff7a59,
    8rpx 4rpx #ff7a59,
    12rpx 4rpx #ff7a59,
    16rpx 4rpx #ff7a59,
    0 8rpx #ff7a59,
    4rpx 8rpx #ff7a59,
    8rpx 8rpx #ff7a59,
    12rpx 8rpx #ff7a59,
    16rpx 8rpx #ff7a59,
    4rpx 12rpx #ff7a59,
    8rpx 12rpx #ff7a59,
    12rpx 12rpx #ff7a59,
    8rpx 16rpx #ff7a59;
  opacity: 0;
  pointer-events: none;
  transform-origin: 10rpx 10rpx;
  filter: drop-shadow(0 4rpx 0 rgba(217, 87, 46, 0.26));
}

.pixel-heart-core {
  left: 12rpx;
  top: 12rpx;
  z-index: 1;
  animation: post-like-core-pop 540ms steps(4, end);
}

.pixel-heart-float {
  animation-name: post-like-pixel-float;
  animation-timing-function: steps(5, end);
  animation-fill-mode: forwards;
}

@keyframes post-like-heart-pop {
  0% {
    transform: scale(1);
  }
  35% {
    transform: scale(1.24);
  }
  65% {
    transform: scale(0.92);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes post-like-count-pop {
  0% {
    transform: translateY(0);
  }
  45% {
    transform: translateY(-4rpx);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes post-like-core-pop {
  0% {
    opacity: 0;
    transform: scale(0.55);
  }
  35% {
    opacity: 0.92;
    transform: translateY(-8rpx) scale(1.08);
  }
  100% {
    opacity: 0;
    transform: translateY(-24rpx) scale(1.42);
  }
}

@keyframes post-like-pixel-float {
  0% {
    opacity: 0;
    transform: scale(var(--heart-scale, 0.7));
  }
  25% {
    opacity: 1;
    transform: translate3d(0, -4rpx, 0) scale(calc(var(--heart-scale, 0.7) + 0.08));
  }
  100% {
    opacity: 0;
    transform: translate3d(var(--drift-x), var(--drift-y), 0) scale(calc(var(--heart-scale, 0.7) + 0.18));
  }
}

.comments-section {
  background-color: var(--card-background);
  padding: 20rpx;
  min-height: 200rpx;
  margin-bottom: calc(112rpx + var(--loghome-safe-bottom, 0px));
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: var(--text-color-primary);
  margin-bottom: 20rpx;
}

.no-comments {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60rpx 0;
  color: var(--text-color-regular);
  font-size: 28rpx;
}

.comment-item {
  margin-bottom: 30rpx;
}

.comment-main {
  display: flex;
  margin-bottom: 20rpx;
}

.comment-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
  overflow: hidden;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.comment-username-row {
  display: inline-flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.comment-username {
  font-size: 28rpx;
  font-weight: bold;
  color: var(--text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200rpx;
}

.comment-badge-tap {
  display: inline-flex;
  align-items: center;
  margin-left: 8rpx;
}

.comment-badge {
  transform: translateY(2rpx);
}

.comment-title-chip {
  margin-left: 8rpx;
  font-size: 19rpx;
}

.comment-time {
  font-size: 24rpx;
  color: var(--text-color-regular);
  margin-left: auto;
}

.comment-text {
  font-size: 28rpx;
  color: var(--text-color-regular);
  line-height: 1.6;
  word-break: break-all;
  white-space: pre-wrap;
}

.comment-images {
  display: flex;
  flex-wrap: wrap;
  margin: 10rpx -5rpx;
}

.comment-image {
  width: calc(33.33% - 10rpx);
  height: 180rpx;
  margin: 5rpx;
  border-radius: 8rpx;
}

.comment-actions {
  display: flex;
  align-items: center;
  margin-top: 16rpx;
}

.comment-like {
  display: flex;
  align-items: center;
  margin-right: 30rpx;
}

.comment-like text {
  font-size: 24rpx;
  color: var(--text-color-regular);
  margin-left: 6rpx;
}

.comment-like .liked {
  color: #EA7034;
}

.comment-reply {
  font-size: 24rpx;
  color: var(--text-color-regular);
}

.comment-delete {
  font-size: 24rpx;
  color: var(--text-color-regular);
  margin-left: 30rpx;
}

.replies-list {
  margin-left: 84rpx;
  padding: 20rpx;
  background-color: var(--background-color-secondary);
  border-radius: 12rpx;
}

.reply-item {
  display: flex;
  margin-bottom: 20rpx;
}

.reply-item:last-child {
  margin-bottom: 0;
}

.reply-avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.reply-content {
  flex: 1;
  overflow: hidden;
}

.reply-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 8rpx;
}

.reply-username-row {
  display: inline-flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.reply-username {
  font-size: 26rpx;
  font-weight: bold;
  color: var(--text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 150rpx;
}

.reply-badge-tap {
  display: inline-flex;
  align-items: center;
  margin-left: 8rpx;
}

.reply-badge {
  transform: translateY(2rpx);
}

.reply-title-chip {
  margin-left: 8rpx;
  font-size: 18rpx;
}

.reply-target {
  font-size: 26rpx;
  color: var(--text-color-regular);
  margin: 0 10rpx;
  max-width: 40%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reply-time {
  font-size: 22rpx;
  color: var(--text-color-regular);
  margin-left: auto;
}

.reply-text {
  font-size: 26rpx;
  color: var(--text-color-regular);
  line-height: 1.6;
  word-break: break-all;
  white-space: pre-wrap;
}

.reply-images {
  display: flex;
  flex-wrap: wrap;
  margin: 10rpx -5rpx;
}

.reply-image {
  width: calc(33.33% - 10rpx);
  height: 160rpx;
  margin: 5rpx;
  border-radius: 8rpx;
}

.reply-actions {
  display: flex;
  align-items: center;
  margin-top: 12rpx;
}

.reply-like {
  display: flex;
  align-items: center;
  margin-right: 30rpx;
}

.reply-like text {
  font-size: 22rpx;
  color: var(--text-color-regular);
  margin-left: 6rpx;
}

.reply-like .liked {
  color: #EA7034;
}

.reply-btn {
  font-size: 22rpx;
  color: var(--text-color-regular);
}

.reply-delete {
  font-size: 22rpx;
  color: var(--text-color-regular);
  margin-left: 30rpx;
}

.show-more {
  font-size: 26rpx;
  color: var(--text-color-regular);
  text-align: center;
  padding: 20rpx 0 0;
}

.comment-input {
  background-color: var(--card-background);
  border-top: 1rpx solid var(--border-color);
  padding: 20rpx 20rpx calc(20rpx + var(--loghome-safe-bottom, 0px));
  transition: all 0.3s;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
}

.textarea-wrapper {
  flex: 1;
  min-width: 0;
  height: 72rpx;
  position: relative;
  margin-right: 20rpx;
  transition: height 0.2s ease;
}

.textarea-wrapper.is-expanded {
  height: 200rpx;
}

.comment-textarea {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  font-size: 28rpx;
  line-height: 1.5;
  padding: 16rpx 20rpx;
  background-color: var(--background-color-secondary);
  border-radius: 24rpx;
  color: var(--text-color-primary);
  overflow-y: auto !important;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
}

.textarea-wrapper.is-expanded .comment-textarea {
  padding-bottom: 42rpx;
}

.comment-length {
  position: absolute;
  right: 18rpx;
  bottom: 10rpx;
  font-size: 20rpx;
  line-height: 1;
  color: var(--text-color-regular);
  opacity: 0.72;
  pointer-events: none;
}

.comment-length.is-near-limit {
  color: #EA7034;
  opacity: 1;
}

.input-actions {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.image-upload {
  padding: 10rpx;
  margin-right: 20rpx;
}

.send-btn {
  font-size: 28rpx;
  color: #fff;
  background-color: #EA7034;
  padding: 12rpx 30rpx;
  border-radius: 30rpx;
  margin: 0;
}

.send-btn[disabled] {
  background-color: #ffd0b9;
}

.selected-images {
  display: flex;
  flex-wrap: wrap;
  margin: 20rpx -10rpx 0;
}

.image-preview {
  position: relative;
  width: calc(25% - 20rpx);
  margin: 10rpx;
}

.image-preview::before {
  content: '';
  display: block;
  padding-top: 100%;
}

.image-preview image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}

.remove-image {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-image {
  width: calc(25% - 20rpx);
  margin: 10rpx;
  background-color: var(--background-color-secondary);
  border-radius: 8rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-image::before {
  content: '';
  display: block;
  padding-top: 100%;
}

.add-image uni-icons {
  position: absolute;
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30rpx 0;
  color: var(--text-color-regular);
  font-size: 26rpx;
}

.loading-spinner {
  width: 30rpx;
  height: 30rpx;
  margin-right: 12rpx;
  border: 3rpx solid #EA7034;
  border-radius: 50%;
  border-top-color: transparent;
  animation: loading-rotate 0.8s linear infinite;
}

@keyframes loading-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 图片长按菜单样式 */
.popup-content {
  background-color: var(--card-background);
  border-radius: 20rpx 20rpx 0 0;
  overflow: hidden;
}

.popup-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30rpx 0;
  font-size: 32rpx;
  color: var(--text-color-primary);
  border-bottom: 1rpx solid var(--border-color);
}

.popup-item uni-icons {
  margin-right: 10rpx;
}

.popup-item.cancel {
  color: var(--text-color-regular);
  margin-top: 20rpx;
  border-bottom: none;
}

.clickable {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    border-radius: inherit;
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
  }
  
  &:active::after {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  
  &:active {
    transform: scale(0.98);
  }
}

.user-info,
.post-circle {
  &.clickable:active {
    opacity: 0.7;
  }
}

.bound-novel {
  &.clickable:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
}

.action-btn {
  &.clickable:active {
    opacity: 0.6;
    transform: scale(0.95);
  }
}

.comment-like,
.comment-reply,
.comment-delete,
.reply-like,
.reply-btn,
.reply-delete {
  &.clickable:active {
    opacity: 0.6;
  }
}

.show-more {
  &.clickable:active {
    opacity: 0.6;
    transform: scale(0.98);
  }
}

.image-upload {
  &.clickable:active {
    opacity: 0.6;
    transform: scale(0.95);
  }
}

.send-btn {
  &.clickable:active {
    opacity: 0.8;
    transform: scale(0.98);
  }
  
  &.clickable:disabled:active {
    opacity: 1;
    transform: none;
  }
}
</style>
