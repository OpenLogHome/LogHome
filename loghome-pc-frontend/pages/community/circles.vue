<template>
  <div class="circles-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">圈子广场</h1>
      <p class="page-subtitle">发现有趣的圈子，找到志同道合的朋友</p>
    </div>

    <!-- 搜索框 -->
    <div class="search-section">
      <div class="search-box">
        <input type="text" v-model="keyword" placeholder="搜索圈子名称或描述" class="search-input"
          @keyup.enter="searchCircles" />
        <button class="search-btn" @click="searchCircles">
          <i class="el-icon-search"></i>
        </button>
      </div>
      <button class="create-circle-btn" @click="openCreateCircle">
        <i class="el-icon-plus"></i>
        创建圈子
      </button>
    </div>

    <!-- 分类列表 -->
    <div class="circles-content" v-loading="loadingStatus === 'loading'">
      <div class="category-section" v-for="(category, index) in categories" :key="index">
        <div class="category-header">
          <h2 class="category-name">{{ category.name }}</h2>
          <span class="circle-count">{{ category.circle_count }}个圈子</span>
        </div>
        <div class="circles-grid">
          <div class="circle-card" v-for="(circle, circleIndex) in categoryCircles[category.category_id]"
            :key="circleIndex" @click="navigateToCircle(circle.circle_id)">
            <div class="circle-header">
              <img :src="circle.icon || '/default-avatar.png'" :alt="circle.name" class="circle-icon"
                @error="handleImageError" />
              <div class="circle-info">
                <div class="circle-name-row">
                  <h3 class="circle-name">{{ circle.name }}</h3>
                  <span class="official-tag" v-if="circle.is_official">官方</span>
                </div>
                <div class="circle-meta">
                  <span class="member-count">{{ circle.member_count }}人</span>
                  <span class="post-count">{{ circle.post_count }}帖子</span>
                </div>
              </div>
            </div>
            <p class="circle-description">{{ circle.description }}</p>
            <!-- <div class="circle-actions">
              <button 
                class="join-btn" 
                v-if="!circle.is_joined"
                @click.stop="joinCircle(circle)"
              >
                加入
              </button>
              <button class="joined-btn" v-else @click.stop>
                已加入
              </button>
            </div> -->
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-if="Object.keys(categoryCircles).length === 0 && loadingStatus !== 'loading'">
        <div class="empty-icon" aria-hidden="true"><SiteIcon name="inbox" /></div>
        <p class="empty-text">暂无圈子</p>
        <p class="empty-desc">成为第一个创建圈子的人吧！</p>
        <button class="create-first-btn" @click="openCreateCircle">创建圈子</button>
      </div>
    </div>
  </div>
</template>

