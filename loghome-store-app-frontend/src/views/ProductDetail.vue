<template>
  <div class="product-detail">
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="product" class="product-content">

      <div class="product-main">
        <!-- 商品图片轮播 -->
        <div class="product-images">
          <div class="image-carousel" v-if="productImages.length > 0">
            <div 
              class="carousel-container"
              @touchstart="handleTouchStart"
              @touchmove="handleTouchMove"
              @touchend="handleTouchEnd"
              @mousedown="handleMouseDown"
              @mousemove="handleMouseMove"
              @mouseup="handleMouseUp"
              @mouseleave="handleMouseUp"
            >
              <div 
                class="carousel-track"
                :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }"
              >
                <div 
                  v-for="(image, index) in productImages" 
                  :key="index"
                  class="carousel-slide"
                >
                  <img :src="image" :alt="`${product.name} ${index + 1}`" />
                </div>
              </div>
              
              <!-- 导航按钮 -->
              <button 
                v-if="productImages.length > 1"
                class="carousel-btn prev-btn"
                @click="prevImage"
                :disabled="currentImageIndex === 0"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button 
                v-if="productImages.length > 1"
                class="carousel-btn next-btn"
                @click="nextImage"
                :disabled="currentImageIndex === productImages.length - 1"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            
            <!-- 指示器 -->
            <div class="carousel-indicators" v-if="productImages.length > 1">
              <button
                v-for="(image, index) in productImages"
                :key="index"
                :class="{ active: currentImageIndex === index }"
                @click="goToImage(index)"
                class="indicator"
              ></button>
            </div>
          </div>
        </div>

        <!-- 商品信息 -->
        <div class="product-info">
          <h1 class="product-title">{{ product.name }}</h1>
          
          <div class="product-price">
            <span class="current-price">¥{{ product.price }}</span>
            <span v-if="product.original_price && product.original_price > product.price" class="original-price">
              ¥{{ product.original_price }}
            </span>
          </div>

          <div class="product-stock">
            <span :class="{ 'out-of-stock': product.stock <= 0 }">
              {{ product.stock > 0 ? `库存：${product.stock}` : '暂时缺货' }}
            </span>
          </div>

          <!-- 商品规格选择 -->
          <div class="product-specs" v-if="product.specs && product.specs.length > 0">
            <div v-for="spec in product.specs" :key="spec.name" class="spec-group">
              <h4>{{ spec.name }}</h4>
              <div class="spec-options">
                <button
                  v-for="option in spec.options"
                  :key="option.value"
                  :class="{ active: selectedSpecs[spec.name] === option.value }"
                  @click="selectSpec(spec.name, option.value)"
                  class="spec-option"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- 数量选择 -->
          <div class="quantity-section">
            <label>数量：</label>
            <div class="quantity-controls">
              <button @click="decreaseQuantity" :disabled="quantity <= 1" class="qty-btn">-</button>
              <input v-model.number="quantity" type="number" min="1" :max="product.stock" class="qty-input" />
              <button @click="increaseQuantity" :disabled="quantity >= product.stock" class="qty-btn">+</button>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="product-actions">
            <button 
              class="add-to-cart-btn" 
              @click="addToCart"
              :disabled="product.stock <= 0"
            >
              {{ product.stock <= 0 ? '暂时缺货' : '加入购物车' }}
            </button>
            <button 
              class="buy-now-btn" 
              @click="buyNow"
              :disabled="product.stock <= 0"
            >
              {{ product.stock <= 0 ? '暂时缺货' : '立即购买' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 商品详情描述 -->
      <div class="product-description">
        <h3>商品详情</h3>
        <div class="description-content" v-html="product.description"></div>
      </div>

      <!-- 相关商品推荐 -->
      <div class="related-products" v-if="relatedProducts.length > 0">
        <h3>相关商品</h3>
        <div class="related-grid">
          <div 
            v-for="relatedProduct in relatedProducts" 
            :key="relatedProduct.id"
            class="related-item"
            @click="goToProduct(relatedProduct.id)"
          >
            <img :src="getMainImage(relatedProduct) || '/placeholder-product.jpg'" :alt="relatedProduct.name" />
            <h4>{{ relatedProduct.name }}</h4>
            <p class="related-price">¥{{ relatedProduct.price }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="error-state">
      <p>商品不存在或已下架</p>
      <button @click="goBack" class="back-btn">返回商品列表</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productAPI, cartAPI, errorHandler, formatter } from '@/utils/api'

const router = useRouter()
const route = useRoute()

// 响应式数据
const product = ref(null)
const relatedProducts = ref([])
const loading = ref(false)
const quantity = ref(1)
const selectedSpecs = ref({})
const currentImageIndex = ref(0)

// 触摸和拖拽相关
const touchStartX = ref(0)
const touchEndX = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)

// 计算属性
const productId = computed(() => route.params.id)

// 获取商品图片数组
const productImages = computed(() => {
  if (!product.value) return []
  
  if (product.value.images && Array.isArray(product.value.images) && product.value.images.length > 0) {
    return product.value.images
  }
  
  if (product.value.image_url) {
    return [product.value.image_url]
  }
  
  return ['/placeholder-product.jpg']
})

// 方法
// 获取商品详情
const fetchProductDetail = async () => {
  try {
    loading.value = true
    const response = await productAPI.getProductDetail(route.params.id)
    
    if (response.code == 200) {
      product.value = response.data
      currentImageIndex.value = 0
      
      // 初始化规格选择
      if (product.value.specs) {
        product.value.specs.forEach(spec => {
          if (spec.options && spec.options.length > 0) {
            selectedSpecs.value[spec.name] = spec.options[0].value
          }
        })
      }
      
      // 获取相关商品
      fetchRelatedProducts()
    } else {
      throw new Error(response.message || '获取商品详情失败')
    }
  } catch (error) {
    console.error('获取商品详情失败:', error)
    errorHandler.handleError(error)
  } finally {
    loading.value = false
  }
}

// 获取相关商品
const fetchRelatedProducts = async () => {
  try {
    const response = await productAPI.getRelatedProducts(route.params.id)
    
    if (response.code == 200) {
      relatedProducts.value = response.data
    } else {
      console.error('获取相关商品失败:', response.message)
    }
  } catch (error) {
    console.error('获取相关商品失败:', error)
  }
}

const selectSpec = (specName, value) => {
  selectedSpecs.value[specName] = value
}

const increaseQuantity = () => {
  if (quantity.value < product.value.stock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// 添加到购物车
const addToCart = async () => {
  try {
    const response = await cartAPI.addToCart({
      product_id: product.value.id,
      quantity: quantity.value,
      specifications: selectedSpecs.value
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

// 立即购买
const buyNow = async () => {
  try {
    // 先添加到购物车
    const response = await cartAPI.addToCart({
      product_id: product.value.id,
      quantity: quantity.value,
      specifications: selectedSpecs.value
    })
    
    if (response.code == 200) {
      // 跳转到购物车页面
      router.push('/cart')
    } else {
      throw new Error(response.message || '操作失败')
    }
  } catch (error) {
    console.error('立即购买失败:', error)
    errorHandler.handleError(error)
  }
}

const goBack = () => {
  router.back()
}

const goToProduct = (id) => {
  router.push(`/product/${id}`)
}

// 轮播图控制方法
const nextImage = () => {
  if (currentImageIndex.value < productImages.value.length - 1) {
    currentImageIndex.value++
  }
}

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const goToImage = (index) => {
  currentImageIndex.value = index
}

// 触摸事件处理
const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
}

const handleTouchMove = (e) => {
  e.preventDefault()
}

const handleTouchEnd = (e) => {
  touchEndX.value = e.changedTouches[0].clientX
  handleSwipe()
}

// 鼠标事件处理
const handleMouseDown = (e) => {
  isDragging.value = true
  dragStartX.value = e.clientX
}

const handleMouseMove = (e) => {
  if (!isDragging.value) return
  e.preventDefault()
}

const handleMouseUp = (e) => {
  if (!isDragging.value) return
  isDragging.value = false
  
  const dragEndX = e.clientX
  const dragDistance = dragStartX.value - dragEndX
  
  if (Math.abs(dragDistance) > 50) {
    if (dragDistance > 0) {
      nextImage()
    } else {
      prevImage()
    }
  }
}

// 滑动处理
const handleSwipe = () => {
  const swipeDistance = touchStartX.value - touchEndX.value
  
  if (Math.abs(swipeDistance) > 50) {
    if (swipeDistance > 0) {
      nextImage()
    } else {
      prevImage()
    }
  }
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
  fetchProductDetail()
})
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #e9ecef;
  color: #333;
}

.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.product-images {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 轮播图样式 */
.image-carousel {
  width: 100%;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
  cursor: grab;
}

.carousel-container:active {
  cursor: grabbing;
}

.carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.carousel-slide {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
}

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(4px);
}

.carousel-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.carousel-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: translateY(-50%) scale(0.9);
}

.carousel-btn svg {
  transition: transform 0.2s ease;
}

.carousel-btn:hover:not(:disabled) svg {
  transform: scale(1.1);
}

.prev-btn {
  left: 10px;
}

.next-btn {
  right: 10px;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 15px;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: #ddd;
  cursor: pointer;
  transition: background-color 0.2s;
}

.indicator.active {
  background: #007bff;
}

.indicator:hover {
  background: #999;
}

.indicator.active:hover {
  background: #0056b3;
}

.product-info {
  padding: 20px 0;
}

.product-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #333;
  line-height: 1.3;
}

.current-price {
  font-size: 32px;
  font-weight: 700;
  color: #e74c3c;
}

.original-price {
  font-size: 18px;
  color: #999;
  text-decoration: line-through;
  margin-left: 12px;
}

.product-stock {
  margin-bottom: 25px;
  font-size: 16px;
}

.out-of-stock {
  color: #e74c3c;
}

.product-specs {
  margin-bottom: 25px;
}

.spec-group {
  margin-bottom: 20px;
}

.spec-group h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
}

.spec-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.spec-option {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.spec-option:hover {
  border-color: #007bff;
}

.spec-option.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.quantity-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.qty-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #f8f9fa;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:hover:not(:disabled) {
  background: #e9ecef;
}

.qty-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.qty-input {
  width: 60px;
  height: 40px;
  border: none;
  text-align: center;
  font-size: 16px;
}

.product-actions {
  display: flex;
  gap: 15px;
}

.add-to-cart-btn,
.buy-now-btn {
  flex: 1;
  padding: 15px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-to-cart-btn {
  background: #28a745;
  color: white;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #218838;
}

.buy-now-btn {
  background: #007bff;
  color: white;
}

.buy-now-btn:hover:not(:disabled) {
  background: #0056b3;
}

.add-to-cart-btn:disabled,
.buy-now-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.product-description {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 40px;
}

.product-description h3 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
}

.description-content {
  line-height: 1.8;
  color: #333;
  font-size: 16px;
}

/* 富文本内容样式 */
.description-content h1,
.description-content h2,
.description-content h3,
.description-content h4,
.description-content h5,
.description-content h6 {
  margin: 24px 0 16px 0;
  color: #2c3e50;
  font-weight: 600;
}

.description-content h1 { font-size: 28px; }
.description-content h2 { font-size: 24px; }
.description-content h3 { font-size: 20px; }
.description-content h4 { font-size: 18px; }
.description-content h5 { font-size: 16px; }
.description-content h6 { font-size: 14px; }

.description-content p {
  margin: 16px 0;
  line-height: 1.8;
}

.description-content ul,
.description-content ol {
  margin: 16px 0;
  padding-left: 24px;
}

.description-content li {
  margin: 8px 0;
  line-height: 1.6;
}

.description-content blockquote {
  margin: 20px 0;
  padding: 16px 20px;
  background: #f8f9fa;
  border-left: 4px solid #007bff;
  border-radius: 4px;
  font-style: italic;
  color: #555;
}

.description-content code {
  background: #f1f3f4;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #d63384;
}

.description-content pre {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 16px 0;
  border: 1px solid #e9ecef;
}

.description-content pre code {
  background: none;
  padding: 0;
  color: #333;
}

.description-content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 16px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.description-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background: white;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.description-content th,
.description-content td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.description-content th {
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.description-content tr:last-child td {
  border-bottom: none;
}

.description-content a {
  color: #007bff;
  text-decoration: none;
  transition: color 0.2s;
}

.description-content a:hover {
  color: #0056b3;
  text-decoration: underline;
}

.description-content strong,
.description-content b {
  font-weight: 600;
  color: #2c3e50;
}

.description-content em,
.description-content i {
  font-style: italic;
  color: #6c757d;
}

.description-content hr {
  margin: 32px 0;
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, #dee2e6, transparent);
}

.related-products {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.related-products h3 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.related-item {
  cursor: pointer;
  transition: transform 0.2s;
}

.related-item:hover {
  transform: translateY(-2px);
}

.related-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 10px;
}

.related-item h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #333;
}

.related-price {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #e74c3c;
}

.loading {
  text-align: center;
  padding: 60px;
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

.error-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .product-detail {
    padding: 15px;
  }
  
  .product-main {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .main-image {
    height: 300px;
  }
  
  .product-title {
    font-size: 24px;
  }
  
  .current-price {
    font-size: 28px;
  }
  
  .product-actions {
    flex-direction: column;
  }
  
  .related-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }
  
  .product-description,
  .related-products {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .spec-options {
    flex-direction: column;
  }
  
  .spec-option {
    text-align: center;
  }
  
  .quantity-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>