<template>
  <view class="keyword-manage-container">
    <view class="section-title">搜索关键词管理</view>
    
    <!-- 添加关键词表单 -->
    <view class="add-keyword-form">
      <view class="form-header">添加推荐关键词</view>
      <view class="form-row">
        <view class="form-label">关键词:</view>
        <input class="form-input" v-model="newKeyword.keyword" placeholder="输入关键词" />
      </view>
      <view class="form-row">
        <view class="form-label">分类:</view>
        <picker class="form-picker" :range="categoryOptions" @change="onCategoryChange">
          <view class="picker-value">{{categoryOptions[selectedCategoryIndex]}}</view>
        </picker>
      </view>
      <view class="form-row">
        <view class="form-label">推荐:</view>
        <switch :checked="newKeyword.is_recommended" @change="onRecommendedChange" />
      </view>
      <button class="form-button" @tap="addRecommendKeyword">添加</button>
    </view>

    <!-- 关键词列表 -->
    <view class="keyword-list">
      <view class="list-header">
        <view class="header-item">关键词</view>
        <view class="header-item">搜索次数</view>
        <view class="header-item">分类</view>
        <view class="header-item">推荐</view>
        <view class="header-item">操作</view>
      </view>
      <scroll-view scroll-y class="list-scroll" @scrolltolower="loadMoreKeywords">
        <view class="list-row" v-for="(keyword, index) in keywords" :key="index">
          <view class="row-item keyword">{{keyword.keyword}}</view>
          <view class="row-item count">{{keyword.search_count}}</view>
          <view class="row-item category">{{getCategoryName(keyword.category)}}</view>
          <view class="row-item recommended">
            <checkbox :checked="keyword.is_recommended === 1" disabled />
          </view>
          <view class="row-item actions">
            <view class="action-button edit" @tap="editKeyword(keyword)">编辑</view>
            <view class="action-button delete" @tap="deleteKeyword(keyword)">删除</view>
          </view>
        </view>
        <uni-load-more :status="loadingStatus"></uni-load-more>
      </scroll-view>
    </view>

    <!-- 编辑弹窗 -->
    <uni-popup ref="editPopup" type="dialog">
      <view class="edit-popup">
        <view class="popup-title">编辑关键词</view>
        <view class="form-row">
          <view class="form-label">关键词:</view>
          <input class="form-input" v-model="editingKeyword.keyword" placeholder="关键词" disabled />
        </view>
        <view class="form-row">
          <view class="form-label">分类:</view>
          <picker class="form-picker" :range="categoryOptions" :value="getEditingCategoryIndex()" @change="onEditingCategoryChange">
            <view class="picker-value">{{getCategoryName(editingKeyword.category)}}</view>
          </picker>
        </view>
        <view class="form-row">
          <view class="form-label">推荐:</view>
          <switch :checked="editingKeyword.is_recommended === 1" @change="onEditingRecommendedChange" />
        </view>
        <view class="popup-buttons">
          <button class="cancel-button" @tap="closeEditPopup">取消</button>
          <button class="confirm-button" @tap="saveEditingKeyword">保存</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      keywords: [],
      page: 1,
      pageSize: 20,
      hasMore: true,
      loadingStatus: 'more',
      categoryOptions: ['全部', '书籍', '帖子', '圈子', '用户'],
      categoryValues: ['all', 'books', 'posts', 'circles', 'users'],
      selectedCategoryIndex: 0,
      newKeyword: {
        keyword: '',
        category: 'all',
        is_recommended: true
      },
      editingKeyword: {
        keyword_id: 0,
        keyword: '',
        category: 'all',
        is_recommended: 1
      }
    };
  },
  
  onLoad() {
    this.loadKeywords();
  },
  
  methods: {
    // 加载关键词列表
    async loadKeywords() {
      if (!this.hasMore || this.loadingStatus === 'loading') return;
      
      this.loadingStatus = 'loading';
      try {
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
        const res = await axios.get(this.$baseUrl + '/community/search/admin/keywords', {
          params: {
            page: this.page,
            pageSize: this.pageSize
          },
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        
        if (res.data.list && res.data.list.length > 0) {
          if (this.page === 1) {
            this.keywords = res.data.list;
          } else {
            this.keywords = [...this.keywords, ...res.data.list];
          }
          this.page++;
          this.hasMore = this.keywords.length < res.data.total;
          this.loadingStatus = this.hasMore ? 'more' : 'noMore';
        } else {
          this.hasMore = false;
          this.loadingStatus = 'noMore';
        }
      } catch (error) {
        console.error('加载关键词失败', error);
        uni.showToast({
          title: '加载失败，请检查权限',
          icon: 'none'
        });
        this.loadingStatus = 'more';
      }
    },
    
    // 加载更多关键词
    loadMoreKeywords() {
      if (this.hasMore) {
        this.loadKeywords();
      }
    },
    
    // 添加推荐关键词
    async addRecommendKeyword() {
      if (!this.newKeyword.keyword.trim()) {
        uni.showToast({
          title: '关键词不能为空',
          icon: 'none'
        });
        return;
      }
      
      try {
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
        await axios.post(this.$baseUrl + '/community/search/recommend', {
          keyword: this.newKeyword.keyword,
          category: this.newKeyword.category,
          is_recommended: this.newKeyword.is_recommended ? 1 : 0
        }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        
        uni.showToast({
          title: '添加成功',
          icon: 'success'
        });
        
        // 重置表单并刷新列表
        this.newKeyword.keyword = '';
        this.newKeyword.category = 'all';
        this.selectedCategoryIndex = 0;
        this.newKeyword.is_recommended = true;
        this.page = 1;
        this.hasMore = true;
        this.keywords = [];
        this.loadKeywords();
      } catch (error) {
        console.error('添加关键词失败', error);
        uni.showToast({
          title: '添加失败，请检查权限',
          icon: 'none'
        });
      }
    },
    
    // 删除关键词
    deleteKeyword(keyword) {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除关键词"${keyword.keyword}"吗？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              const token = JSON.parse(window.localStorage.getItem('token')).tk;
              await axios.delete(`${this.$baseUrl}/community/search/keyword/${keyword.keyword_id}`, {
                headers: {
                  'Authorization': 'Bearer ' + token
                }
              });
              
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              });
              
              // 从列表中移除
              this.keywords = this.keywords.filter(item => item.keyword_id !== keyword.keyword_id);
            } catch (error) {
              console.error('删除关键词失败', error);
              uni.showToast({
                title: '删除失败，请检查权限',
                icon: 'none'
              });
            }
          }
        }
      });
    },
    
    // 打开编辑弹窗
    editKeyword(keyword) {
      this.editingKeyword = { ...keyword };
      this.$refs.editPopup.open();
    },
    
    // 关闭编辑弹窗
    closeEditPopup() {
      this.$refs.editPopup.close();
    },
    
    // 保存编辑的关键词
    async saveEditingKeyword() {
      try {
        const token = JSON.parse(window.localStorage.getItem('token')).tk;
        await axios.post(this.$baseUrl + '/community/search/recommend', {
          keyword: this.editingKeyword.keyword,
          category: this.editingKeyword.category,
          is_recommended: this.editingKeyword.is_recommended
        }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        
        uni.showToast({
          title: '更新成功',
          icon: 'success'
        });
        
        // 更新列表中的数据
        const index = this.keywords.findIndex(item => item.keyword_id === this.editingKeyword.keyword_id);
        if (index !== -1) {
          this.keywords[index] = { ...this.editingKeyword };
        }
        
        this.closeEditPopup();
      } catch (error) {
        console.error('更新关键词失败', error);
        uni.showToast({
          title: '更新失败，请检查权限',
          icon: 'none'
        });
      }
    },
    
    // 选择分类变化
    onCategoryChange(e) {
      this.selectedCategoryIndex = e.detail.value;
      this.newKeyword.category = this.categoryValues[this.selectedCategoryIndex];
    },
    
    // 推荐状态变化
    onRecommendedChange(e) {
      this.newKeyword.is_recommended = e.detail.value;
    },
    
    // 编辑中的分类变化
    onEditingCategoryChange(e) {
      const index = e.detail.value;
      this.editingKeyword.category = this.categoryValues[index];
    },
    
    // 编辑中的推荐状态变化
    onEditingRecommendedChange(e) {
      this.editingKeyword.is_recommended = e.detail.value ? 1 : 0;
    },
    
    // 获取分类名称
    getCategoryName(category) {
      const index = this.categoryValues.indexOf(category);
      return index !== -1 ? this.categoryOptions[index] : '全部';
    },
    
    // 获取编辑中的分类索引
    getEditingCategoryIndex() {
      return this.categoryValues.indexOf(this.editingKeyword.category);
    }
  }
};
</script>

