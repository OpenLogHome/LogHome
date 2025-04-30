<template>
  <div class="slide-verify" :style="{width: w + 'px'}" user-select="none">
    <el-slider
      v-model="sliderValue"
      :show-tooltip="false"
      :min="0"
      :max="100"
      @change="handleSliderChange"
      :disabled="isSuccess"
    ></el-slider>
    
    <div class="verify-status" :class="{'success': isSuccess}">
      <i class="el-icon-success" v-if="isSuccess"></i>
      <span v-else>{{ sliderText }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SlideVerify',
  props: {
    // 容器宽度
    w: {
      type: Number,
      default: 310
    },
    // 滑块文本
    sliderText: {
      type: String,
      default: '向右滑动完成验证'
    }
  },
  data() {
    return {
      sliderValue: 0,
      isSuccess: false
    }
  },
  methods: {
    // 处理滑块变化
    handleSliderChange(value) {
      if (value >= 99) {
        this.isSuccess = true
        this.$emit('success', true)
      }
    },
    // 重置
    reset() {
      this.sliderValue = 0
      this.isSuccess = false
    }
  }
}
</script>

<style scoped>
.slide-verify {
  position: relative;
  margin: 0 auto;
  user-select: none;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.verify-status {
  text-align: center;
  margin-top: 10px;
  color: #947358;
  font-size: 14px;
}

.verify-status.success {
  color: #67c23a;
}

/* 自定义 Element UI 滑块样式 */
.slide-verify >>> .el-slider__runway {
  height: 40px;
  margin: 0;
  background-color: #e4e7eb;
  border-radius: 4px;
}

.slide-verify >>> .el-slider__bar {
  height: 40px;
  background-color: #d1e9fe;
  border-radius: 4px;
}

.slide-verify >>> .el-slider__button-wrapper {
  top: 0;
  width: 40px;
  height: 40px;
}

.slide-verify >>> .el-slider__button {
  width: 40px;
  height: 40px;
  border: 1px solid #e4e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-verify >>> .el-slider__button::after {
  content: '>';
  color: #947358;
  font-size: 20px;
}

.slide-verify.success >>> .el-slider__button::after {
  content: 'OK';
  color: #67c23a;
}
</style> 