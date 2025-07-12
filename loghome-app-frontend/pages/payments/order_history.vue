<template>
  <view class="order-history">
    <view class="content">
      <view v-if="loading" class="loading">
        <text>加载中...</text>
      </view>
      
      <view v-else-if="orders.length === 0" class="empty">
        <text>暂无订单记录</text>
      </view>
      
      <view v-else class="order-list">
        <view v-for="(order, index) in orders" :key="order.payment_id" class="order-item">
          <view class="order-header">
            <text class="order-id">订单号: {{ order.payment_id }}</text>
            <text :class="['order-status', getStatusClass(order.status)]">{{ getStatusText(order.status) }}</text>
          </view>
          
          <view class="order-content">
            <view class="amount-info">
              <view class="log-amount">
                <image src="../../static/resources/log.png"></image>
                <text>{{ order.log_amount }}</text>
              </view>
              <text class="pay-amount">￥{{ order.pay_amount }}</text>
            </view>
            
            <view class="time-info">
              <text>创建时间: {{ formatTime(order.create_time) }}</text>
              <text v-if="order.status === 'paid'">支付时间: {{ formatTime(order.update_time) }}</text>
            </view>

            <!-- 添加订单操作按钮 -->
            <view v-if="order.status === 'created'" class="order-actions">
              <view class="action-btn pay-btn" @click="goToPay(order)">
                <text>前往支付</text>
              </view>
              <view class="action-btn cancel-btn" @click="cancelOrder(order)">
                <text>取消订单</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <view v-if="hasMore && !loading" class="load-more" @click="loadMore">
        <text>加载更多</text>
      </view>
      
      <view v-if="!hasMore && orders.length > 0" class="no-more">
        <text>没有更多订单了</text>
      </view>
    </view>
  </view>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      orders: [],
      page: 1,
      pageSize: 10,
      total: 0,
      loading: true,
      hasMore: false
    }
  },
  computed: {
    hasMore() {
      return this.orders.length < this.total
    }
  },
  mounted() {
    this.getOrderHistory()
  },
  methods: {
    getOrderHistory() {
      this.loading = true
      let tk = JSON.parse(window.localStorage.getItem('token'))
      if (tk) tk = tk.tk
      
      axios.get(this.$baseUrl + '/payment/order_history', {
        params: {
          page: this.page,
          pageSize: this.pageSize
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + tk
        }
      }).then(res => {
        if (res.data.code === 200) {
          const data = res.data.data
          this.orders = [...this.orders, ...data.list]
          this.total = data.total
          this.hasMore = this.orders.length < this.total
        } else {
          uni.showToast({
            title: '获取订单失败',
            icon: 'none'
          })
        }
      }).catch(error => {
        uni.showToast({
          title: error.toString(),
          icon: 'none'
        })
      }).finally(() => {
        this.loading = false
      })
    },
    loadMore() {
      if (!this.hasMore || this.loading) return
      this.page++
      this.getOrderHistory()
    },
    formatTime(timeStr) {
      if (!timeStr) return ''
      const date = new Date(timeStr)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },
    getStatusText(status) {
      const statusMap = {
        'created': '待支付',
        'paid': '已支付',
        'cancelled': '已取消',
        'failed': '支付失败'
      }
      return statusMap[status] || status
    },
    getStatusClass(status) {
      const classMap = {
        'created': 'status-pending',
        'paid': 'status-success',
        'cancelled': 'status-cancel',
        'failed': 'status-fail'
      }
      return classMap[status] || ''
    },
    // 前往支付
    async goToPay(order) {
      try {
        let tk = JSON.parse(window.localStorage.getItem('token'))
        if (tk) tk = tk.tk
        
        // 获取支付链接
        const payUrlRes = await axios.get(this.$baseUrl + '/payment/get_payment_url', {
          params: {
            money: order.pay_amount,
            log: order.log_amount,
            payment_id: order.payment_id
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tk
          }
        })
        
        // 跳转到支付页面
        uni.navigateTo({
          url: `/pages/payments/jump_to_pay?pay_url=${encodeURIComponent(payUrlRes.data)}&payment_id=${order.payment_id}`
        })
      } catch (error) {
        uni.showToast({
          title: '获取支付链接失败',
          icon: 'none'
        })
      }
    },
    // 取消订单
    cancelOrder(order) {
      uni.showModal({
        title: '取消订单',
        content: '确定要取消该订单吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              let tk = JSON.parse(window.localStorage.getItem('token'))
              if (tk) tk = tk.tk
              
              // 调用取消订单接口
              // 注意：后端需要实现取消订单功能
              await axios.post(this.$baseUrl + '/payment/cancel_order', {
                payment_id: order.payment_id
              }, {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + tk
                }
              })
              
              // 刷新订单列表
              this.orders = []
              this.page = 1
              this.getOrderHistory()
              
              uni.showToast({
                title: '订单已取消',
                icon: 'success'
              })
            } catch (error) {
              uni.showToast({
                title: '取消订单失败',
                icon: 'none'
              })
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.order-history {
  background-color: #f8f8f8;
  min-height: 100vh;
  
  .header {
    height: 90rpx;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    position: relative;
    
    .back {
      width: 50rpx;
      height: 50rpx;
      display: flex;
      align-items: center;
      
      image {
        width: 40rpx;
        height: 40rpx;
      }
    }
    
    .title {
      position: absolute;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 34rpx;
      font-weight: 500;
      color: #333333;
    }
  }
  
  .content {
    padding: 20rpx;
  }
  
  .loading, .empty {
    display: flex;
    justify-content: center;
    padding: 40rpx 0;
    
    text {
      font-size: 28rpx;
      color: #999999;
    }
  }
  
  .order-list {
    .order-item {
      background-color: #ffffff;
      border-radius: 12rpx;
      padding: 20rpx 30rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
      
      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 20rpx;
        border-bottom: 1rpx solid #f5f5f5;
        
        .order-id {
          font-size: 26rpx;
          color: #666666;
        }
        
        .order-status {
          font-size: 26rpx;
          font-weight: 500;
        }
        
        .status-pending {
          color: #ff9900;
        }
        
        .status-success {
          color: #52c41a;
        }
        
        .status-cancel {
          color: #999999;
        }
        
        .status-fail {
          color: #ff4d4f;
        }
      }
      
      .order-content {
        padding-top: 20rpx;
        
        .amount-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15rpx;
          
          .log-amount {
            display: flex;
            align-items: center;
            
            image {
              width: 32rpx;
              height: 32rpx;
              margin-right: 10rpx;
            }
            
            text {
              font-size: 32rpx;
              font-weight: 600;
              color: #333333;
            }
          }
          
          .pay-amount {
            font-size: 32rpx;
            font-weight: 600;
            color: #ff6a5f;
          }
        }
        
        .time-info {
          display: flex;
          flex-direction: column;
          
          text {
            font-size: 24rpx;
            color: #999999;
            margin-top: 6rpx;
          }
        }
        
        .order-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 20rpx;
          padding-top: 20rpx;
          border-top: 1rpx dashed #eee;
          
          .action-btn {
            height: 60rpx;
            padding: 0 30rpx;
            border-radius: 30rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 20rpx;
            
            text {
              font-size: 26rpx;
              font-weight: 500;
            }
          }
          
          .pay-btn {
            background-color: #ff6a5f;
            
            text {
              color: #ffffff;
            }
          }
          
          .cancel-btn {
            background-color: #f5f5f5;
            border: 1rpx solid #ddd;
            
            text {
              color: #666666;
            }
          }
        }
      }
    }
  }
  
  .load-more, .no-more {
    text-align: center;
    padding: 20rpx 0;
    
    text {
      font-size: 26rpx;
      color: #999999;
    }
  }
  
  .load-more text {
    color: #ff6a5f;
  }
}
</style> 