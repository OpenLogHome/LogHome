<template>
  <div class="book-detail">
    <view class="bodyView" :class="{'drawer-mode': isDrawerMode}" v-if="book" v-dark>
      <div class="book-header" v-if="isDrawerMode">
        <log-image class="book-cover" :src="book.picUrl" mode="aspectFill" 
          :onerror="`onerror=null;src='`+ $backupResources.bookCover +`'`"/>
        <view class="book-info">
          <view class="bookTitle">{{book.name}}</view>
          <view class="bookDescription">
            <el-tag size="mini" v-show="book.is_personal==1" type="info" disable-transitions effect="dark">私有</el-tag>
            <el-tag size="mini" v-show="book.is_personal==0" disable-transitions effect="dark">公开</el-tag>
            <el-tag size="mini" v-if="showCollaborativeTag" type="warning" disable-transitions effect="dark">协作作品</el-tag>
            <span> {{book.is_complete==1?"已完结":"连载中"}}</span>
            <span>{{book.text_count}} 字</span>
          </view>
          <div class="book-intro">
            <div class="book-content" :class="{ expanded: isDescriptionExpanded, empty: !hasDescription }">
              {{ introText }}
            </div>
            <div class="book-content-toggle" v-if="shouldShowIntroToggle" @click="toggleDescription">
              {{ isDescriptionExpanded ? '收起简介' : '展开简介' }}
            </div>
          </div>
        </view>
      </div>
      <view class="bookTitle" v-else>{{book.name}}</view>
      <view class="bookDescription" v-if="!isDrawerMode">
        <el-tag size="mini" v-show="book.is_personal==1" type="info" disable-transitions effect="dark">私有</el-tag>
        <el-tag size="mini" v-show="book.is_personal==0" disable-transitions effect="dark">公开</el-tag>
        <el-tag size="mini" v-if="showCollaborativeTag" type="warning" disable-transitions effect="dark">协作作品</el-tag>
        <span> {{book.is_complete==1?"已完结":"连载中"}}</span>
        <span>总计 {{book.text_count}} 字</span>
      </view>
      <div class="book-intro" v-if="!isDrawerMode">
        <div class="book-content" :class="{ expanded: isDescriptionExpanded, empty: !hasDescription }">
          {{ introText }}
        </div>
        <div class="book-content-toggle" v-if="shouldShowIntroToggle" @click="toggleDescription">
          {{ isDescriptionExpanded ? '收起简介' : '展开简介' }}
        </div>
      </div>
      <div class="buttons">
        <div class="button" @click="$emit('goto-all-articles')">所有章节</div>
        <div class="button" @click="$emit('read-novel', book.is_personal)">阅读</div>
        <div class="button long" @click="$emit('goto-essay-set')">{{ isOwner ? '作品设置' : '协作设置' }}</div>
      </div>

      <div class="ban-alert" v-if="Number(book.is_banned) >= 1">
        <div class="ban-title">{{ Number(book.is_banned) === 2 ? '重新审核中' : '作品异常' }}</div>
        <div class="ban-reason" v-if="book.ban_reason || book.ban_review_comment">
          异常原因：{{ book.ban_reason || '违反社区规则' }}{{ book.ban_review_comment ? '（' + book.ban_review_comment + '）' : '' }}
        </div>
        <div class="ban-reason" v-else>该作品因违反社区规则已被下架，读者端暂不可见。</div>
        <div class="ban-tip" v-if="Number(book.is_banned) === 2">管理员正在重新审核，请耐心等待。</div>
        <div class="ban-action" v-if="Number(book.is_banned) === 1" @click="$emit('resubmit-novel')">重新提交审核</div>
      </div>

      <!-- 添加Banner组件 -->
      <banner page="essays" class="section-banner"/>

      <writing-activity-calendar
        v-if="canViewWritingCalendar"
        :calendar-data="writingCalendar"
        :loading="writingCalendarLoading"
      />

      <!-- 创作活动板块 -->
      <div class="statistic-box" v-if="isOwner && activityInfo && activityInfo.hasActivity">
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
          <div class="empty-state" v-if="worlds.length === 0">
            <div class="empty-title">还没有关联作品世界</div>
            <div class="empty-subtitle">点击下方“添加作品世界”，为当前作品关联世界设定</div>
          </div>
          <div v-for="novel in worlds" :key="novel.novel_id" class="world-item">
            <navigator :url="'./readers/bookInfo?id=' +  novel.novel_id" open-type="navigate" class="books" 
              @longpress="isOwner ? $emit('delete-world-novel-asso', novel.world_id) : null" @click="$emit('goto-world-novel')">
              <log-image :src="novel.picUrl + '?thumbnail=1'" alt="" 
                :onerror="`onerror=null;src='`+ $backupResources.bookCover +`'`" 
                class="world-book-cover" />
              <div class="bookInfo world-book-info">
                <div class="world-title">
                  {{novel.name}}
                  <el-tag type="warning" v-show="novel.novel_type == 'world'" effect="dark" 
                    class="world-tag" size="mini">世界设定</el-tag>
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
        <div class="addButton" v-if="isOwner" @click="$emit('show-book-select')">添加作品世界</div>
      </div>

      <!-- <writerHelper :novel_id="book.novel_id" @close-book-detail="$emit('close-book-detail')"></writerHelper> -->

      <div class="statistic-box">
        <div class="head">
          <div class="box-title">作品数据盒</div>
          <div class="more">
            <p>凌晨3点更新昨日数据</p>
          </div>
        </div>
        <div class="statistics-body no-statistic" v-if="statistics.length < 2">
          <div class="empty-state">
            <div class="empty-title">暂无数据</div>
            <div class="empty-subtitle">继续更新内容，次日凌晨 3:00 后可查看</div>
          </div>
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
              {{statistics[0].shares || 0}}
              <span class="change">较昨日+{{(statistics[0].shares || 0) - (statistics[1].shares || 0)}}</span>
            </p>
            <p class="name">分享数</p>
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
      <div class="bottom-spacer">
      </div>
    </view>
  </div>
