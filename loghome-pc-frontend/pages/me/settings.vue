<template>
  <div class="settings-page">
    <div class="page-header">
      <nuxt-link to="/me" class="back-link">
        <span class="back-icon">←</span> 返回个人中心
      </nuxt-link>
      <h1 class="page-title">账号设置</h1>
    </div>

    <div class="settings-card">
      <h2 class="section-title">个人资料</h2>
      <el-form label-width="90px" size="small" class="profile-form">
        <el-form-item label="昵称">
          <el-input v-model="form.name" maxlength="20" show-word-limit placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="个性签名">
          <el-input
            v-model="form.motto"
            type="textarea"
            :rows="2"
            maxlength="30"
            show-word-limit
            placeholder="写点什么让别人认识你"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="savingProfile" @click="saveProfile">保存资料</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="settings-card">
      <h2 class="section-title">头像与封面</h2>
      <div class="image-settings">
        <div class="image-block">
          <div class="image-label">头像</div>
          <img class="avatar-preview" :src="form.avatar_url || '/default-avatar.png'" alt="头像"
            @error="$event.target.src = '/default-avatar.png'">
          <el-upload
            action=""
            :show-file-list="false"
            :auto-upload="false"
            accept="image/*"
            :on-change="file => handleImageChange(file, 'avatar')"
          >
            <el-button size="mini" :loading="uploading === 'avatar'">更换头像</el-button>
          </el-upload>
        </div>
        <div class="image-block cover">
          <div class="image-label">个人主页封面</div>
          <img class="cover-preview" :src="form.top_pic_url || defaultCover" alt="封面"
            @error="$event.target.src = defaultCover">
          <el-upload
            action=""
            :show-file-list="false"
            :auto-upload="false"
            accept="image/*"
            :on-change="file => handleImageChange(file, 'cover')"
          >
            <el-button size="mini" :loading="uploading === 'cover'">更换封面</el-button>
          </el-upload>
        </div>
      </div>
      <p class="tip">图片会被压缩后上传，建议 JPG/PNG，单张不超过 5MB。</p>
    </div>

    <div class="settings-card">
      <h2 class="section-title">账号信息</h2>
      <div class="info-row">
        <span class="label">用户 ID</span>
        <span class="value">{{ user.user_id }}</span>
      </div>
      <div class="info-row">
        <span class="label">注册时间</span>
        <span class="value">{{ formatDate(user.register_time) }}</span>
      </div>
      <div class="info-row">
        <span class="label">邮箱</span>
        <span class="value">{{ emailBound ? user.email : '未绑定' }}</span>
        <el-button size="mini" type="text" @click="gotoMobilePage('/pages/users/activateAccount', emailBound ? '更换邮箱' : '绑定邮箱')">
          {{ emailBound ? '更换邮箱' : '绑定邮箱' }}
        </el-button>
      </div>
      <div class="info-row">
        <span class="label">密码</span>
        <span class="value">••••••</span>
        <el-button size="mini" type="text" @click="gotoMobilePage('/pages/users/changePwd', '修改密码')">修改密码</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'default',
  data() {
    return {
      user: {},
      form: {
        name: '',
        motto: '',
        avatar_url: '',
        top_pic_url: ''
      },
      defaultCover: 'https://i.loli.net/2021/11/29/BxFmtyrS7GolgqM.jpg',
      savingProfile: false,
      uploading: null
    }
  },
  computed: {
    emailBound() {
      return !!this.user.email && this.user.email !== 'unbind'
    }
  },
  async mounted() {
    if (!localStorage.getItem('token')) {
      this.$message.warning('请先登录')
      this.$router.push('/login')
      return
    }

    try {
      await this.refreshUser()
    } catch (error) {
      console.error('获取用户信息失败', error)
      localStorage.removeItem('token')
      this.$router.push('/login?msg=unAuthorized')
    }
  },
  methods: {
    async refreshUser() {
      const user = await this.$api.users.getUserProfile()
      this.user = user
      this.form.name = user.name || ''
      this.form.motto = user.motto || ''
      this.form.avatar_url = user.avatar_url || ''
      this.form.top_pic_url = user.top_pic_url || ''
    },
    async saveProfile() {
      const name = (this.form.name || '').trim()
      if (!name) {
        this.$message.warning('昵称不能为空')
        return
      }

      this.savingProfile = true
      try {
        const response = await this.$api.users.updateUserInfo(name, (this.form.motto || '').trim())
        if (response.code !== 0) throw new Error(response.message || '保存失败')
        this.$message.success('资料已更新')
        await this.refreshUser()
      } catch (error) {
        console.error('保存资料失败', error)
        this.$message.error(error.message || '保存失败，请稍后重试')
      } finally {
        this.savingProfile = false
      }
    },
    async handleImageChange(file, type) {
      const raw = file.raw || file
      if (!raw || !raw.type.startsWith('image/')) {
        this.$message.warning('请选择图片文件')
        return
      }
      if (raw.size > 5 * 1024 * 1024) {
        this.$message.warning('图片过大，请选择 5MB 以内的图片')
        return
      }

      this.uploading = type
      try {
        const img = await this.readAndResize(raw, type === 'avatar' ? 512 : 1600)
        const response = type === 'avatar'
          ? await this.$api.users.changeAvatar(img)
          : await this.$api.users.changeTopCover(img)
        if (response.code !== 0) throw new Error(response.message || '上传失败')

        this.$message.success(type === 'avatar' ? '头像已更新' : '封面已更新')
        await this.refreshUser()
      } catch (error) {
        console.error('上传图片失败', error)
        this.$message.error(error.message || '上传失败，请稍后重试')
      } finally {
        this.uploading = null
      }
    },
    // 上传接口只接收 base64，先在本地把大图压到合适尺寸
    readAndResize(file, maxSize) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = () => reject(new Error('读取文件失败'))
        reader.onload = () => {
          const image = new Image()
          image.onerror = () => reject(new Error('图片解析失败'))
          image.onload = () => {
            const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
            const canvas = document.createElement('canvas')
            canvas.width = Math.max(1, Math.round(image.width * scale))
            canvas.height = Math.max(1, Math.round(image.height * scale))
            canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
            resolve(canvas.toDataURL('image/jpeg', 0.85))
          }
          image.src = reader.result
        }
        reader.readAsDataURL(file)
      })
    },
    gotoMobilePage(pagePath, title) {
      return this.$openMobileWindow(pagePath, { title })
    },
    formatDate(value) {
      if (!value) return '-'
      const date = new Date(value)
      if (isNaN(date.getTime())) return '-'
      const pad = n => (n < 10 ? `0${n}` : `${n}`)
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    }
  },
  head() {
    return {
      title: '账号设置 - 原木社区'
    }
  }
}
</script>

<style lang="scss" scoped>
.settings-page {
  max-width: 900px;
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

.settings-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 20px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  color: #333;
  margin: 0 0 16px;
  padding-left: 10px;
  border-left: 3px solid #947358;
}

.profile-form {
  max-width: 460px;
}

.image-settings {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  align-items: flex-end;
}

.image-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;

  .image-label {
    font-size: 13px;
    color: #666;
  }

  .avatar-preview {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    object-fit: cover;
    background: #f5f5f5;
  }

  &.cover .cover-preview {
    width: 320px;
    height: 120px;
    object-fit: cover;
    border-radius: 6px;
    background: #f5f5f5;
  }
}

.tip {
  margin: 16px 0 0;
  font-size: 12px;
  color: #999;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .label {
    width: 90px;
    font-size: 14px;
    color: #666;
  }

  .value {
    flex: 1;
    font-size: 14px;
    color: #333;
  }
}
</style>
