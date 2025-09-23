<template>
  <div class="post-edit-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ isEdit ? '编辑帖子' : '发布新帖' }}</span>
      </div>
      <el-form :model="postData" :rules="rules" ref="postForm" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="postData.title" placeholder="请输入标题" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" :rows="6" v-model="postData.content" placeholder="分享你的想法..." maxlength="2000" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            action="https://storage.codesocean.top/api/resource/upload?container=172018735018984"
            list-type="picture-card"
            :file-list="postData.media_urls"
            :on-success="handleImageSuccess"
            :on-remove="handleImageRemove"
            :before-upload="beforeImageUpload"
            :headers="uploadHeaders"
            multiple
            :limit="9"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="发布到" prop="circle_id">
          <el-select v-model="postData.circle_id" placeholder="请选择圈子" @change="handleCircleChange">
            <el-option
              v-for="circle in circles"
              :key="circle.circle_id"
              :label="circle.name"
              :value="circle.circle_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="绑定作品">
          <el-select v-model="postData.novel_id" placeholder="请选择作品（可选）" clearable>
            <el-option
              v-for="novel in myNovels"
              :key="novel.novel_id"
              :label="novel.name"
              :value="novel.novel_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitPost" :loading="isSubmitting">{{ isEdit ? '保存' : '发布' }}</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'PostEdit',
  data() {
    return {
      isEdit: false,
      postId: null,
      postData: {
        title: '',
        content: '',
        media_urls: [],
        circle_id: '',
        novel_id: null,
      },
      circles: [],
      myNovels: [],
      isSubmitting: false,
      isBanned: false,
      banInfo: null,
      uploadHeaders: {
        ServiceKey: "a24785bedb466b9733dd317771d4b69c08da07fd"
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        circle_id: [
          { required: true, message: '请选择圈子', trigger: 'change' },
        ],
      },
    };
  },
  async mounted() {
    this.checkLoginStatus();
    if (this.$route.query.post_id) {
      this.isEdit = true;
      this.postId = this.$route.query.post_id;
      await this.loadPostDetail();
    } else if (this.$route.query.circle_id) {
      this.postData.circle_id = Number(this.$route.query.circle_id);
      this.checkCircleBanStatus(this.postData.circle_id);
    }
    await this.loadCircles();
    await this.loadMyNovels();
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$message.warning('请先登录');
        this.$router.push('/login');
      }
    },
    async loadCircles() {
      try {
        const res = await this.$api.community.getMyCircles();
        this.circles = res;
        if (this.postData.circle_id) {
          const circleExists = this.circles.some(c => c.circle_id === this.postData.circle_id);
          if (!circleExists) {
            this.postData.circle_id = '';
          }
        }
      } catch (error) {
        console.error('加载圈子失败', error);
        this.$message.error('加载圈子失败');
      }
    },
    async loadMyNovels() {
      try {
        const res = await this.$api.essays.getNovelsOf();
        this.myNovels = res;
      } catch (error) {
        console.error('加载作品失败', error);
        this.$message.error('加载作品失败');
      }
    },
    async loadPostDetail() {
      try {
        const post = await this.$api.community.getPostDetail({ post_id: this.postId });
        this.postData.title = post.title;
        this.postData.content = post.content;
        this.postData.media_urls = post.media_urls ? post.media_urls.map(url => ({ url })) : [];
        this.postData.circle_id = post.circle_id;
        this.postData.novel_id = post.novel_id || null;
      } catch (error) {
        console.error('加载帖子详情失败', error);
        this.$message.error('加载帖子详情失败');
      }
    },
    handleImageSuccess(response, file, fileList) {
      if (response.data && response.data.resource_id) {
        const url = "https://storage.codesocean.top/api/resource/get/" + response.data.resource_id;
        this.postData.media_urls.push({ url });
      } else {
        this.$message.error('图片上传失败');
        fileList.pop();
      }
    },
    handleImageRemove(file, fileList) {
      this.postData.media_urls = fileList;
    },
    beforeImageUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    async handleCircleChange(circleId) {
      await this.checkCircleBanStatus(circleId);
    },
    async checkCircleBanStatus(circleId) {
      try {
        const res = await this.$api.community.getCircleMyStatus({ circle_id: circleId });
        if (res) {
          this.isBanned = res.is_banned;
          this.banInfo = res.ban_info;
          if (this.isBanned) {
            const endTimeText = this.banInfo.end_time ? `，将于 ${new Date(this.banInfo.end_time).toLocaleString()} 解除` : '，永久禁言';
            this.$alert(`您在该圈子中已被禁言${endTimeText}，无法发布帖子`, '禁言提示', {
              confirmButtonText: '确定',
              callback: () => {
                this.postData.circle_id = '';
              }
            });
          }
        }
      } catch (error) {
        console.error('获取禁言状态失败', error);
      }
    },
    submitPost() {
      this.$refs.postForm.validate(async (valid) => {
        if (valid) {
          if (this.isBanned) {
            this.$message.warning('您已被禁言，无法发布帖子');
            return;
          }
          this.isSubmitting = true;
          try {
            const postPayload = {
              title: this.postData.title.trim(),
              content: this.postData.content.trim(),
              media_urls: this.postData.media_urls.map(f => f.url),
              novel_id: this.postData.novel_id,
            };

            if (this.isEdit) {
              await this.$api.community.updatePost({ post_id: this.postId, ...postPayload });
            } else {
              postPayload.circle_id = this.postData.circle_id;
              postPayload.type = 0;
              await this.$api.community.createPost(postPayload);
            }
            this.$message.success(this.isEdit ? '编辑成功' : '发布成功，等待审核');
            this.$router.push('/community');
          } catch (error) {
            console.error('提交失败', error);
            this.$message.error(this.isEdit ? '编辑失败，请重试' : '发布失败，请重试');
          } finally {
            this.isSubmitting = false;
          }
        }
      });
    },
    cancel() {
      this.$router.back();
    },
  },
};
</script>

<style scoped>
.post-edit-container {
  max-width: 800px;
  margin: 20px auto;
}
.box-card {
  border-radius: 8px;
}
</style>