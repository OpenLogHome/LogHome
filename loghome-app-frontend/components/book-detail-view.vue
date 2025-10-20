<template>
  <div class="book-detail">
    <view class="bodyView" :class="{'drawer-mode': isDrawerMode}" style="text-align: center;" v-if="book" v-dark>
      <div class="book-header" v-if="isDrawerMode">
        <log-image class="book-cover" :src="book.picUrl" mode="aspectFill" 
          :onerror="`onerror=null;src='`+ $backupResources.bookCover +`'`"/>
        <view class="book-info">
          <view class="bookTitle">{{book.name}}</view>
          <view class="bookDescription">
            <el-tag size="mini" v-show="book.is_personal==1" type="info" disable-transitions effect="dark">私有</el-tag>
            <el-tag size="mini" v-show="book.is_personal==0" disable-transitions effect="dark">公开</el-tag>
            <span> {{book.is_complete==1?"已完结":"连载中"}}</span>
            <span>{{book.text_count}} 字 </span>
          </view>
          <div class="book-content" @click="showFullDescription">{{book.content}}</div>
        </view>
      </div>
      <view class="bookTitle" v-else>{{book.name}}</view>
      <view class="bookDescription" v-if="!isDrawerMode">
        <el-tag size="mini" v-show="book.is_personal==1" type="info" disable-transitions effect="dark">私有</el-tag>
        <el-tag size="mini" v-show="book.is_personal==0" disable-transitions effect="dark">公开</el-tag>
        <span> {{book.is_complete==1?"已完结":"连载中"}}</span>
        <span>总计 {{book.text_count}} 字 </span>
      </view>
      <div class="buttons">
        <div class="button" @click="$emit('goto-all-articles')">所有章节</div>
        <div class="button" @click="$emit('read-novel', book.is_personal)">阅读</div>
        <div class="button long" @click="$emit('goto-essay-set')">作品设置</div>
      </div>

      <!-- 添加Banner组件 -->
      <banner page="essays" style="margin-top: 30rpx; transform: scale(0.98);"/>

      <!-- 创作活动板块 -->
      <div class="statistic-box" v-if="activityInfo && activityInfo.hasActivity">
        <div class="head">
          <div class="box-title">创作活动</div>
          <div class="more">
            <p>参与创作活动，获得更多曝光</p>
          </div>
        </div>
        <div class="activity-content">
          <div v-for="activity in activityInfo.activities" :key="activity.tag_id" class="activity-item">
            <div class="activity-header">
              <div class="activity-name">{{activity.activity_name}}</div>
              <el-tag size="mini" type="success" effect="dark">活动中</el-tag>
            </div>
            <div class="activity-description">{{activity.activity_description}}</div>
            
            <!-- 活动资讯 -->
            <div class="activity-news" v-if="activity.activity_news && activity.activity_news.length > 0">
              <div class="news-title">活动资讯</div>
              <div class="news-list">
                <div v-for="news in activity.activity_news" :key="news.title" class="news-item" 
                  @click="openNewsLink(news)">
                  <div class="news-item-title">{{news.title}}</div>
                  <uni-icons type="right" size="14" color="#999"></uni-icons>
                </div>
              </div>
            </div>

            <!-- 信息填写入口 -->
            <div class="activity-form" v-if="activity.required_fields && activity.required_fields.length > 0">
              <div class="form-status">
                <div class="form-title">活动参与信息</div>
                <div class="form-status-text" :class="getFormStatusClass(activity.tag_id)">
                  {{getFormStatusText(activity.tag_id, activity.required_fields)}}
                </div>
              </div>
              <div class="form-button" @click="openActivityForm(activity)">
                {{hasFilledForm(activity.tag_id) ? '修改信息' : '填写信息'}}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="statistic-box">
        <div class="head">
          <div class="box-title">作品世界</div>
          <div class="more">
            <p>为你的作品关联世界设定</p>
          </div>
        </div>
        <div class="worlds">
          <div v-for="novel in worlds" :key="novel.novel_id" style="position:relative;">
            <navigator :url="'./readers/bookInfo?id=' +  novel.novel_id" open-type="navigate" class="books" 
              @longpress="$emit('delete-world-novel-asso', novel.world_id)" @click="$emit('goto-world-novel')">
              <log-image :src="novel.picUrl + '?thumbnail=1'" alt="" 
                :onerror="`onerror=null;src='`+ $backupResources.bookCover +`'`" 
                style="border-radius: 10rpx; transform:scale(.90)" />
              <div class="bookInfo" style="margin-left:10rpx;">
                <div class="world-title">
                  {{novel.name}}
                  <el-tag type="warning" v-show="novel.novel_type == 'world'" effect="dark" 
                    style="margin-left:10rpx; transform:translateY(-5rpx)" size="mini">世界设定</el-tag>
                </div>
                <view class="author">
                  <log-image :src="novel.avatar_url" alt="" class="auther_avatar" 
                    onerror="onerror=null;src='../static/user/defaultAvatar.jpg'" />
                  <div class="auther_name">{{novel.user_name}}</div>
                </view>
                <div class="description">{{novel.content}}</div>
              </div>
            </navigator>
          </div>
        </div>
        <div class="addButton" @click="$emit('show-book-select')">添加作品世界</div>
      </div>

      <writerHelper :novel_id="book.novel_id" @close-book-detail="$emit('close-book-detail')"></writerHelper>

      <div class="statistic-box">
        <div class="head">
          <div class="box-title">作品数据盒</div>
          <div class="more">
            <p>凌晨3点更新昨日数据</p>
          </div>
        </div>
        <div class="statistics-body no-statistic" v-if="statistics.length < 2">
          暂无数据
        </div>
        <div class="statistics-body" v-if="statistics.length >= 2">
          <div class="card" @click="$emit('goto-statistics')">
            <p class="numeral">
              {{statistics[0].clicks}}
              <span class="change">较昨日+{{statistics[0].clicks - statistics[1].clicks}}</span>
            </p>
            <p class="name">阅读量</p>
          </div>
          <div class="card" @click="$emit('goto-statistics')">
            <p class="numeral">
              {{statistics[0].nices}}
              <span class="change">较昨日+{{statistics[0].nices - statistics[1].nices}}</span>
            </p>
            <p class="name">点赞数</p>
          </div>
          <div class="card" @click="$emit('goto-statistics')">
            <p class="numeral">
              {{statistics[0].likes}}
              <span class="change">较昨日+{{statistics[0].likes - statistics[1].likes}}</span>
            </p>
            <p class="name">收藏数</p>
          </div>
          <div class="card" @click="$emit('goto-statistics')">
            <p class="numeral">
              {{statistics[0].comments}}
              <span class="change">较昨日+{{statistics[0].comments - statistics[1].comments}}</span>
            </p>
            <p class="name">评论数</p>
          </div>
          <div class="card" @click="$emit('goto-statistics')">
            <p class="numeral">
              {{statistics[0].tippings}}
              <span class="change">较昨日+{{statistics[0].tippings - statistics[1].tippings}}</span>
            </p>
            <p class="name">打赏值</p>
          </div>
        </div>
      </div>
      <div style="height: 200rpx; background-color: #fff;" :style="{backgroundColor: $store.state.isDarkMode ? '#252525' : '#fff'}">
      </div>
    </view>
  </div>
