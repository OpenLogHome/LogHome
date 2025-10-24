<template>
  <div class="cart">
    <div class="cart-header">
      <h1>购物车</h1>
      <span class="cart-count" v-if="cartItems.length > 0">{{ cartItems.length }} 件商品</span>
    </div>

    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="cartItems.length === 0" class="empty-cart">
      <div class="empty-icon">🛒</div>
      <h3>购物车是空的</h3>
      <p>快去挑选心仪的商品吧</p>
      <button @click="goToProducts" class="go-shopping-btn">去购物</button>
    </div>

    <div v-else class="cart-content">
      <!-- 购物车商品列表 -->
      <div class="cart-items">
        <div class="cart-header-row">
          <label class="select-all">
            <input 
              type="checkbox" 
              v-model="selectAll" 
              @change="toggleSelectAll"
            />
            全选
          </label>
          <span>商品信息</span>
          <span>单价</span>
          <span>数量</span>
          <span>小计</span>
          <span>操作</span>
        </div>

        <div 
          v-for="item in cartItems" 
          :key="item.id" 
          class="cart-item"
          :class="{ selected: item.selected }"
        >
          <label class="item-select">
            <input 
              type="checkbox" 
              v-model="item.selected"
              @change="updateSelection"
            />
          </label>

          <div class="item-info">
            <img 
              :src="item.image_url || '/placeholder-product.jpg'" 
              :alt="item.name"
              class="item-image"
              @click="goToProduct(item.id)"
            />
            <div class="item-details">
              <h4 @click="goToProduct(item.id)" class="item-name">
                {{ item.name }}
              </h4>
              <div class="item-specs" v-if="item.specs">
                <span v-for="(value, key) in item.specs" :key="key" class="spec-tag">
                  {{ key }}: {{ value }}
                </span>
              </div>
            </div>
          </div>

          <div class="item-price">
            <span class="current-price">¥{{ item.price }}</span>
            <span 
              v-if="item.original_price && item.original_price > item.price" 
              class="original-price"
            >
              ¥{{ item.original_price }}
            </span>
          </div>

          <div class="item-quantity">
            <div class="quantity-controls">
              <button 
                @click="updateQuantity(item, item.quantity - 1)" 
                :disabled="item.quantity <= 1"
                class="qty-btn"
              >
                -
              </button>
              <input 
                v-model.number="item.quantity" 
                @change="updateQuantity(item, item.quantity)"
                type="number" 
                min="1" 
                :max="item.stock"
                class="qty-input"
              />
              <button 
                @click="updateQuantity(item, item.quantity + 1)" 
                :disabled="item.quantity >= item.stock"
                class="qty-btn"
              >
                +
              </button>
            </div>
          </div>

          <div class="item-subtotal">
            ¥{{ (item.price * item.quantity).toFixed(2) }}
          </div>

          <div class="item-actions">
            <button @click="removeItem(item)" class="remove-btn">删除</button>
          </div>
        </div>
      </div>

      <!-- 购物车底部结算区域 -->
      <div class="cart-footer">
        <div class="cart-summary">
          <div class="summary-info">
            <span>已选择 {{ selectedItems.length }} 件商品</span>
            <div class="total-price">
              <span>合计：</span>
              <span class="total-amount">¥{{ totalAmount.toFixed(2) }}</span>
            </div>
          </div>
          
          <div class="checkout-actions">
            <button 
              @click="clearSelected" 
              v-if="selectedItems.length > 0"
              class="clear-btn"
            >
              清空选中
            </button>
            <button 
              @click="checkout" 
              :disabled="selectedItems.length === 0"
              class="checkout-btn"
            >
              结算 ({{ selectedItems.length }})
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { cartAPI, errorHandler, formatter } from '@/utils/api'

const router = useRouter()

// 响应式数据
const cartItems = ref([])
const loading = ref(false)
const selectAll = ref(false)

// 计算属性
const selectedItems = computed(() => cartItems.value.filter(item => item.selected))

const totalAmount = computed(() => {
  return selectedItems.value.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
})

// 监听选中状态变化
watch(selectedItems, (newItems) => {
  selectAll.value = newItems.length === cartItems.value.length && cartItems.value.length > 0
}, { deep: true })

// 获取购物车数据
const fetchCartData = async () => {
  try {
    loading.value = true
    const response = await cartAPI.getCart()

    console.log(response)
    
    if (response.code == 200) {
      cartItems.value = response.data.items.map(item => ({
        ...item,
        selected: false
      }))
    } else {
      throw new Error(response.message || '获取购物车失败')
    }
  } catch (error) {
    console.error('获取购物车失败:', error)
    errorHandler.handleError(error)
  } finally {
    loading.value = false
  }
}

const updateQuantity = async (item, newQuantity) => {
  if (newQuantity < 1 || newQuantity > item.stock) {
    return
  }

  try {
    const response = await cartAPI.updateCart({
      cart_id: item.id,
      quantity: newQuantity
    })
    
    if (response.code == 200) {
      item.quantity = newQuantity
    } else {
      throw new Error(response.message || '更新数量失败')
    }
  } catch (error) {
    console.error('更新数量失败:', error)
    errorHandler.handleError(error)
  }
}

