<template>
  <view class="post-detail">
    <!-- 帖子内容 -->
    <scroll-view 
      scroll-y 
      class="content-scroll"
      :refresher-triggered="isRefreshing"
      @scrolltolower="loadMoreComments"
      :style="{ height: scrollHeight + 'px' }"
    >
      <!-- 主帖内容 -->
      <view class="post-content">
        <view class="post-header">
          <view class="user-info" @tap="navigateToUser(post.user_id)">
            <log-image class="user-avatar" :src="post.author_avatar" mode="aspectFill" onerror="onerror=null;src='../../static/user/defaultAvatar.jpg'"></log-image>
            <view class="user-meta">
              <text class="user-name">{{post.author_name}}</text>
              <text class="post-time">{{formatTime(post.create_time)}}</text>
            </view>
          </view>
          <view class="post-circle" @tap="navigateToCircle(post.circle_id)">
            {{post.circle_name}}
          </view>
        </view>
        
        <view class="post-body">
          <text class="post-title">{{post.title}}</text>
          <view class="post-text">
            {{post.content}}
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
              ></image>
            </view>
          </view>
        </view>
        
        <view class="post-actions">
          <view class="action-btn" @tap="likePost">
            <uni-icons :type="post.is_liked ? 'heart-filled' : 'heart'" size="24" :color="post.is_liked ? '#EA7034' : '#666'"></uni-icons>
            <text :class="{'liked': post.is_liked}">{{post.like_count}}</text>
          </view>
          <view class="action-btn" @tap="focusComment">
            <uni-icons type="chat" size="24" color="#666"></uni-icons>
            <text>{{post.comment_count}}</text>
          </view>
          <view class="action-btn" @tap="sharePost">
            <uni-icons type="redo" size="24" color="#666"></uni-icons>
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
              <log-image class="comment-avatar" :src="comment.user_avatar" mode="aspectFill" onerror="onerror=null;src='../../static/user/defaultAvatar.jpg'"></log-image>
              <view class="comment-content">
                <view class="comment-header">
                  <text class="comment-username">{{comment.user_name}}</text>
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
                  ></log-image>
                </view>
                <view class="comment-actions">
                  <view class="comment-like" @tap="likeComment(comment)">
                    <uni-icons :type="comment.is_liked ? 'heart-filled' : 'heart'" size="14" :color="comment.is_liked ? '#EA7034' : '#999'"></uni-icons>
                    <text :class="{'liked': comment.is_liked}">{{comment.like_count || 0}}</text>
                  </view>
                  <text class="comment-reply" @tap="replyToComment(comment)">回复</text>
                </view>
              </view>
            </view>
            
            <!-- 子评论 -->
            <view class="replies-list" v-if="comment.replies && comment.replies.length > 0">
              <view v-for="reply in comment.replies" :key="reply.comment_id" class="reply-item">
                <log-image class="reply-avatar" :src="reply.user_avatar" mode="aspectFill" onerror="onerror=null;src='../../static/user/defaultAvatar.jpg'"></log-image>
                <view class="reply-content">
                  <view class="reply-header">
                    <text class="reply-username">{{reply.user_name}}</text>
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
                    ></log-image>
                  </view>
                  <view class="reply-actions">
                    <view class="reply-like" @tap="likeComment(reply)">
                      <uni-icons :type="reply.is_liked ? 'heart-filled' : 'heart'" size="14" :color="reply.is_liked ? '#EA7034' : '#999'"></uni-icons>
                      <text :class="{'liked': reply.is_liked}">{{reply.like_count || 0}}</text>
                    </view>
                    <text class="reply-btn" @tap="replyToComment(reply, comment)">回复</text>
                  </view>
                </view>
              </view>
              <text class="show-more" v-if="comment.total_replies > comment.replies.length" @tap="loadMoreReplies(comment)">
                展开更多回复
              </text>
            </view>
          </view>
        </view>
        
        <view class="no-comments" v-if="comments.length === 0 && !isLoading">
          <text>暂无评论，快来发表第一条评论吧</text>
        </view>
        
        <!-- 加载更多 -->
        <uni-load-more :status="loadingStatus"></uni-load-more>
      </view>
    </scroll-view>
    
    <!-- 评论输入框 -->
    <view class="comment-input" :class="{'with-image': selectedImages.length > 0}" :style="{ bottom: keyboardHeight + 'px' }">
      <view class="input-wrapper">
        <textarea 
          v-model="commentText" 
          :placeholder="replyTo ? `回复 ${replyTo.user_name}` : '写下你的评论...'"
          auto-height
          :maxlength="1000"
          :focus="inputFocus"
          @focus="onInputFocus"
          @blur="onInputBlur"
          adjust-position="false"
        ></textarea>
        <view class="input-actions">
          <view class="image-upload" @tap="chooseImage">
            <uni-icons type="image" size="24" color="#666"></uni-icons>
          </view>
          <button class="send-btn" :disabled="!commentText && selectedImages.length === 0" @tap="submitComment">
            发送
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
          <uni-icons type="plusempty" size="32" color="#999"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
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
      scrollHeight: 0,
      keyboardHeight: 0,
      isLoading: true
    }
  },
  onLoad(params) {
    this.postId = params.id
    this.loadPostDetail()
    this.loadComments()
    this.calculateScrollHeight()
  },
  onReady() {
    this.calculateScrollHeight()
  },
  onShow() {
    this.calculateScrollHeight()
  },
  onPullDownRefresh() {
    Promise.all([
      this.loadPostDetail(),
      this.loadComments(true)
    ]).finally(() => {
      uni.stopPullDownRefresh();
    })
  },
  methods: {
    calculateScrollHeight() {
      const systemInfo = uni.getSystemInfoSync();
      const windowHeight = systemInfo.windowHeight;
      // 假设评论输入框高度为 60px (120rpx)，可以根据实际情况调整
      const inputHeight = 60;
      this.scrollHeight = windowHeight - inputHeight;
    },
    async loadPostDetail() {
      try {
        const res = await axios.get(this.$baseUrl + '/community/posts/detail/' + this.postId)
        this.post = res.data
        
        // 获取帖子的点赞状态
        await this.getLikeStatus()
      } catch (error) {
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
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
      } catch (error) {
        console.error('获取点赞状态失败:', error)
      }
    },
    
    async loadComments(refresh = false) {
      if (!refresh && (!this.hasMore || this.loadingStatus === 'loading')) return
      
      this.loadingStatus = 'loading'
      this.isLoading = true
      try {
        const res = await axios.get(this.$baseUrl + '/community/comments/list', {
          params: {
            post_id: this.postId,
            page: refresh ? 1 : this.page,
            pageSize: this.pageSize
          }
        })
        
        // 处理评论数据
        const comments = res.data.list || [];
        for (let comment of comments) {
          // 处理媒体URL
          if (comment.image_url) {
            comment.media_urls = [comment.image_url];
          } else {
            comment.media_urls = [];
          }
          
          // 初始化回复数组
          comment.replies = [];
          comment.total_replies = comment.reply_count || 0;
          
          // 获取评论的点赞状态
          await this.getCommentLikeStatus(comment);
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
        const res = await axios.get(this.$baseUrl + '/community/comments/replies', {
          params: {
            comment_id: comment.comment_id,
            page: Math.ceil(comment.replies.length / 10) + 1,
            pageSize: 10
          }
        })
        
        // 处理回复数据
        const replies = res.data.list || [];
        for (let reply of replies) {
          // 处理媒体URL
          if (reply.image_url) {
            reply.media_urls = [reply.image_url];
          } else {
            reply.media_urls = [];
          }
          
          // 获取回复的点赞状态
          await this.getCommentLikeStatus(reply);
        }
        
        comment.replies.push(...replies);
      } catch (error) {
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
        
        this.post.is_liked = !this.post.is_liked
        this.post.like_count += this.post.is_liked ? 1 : -1
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
      this.replyTo = comment
      this.parentComment = parent
      this.inputFocus = true
    },
    
    async submitComment() {
      if (!this.commentText && this.selectedImages.length === 0) return
      
      try {
        // 先上传图片
        let image_url = null;
        if (this.selectedImages.length > 0) {
          uni.showLoading({ title: '正在上传图片...' })
          const uploadRes = await this.uploadFile(this.selectedImages[0]);
          image_url = uploadRes.url;
        }
        
        // 发送评论
        const data = {
          post_id: this.postId,
          content: this.commentText,
          image_url: image_url
        }
        
        if (this.replyTo) {
          data.reply_to_user_id = this.replyTo.user_id;
          if (this.parentComment) {
            data.parent_id = this.parentComment.comment_id;
          }
        }
        
        // 获取token并添加到请求头
        const token = JSON.parse(window.localStorage.getItem('token')).tk
        
        await axios.post(this.$baseUrl + '/community/comments/create', data, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
        
        // 重置状态
        this.commentText = ''
        this.selectedImages = []
        this.replyTo = null
        this.parentComment = null
        this.inputFocus = false
        
        // 刷新评论列表
        this.loadComments(true)
        
        uni.showToast({
          title: '发送成功',
          icon: 'success'
        })
      } catch (error) {
        console.error('评论发送失败:', error);
        uni.showToast({
          title: '发送失败',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
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
    
    sharePost() {
      uni.setClipboardData({
        data: `来自原木社区的分享：${this.post.title}\n${this.post.content.substring(0, 50)}${this.post.content.length > 50 ? '...' : ''}\n点击链接查看详情：${window.location.origin}/#/pages/community/postDetail?id=${this.post.post_id}`,
        success: () => {
          uni.showToast({
            title: '分享链接已复制',
            icon: 'none'
          })
        }
      })
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
    
    navigateToCircle(circleId) {
      uni.navigateTo({
        url: '/pages/community/circle?id=' + circleId
      })
    },
    
    loadMoreComments() {
      this.loadComments()
    },
    
    focusComment() {
      this.inputFocus = true
    },
    
    onInputFocus(e) {
      // 监听键盘高度
      uni.onKeyboardHeightChange(res => {
        this.keyboardHeight = res.height;
        // 重新计算滚动区域高度
        this.calculateScrollHeight();
      });
    },
    
    onInputBlur() {
      setTimeout(() => {
        if (!this.commentText) {
          this.replyTo = null
          this.parentComment = null
        }
        // 键盘收起后重置高度
        this.keyboardHeight = 0;
        this.calculateScrollHeight();
      }, 100)
    }
  }
}
</script>

<style lang="scss" scoped>
.post-detail {
  display: flex;
  flex-direction: column;
  // height: 100vh;
  background-color: #f8f8f8;
  position: relative;
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
  background-color: #fff;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.post-header {
  display: flex;
  justify-content: space-between;
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

.user-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.post-time {
  font-size: 24rpx;
  color: #999;
  margin-top: 4rpx;
}

.post-circle {
  font-size: 24rpx;
  color: #666;
  background-color: #f5f5f5;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
}

.post-body {
  margin-bottom: 20rpx;
}

.post-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.post-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  word-break: break-all;
  white-space: pre-wrap;
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
  background-color: #f5f5f5;
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
  border-top: 1rpx solid #f0f0f0;
}

.action-btn {
  display: flex;
  align-items: center;
  padding: 10rpx 30rpx;
}

.action-btn text {
  font-size: 28rpx;
  color: #666;
  margin-left: 10rpx;
}

.action-btn .liked {
  color: #EA7034;
}

.comments-section {
  background-color: #fff;
  padding: 20rpx;
  min-height: 200rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.no-comments {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60rpx 0;
  color: #999;
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

.comment-username {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.comment-time {
  font-size: 24rpx;
  color: #999;
  margin-left: auto;
}

.comment-text {
  font-size: 28rpx;
  color: #666;
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
  color: #999;
  margin-left: 6rpx;
}

.comment-like .liked {
  color: #EA7034;
}

.comment-reply {
  font-size: 24rpx;
  color: #999;
}

.replies-list {
  margin-left: 84rpx;
  padding: 20rpx;
  background-color: #f8f8f8;
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

.reply-username {
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
  max-width: 40%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reply-target {
  font-size: 26rpx;
  color: #666;
  margin: 0 10rpx;
  max-width: 40%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reply-time {
  font-size: 22rpx;
  color: #999;
  margin-left: auto;
}

.reply-text {
  font-size: 26rpx;
  color: #666;
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
  color: #999;
  margin-left: 6rpx;
}

.reply-like .liked {
  color: #EA7034;
}

.reply-btn {
  font-size: 22rpx;
  color: #999;
}

.show-more {
  font-size: 26rpx;
  color: #666;
  text-align: center;
  padding: 20rpx 0 0;
}

.comment-input {
  background-color: #fff;
  border-top: 1rpx solid #f0f0f0;
  padding: 20rpx;
  transition: all 0.3s;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}

.comment-input.with-image {
  padding-bottom: env(safe-area-inset-bottom);
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
}

textarea {
  flex: 1;
  min-height: 72rpx;
  max-height: 200rpx;
  font-size: 28rpx;
  line-height: 1.5;
  padding: 16rpx 20rpx;
  background-color: #f5f5f5;
  border-radius: 36rpx;
  margin-right: 20rpx;
}

.input-actions {
  display: flex;
  align-items: center;
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
  background-color: #f5f5f5;
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
</style>