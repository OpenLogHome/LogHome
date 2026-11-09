<template>
  <Workspace :title="$t('账号设置')" active="/me/settings">
    <div class="settings-page">
      <el-alert
        v-if="profileError"
        :title="profileError"
        type="error"
        :closable="false"
      />
      <el-button v-if="profileError" @click="load">{{ $t("重新加载") }}</el-button>
      <div class="settings-card settings-profile">
        <h2 class="section-title">{{ $t("个人资料") }}</h2>
        <el-form
          :disabled="!profileReady || savingProfile || !!uploading"
          label-width="90px"
          size="small"
          class="profile-form"
        >
          <el-form-item :label="$t('昵称')">
            <el-input
              v-model="form.name"
              maxlength="20"
              show-word-limit
              :placeholder="$t('请输入昵称')"
            />
          </el-form-item>
          <el-form-item :label="$t('个性签名')">
            <el-input
              v-model="form.motto"
              type="textarea"
              :rows="2"
              maxlength="30"
              show-word-limit
              :placeholder="$t('写点什么让别人认识你')"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="savingProfile" @click="saveProfile">{{
              $t("保存资料")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>

      <section class="settings-card settings-language">
        <h2 class="section-title">{{ $t("common.language.title") }}</h2>
        <el-select
          :aria-label="$t('common.language.title')"
          style="width: min(100%, 280px)"
          :value="$language.state.preference"
          :disabled="$language.state.saving"
          @change="$language.set"
        >
          <el-option :label="$t('common.language.followSystem')" value="follow-system" />
          <el-option :label="$t('common.language.chinese')" value="zh-CN" />
          <el-option :label="$t('common.language.english')" value="en" />
        </el-select>
        <div v-if="$language.state.syncError" role="status">
          <p>{{ $t("语言已在此设备生效，账号同步失败。") }}</p>
          <el-button
            type="text"
            :loading="$language.state.saving"
            @click="$language.set($language.state.preference)"
            >{{ $t("重试同步") }}</el-button
          >
        </div>
      </section>

      <div class="settings-card settings-ai"><ReaderAiPreference /></div>

      <div class="settings-card settings-appearance">
        <div class="settings-appearance-heading">
          <h2 class="section-title">{{ $t("头像与封面") }}</h2>
          <nuxt-link to="/me/frames">{{ $t("头像挂件") }} →</nuxt-link>
        </div>
        <div class="image-settings">
          <div class="image-block">
            <div class="image-label">{{ $t("头像") }}</div>
            <img
              class="avatar-preview"
              :src="form.avatar_url || '/default-avatar.png'"
              :alt="$t('头像')"
              @error="$event.target.src = '/default-avatar.png'"
            />
            <el-upload
              action=""
              :show-file-list="false"
              :auto-upload="false"
              accept="image/*"
              :on-change="(file) => handleImageChange(file, 'avatar')"
            >
              <el-button size="mini" :loading="uploading === 'avatar'">{{
                $t("更换头像")
              }}</el-button>
            </el-upload>
          </div>
          <div class="image-block cover">
            <div class="image-label">{{ $t("个人主页封面") }}</div>
            <img
              class="cover-preview"
              :src="form.top_pic_url || defaultCover"
              :alt="$t('封面')"
              @error="$event.target.src = defaultCover"
            />
            <el-upload
              action=""
              :show-file-list="false"
              :auto-upload="false"
              accept="image/*"
              :on-change="(file) => handleImageChange(file, 'cover')"
            >
              <el-button size="mini" :loading="uploading === 'cover'">{{
                $t("更换封面")
              }}</el-button>
            </el-upload>
          </div>
        </div>
        <p class="tip">
          {{ $t("图片会被压缩后上传，建议 JPG/PNG，单张不超过 5MB。") }}
        </p>
      </div>

      <div class="settings-card" v-loading="loadingPrivacy">
        <h2 class="section-title">{{ $t("隐私设置") }}</h2>
        <p class="tip">
          {{ $t("账户级设置，保存后立即生效，并同步到所有设备。") }}
        </p>
        <el-form v-if="privacyReady" label-position="top" size="small">
          <el-form-item :label="$t('关注与粉丝列表')">
            <el-select
              v-model="privacy.follow_list_visibility"
              :disabled="savingPrivacy"
              style="width: 100%"
            >
              <el-option
                v-for="item in listOptions"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              />
            </el-select>
            <p class="tip">
              {{ $t("本人始终可查看自己的列表，关注和粉丝数量仍公开。") }}
            </p>
          </el-form-item>
          <el-form-item :label="$t('谁可以私信我')">
            <el-select
              v-model="privacy.direct_message_policy"
              :disabled="savingPrivacy"
              style="width: 100%"
            >
              <el-option
                v-for="item in messageOptions"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              />
            </el-select>
            <p class="tip">
              {{
                $t(
                  "默认允许所有已登录用户私信；“我关注的人”指你已关注的发件人。历史消息不受影响。"
                )
              }}
            </p>
          </el-form-item>
          <el-button
            type="primary"
            :loading="savingPrivacy"
            :disabled="!privacyChanged"
            @click="savePrivacy"
            >{{ $t("保存隐私设置") }}</el-button
          >
        </el-form>
        <el-alert
          v-else-if="!loadingPrivacy"
          :title="$t('隐私设置加载失败，请重试')"
          type="error"
          :closable="false"
        />
        <el-button
          v-if="!loadingPrivacy && !privacyReady"
          size="small"
          @click="loadPrivacy"
          >{{ $t("重新加载") }}</el-button
        >
      </div>

      <div class="settings-card">
        <h2 class="section-title">{{ $t("账号信息") }}</h2>
        <div class="info-row">
          <span class="label">{{ $t("用户 ID") }}</span>
          <span class="value">{{ user.user_id }}</span>
        </div>
        <div class="info-row">
          <span class="label">{{ $t("注册时间") }}</span>
          <span class="value">{{ formatDate(user.register_time) }}</span>
        </div>
        <div class="info-row">
          <span class="label">{{ $t("邮箱") }}</span>
          <span class="value">{{ emailBound ? user.email : $t("未绑定") }}</span>
          <el-button size="mini" type="text" @click="$router.push('/me/security')">
            {{ $t(emailBound ? "更换邮箱" : "绑定邮箱") }}
          </el-button>
        </div>
        <div class="info-row">
          <span class="label">{{ $t("密码") }}</span>
          <span class="value">••••••</span>
          <el-button size="mini" type="text" @click="$router.push('/me/security')">{{
            $t("修改密码")
          }}</el-button>
        </div>
      </div>
    </div>
    <div class="settings-session">
      <el-button type="danger" plain size="small" @click="logoutAccount">{{
        $t("退出登录")
      }}</el-button>
    </div></Workspace
  >
</template>

<script>
import Workspace from "~/components/social/Workspace.vue";
import ReaderAiPreference from "~/components/read/ReaderAiPreference.vue";
import account from "~/plugins/api/account";
import accountPage from "~/mixins/account-page";
import { readingToken } from "~/plugins/api/reading";
export default {
  components: { Workspace, ReaderAiPreference },
  mixins: [accountPage],
  layout: "default",
  data() {
    return {
      user: {},
      profileError: "",
      profileReady: false,
      originalProfile: null,
      form: {
        name: "",
        motto: "",
        avatar_url: "",
        top_pic_url: "",
      },
      defaultCover: "https://i.loli.net/2021/11/29/BxFmtyrS7GolgqM.jpg",
      savingProfile: false,
      privacy: {
        follow_list_visibility: "public",
        direct_message_policy: "default",
      },
      privacyOriginal: "",
      privacyReady: false,
      loadingPrivacy: true,
      savingPrivacy: false,
      listOptions: [
        { value: "public", label: "全部公开" },
        { value: "following_only", label: "仅公开关注列表" },
        { value: "fans_only", label: "仅公开粉丝列表" },
        { value: "private", label: "全部私密" },
      ],
      messageOptions: [
        { value: "default", label: "默认" },
        { value: "following", label: "我关注的人" },
        { value: "mutual", label: "互相关注的人" },
        { value: "none", label: "禁止私信" },
      ],
      uploading: null,
    };
  },
  computed: {
    privacyChanged() {
      return JSON.stringify(this.privacy) !== this.privacyOriginal;
    },
    emailBound() {
      return !!this.user.email && this.user.email !== "unbind";
    },
  },
  async beforeRouteLeave(to, from, next) {
    if (readingToken() !== this.accountToken) return next();
    if (this.savingProfile || this.savingPrivacy || this.uploading) {
      this.$message.info(this.$t("设置正在保存，请稍候"));
      return next(false);
    }
    if (
      (!this.profileReady || this.profileSnapshot() === this.originalProfile) &&
      (!this.privacyReady || !this.privacyChanged)
    )
      return next();
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
    async load() {
      this.profileError = "";
      this.profileReady = false;
      try {
        await this.refreshUser();
      } catch (error) {
        this.profileError = error.message || this.$t("获取用户信息失败");
      }
      this.loadPrivacy();
    },
    profileSnapshot() {
      return JSON.stringify({ name: this.form.name, motto: this.form.motto });
    },
    sameAccount() {
      return !!this.accountToken && this.accountToken === readingToken();
    },
    async logoutAccount() {
      try {
        await this.$confirm(this.$t("确定退出当前账号？"), this.$t("退出登录"));
        localStorage.removeItem("token");
        localStorage.removeItem("LogHomeUserInfo");
        window.dispatchEvent(new Event("auth-state-changed"));
        this.$router.push("/login");
      } catch (_) {}
    },
    async loadPrivacy() {
      this.loadingPrivacy = true;
      this.privacyReady = false;
      try {
        const token = readingToken();
        const privacy = await this.$api.users.getPrivacySettings();
        if (token !== readingToken()) return;
        this.privacy = privacy;
        this.privacyOriginal = JSON.stringify(this.privacy);
        this.privacyReady = true;
      } catch (error) {
        this.$message.error(error.message || this.$t("隐私设置加载失败"));
      } finally {
        this.loadingPrivacy = false;
      }
    },
    async savePrivacy() {
      if (
        !this.privacyReady ||
        this.savingPrivacy ||
        !this.privacyChanged ||
        !this.sameAccount()
      )
        return;
      this.savingPrivacy = true;
      try {
        const token = readingToken();
        const privacy = await this.$api.users.savePrivacySettings(this.privacy);
        if (token !== readingToken()) return;
        this.privacy = privacy;
        this.privacyOriginal = JSON.stringify(this.privacy);
        this.$message.success(this.$t("隐私设置已保存"));
      } catch (error) {
        this.$message.error(error.message || this.$t("保存失败，请稍后重试"));
      } finally {
        this.savingPrivacy = false;
      }
    },
    async refreshUser(keepDraft = false) {
      const user = await account.profile();
      if (!this.sameAccount()) return;
      this.user = user;
      if (!keepDraft) {
        this.form.name = user.name || "";
        this.form.motto = user.motto || "";
      }
      this.form.avatar_url = user.avatar_url || "";
      this.form.top_pic_url = user.top_pic_url || "";
      this.originalProfile = JSON.stringify({
        name: user.name || "",
        motto: user.motto || "",
      });
      this.profileReady = true;
    },
    async saveProfile() {
      if (this.savingProfile || !this.profileReady || !this.sameAccount()) return;
      const name = (this.form.name || "").trim();
      if (!name) {
        this.$message.warning(this.$t("昵称不能为空"));
        return;
      }

      this.savingProfile = true;
      try {
        const response = await this.$api.users.updateUserInfo(
          name,
          (this.form.motto || "").trim()
        );
        if (!this.sameAccount()) return;
        if (response.code !== 0) throw new Error(response.message || "保存失败");
        this.$message.success(this.$t("资料已更新"));
        await this.refreshUser();
      } catch (error) {
        console.error("保存资料失败", error);
        this.$message.error(error.message || this.$t("保存失败，请稍后重试"));
      } finally {
        this.savingProfile = false;
      }
    },
    async handleImageChange(file, type) {
      if (
        this.uploading ||
        this.savingProfile ||
        !this.profileReady ||
        !this.sameAccount()
      )
        return;
      const raw = file.raw || file;
      if (!raw || !raw.type.startsWith("image/")) {
        this.$message.warning(this.$t("请选择图片文件"));
        return;
      }
      if (raw.size > 5 * 1024 * 1024) {
        this.$message.warning(this.$t("图片过大，请选择 5MB 以内的图片"));
        return;
      }

      this.uploading = type;
      try {
        const img = await this.readAndResize(raw, type === "avatar" ? 512 : 1600);
        if (!this.sameAccount()) return;
        const response =
          type === "avatar"
            ? await this.$api.users.changeAvatar(img)
            : await this.$api.users.changeTopCover(img);
        if (!this.sameAccount()) return;
        if (response.code !== 0) throw new Error(response.message || "上传失败");

        this.$message.success(
          type === "avatar" ? this.$t("头像已更新") : this.$t("封面已更新")
        );
        await this.refreshUser(true);
      } catch (error) {
        console.error("上传图片失败", error);
        this.$message.error(error.message || this.$t("上传失败，请稍后重试"));
      } finally {
        this.uploading = null;
      }
    },
    // 上传接口只接收 base64，先在本地把大图压到合适尺寸
    readAndResize(file, maxSize) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("读取文件失败"));
        reader.onload = () => {
          const image = new Image();
          image.onerror = () => reject(new Error("图片解析失败"));
          image.onload = () => {
            const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.round(image.width * scale));
            canvas.height = Math.max(1, Math.round(image.height * scale));
            canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg", 0.85));
          };
          image.src = reader.result;
        };
        reader.readAsDataURL(file);
      });
    },

    formatDate(value) {
      if (!value) return "-";
      const date = new Date(value);
      if (isNaN(date.getTime())) return "-";
      const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    },
  },
  head() {
    return {
      title: "账号设置 - 原木社区",
    };
  },
};
</script>

