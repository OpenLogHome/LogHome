<template>
  <view class="gift-code">
    <!-- 添加顶部余额显示 -->
    <view class="title">
      <img src="../../static/resources/log.png"></img>
      <text class="text">余额：</text>
      <text class="num">{{resources.log}}</text>
    </view>

    <view class="content">
      <view class="card">
        <view class="card-image">
          <image src="../../static/gift.png" mode="aspectFit"></image>
        </view>
        
        <view class="input-area">
          <view class="input-label">请输入礼品码</view>
          <input 
            class="code-input" 
            v-model="codeValue" 
            placeholder="请输入您的礼品码" 
            maxlength="16"
            @input="formatCode"
          />
          <text class="input-tips">礼品码由16位字母和数字组成</text>
        </view>
        
        <button 
          class="redeem-btn" 
          :disabled="!isValidCode || loading" 
          :class="{ 'disabled': !isValidCode || loading }"
          @click="redeemCode"
        >
          {{ loading ? '兑换中...' : '立即兑换' }}
        </button>
      </view>
      
      <view class="tips">
        <view class="tip-title">使用说明</view>
        <view class="tip-item">
          <text class="tip-num">1</text>
          <text class="tip-text">输入正确的礼品码，点击"立即兑换"</text>
        </view>
        <view class="tip-item">
          <text class="tip-num">2</text>
          <text class="tip-text">系统验证后将自动为您的账户添加相应的原木</text>
        </view>
        <view class="tip-item">
          <text class="tip-num">3</text>
          <text class="tip-text">每个礼品码只能使用一次</text>
        </view>
        <view class="tip-item">
          <text class="tip-num">4</text>
          <text class="tip-text">如遇问题，请联系官方微信客服：CodesOcean</text>
        </view>
      </view>
    </view>
    
    <!-- 兑换成功弹窗 -->
    <view class="success-modal" v-if="showSuccessModal">
      <view class="modal-content">
        <view class="success-icon">
          <!-- <image src="../../static/resources/success.png" mode="aspectFit"></image> -->
        </view>
        <view class="success-title">兑换成功</view>
        <view class="success-desc">
          <text>您已成功兑换</text>
          <text class="log-amount">{{redeemAmount}}</text>
          <image class="log-icon" src="../../static/resources/log.png"></image>
        </view>
        <button class="confirm-btn" @click="confirmSuccess">确定</button>
      </view>
    </view>
  </view>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      codeValue: '',
      loading: false,
      showSuccessModal: false,
      redeemAmount: 0,
      resources: {
        log: 0
      }
    }
  },
  computed: {
    isValidCode() {
      return this.codeValue && this.codeValue.length === 16;
    }
  },
  mounted() {
    this.refreshResources();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    formatCode(e) {
      // 转换为大写，并去除空格
      this.codeValue = this.codeValue.replace(/\s/g, '');
    },
    async redeemCode() {
      if (!this.isValidCode || this.loading) return;
      
      this.loading = true;
      try {
        let tk = JSON.parse(window.localStorage.getItem('token'));
        if (tk) tk = tk.tk;
        
        const res = await axios.post(this.$baseUrl + '/payment/redeem_gift_card', {
          card_code: this.codeValue
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tk
          }
        });
        
        if (res.data.code === 200) {
          // 兑换成功
          this.redeemAmount = res.data.data.log_amount;
          this.showSuccessModal = true;
          this.refreshResources(); // 刷新资源显示
        } else {
          uni.showToast({
            title: res.data.msg || '兑换失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error(error);
        
        // 处理特定错误
        let errorMsg = '兑换失败，请稍后重试';
        if (error.response && error.response.data && error.response.data.msg) {
          errorMsg = error.response.data.msg;
        }
        
        uni.showToast({
          title: errorMsg,
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    confirmSuccess() {
      this.showSuccessModal = false;
      this.codeValue = ''; // 清空输入框
      // 返回充值页面
      uni.navigateBack();
    },
    refreshResources() {
      let tk = JSON.parse(window.localStorage.getItem('token'));
      if (tk) tk = tk.tk;
      
      axios.get(this.$baseUrl + '/resource/get_resources', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + tk
        }
      }).then((res) => {
        this.resources = res.data[0];
        this.$forceUpdate();
      }).catch(function(error) {
        uni.showToast({
          title: error.toString(),
          icon: 'none',
          duration: 2000
        });
      }).then(function() {
        uni.hideLoading();
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.gift-code {
  min-height: 100vh;
  background-color: #f8f8f8;
  position: relative;
  
  .title {
    display: flex;
    align-items: center;
    padding: 42rpx 0 40rpx 50rpx;
    background-color: #ffffff;

    >img {
      width: 32rpx;
      height: 32rpx;
      margin-right: 6rpx;
    }

    >text {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 40rpx;
    }

    .num {
      color: #ff4141;
    }
  }
  
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
    padding: 30rpx;
    
    .card {
      background-color: #ffffff;
      border-radius: 12rpx;
      padding: 40rpx 30rpx;
      margin-bottom: 30rpx;
      box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
      
      .card-image {
        display: flex;
        justify-content: center;
        margin-bottom: 40rpx;
        
        image {
          width: 200rpx;
          height: 200rpx;
        }
      }
      
      .input-area {
        margin-bottom: 40rpx;
        
        .input-label {
          font-size: 28rpx;
          color: #333;
          margin-bottom: 20rpx;
          font-weight: 500;
        }
        
        .code-input {
          height: 100rpx;
          border: 1px solid #ddd;
          border-radius: 8rpx;
          padding: 0 20rpx;
          font-size: 32rpx;
          letter-spacing: 4rpx;
          text-align: center;
        }
        
        .input-tips {
          font-size: 24rpx;
          color: #999;
          margin-top: 20rpx;
          display: block;
        }
      }
      
      .redeem-btn {
        height: 90rpx;
        background-color: #ff6a5f;
        color: #fff;
        border-radius: 45rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        font-weight: 500;
        
        &.disabled {
          background-color: #ccc;
        }
      }
    }
    
    .tips {
      background-color: #ffffff;
      border-radius: 12rpx;
      padding: 30rpx;
      box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
      
      .tip-title {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
        margin-bottom: 30rpx;
      }
      
      .tip-item {
        display: flex;
        margin-bottom: 20rpx;
        
        .tip-num {
          width: 36rpx;
          height: 36rpx;
          background-color: #ff6a5f;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24rpx;
          margin-right: 20rpx;
          flex-shrink: 0;
        }
        
        .tip-text {
          font-size: 26rpx;
          color: #666;
          line-height: 36rpx;
        }
      }
    }
  }
  
  .success-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    
    .modal-content {
      width: 560rpx;
      background-color: #fff;
      border-radius: 12rpx;
      padding: 40rpx 30rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .success-icon {
        margin-bottom: 30rpx;
        
        image {
          width: 120rpx;
          height: 120rpx;
        }
      }
      
      .success-title {
        font-size: 36rpx;
        color: #333;
        font-weight: 600;
        margin-bottom: 20rpx;
      }
      
      .success-desc {
        font-size: 28rpx;
        color: #666;
        margin-bottom: 40rpx;
        display: flex;
        align-items: center;
        
        .log-amount {
          color: #ff6a5f;
          font-weight: 600;
          margin: 0 10rpx;
        }
        
        .log-icon {
          width: 32rpx;
          height: 32rpx;
        }
      }
      
      .confirm-btn {
        width: 100%;
        height: 90rpx;
        background-color: #ff6a5f;
        color: #fff;
        border-radius: 45rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        font-weight: 500;
      }
    }
  }
}
</style> 