const removeItem = async (item) => {
  if (!confirm('确定要删除这件商品吗？')) {
    return
  }

  try {
    const response = await cartAPI.removeFromCart(item.id)
    
    if (response.code == 200) {
      const index = cartItems.value.findIndex(cartItem => cartItem.id === item.id)
      if (index > -1) {
        cartItems.value.splice(index, 1)
      }
    } else {
      throw new Error(response.message || '删除失败')
    }
  } catch (error) {
    console.error('删除商品失败:', error)
    errorHandler.handleError(error)
  }
}

const toggleSelectAll = () => {
  cartItems.value.forEach(item => {
    item.selected = selectAll.value
  })
}

const updateSelection = () => {
  // 这个方法会触发 watch，自动更新 selectAll 状态
}

const clearSelected = async () => {
  if (!confirm('确定要清空选中的商品吗？')) {
    return
  }

  const selectedIds = selectedItems.value.map(item => item.id)
  
  try {
    const response = await fetch('/api/store/cart/batch-delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cart_ids: selectedIds
      })
    })
    
    const data = await response.json()
    if (data.success) {
      cartItems.value = cartItems.value.filter(item => !selectedIds.includes(item.id))
    } else {
      alert(data.message || '清空失败')
    }
  } catch (error) {
    console.error('清空购物车失败:', error)
    alert('清空失败')
  }
}

const checkout = () => {
  if (selectedItems.value.length === 0) {
    alert('请选择要结算的商品')
    return
  }
  
  // 将选中的商品信息传递给订单页面
  const checkoutData = {
    items: selectedItems.value,
    totalAmount: totalAmount.value
  }
  
  // 可以通过路由参数或者状态管理传递数据
  router.push({
    path: '/checkout',
    query: {
      data: JSON.stringify(checkoutData)
    }
  })
}

const goToProducts = () => {
  router.push('/products')
}

const goToProduct = (productId) => {
  router.push(`/product/${productId}`)
}

// 生命周期
onMounted(() => {
  fetchCartData()
})
</script>

<style scoped>
.cart {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.cart-header h1 {
  margin: 0;
  font-size: 28px;
  color: #333;
}

.cart-count {
  color: #666;
  font-size: 16px;
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

.empty-cart {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-cart h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #333;
}

.empty-cart p {
  margin: 0 0 30px 0;
  color: #666;
}

.go-shopping-btn {
  padding: 12px 30px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.go-shopping-btn:hover {
  background: #0056b3;
}

.cart-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.cart-header-row {
  display: grid;
  grid-template-columns: 60px 2fr 120px 150px 120px 80px;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  align-items: center;
}

.select-all {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.cart-item {
  display: grid;
  grid-template-columns: 60px 2fr 120px 150px 120px 80px;
  gap: 15px;
  padding: 20px;
  border-bottom: 1px solid #eee;
  align-items: center;
  transition: background 0.2s;
}

.cart-item:hover {
  background: #f8f9fa;
}

.cart-item.selected {
  background: #e3f2fd;
}

.item-select {
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-info {
  display: flex;
  gap: 15px;
  align-items: center;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
}

.item-details {
  flex: 1;
}

.item-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  transition: color 0.2s;
}

.item-name:hover {
  color: #007bff;
}

.item-specs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.spec-tag {
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

.item-price {
  text-align: center;
}

.current-price {
  font-size: 16px;
  font-weight: 600;
  color: #e74c3c;
}

.original-price {
  display: block;
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  margin-top: 4px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
  width: fit-content;
  margin: 0 auto;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f8f9fa;
  cursor: pointer;
  font-size: 16px;
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
  width: 50px;
  height: 32px;
  border: none;
  text-align: center;
  font-size: 14px;
}

.item-subtotal {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #e74c3c;
}

.remove-btn {
  padding: 6px 12px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.remove-btn:hover {
  background: #c82333;
}

.cart-footer {
  background: #f8f9fa;
  padding: 20px;
  border-top: 1px solid #eee;
}

.cart-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-info {
  display: flex;
  align-items: center;
  gap: 30px;
}

.total-price {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
}

.total-amount {
  font-size: 24px;
  font-weight: 700;
  color: #e74c3c;
}

.checkout-actions {
  display: flex;
  gap: 15px;
}

.clear-btn {
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.clear-btn:hover {
  background: #5a6268;
}

.checkout-btn {
  padding: 12px 30px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.checkout-btn:hover:not(:disabled) {
  background: #218838;
}

.checkout-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .cart {
    padding: 15px;
  }
  
  .cart-header-row,
  .cart-item {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .cart-header-row {
    display: none;
  }
  
  .cart-item {
    display: block;
    padding: 15px;
  }
  
  .item-select {
    margin-bottom: 10px;
  }
  
  .item-info {
    margin-bottom: 15px;
  }
  
  .item-price,
  .item-quantity,
  .item-subtotal {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
  }
  
  .item-price::before {
    content: "单价：";
  }
  
  .item-quantity::before {
    content: "数量：";
  }
  
  .item-subtotal::before {
    content: "小计：";
  }
  
  .cart-summary {
    flex-direction: column;
    gap: 15px;
  }
  
  .summary-info {
    flex-direction: column;
    gap: 10px;
  }
  
  .checkout-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>