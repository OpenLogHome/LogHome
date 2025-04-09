<template>
  <div class="community-page">
    <div class="page-header">
      <h1 class="page-title">作者社区</h1>
    </div>

    <div class="community-container">
      <div class="main-content">
        <div class="tabs">
          <button class="tab-button" :class="{ active: activeTab === 'hot' }" @click="activeTab = 'hot'">热门讨论</button>
          <button class="tab-button" :class="{ active: activeTab === 'new' }" @click="activeTab = 'new'">最新话题</button>
          <button class="tab-button" :class="{ active: activeTab === 'featured' }" @click="activeTab = 'featured'">精选帖子</button>
          <button class="tab-button" :class="{ active: activeTab === 'creation' }" @click="activeTab = 'creation'">创作交流</button>
        </div>

        <div class="action-bar">
          <button class="post-button">+ 发布新话题</button>
          <div class="filter-control">
            <select class="filter-select">
              <option value="">全部分类</option>
              <option value="creation">创作讨论</option>
              <option value="review">书评</option>
              <option value="share">心得分享</option>
              <option value="advice">求助/建议</option>
              <option value="chat">闲聊</option>
            </select>
          </div>
        </div>

        <div class="posts-list">
          <div class="post-item" v-for="post in posts" :key="post.id">
            <div class="post-author">
              <div class="author-avatar" :style="`background-color: ${post.authorColor}`">
                {{ post.author.charAt(0) }}
              </div>
              <div class="author-level" :class="'level-' + post.authorLevel">Lv.{{ post.authorLevel }}</div>
            </div>
            <div class="post-content">
              <div class="post-header">
                <h3 class="post-title">
                  <span class="post-tag" :class="'tag-' + post.category">{{ post.categoryText }}</span>
                  <nuxt-link :to="`/community/post/${post.id}`" class="post-title-link">{{ post.title }}</nuxt-link>
                </h3>
                <p class="post-info">
                  <span class="post-author-name">{{ post.author }}</span>
                  <span class="post-time">{{ post.time }}</span>
                </p>
              </div>
              <p class="post-excerpt">{{ post.excerpt }}</p>
              <div class="post-footer">
                <div class="post-stats">
                  <span class="post-views">👁️ {{ post.views }}</span>
                  <span class="post-comments">💬 {{ post.comments }}</span>
                  <span class="post-likes">❤️ {{ post.likes }}</span>
                </div>
                <div class="post-actions">
                  <button class="post-action">收藏</button>
                  <button class="post-action">分享</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pagination">
          <button class="pagination-button">&lt;</button>
          <button class="pagination-button active">1</button>
          <button class="pagination-button">2</button>
          <button class="pagination-button">3</button>
          <span class="pagination-ellipsis">...</span>
          <button class="pagination-button">12</button>
          <button class="pagination-button">&gt;</button>
        </div>
      </div>

      <div class="sidebar">
        <div class="sidebar-section">
          <h3 class="sidebar-title">社区公告</h3>
          <div class="announcements">
            <div class="announcement-item">
              <h4 class="announcement-title">社区规则更新</h4>
              <p class="announcement-content">为了维护良好的社区氛围，我们对社区规则进行了更新...</p>
              <p class="announcement-date">2023-04-10</p>
            </div>
            <div class="announcement-item">
              <h4 class="announcement-title">新功能上线预告</h4>
              <p class="announcement-content">即将推出作品互评系统，帮助作者获得更多有价值的反馈...</p>
              <p class="announcement-date">2023-04-05</p>
            </div>
          </div>
        </div>

        <div class="sidebar-section">
          <h3 class="sidebar-title">活跃作者</h3>
          <ul class="active-authors">
            <li class="author-item" v-for="(author, index) in activeAuthors" :key="index">
              <div class="author-avatar" :style="`background-color: ${author.color}`">
                {{ author.name.charAt(0) }}
              </div>
              <div class="author-info">
                <h4 class="author-name">{{ author.name }}</h4>
                <p class="author-desc">{{ author.desc }}</p>
              </div>
              <button class="follow-button">关注</button>
            </li>
          </ul>
        </div>

        <div class="sidebar-section">
          <h3 class="sidebar-title">热门标签</h3>
          <div class="tag-cloud">
            <nuxt-link v-for="(tag, index) in tags" :key="index" :to="`/community/tag/${tag.id}`" class="tag-link" :style="`font-size: ${tag.size}px`">
              {{ tag.name }}
            </nuxt-link>
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
      title: '作者社区 - 原木社区'
    }
  },
  data() {
    return {
      activeTab: 'hot',
      posts: [
        {
          id: 1,
          title: '如何塑造有深度的小说角色？',
          author: '梦笔生花',
          authorLevel: 5,
          authorColor: '#6a8caf',
          time: '2小时前',
          category: 'creation',
          categoryText: '创作讨论',
          excerpt: '在创作小说时，角色是最重要的元素之一。一个有深度、有魅力的角色能够让读者产生共鸣，从而爱上你的作品。今天我想和大家分享一些关于角色塑造的技巧...',
          views: 328,
          comments: 42,
          likes: 87
        },
        {
          id: 2,
          title: '《星际漫游者》读后感：一场穿越时空的心灵之旅',
          author: '书香客',
          authorLevel: 4,
          authorColor: '#b5a9d3',
          time: '5小时前',
          category: 'review',
          categoryText: '书评',
          excerpt: '最近读完了冯·莫尔的《星际漫游者》，这本科幻小说给我带来了前所未有的阅读体验。作者巧妙地将哲学思考融入科幻元素中，让人不禁思考人类在宇宙中的位置和意义...',
          views: 156,
          comments: 23,
          likes: 45
        },
        {
          id: 3,
          title: '写作瓶颈期，如何突破？求建议！',
          author: '墨客行',
          authorLevel: 3,
          authorColor: '#7fc7af',
          time: '昨天',
          category: 'advice',
          categoryText: '求助/建议',
          excerpt: '最近陷入了严重的写作瓶颈，已经一个月没有更新我的小说了。每次坐在电脑前就感到焦虑，完全无法集中精力进行创作。有经历过类似情况的作者能分享一些突破瓶颈的方法吗？',
          views: 234,
          comments: 56,
          likes: 28
        },
        {
          id: 4,
          title: '分享我的创作心得：如何高效规划连载小说',
          author: '风絮语',
          authorLevel: 6,
          authorColor: '#e6b89c',
          time: '2天前',
          category: 'share',
          categoryText: '心得分享',
          excerpt: '作为一名连载三年的网络小说作者，我积累了一些关于小说规划和高效创作的经验。良好的规划不仅能让写作过程更加顺畅，还能避免后期剧情混乱、人设崩塌等问题...',
          views: 567,
          comments: 89,
          likes: 132
        },
        {
          id: 5,
          title: '新人作者报到，求指点！',
          author: '初心者',
          authorLevel: 1,
          authorColor: '#9ac8eb',
          time: '3天前',
          category: 'chat',
          categoryText: '闲聊',
          excerpt: '大家好，我是新加入这个平台的作者，目前正在筹备一部都市奇幻小说。虽然以前写过一些短篇，但长篇小说还是第一次尝试。希望能在这里结交志同道合的朋友，互相学习进步！',
          views: 128,
          comments: 35,
          likes: 42
        }
      ],
      activeAuthors: [
        {
          name: '梦笔生花',
          desc: '奇幻小说作家，代表作《水晶之约》',
          color: '#6a8caf'
        },
        {
          name: '风絮语',
          desc: '都市言情作家，善于描写情感',
          color: '#e6b89c'
        },
        {
          name: '墨客行',
          desc: '科幻推理作家，脑洞大开',
          color: '#7fc7af'
        }
      ],
      tags: [
        { id: 1, name: '角色塑造', size: 18 },
        { id: 2, name: '情节设计', size: 16 },
        { id: 3, name: '世界观构建', size: 20 },
        { id: 4, name: '科幻', size: 15 },
        { id: 5, name: '奇幻', size: 22 },
        { id: 6, name: '言情', size: 19 },
        { id: 7, name: '悬疑', size: 17 },
        { id: 8, name: '写作技巧', size: 21 },
        { id: 9, name: '心理描写', size: 14 },
        { id: 10, name: '出版经验', size: 16 },
        { id: 11, name: '读书笔记', size: 18 },
        { id: 12, name: '新人求助', size: 15 }
      ]
    }
  }
}
</script>

