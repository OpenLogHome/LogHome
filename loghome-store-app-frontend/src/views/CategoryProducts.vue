<template>
  <div class="category-products">

    <!-- 搜索和排序区域 -->
    <div class="search-sort-section">
      <div class="search-bar">
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="搜索商品..." 
          class="search-input"
          @input="handleSearchInput"
        />
        <button class="search-btn" @click="performSearch">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </div>
      
      <div class="sort-section">
        <select v-model="sortBy" @change="handleSort" class="sort-select">
          <option value="default">默认排序</option>
          <option value="price_asc">价格从低到高</option>
          <option value="price_desc">价格从高到低</option>
          <option value="name">按名称排序</option>
        </select>
      </div>
    </div>

    <!-- 商品网格 -->
    <div class="products-grid" v-if="!loading">
      <div 
        v-for="product in products" 
        :key="product.id" 
        class="product-card"
        @click="goToProductDetail(product.id)"
      >
        <div class="product-image">
          <img :src="getMainImage(product) || '/placeholder-product.jpg'" :alt="product.name" />
          <div class="product-badge" v-if="product.stock <= 0">售罄</div>
        </div>
        
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-description">{{ product.description }}</p>
          <div class="product-price">
            <span class="current-price">¥{{ product.price }}</span>
            <span v-if="product.original_price && product.original_price > product.price" class="original-price">
              ¥{{ product.original_price }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && products.length === 0" class="empty-state">
      <p>该分类下暂无商品</p>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="totalPages > 1">
      <button 
        @click="changePage(currentPage - 1)" 
        :disabled="currentPage <= 1"
        class="page-btn"
      >
        上一页
      </button>
      
      <span class="page-info">
        第 {{ currentPage }} 页，共 {{ totalPages }} 页
      </span>
      
      <button 
        @click="changePage(currentPage + 1)" 
        :disabled="currentPage >= totalPages"
        class="page-btn"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { productAPI, errorHandler } from '@/utils/api'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 响应式数据
const products = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const sortBy = ref('default')
const currentPage = ref(1)
const pageSize = ref(12)
const totalProducts = ref(0)
const categoryId = ref(route.params.id)
const categoryName = ref(route.query.name || '商品分类')

// 计算属性
const totalPages = computed(() => Math.ceil(totalProducts.value / pageSize.value))

// 方法
const fetchProducts = async () => {
  try {
    loading.value = true
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      search: searchKeyword.value,
      category: categoryId.value,
      sort: sortBy.value
    }
    
    const response = await productAPI.getProducts(params)

    console.log(response)
    
    if (response.code == 200) {
       products.value = response.data.products
       totalProducts.value = response.data.total
     } else {
      throw new Error(response.message || '获取商品列表失败')
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    errorHandler.handleError(error)
  } finally {
    loading.value = false
  }
}

const handleSearchInput = () => {
  // 实时搜索可以在这里添加防抖逻辑
}

const performSearch = () => {
  currentPage.value = 1
  fetchProducts()
}

const handleSearch = () => {
  // 顶栏搜索按钮点击
  performSearch()
}

const handleSort = () => {
  currentPage.value = 1
  fetchProducts()
}

const changePage = (page) => {
  currentPage.value = page
  fetchProducts()
}

const goBack = () => {
  router.go(-1)
}

const handleCustomerService = () => {
  console.log('客服')
}

const handleUser = () => {
  router.push('/user')
}

const handleCart = () => {
  router.push('/cart')
}

const goToProductDetail = (productId) => {
  router.push(`/product/${productId}`)
}

// 获取商品主图
const getMainImage = (product) => {
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0]
  }
  return product.image_url
}

// 生命周期
onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.category-products {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 20px;
}

/* 搜索和排序区域 */
.search-sort-section {
  margin-bottom: 30px;
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.search-bar {
  display: flex;
  flex: 1;
  min-width: 300px;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
}

.search-btn {
  padding: 12px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover {
  background-color: #0056b3;
}

.sort-section {
  display: flex;
  gap: 15px;
}

.sort-select {
  padding: 10px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
  min-width: 150px;
}

/* 商品网格样式 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255,0,0,0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.product-info {
  padding: 16px;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
}

.product-description {
  color: #C2A382;
  font-size: 14px;
  margin: 0 0 12px 0;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.current-price {
  font-size: 20px;
  font-weight: 600;
  color: #e74c3c;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  margin-left: 8px;
}

.loading {
  text-align: center;
  padding: 40px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
}

.page-btn {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.page-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.page-info {
  color: #666;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .category-products {
    padding: 15px 15px;
  }
  
  .search-sort-section {
    flex-direction: column;
    gap: 15px;
  }
  
  .search-bar {
    min-width: auto;
    width: 100%;
  }
  
  .sort-select {
    min-width: auto;
    width: 100%;
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .pagination {
    flex-direction: column;
    gap: 10px;
  }
  
  .category-title {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .top-bar-content {
    padding: 0 10px;
  }
  
  .top-bar-actions {
    gap: 10px;
  }
  
  .product-card {
    font-size: 14px;
  }
  
  .product-name {
    font-size: 16px;
  }
  
  .product-description {
    font-size: 12px;
  }
  
  .current-price {
    font-size: 18px;
  }
  
  .product-info {
    padding: 12px;
  }
  
  .product-image {
    height: 150px;
  }
}
</style>