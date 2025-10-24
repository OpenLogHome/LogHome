<template>
  <div class="product-list">
    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <div class="search-bar">
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="搜索商品..." 
          class="search-input"
          @input="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </div>
      
      <div class="filter-section">
        <select v-model="selectedCategory" @change="handleCategoryChange" class="category-select">
          <option value="">所有分类</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        
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
          <img :src="product.image_url || '/placeholder-product.jpg'" :alt="product.name" />
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
          
          <div class="product-actions">
            <button 
              class="add-to-cart-btn" 
              @click.stop="addToCart(product)"
              :disabled="product.stock <= 0"
            >
              {{ product.stock <= 0 ? '售罄' : '加入购物车' }}
            </button>
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
      <p>暂无商品</p>
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
import { productAPI, cartAPI, errorHandler, formatter } from '@/utils/api'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const products = ref([])
const categories = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const selectedCategory = ref('')
const sortBy = ref('default')
const currentPage = ref(1)
const pageSize = ref(12)
const totalProducts = ref(0)

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
      category: selectedCategory.value,
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

const fetchCategories = async () => {
  try {
    const response = await productAPI.getCategories()
    
    if (response.code == 200) {
      categories.value = [
        { id: '', name: '全部分类' },
        ...response.data
      ]
    } else {
      console.error('获取分类失败:', response.message)
    }
  } catch (error) {
    console.error('获取分类失败:', error)
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchProducts()
}

const handleCategoryChange = () => {
  currentPage.value = 1
  fetchProducts()
}

const handleSort = () => {
  currentPage.value = 1
  fetchProducts()
}

const changePage = (page) => {
  currentPage.value = page
  fetchProducts()
}

const goToProductDetail = (productId) => {
  router.push(`/product/${productId}`)
}

const addToCart = async (product) => {
  try {
    const response = await cartAPI.addToCart({
      product_id: product.id,
      quantity: 1,
      specifications: product.specifications || {}
    })
    
    if (response.code == 200) {
      alert('已添加到购物车')
    } else {
      throw new Error(response.message || '添加到购物车失败')
    }
  } catch (error) {
    console.error('添加到购物车失败:', error)
    errorHandler.handleError(error)
  }
}

// 生命周期
onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>

<style scoped>
.product-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-filter-section {
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.search-bar {
  display: flex;
  margin-bottom: 15px;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.search-btn {
  padding: 12px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover {
  background: #0056b3;
}

.filter-section {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.category-select,
.sort-select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  min-width: 150px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
  color: #666;
  font-size: 14px;
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  margin-bottom: 16px;
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

.add-to-cart-btn {
  width: 100%;
  padding: 10px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #218838;
}

.add-to-cart-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
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
  .product-list {
    padding: 15px;
  }
  
  .search-filter-section {
    padding: 15px;
  }
  
  .filter-section {
    flex-direction: column;
  }
  
  .category-select,
  .sort-select {
    min-width: auto;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }
  
  .pagination {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .search-bar {
    flex-direction: column;
  }
}
</style>