<style lang="scss" scoped>
.settings-page {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 16px;

  .back-link {
    font-size: 14px;
    color: var(--wood, #947358);

    .back-icon {
      margin-right: 4px;
    }
  }

  .page-title {
    font-size: 22px;
    color: var(--ink, #30343b);
    margin: 12px 0 0;
  }
}

.settings-card {
  background: var(--surface, #fff);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 20px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  color: var(--ink, #30343b);
  margin: 0 0 16px;
  padding-left: 10px;
  border-left: 3px solid var(--wood, #947358);
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
    color: var(--muted, #5b626d);
  }

  .avatar-preview {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    object-fit: cover;
    background: var(--soft, #f1f3f5);
  }

  &.cover .cover-preview {
    width: 320px;
    height: 120px;
    object-fit: cover;
    border-radius: 6px;
    background: var(--soft, #f1f3f5);
  }
}

.tip {
  margin: 16px 0 0;
  font-size: 12px;
  color: var(--muted, #5b626d);
}

.info-row {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--line, #e2e6eb);

  &:last-child {
    border-bottom: none;
  }

  .label {
    width: 90px;
    font-size: 14px;
    color: var(--muted, #5b626d);
  }

  .value {
    flex: 1;
    font-size: 14px;
    color: var(--ink, #30343b);
  }
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
.settings-links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 24px;
}
.settings-links a {
  font-size: 14px;
  color: var(--wood);
}
</style>
