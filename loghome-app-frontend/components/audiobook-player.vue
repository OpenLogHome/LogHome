<template>
  <div class="audiobook-player">
    <div v-if="!showVoiceSelector" class="player-container">
      <div class="book-cover">
        <img :src="coverUrl" alt="Book Cover" class="cover-image">
      </div>
      <div class="player-controls">
        <div class="chapter-info">
          <div class="chapter-title">{{ chapterTitle }}</div>
          <div class="article-info">{{ paragraphContent }}</div>
        </div>
        
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-filled" :style="{ width: progressPercentage + '%' }"></div>
            <div class="progress-handle" :style="{ left: progressPercentage + '%' }"></div>
          </div>
        </div>
        
        <div class="control-buttons">
          <div class="button prev-button" @click="previousChapter">
            <i class="el-icon-arrow-left"></i>
          </div>
          <div class="button play-button" @click="togglePlayPause">
            <i :class="isPlaying ? 'el-icon-video-pause' : 'el-icon-video-play'"></i>
          </div>
          <div class="button next-button" @click="nextChapter">
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="button voice-button" @click="toggleVoiceSelector">
            <i class="el-icon-microphone"></i>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="voice-selector-container">
      <div class="voice-selector-header">
        <div class="back-button" @click="toggleVoiceSelector">
          <i class="el-icon-arrow-left"></i> 返回播放器
        </div>
      </div>
      <div class="voice-selector-list">
        <div class="voice-option" 
             v-for="voice in availableVoices" 
             :key="voice.id"
             :class="{ 'active': currentVoice === voice.id }"
             @click="selectVoice(voice.id)">
          <div class="voice-name">{{ voice.name }}</div>
          <div class="voice-description">{{ voice.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AudiobookPlayer',
  props: {
    allArticleData: {
      type: Object,
      default: {}
    },
    articleIds: {
      type: Array,
      default: () => []
    },
    coverUrl: {
      type: String,
      default: '/static/default-cover.jpg'
    },
    initialVoice: {
      type: String,
      default: 'default'
    },
    startArticleId: {
      default: '-1'
    }
  },
  data() {
    return {
      isPlaying: false,
      currentVoice: this.initialVoice,
      chapterTitle: '加载中...',
      paragraphContent: '',
      progressPercentage: 0,
      showVoiceSelector: false,
      availableVoices: [
        { id: 'zh-CN-XiaoxiaoNeural', name: '晓晓 (女声)', description: '新闻、小说 - 温暖' },
        { id: 'zh-CN-XiaoyiNeural', name: '晓伊 (女声)', description: '卡通、小说 - 活泼' },
        { id: 'zh-CN-YunjianNeural', name: '云健 (男声)', description: '体育、小说 - 热情' },
        { id: 'zh-CN-YunxiNeural', name: '云希 (男声)', description: '小说 - 活泼、阳光' },
        { id: 'zh-CN-YunxiaNeural', name: '云夏 (男声)', description: '卡通、小说 - 可爱' },
        { id: 'zh-CN-YunyangNeural', name: '云扬 (男声)', description: '新闻 - 专业、可靠' },
        { id: 'zh-CN-liaoning-XiaobeiNeural', name: '晓北 (女声)', description: '方言 - 幽默' },
        { id: 'zh-CN-shaanxi-XiaoniNeural', name: '晓妮 (女声)', description: '方言 - 明亮' }
      ],
      currentProgress: null,
      lastArticleId: -1,
      lastParagraphId: -1
    };
  },
  computed: {
  },
  mounted() {
    this.initPlayer();
    // 定期获取播放进度
    this.progressInterval = setInterval(() => {
      this.getPlaybackProgress();
    }, 2000);
  },
  beforeDestroy() {
    clearInterval(this.progressInterval);
  },
  methods: {
    initPlayer() {
      if (this.articleIds && this.articleIds.length > 0) {
        if(this.startArticleId != -1) {
          this.replacePlaylist(this.articleIds, this.startArticleId);
        } else {
          // 默认从第一篇文章开始播放
          this.replacePlaylist(this.articleIds);
        }
      }
      this.setVoice(this.currentVoice);
    },
    checkJsBridge() {
      if (!window.jsBridge) {
        uni.showToast({
          title: 'jsBridge不可用',
          icon: 'none'
        });
        return false;
      }
      return true;
    },
    /**
     * 替换播放列表
     * @param {Array} ids - 文章ID列表
     * @param {string} [startArticleId] - 可选，指定从哪个文章开始播放，如果不指定则从第一个文章开始
     */
    replacePlaylist(ids, startArticleId) {
      console.log('替换播放列表', ids, startArticleId ? `从文章${startArticleId}开始` : '从第一篇开始');
      if (!this.checkJsBridge()) return;
      if (window.jsBridge.replacePlaylist) {
        // 确保传递的是字符串数组
        const stringIds = ids.map(id => id.toString());
        window.jsBridge.replacePlaylist(stringIds, startArticleId);
        console.log('播放列表已替换', stringIds, startArticleId ? `从文章${startArticleId}开始` : '从第一篇开始');
      } else {
        console.error('replacePlaylist方法未找到');
      }
    },
    setVoice(voice) {
      if (!this.checkJsBridge()) return;
      if (window.jsBridge.setVoice) {
        window.jsBridge.setVoice(voice);
        this.currentVoice = voice;
        console.log(`语音已设置为${voice}`);
      } else {
        console.error('setVoice方法未找到');
      }
    },
    togglePlayPause() {
      if (this.isPlaying) {
        this.pauseAudio();
      } else {
        this.playAudio();
      }
    },
    playAudio() {
      if (!this.checkJsBridge()) return;
      if (window.jsBridge.playAudio) {
        window.jsBridge.playAudio();
        this.isPlaying = true;
        console.log('开始播放');
      } else {
        console.error('playAudio方法未找到');
      }
    },
    pauseAudio() {
      if (!this.checkJsBridge()) return;
      if (window.jsBridge.pauseAudio) {
        window.jsBridge.pauseAudio();
        this.isPlaying = false;
        console.log('暂停播放');
      } else {
        console.error('pauseAudio方法未找到');
      }
    },
    async getPlaybackProgress() {
      if (!this.checkJsBridge()) return;
      if (window.jsBridge.getPlaybackProgress) {
        try {
          const result = await window.jsBridge.getPlaybackProgress();
          // console.log('获取到的播放进度数据:', result);
          if (result) {
            let progressData;
            try {
              if (typeof result === 'string') {
                progressData = JSON.parse(result);
              } else {
                progressData = result;
              }
              
              if (progressData && progressData.articleId && progressData.paragraphId) {
                this.currentProgress = progressData;
                this.updateProgressDisplay(progressData);
              } else {
                console.error('进度数据格式不正确:', progressData);
              }
            } catch (parseError) {
              console.error('解析进度数据失败:', parseError, '原始数据:', result);
            }
          } else {
            console.log('未获取到播放进度，可能未在播放');
            this.isPlaying = false;
          }
        } catch (e) {
          console.error('获取播放进度时发生错误:', e);
        }
      } else {
        console.error('getPlaybackProgress方法未找到');
      }
    },
    updateProgressDisplay(progressData) {
      this.isPlaying = progressData.isPlaying;
      let article = this.allArticleData[progressData.articleId];
      let paragraphCounts = 0;
      let currentParagraphIdx;
      if(article) {
        this.chapterTitle = article.title;
        if(progressData.paragraphId == -1) {
          this.paragraphContent = article.title;
          paragraphCounts = 1;
          currentParagraphIdx = 1;
        }
        for(let item of article.content){
          if(item.type == "text") {
            paragraphCounts ++;
          }
          if(item.id == progressData.paragraphId) {
            currentParagraphIdx = paragraphCounts;
            this.paragraphContent = item.value;
          }
        }
      }

      if(this.lastArticleId != progressData.articleId || this.lastParagraphId != progressData.paragraphId) {
        this.lastArticleId = progressData.articleId;
         this.lastParagraphId = progressData.paragraphId;
         this.$emit("change", {articleId: progressData.articleId, paragraphId: progressData.paragraphId})
      }
      
      // 假设进度计算
      this.progressPercentage = (currentParagraphIdx / paragraphCounts) * 100;
    },
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    },
    toggleVoiceSelector() {
      this.showVoiceSelector = !this.showVoiceSelector;
    },
    selectVoice(voiceId) {
      this.setVoice(voiceId);
      this.showVoiceSelector = false;
    },
    /**
     * 跳转到指定文章的指定段落
     * @param {string} articleId - 文章ID
     * @param {string} paragraphId - 段落ID，默认为-1（章节标题）
     */
    async navToArticleParagraph(articleId, paragraphId = '-1') {
      if (!this.checkJsBridge()) return false;
      if (!window.jsBridge.jumpToArticleParagraph) {
        console.error('jumpToArticleParagraph方法未找到');
        return false;
      }
      
      try {
        console.log(`跳转到文章ID: ${articleId}, 段落ID: ${paragraphId}`);
        const result = await window.jsBridge.jumpToArticleParagraph(articleId.toString(), paragraphId.toString());
        if (result) {
          console.log('跳转成功');
          // 更新当前播放状态
          this.isPlaying = true;
          return true;
        } else {
          console.error('跳转失败');
          return false;
        }
      } catch (e) {
        console.error('跳转时发生错误:', e);
        return false;
      }
    },
    
    previousChapter() {
      // 实现上一章功能
      console.log('上一章');
      
      // 获取当前文章在播放列表中的索引
      if (!this.currentProgress || !this.currentProgress.articleId) {
        console.error('无法获取当前播放进度');
        return;
      }
      
      const currentArticleId = this.currentProgress.articleId;
      const currentIndex = this.articleIds.findIndex(id => id.toString() === currentArticleId.toString());
      
      if (currentIndex > 0) {
        // 跳转到上一篇文章的第一段
        const prevArticleId = this.articleIds[currentIndex - 1].toString();
        this.navToArticleParagraph(prevArticleId, '-1');
      } else {
        console.log('已经是第一篇文章');
        uni.showToast({
          title: '已经是第一篇文章',
          icon: 'none'
        });
      }
    },
    
    nextChapter() {
      // 实现下一章功能
      console.log('下一章');
      
      // 获取当前文章在播放列表中的索引
      if (!this.currentProgress || !this.currentProgress.articleId) {
        console.error('无法获取当前播放进度');
        return;
      }
      
      const currentArticleId = this.currentProgress.articleId;
      const currentIndex = this.articleIds.findIndex(id => id.toString() === currentArticleId.toString());
      
      if (currentIndex < this.articleIds.length - 1) {
        // 跳转到下一篇文章的第一段
        const nextArticleId = this.articleIds[currentIndex + 1].toString();
        this.navToArticleParagraph(nextArticleId, '-1');
      } else {
        console.log('已经是最后一篇文章');
        uni.showToast({
          title: '已经是最后一篇文章',
          icon: 'none'
        });
      }
    },
  }
};
</script>