<style>
.community-page {
  width: 100%;
}

.page-header {
  margin-bottom: 30px;
}

.page-title {
  font-size: 32px;
  color: #704C35;
}

.community-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
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

.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}

.post-button {
  background-color: #FB7D46;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.post-button:hover {
  background-color: #fa6c2e;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #333;
  min-width: 140px;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-item {
  display: flex;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.post-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.post-author {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  border-right: 1px solid #eee;
}

.author-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.author-level {
  display: inline-block;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  color: white;
}

.level-1 {
  background-color: #95a5a6;
}

.level-2 {
  background-color: #3498db;
}

.level-3 {
  background-color: #2ecc71;
}

.level-4 {
  background-color: #f39c12;
}

.level-5 {
  background-color: #e74c3c;
}

.level-6 {
  background-color: #9b59b6;
}

.post-content {
  flex-grow: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.post-header {
  margin-bottom: 15px;
}

.post-title {
  font-size: 18px;
  margin: 0 0 8px;
  color: #2c3e50;
  display: flex;
  align-items: center;
}

.post-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  margin-right: 10px;
  color: white;
}

.tag-creation {
  background-color: #947358;
}

.tag-review {
  background-color: #FB7D46;
}

.tag-share {
  background-color: #2ecc71;
}

.tag-advice {
  background-color: #f39c12;
}

.tag-chat {
  background-color: #95a5a6;
}

.post-title-link {
  color: #2c3e50;
  text-decoration: none;
  transition: color 0.3s ease;
}

.post-title-link:hover {
  color: #947358;
}

.post-info {
  color: #888;
  font-size: 14px;
  margin: 0;
}

.post-author-name {
  font-weight: 600;
  margin-right: 10px;
}

.post-excerpt {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 15px;
  flex-grow: 1;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-stats {
  display: flex;
  gap: 15px;
  color: #888;
  font-size: 14px;
}

.post-actions {
  display: flex;
  gap: 10px;
}

.post-action {
  padding: 5px 10px;
  font-size: 13px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.post-action:hover {
  background-color: #e0e0e0;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  gap: 5px;
}

.pagination-button {
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  background-color: white;
  color: #333;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-button:hover {
  border-color: #947358;
  color: #947358;
}

.pagination-button.active {
  background-color: #947358;
  border-color: #947358;
  color: white;
}

.pagination-ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
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

.announcements {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.announcement-item {
  padding-bottom: 15px;
  border-bottom: 1px solid #f5f5f5;
}

.announcement-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.announcement-title {
  font-size: 16px;
  color: #333;
  margin: 0 0 8px;
}

.announcement-content {
  color: #666;
  font-size: 14px;
  line-height: 1.4;
  margin: 0 0 8px;
}

.announcement-date {
  color: #888;
  font-size: 13px;
  margin: 0;
}

.active-authors {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.author-item {
  display: flex;
  align-items: center;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin-right: 12px;
  flex-shrink: 0;
}

.author-info {
  flex-grow: 1;
}

.author-name {
  font-size: 15px;
  color: #333;
  margin: 0 0 5px;
}

.author-desc {
  font-size: 13px;
  color: #888;
  margin: 0;
}

.follow-button {
  background-color: transparent;
  border: 1px solid #947358;
  color: #947358;
  border-radius: 4px;
  padding: 3px 10px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.follow-button:hover {
  background-color: #947358;
  color: white;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-link {
  display: inline-block;
  color: #947358;
  text-decoration: none;
  padding: 5px 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.tag-link:hover {
  background-color: #947358;
  color: white;
}

@media (max-width: 992px) {
  .community-container {
    grid-template-columns: 1fr;
  }
  
  .post-author {
    padding: 15px;
  }
  
  .author-avatar {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
}

@media (max-width: 768px) {
  .post-item {
    flex-direction: column;
  }
  
  .post-author {
    flex-direction: row;
    justify-content: flex-start;
    padding: 15px;
    gap: 10px;
  }
  
  .author-avatar {
    margin-bottom: 0;
  }
  
  .tabs {
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 5px;
  }
}
</style> 