<template>
  <div class="fans-ranking">
    <div class="fans-toolbar"><button :class="{ active: period === 'total' }" @click="period = 'total'">总榜</button><button :class="{ active: period === 'month' }" @click="period = 'month'">月榜</button><button :disabled="loading" @click="getFansList">刷新</button></div>
    <p v-if="loadError" class="fans-error" role="alert">{{ loadError }} <button @click="getFansList">重试</button></p>
    <div v-if="loading" class="loading-wrapper">
      <div class="loading-spinner"></div>
      <p>正在加载粉丝榜...</p>
    </div>

    <div v-else class="fans-list-wrapper">
      <!-- 粉丝列表 -->
      <div class="fans-list">
        <div class="fan-item" v-for="(fan, index) in visibleFans" :key="fan.user_id">
          <div class="fan-rank">
            <div :class="index <= 2 ? rankClasses[index] : 'rank-number'">
              {{ index + 1 }}
            </div>
          </div>
          <div class="fan-avatar">
            <img :src="fan.avatar_url" alt="头像" @click="gotoUserProfile(fan.user_id)">
          </div>
          <div class="fan-details">
            <div class="fan-info">
              <span class="fan-name" @click="gotoUserProfile(fan.user_id)">{{ fan.user_name }}</span>
              <span class="fan-value">{{ fan.fans_value }}</span>
            </div>
            <div class="fan-message" v-if="fan.message || isMe(fan)">
              {{ fan.message || '写下支持留言' }} <button v-if="isMe(fan)" @click="editMessage(fan)">编辑留言</button>
            </div>
          </div>
        </div>
      </div>

      <p v-if="!fanInfo.length && !loadError" class="fans-empty">本{{ period === 'month' ? '月' : '作品' }}还没有粉丝上榜</p>
      <button v-if="limit > 0 && fanInfo.length > limit" class="fans-more" @click="showAll = !showAll">{{ showAll ? '收起' : `完整粉丝榜（${fanInfo.length} 人）` }}</button>
      <!-- 当前用户信息条 -->
      <div class="my-info-wrapper" v-if="isLogin && myInfo.name">
        <div class="my-info-rank">
          {{ myInfo.rank }}
        </div>
        <div class="my-info">
          <div class="my-avatar">
            <img :src="myInfo.avatar_url" alt="我的头像">
          </div>
          <div class="my-details">
            <span class="my-name">{{ myInfo.name }}</span>
            <span class="my-value">{{ myInfo.fans_value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 更多粉丝链接 -->
    <!-- <div class="view-more-wrapper" v-if="fanInfo.length > 0">
      <nuxt-link :to="`/novel/fans?id=${novelId}`" class="view-more-link">
        查看完整粉丝榜 >
      </nuxt-link>
    </div> -->
  </div>
</template>

<script>
import { readingToken } from '~/plugins/api/reading'
export default {
  props: { novelId: { type: [Number, String], required: true }, limit: { type: Number, default: 10 } },
  data() { return { loading: true, fanInfo: [], myInfo: { rank: '未上榜', fans_value: 0, name: '', avatar_url: '' }, rankClasses: ['rank-first', 'rank-second', 'rank-third'], isLogin: false, userInfo: null, period: 'total', showAll: false, loadError: '', version: 0, account: null } },
  computed: { visibleFans() { return this.limit > 0 && !this.showAll ? this.fanInfo.slice(0, this.limit) : this.fanInfo } },
  watch: { novelId() { this.fanInfo = []; this.showAll = false; this.getFansList() }, period() { this.fanInfo = []; this.showAll = false; this.getFansList() } },
  mounted() { this.account = readingToken(); this.getFansList(); window.addEventListener('focus', this.checkAccount); window.addEventListener('storage', this.checkAccount) }, beforeDestroy() { this.version++; window.removeEventListener('focus', this.checkAccount); window.removeEventListener('storage', this.checkAccount) },
  methods: {
    checkAccount() { const token = readingToken(); if (token !== this.account) { this.account = token; this.userInfo = null; this.isLogin = !!token; this.getFansList() } },
    async getFansList() {
      const version = ++this.version, token = readingToken(); this.account = token; this.loading = true; this.loadError = ''; this.isLogin = !!token; this.myInfo = { rank: '未上榜', fans_value: 0, name: '', avatar_url: '' }; this.userInfo = null
      try {
        const [fans, user] = await Promise.all([this.$api.reader.fans(this.novelId, this.period), token ? this.$api.reader.profile().catch(() => null) : Promise.resolve(null)])
        if (version !== this.version || token !== readingToken()) return
        this.fanInfo = Array.isArray(fans) ? fans : []; this.userInfo = user
        if (user) { const index = this.fanInfo.findIndex(fan => String(fan.user_id) === String(user.user_id)); this.myInfo = { ...user, rank: index < 0 ? '未上榜' : `第 ${index + 1} 名`, fans_value: index < 0 ? 0 : this.fanInfo[index].fans_value } }
      } catch (error) { if (version === this.version) this.loadError = error.message || '粉丝榜加载失败' }
      finally { if (version === this.version) this.loading = false }
    },
    isMe(fan) { return this.account === readingToken() && this.userInfo && String(fan.user_id) === String(this.userInfo.user_id) },
    async editMessage(fan) {
      if (!this.isMe(fan)) return
      const version = this.version, token = readingToken()
      try {
        const { value } = await this.$prompt('写下对作品的支持留言', '粉丝留言', { inputValue: fan.message || '', inputType: 'textarea', inputValidator: value => String(value || '').length <= 200 || '留言最多 200 字' })
        if (version !== this.version || token !== readingToken()) return
        const response = await this.$api.reader.fanMessage(this.novelId, String(value || '').trim())
        if (version !== this.version || token !== readingToken()) return
        if (!response.success) throw new Error(response.msg || '留言更新失败')
        fan.message = String(value || '').trim(); this.$message.success('留言已更新')
      } catch (error) { if (error !== 'cancel' && error !== 'close' && version === this.version) this.$message.error(error.message || '留言更新失败') }
    },
    gotoUserProfile(userId) { this.$router.push(`/users/${userId}`) }
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #947358;
$secondary-color: #704C35;
$accent-color: #EA7034;
$text-color: #333;
$text-light: #666;
$text-lighter: #888;
$border-color: #eee;
$border-light: #f5f5f5;

@mixin loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba($primary-color, 0.2);
  border-top-color: $primary-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fans-toolbar { display: flex; gap: 8px; margin-bottom: 14px; } .fans-toolbar button,.fan-message button,.fans-more { font: inherit; font-size: 12px; border: 1px solid #e5d8c9; border-radius: 5px; color: #947358; background: #fff; padding: 7px 12px; cursor: pointer; } .fans-toolbar button.active { background: #947358; color: #fff; } .fans-toolbar button:disabled { opacity: .5; } .fans-error { color: #ba6654; font-size: 13px; margin-bottom: 10px; } .fans-empty { color: #aaa; text-align: center; padding: 20px; } .fans-more { display: block; margin: 20px auto; }
.fans-ranking {
  width: 100%;
  position: relative;
  margin-bottom: 20px;
  
  .loading-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    
    .loading-spinner {
      @include loading-spinner;
    }
    
    p {
      color: $text-lighter;
      font-size: 14px;
    }
  }
  
  .fans-list-wrapper {
    width: 100%;
    position: relative;
    
    .fans-list {
      width: 100%;
      
      .fan-item {
        display: flex;
        align-items: center;
        padding: 15px 10px;
        border-bottom: 1px solid $border-light;
        
        &:last-child {
          border-bottom: none;
        }
        
        .fan-rank {
          width: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          
          .rank-number {
            font-size: 16px;
            font-weight: bold;
            color: $text-light;
          }
          
          .rank-first, .rank-second, .rank-third {
            width: 24px;
            height: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
            border-radius: 50%;
          }
          
          .rank-first {
            background-color: #FF6B6B;
          }
          
          .rank-second {
            background-color: #FFB347;
          }
          
          .rank-third {
            background-color: #59C2A7;
          }
        }
        
        .fan-avatar {
          margin: 0 15px;
          
          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
            cursor: pointer;
            transition: transform 0.2s;
            
            &:hover {
              transform: scale(1.05);
            }
          }
        }
        
        .fan-details {
          flex: 1;
          
          .fan-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            
            .fan-name {
              font-weight: bold;
              color: $accent-color;
              cursor: pointer;
              
              &:hover {
                text-decoration: underline;
              }
            }
            
            .fan-value {
              font-weight: bold;
              color: $accent-color;
            }
          }
          
          .fan-message {
            padding: 8px 12px;
            background-color: rgba($accent-color, 0.1);
            border-radius: 8px;
            font-size: 14px;
            color: $text-light;
            position: relative;
            
            &:before {
              content: "";
              position: absolute;
              top: -8px;
              left: 15px;
              border-width: 0 8px 8px;
              border-style: solid;
              border-color: transparent transparent rgba($accent-color, 0.1);
            }
          }
        }
      }
    }
    
    .my-info-wrapper {
      position: sticky;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 10;
      
      .my-info-rank {
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 6px 15px;
        border-top-right-radius: 20px;
        font-size: 14px;
        display: inline-block;
      }
      
      .my-info {
        display: flex;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.8);
        padding: 10px 15px;
        
        .my-avatar {
          margin-right: 15px;
          
          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
          }
        }
        
        .my-details {
          display: flex;
          flex: 1;
          justify-content: space-between;
          align-items: center;
          
          .my-name {
            color: white;
            font-weight: bold;
          }
          
          .my-value {
            color: $accent-color;
            font-weight: bold;
          }
        }
      }
    }
  }
  
  .view-more-wrapper {
    text-align: right;
    margin-top: 15px;
    
    .view-more-link {
      color: $text-light;
      text-decoration: none;
      font-size: 14px;
      padding: 5px;
      
      &:hover {
        color: $accent-color;
      }
    }
  }
}
</style>
