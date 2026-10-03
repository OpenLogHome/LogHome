<template>
  <div class="friends-page">
    <div class="page-header">
      <nuxt-link :to="backTarget" class="back-link">
        <span class="back-icon">←</span> {{ isSelf ? '返回个人中心' : '返回用户主页' }}
      </nuxt-link>
      <h1 class="page-title">{{ isSelf ? '我的好友' : 'TA的关注关系' }}</h1>
    </div>

    <div class="friends-card">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="好友" name="friends">
          <div class="tab-body" v-loading="loading">
            <div class="empty-state" v-if="!loading && friendsList.length === 0">
              <img src="/nothing.png" alt="暂无内容" class="empty-image">
              <p>{{ isSelf ? '还没有互相关注的好友，去关注别人吧' : 'TA还没有互相关注的好友' }}</p>
            </div>
            <div class="user-grid">
              <div class="user-card" v-for="item in friendsList" :key="item.user_id">
                <img
                  class="avatar"
                  :src="item.avatar_url || '/default-avatar.png'"
                  :alt="item.name"
                  @click="gotoUserProfile(item.user_id)"
                  @error="$event.target.src = '/default-avatar.png'"
                >
                <div class="user-meta">
                  <span class="name" @click="gotoUserProfile(item.user_id)">{{ item.name }}</span>
                  <span class="motto">{{ item.motto || '这个人很懒，什么都没留下...' }}</span>
                </div>
                <div class="user-actions">
                  <el-button size="mini" @click="sendPrivateMessage(item.user_id)">私信</el-button>
                  <el-button v-if="isSelf" size="mini" type="primary" plain :loading="followLoadingId === item.user_id" @click="toggleFollow(item)">已互关</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="`粉丝 (${fansList.length})`" name="fans">
          <div class="tab-body" v-loading="loading">
            <div class="empty-state" v-if="!loading && fansList.length === 0">
              <img src="/nothing.png" alt="暂无内容" class="empty-image">
              <p>{{ isSelf ? '还没有人关注你' : '还没有人关注TA' }}</p>
            </div>
            <div class="user-grid">
              <div class="user-card" v-for="item in fansList" :key="item.user_id">
                <img
                  class="avatar"
                  :src="item.avatar_url || '/default-avatar.png'"
                  :alt="item.name"
                  @click="gotoUserProfile(item.user_id)"
                  @error="$event.target.src = '/default-avatar.png'"
                >
                <div class="user-meta">
                  <span class="name" @click="gotoUserProfile(item.user_id)">{{ item.name }}</span>
                  <span class="motto">{{ item.motto || '这个人很懒，什么都没留下...' }}</span>
                </div>
                <div class="user-actions">
                  <el-button size="mini" @click="sendPrivateMessage(item.user_id)">私信</el-button>
                  <el-button
                    v-if="isSelf"
                    size="mini"
                    :type="isFollowing(item.user_id) ? '' : 'primary'"
                    :plain="isFollowing(item.user_id)"
                    :loading="followLoadingId === item.user_id"
                    @click="toggleFollow(item)"
                  >
                    {{ isFollowing(item.user_id) ? '互相关注' : '关注' }}
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="`关注 (${followsList.length})`" name="follows">
          <div class="tab-body" v-loading="loading">
            <div class="empty-state" v-if="!loading && followsList.length === 0">
              <img src="/nothing.png" alt="暂无内容" class="empty-image">
              <p>{{ isSelf ? '你还没有关注任何人' : 'TA还没有关注任何人' }}</p>
            </div>
            <div class="user-grid">
              <div class="user-card" v-for="item in followsList" :key="item.user_id">
                <img
                  class="avatar"
                  :src="item.avatar_url || '/default-avatar.png'"
                  :alt="item.name"
                  @click="gotoUserProfile(item.user_id)"
                  @error="$event.target.src = '/default-avatar.png'"
                >
                <div class="user-meta">
                  <span class="name" @click="gotoUserProfile(item.user_id)">{{ item.name }}</span>
                  <span class="motto">{{ item.motto || '这个人很懒，什么都没留下...' }}</span>
                </div>
                <div class="user-actions">
                  <el-button size="mini" @click="sendPrivateMessage(item.user_id)">私信</el-button>
                  <el-button
                    v-if="isSelf"
                    size="mini"
                    :plain="isFan(item.user_id)"
                    :loading="followLoadingId === item.user_id"
                    @click="toggleFollow(item)"
                  >
                    {{ isFan(item.user_id) ? '已互关' : '已关注' }}
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'default',
  data() {
    return {
      activeTab: 'friends',
      userId: null,
      isSelf: true,
      fansList: [],
      followsList: [],
      loading: false,
      followLoadingId: null
    }
  },
  computed: {
    backTarget() {
      return this.isSelf ? '/me' : `/users/${this.userId}`
    },
    // 后端没有可靠的互关接口，用粉丝和关注两个列表求交集
    friendsList() {
      const followIds = new Set(this.followsList.map(item => String(item.user_id)))
      return this.fansList.filter(item => followIds.has(String(item.user_id)))
    }
  },
  async mounted() {
    if (!localStorage.getItem('token')) {
      this.$message.warning('请先登录')
      this.$router.push('/login')
      return
    }

    const queryTab = this.$route.query.tab
    if (queryTab === '0') this.activeTab = 'follows'
    else if (queryTab === '1') this.activeTab = 'fans'
    else if (['friends', 'fans', 'follows'].includes(queryTab)) this.activeTab = queryTab

    try {
      const myUserId = Number((await this.$api.users.getUserProfile()).user_id)
      // 支持从他人主页带入 id 查看 TA 的关注关系，默认看自己
      this.userId = Number(this.$route.query.id) || myUserId
      this.isSelf = this.userId === myUserId
    } catch (error) {
      console.error('获取用户信息失败', error)
      localStorage.removeItem('token')
      this.$router.push('/login?msg=unAuthorized')
      return
    }

    this.loadRelations()
  },
  methods: {
    async loadRelations() {
      this.loading = true
      try {
        const [fansResponse, followsResponse] = await Promise.all([
          this.$api.users.getUserFans(this.userId),
          this.$api.users.getUserFollows(this.userId)
        ])
        this.fansList = (fansResponse.data || []).map(item => ({
          ...item,
          user_id: Number(item.user_id)
        }))
        // 关注列表返回的是 follow_id，统一成 user_id 供模板使用
        this.followsList = (followsResponse.data || []).map(item => ({
          ...item,
          user_id: Number(item.follow_id)
        }))
      } catch (error) {
        console.error('获取关注关系失败', error)
        this.$message.error('好友信息加载失败')
      } finally {
        this.loading = false
      }
    },
    isFollowing(userId) {
      return this.followsList.some(item => item.user_id === Number(userId))
    },
    isFan(userId) {
      return this.fansList.some(item => item.user_id === Number(userId))
    },
    async toggleFollow(user) {
      this.followLoadingId = user.user_id
      try {
        const following = this.isFollowing(user.user_id)
        const response = following
          ? await this.$api.users.unfollowUser(user.user_id)
          : await this.$api.users.followUser(user.user_id)
        if (response.code !== 0) throw new Error(response.message || '操作失败')

        this.$message.success(following ? '已取消关注' : '关注成功')
        await this.loadRelations()
      } catch (error) {
        console.error('关注操作失败', error)
        this.$message.error('操作失败，请重试')
      } finally {
        this.followLoadingId = null
      }
    },
    gotoUserProfile(userId) {
      this.$router.push(`/users/${userId}`)
    },
    sendPrivateMessage(userId) {
      this.$router.push(`/community/chat?id=${userId}`)
    }
  },
  head() {
    return {
      title: (this.isSelf ? '我的好友' : 'TA的关注关系') + ' - 原木社区'
    }
  }
}
</script>

<style lang="scss" scoped>
.friends-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 16px;

  .back-link {
    font-size: 14px;
    color: #947358;

    .back-icon {
      margin-right: 4px;
    }
  }

  .page-title {
    font-size: 22px;
    color: #333;
    margin: 12px 0 0;
  }
}

.friends-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 0 20px 20px;
}

.tab-body {
  min-height: 200px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  color: #999;

  .empty-image {
    width: 120px;
    margin-bottom: 12px;
  }
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 15px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;

  &:hover {
    border-color: #e0d5c8;
    background: #faf8f5;
  }

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    cursor: pointer;
    background: #f5f5f5;
  }

  .user-meta {
    flex: 1;
    min-width: 0;

    .name {
      display: block;
      font-size: 15px;
      color: #333;
      font-weight: 500;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .motto {
      display: block;
      font-size: 12px;
      color: #999;
      margin-top: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .user-actions {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex-shrink: 0;
  }
}
</style>
