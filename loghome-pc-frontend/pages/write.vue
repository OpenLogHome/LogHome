<template>
  <div class="write-page">
    <div class="page-header">
      <h1 class="page-title">创作中心</h1>
    </div>

    <div class="write-container">
      <div class="works-section">
        <div class="section-header">
          <h2 class="section-title">我的作品</h2>
          <button class="new-button">+ 创建新作品</button>
        </div>

        <div class="tabs">
          <button class="tab-button" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">全部作品</button>
          <button class="tab-button" :class="{ active: activeTab === 'ongoing' }" @click="activeTab = 'ongoing'">连载中</button>
          <button class="tab-button" :class="{ active: activeTab === 'completed' }" @click="activeTab = 'completed'">已完结</button>
          <button class="tab-button" :class="{ active: activeTab === 'draft' }" @click="activeTab = 'draft'">草稿箱</button>
        </div>

        <div class="works-list">
          <div class="work-empty" v-if="!works.length">
            <div class="empty-icon">📝</div>
            <h3 class="empty-title">您还没有创建任何作品</h3>
            <p class="empty-desc">点击"创建新作品"按钮开始您的创作之旅</p>
            <button class="empty-button">+ 立即创建</button>
          </div>

          <div class="work-item" v-for="work in works" :key="work.id">
            <div class="work-cover" :style="`background-color: ${work.color}`">
              <span class="work-category">{{work.category}}</span>
            </div>
            <div class="work-info">
              <h3 class="work-title">{{work.title}}</h3>
              <p class="work-stats">
                <span>{{work.status}}</span>
                <span>{{work.wordCount}}字</span>
                <span>{{work.chapterCount}}章</span>
              </p>
              <p class="work-desc">{{work.description}}</p>
              <p class="work-update">最近更新: {{work.lastUpdate}}</p>
              <div class="work-actions">
                <button class="work-action primary">继续创作</button>
                <button class="work-action">编辑信息</button>
                <button class="work-action">管理章节</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="sidebar">
        <div class="sidebar-section">
          <h3 class="sidebar-title">创作数据</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{stats.totalWorks}}</div>
              <div class="stat-label">作品总数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{stats.totalWords}}</div>
              <div class="stat-label">总字数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{stats.totalViews}}</div>
              <div class="stat-label">总浏览量</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{stats.totalFavorites}}</div>
              <div class="stat-label">总收藏</div>
            </div>
          </div>
        </div>

        <div class="sidebar-section">
          <h3 class="sidebar-title">创作指南</h3>
          <ul class="guide-list">
            <li class="guide-item">
              <nuxt-link to="/guide/getting-started" class="guide-link">新手入门指南</nuxt-link>
            </li>
            <li class="guide-item">
              <nuxt-link to="/guide/plot-development" class="guide-link">如何构思情节</nuxt-link>
            </li>
            <li class="guide-item">
              <nuxt-link to="/guide/character-creation" class="guide-link">角色塑造技巧</nuxt-link>
            </li>
            <li class="guide-item">
              <nuxt-link to="/guide/writing-style" class="guide-link">提升写作风格</nuxt-link>
            </li>
            <li class="guide-item">
              <nuxt-link to="/guide/publishing" class="guide-link">作品发布与推广</nuxt-link>
            </li>
          </ul>
        </div>

        <div class="sidebar-section">
          <h3 class="sidebar-title">创作活动</h3>
          <div class="activity-list">
            <div class="activity-item">
              <h4 class="activity-title">春季创作大赛</h4>
              <p class="activity-desc">参与春季创作大赛，赢取丰厚奖金和推荐位展示</p>
              <p class="activity-date">截止日期: 2023-05-30</p>
              <nuxt-link to="/activity/spring-contest" class="activity-link">查看详情</nuxt-link>
            </div>
            <div class="activity-item">
              <h4 class="activity-title">科幻题材征文</h4>
              <p class="activity-desc">优秀科幻作品征集，入选作品将获得专业编辑指导</p>
              <p class="activity-date">截止日期: 2023-06-15</p>
              <nuxt-link to="/activity/scifi-contest" class="activity-link">查看详情</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: '创作中心 - 原木社区'
    }
  },
  data() {
    return {
      activeTab: 'all',
      works: [
        {
          id: 1,
          title: '星际迷航：新纪元',
          status: '连载中',
          category: '科幻',
          wordCount: '128,500',
          chapterCount: 35,
          description: '一部跨越星际的冒险故事，主角在探索宇宙奥秘的同时，也发现了人类文明的真相...',
          lastUpdate: '2023-04-05',
          color: '#a8d8ea'
        },
        {
          id: 2,
          title: '魔法学院：元素觉醒',
          status: '草稿',
          category: '奇幻',
          wordCount: '45,200',
          chapterCount: 12,
          description: '少年意外觉醒了远古元素魔法，被迫卷入了一场关乎魔法世界存亡的战争...',
          lastUpdate: '2023-03-28',
          color: '#aa96da'
        }
      ],
      stats: {
        totalWorks: 2,
        totalWords: '173,700',
        totalViews: '8,542',
        totalFavorites: 326
      }
    }
  }
}
</script>

