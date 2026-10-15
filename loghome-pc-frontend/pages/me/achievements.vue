<template>
  <Workspace :title="$t('我的勋章')" active="/me"
    ><div v-if="error" class="social-panel social-state" role="alert">
      {{ error }}<br /><el-button @click="load">{{ $t("重试") }}</el-button>
    </div>
    <el-skeleton v-else-if="loading" class="social-panel" :rows="7" animated /><template
      v-else
      ><div class="achievement-overview">
        <section class="social-panel badge-showcase">
          <h2>{{ $t("展示勋章") }}</h2>
          <img
            v-if="summary.selected_badge"
            :src="image(summary.selected_badge)"
            :alt="summary.selected_badge.title"
          /><i v-else class="el-icon-medal" /><strong>{{
            summary.selected_badge ? summary.selected_badge.title : $t("尚未选择展示勋章")
          }}</strong>
          <p class="social-muted">
            {{ $t("已获得 {p0} 枚勋章", { p0: unlocked.length }) }}
          </p>
        </section>
        <section class="social-panel">
          <h2>{{ $t("我的称号") }}</h2>
          <div class="title-preview">
            {{ titlePreview || $t("组合你的专属称号") }}
          </div>
          <el-form label-position="top"
            ><div class="title-selects">
              <el-form-item :label="$t('形容词')"
                ><el-select
                  v-model="title.adjective_achievement_id"
                  clearable
                  :placeholder="$t('选择形容词')"
                  ><el-option
                    v-for="item in terms('adjective')"
                    :key="item.achievement_id"
                    :label="item.title_term_text"
                    :value="item.achievement_id" /></el-select></el-form-item
              ><el-form-item :label="$t('名词')"
                ><el-select
                  v-model="title.noun_achievement_id"
                  clearable
                  :placeholder="$t('选择名词')"
                  ><el-option
                    v-for="item in terms('noun')"
                    :key="item.achievement_id"
                    :label="item.title_term_text"
                    :value="item.achievement_id" /></el-select
              ></el-form-item>
            </div>
            <el-switch
              v-model="title.is_visible"
              :active-text="$t('在个人主页展示称号')"
            /><el-button
              type="primary"
              size="small"
              :loading="saving"
              @click="saveTitle"
              >{{ $t("保存称号") }}</el-button
            ></el-form
          >
        </section>
      </div>
      <div class="social-tabs">
        <button :class="{ active: filter === 'unlocked' }" @click="filter = 'unlocked'">
          {{ $t("已获得 {p0}", { p0: unlocked.length }) }}</button
        ><button :class="{ active: filter === 'locked' }" @click="filter = 'locked'">
          {{ $t("待解锁 {p0}", { p0: locked.length }) }}
        </button>
      </div>
      <div class="badge-grid">
        <button
          v-for="badge in visible"
          :key="badge.achievement_id"
          class="badge-option"
          :class="{ locked: filter === 'locked' }"
          @click="open(badge)"
        >
          <img :src="image(badge)" alt="" loading="lazy" />
          <div>
            <strong>{{ badge.title }}</strong>
            <p>{{ badge.description }}</p>
            <span>{{
              badge.title_term_text
                ? $t("称号词条：{p0}", { p0: badge.title_term_text })
                : filter === "locked"
                ? $t("查看获得条件")
                : $t("查看勋章详情")
            }}</span>
          </div>
        </button>
      </div>
      <div v-if="!visible.length" class="social-panel social-state">
        {{
          filter === "unlocked"
            ? $t("还没有获得勋章，看看有哪些可以解锁吧。")
            : $t("全部可见勋章均已解锁。")
        }}
      </div></template
    ><el-dialog
      :title="detail ? detail.title : $t('勋章详情')"
      :visible.sync="detailVisible"
      width="min(600px, 92vw)"
      ><template v-if="detail"
        ><div class="badge-detail-image">
          <Medal
            :src="image(detail)"
            :title="detail.title"
            :locked="detail.is_locked"
            :shiny="!!detail.badge_shine"
          />
        </div>
        <p>{{ detail.description }}</p>
        <p v-if="detail.title_term_text" class="social-muted">
          {{ $t("解锁称号词条：{p0}", { p0: detail.title_term_text }) }}
        </p>
        <template v-if="detail.is_locked"
          ><h3>{{ $t("获得条件") }}</h3>
          <p v-if="progress" class="social-muted">
            {{ achievementProgressStatus(progress, detail) }}
          </p>
          <p v-if="detail.valid_from || detail.valid_to" class="social-muted">
            {{
              $t("有效时间：{p0} 至 {p1}", {
                p0: detail.valid_from ? accountDate(detail.valid_from) : $t("不限"),
                p1: detail.valid_to ? accountDate(detail.valid_to) : $t("不限"),
              })
            }}
          </p>
          <p class="social-muted">
            {{ detail.rule_summary || $t("由官方授予，关注社区活动获取。") }}
          </p>
          <el-skeleton v-if="progressLoading" :rows="3" animated />
          <div v-if="progressError" role="alert">
            {{ progressError
            }}<el-button type="text" @click="loadProgress(detail)">{{
              $t("重试")
            }}</el-button>
          </div>
          <section
            v-for="(group, index) in progressGroups"
            :key="index"
            class="badge-condition-group"
          >
            <h4>{{ group.matched ? $t("已达成") : $t("进行中") }}</h4>
            <div v-for="condition in group.conditions" :key="condition.condition_id">
              <span>{{ achievementMetric(condition.metric_code) }}</span
              ><strong
                >{{ condition.current_value }} / {{ condition.threshold_value }}</strong
              >
              <p class="social-muted">{{ achievementRule(condition) }}</p>
              <el-progress
                :percentage="
                  Math.min(
                    100,
                    Math.max(0, Math.round(Number(condition.progress_ratio || 0) * 100))
                  )
                "
              />
            </div></section></template
        ><template v-else
          ><p class="social-muted">
            {{ $t("获得时间 {p0}", { p0: accountDate(detail.granted_at) }) }}
          </p>
          <el-button
            v-if="detail.is_selectable"
            type="primary"
            :loading="saving"
            @click="selectBadge(detail)"
            >{{ isSelected(detail) ? $t("取消展示") : $t("展示此勋章") }}</el-button
          ></template
        ></template
      ></el-dialog
    ></Workspace
  >