<script>
import SiteIcon from '~/components/ui/SiteIcon.vue'
export default {
  components: { SiteIcon },
  name: 'CirclesPage',
  data() {
    return {
      categories: [],
      categoryCircles: {},
      keyword: '',
      loadingStatus: 'more',
      hasMore: true,
      isLoggedIn: false,
      myJoinedCircles: []
    }
  },
  async asyncData({ $api }) {
    try {
      // 获取圈子分类
      const categories = await $api.community.getCircleCategories()
      return {
        categories: categories || []
      }
    } catch (error) {
      console.error('获取圈子分类失败:', error)
      return {
        categories: []
      }
    }
  },
  mounted() {
    this.checkLoginStatus()
    this.initializeData()
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token')
      this.isLoggedIn = token && JSON.parse(token).tk
    },

    async initializeData() {
      if (this.categories.length === 0) {
        await this.loadCategories()
      }

      // 初始化每个分类的圈子列表
      this.categories.forEach(category => {
        this.$set(this.categoryCircles, category.category_id, [])
      })

      await Promise.all([
        this.loadCirclesByCategory(),
        this.isLoggedIn ? this.loadMyCircles() : Promise.resolve()
      ])
    },

    async loadCategories() {
      try {
        const categories = await this.$api.community.getCircleCategories()
        this.categories = categories || []
      } catch (error) {
        console.error('加载分类失败', error)
        this.$message.error('加载分类失败')
      }
    },

    async loadCirclesByCategory() {
      if (!this.hasMore || this.loadingStatus === 'loading') return

      this.loadingStatus = 'loading'
      try {
        const promises = this.categories.map(category => {
          return this.$api.community.getCirclesList({
            category_id: category.category_id,
            keyword: this.keyword
          })
        })

        const results = await Promise.all(promises)

        results.forEach((res, index) => {
          if (res && res.list) {
            const categoryId = this.categories[index].category_id
            // 处理圈子数据，标记已加入的圈子
            const circles = res.list.map(circle => {
              circle.is_joined = this.myJoinedCircles.some(c => c.circle_id === circle.circle_id)
              return circle
            })
            this.$set(this.categoryCircles, categoryId, circles)
            // 更新分类的圈子数量
            this.categories[index].circle_count = res.total
          }
        })

        this.loadingStatus = 'noMore'
      } catch (error) {
        console.error('加载圈子失败', error)
        this.loadingStatus = 'more'
        this.$message.error('加载圈子失败')
      }
    },

    async loadMyCircles() {
      try {
        const myCircles = await this.$api.community.getMyCircles()
        this.myJoinedCircles = myCircles || []

        // 更新所有分类中圈子的加入状态
        Object.keys(this.categoryCircles).forEach(categoryId => {
          this.categoryCircles[categoryId] = this.categoryCircles[categoryId].map(circle => {
            circle.is_joined = this.myJoinedCircles.some(c => c.circle_id === circle.circle_id)
            return circle
          })
        })
      } catch (error) {
        console.error('加载我的圈子失败', error)
      }
    },

    searchCircles() {
      this.loadCirclesByCategory()
    },

    navigateToCircle(circleId) {
      this.$router.push(`/community/circle/${circleId}`)
    },

    async joinCircle(circle) {
      if (!this.isLoggedIn) {
        this.$message.warning('请先登录')
        this.$router.push('/login')
        return
      }

      try {
        await this.$api.community.joinCircle({
          circle_id: circle.circle_id
        })

        // 更新圈子状态
        circle.is_joined = true
        circle.member_count++

        // 更新我的圈子列表
        this.myJoinedCircles.push(circle)

        this.$message.success('加入成功')
      } catch (error) {
        console.error('加入圈子失败', error)
        this.$message.error(error.message || '加入失败，请重试')
      }
    },

    // 打开圈子创建窗口
    async openCreateCircle() {
      if (!localStorage.getItem('token')) {
        this.$router.push("/login")
        return
      }
      await this.$openMobileWindow(`/pages/community/createCircle?id=${this.circleId}`, {
        title: '创建圈子',
        width: 500
      })
    },

    handleImageError(event) {
      event.target.src = '/default-avatar.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.circles-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;

  .page-title {
    font-size: 32px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
  }

  .page-subtitle {
    font-size: 16px;
    color: #666;
    margin: 0;
  }
}

.search-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;

  .search-box {
    display: flex;
    flex: 1;
    max-width: 500px;

    .search-input {
      flex: 1;
      height: 40px;
      padding: 0 15px;
      border: 1px solid #ddd;
      border-radius: 20px 0 0 20px;
      font-size: 14px;
      outline: none;

      &:focus {
        border-color: #EA7034;
      }
    }

    .search-btn {
      width: 50px;
      height: 40px;
      background-color: #EA7034;
      border: none;
      border-radius: 0 20px 20px 0;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background-color: #d65a2b;
      }
    }
  }

  .create-circle-btn {
    height: 40px;
    padding: 0 20px;
    background-color: #EA7034;
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;

    &:hover {
      background-color: #d65a2b;
    }

    .icon-plus {
      font-size: 16px;
    }
  }
}

.circles-content {
  .category-section {
    margin-bottom: 40px;

    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #EA7034;

      .category-name {
        font-size: 24px;
        font-weight: bold;
        color: #333;
        margin: 0;
      }

      .circle-count {
        font-size: 14px;
        color: #666;
      }
    }

    .circles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
  }
}

.circle-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .circle-header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 15px;

    .circle-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      object-fit: cover;
      margin-right: 15px;
      flex-shrink: 0;
    }

    .circle-info {
      flex: 1;
      min-width: 0;

      .circle-name-row {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        .circle-name {
          font-size: 18px;
          font-weight: bold;
          color: #333;
          margin: 0;
          margin-right: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .official-tag {
          font-size: 12px;
          color: white;
          background-color: #EA7034;
          padding: 2px 8px;
          border-radius: 10px;
          flex-shrink: 0;
        }
      }

      .circle-meta {
        display: flex;
        gap: 15px;

        .member-count,
        .post-count {
          font-size: 14px;
          color: #666;
        }
      }
    }
  }

  .circle-description {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 15px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .circle-actions {
    display: flex;
    justify-content: flex-end;

    .join-btn {
      padding: 8px 20px;
      background-color: #EA7034;
      color: white;
      border: none;
      border-radius: 20px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #d65a2b;
      }
    }

    .joined-btn {
      padding: 8px 20px;
      background-color: #f0f0f0;
      color: #999;
      border: none;
      border-radius: 20px;
      font-size: 14px;
      cursor: default;
    }
  }
}

.empty-state {
  text-align: center;
  padding: 80px 20px;

  .empty-icon {
    color: #947358;
    font-size: 48px;
    margin-bottom: 20px;
  }

  .empty-text {
    font-size: 20px;
    color: #666;
    margin-bottom: 10px;
  }

  .empty-desc {
    font-size: 14px;
    color: #999;
    margin-bottom: 30px;
  }

  .create-first-btn {
    padding: 12px 30px;
    background-color: #EA7034;
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      background-color: #d65a2b;
    }
  }
}

@media (max-width: 768px) {
  .circles-container {
    padding: 15px;
  }

  .search-section {
    flex-direction: column;
    gap: 15px;

    .search-box {
      max-width: none;
    }

    .create-circle-btn {
      width: 100%;
      justify-content: center;
    }
  }

  .circles-grid {
    grid-template-columns: 1fr !important;
  }

  .page-header .page-title {
    font-size: 24px;
  }
}
</style>