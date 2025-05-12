<template>
  <div class="banner-section">
    <div class="swiper-container" 
      @mouseenter="stopAutoPlay" 
      @mouseleave="startAutoPlay"
      v-if="chartList.length > 0">
      <div class="swiper-wrapper" 
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div class="swiper-slide" 
          v-for="(item, index) in chartList" 
          :key="index"
          @click="roulousChartClicked(item)">
          <div class="slide-content">
            <img :src="item.img" :alt="item.title">
            <div class="slide-info">
              <h3>{{ item.title }}</h3>
              <p>{{ item.Subtitle }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 分页指示器 -->
      <div class="swiper-pagination" v-if="chartList.length > 1">
        <span
          v-for="(_, index) in chartList"
          :key="index"
          :class="['pagination-bullet', { active: currentSlide === index }]"
          @click.stop="setSlide(index)"
        ></span>
      </div>
      
      <!-- 导航按钮 -->
      <div class="swiper-button-prev" @click.stop="prevSlide" v-if="chartList.length > 1">
        <span class="arrow">&#10094;</span>
      </div>
      <div class="swiper-button-next" @click.stop="nextSlide" v-if="chartList.length > 1">
        <span class="arrow">&#10095;</span>
      </div>
    </div>
    
    <div class="nav-section">
      <div class="nav-button" @click="navBarJump('标签')">
        <img src="~/assets/swiperNavIcons/category.png" alt="标签">
        <span>标签</span>
      </div>
      <div class="nav-button" @click="navBarJump('活动')">
        <img src="~/assets/swiperNavIcons/activity.png" alt="活动">
        <span>活动</span>
      </div>
      <div class="nav-button" @click="navBarJump('排行')">
        <img src="~/assets/swiperNavIcons/ranks.png" alt="排行">
        <span>排行</span>
      </div>
      <div class="nav-button" @click="navBarJump('推荐')">
        <img src="~/assets/swiperNavIcons/recommands.png" alt="推荐">
        <span>推荐</span>
      </div>
      <div class="nav-button" @click="navBarJump('完结')">
        <img src="~/assets/swiperNavIcons/finish.png" alt="完结">
        <span>完结</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BannerSwiper',
  
  props: {
    chartList: {
      type: Array,
      default: () => []
    }
  },
  
  data() {
    return {
      currentSlide: 0,
      autoPlayInterval: null
    }
  },
  
  methods: {
    // 轮播图点击事件处理
    roulousChartClicked(item) {
      if (item.navigate_to && item.navigate_to !== "None") {
        this.$router.push(item.navigate_to)
      }
    },
    
    // 导航栏点击事件处理
    navBarJump(section) {
      switch (section) {
        case "标签":
          this.$router.push('/tags')
          break
        case "活动":
          this.gotoCollections("干草块杯活动专辑")
          break
        case "排行":
          this.gotoCollections("原木力爆棚")
          break
        case "推荐":
          this.gotoCollections("原木力飙升")
          break
        case "完结":
          this.gotoCollections("完本经典")
          break
      }
    },
    
    // 前往专题集合页面
    gotoCollections(collectionTitle) {
      console.log('BannerSwiper准备跳转到集合页面:', collectionTitle)
      // 确保标题是字符串并且不为空
      if (!collectionTitle || typeof collectionTitle !== 'string') {
        console.error('无效的集合标题:', collectionTitle)
        return
      }
      
      try {
        const encodedTitle = encodeURIComponent(collectionTitle.trim())
        const url = `/read/collections?title=${encodedTitle}`
        console.log('跳转URL:', url)
        this.$router.push(url)
      } catch (error) {
        console.error('跳转集合页面失败:', error)
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
        this.currentSlide = this.chartList.length - 1
      }
    },
    
    // 切换到下一张轮播图
    nextSlide() {
      if (this.currentSlide < this.chartList.length - 1) {
        this.currentSlide++
      } else {
        // 循环到第一张
        this.currentSlide = 0
      }
    },
    
    // 启动自动播放
    startAutoPlay() {
      // 确保仅在客户端执行，并且有至少两个轮播项目时才启动轮播
      if (!process.client || this.chartList.length <= 1) return
      
      this.stopAutoPlay()
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide()
      }, 5000) // 5秒切换一次
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

// 混合器
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-section {
  background-color: $background-color;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  // margin-bottom: 20px;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  
  .swiper-container {
    position: relative;
    width: 100%;
    height: 280px;
    overflow: hidden;
    border-radius: 8px 8px 0 0;
    
    @media (max-width: 768px) {
      height: 220px;
    }
  }
  
  .swiper-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    transition: transform 0.5s ease;
  }
  
  .swiper-slide {
    flex: 0 0 100%;
    position: relative;
    cursor: pointer;
    
    .slide-content {
      position: relative;
      width: 100%;
      height: 100%;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .slide-info {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 15px;
        background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
        color: white;
        
        h3 {
          margin: 0 0 5px;
          font-size: 18px;
        }
        
        p {
          margin: 0;
          font-size: 14px;
          opacity: 0.8;
        }
      }
    }
  }
  
  .swiper-pagination {
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    z-index: 10;
    
    .pagination-bullet {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      transition: all 0.3s ease;
      
      &.active {
        background-color: white;
        transform: scale(1.2);
      }
    }
  }
  
  .swiper-button-prev,
  .swiper-button-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    background-color: rgba(214, 214, 214, 0.3);
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
      font-size: 20px;
    }
  }
  
  .swiper-button-prev {
    left: 10px;
  }
  
  .swiper-button-next {
    right: 10px;
  }
  
  .swiper-container:hover {
    .swiper-button-prev,
    .swiper-button-next {
      opacity: 1;
    }
  }
  
  .nav-section {
    display: flex;
    justify-content: space-around;
    padding: 15px 0;
    background: linear-gradient(180deg, white, #fcf9e4);
    border-radius: 0 0 8px 8px;
    
    .nav-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        transform: translateY(-3px);
      }
      
      img {
        width: 45px;
        height: 45px;
        object-fit: contain;
        margin-bottom: 8px;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
      }
      
      span {
        font-size: 14px;
        color: $text-color;
      }
    }
  }
}

// 动画
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 