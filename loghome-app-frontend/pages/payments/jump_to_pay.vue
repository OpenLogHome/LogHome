<template>
  <view class="jump-pay">
    <view v-if="loading" class="loading">
      <text>正在查询订单状态...</text>
    </view>
    <view class="tips">
      <text>请点击下方按钮前往支付</text>
      <button class="pay-btn" @click="openPaymentPage">前往支付页面</button>
      <button @click="checkOrder" :disabled="loading">{{loading ? '查询中...' : '我已完成支付'}}</button>
    </view>
    <view class="auto-check">
      <text>{{countdownText}}</text>
    </view>
  </view>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      payUrl: '',
      payment_id: '',
      loading: false,
      timer: null,
      countdown: 5,
      countdownText: '系统将在5秒后自动查询',
      paid: false
    }
  },
  async onLoad(options) {
    this.payUrl = decodeURIComponent(options.pay_url) + `?custom_order_id=${options.payment_id}&remark=${options.payment_id}`;
    this.payment_id = options.payment_id;

    await this.checkOrder();

    if(!this.paid) {
        this.openPaymentPage();
        this.startAutoCheck();
    }
  },
  onUnload() {
    // 页面卸载时清除定时器
    this.clearTimers();
  },
  methods: {
    openPaymentPage() {
      // 打开支付链接
      if(this.jsBridge && this.jsBridge.inApp) {
        this.jsBridge.openInBrowser(this.payUrl)
      } else {
        window.open(this.payUrl)
      }
    },
    startAutoCheck() {
      // 清除可能存在的定时器
      this.clearTimers();
      
      // 设置倒计时
      this.countdown = 5;
      this.updateCountdownText();
      
      // 创建倒计时定时器
      this.countdownTimer = setInterval(() => {
        this.countdown--;
        this.updateCountdownText();
        
        if (this.countdown <= 0) {
          clearInterval(this.countdownTimer);
          this.checkOrder();
        }
      }, 1000);
    },
    updateCountdownText() {
      this.countdownText = `系统将在${this.countdown}秒后自动查询`;
    },
    clearTimers() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
      }
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
    async checkOrder() {
      if (this.loading) return;
      
      this.clearTimers();
      this.loading = true;
      
      try {
        let tk = JSON.parse(window.localStorage.getItem('token'));
        if (tk) tk = tk.tk;
        
        // 调用后端查询订单状态接口
        const res = await axios.get(this.$baseUrl + '/payment/order_status', {
          params: {
            payment_id: this.payment_id
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tk
          }
        });
        
        // 检查订单状态
        if (res.data.code === 200) {
          const orderData = res.data.data;
          
          if (orderData.status === 'paid') {
            this.paid = true;
            // 订单已支付，跳转到支付成功页面
            uni.showToast({
              title: '支付成功！',
              icon: 'success'
            });
            
            // 延迟跳转到订单列表页
            setTimeout(() => {
              uni.redirectTo({
                url: '/pages/payments/order_history'
              });
            }, 1500);
            return;
          }
        }
        
        // 订单未支付，继续轮询
        uni.showToast({
          title: '订单未支付',
          icon: 'none'
        });
        
        // 5秒后再次查询
        this.startAutoCheck();
      } catch (error) {
        uni.showToast({
          title: '查询订单失败，请稍后重试',
          icon: 'none'
        });
        console.error(error);
        
        // 出错后也继续轮询
        this.startAutoCheck();
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped lang="scss">
.jump-pay {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  
  .loading {
    margin-top: 20rpx;
    color: #999;
    font-size: 28rpx;
  }
  
  .tips {
    margin-top: 40rpx;
    text-align: center;
    color: #666;
    
    .pay-btn {
      margin-top: 30rpx;
      margin-bottom: 20rpx;
      background: #ff9900;
      color: #fff;
      border-radius: 8rpx;
      font-size: 28rpx;
      padding: 16rpx 40rpx;
    }
    
    button {
      margin-top: 30rpx;
      background: #ff6a5f;
      color: #fff;
      border-radius: 8rpx;
      font-size: 28rpx;
      padding: 16rpx 40rpx;
      
      &:disabled {
        background: #ccc;
      }
    }
  }
  
  .auto-check {
    margin-top: 20rpx;
    font-size: 24rpx;
    color: #999;
  }
}
</style> 