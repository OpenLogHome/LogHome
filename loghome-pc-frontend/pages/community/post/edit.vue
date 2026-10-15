<template>
  <Workspace :title="isEdit ? $t('编辑帖子') : $t('发布新帖')" active="/community">
    <div class="post-edit-container">
      <el-card class="box-card">
        <el-form :model="postData" :rules="rules" ref="postForm" label-width="100px">
          <el-form-item :label="$t('标题')" prop="title">
            <el-input
              v-model="postData.title"
              :placeholder="$t('请输入标题')"
              maxlength="50"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('内容')" prop="content">
            <el-input
              type="textarea"
              :rows="6"
              v-model="postData.content"
              :placeholder="$t('分享你的想法...')"
              maxlength="2000"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('图片')">
            <el-upload
              action="https://storage.codesocean.top/api/resource/upload?container=172018735018984"
              list-type="picture-card"
              :file-list="postData.media_urls"
              :on-success="handleImageSuccess"
              :on-remove="handleImageRemove"
              :before-upload="beforeImageUpload"
              :on-error="handleUploadError"
              :on-exceed="handleUploadExceed"
              :disabled="isSubmitting"
              accept="image/jpeg,image/png,image/webp,image/gif"
              :headers="uploadHeaders"
              multiple
              :limit="9"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item :label="$t('发布到')" prop="circle_id">
            <el-select
              v-model="postData.circle_id"
              :placeholder="$t('请选择圈子')"
              @change="handleCircleChange"
            >
              <el-option
                v-for="circle in circles"
                :key="circle.circle_id"
                :label="circle.name"
                :value="circle.circle_id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('绑定作品')">
            <el-select
              v-model="postData.novel_id"
              :placeholder="$t('请选择作品（可选）')"
              clearable
            >
              <el-option
                v-for="novel in myNovels"
                :key="novel.novel_id"
                :label="novel.name"
                :value="novel.novel_id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitPost" :loading="isSubmitting">{{
              isEdit ? $t("保存") : $t("发布")
            }}</el-button>
            <el-button @click="cancel">{{ $t("取消") }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </Workspace>
</template>

<script>
import Workspace from "~/components/social/Workspace.vue";
import { readingToken } from "~/plugins/api/reading";
export default {
  components: { Workspace },
  name: "PostEdit",
  data() {
    return {
      isEdit: false,
      postId: null,
      originalPost: null,
      saved: false,
      accountToken: null,
      postData: {
        title: "",
        content: "",
        media_urls: [],
        circle_id: "",
        novel_id: null,
      },
      circles: [],
      myNovels: [],
      isSubmitting: false,
      uploadingCount: 0,
      isBanned: false,
      banInfo: null,
      uploadHeaders: {
        ServiceKey: "a24785bedb466b9733dd317771d4b69c08da07fd",
      },
      rules: {
        title: [{ required: true, message: this.$t("请输入标题"), trigger: "blur" }],
        content: [{ required: true, message: this.$t("请输入内容"), trigger: "blur" }],
        circle_id: [
          { required: true, message: this.$t("请选择圈子"), trigger: "change" },
        ],
      },
    };
  },
  async mounted() {
    if (!this.checkLoginStatus()) return;
    this.accountToken = readingToken();
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
    this.originalPost = this.postSnapshot();
  },
  async beforeRouteLeave(to, from, next) {
    if (this.isSubmitting || this.uploadingCount) {
      this.$message.info(this.$t("帖子正在处理，请稍候"));
      next(false);
      return;
    }
    const edited =
      this.originalPost !== null
        ? this.postSnapshot() !== this.originalPost
        : !!(
            this.postData.title ||
            this.postData.content ||
            this.postData.media_urls.length
          );
    if (this.saved || !edited) return next();
    try {
      await this.$confirm(this.$t("更改尚未保存，确定离开？"), this.$t("离开编辑"), {
        confirmButtonText: this.$t("离开"),
        cancelButtonText: this.$t("继续编辑"),
      });
      next();
    } catch (_) {
      next(false);
    }
  },
  methods: {
    postSnapshot() {
      return JSON.stringify({
        ...this.postData,
        media_urls: this.postData.media_urls.map((file) => file.url),
      });
    },
    checkLoginStatus() {
      const token = readingToken();
      if (!token) {
        this.$message.warning(this.$t("请先登录"));
        this.$router.push({ path: "/login", query: { redirect: this.$route.fullPath } });
        return false;
      }
      return true;
    },
    async loadCircles() {
      try {
        const res = await this.$api.community.getMyCircles();
        this.circles = res;
        if (this.postData.circle_id) {
          const circleExists = this.circles.some(
            (c) => c.circle_id === this.postData.circle_id
          );
          if (!circleExists) {
            this.postData.circle_id = "";
          }
        }
      } catch (error) {
        console.error("加载圈子失败", error);
        this.$message.error(this.$t("加载圈子失败"));
      }
    },
    async loadMyNovels() {
      try {
        const res = await this.$api.essays.getNovelsOf();
        this.myNovels = res;
      } catch (error) {
        console.error("加载作品失败", error);
        this.$message.error(this.$t("加载作品失败"));
      }
    },
    async loadPostDetail() {
      try {
        const post = await this.$api.community.getPostDetail({
          post_id: this.postId,
        });
        this.postData.title = post.title;
        this.postData.content = post.content;
        this.postData.media_urls = post.media_urls
          ? post.media_urls.map((url) => ({ url }))
          : [];
        this.postData.circle_id = post.circle_id;
        this.postData.novel_id = post.novel_id || null;
      } catch (error) {
        console.error("加载帖子详情失败", error);
        this.$message.error(this.$t("加载帖子详情失败"));
      }
    },
    handleImageSuccess(response, file, fileList) {
      this.uploadingCount = Math.max(0, this.uploadingCount - 1);
      if (response.data && response.data.resource_id) {
        const url =
          "https://storage.codesocean.top/api/resource/get/" + response.data.resource_id;
        this.postData.media_urls.push({ url });
      } else {
        this.$message.error(this.$t("图片上传失败"));
        fileList.pop();
      }
    },
    handleImageRemove(file, fileList) {
      this.postData.media_urls = fileList;
    },
    handleUploadError() {
      this.uploadingCount = Math.max(0, this.uploadingCount - 1);
      this.$message.error(this.$t("图片上传失败，请重试"));
    },
    handleUploadExceed() {
      this.$message.info(this.$t("每篇帖子最多上传 9 张图片"));
    },
    beforeImageUpload(file) {
      if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
        this.$message.error(this.$t("请选择 JPG、PNG、WebP 或 GIF 图片"));
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error(this.$t("上传图片大小不能超过 2MB!"));
      }
      if (isLt2M) this.uploadingCount++;
      return isLt2M;
    },
    async handleCircleChange(circleId) {
      await this.checkCircleBanStatus(circleId);
    },
    async checkCircleBanStatus(circleId) {
      try {
        const res = await this.$api.community.getCircleMyStatus({
          circle_id: circleId,
        });
        if (res) {
          this.isBanned = res.is_banned;
          this.banInfo = res.ban_info;
          if (this.isBanned) {
            const endTimeText =
              this.banInfo && this.banInfo.end_time
                ? `，将于 ${new Date(this.banInfo.end_time).toLocaleString()} 解除`
                : "，永久禁言";
            this.$alert(
              this.$t("您在该圈子中已被禁言{p0}，无法发布帖子", { p0: endTimeText }),
              this.$t("禁言提示"),
              {
                confirmButtonText: this.$t("确定"),
                callback: () => {
                  this.postData.circle_id = "";
                },
              }
            );
          }
        }
      } catch (error) {
        console.error("获取禁言状态失败", error);
      }
    },
    submitPost() {
      if (this.isSubmitting) return;
      if (this.uploadingCount) {
        this.$message.info(this.$t("图片上传中，请稍候再发布"));
        return;
      }
      if (!this.accountToken || this.accountToken !== readingToken()) {
        this.$message.warning(this.$t("账号已切换，请刷新后重试"));
        return;
      }
      this.postData.title = this.postData.title.trim();
      this.postData.content = this.postData.content.trim();
      this.$refs.postForm.validate(async (valid) => {
        if (valid) {
          if (this.isBanned) {
            this.$message.warning(this.$t("您已被禁言，无法发布帖子"));
            return;
          }
          this.isSubmitting = true;
          try {
            const postPayload = {
              title: this.postData.title.trim(),
              content: this.postData.content.trim(),
              media_urls: this.postData.media_urls.map((f) => f.url),
              novel_id: this.postData.novel_id,
            };

            if (this.isEdit) {
              await this.$api.community.updatePost({
                post_id: this.postId,
                ...postPayload,
              });
            } else {
              postPayload.circle_id = this.postData.circle_id;
              postPayload.type = 0;
              await this.$api.community.createPost(postPayload);
            }
            if (this.accountToken !== readingToken()) return;
            this.saved = true;
            this.isSubmitting = false;
            this.$message.success(
              this.isEdit ? this.$t("编辑成功") : this.$t("发布成功，等待审核")
            );
            this.$router.push("/community");
          } catch (error) {
            console.error("提交失败", error);
            this.$message.error(
              this.isEdit ? this.$t("编辑失败，请重试") : this.$t("发布失败，请重试")
            );
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

/* These pages share the desktop workspace instead of adding another outer gutter. */
.friends-page,
.settings-page,
.post-detail-page,
.post-edit-container {
  padding: 0 !important;
  max-width: none !important;
}
.friends-card,
.settings-card,
.post-detail,
.comments-section {
  border: 1px solid var(--line, #e9e0d5) !important;
  border-radius: 14px !important;
  box-shadow: none !important;
  background: var(--surface, #fffdf9) !important;
}
.post-detail-container {
  gap: 22px !important;
}
.post-detail-main {
  min-width: 0;
}
.post-detail-page {
  min-height: 0 !important;
}
</style>