<style lang="scss" scoped>
.keyword-manage-container {
  padding: 30rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
}

.add-keyword-form {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.form-header {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.form-label {
  width: 120rpx;
  font-size: 28rpx;
}

.form-input {
  flex: 1;
  height: 72rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

.form-picker {
  flex: 1;
  height: 72rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
}

.picker-value {
  font-size: 28rpx;
}

.form-button {
  background-color: #EA7034;
  color: #fff;
  border-radius: 8rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  margin-top: 20rpx;
}

.keyword-list {
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.list-header {
  display: flex;
  padding: 20rpx;
  background-color: #f8f8f8;
  border-bottom: 1px solid #eee;
}

.header-item {
  flex: 1;
  font-size: 28rpx;
  font-weight: bold;
  text-align: center;
}

.list-scroll {
  height: 800rpx;
}

.list-row {
  display: flex;
  padding: 20rpx;
  border-bottom: 1px solid #f0f0f0;
}

.row-item {
  flex: 1;
  font-size: 28rpx;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.keyword {
  flex: 1.5;
}

.actions {
  display: flex;
  justify-content: center;
}

.action-button {
  padding: 6rpx 16rpx;
  margin: 0 10rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
}

.edit {
  background-color: #f8f8f8;
  color: #333;
}

.delete {
  background-color: #ffebeb;
  color: #ff5252;
}

.edit-popup {
  background-color: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
  width: 600rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
  text-align: center;
}

.popup-buttons {
  display: flex;
  margin-top: 30rpx;
}

.cancel-button, .confirm-button {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 28rpx;
  border-radius: 8rpx;
  margin: 0 10rpx;
}

.cancel-button {
  background-color: #f8f8f8;
  color: #333;
}

.confirm-button {
  background-color: #EA7034;
  color: #fff;
}
</style> 