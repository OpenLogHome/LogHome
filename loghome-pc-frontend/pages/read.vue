<template>
  <div class="read-page">
    <div class="page-header full-width">
      <h1 class="page-title">小说阅读</h1>
      <div class="filter-controls">
        <div class="search-bar">
          <input 
            type="text" 
            class="search-input" 
            v-model="keyword" 
            @input="onSearchInput" 
            @keyup.enter="submitSearch"
            placeholder="搜索书库或输入传送ID" 
          />
          <button class="search-button" @click="submitSearch">
            <i class="search-icon">🔍</i>
          </button>
        </div>
        <div class="filter-group">
          <select class="filter-select" v-model="selectedCategory" @change="filterNovels">
            <option value="">全部分类</option>
            <option v-for="tag in popularTags" :key="tag.tag_id" :value="tag.tag_id">{{ tag.tag_name }}</option>
          </select>
        </div>
        <div class="filter-group">
          <select class="filter-select" v-model="selectedSort" @change="filterNovels">
            <option value="latest">最新发布</option>
            <option value="popular">人气最高</option>
            <option value="rating">评分最高</option>
          </select>
        </div>
      </div>
    </div>

    <div class="banner-section full-width" v-if="keyword.length === 0">
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

    <div class="collection-cards full-width" v-if="keyword.length === 0">
      <div class="collection-card" v-for="(item, index) in safeCollections" :key="index">
        <div class="collection-header" @click="gotoCollections(item.collection_title)">
          <div class="collection-title">
            <h3>{{ item.collection_title }}</h3>
            <div class="light-line"></div>
            <img v-if="item.icon" :src="item.icon" :alt="item.collection_title" class="collection-icon">
          </div>
          <div class="more-button">
            <span>更多</span>
            <i class="right-icon">❯</i>
          </div>
        </div>
        
        <div class="novel-slide" v-if="item.collection_type === 'slide'">
          <div class="slide-wrapper">
            <div class="book-cover" v-for="novel in item.novels || []" :key="novel.novel_id" @click="readBook(novel.novel_id)">
              <div class="cover-image" :style="novel.picUrl ? `background-image: url(${novel.picUrl})` : `background-color: hsl(${novel.novel_id * 30 % 360}, 70%, 80%)`">
                <span class="novel-type" v-if="novel.novel_type">{{ novel.novel_type }}</span>
              </div>
              <div class="book-title">{{ novel.name }}</div>
            </div>
          </div>
        </div>
        
        <div class="novel-list" v-else-if="item.collection_type === 'cards'">
          <div class="list-wrapper">
            <nuxt-link class="book-card" v-for="novel in (item.novels || []).slice(0, 4)" :key="novel.novel_id" :to="`/novel/${novel.novel_id}`">
              <div class="book-cover">
                <img :src="novel.picUrl ? novel.picUrl + '?thumbnail=1' : '/static/user/defaultCover.jpg'" :alt="novel.name" 
                     :onerror="`this.onerror=null;this.src='/static/user/defaultCover.jpg'`">
              </div>
              <div class="book-info">
                <h4 class="book-title">
                  {{ novel.name }}
                  <span class="book-tag" v-if="novel.novel_type === 'world'">世界设定</span>
                </h4>
                <div class="book-author">
                  <img :src="novel.avatar_url || '/static/user/defaultAvatar.jpg'" alt="作者头像" class="author-avatar"
                       :onerror="`this.onerror=null;this.src='/static/user/defaultAvatar.jpg'`">
                  <span class="author-name">{{ novel.user_name || novel.author_name || '佚名' }}</span>
                </div>
                <p class="book-desc">{{ truncateText(novel.content, 80) }}</p>
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <div class="novels-container" :class="{'search-active': keyword.length > 0}">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在加载小说列表...</p>
      </div>

      <div v-else-if="(keyword.length > 0 && searchBooks.length === 0) || 
                      (keyword.length === 0 && filteredNovels.length === 0)" class="empty-state">
        <p>没有找到符合条件的小说</p>
      </div>

      <div v-else-if="keyword.length > 0" class="search-results">
        <div class="book-item" v-for="novel in searchBooks" :key="novel.novel_id">
          <nuxt-link :to="`/novel/${novel.novel_id}`" class="book-link">
            <div class="book-cover">
              <img :src="novel.picUrl ? novel.picUrl + '?thumbnail=1' : '/static/user/defaultCover.jpg'" :alt="novel.name"
                   :onerror="`this.onerror=null;this.src='/static/user/defaultCover.jpg'`">
            </div>
            <div class="book-info">
              <h3 class="book-title">{{ novel.name }}</h3>
              <div class="book-author">
                <img :src="novel.auther_avatar || '/static/user/defaultAvatar.jpg'" alt="作者头像" class="author-avatar"
                     :onerror="`this.onerror=null;this.src='/static/user/defaultAvatar.jpg'`">
                <span class="author-name">{{ novel.author_name || '佚名' }}</span>
              </div>
              <p class="book-desc">{{ truncateText(novel.content, 100) }}</p>
            </div>
          </nuxt-link>
        </div>
      </div>

      <div v-else class="novels-grid">
        <div class="novel-card" v-for="novel in filteredNovels" :key="novel.novel_id">
          <div class="novel-cover" v-if="novel.picUrl" :style="`background-image: url(${novel.picUrl})`">
            <span class="novel-category" v-if="novel.novel_type">{{ novel.novel_type }}</span>
          </div>
          <div class="novel-cover" v-else :style="`background-color: hsl(${novel.novel_id * 30 % 360}, 70%, 80%)`">
            <span class="novel-category" v-if="novel.novel_type">{{ novel.novel_type }}</span>
          </div>
          <div class="novel-info">
            <h3 class="novel-title">{{ novel.name }}</h3>
            <p class="novel-author">{{ novel.author_name || '佚名' }}</p>
            <p class="novel-desc">{{ truncateText(novel.content, 80) }}</p>
            <div class="novel-stats">
              <span title="阅读量">👁️ {{ formatNumber(novel.clicks || 0) }}</span>
              <span title="点赞数">❤️ {{ formatNumber(novel.nices || 0) }}</span>
              <span title="字数">📃 {{ formatNumber(novel.text_count || 0) }}字</span>
            </div>
            <nuxt-link :to="`/novel/${novel.novel_id}`" class="read-button">开始阅读</nuxt-link>
          </div>
        </div>
      </div>

      <div class="pagination" v-if="totalPages > 1">
        <button class="pagination-button" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">&lt;</button>
        <button 
          v-for="page in displayedPages" 
          :key="page" 
          class="pagination-button" 
          :class="{ active: currentPage === page }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        <span v-if="showEllipsisEnd" class="pagination-ellipsis">...</span>
        <button v-if="showLastPage" class="pagination-button" @click="changePage(totalPages)">{{ totalPages }}</button>
        <button class="pagination-button" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">&gt;</button>
      </div>
    </div>

    <div class="sidebar">
      <div class="sidebar-section">
        <h3 class="sidebar-title">热门榜单</h3>
        <ul class="ranking-list">
          <li class="ranking-item" v-for="(novel, index) in topNovels || []" :key="novel.novel_id" :class="`rank-${index + 1}`">
            <span class="ranking-number">{{ index + 1 }}</span>
            <div class="ranking-info">
              <h4 class="ranking-title">{{ novel.name }}</h4>
              <p class="ranking-author">{{ novel.author_name || '佚名' }}</p>
            </div>
            <span class="ranking-stat">{{ formatNumber(novel.clicks || 0) }}浏览</span>
          </li>
        </ul>
      </div>

      <div class="sidebar-section">
        <h3 class="sidebar-title">热门标签</h3>
        <div class="tag-cloud">
          <nuxt-link 
            v-for="tag in (popularTags || []).slice(0, 12)" 
            :key="tag.tag_id" 
            :to="`/tag/${tag.tag_id}`" 
            class="tag-link" 
            :style="`font-size: ${12 + Math.min(tag.count / 5, 8)}px`"
          >
            {{ tag.tag_name }}
          </nuxt-link>
        </div>
      </div>

      <div class="sidebar-section">
        <h3 class="sidebar-title">编辑推荐</h3>
        <div class="editor-picks">
          <div class="pick-item" v-for="novel in editorPicks || []" :key="novel.novel_id">
            <div class="pick-cover" v-if="novel.cover_url" :style="`background-image: url(${novel.cover_url})`"></div>
            <div class="pick-cover" v-else :style="`background-color: hsl(${novel.novel_id * 90 % 360}, 70%, 80%)`"></div>
            <div class="pick-info">
              <h4 class="pick-title">{{ novel.name }}</h4>
              <p class="pick-desc">{{ truncateText(novel.content, 40) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: '小说阅读 - 原木社区',
      link: [
        { rel: 'stylesheet', href: '//at.alicdn.com/t/font_1234567_abcdefg.css' } // 请替换为您的实际iconfont链接
      ]
    }
  },
  // 监听URL查询参数变化，当这些参数变化时重新执行asyncData
  watchQuery: ['category', 'sort', 'page', 'search'],
  async asyncData({ $api, query }) {
    try {
      // 从查询参数中获取筛选和分页参数
      const selectedCategory = query.category || ''
      const selectedSort = query.sort || 'latest'
      const currentPage = parseInt(query.page, 10) || 1
      const keyword = query.search || ''
      
      // 根据是否有搜索关键词决定获取什么数据
      let novels = []
      let searchBooks = []
      
      if (keyword) {
        // 如果有搜索关键词，优先获取搜索结果
        searchBooks = await $api.novels.searchNovels(keyword) || []
      } else {
        // 获取所有小说列表
        novels = await $api.novels.getAllNovels() || []
      }
      
      // 并行获取其他基本数据
      const [tags, chartData, collections] = await Promise.all([
        $api.novels.getAllTags(),
        $api.novels.getLibraryRoulousChart(),
        $api.novels.getLibraryCollections()
      ])
      
      // 如果选择了分类标签，获取该标签的小说
      let novelsByTag = {}
      if (selectedCategory) {
        try {
          const tagNovels = await $api.novels.getTagCollections(selectedCategory)
          novelsByTag[selectedCategory] = tagNovels || []
        } catch (error) {
          console.error(`获取标签 ${selectedCategory} 关联小说失败`, error)
          novelsByTag[selectedCategory] = []
        }
      }
      
      // 处理轮播图数据
      const chartList = []
      if (chartData && Array.isArray(chartData)) {
        for (const item of chartData) {
          if (item.isValid === 1) {
            chartList.push({
              img: item.image,
              title: item.title,
              Subtitle: item.name,
              navigate_to: item.navigate_to
            })
          }
        }
      }
      
      // 处理集合数据 - 通过Promise.all并行处理所有集合的小说获取
      const processedCollections = collections || []
      const collectionNovelsPromises = processedCollections.map(collection => 
        $api.novels.getCollectionNovels(collection.collection_title, 1, 10)
          .then(novels => ({ collection_title: collection.collection_title, novels: novels || [] }))
          .catch(error => {
            console.error(`获取集合 ${collection.collection_title} 的小说失败`, error)
            return { collection_title: collection.collection_title, novels: [] }
          })
      )
      
      const collectionResults = await Promise.all(collectionNovelsPromises)
      
      // 将获取到的小说数组分配给对应的集合
      collectionResults.forEach(result => {
        const collection = processedCollections.find(c => c.collection_title === result.collection_title)
        if (collection) {
          collection.novels = result.novels
        }
      })
      
      return {
        novels,
        tags: tags || [],
        chartList,
        collections: processedCollections,
        selectedCategory,
        selectedSort,
        currentPage,
        keyword,
        searchBooks,
        novelsByTag,
        loading: false
      }
    } catch (error) {
      console.error('获取数据失败', error)
      return {
        novels: [],
        tags: [],
        chartList: [],
        collections: [],
        selectedCategory: '',
        selectedSort: 'latest',
        currentPage: 1,
        keyword: '',
        searchBooks: [],
        novelsByTag: {},
        loading: false
      }
    }
  },
  data() {
    return {
      // 筛选和分页
      selectedCategory: '',
      selectedSort: 'latest',
      currentPage: 1,
      pageSize: 12,
      
      // 数据状态
      loading: true, // 初始加载状态为true，asyncData完成后会设置为false
      novels: [],
      tags: [],
      
      // 缓存数据
      novelsByTag: {},
      
      // 搜索相关
      keyword: '',
      searchBooks: [],
      searchTimer: null,
      
      // 轮播图相关
      chartList: [],
      currentSlide: 0,
      autoPlayInterval: null,
      
      // 专题集合
      collections: [],

      // 错误状态
      hasError: false,
      errorMessage: ''
    }
  },
  computed: {
    // 根据筛选条件过滤后的小说列表
    filteredNovels() {
      let result = [...this.novels]
      
      // 如果选择了分类标签
      if (this.selectedCategory) {
        // 如果已经缓存了该标签的小说
        if (this.novelsByTag[this.selectedCategory]) {
          result = this.novelsByTag[this.selectedCategory]
        } else {
          result = result.filter(novel => {
            // 这里简化处理，实际应该通过标签关联查询
            return novel.novel_type && novel.novel_type.includes(this.selectedCategory)
          })
        }
      }
      
      // 根据排序方式排序
      if (this.selectedSort === 'latest') {
        result.sort((a, b) => new Date(b.update_time || 0) - new Date(a.update_time || 0))
      } else if (this.selectedSort === 'popular') {
        result.sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
      } else if (this.selectedSort === 'rating') {
        result.sort((a, b) => (b.nices || 0) - (a.nices || 0))
      }
      
      // 分页处理
      const startIndex = (this.currentPage - 1) * this.pageSize
      const endIndex = startIndex + this.pageSize
      
      return result.slice(startIndex, endIndex)
    },
    
    // 总页数
    totalPages() {
      const filteredCount = this.selectedCategory ? 
        (this.novelsByTag[this.selectedCategory]?.length || 0) : 
        this.novels.length
      
      return Math.ceil(filteredCount / this.pageSize)
    },
    
    // 显示的页码范围
    displayedPages() {
      if (this.totalPages <= 5) {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1)
      }
      
      if (this.currentPage <= 3) {
        return [1, 2, 3, 4, 5]
      }
      
      if (this.currentPage >= this.totalPages - 2) {
        return Array.from({ length: 5 }, (_, i) => this.totalPages - 4 + i)
      }
      
      return [
        this.currentPage - 2,
        this.currentPage - 1,
        this.currentPage,
        this.currentPage + 1,
        this.currentPage + 2
      ]
    },
    
    // 是否显示末尾省略号
    showEllipsisEnd() {
      return this.totalPages > 5 && this.currentPage < this.totalPages - 2
    },
    
    // 是否显示最后一页按钮
    showLastPage() {
      return this.totalPages > 5 && this.currentPage < this.totalPages - 2
    },
    
    // 热门小说（点击量排序前5）
    topNovels() {
      if (!this.novels || !this.novels.length) return []
      return [...this.novels]
        .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
        .slice(0, 5)
    },
    
    // 编辑推荐（随机推荐3本）
    editorPicks() {
      if (!this.novels || !this.novels.length) return []
      // 这里模拟编辑推荐，实际可能需要后端提供或基于特定算法
      const shuffled = [...this.novels].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, 3)
    },
    
    // 热门标签（按关联小说数量排序）
    popularTags() {
      if (!this.tags || !this.tags.length) return []
      return [...this.tags].sort((a, b) => (b.count || 0) - (a.count || 0))
    },
    
    // collections数组
    safeCollections() {
      return this.collections || []
    }
  },
  methods: {
    // 获取所有小说
    async fetchNovels() {
      this.loading = true
      try {
        const novels = await this.$api.novels.getAllNovels()
        this.novels = novels || []
      } catch (error) {
        console.error('获取小说列表失败', error)
      } finally {
        this.loading = false
      }
    },
    
    // 获取所有标签
    async fetchTags() {
      try {
        const tags = await this.$api.novels.getAllTags()
        this.tags = tags || []
      } catch (error) {
        console.error('获取标签列表失败', error)
      }
    },
    
    // 获取标签关联的小说
    async fetchNovelsByTag(tagId) {
      if (this.novelsByTag[tagId]) return
      
      try {
        const novels = await this.$api.novels.getTagCollections(tagId)
        this.novelsByTag[tagId] = novels || []
      } catch (error) {
        console.error(`获取标签 ${tagId} 关联小说失败`, error)
        this.novelsByTag[tagId] = []
      }
    },
    
    // 筛选小说
    async filterNovels() {
      // 通过修改URL查询参数触发asyncData重新加载
      this.$router.push({
        query: {
          ...this.$route.query,
          category: this.selectedCategory || undefined,
          sort: this.selectedSort
        }
      })
    },
    
    // 更改页码
    changePage(page) {
      if (page < 1 || page > this.totalPages) return
      
      // 通过修改URL查询参数触发asyncData重新加载
      this.$router.push({
        query: {
          ...this.$route.query,
          page
        }
      })
      
      // 滚动到顶部
      window.scrollTo(0, 0)
    },
    
    // 格式化数字（大于1000显示为1k）
    formatNumber(num) {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万'
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
      }
      return num
    },
    
    // 截断文本
    truncateText(text, length) {
      if (!text) return '暂无简介'
      return text.length > length ? text.substring(0, length) + '...' : text
    },
    
    // 搜索小说 - 更新搜索输入不触发路由更新
    onSearchInput() {
      // 在输入时不立即触发路由变更，只在用户点击搜索或按回车键时触发
    },

    // 提交搜索
    submitSearch() {
      clearTimeout(this.searchTimer)
      this.$router.push({
        query: {
          search: this.keyword.trim() || undefined
        }
      })
    },
    
    // 获取轮播图数据
    async fetchChartList() {
      try {
        // 使用api服务而不是直接调用axios
        const chartData = await this.$api.novels.getLibraryRoulousChart()
        this.chartList = []
        
        // 处理轮播图数据格式，与app端保持一致
        for (const item of chartData) {
          if (item.isValid === 1) {
            this.chartList.push({
              img: item.image,
              title: item.title,
              Subtitle: item.name,
              navigate_to: item.navigate_to
            })
          }
        }
        
        // 数据加载成功后启动自动播放
        this.$nextTick(() => {
          this.startAutoPlay()
        })
      } catch (error) {
        console.error('获取轮播图数据失败:', error)
      }
    },
    
    // 获取专题集合数据
    async fetchCollections() {
      try {
        // 获取所有推荐集合
        this.collections = await this.$api.novels.getLibraryCollections() || []
        
        // 确保每个集合都有novels初始属性
        this.collections.forEach(collection => {
          if (!collection.novels) {
            this.$set(collection, 'novels', [])
          }
        })
        
        // 获取每个集合中的小说
        for (const collection of this.collections) {
          try {
            const novels = await this.$api.novels.getCollectionNovels(
              collection.collection_title, 
              1, 
              10
            )
            this.$set(collection, 'novels', novels || [])
          } catch (error) {
            console.error(`获取集合 ${collection.collection_title} 的小说失败`, error)
            this.$set(collection, 'novels', [])
          }
        }
      } catch (error) {
        console.error('获取推荐集合失败', error)
        this.collections = []
      }
    },
    
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
      this.$router.push(`/collections?title=${encodeURIComponent(collectionTitle)}`)
    },
    
    // 阅读小说
    readBook(novelId) {
      if (novelId) {
        this.$router.push(`/novel/${novelId}`)
      }
    },
    
    // 页面刷新 - 仅在客户端执行的刷新
    async refreshClientData() {
      try {
        // 如果需要刷新客户端数据，可以在这里执行
        // 例如用户交互后需要重新获取的数据
      } catch (error) {
        console.error('刷新客户端数据失败', error)
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
  },
  async fetch() {
    // fetch钩子在客户端导航时被调用，用于处理错误或数据刷新
    if (this.$fetchState.pending || this.$fetchState.error) {
      this.loading = true
    } else {
      this.loading = false
    }
  },
  watch: {
    // 监听URL查询参数变化，更新本地状态
    '$route.query': {
      handler(newQuery) {
        this.selectedCategory = newQuery.category || ''
        this.selectedSort = newQuery.sort || 'latest'
        this.currentPage = parseInt(newQuery.page, 10) || 1
        this.keyword = newQuery.search || ''
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
// 变量定义
$primary-color: #947358;
$secondary-color: #704C35;
$text-color: #333;
$text-light: #666;
$text-lighter: #888;
$border-color: #eee;
$border-light: #f5f5f5;
$background-color: #fff;
$error-color: #ff4d4f;
$success-color: #52c41a;
$warning-color: #faad14;

// 全局样式
* {
  box-sizing: border-box;
}

img {
  max-width: 100%;
}

// 混合器
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin button-base {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

@mixin card-hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

@mixin loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba($primary-color, 0.2);
  border-top-color: $primary-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

// 动画
@keyframes spin {
  to { transform: rotate(360deg); }
}

.read-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  grid-column-gap: 30px;
  grid-row-gap: 20px;
  grid-template-areas: 
    "header header"
    "banner sidebar"
    "collections sidebar"
    "content sidebar";
  
  @media (max-width: 992px) {
    grid-template-columns: minmax(0, 1fr);
    padding: 10px;
    grid-template-areas: 
      "header"
      "banner"
      "sidebar"
      "collections"
      "content";
  }
}

.full-width {
  grid-column: 1 / -1;
}

.page-header {
  grid-area: header;
  margin-bottom: 20px;
  
  .page-title {
    font-size: 24px;
    margin-bottom: 15px;
    color: $secondary-color;
  }
  
  .filter-controls {
    @include flex-between;
    flex-wrap: wrap;
    gap: 10px;
    
    .search-bar {
      position: relative;
      flex: 1;
      max-width: 400px;
      
      .search-input {
        width: 100%;
        padding: 8px 40px 8px 12px;
        border: 1px solid $border-color;
        border-radius: 4px;
        font-size: 14px;
        
        &:focus {
          outline: none;
          border-color: $primary-color;
        }
      }
      
      .search-button {
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        padding: 5px;
        
        .search-icon {
          font-style: normal;
          color: $text-lighter;
        }
      }
    }
    
    @media (max-width: 576px) {
      flex-direction: column;
      align-items: flex-start;
      
      .search-bar {
        max-width: 100%;
        width: 100%;
        margin-bottom: 10px;
      }
    }
    
    .filter-group {
      margin-bottom: 10px;
      
      @media (max-width: 576px) {
        width: 100%;
      }
      
      .filter-select {
        padding: 8px 12px;
        border: 1px solid $border-color;
        border-radius: 4px;
        background-color: $background-color;
        color: $text-color;
        font-size: 14px;
        min-width: 150px;
        
        @media (max-width: 576px) {
          width: 100%;
        }
        
        &:focus {
          outline: none;
          border-color: $primary-color;
        }
      }
    }
  }
}

.banner-section {
  grid-area: banner;
  background-color: $background-color;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
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
    background-color: rgba(255, 255, 255, 0.3);
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

.collection-cards {
  grid-area: collections;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  
  .collection-card {
    background-color: $background-color;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    width: 100%;
    max-width: 100%;
    
    .collection-header {
      @include flex-between;
      padding: 15px;
      border-bottom: 1px solid $border-light;
      cursor: pointer;
      transition: background-color 0.2s;
      
      &:hover {
        background-color: $border-light;
      }
      
      .collection-title {
        display: flex;
        align-items: center;
        position: relative;
        
        h3 {
          font-size: 18px;
          margin: 0;
          color: $text-color;
          position: relative;
          z-index: 1;
        }
        
        .light-line {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 8px;
          width: 100%;
          background-color: rgba($success-color, 0.3);
          z-index: 0;
        }
        
        .collection-icon {
          width: 24px;
          height: 24px;
          margin-left: 10px;
          border-radius: 4px;
        }
      }
      
      .more-button {
        display: flex;
        align-items: center;
        color: $primary-color;
        font-size: 14px;
        
        .right-icon {
          font-style: normal;
          margin-left: 5px;
        }
      }
    }
    
    .novel-slide {
      padding: 15px;
      width: 100%;
      max-width: 100%;
      overflow: hidden;
      
      .slide-wrapper {
        display: flex;
        overflow-x: auto;
        gap: 15px;
        padding-bottom: 10px;
        width: 100%;
        max-width: 100%;
        
        &::-webkit-scrollbar {
          height: 6px;
        }
        
        &::-webkit-scrollbar-track {
          background: $border-light;
          border-radius: 10px;
        }
        
        &::-webkit-scrollbar-thumb {
          background: $primary-color;
          border-radius: 10px;
        }
        
        .book-cover {
          flex: 0 0 auto;
          width: 120px;
          min-width: 120px;
          max-width: 120px;
          cursor: pointer;
          transition: transform 0.3s;
          
          &:hover {
            transform: translateY(-5px);
          }
          
          .cover-image {
            height: 160px;
            border-radius: 6px;
            background-size: cover;
            background-position: center;
            position: relative;
            margin-bottom: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            
            .novel-type {
              position: absolute;
              top: 5px;
              right: 5px;
              background-color: rgba($primary-color, 0.8);
              color: white;
              padding: 2px 6px;
              border-radius: 10px;
              font-size: 12px;
            }
          }
          
          .book-title {
            font-size: 14px;
            color: $text-color;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: center;
          }
        }
      }
    }
    
    .novel-list {
      padding: 15px;
      
      .list-wrapper {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 15px;
        max-width: 100%;
        
        @media (max-width: 1200px) {
          grid-template-columns: 1fr;
        }
        
        .book-card {
          display: flex;
          padding: 10px;
          border-radius: 6px;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s;
          max-width: 100%;
          overflow: hidden;
          
          &:hover {
            background-color: $border-light;
          }
          
          .book-cover {
            width: 80px;
            min-width: 80px;
            height: 120px;
            flex-shrink: 0;
            margin-right: 15px;
            
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 4px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            }
          }
          
          .book-info {
            flex: 1;
            overflow: hidden;
            min-width: 0;
            
            .book-title {
              font-size: 16px;
              font-weight: bold;
              margin: 0 0 8px;
              color: $text-color;
              display: flex;
              align-items: center;
              overflow: hidden;
              
              // 文本溢出时显示省略号
              white-space: nowrap;
              text-overflow: ellipsis;
              
              .book-tag {
                font-size: 12px;
                background-color: $warning-color;
                color: white;
                padding: 2px 6px;
                border-radius: 10px;
                margin-left: 8px;
                font-weight: normal;
                flex-shrink: 0;
              }
            }
            
            .book-author {
              display: flex;
              align-items: center;
              margin-bottom: 8px;
              
              .author-avatar {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                margin-right: 8px;
                flex-shrink: 0;
              }
              
              .author-name {
                font-size: 14px;
                color: $primary-color;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
            
            .book-desc {
              font-size: 13px;
              color: $text-light;
              margin: 0;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
              line-height: 1.5;
              max-width: 100%;
            }
          }
        }
      }
    }
  }
}

.novels-container {
  grid-area: content;
  
  &.search-active {
    grid-column: 1 / -1;
  }
  
  .loading-container {
    @include flex-center;
    flex-direction: column;
    min-height: 300px;
    
    .loading-spinner {
      @include loading-spinner;
    }
  }
  
  .empty-state {
    @include flex-center;
    min-height: 300px;
    color: $text-lighter;
    font-style: italic;
  }
  
  .search-results {
    .book-item {
      background-color: $background-color;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 15px;
      transition: transform 0.3s, box-shadow 0.3s;
      
      &:hover {
        @include card-hover;
      }
      
      .book-link {
        display: flex;
        padding: 15px;
        text-decoration: none;
        color: inherit;
        
        .book-cover {
          width: 100px;
          height: 150px;
          flex-shrink: 0;
          margin-right: 20px;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 4px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          }
        }
        
        .book-info {
          flex: 1;
          
          .book-title {
            font-size: 18px;
            font-weight: bold;
            margin: 0 0 10px;
            color: $text-color;
          }
          
          .book-author {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            
            .author-avatar {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              margin-right: 10px;
            }
            
            .author-name {
              font-size: 14px;
              color: $primary-color;
            }
          }
          
          .book-desc {
            font-size: 14px;
            color: $text-light;
            line-height: 1.5;
            margin: 0;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
      }
    }
  }
  
  .novels-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    grid-gap: 20px;
    
    @media (max-width: 576px) {
      grid-template-columns: 1fr;
    }
    
    .novel-card {
      background-color: $background-color;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s, box-shadow 0.3s;
      display: flex;
      flex-direction: column;
      height: 100%;
      
      &:hover {
        @include card-hover;
      }
      
      .novel-cover {
        width: 100%;
        height: 160px;
        background-size: cover;
        background-position: center;
        position: relative;
        
        .novel-category {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: rgba($primary-color, 0.8);
          color: white;
          padding: 2px 8px;
          border-radius: 20px;
          font-size: 12px;
        }
      }
      
      .novel-info {
        padding: 15px;
        display: flex;
        flex-direction: column;
        flex: 1;
        
        .novel-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
          color: $text-color;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .novel-author {
          color: $primary-color;
          font-size: 14px;
          margin-bottom: 10px;
        }
        
        .novel-desc {
          color: $text-light;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 15px;
          height: 63px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          flex: 1;
        }
        
        .novel-stats {
          @include flex-between;
          margin-bottom: 15px;
          font-size: 12px;
          color: $text-lighter;
          
          span {
            display: inline-flex;
            align-items: center;
            margin-right: 8px;
            
            &:last-child {
              margin-right: 0;
            }
          }
        }
        
        .read-button {
          @include button-base;
          display: block;
          text-align: center;
          background-color: $primary-color;
          color: white;
          text-decoration: none;
          width: 100%;
          margin-top: auto;
          
          &:hover {
            background-color: darken($primary-color, 5%);
          }
        }
      }
    }
  }
  
  .pagination {
    @include flex-center;
    margin-top: 30px;
    flex-wrap: wrap;
    
    .pagination-button {
      min-width: 36px;
      height: 36px;
      border: 1px solid $border-color;
      background-color: $background-color;
      color: $text-color;
      margin: 5px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        border-color: $primary-color;
        color: $primary-color;
      }
      
      &.active {
        background-color: $primary-color;
        color: white;
        border-color: $primary-color;
      }
      
      &:disabled {
        color: $text-lighter;
        border-color: $border-color;
        cursor: not-allowed;
      }
    }
    
    .pagination-ellipsis {
      @include flex-center;
      min-width: 36px;
      height: 36px;
      color: $text-light;
      margin: 5px;
    }
  }
}

.sidebar {
  grid-area: sidebar;
  position: sticky;
  top: 20px;
  height: fit-content;
  
  .sidebar-section {
    background-color: $background-color;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    
    .sidebar-title {
      padding: 15px;
      margin: 0;
      background-color: $primary-color;
      color: white;
      font-size: 16px;
    }
    
    .ranking-list {
      list-style: none;
      padding: 0;
      margin: 0;
      
      .ranking-item {
        @include flex-between;
        padding: 12px 15px;
        border-bottom: 1px solid $border-light;
        
        &:last-child {
          border-bottom: none;
        }
        
        .ranking-number {
          width: 24px;
          height: 24px;
          @include flex-center;
          background-color: $primary-color;
          color: white;
          border-radius: 50%;
          font-size: 12px;
          margin-right: 10px;
          flex-shrink: 0;
        }
        
        &.rank-1 .ranking-number {
          background-color: #FF7043;
        }
        
        &.rank-2 .ranking-number {
          background-color: #FF9800;
        }
        
        &.rank-3 .ranking-number {
          background-color: #FFC107;
        }
        
        .ranking-info {
          flex: 1;
          overflow: hidden;
          
          .ranking-title {
            margin: 0 0 3px;
            font-size: 14px;
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .ranking-author {
            margin: 0;
            font-size: 12px;
            color: $text-light;
          }
        }
        
        .ranking-stat {
          font-size: 12px;
          color: $text-lighter;
          white-space: nowrap;
        }
      }
    }
    
    .tag-cloud {
      padding: 15px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .tag-link {
        display: inline-block;
        padding: 4px 10px;
        background-color: rgba($primary-color, 0.1);
        color: $primary-color;
        border-radius: 20px;
        text-decoration: none;
        transition: all 0.2s;
        
        &:hover {
          background-color: $primary-color;
          color: white;
        }
      }
    }
    
    .editor-picks {
      padding: 10px;
      
      .pick-item {
        display: flex;
        padding: 10px;
        border-bottom: 1px solid $border-light;
        
        &:last-child {
          border-bottom: none;
        }
        
        .pick-cover {
          width: 70px;
          height: 90px;
          flex-shrink: 0;
          background-size: cover;
          background-position: center;
          border-radius: 4px;
          margin-right: 10px;
        }
        
        .pick-info {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          
          .pick-title {
            margin: 0 0 5px;
            font-size: 14px;
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .pick-desc {
            margin: 0;
            font-size: 12px;
            color: $text-light;
            line-height: 1.4;
            height: 50px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }
}

// 媒体查询
@media (max-width: 992px) {
  .sidebar {
    margin-bottom: 30px;
  }
}

// 淡入淡出动画
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

// 对小屏幕进行优化
@media (max-width: 992px) {
  .collection-cards {
    overflow: hidden;
    width: 100%;
    
    .collection-card {
      width: 100%;
      max-width: 100%;
      overflow: hidden;
      
      .novel-slide {
        width: 100%;
        overflow: hidden;
      }
      
      .novel-list {
        .list-wrapper {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}
</style>