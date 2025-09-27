<template>
  <view class="post-detail" @scroll="onPageScroll">
    <!-- 帖子内容 -->
    <scroll-view 
      scroll-y 
      class="content-scroll"
      :refresher-triggered="isRefreshing"
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
          
          <!-- 显示绑定的作品 -->
          <view class="bound-novel" v-if="post.novel_info" @tap="navigateToNovel(post.novel_info.novel_id)">
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
                    @longpress="showImageOptions(img)"
                  ></log-image>
                </view>
                <view class="comment-actions">
                  <view class="comment-like" @tap="likeComment(comment)">
                    <uni-icons :type="comment.is_liked ? 'heart-filled' : 'heart'" size="14" :color="comment.is_liked ? '#EA7034' : '#999'"></uni-icons>
                    <text :class="{'liked': comment.is_liked}">{{comment.like_count || 0}}</text>
                  </view>
                  <text class="comment-reply" @tap="replyToComment(comment)">回复</text>
                  <text v-if="canDeleteComment(comment)" class="comment-delete" @tap="deleteComment(comment)">删除</text>
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
                      @longpress="showImageOptions(img)"
                    ></log-image>
                  </view>
                  <view class="reply-actions">
                    <view class="reply-like" @tap="likeComment(reply)">
                      <uni-icons :type="reply.is_liked ? 'heart-filled' : 'heart'" size="14" :color="reply.is_liked ? '#EA7034' : '#999'"></uni-icons>
                      <text :class="{'liked': reply.is_liked}">{{reply.like_count || 0}}</text>
                    </view>
                    <text class="reply-btn" @tap="replyToComment(reply, comment)">回复</text>
                    <text v-if="canDeleteComment(reply)" class="reply-delete" @tap="deleteComment(reply, comment)">删除</text>
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
        <textarea 
          v-model="commentText" 
          :placeholder="replyTo ? `回复 ${replyTo.user_name}` : '写下你的评论...'" 
          auto-height
          :maxlength="1000"
          :focus="inputFocus"
          @blur="onInputBlur"
          adjust-position="false"
        ></textarea>
        <view class="input-actions">
          <emoji-picker @select="onEmojiSelect"></emoji-picker>
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
  </view>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import emojiPicker from '../../components/emoji-picker/emoji-picker.vue'

export default {
  components: {
    emojiPicker
  },
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
      isLoading: true,
      userRole: -1, // -1: 未知, 0: 普通成员, 1: 管理员, 2: 圈主
      currentImageUrl: '', // 当前长按选中的图片URL
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
                // 更多逻辑
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
    async loadPostDetail() {
      try {
        const res = await axios.get(this.$baseUrl + '/community/posts/detail/' + this.postId)
        this.post = res.data
        
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
          // 自动加载前3条子评论
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
        const res = await axios.get(this.$baseUrl + '/community/comments/replies', {
          params: {
            comment_id: comment.comment_id,
            page,
            pageSize
          }
        });
        const replies = res.data.list || [];
        for (let reply of replies) {
          if (reply.image_url) {
            reply.media_urls = [reply.image_url];
          } else {
            reply.media_urls = [];
          }
          await this.getCommentLikeStatus(reply);
        }
        comment.replies = replies;
        // 同步 total_replies
        comment.total_replies = res.data.total || replies.length;
      } catch (error) {
        // 可选：错误提示
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
        const nextPage = Math.floor(comment.replies.length / 10) + 1;
        const res = await axios.get(this.$baseUrl + '/community/comments/replies', {
          params: {
            comment_id: comment.comment_id,
            page: nextPage,
            pageSize: 10
          }
        })
        // 处理回复数据
        const replies = res.data.list || [];
        for (let reply of replies) {
          if (reply.image_url) {
            reply.media_urls = [reply.image_url];
          } else {
            reply.media_urls = [];
          }
          await this.getCommentLikeStatus(reply);
        }
        // 去重追加
        const existingIds = new Set(comment.replies.map(r => r.comment_id));
        const newReplies = replies.filter(r => !existingIds.has(r.comment_id));
        comment.replies.push(...newReplies);
        // 同步 total_replies
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
      if (!this.commentText && this.selectedImages.length === 0) return
      try {
        // 使用评论文本，不需要处理表情包标记
        let processedText = this.commentText;
        
        // 处理图片上传
        let image_url = null;
        if (this.selectedImages.length > 0) {
          uni.showLoading({ title: '正在上传图片...' })
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
      return `来自原木社区的分享：${this.post.title}\n${this.post.content.substring(0, 50)}${this.post.content.length > 50 ? '...' : ''}\n点击链接查看详情：https://loghome.ink/#/pages/community/postDetail?id=${this.post.post_id}`;
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
    
    // 处理表情选择
    onEmojiSelect(data) {
      if (data.type === 'emoji') {
        // 直接插入Emoji表情
        this.commentText += data.content;
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

.bound-novel {
  margin-top: 20rpx;
  padding: 20rpx;
  background-color: #f8f8f8;
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
  color: #333;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.novel-author {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.novel-desc {
  font-size: 24rpx;
  color: #999;
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
  margin-bottom: 112rpx;
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

.comment-delete {
  font-size: 24rpx;
  color: #999;
  margin-left: 30rpx;
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

.reply-delete {
  font-size: 22rpx;
  color: #999;
  margin-left: 30rpx;
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

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30rpx 0;
  color: #999;
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
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  overflow: hidden;
}

.popup-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30rpx 0;
  font-size: 32rpx;
  color: #333;
  border-bottom: 1rpx solid #f0f0f0;
}

.popup-item uni-icons {
  margin-right: 10rpx;
}

.popup-item.cancel {
  color: #999;
  margin-top: 20rpx;
  border-bottom: none;
}
</style>