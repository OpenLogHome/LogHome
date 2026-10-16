<template>
  <Workspace
    :title="id ? $t('圈子设置') : $t('创建圈子')"
    active="/community/circles"
    :circle-role="role"
  >
    <div v-if="error" class="social-panel social-state" role="alert">
      {{ error }}<br /><el-button @click="load">{{ $t("重试") }}</el-button>
    </div>
    <div v-else-if="loading" class="social-panel">
      <el-skeleton :rows="8" animated />
    </div>
    <div v-else-if="id && role < 1" class="social-panel social-state">
      {{ $t("只有圈主或管理员可以编辑圈子。") }}
    </div>
    <div v-else class="circle-editor-grid">
      <el-form
        ref="form"
        class="social-panel"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.native.prevent="save"
      >
        <div class="editor-media">
          <el-form-item :label="$t('圈子图标')" prop="icon"
            ><ImageUpload v-model="form.icon" /></el-form-item
          ><el-form-item :label="$t('背景图片')"
            ><ImageUpload v-model="form.bg_url" wide
          /></el-form-item>
        </div>
        <el-form-item :label="$t('圈子名称')" prop="name"
          ><el-input
            v-model="form.name"
            :disabled="!!id && role !== 2"
            maxlength="20"
            show-word-limit
            :placeholder="$t('2-20 个字符')"
        /></el-form-item>
        <el-form-item v-if="!id" :label="$t('圈子分类')" prop="category_id"
          ><el-select v-model="form.category_id" :placeholder="$t('选择分类')"
            ><el-option
              v-for="category in categories"
              :key="category.category_id"
              :label="category.name"
              :value="category.category_id" /></el-select
        ></el-form-item>
        <el-form-item :label="$t('圈子简介')" prop="description"
          ><el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            maxlength="200"
            show-word-limit
            :placeholder="$t('10-200 个字符，介绍圈子的兴趣和主题')"
        /></el-form-item>
        <el-form-item :label="$t('圈子规则')"
          ><el-input
            v-model="form.rules"
            type="textarea"
            :rows="4"
            maxlength="500"
            show-word-limit
            :placeholder="$t('发帖规范、交流约定与禁止内容')"
        /></el-form-item>
        <el-form-item v-if="id" :label="$t('圈子公告')"
          ><el-input
            v-model="form.announcement"
            type="textarea"
            :rows="3"
            maxlength="500"
            show-word-limit
        /></el-form-item>
        <template v-if="id && role === 2"
          ><el-divider /><el-form-item :label="$t('入圈验证')"
            ><el-switch
              v-model="settings.need_verification"
              :active-value="1"
              :inactive-value="0"
              :active-text="$t('加入时需要审核')" /></el-form-item
          ><el-form-item v-if="settings.need_verification" :label="$t('验证问题')"
            ><el-input
              v-model="settings.verification_questions"
              type="textarea"
              :rows="3"
              :placeholder="$t('希望申请者回答什么问题？')" /></el-form-item
        ></template>
        <div class="editor-submit">
          <el-button type="primary" native-type="submit" :loading="saving">{{
            id ? $t("保存更改") : $t("提交创建申请")
          }}</el-button
          ><span v-if="!id" class="social-muted">{{ $t("创建后需要等待审核") }}</span>
        </div>
      </el-form>
      <aside>
        <section class="social-panel">
          <h3>{{ $t("圈子预览") }}</h3>
          <div
            class="circle-preview"
            :style="{
              backgroundImage: form.bg_url ? `url(${form.bg_url})` : '',
            }"
          >
            <img
              :src="form.icon || '/default-avatar.png'"
              :alt="$t('圈子图标')"
            /><strong>{{ form.name || $t("圈子名称") }}</strong>
          </div>
          <p class="social-muted">
            {{ form.description || $t("圈子简介将显示在这里。") }}
          </p>
        </section>
        <section v-if="!id" class="social-panel">
          <h3>{{ $t("创建须知") }}</h3>
          <p class="social-muted">
            {{
              $t(
                "账号注册满 30\n          天且无违规记录。圈子名称不能重复，申请通过后你将成为圈主。"
              )
            }}
          </p>
        </section>
      </aside>
    </div>
  </Workspace>