<style scoped>
.audiobook-player {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
}

.player-container {
  display: flex;
  padding: 8px;
  align-items: flex-start;
}

.book-cover {
  min-width: 120px;
  width: 120px;
  height: 140px;
  margin-right: 20px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.player-controls {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  overflow: hidden;
}

.chapter-info {
  margin-bottom: 15px;
}

.chapter-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.article-info {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.progress-container {
  margin-bottom: 15px;
}

.progress-bar {
  height: 6px;
  background-color: #ddd;
  border-radius: 3px;
  position: relative;
  margin-bottom: 5px;
}

.progress-filled {
  height: 100%;
  background-color: #409EFF;
  border-radius: 3px;
  position: absolute;
  left: 0;
  top: 0;
}

.progress-handle {
  width: 12px;
  height: 12px;
  background-color: #409EFF;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
}

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.control-buttons {
  display: flex;
  align-items: center;
}

.button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.button:hover {
  background-color: #f0f0f0;
}

.play-button {
  width: 50px;
  height: 50px;
  background-color: #409EFF;
  color: white;
}

.play-button:hover {
  background-color: #66b1ff;
}

.voice-selector-container {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.voice-selector-header {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #eee;
  background-color: #fff;
}

.back-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #409EFF;
  font-size: 14px;
}

.voice-selector-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #fff;
}

.voice-option {
  padding: 15px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
  margin-bottom: 5px;
  border-bottom: 1px solid #f0f0f0;
}

.voice-option:hover {
  background-color: #f0f0f0;
}

.voice-option.active {
  background-color: #ecf5ff;
  color: #409EFF;
}

.voice-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.voice-description {
  font-size: 12px;
  color: #666;
}
</style>