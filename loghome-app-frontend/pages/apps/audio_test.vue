<template>
  <view class="container">
    <view class="title">Audiobook Test Page</view>

    <view class="section">
      <view class="section-title">Playlist</view>
      <input class="input" v-model="articleIds" placeholder="Enter article IDs, comma-separated" />
      <button class="button" @click="replacePlaylist">Replace Playlist</button>
    </view>

    <view class="section">
      <view class="section-title">Playback</view>
      <input class="input" v-model="voice" placeholder="Enter voice" />
      <button class="button" @click="setVoice">Set Voice</button>
      <button class="button" @click="playAudio">Play</button>
      <button class="button" @click="pauseAudio">Pause</button>
    </view>

    <view class="section">
      <view class="section-title">Progress</view>
      <button class="button" @click="getPlaybackProgress">Get Progress</button>
      <view class="progress-display">
        <text>Current Progress: {{ progress }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      articleIds: '106,107,108',
      voice: 'default',
      progress: 'Not playing'
    };
  },
  methods: {
    checkJsBridge() {
      if (!window.jsBridge) {
        uni.showToast({
          title: 'jsBridge not available',
          icon: 'none'
        });
        return false;
      }
      return true;
    },
    replacePlaylist() {
      if (!this.checkJsBridge()) return;
      const ids = this.articleIds.split(',').map(id => id.trim()).filter(id => id);
      if (window.jsBridge.replacePlaylist) {
        window.jsBridge.replacePlaylist(ids);
        uni.showToast({
          title: 'Playlist replaced',
          icon: 'none'
        });
      } else {
        uni.showToast({ title: 'replacePlaylist not found', icon: 'none' });
      }
    },
    setVoice() {
      if (!this.checkJsBridge()) return;
      if (window.jsBridge.setVoice) {
        window.jsBridge.setVoice(this.voice);
        uni.showToast({
          title: `Voice set to ${this.voice}`,
          icon: 'none'
        });
      } else {
        uni.showToast({ title: 'setVoice not found', icon: 'none' });
      }
    },
    playAudio() {
      if (!this.checkJsBridge()) return;
      if (window.jsBridge.playAudio) {
        window.jsBridge.playAudio();
        uni.showToast({
          title: 'Playback started',
          icon: 'none'
        });
      } else {
        uni.showToast({ title: 'playAudio not found', icon: 'none' });
      }
    },
    pauseAudio() {
      if (!this.checkJsBridge()) return;
      if (window.jsBridge.pauseAudio) {
        window.jsBridge.pauseAudio();
        uni.showToast({
          title: 'Playback paused',
          icon: 'none'
        });
      } else {
        uni.showToast({ title: 'pauseAudio not found', icon: 'none' });
      }
    },
    async getPlaybackProgress() {
      if (!this.checkJsBridge()) return;
      if (window.jsBridge.getPlaybackProgress) {
        try {
          const result = await window.jsBridge.getPlaybackProgress();
          console.log('获取到的播放进度数据:', result);
          if (result) {
            // 解析返回的JSON字符串
            let progressData;
            try {
              // 确保result是字符串并进行解析
              if (typeof result === 'string') {
                progressData = JSON.parse(result);
                console.log('解析后的JSON数据:', progressData);
              } else {
                // 如果不是字符串，可能是直接返回的对象
                progressData = result;
                console.log('直接使用对象数据:', progressData);
              }
              
              // 检查解析后的数据是否包含所需字段
              if (progressData && progressData.articleId && progressData.paragraphId) {
                this.progress = `Article: ${progressData.articleId}, Paragraph: ${progressData.paragraphId}`;
                console.log('更新进度显示:', this.progress);
              } else {
                console.error('进度数据格式不正确:', progressData);
                this.progress = 'Invalid progress data format';
              }
            } catch (parseError) {
              console.error('解析进度数据失败:', parseError, '原始数据:', result);
              this.progress = 'Error parsing progress data';
            }
          } else {
            console.log('未获取到播放进度，可能未在播放');
            this.progress = 'Not playing';
          }
        } catch (e) {
          console.error('获取播放进度时发生错误:', e);
          this.progress = 'Error getting progress';
        }
      } else {
        uni.showToast({ title: 'getPlaybackProgress not found', icon: 'none' });
      }
    }
  }
};
</script>

<style>
.container {
  padding: 20px;
  font-family: sans-serif;
}
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}
.section {
  margin-bottom: 20px;
}
.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
.input {
  border: 1px solid #ccc;
  padding: 8px;
  width: 100%;
  margin-bottom: 10px;
  box-sizing: border-box;
  height: 40px;
}
.button {
  background-color: #007aff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
}
.button:active {
  background-color: #005ecb;
}
.progress-display {
  margin-top: 10px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
}
</style>