<!-- 创建圈子页面 -->
<template>
  <view class="create-circle-container">
    
    <!-- 表单内容 -->
    <scroll-view scroll-y class="form-scroll">
      <!-- 圈子图标 -->
      <view class="form-item">
        <text class="form-label">圈子图标</text>
        <view class="icon-upload" @tap="uploadIcon">
          <image v-if="formData.icon" :src="formData.icon" mode="aspectFill" class="preview-icon"></image>
          <view v-else class="upload-placeholder">
            <uni-icons type="camera" size="30" color="#999"></uni-icons>
            <text>点击上传</text>
          </view>
        </view>
      </view>
      
      <!-- 圈子背景 -->
      <view class="form-item">
        <text class="form-label">圈子背景</text>
        <view class="bg-upload" @tap="uploadBackground">
          <image v-if="formData.bg_url" :src="formData.bg_url" mode="aspectFill" class="preview-bg"></image>
          <view v-else class="upload-placeholder">
            <uni-icons type="image" size="30" color="#999"></uni-icons>
            <text>点击上传</text>
          </view>
        </view>
      </view>
      
      <!-- 圈子名称 -->
      <view class="form-item">
        <text class="form-label">圈子名称</text>
        <input 
          type="text" 
          v-model="formData.name"
          placeholder="请输入圈子名称（2-20个字符）"
          class="form-input"
          maxlength="20"
        />
      </view>
      
      <!-- 圈子分类 -->
      <view class="form-item">
        <text class="form-label">圈子分类</text>
        <picker 
          :range="categories" 
          range-key="name"
          @change="onCategoryChange"
          class="category-picker"
        >
          <view class="picker-value">
            {{selectedCategory ? selectedCategory.name : '请选择圈子分类'}}
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
        </picker>
      </view>
      
      <!-- 圈子简介 -->
      <view class="form-item">
        <text class="form-label">圈子简介</text>
        <textarea 
          v-model="formData.description"
          placeholder="请输入圈子简介（10-200个字符）"
          class="form-textarea"
          maxlength="200"
        ></textarea>
        <text class="word-count">{{formData.description.length}}/200</text>
      </view>
      
      <!-- 圈子规则 -->
      <view class="form-item">
        <text class="form-label">圈子规则</text>
        <textarea 
          v-model="formData.rules"
          placeholder="请输入圈子规则（建议包含发帖规范、禁止内容等）"
          class="form-textarea"
          maxlength="500"
        ></textarea>
        <text class="word-count">{{formData.rules.length}}/500</text>
      </view>
      
      <!-- 创建须知 -->
      <view class="notice-box">
        <text class="notice-title">创建须知：</text>
        <text class="notice-item">1. 账号注册满30天且无违规记录</text>
        <text class="notice-item">2. 圈子名称不能重复</text>
        <text class="notice-item">3. 圈子创建后需要等待审核</text>
        <text class="notice-item">4. 创建成功后您将成为圈主</text>
      </view>
    </scroll-view>
    
    <!-- 提交按钮 -->
    <view class="submit-btn" @tap="submitForm" :class="{ disabled: !isFormValid }">
      提交申请
    </view>
  </view>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      categories: [],
      selectedCategory: null,
      formData: {
        name: '',
        description: '',
        rules: '',
        icon: '',
        bg_url: '',
        category_id: null
      }
    }
  },
  computed: {
    isFormValid() {
      return this.formData.name.length >= 2 &&
             this.formData.description.length >= 10 &&
             this.formData.icon &&
             this.formData.category_id;
    }
  },
  onLoad() {
    this.loadCategories();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    async loadCategories() {
      try {
        const res = await axios.get(this.$baseUrl + '/community/circles/categories');
        if (res.data && res.data.length > 0) {
          this.categories = res.data;
        }
      } catch (error) {
        console.error('加载分类失败', error);
        uni.showToast({
          title: '加载分类失败',
          icon: 'none'
        });
      }
    },
    onCategoryChange(e) {
      const index = e.detail.value;
      this.selectedCategory = this.categories[index];
      this.formData.category_id = this.selectedCategory.category_id;
    },
    async uploadIcon() {
      try {
        const res = await uni.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera']
        });
        
        if (res[1] && res[1].tempFilePaths && res[1].tempFilePaths[0]) {
          // 上传图片到服务器
          const uploadRes = await this.uploadFile(res[1].tempFilePaths[0]);
          this.formData.icon = uploadRes.url;
        }
      } catch (error) {
        console.error('上传图标失败', error);
        uni.showToast({
          title: '上传图标失败',
          icon: 'none'
        });
      }
    },
    async uploadBackground() {
      try {
        const res = await uni.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera']
        });
        if (res[1] && res[1].tempFilePaths && res[1].tempFilePaths[0]) {
          // 上传图片到服务器
          const uploadRes = await this.uploadFile(res[1].tempFilePaths[0]);
          this.formData.bg_url = uploadRes.url;
        }
      } catch (error) {
        console.error('上传背景图失败', error);
        uni.showToast({
          title: '上传背景图失败',
          icon: 'none'
        });
      }
    },
    async uploadFile(filePath) {
      return new Promise((resolve, reject) => {
        uni.showToast({
          title: "图片上传中",
          icon: 'loading',
          duration: 2000
        });
        uni.uploadFile({
          url: 'https://storage.codesocean.top/api/resource/upload?container=172018735018984',
          filePath: filePath,
          name: 'file',
          header: {
            ServiceKey: "a24785bedb466b9733dd317771d4b69c08da07fd"
          },
          success: (uploadRes) => {
            try {
              const data = JSON.parse(uploadRes.data);
              const imageUrl = "http://storage.codesocean.top/api/resource/get/" + data.data.resource_id;
              uni.showToast({
                title: "上传成功",
                icon: 'success',
                duration: 2000
              });
              resolve({url: imageUrl});
            } catch (e) {
              reject(e);
            }
          },
          fail: (error) => {
            uni.showToast({
              title: "上传失败",
              icon: 'none',
              duration: 2000
            });
            reject(error);
          }
        });
      });
    },
    async submitForm() {
      if (!this.isFormValid) {
        uni.showToast({
          title: '请完善必填信息',
          icon: 'none'
        });
        return;
      }
      
      try {
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
        const res = await axios.post(this.$baseUrl + '/community/circles/create', this.formData, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        
        if (res.data) {
          uni.showToast({
            title: '申请提交成功',
            icon: 'success'
          });
          
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }
      } catch (error) {
        console.error('创建圈子失败', error);
        uni.showToast({
          title: error.response?.data?.msg || '创建失败，请重试',
          icon: 'none'
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.create-circle-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: rgb(255, 248, 234);
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.form-scroll {
  flex: 1;
  padding: 20rpx 30rpx;
  padding-bottom: 120rpx;
  width: 100%;
  box-sizing: border-box;
}

.form-item {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  width: 100%;
  box-sizing: border-box;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 20rpx;
  display: block;
  width: 100%;
  box-sizing: border-box;
}

.icon-upload {
  width: 160rpx;
  height: 160rpx;
  border-radius: 20rpx;
  overflow: hidden;
  background-color: #f8f8f8;
}

.bg-upload {
  width: 100%;
  height: 300rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background-color: #f8f8f8;
  box-sizing: border-box;
}

.preview-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.upload-placeholder text {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.form-input {
  height: 80rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  width: 100%;
  box-sizing: border-box;
}

.category-picker {
  height: 80rpx;
  width: 100%;
}

.picker-value {
  height: 80rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #333;
  width: 100%;
  box-sizing: border-box;
}

.form-textarea {
  width: 100%;
  height: 200rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.word-count {
  font-size: 24rpx;
  color: #999;
  text-align: right;
  margin-top: 10rpx;
  display: block;
  width: 100%;
  box-sizing: border-box;
}

.notice-box {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  width: 100%;
  box-sizing: border-box;
}

.notice-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 20rpx;
  display: block;
  width: 100%;
  box-sizing: border-box;
}

.notice-item {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 10rpx;
  display: block;
  width: 100%;
  box-sizing: border-box;
}

.submit-btn {
  position: fixed;
  left: 30rpx;
  right: 30rpx;
  bottom: 40rpx;
  height: 80rpx;
  background-color: #EA7034;
  color: #fff;
  font-size: 32rpx;
  border-radius: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.submit-btn.disabled {
  background-color: #ccc;
}
</style> 