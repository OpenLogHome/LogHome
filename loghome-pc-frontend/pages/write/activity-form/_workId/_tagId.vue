<template>
  <div class="activity-form-page">
    <div class="form-header">
      <button class="back-button" @click="goBack">返回</button>
      <h1 class="form-title">{{ currentActivity ? currentActivity.activity_name : '活动信息填写' }}</h1>
    </div>

    <div class="form-container" v-if="currentActivity && currentActivity.required_fields">
      <div class="form-content">
        <div class="form-fields">
          <div v-for="field in currentActivity.required_fields" :key="field.name" class="form-field">
            <label class="field-label">
              {{ field.name }}
              <span v-if="field.required" class="required-mark">*</span>
            </label>
            
            <!-- 统一使用input输入框，与移动端保持一致 -->
            <input 
              class="form-input"
              v-model="activityFormData[field.name]"
              :placeholder="field.placeholder || '请输入' + field.name"
              :maxlength="field.maxLength"
            />
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="cancel-button" @click="goBack">取消</button>
          <button type="button" class="submit-button" @click="submitActivityForm" :disabled="submitting">
            {{ submitting ? '提交中...' : '提交' }}
          </button>
        </div>
      </div>
    </div>

    <div class="loading-state" v-else-if="loading">
      <div class="loading-spinner"></div>
      <p>正在加载活动信息...</p>
    </div>

    <div class="error-state" v-else-if="error">
      <div class="error-icon">❌</div>
      <h3>加载失败</h3>
      <p>{{error}}</p>
      <button @click="loadActivityInfo">重试</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivityForm',
  data() {
    return {
      currentActivity: null,
      activityFormData: {},
      loading: true,
      error: null,
      submitting: false
    }
  },
  async mounted() {
    await this.loadActivityInfo()
  },
  methods: {
    async loadActivityInfo() {
      try {
        this.loading = true
        this.error = null
        
        const workId = this.$route.params.workId
        const tagId = this.$route.params.tagId
        
        const response = await this.$api.essays.getNovelActivity(workId)
        if (response) {
          const activity = response.activities.find(a => a.tag_id == tagId)
          if (activity) {
            this.currentActivity = activity
            // 如果已有填写的数据，预填充表单
            if (response.userInfo && response.userInfo.length > 0) {
              const existingInfo = response.userInfo.find(info => info.tag_id == tagId)
              if (existingInfo) {
                try {
                  this.activityFormData = existingInfo.information_data ? JSON.parse(existingInfo.information_data) : {}
                } catch (e) {
                  console.error('解析已填写的表单数据失败:', e)
                  this.activityFormData = {}
                }
              } else {
                this.activityFormData = {}
              }
            } else {
              this.activityFormData = {}
            }
          } else {
            this.error = '未找到对应的活动信息'
          }
        } else {
          this.error = '加载活动信息失败'
        }
      } catch (error) {
        console.error('加载活动信息失败:', error)
        this.error = '网络错误，请重试'
      } finally {
        this.loading = false
      }
    },
    
    async submitActivityForm() {
      try {
        // 验证必填字段
        if (this.currentActivity?.required_fields) {
          for (const field of this.currentActivity.required_fields) {
            if (field.required && (!this.activityFormData[field.name] || this.activityFormData[field.name].toString().trim() === '')) {
              this.$message.error(`请填写${field.name}`)
              return
            }
          }
        }

        this.submitting = true
        
        const workId = this.$route.params.workId
        const tagId = this.$route.params.tagId
        
        const response = await this.$api.essays.submitActivityInfo(workId, tagId, this.activityFormData)
        
        if (response.success === true) {
          this.$message.success('提交成功！')
          this.goBack()
        } else {
          this.$message.error(response.message || '提交失败，请重试')
        }
      } catch (error) {
        console.error('提交表单失败:', error)
        this.$message.error('网络错误，请重试')
      } finally {
        this.submitting = false
      }
    },
    
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-form-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

.form-header {
  width: 100%;
  max-width: 600px;
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.back-button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 16px;
  margin-right: 16px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s;
  
  &:hover {
    background: #f8f9fa;
    transform: translateX(-2px);
  }
}

.form-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  text-align: center;
  flex: 1;
}

.form-container {
  width: 100%;
  max-width: 600px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-content {
  padding: 40px;
  
  .form-fields {
    .form-field {
      margin-bottom: 24px;
    }
    
    .field-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
      font-size: 15px;
    }
    
    .required-mark {
      color: #dc3545;
      margin-left: 2px;
    }
    
    .form-input {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 15px;
      transition: all 0.3s ease;
      background: #fafbfc;
      
      &:focus {
        outline: none;
        border-color: #007bff;
        background: white;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        transform: translateY(-1px);
      }
      
      &:hover {
        border-color: #007bff;
        background: white;
      }
    }
  }
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid #e9ecef;
}

.cancel-button,
.submit-button {
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.cancel-button {
  background: white;
  border: 2px solid #e9ecef;
  color: #666;
  
  &:hover {
    background: #f8f9fa;
    border-color: #007bff;
    color: #007bff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.submit-button {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border: 2px solid #007bff;
  color: white;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}

.loading-state,
.error-state {
  width: 100%;
  max-width: 600px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 80px 40px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 24px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.error-state h3 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 20px;
}

.error-state p {
  margin: 0 0 24px 0;
  color: #666;
  font-size: 16px;
}

.error-state button {
  padding: 12px 24px;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .activity-form-page {
    padding: 20px 16px;
  }
  
  .form-header {
    padding: 16px;
    margin-bottom: 24px;
  }
  
  .form-title {
    font-size: 20px;
  }
  
  .form-content {
    padding: 24px;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 12px;
  }
  
  .cancel-button,
  .submit-button {
    width: 100%;
  }
  
  .loading-state,
  .error-state {
    padding: 60px 24px;
  }
}
</style>