</template>

<script>
import writerHelper from "./writer_helper"
import banner from './banner.vue'
import WritingActivityCalendar from './writing-activity-calendar.vue'
import axios from 'axios'
import darkModeMixin from '@/mixins/dark-mode.js'
import { openActivityNewsLink } from '@/common/activity-news-navigation.js'

export default {
  name: 'BookDetailView',
  components: {
    writerHelper,
    banner,
    WritingActivityCalendar
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
    },
    writingCalendar: {
      type: Object,
      default: null
    },
    writingCalendarLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activityInfo: null,
      isDescriptionExpanded: false
    }
  },
  computed: {
    isOwner() {
      return !!(this.book && (this.book.is_owner === true || this.book.access_role === 'owner' || !this.book.access_role));
    },
    showCollaborativeTag() {
      if (!this.book) return false;
      return (
        this.book.access_role === 'collaborator' ||
        this.book.is_collaborator === true ||
        Number(this.book.has_active_collaborators || 0) === 1
      );
    },
    canViewWritingCalendar() {
      if (!this.book) return false;
      const access = this.book.current_access || this.book;
      return this.isOwner || access.can_edit_draft === true || Number(access.can_edit_draft || 0) === 1;
    },
    hasDescription() {
      return !!(this.book && this.book.content && this.book.content.toString().trim());
    },
    introText() {
      if (this.hasDescription) return this.book.content;
      return '暂无作品简介，可在作品设置中补充。';
    },
    shouldShowIntroToggle() {
      return this.hasDescription && this.book.content.toString().trim().length > 40;
    }
  },
  methods: {
    toggleDescription() {
      this.isDescriptionExpanded = !this.isDescriptionExpanded;
    },
    // 获取活动信息
    async fetchActivityInfo() {
      if (!this.isOwner) {
        this.activityInfo = null;
        return;
      }
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
      openActivityNewsLink(news, () => this.$emit('close-book-detail'));
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
        this.isDescriptionExpanded = false;
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
    --page-x: 40rpx;
    --section-gap: 28rpx;
    --card-gap: 18rpx;
    --card-radius: 16rpx;
    --surface-base: #ffffff;
    --surface-muted: #f8f9fa;
    --surface-subtle: #00000009;
    --text-primary: #2d2d2d;
    --text-secondary: #666666;
    --text-tertiary: #95a1a6;
    --accent: rgb(180, 111, 88);
    --accent-press: #b46f58;
    --header-gradient: linear-gradient(to bottom, rgb(255, 248, 234) 0%, rgb(255, 248, 234) 35%, #ffffff 100%);
    background-color: var(--surface-base) !important;
    text-align: left;
    box-sizing: border-box;
    
    &.dark-mode {
      --surface-base: var(--background-color-secondary);
      --surface-muted: rgba(255, 255, 255, 0.06);
      --surface-subtle: rgba(255, 255, 255, 0.08);
      --text-primary: var(--text-color-primary);
      --text-secondary: rgba(255, 255, 255, 0.86);
      --text-tertiary: rgba(255, 255, 255, 0.72);
      --accent: rgb(150, 91, 68);
      --accent-press: #9c5e48;
      --header-gradient: linear-gradient(to bottom, rgba(60, 55, 40, 0.8) 0%, rgba(60, 55, 40, 0.8) 35%, var(--background-color-secondary) 100%);
      background-color: var(--surface-base) !important;
    }
    &.drawer-mode {
      .book-header {
        display: flex;
        gap: 24rpx;
        padding: 32rpx var(--page-x) 20rpx;
        text-align: left;
        margin-bottom: 0;
        background: var(--header-gradient);
        
        .book-cover {
          width: 230rpx;
          height: 320rpx;
          border-radius: 12rpx;
          flex-shrink: 0;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
        }
        
        .book-info {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          flex: 1;
          
          .bookTitle {
            padding: 0;
            font-size: 42rpx;
            font-weight: bold;
            margin-bottom: 16rpx;
            text-align: left;
            color: var(--text-primary);
          }
          
          .bookDescription {
            text-align: left;
            font-size: 28rpx;
            color: var(--text-tertiary);
            margin-top: 0;
            padding: 0;
            
            span {
              margin-right: 12rpx;
            }
          }

          .book-intro {
            margin-top: 18rpx;
            padding: 0;
          }
        }
      }

      .buttons {
        margin-top: 10rpx;
      }
    }

    .bookTitle {
      padding: 0 var(--page-x);
      font-size: 48rpx;
      font-weight: bold;
      line-height: 1.28;
      color: var(--text-primary);
      text-align: left;
    }

    .bookDescription {
      font-size: 28rpx;
      margin-top: 14rpx;
      padding: 0 var(--page-x);
      line-height: 1.5;
      text-align: left;
      white-space: pre-wrap;
      color: var(--text-tertiary);

      span {
        margin-right: 12rpx;
      }
    }

    .book-intro {
      margin-top: 18rpx;
      padding: 0 var(--page-x);

      .book-content {
        font-size: 28rpx;
        line-height: 1.6;
        color: var(--text-secondary);
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;

        &.expanded {
          display: block;
          -webkit-line-clamp: unset;
          overflow: visible;
        }

        &.empty {
          color: var(--text-tertiary);
        }
      }

      .book-content-toggle {
        margin-top: 12rpx;
        width: fit-content;
        font-size: 24rpx;
        font-weight: 600;
        color: var(--accent);

        &:active {
          opacity: 0.75;
        }
      }
    }

    .buttons {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16rpx;
      padding: 22rpx var(--page-x) 0;

      .button {
        min-height: 84rpx;
        width: 100%;
        font-size: 30rpx;
        font-weight: bold;
        line-height: 84rpx;
        border-radius: 12rpx;
        text-align: center;
        color: #ffffff;
        background-color: var(--accent);
        transition: transform 0.2s, background-color 0.2s;

        &:active {
          transform: scale(0.98);
          background-color: var(--accent-press);
        }
      }

      .button.long {
        grid-column: 1 / -1;
      }
    }

    .ban-alert {
      margin: 24rpx var(--page-x) 0;
      padding: 24rpx;
      border: 1rpx solid rgba(244, 67, 54, 0.35);
      border-radius: 12rpx;
      background-color: rgba(244, 67, 54, 0.06);

      .ban-title {
        font-size: 30rpx;
        font-weight: bold;
        color: #d32f2f;
      }

      .ban-reason {
        margin-top: 12rpx;
        font-size: 26rpx;
        line-height: 1.6;
        color: var(--text-color-regular, #666);
      }

      .ban-tip {
        margin-top: 8rpx;
        font-size: 24rpx;
        color: var(--text-color-secondary, #999);
      }

      .ban-action {
        margin-top: 20rpx;
        min-height: 76rpx;
        line-height: 76rpx;
        text-align: center;
        border-radius: 12rpx;
        font-size: 28rpx;
        font-weight: bold;
        color: #ffffff;
        background-color: #d32f2f;

        &:active {
          opacity: 0.85;
        }
      }
    }

    .section-banner {
      margin: 30rpx var(--page-x) 0;
      transform: scale(0.98);
      transform-origin: center top;
      display: block;
    }

    .empty-state {
      padding: 26rpx 24rpx;
      border: 2rpx dashed rgba(76, 76, 76, 0.35);
      border-radius: var(--card-radius);
      background-color: var(--surface-muted);

      .dark-mode & {
        border-color: rgba(255, 255, 255, 0.24);
      }

      .empty-title {
        font-size: 28rpx;
        font-weight: bold;
        color: var(--text-primary);
      }

      .empty-subtitle {
        margin-top: 8rpx;
        font-size: 24rpx;
        line-height: 1.5;
        color: var(--text-secondary);
      }
    }

    .statistic-box {
      margin-top: var(--section-gap);
      box-sizing: border-box;
      background-color: var(--surface-base);
      padding-bottom: 8rpx;

      .head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 20rpx;
        padding: 32rpx var(--page-x) 18rpx;

        div.box-title {
          font-size: 34rpx;
          font-weight: bold;
          line-height: 1.25;
          color: var(--text-primary);
        }

        div.more {
          margin-top: 4rpx;

          p {
            margin: 0;
            text-align: right;
            font-size: 26rpx;
            line-height: 1.5;
            color: var(--text-secondary);
          }
        }
      }

      .statistics-body {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--card-gap);
        padding: 0 var(--page-x);

        .card {
          margin: 0;
          padding: 22rpx;
          width: auto;
          border-radius: var(--card-radius);
          background-color: var(--surface-subtle);
          text-align: left;

          .numeral {
            margin: 0;
            font-size: 40rpx;
            line-height: 1.2;
            color: var(--text-primary);

            span.change {
              display: block;
              margin-top: 8rpx;
              font-size: 24rpx;
              color: #FF9B17;
            }
          }

          .name {
            margin: 10rpx 0 0;
            font-size: 28rpx;
            font-weight: bold;
            color: var(--text-primary);
          }
        }
      }

      .statistics-body.no-statistic {
        display: block;
        padding: 0 var(--page-x);
      }

      .addButton {
        width: auto;
        min-height: 132rpx;
        margin: 18rpx var(--page-x) 0;
        border: 4rpx solid #4c4c4c55;
        border-radius: var(--card-radius);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #4c4c4cee;
        transition: transform 0.2s, background-color 0.2s;
        border-style: dashed;
        font-size: 30rpx;
        
        .dark-mode & {
          color: var(--text-secondary);
          border-color: var(--border-color-lighter);
        }

        &:active {
          transform: scale(0.98);
          background-color: #4c4c4c22;
        }
      }
    }

    // 创作活动板块样式
    .activity-content {
      padding: 0 var(--page-x);
      
      .activity-item {
        margin-bottom: var(--card-gap);
        padding: 24rpx;
        background-color: var(--surface-muted);
        border-radius: var(--card-radius);
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14rpx;
          
          .activity-name {
            font-size: 32rpx;
            font-weight: bold;
            color: var(--text-primary);
          }
        }
        
        .activity-description {
          font-size: 28rpx;
          color: var(--text-secondary);
          margin-bottom: 20rpx;
          line-height: 1.55;
          text-align: left;
        }
        
        .activity-news {
          margin-bottom: 20rpx;
          text-align: left;
          
          .news-title {
            font-size: 28rpx;
            font-weight: bold;
            color: var(--text-primary);
            margin-bottom: 12rpx;
          }
          
          .news-list {
            .news-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 18rpx 22rpx;
              background-color: var(--surface-base);
              border-radius: 12rpx;
              margin-bottom: 10rpx;
              transition: transform 0.2s, background-color 0.2s;
              
              &:active {
                transform: scale(0.98);
                background-color: #f0f0f0;
              }
              
              .news-item-title {
                font-size: 26rpx;
                color: var(--text-primary);
                flex: 1;
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
              color: var(--text-primary);
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
            min-height: 80rpx;
            background-color: var(--accent);
            color: white;
            border-radius: 12rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28rpx;
            font-weight: bold;
            transition: transform 0.2s, background-color 0.2s;
            
            &:active {
              transform: scale(0.98);
              background-color: var(--accent-press);
            }
          }
        }
      }
    }

    .worlds {
      display: flex;
      flex-direction: column;
      gap: var(--card-gap);
      padding: 0 var(--page-x);

      .world-item {
        position: relative;
      }

      .books {
        min-height: 260rpx;
        width: 100%;
        margin: 0;
        display: flex;
        background-color: var(--surface-muted);
        border-radius: var(--card-radius);
        overflow: hidden;
      }

      .world-book-cover {
        width: 200rpx;
        height: 260rpx;
        border-radius: var(--card-radius) 0 0 var(--card-radius);
        flex-shrink: 0;
      }

      .bookInfo.world-book-info {
        margin-left: 20rpx;
        margin-top: 20rpx;
        margin-right: 20rpx;
        flex: 1;

          .world-title {
            font-size: 34rpx;
            line-height: 1.3;
            margin-bottom: 10rpx;
            overflow: hidden;
            display: -webkit-box;
            font-weight: bold;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            color: var(--text-primary);
            text-align: left;
          }

          .world-tag {
            margin-left: 8rpx;
            transform: translateY(-2rpx);
          }

          .author {
            position: relative;
            margin-top: 12rpx;
            margin-bottom: 10rpx;
            display: flex;
            text-align: left;

            .auther_avatar {
              position: absolute;
              top: 0;
              left: 0;
              height: 35rpx;
              width: 35rpx;
              border-radius: 5rpx;
            }

            .auther_name {
              font-size: 25rpx;
              color: var(--text-secondary);
              overflow: hidden;
              margin-left: 45rpx;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
            }
          }

          .description {
            font-size: 25rpx;
            color: var(--text-secondary);
            line-height: 1.5;
            margin: 5rpx 0;
            overflow: hidden;
            display: -webkit-box;
            text-align: left;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
          }
          
          .tags {
            display: flex;
            flex-wrap: wrap;

            .tag {
              font-size: 20rpx;
              color: var(--text-secondary);
              background-color: var(--surface-base);
              padding: 2rpx 10rpx;
              border-radius: 10rpx;
              margin-right: 10rpx;
              margin-bottom: 10rpx;
            }
          }
      }
    }

    .bottom-spacer {
      height: 200rpx;
      background-color: var(--surface-base);
    }
  }
}
</style>
