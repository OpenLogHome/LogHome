<!-- 圈子设置页面 -->
<template>
  <view class="edit-circle-container">
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
      
      <!-- 圈子名称 (仅圈主可编辑) -->
      <view class="form-item">
        <text class="form-label">圈子名称</text>
        <input 
          type="text" 
          v-model="formData.name"
          placeholder="请输入圈子名称（2-20个字符）"
          class="form-input"
          maxlength="20"
          :disabled="userRole !== 2"
        />
        <text v-if="userRole !== 2" class="tip-text">只有圈主可以修改圈子名称</text>
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
      
      <!-- 圈子公告 -->
      <view class="form-item">
        <text class="form-label">圈子公告</text>
        <textarea 
          v-model="formData.announcement"
          placeholder="请输入圈子公告（可选）"
          class="form-textarea"
          maxlength="500"
        ></textarea>
        <text class="word-count">{{formData.announcement.length}}/500</text>
      </view>
      
      <!-- 圈子设置 (仅圈主可见) -->
      <view class="form-item" v-if="userRole === 2">
        <text class="form-label">圈子设置</text>
        
        <!-- 加入验证设置 -->
        <view class="setting-item">
          <view class="setting-header">
            <text class="setting-title">加入验证</text>
            <switch 
              :checked="circleSettings.need_verification === 1" 
              color="#EA7034" 
              @change="toggleVerification"
            />
          </view>
          <text class="setting-desc">开启后，用户加入圈子需要经过审核</text>
          
          <!-- 验证问题设置 -->
          <view class="verification-questions" v-if="circleSettings.need_verification === 1">
            <text class="question-label">验证信息提示（可选）</text>
            <textarea 
              v-model="circleSettings.verification_questions"
              placeholder="请输入验证提示信息，例如：请简要介绍自己，以及为什么想加入本圈子"
              class="form-textarea"
              maxlength="200"
            ></textarea>
            <text class="word-count">{{(circleSettings.verification_questions || '').length}}/200</text>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <!-- 提交按钮 -->
    <view class="submit-btn" @tap="submitForm" :class="{ disabled: !isFormValid }">
      保存修改
    </view>
  </view>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      circleId: null,
      userRole: 0, // 0-普通成员 1-管理员 2-圈主
      formData: {
        name: '',
        description: '',
        rules: '',
        announcement: '',
        icon: '',
        bg_url: ''
      },
      circleSettings: {
        need_verification: 0,
        verification_questions: ''
      },
      originalData: {}, // 用于存储原始数据，比较是否有修改
      originalSettings: {} // 用于存储原始设置，比较是否有修改
    }
  },
  computed: {
    isFormValid() {
      return this.formData.name.length >= 2 &&
             this.formData.description.length >= 10;
    },
    hasChanges() {
      const basicInfoChanged = this.formData.name !== this.originalData.name ||
             this.formData.description !== this.originalData.description ||
             this.formData.rules !== this.originalData.rules ||
             this.formData.announcement !== this.originalData.announcement ||
             this.formData.icon !== this.originalData.icon ||
             this.formData.bg_url !== this.originalData.bg_url;
             
      const settingsChanged = this.circleSettings.need_verification !== this.originalSettings.need_verification ||
             this.circleSettings.verification_questions !== this.originalSettings.verification_questions;
             
      return basicInfoChanged || settingsChanged;
    }
  },
  onLoad(options) {
    if (options.id) {
      this.circleId = options.id;
      if (options.role) {
        this.userRole = parseInt(options.role);
      }
      this.loadCircleInfo();
      if (this.userRole === 2) {
        this.loadCircleSettings();
      }
    } else {
      uni.showToast({
        title: '参数错误',
        icon: 'none'
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    async loadCircleInfo() {
      try {
        const res = await axios.get(this.$baseUrl + `/community/circles/detail/${this.circleId}`);
        
        if (res.data) {
          // 填充表单数据
          this.formData = {
            name: res.data.name || '',
            description: res.data.description || '',
            rules: res.data.rules || '',
            announcement: res.data.announcement || '',
            icon: res.data.icon || '',
            bg_url: res.data.bg_url || ''
          };
          
          // 保存原始数据
          this.originalData = {...this.formData};
        }
      } catch (error) {
        console.error('加载圈子信息失败', error);
        uni.showToast({
          title: '加载圈子信息失败',
          icon: 'none'
        });
      }
    },
    async loadCircleSettings() {
      try {
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
        // 获取圈子设置
        const res = await axios.get(this.$baseUrl + `/community/circles/${this.circleId}/settings`, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        
        if (res.data) {
          this.circleSettings = {
            need_verification: res.data.need_verification || 0,
            verification_questions: res.data.verification_questions || ''
          };
          
          // 保存原始设置
          this.originalSettings = {...this.circleSettings};
        }
      } catch (error) {
        console.error('加载圈子设置失败', error);
        // 如果设置不存在，使用默认值
        this.circleSettings = {
          need_verification: 0,
          verification_questions: ''
        };
        this.originalSettings = {...this.circleSettings};
      }
    },
    toggleVerification(e) {
      this.circleSettings.need_verification = e.detail.value ? 1 : 0;
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
      
      if (!this.hasChanges) {
        uni.showToast({
          title: '未做任何修改',
          icon: 'none'
        });
        return;
      }
      
      try {
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
        
        // 更新圈子基本信息
        const res = await axios.put(this.$baseUrl + `/community/circles/${this.circleId}`, this.formData, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        
        // 如果是圈主，更新圈子设置
        if (this.userRole === 2) {
          await axios.put(this.$baseUrl + `/community/circles/${this.circleId}/settings`, {
            need_verification: this.circleSettings.need_verification,
            verification_questions: this.circleSettings.verification_questions
          }, {
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });
        }
        
        uni.showToast({
          title: '修改成功',
          icon: 'success'
        });
        
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } catch (error) {
        console.error('修改圈子信息失败', error);
        uni.showToast({
          title: error.response?.data?.msg || '修改失败，请重试',
          icon: 'none'
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-circle-container {
  display: flex;
  flex-direction: column;
//   height: 100vh;
  background-color: rgb(255, 248, 234);
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  padding-top: 20rpx;
}

.form-scroll {
  flex: 1;
  padding: 0 30rpx;
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

.form-input:disabled {
  background-color: #f0f0f0;
  color: #999;
}

.tip-text {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
  display: block;
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

.setting-item {
  background-color: #f8f8f8;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.setting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.setting-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.setting-desc {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 20rpx;
  display: block;
}

.verification-questions {
  margin-top: 20rpx;
}

.question-label {
  font-size: 26rpx;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
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
  box-shadow: 0 4rpx 12rpx rgba(234, 112, 52, 0.3);
}

.submit-btn.disabled {
  background-color: #ccc;
  box-shadow: none;
}
</style> 