</template>
<script>
import Workspace from "./Workspace.vue";
import ImageUpload from "./ImageUpload.vue";
import social from "~/plugins/api/social";
import { readingToken } from "~/plugins/api/reading";
export default {
  components: { Workspace, ImageUpload },
  props: { id: String },
  data: () => ({
    form: {
      name: "",
      description: "",
      rules: "",
      announcement: "",
      icon: "",
      bg_url: "",
      category_id: null,
    },
    settings: { need_verification: 0, verification_questions: "" },
    role: 0,
    categories: [],
    loading: true,
    saving: false,
    error: "",
    snapshot: "",
    rules: {
      name: [
        {
          required: true,
          min: 2,
          max: 20,
          message: "名称需要 2-20 个字符",
          trigger: "blur",
        },
      ],
      description: [
        {
          required: true,
          min: 10,
          max: 200,
          message: "简介需要 10-200 个字符",
          trigger: "blur",
        },
      ],
      icon: [{ required: true, message: "请上传圈子图标" }],
      category_id: [{ required: true, message: "请选择圈子分类" }],
    },
  }),
  mounted() {
    this.load();
  },
  methods: {
    confirmLeave(next) {
      if (this.snapshot && this.snapshot !== JSON.stringify([this.form, this.settings]))
        this.$confirm(this.$t("更改尚未保存，确定离开？"), this.$t("离开编辑"), {
          type: "warning",
        })
          .then(() => next())
          .catch(() => next(false));
      else next();
    },

    async load() {
      if (!readingToken()) {
        this.$router.replace({
          path: "/login",
          query: { redirect: this.$route.fullPath },
        });
        return;
      }
      this.loading = true;
      this.error = "";
      try {
        if (this.id) {
          const [circle, mine] = await Promise.all([
            social.circle(this.id),
            social.myCircles(),
          ]);
          this.role =
            Number(
              (mine.find((item) => String(item.circle_id) === this.id) || {}).role
            ) || 0;
          Object.keys(this.form).forEach((key) => {
            this.form[key] = circle[key] || "";
          });
          if (this.role === 2)
            this.settings = {
              ...this.settings,
              ...(await social.circleSettings(this.id)),
            };
        } else this.categories = await social.categories();
        this.snapshot = JSON.stringify([this.form, this.settings]);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    save() {
      if (this.saving) return;
      this.form.name = this.form.name.trim();
      this.form.description = this.form.description.trim();
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        this.saving = true;
        try {
          const payload = {
            ...this.form,
            name: this.form.name.trim(),
            description: this.form.description.trim(),
          };
          if (this.id && this.role !== 2) delete payload.name;
          await social.saveCircle(this.id, payload);
          if (this.id && this.role === 2) {
            try {
              await social.saveCircleSettings(this.id, this.settings);
            } catch (error) {
              this.$message.error(
                this.$t("圈子资料已保存，但入圈设置未保存：{p0}", { p0: error.message })
              );
              return;
            }
          }
          this.snapshot = JSON.stringify([this.form, this.settings]);
          this.$message.success(
            this.id ? this.$t("圈子设置已保存") : this.$t("申请已提交，请等待审核")
          );
          this.$router.push(
            this.id ? `/community/circle/${this.id}` : "/community/circles"
          );
        } catch (error) {
          this.$message.error(error.message);
        } finally {
          this.saving = false;
        }
      });
    },
  },
};
</script>
<style scoped>
.circle-editor-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 20px;
}
.editor-media {
  display: flex;
  gap: 24px;
}
.editor-submit {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 12px;
}
.circle-preview {
  padding: 24px 14px;
  background: var(--soft, #f1f3f5);
  background-size: cover;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}
.circle-preview img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border: 3px solid white;
  border-radius: 16px;
}
.circle-preview strong {
  background: var(--surface, #ffffff);
  border-radius: 6px;
  padding: 6px 12px;
  max-width: 100%;
  overflow-wrap: anywhere;
}
@media (max-width: 1050px) {
  .circle-editor-grid {
    grid-template-columns: 1fr;
  }
  .circle-editor-grid > aside {
    display: none;
  }
}
@media (max-width: 600px) {
  .editor-media {
    flex-wrap: wrap;
  }
}
</style>
