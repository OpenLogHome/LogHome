<template>
  <span class="typewriter-container">
    <span class="static-text">{{ staticText }}</span>
    <span class="typewriter-text">{{ displayText }}</span>
    <span class="cursor" :class="{ 'blink': showCursor }">|</span>
  </span>
</template>

<script>
export default {
  name: 'TypewriterText',
  props: {
    staticText: {
      type: String,
      default: '在 原木社区，'
    },
    sentences: {
      type: Array,
      default: () => [
        '发现精彩故事',
        '创作无限可能',
        '分享阅读乐趣',
        '连接创作者与读者',
        '探索文学世界'
      ]
    },
    typeSpeed: {
      type: Number,
      default: 100
    },
    deleteSpeed: {
      type: Number,
      default: 50
    },
    pauseTime: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      displayText: '',
      currentSentenceIndex: 0,
      currentCharIndex: 0,
      isDeleting: false,
      showCursor: true,
      timeoutId: null
    }
  },
  mounted() {
    this.startTypewriter()
    this.startCursorBlink()
  },
  beforeDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
  },
  methods: {
    startTypewriter() {
      this.typeWriter()
    },
    typeWriter() {
      const currentSentence = this.sentences[this.currentSentenceIndex]
      
      if (this.isDeleting) {
        // 删除字符
        this.displayText = currentSentence.substring(0, this.currentCharIndex - 1)
        this.currentCharIndex--
        
        if (this.currentCharIndex === 0) {
          this.isDeleting = false
          this.currentSentenceIndex = (this.currentSentenceIndex + 1) % this.sentences.length
          this.timeoutId = setTimeout(() => this.typeWriter(), 500)
          return
        }
        
        this.timeoutId = setTimeout(() => this.typeWriter(), this.deleteSpeed)
      } else {
        // 输入字符
        this.displayText = currentSentence.substring(0, this.currentCharIndex + 1)
        this.currentCharIndex++
        
        if (this.currentCharIndex === currentSentence.length) {
          // 完成输入，暂停后开始删除
          this.timeoutId = setTimeout(() => {
            this.isDeleting = true
            this.typeWriter()
          }, this.pauseTime)
          return
        }
        
        this.timeoutId = setTimeout(() => this.typeWriter(), this.typeSpeed)
      }
    },
    startCursorBlink() {
      setInterval(() => {
        this.showCursor = !this.showCursor
      }, 530)
    }
  }
}
</script>

<style scoped>
.typewriter-container {
  display: inline-block;
}

.static-text {
  color: inherit;
}

.typewriter-text {
  color: inherit;
}

.cursor {
  color: inherit;
  font-weight: normal;
  opacity: 1;
  transition: opacity 0.1s ease-in-out;
}

.cursor.blink {
  opacity: 0;
}
</style>