</template>

<script>
import writerHelper from "./writer_helper"
import banner from './banner.vue'
import axios from 'axios'
import darkModeMixin from '@/mixins/dark-mode.js'

export default {
  name: 'BookDetailView',
  components: {
    writerHelper,
    banner
  },
  mixins: [darkModeMixin],
  props: {
    book: {
      type: Object,
      required: true
    },
    worlds: {
      type: Array,
      default: () => []
    },
    statistics: {
      type: Array,
      default: () => []
    },
    isDrawerMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activityInfo: null
    }
  },
  methods: {
    showFullDescription() {
      uni.showModal({
        content: this.book.content,
        showCancel: false,
        confirmText: '关闭',
        confirmColor: "#EA7034"
      });
    },
    // 获取活动信息
    async fetchActivityInfo() {
      try {
        uni.showLoading({
          title: '加载中',
          mask: true
        });
        let tk = JSON.parse(window.localStorage.getItem('token'));
        if (tk) tk = tk.tk;
        
        const response = await axios.get(this.$baseUrl + '/essays/get_novel_activity', {
          params: {
            novel_id: this.book.novel_id
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tk
          }
        });
        uni.hideLoading();
        if (response.data && response.data.hasActivity) {
          this.activityInfo = response.data;
        } else {
          this.activityInfo = null;
        }
      } catch (error) {
        console.error('获取活动信息失败:', error);
        if (error.message == "Request failed with status code 401") {
          window.localStorage.removeItem('token');
          this.$isFromLogin = true;
          uni.navigateTo({
            url: './users/login?msg=' + 'unAuthorized'
          });
        }
      }
    },
    // 打开资讯链接
    openNewsLink(news) {
      if (news.mobile_link) {
        this.$emit('close-book-detail');
        uni.navigateTo({
          url: news.mobile_link
        });
      }
    },
    // 打开活动表单
    async openActivityForm(activity) {
      await this.fetchActivityInfo();
      this.$emit('open-activity-form', activity, this.activityInfo);
    },
    // 检查是否已填写表单
    hasFilledForm(tagId) {
      if (!this.activityInfo || !this.activityInfo.userInfo) return false;
      return this.activityInfo.userInfo.some(info => info.tag_id === tagId);
    },
    // 获取表单状态文本
    getFormStatusText(tagId, requiredFields) {
      if (!this.hasFilledForm(tagId)) {
        const requiredCount = requiredFields.filter(field => field.required).length;
        return requiredCount > 0 ? `有${requiredCount}项必填信息未填写` : '信息未填写';
      }
      
      const userInfo = this.activityInfo.userInfo.find(info => info.tag_id === tagId);
      if (!userInfo) return '信息未填写';
      
      // 从 information_data 字段解析实际的表单数据
      let formData = {};
      try {
        formData = userInfo.information_data ? JSON.parse(userInfo.information_data) : {};
      } catch (e) {
        console.error('解析表单数据失败:', e);
        formData = {};
      }
      
      const missingRequired = requiredFields.filter(field => 
        field.required && (!formData[field.name] || formData[field.name].toString().trim() === '')
      );
      
      return missingRequired.length > 0 
        ? `还有${missingRequired.length}项必填信息未完善` 
        : '信息已完善';
    },
    // 获取表单状态样式类
    getFormStatusClass(tagId) {
      if (!this.hasFilledForm(tagId)) return 'status-incomplete';
      
      const userInfo = this.activityInfo.userInfo.find(info => info.tag_id === tagId);
      if (!userInfo) return 'status-incomplete';
      
      const activity = this.activityInfo.activities.find(act => act.tag_id === tagId);
      if (!activity) return 'status-incomplete';
      
      // 从 information_data 字段解析实际的表单数据
      let formData = {};
      try {
        formData = userInfo.information_data ? JSON.parse(userInfo.information_data) : {};
      } catch (e) {
        console.error('解析表单数据失败:', e);
        formData = {};
      }
      
      const missingRequired = activity.required_fields.filter(field => 
        field.required && (!formData[field.name] || formData[field.name].toString().trim() === '')
      );
      
      return missingRequired.length > 0 ? 'status-incomplete' : 'status-complete';
    }
  },
  onShow() {
  },
  watch: {
    book: {
      handler(newBook) {
        if (newBook && newBook.novel_id) {
          this.fetchActivityInfo();
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../lib/global.scss";

.book-detail {
  .bodyView {
    background-color: white !important;
    
    &.dark-mode {
      background-color: var(--background-color-secondary) !important;
    }
    &.drawer-mode {
      .book-header {
        display: flex;
        padding: 32rpx 48rpx;
        padding-bottom: 15rpx;
        text-align: left;
        margin-bottom: 0rpx;
        background: linear-gradient(to bottom, rgb(255, 248, 234) 0%, rgb(255, 248, 234) 30%, rgb(255, 255, 255) 100%);
        
        .dark-mode & {
          background: linear-gradient(to bottom, rgba(60, 55, 40, 0.8) 0%, rgba(60, 55, 40, 0.8) 30%, var(--background-color-secondary) 100%);
        }
        // background-color: rgb(255, 248, 234);
        
        .book-cover {
          width: 230rpx;
          height: 320rpx;
          border-radius: 10rpx;
          margin-right: 30rpx;
          flex-shrink: 0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          
          .dark-mode & {
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
        }
        
        .book-info {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          flex: 1;
          
          .bookTitle {
            font-size: 42rpx;
            font-weight: bold;
            margin-bottom: 20rpx;
            text-align: left;
            color: rgb(45, 45, 45);
            
            .dark-mode & {
              color: var(--text-color-primary);
            }
          }
          
          .bookDescription {
            text-align: left;
            font-size: 28rpx;
            color: #95A1A6;
            padding: 0;
            
            span {
              margin: 0 10rpx;
            }
            
            .dark-mode & {
              color: var(--text-color-secondary);
            }
          }

          .book-content {
            margin-top: 20rpx;
            font-size: 28rpx;
            color: #777777;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
            
            .dark-mode & {
              color: var(--text-color-regular);
            }
          }
        }
      }

      .buttons {
        margin-top: 20rpx;
      }
    }

    .bookTitle {
      font-size: 50rpx;
      font-weight: bold;
      
      .dark-mode & {
        color: var(--text-color-primary);
      }
    }

    .bookDescription {
      font-size: 28rpx;
      padding-left: 50rpx;
      padding-right: 50rpx;
      padding-top: 20rpx;
      text-align: left;
      white-space: pre-wrap;
      text-align: center;

      span {
        margin: 0 10rpx;
      }
      
      .dark-mode & {
        color: var(--text-color-secondary);
      }
    }

    .buttons {
      width: 100vw;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      .button {
        height: 40px;
        width: 40vw;
        margin-top: 15px;
        margin-left: 10px;
        margin-right: 10px;
        font-size: 16px;
        font-weight: bold;
        line-height: 38px;
        border-radius: 5px;
        color: #ffffff;
        background-color: rgb(180, 111, 88);

        &:active {
          background-color: #b46f58;
        }
        
        .dark-mode & {
          background-color: rgb(150, 91, 68);
          
          &:active {
            background-color: #9c5e48;
          }
        }
      }

      .button.long {
        width: calc(80vw + 20px);
      }
    }

    .statistic-box {
      margin: 0rpx 0rpx;
      box-sizing: border-box;
      background-color: white;
      
      .dark-mode & {
        background-color: var(--card-background);
      }

      .head {
        margin: 0rpx 50rpx;
        padding: 35rpx 0;
        height: 30rpx;

        div.box-title {
          float: left;
          font-size: 34rpx;
          font-weight: bold;
          color: #2d2d2d;
          height: 30rpx;
          
          .dark-mode & {
            color: var(--text-color-primary);
          }
        }

        div.more {
          float: right;
          display: flex;
          margin-top: 5rpx;

          p {
            margin: 0rpx;
            color: #2d2d2d;
            font-size: 26rpx;
            line-height: 44rpx;
            height: 44rpx;
            
            .dark-mode & {
              color: var(--text-color-regular);
            }
          }

          .moreImg {
            height: 30rpx;
            width: 30rpx;
            margin-right: 8rpx;
          }
        }
      }

      .statistics-body {
        display: flex;
        margin: 0 40rpx;
        flex-wrap: wrap;

        .card {
          margin: 10rpx 10rpx;
          padding: 25rpx;
          width: calc(50vw - 40rpx - 20rpx - 50rpx);
          background-color: #00000009;
          text-align: left;
          
          .dark-mode & {
            background-color: var(--background-color-tertiary);
          }

          .numeral {
            font-size: 40rpx;
            margin-bottom: 10rpx;
            
            .dark-mode & {
              color: var(--text-color-primary);
            }

            span.change {
              font-size: 28rpx;
              color: #FF9B17;
              margin-left: 10rpx;
            }
          }

          .name {
            font-size: 28rpx;
            font-weight: bold;
            color: #2d2d2d;
            
            .dark-mode & {
              color: var(--text-color-primary);
            }
          }
        }
      }

      .statistics-body.no-statistic {
        justify-content: center;
      }

      .addButton {
        width: calc(100vw - 90rpx);
        border: 4rpx solid #4c4c4c55;
        border-radius: 10rpx;
        height: 150rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #4c4c4cee;
        transition: all .3s;
        border-style: dashed;
        font-size: 30rpx;
        margin: 15rpx 40rpx 0 40rpx;
        
        .dark-mode & {
          color: var(--text-color-regular);
          border-color: var(--border-color-lighter);
        }

        &:active {
          transform: scale(0.95);
          background-color: #4c4c4c22;
          
          .dark-mode & {
            background-color: #6c6c6c22;
          }
        }
      }
    }

    // 创作活动板块样式
    .activity-content {
      margin: 0 40rpx;
      
      .activity-item {
        margin-bottom: 30rpx;
        padding: 30rpx;
        background-color: #f8f9fa;
        border-radius: 15rpx;
        
        .dark-mode & {
          background-color: var(--background-color-tertiary);
        }
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15rpx;
          
          .activity-name {
            font-size: 32rpx;
            font-weight: bold;
            color: #2d2d2d;
            
            .dark-mode & {
              color: var(--text-color-primary);
            }
          }
        }
        
        .activity-description {
          font-size: 28rpx;
          color: #666;
          margin-bottom: 25rpx;
          line-height: 1.5;
          text-align: left;
          
          .dark-mode & {
            color: var(--text-color-regular);
          }
        }
        
        .activity-news {
          margin-bottom: 25rpx;
          text-align: left;
          
          .news-title {
            font-size: 28rpx;
            font-weight: bold;
            color: #2d2d2d;
            margin-bottom: 15rpx;
            
            .dark-mode & {
              color: var(--text-color-primary);
            }
          }
          
          .news-list {
            .news-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 20rpx 25rpx;
              background-color: white;
              border-radius: 10rpx;
              margin-bottom: 10rpx;
              transition: all 0.3s;
              
              .dark-mode & {
                background-color: var(--background-color-base);
              }
              
              &:active {
                transform: scale(0.98);
                background-color: #f0f0f0;
                
                .dark-mode & {
                  background-color: var(--background-color-secondary);
                }
              }
              
              .news-item-title {
                font-size: 26rpx;
                color: #333;
                flex: 1;
                
                .dark-mode & {
                  color: var(--text-color-primary);
                }
              }
              
              .news-arrow {
                font-size: 24rpx;
                color: #999;
                margin-left: 15rpx;
                
                .dark-mode & {
                  color: var(--text-color-secondary);
                }
              }
            }
          }
        }
        
        .activity-form {
          .form-status {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20rpx;
            
            .form-title {
              font-size: 28rpx;
              font-weight: bold;
              color: #2d2d2d;
              
              .dark-mode & {
                color: var(--text-color-primary);
              }
            }
            
            .form-status-text {
              font-size: 24rpx;
              
              &.status-incomplete {
                color: #ff6b6b;
              }
              
              &.status-complete {
                color: #51cf66;
              }
            }
          }
          
          .form-button {
            width: 100%;
            height: 80rpx;
            background-color: rgb(180, 111, 88);
            color: white;
            border-radius: 10rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28rpx;
            font-weight: bold;
            transition: all 0.3s;
            
            .dark-mode & {
              background-color: rgb(150, 91, 68);
            }
            
            &:active {
              transform: scale(0.98);
              background-color: #b46f58;
              
              .dark-mode & {
                background-color: #9c5e48;
              }
            }
          }
        }
      }
    }

    .worlds {
      .books {
        height: 260rpx;
        width: calc(100vw - 65rpx);
        margin: 0 30rpx;
        display: flex;
        background-color: rgb(255, 255, 255);
        border-radius: 10rpx;
        
        .dark-mode & {
          background-color: var(--background-color-tertiary);
        }

        img {
          height: 260rpx;
          width: 200rpx;
          border-radius: 10rpx 0 0 10rpx;
          margin: 0rpx;
          flex-shrink: 0;
        }

        .bookInfo {
          margin-left: 30rpx;
          margin-top: 22rpx;

          .world-title {
            font-size: 34rpx;
            height: 42rpx;
            margin-bottom: 10rpx;
            overflow: hidden;
            display: -webkit-box;
            font-weight: bold;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            color: rgb(45, 45, 45);
            margin: 5rpx;
            text-align: left;
            
            .dark-mode & {
              color: var(--text-color-primary);
            }
          }

          .author {
            position: relative;
            margin-top: 15rpx;
            margin-bottom: 10rpx;
            display: flex;
            text-align: left;

            .auther_avatar {
              position: absolute;
              top: 0rpx;
              left: 5rpx;
              height: 35rpx;
              width: 35rpx;
              border-radius: 5rpx;
            }

            .auther_name {
              font-size: 25rpx;
              color: rgb(45, 45, 45);
              overflow: hidden;
              margin-left: 45rpx;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              
              .dark-mode & {
                color: var(--text-color-regular);
              }
            }
          }

          .description {
            font-size: 25rpx;
            color: rgb(142, 130, 109);
            margin: 5rpx 0;
            overflow: hidden;
            display: -webkit-box;
            text-align: left;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            
            .dark-mode & {
              color: var(--text-color-regular);
            }
          }
          
          .tags {
            display: flex;
            flex-wrap: wrap;

            .tag {
              font-size: 20rpx;
              color: #4c4c4c;
              background-color: #f5f5f5;
              padding: 2rpx 10rpx;
              border-radius: 10rpx;
              margin-right: 10rpx;
              margin-bottom: 10rpx;
              
              .dark-mode & {
                color: var(--text-color-regular);
                background-color: var(--background-color-base);
              }
            }
          }
        }
      }
    }
  }
}
</style>