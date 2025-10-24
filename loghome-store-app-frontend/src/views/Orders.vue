<template>
  <div class="orders">
    <div class="orders-header">
      <h1>我的订单</h1>
      <div class="order-filters">
        <button 
          v-for="status in orderStatuses" 
          :key="status.value"
          :class="{ active: selectedStatus === status.value }"
          @click="filterByStatus(status.value)"
          class="filter-btn"
        >
          {{ status.label }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="orders.length === 0" class="empty-orders">
      <div class="empty-icon">📋</div>
      <h3>暂无订单</h3>
      <p>您还没有任何订单记录</p>
      <button @click="goToProducts" class="go-shopping-btn">去购物</button>
    </div>

    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="order-info">
            <span class="order-number">订单号：{{ order.order_number }}</span>
            <span class="order-date">{{ formatDate(order.created_at) }}</span>
          </div>
          <div class="order-status">
            <span :class="`status-${order.status}`" class="status-badge">
              {{ getStatusText(order.status) }}
            </span>
          </div>
        </div>

        <div class="order-items">
          <div 
            v-for="item in order.items" 
            :key="item.id" 
            class="order-item"
            @click="goToProductDetail(item.product_id)"
          >
            <img 
              :src="getMainImage(item) || '/placeholder-product.jpg'" 
              :alt="item.product_name"
              class="item-image"
            />
            <div class="item-details">
              <h4 class="item-name">{{ item.product_name }}</h4>
              <div class="item-specs" v-if="item.specs">
                <span v-for="(value, key) in item.specs" :key="key" class="spec-tag">
                  {{ key }}: {{ value }}
                </span>
              </div>
              <div class="item-price-qty">
                <span class="item-price">¥{{ item.price }}</span>
                <span class="item-quantity">x{{ item.quantity }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="order-footer">
          <div class="order-total">
            <span>共 {{ order.items.length }} 件商品</span>
            <span class="total-amount">合计：¥{{ order.total_amount }}</span>
          </div>
          
          <div class="order-actions">
            <button 
              v-if="order.status === 'pending'"
              @click="cancelOrder(order)"
              class="action-btn cancel-btn"
            >
              取消订单
            </button>
            
            <button 
              v-if="order.status === 'pending'"
              @click="payOrder(order)"
              class="action-btn pay-btn"
            >
              立即支付
            </button>
            
            <button 
              v-if="order.status === 'shipped'"
              @click="confirmReceipt(order)"
              class="action-btn confirm-btn"
            >
              确认收货
            </button>
            
            <button 
              @click="viewOrderDetail(order)"
              class="action-btn detail-btn"
            >
              查看详情
            </button>
            
            <button 
              v-if="order.status === 'completed'"
              @click="reorder(order)"
              class="action-btn reorder-btn"
            >
              再次购买
            </button>
          </div>
        </div>
      </div>
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
import { useRouter } from 'vue-router'
import { orderAPI, errorHandler, formatter } from '@/utils/api'

const router = useRouter()

// 响应式数据
const orders = ref([])
const loading = ref(false)
const selectedStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

// 订单状态配置
const orderStatuses = [
  { value: '', label: '全部' },
  { value: 'pending', label: '待支付' },
  { value: 'paid', label: '已支付' },
  { value: 'shipped', label: '已发货' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' }
]

// 计算属性
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value))

// 方法
const fetchOrders = async () => {
  try {
    loading.value = true
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      status: activeTab.value === 'all' ? '' : activeTab.value
    }
    
    const response = await orderAPI.getOrders(params)
    
    if (response.code == 200) {
      orders.value = response.data.orders
       totalOrders.value = response.data.total
    } else {
      throw new Error(response.message || '获取订单列表失败')
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
    errorHandler.handleError(error)
  } finally {
    loading.value = false
  }
}

const filterByStatus = (status) => {
  selectedStatus.value = status
  currentPage.value = 1
  fetchOrders()
}

const changePage = (page) => {
  currentPage.value = page
  fetchOrders()
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取商品主图
const getMainImage = (product) => {
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0]
  }
  return product.product_image || product.image_url
}

