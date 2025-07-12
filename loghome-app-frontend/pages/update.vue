<template>
  <view class="update-container">
    <image :src="updateBg" mode="aspectFit"></image>
    <view class="update-card" v-if="isLoaded">
      
      <view class="update-header">
        <text class="update-title">发现新版本</text>
        <view class="update-badges">
          <text v-if="isForced" class="badge forced">强制更新</text>
          <text v-if="allowHot" class="badge hot">支持极速更新</text>
        </view>
      </view>
      
      <view class="update-version-info">
        <text class="version-label">当前版本</text>
        <text class="version-number">{{ currentVersion }}</text>
        <text class="version-arrow">→</text>
        <text class="version-label">最新版本</text>
        <text class="version-number new">{{ version }}</text>
      </view>
      
      <view class="divider"></view>
      
      <view class="update-desc-container">
        <text class="desc-title">更新内容</text>
        <rich-text class="update-desc" :nodes="desc"></rich-text>
      </view>
      
      <view class="update-actions">
        <button v-if="allowHot" class="btn-primary" @click="doHotUpdate">极速更新（推荐）</button>
        <button class="btn-secondary" @click="gotoDownload">下载全量包</button>
        <button v-if="!isForced" class="btn-cancel" @click="goBack">暂不更新</button>
      </view>
    </view>
    
    <view class="loading-container" v-else>
      <view class="loading-spinner"></view>
      <text class="loading-text">加载更新信息...</text>
    </view>
  </view>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      isLoaded: false,
      currentVersion: '',
      currentVersionNumber: 0,
      updateBg: '',
      version: '',
      versionNumber: 0,
      desc: '',
      updateUrl: '',
      assetUrl: '',
      allowHot: false,
      isForced: false
    };
  },
  async onLoad() {
    // 获取当前版本
    this.currentVersion = this.$store.state.appVersionStr || '';
    this.currentVersionNumber = this.$store.state.appVersion || 0;
    
    // 从API获取更新信息
    await this.fetchUpdateInfo();
  },
  methods: {
    // 从API获取更新信息
    async fetchUpdateInfo() {
      try {
        // 获取最新版本信息
        const response = await axios.get(this.$baseUrl + '/app/get_app_update');
        
        if (response.data && response.data.length > 0) {
          const update = response.data[0];
          
          this.version = update.version || '';
          this.versionNumber = update.version_number || 0;
          this.desc = update.version_info || '';
          this.updateUrl = update.update_url || '';
          this.assetUrl = update.asset_url || '';
          this.allowHot = update.allow_hot === 1;
          this.isForced = update.is_forced === 1;
          this.updateBg = update.update_bg || '';
          
          // 检查极速更新兼容性
          await this.checkHotUpdateCompatibility();
        }
      } catch (error) {
        console.error('获取更新信息失败:', error);
        uni.showToast({
          title: '获取更新信息失败',
          icon: 'none'
        });
        
        // 如果获取失败，返回上一页
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
        return;
      }
      
      // 标记为已加载
      this.isLoaded = true;
    },
    
    // 检查极速更新兼容性
    async checkHotUpdateCompatibility() {
      try {
        const response = await axios.get(this.$baseUrl + '/app/check_hot_update_compatibility', {
          params: { current_version: this.currentVersionNumber }
        });
        
        if (response.data && response.data.allow_hot !== undefined) {
          // 更新极速更新状态 - 只有当中间所有版本都支持极速更新时才允许
          this.allowHot = response.data.allow_hot;
        }
      } catch (error) {
        console.error('检查极速更新兼容性失败:', error);
        // 如果检查失败，则保守地禁用极速更新
        this.allowHot = false;
      }
    },
    
    // 执行极速更新
    doHotUpdate() {
      if (!window.jsBridge) {
        uni.showToast({
          title: '当前环境不支持极速更新',
          icon: 'none'
        });
        return;
      }
      
      // 调用原生接口执行极速更新，不需要传递回调
      if (window.jsBridge.hotUpdateAssets) {
        window.jsBridge.hotUpdateAssets(this.assetUrl, this.versionNumber.toString());
        
        // 显示Toast提示用户更新已开始
        uni.showToast({
          title: '极速更新已开始，请稍候...',
          icon: 'none',
          duration: 2000
        });
      }
    },
    
    // 下载全量包
    gotoDownload() {
      if (window.jsBridge && window.jsBridge.openInBrowser) {
        window.jsBridge.openInBrowser(this.updateUrl);
      } else {
        window.open(this.updateUrl, '_blank');
      }
    },
    
    // 返回
    goBack() {
      uni.navigateBack();
    }
  }
};
</script>

<style lang="scss" scoped>
.update-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  image {
    width: 100vw;
  }
}

.update-card {
  width: calc(100% - 80rpx);
  background-color: #ffffff;
  padding: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  position: relative;
}

.update-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;
}

.update-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.update-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10rpx;
}

.badge {
  font-size: 24rpx;
  padding: 6rpx 20rpx;
  border-radius: 30rpx;
  color: #fff;
  
  &.forced {
    background-color: #e74c3c;
  }
  
  &.hot {
    background-color: #1B4B88;
  }
}

.update-version-info {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30rpx 0;
  flex-wrap: wrap;
}

.version-label {
  font-size: 26rpx;
  color: #666;
  margin: 0 10rpx;
}

.version-number {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin: 0 10rpx;
  
  &.new {
    color: #1B4B88;
  }
}

.version-arrow {
  font-size: 36rpx;
  color: #999;
  margin: 0 20rpx;
}

.divider {
  height: 2rpx;
  background-color: #eee;
  margin: 20rpx 0;
}

.update-desc-container {
  margin: 30rpx 0;
}

.desc-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.update-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.7;
}

.update-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
  
  button {
    height: 80rpx;
    border-radius: 40rpx;
    font-size: 30rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .btn-primary {
    background-color: #1B4B88;
    color: #fff;
  }
  
  .btn-secondary {
    background-color: #fff;
    color: #1B4B88;
    border: 2rpx solid #1B4B88;
  }
  
  .btn-cancel {
    background-color: #f5f5f5;
    color: #666;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300rpx;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #f3f3f3;
  border-top: 4rpx solid #1B4B88;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #666;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// Dark mode support
@media (prefers-color-scheme: dark) {
  .update-container {
    background-color: #121212;
  }
  
  .update-card {
    background-color: #1e1e1e;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.3);
  }
  
  .update-title, .version-number {
    color: #eee;
  }
  
  .version-label, .progress-text, .update-desc, .loading-text {
    color: #aaa;
  }
  
  .divider {
    background-color: #333;
  }
  
  .btn-secondary {
    background-color: #2c2c2c;
    border-color: #1B4B88;
  }
  
  .btn-cancel {
    background-color: #333;
    color: #ccc;
  }
  
  .loading-spinner {
    border: 4rpx solid #333;
    border-top: 4rpx solid #1B4B88;
  }
}
</style> 