<style>
.write-page {
  width: 100%;
}

.page-header {
  margin-bottom: 30px;
}

.page-title {
  font-size: 32px;
  color: #704C35;
}

.write-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 24px;
  color: #704C35;
  margin: 0;
}

.new-button {
  background-color: #947358;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.new-button:hover {
  background-color: #704C35;
}

.tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.tab-button {
  padding: 10px 20px;
  background: none;
  border: none;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;
}

.tab-button:hover {
  color: #947358;
}

.tab-button.active {
  color: #947358;
  font-weight: 600;
}

.tab-button.active:after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #947358;
  display: block;
}

.work-empty {
  background-color: white;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-title {
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

.empty-desc {
  color: #666;
  margin-bottom: 25px;
}

.empty-button {
  background-color: #FB7D46;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 30px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.empty-button:hover {
  background-color: #fa6c2e;
}

.work-item {
  display: flex;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.work-cover {
  width: 150px;
  position: relative;
  flex-shrink: 0;
}

.work-category {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.work-info {
  flex-grow: 1;
  padding: 20px;
}

.work-title {
  font-size: 20px;
  color: #704C35;
  margin: 0 0 10px;
}

.work-stats {
  display: flex;
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}

.work-stats span {
  margin-right: 15px;
}

.work-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
}

.work-update {
  color: #888;
  font-size: 13px;
  margin-bottom: 15px;
}

.work-actions {
  display: flex;
  gap: 10px;
}

.work-action {
  padding: 8px 15px;
  border-radius: 4px;
  background-color: #f5f5f5;
  border: none;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.work-action:hover {
  background-color: #e0e0e0;
}

.work-action.primary {
  background-color: #FB7D46;
  color: white;
}

.work-action.primary:hover {
  background-color: #fa6c2e;
}

.sidebar-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sidebar-title {
  font-size: 18px;
  margin-bottom: 15px;
  color: #704C35;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.stat-item {
  text-align: center;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #947358;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.guide-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.guide-item {
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.guide-item:last-child {
  border-bottom: none;
}

.guide-link {
  color: #947358;
  text-decoration: none;
  transition: color 0.3s ease;
}

.guide-link:hover {
  color: #704C35;
  text-decoration: underline;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border-left: 3px solid #947358;
}

.activity-title {
  font-size: 16px;
  color: #333;
  margin: 0 0 10px;
}

.activity-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 10px;
  line-height: 1.4;
}

.activity-date {
  font-size: 13px;
  color: #888;
  margin: 0 0 10px;
}

.activity-link {
  display: inline-block;
  color: #947358;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}

.activity-link:hover {
  text-decoration: underline;
}

@media (max-width: 992px) {
  .write-container {
    grid-template-columns: 1fr;
  }
  
  .work-cover {
    width: 100px;
  }
}

@media (max-width: 576px) {
  .work-item {
    flex-direction: column;
  }
  
  .work-cover {
    width: 100%;
    height: 140px;
  }
  
  .work-actions {
    flex-wrap: wrap;
  }
  
  .work-action {
    flex: 1 0 auto;
  }
}
</style> 