const getStatusText = (status) => {
  const statusMap = {
    pending: '待支付',
    paid: '已支付',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const cancelOrder = async (order) => {
  if (!confirm('确定要取消这个订单吗？')) return
  
  try {
    const response = await orderAPI.cancelOrder(order.id)
    
    if (response.code == 200) {
      order.status = 'cancelled'
      alert('订单已取消')
    } else {
      throw new Error(response.message || '取消订单失败')
    }
  } catch (error) {
    console.error('取消订单失败:', error)
    errorHandler.handleError(error)
  }
}

const payOrder = (order) => {
  // 跳转到支付页面
  router.push(`/payment/${order.id}`)
}

// 确认收货
const confirmReceipt = async (order) => {
  if (!confirm('确认已收到商品吗？')) return
  
  try {
    const response = await orderAPI.confirmOrder(order.id)
    
    if (response.code == 200) {
      order.status = 'completed'
      alert('确认收货成功')
    } else {
      throw new Error(response.message || '确认收货失败')
    }
  } catch (error) {
    console.error('确认收货失败:', error)
    errorHandler.handleError(error)
  }
}

const viewOrderDetail = (order) => {
  router.push(`/order/${order.id}`)
}

const reorder = async (order) => {
  try {
    // 将订单中的商品重新添加到购物车
    for (const item of order.items) {
      const response = await fetch('/api/store/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: item.product_id,
          quantity: item.quantity,
          specs: item.specs
        })
      })
      
      const data = await response.json()
      if (!data.success) {
        console.error('添加商品到购物车失败:', item.product_name)
      }
    }
    
    alert('商品已添加到购物车')
    router.push('/cart')
  } catch (error) {
    console.error('再次购买失败:', error)
    alert('操作失败')
  }
}

const goToProducts = () => {
  router.push('/products')
}

const goToProductDetail = (productId) => {
  router.push(`/product/${productId}`)
}

// 生命周期
onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.orders {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.orders-header {
  margin-bottom: 30px;
}

.orders-header h1 {
  margin: 0 0 20px 0;
  font-size: 28px;
  color: #333;
}

.order-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #007bff;
  color: #007bff;
}

.filter-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
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

.empty-orders {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-orders h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #333;
}

.empty-orders p {
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

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.order-number {
  font-weight: 600;
  color: #333;
}

.order-date {
  font-size: 14px;
  color: #666;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-paid {
  background: #d4edda;
  color: #155724;
}

.status-shipped {
  background: #cce7ff;
  color: #004085;
}

.status-completed {
  background: #d1ecf1;
  color: #0c5460;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.order-items {
  padding: 20px;
}

.order-item {
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
}

.order-item:last-child {
  border-bottom: none;
}

.order-item:hover {
  background: #f8f9fa;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.item-details {
  flex: 1;
}

.item-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
}

.item-specs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.spec-tag {
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

.item-price-qty {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-price {
  font-size: 16px;
  font-weight: 600;
  color: #e74c3c;
}

.item-quantity {
  color: #666;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-top: 1px solid #eee;
}

.order-total {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.total-amount {
  font-size: 18px;
  font-weight: 600;
  color: #e74c3c;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background: #5a6268;
}

.pay-btn {
  background: #e74c3c;
  color: white;
}

.pay-btn:hover {
  background: #c82333;
}

.confirm-btn {
  background: #28a745;
  color: white;
}

.confirm-btn:hover {
  background: #218838;
}

.detail-btn {
  background: #007bff;
  color: white;
}

.detail-btn:hover {
  background: #0056b3;
}

.reorder-btn {
  background: #17a2b8;
  color: white;
}

.reorder-btn:hover {
  background: #138496;
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
  .orders {
    padding: 15px;
  }
  
  .order-filters {
    justify-content: center;
  }
  
  .order-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .order-footer {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .order-actions {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .item-price-qty {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}

@media (max-width: 480px) {
  .order-item {
    flex-direction: column;
  }
  
  .item-image {
    width: 100%;
    height: 200px;
  }
  
  .order-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
    text-align: center;
  }
}
</style>