</template>
<script>
import Medal from "~/components/social/Medal.vue";
import {
  achievementMetric,
  achievementRule,
  achievementProgressStatus,
} from "~/utils/achievement-labels";
import Workspace from "~/components/social/Workspace.vue";
import account from "~/plugins/api/account";
import accountPage from "~/mixins/account-page";
export default {
  components: { Workspace, Medal },
  mixins: [accountPage],
  data: () => ({
    summary: {},
    unlocked: [],
    locked: [],
    title: {
      adjective_achievement_id: null,
      noun_achievement_id: null,
      is_visible: true,
    },
    filter: "unlocked",
    loading: true,
    error: "",
    saving: false,
    detail: null,
    detailVisible: false,
    progress: null,
    progressLoading: false,
    progressError: "",
    progressRequest: 0,
  }),
  computed: {
    visible() {
      return this.filter === "locked" ? this.locked : this.unlocked;
    },
    titlePreview() {
      return ["adjective", "noun"]
        .map((type) => {
          const term = this.unlocked.find(
            (item) => item.achievement_id === this.title[`${type}_achievement_id`]
          );
          return term ? term.title_term_text : "";
        })
        .join("");
    },
    progressGroups() {
      return (this.progress && (this.progress.group_results || [])) || [];
    },
  },
  methods: {
    achievementMetric,
    achievementRule,
    achievementProgressStatus,
    image(badge) {
      const src =
        badge.badge_image_url ||
        badge.medal_image ||
        badge.badge_image ||
        "/social/icons/icon_my_name_tag.png";
      return src.replace(/^\/static\//, "/social/");
    },
    terms(type) {
      return this.unlocked.filter(
        (item) => item.title_term_type === type && item.title_term_text
      );
    },
    isSelected(badge) {
      return (
        this.summary.selected_badge &&
        this.summary.selected_badge.achievement_id === badge.achievement_id
      );
    },
    async load() {
      this.loading = true;
      this.error = "";
      try {
        const [summary, list, definitions] = await Promise.all([
          account.achievementSummary(),
          account.achievements(),
          account.achievementDefinitions(),
        ]);
        this.summary = summary;
        this.unlocked = list.list || [];
        const ids = new Set(this.unlocked.map((item) => item.achievement_id));
        this.locked = (definitions.list || [])
          .filter((item) => !ids.has(item.achievement_id))
          .map((item) => ({ ...item, is_locked: true }));
        const title = summary.title_profile || {};
        this.title = {
          adjective_achievement_id: title.adjective_achievement_id || null,
          noun_achievement_id: title.noun_achievement_id || null,
          is_visible: !!title.is_visible,
        };
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async open(badge) {
      this.detail = badge;
      this.detailVisible = true;
      this.progress = null;
      if (badge.is_locked) this.loadProgress(badge);
    },
    async loadProgress(badge) {
      const request = ++this.progressRequest;
      this.progressLoading = true;
      this.progressError = "";
      try {
        const result = await account.achievementProgress(badge.achievement_id);
        if (request === this.progressRequest) this.progress = result.result;
      } catch (error) {
        if (request === this.progressRequest) this.progressError = error.message;
      } finally {
        if (request === this.progressRequest) this.progressLoading = false;
      }
    },
    async selectBadge(badge) {
      if (this.saving) return;
      this.saving = true;
      try {
        await account.selectBadge(this.isSelected(badge) ? null : badge.achievement_id);
        this.summary = await account.achievementSummary();
        this.$message.success(this.$t("展示勋章已更新"));
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.saving = false;
      }
    },
    async saveTitle() {
      if (this.saving) return;
      this.saving = true;
      try {
        const result = await account.saveTitle(this.title);
        this.summary.title_profile = result.title_profile;
        const user = await account.profile();
        localStorage.setItem("LogHomeUserInfo", JSON.stringify(user));
        this.$message.success(this.$t("称号已保存"));
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.saving = false;
      }
    },
  },
  head: () => ({ title: "我的勋章 - 原木社区" }),
};
</script>
<style scoped>
.achievement-overview {
  display: grid;
  grid-template-columns: 230px minmax(0, 1fr);
  gap: 20px;
}
.badge-showcase {
  text-align: center;
}
.badge-showcase img {
  width: 88px;
  height: 88px;
  object-fit: contain;
  image-rendering: pixelated;
}
.badge-showcase > i {
  display: block;
  font-size: 70px;
  color: #c2ab88;
  margin: 20px;
}
.badge-showcase strong {
  display: block;
  margin-top: 16px;
  font-size: 14px;
}
.title-preview {
  font-size: 23px;
  padding: 20px 0;
  color: var(--wood, #947358);
}
.title-selects {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.title-selects .el-select {
  width: 100%;
}
.el-switch {
  margin-right: 18px;
}
.badge-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.badge-option {
  display: flex;
  align-items: center;
  gap: 18px;
  background: var(--surface, #fffdf9);
  border: 1px solid var(--line, #e9e0d5);
  border-radius: 12px;
  padding: 22px;
  text-align: left;
  cursor: pointer;
  color: var(--ink, #382d25);
}
.badge-option img {
  width: 68px;
  height: 68px;
  object-fit: contain;
  image-rendering: pixelated;
}
.badge-option.locked img {
  filter: grayscale(1);
  opacity: 0.5;
}
.badge-option strong {
  font-size: 16px;
}
.badge-option p {
  font-size: 12px;
  color: var(--muted, #82766c);
  line-height: 1.8;
}
.badge-option span {
  font-size: 11px;
  color: var(--wood, #947358);
}
.badge-detail-image {
  text-align: center;
  background: #f4ecdf;
  border-radius: 12px;
  padding: 24px;
}
.badge-detail-image img {
  width: 130px;
  height: 130px;
  object-fit: contain;
  image-rendering: pixelated;
}
.badge-condition-group {
  background: #f7f2e9;
  border-radius: 10px;
  padding: 16px;
  margin: 12px 0;
}
.badge-condition-group > div {
  margin: 16px 0;
  font-size: 13px;
}
.badge-condition-group strong {
  float: right;
}
.badge-condition-group .el-progress {
  margin-top: 8px;
}
@media (max-width: 1000px) {
  .achievement-overview,
  .badge-grid {
    grid-template-columns: 1fr;
  }
  .title-selects {
    grid-template-columns: 1fr;
  }
}
</style>
