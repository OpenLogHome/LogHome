<template>
  <div class="book-detail">
    <view class="bodyView" :class="{'drawer-mode': isDrawerMode}" style="text-align: center;" v-if="book">
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

      <writerHelper :novel_id="book.novel_id"></writerHelper>

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
      <div style="height: 200rpx; background-color: #fff;"></div>
    </view>
  </div>
</template>

<script>
import writerHelper from "./writer_helper"

export default {
  name: 'BookDetailView',
  components: {
    writerHelper
  },
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
  methods: {
    showFullDescription() {
      uni.showModal({
        content: this.book.content,
        showCancel: false,
        confirmText: '关闭',
        confirmColor: "#EA7034"
      });
    }
  },
  onShow() {
    console.log(this.book);
  }
}
</script>

<style lang="scss" scoped>
@import "../lib/global.scss";

.book-detail {
  .bodyView {
    background-color: white !important;
    &.drawer-mode {
      .book-header {
        display: flex;
        padding: 32rpx 48rpx;
        padding-bottom: 15rpx;
        text-align: left;
        margin-bottom: 0rpx;
        background: linear-gradient(to bottom, rgb(255, 248, 234) 0%, rgb(255, 248, 234) 30%, rgb(255, 255, 255) 100%);
        // background-color: rgb(255, 248, 234);
        
        .book-cover {
          width: 230rpx;
          height: 320rpx;
          border-radius: 10rpx;
          margin-right: 30rpx;
          flex-shrink: 0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
          }
          
          .bookDescription {
            text-align: left;
            font-size: 28rpx;
            color: #95A1A6;
            padding: 0;
            
            span {
              margin: 0 10rpx;
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
      }

      .button.long {
        width: calc(80vw + 20px);
      }
    }

    .statistic-box {
      margin: 0rpx 0rpx;
      box-sizing: border-box;
      background-color: white;

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

          .numeral {
            font-size: 40rpx;
            margin-bottom: 10rpx;

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

        &:active {
          transform: scale(0.95);
          background-color: #4c4c4c22;
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
          }
        }
      }
    }
  }
}
</style> 