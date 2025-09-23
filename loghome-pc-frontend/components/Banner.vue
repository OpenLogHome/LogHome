<template>
  <div class="banner-container" v-if="banners.length > 0">
    <div class="banner-swiper" 
      @mouseenter="stopAutoPlay" 
      @mouseleave="startAutoPlay">
      <div class="banner-wrapper" 
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div class="banner-item" 
          v-for="(banner, index) in banners" 
          :key="'banner-'+index"
          @click="navigateToBanner(banner)">
          <img :src="banner.image_url" :alt="banner.title || 'banner'" class="banner-image"/>
          <div class="banner-mask" v-if="banner.title">
            <div class="banner-title">{{banner.title}}</div>
          </div>
        </div>
      </div>
      
      <!-- 分页指示器 -->
      <div class="banner-pagination" v-if="banners.length > 1">
        <span
          v-for="(_, index) in banners"
          :key="index"
          :class="['pagination-dot', { active: currentSlide === index }]"
          @click.stop="setSlide(index)"
        ></span>
      </div>
      
      <!-- 导航按钮 -->
      <div class="banner-button-prev" @click.stop="prevSlide" v-if="banners.length > 1">
        <span class="arrow">‹</span>
      </div>
      <div class="banner-button-next" @click.stop="nextSlide" v-if="banners.length > 1">
        <span class="arrow">›</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Banner',
  
  props: {
    page: {
      type: String,
      default: 'library'
    },
    // 新增可配置项
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 8000
    },
    duration: {
      type: Number,
      default: 500
    },
    showDots: {
      type: Boolean,
      default: true
    }
  },
  
  data() {
    return {
      banners: [],
      currentSlide: 0,
      autoPlayInterval: null
    }
  },
  
  async created() {
    await this.getBanners()
  },
  
  methods: {
    async getBanners() {
      try {
        const response = await this.$api.novels.getBanners(this.page)
        this.banners = response || []
      } catch (error) {
        console.error('获取Banner数据失败:', error)
        this.banners = []
      }
    },
    
    navigateToBanner(banner) {
      if (banner.link_url_pc && banner.link_url_pc !== "None") {
        this.$router.push(banner.link_url_pc)
      }
    },
    
    // 设置轮播图当前显示的slide
    setSlide(index) {
      this.currentSlide = index
    },
    
    // 切换到上一张轮播图
    prevSlide() {
      if (this.currentSlide > 0) {
        this.currentSlide--
      } else {
        // 循环到最后一张
        this.currentSlide = this.banners.length - 1
      }
    },
    
    // 切换到下一张轮播图
    nextSlide() {
      if (this.currentSlide < this.banners.length - 1) {
        this.currentSlide++
      } else {
        // 循环到第一张
        this.currentSlide = 0
      }
    },
    
    // 启动自动播放
    startAutoPlay() {
      // 确保仅在客户端执行，并且有至少两个轮播项目时才启动轮播
      if (!process.client || this.banners.length <= 1 || !this.autoplay) return
      
      this.stopAutoPlay()
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide()
      }, this.interval)
    },
    
    // 停止自动播放
    stopAutoPlay() {
      if (process.client && this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval)
        this.autoPlayInterval = null
      }
    }
  },
  
  mounted() {
    // 仅在客户端执行
    if (process.client) {
      // 启动轮播图自动播放
      this.startAutoPlay()
    }
  },
  
  beforeDestroy() {
    // 组件销毁前清除定时器
    this.stopAutoPlay()
  }
}
</script>

<style lang="scss" scoped>
// 变量定义
$primary-color: #947358;
$secondary-color: #704C35;
$text-color: #333;
$border-color: #eee;
$border-light: #f5f5f5;
$background-color: #fff;

.banner-container {
  width: 100%;
  margin: 10px 0;
  
  .banner-swiper {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    @media (max-width: 768px) {
      height: 150px;
    }
  }
  
  .banner-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    transition: transform 0.5s ease;
  }
  
  .banner-item {
    flex: 0 0 100%;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    
    .banner-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    &:hover .banner-image {
      transform: scale(1.05);
    }
    
    .banner-mask {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 15px 20px;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
      
      .banner-title {
        color: white;
        font-size: 16px;
        font-weight: bold;
        margin: 0;
      }
    }
  }
  
  .banner-pagination {
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    z-index: 10;
    
    .pagination-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      transition: all 0.3s ease;
      
      &.active {
        background-color: white;
        transform: scale(1.2);
      }
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.8);
      }
    }
  }
  
  .banner-button-prev,
  .banner-button-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 10;
    
    .arrow {
      color: white;
      font-size: 18px;
      font-weight: bold;
    }
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.7);
    }
  }
  
  .banner-button-prev {
    left: 10px;
  }
  
  .banner-button-next {
    right: 10px;
  }
  
  .banner-swiper:hover {
    .banner-button-prev,
    .banner-button-next {
      opacity: 1;
    }
  }
}
</style>