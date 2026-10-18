<template>
  <Workspace :title="$t('头像挂件')" active="/me"
    ><template #actions
      ><el-button
        type="primary"
        :loading="saving"
        :disabled="loading || selected === pending"
        @click="save"
        >{{ selected === pending ? $t("正在使用") : $t("使用此挂件") }}</el-button
      ></template
    >
    <div v-if="error" class="social-panel social-state" role="alert">
      {{ error }}<br /><el-button @click="load">{{ $t("重试") }}</el-button>
    </div>
    <el-skeleton v-else-if="loading" class="social-panel" :rows="6" animated />
    <div v-else class="frames-layout">
      <section>
        <div class="social-tabs">
          <button
            v-for="tab in filters"
            :key="tab.key"
            :class="{ active: filter === tab.key }"
            @click="filter = tab.key"
          >
            {{ $t(tab.label) }}
          </button>
        </div>
        <div class="frame-grid">
          <button
            v-if="filter === 'all' || filter === 'free'"
            class="frame-option"
            :class="{ selected: pending === null }"
            @click="pending = null"
          >
            <Avatar :src="user.avatar_url" :size="88" /><strong>{{
              $t("不使用挂件")
            }}</strong
            ><span>{{ $t("免费") }}</span></button
          ><button
            v-for="frame in filtered"
            :key="frame.frame_id"
            class="frame-option"
            :class="{
              selected: pending === frame.frame_id,
              locked: !frame.can_use,
            }"
            :aria-pressed="pending === frame.frame_id"
            @click="choose(frame)"
          >
            <Avatar :src="user.avatar_url" :frame="frame" :size="88" /><strong>{{
              frame.name
            }}</strong
            ><span
              ><i v-if="!frame.can_use" class="el-icon-lock" />{{
                tierLabel(frame.required_tier)
              }}</span
            >
          </button>
        </div>
      </section>
      <aside class="social-panel frame-preview">
        <h2>{{ $t("预览") }}</h2>
        <Avatar :src="user.avatar_url" :frame="preview" :size="160" />
        <h3>{{ user.name }}</h3>
        <p class="social-muted">{{ preview ? preview.name : $t("不使用挂件") }}</p>
        <nuxt-link to="/membership">{{ $t("了解通行证权益 →") }}</nuxt-link>
      </aside>
    </div></Workspace
  >
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import Avatar from "~/components/social/Avatar.vue";
import account from "~/plugins/api/account";
import accountPage from "~/mixins/account-page";
export default {
  components: { Workspace, Avatar },
  mixins: [accountPage],
  data: () => ({
    frames: [],
    user: {},
    selected: null,
    pending: null,
    filter: "all",
    loading: true,
    error: "",
    saving: false,
    filters: [
      { key: "all", label: "全部" },
      { key: "free", label: "免费" },
      { key: "standard", label: "原木通行证" },
      { key: "super", label: "超级通行证" },
    ],
  }),
  computed: {
    filtered() {
      return this.frames.filter(
        (item) => this.filter === "all" || item.required_tier === this.filter
      );
    },
    preview() {
      return this.frames.find((item) => item.frame_id === this.pending) || null;
    },
  },
  methods: {
    tierLabel(tier) {
      return (this.filters.find((item) => item.key === tier) || this.filters[1]).label;
    },
    async load() {
      this.loading = true;
      this.error = "";
      try {
        const [catalog, user] = await Promise.all([account.frames(), account.profile()]);
        this.frames = catalog.frames || [];
        this.selected =
          catalog.selected_frame_id == null ? null : Number(catalog.selected_frame_id);
        this.pending = this.selected;
        this.user = user;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    choose(frame) {
      if (!frame.can_use) {
        this.$confirm(
          this.$t("需要{p0}才能使用此挂件。", {
            p0: this.tierLabel(frame.required_tier),
          }),
          this.$t("挂件权益"),
          {
            confirmButtonText: this.$t("了解通行证"),
            cancelButtonText: this.$t("继续浏览"),
          }
        )
          .then(() => this.$router.push("/membership"))
          .catch(() => {});
        return;
      }
      this.pending = frame.frame_id;
    },
    async save() {
      if (this.saving || this.selected === this.pending) return;
      this.saving = true;
      try {
        const result = await account.selectFrame(this.pending);
        this.selected =
          result.selected_frame_id == null ? null : Number(result.selected_frame_id);
        this.user.avatar_frame = result.avatar_frame || null;
        this.user.selected_avatar_frame_id = this.selected;
        localStorage.setItem("LogHomeUserInfo", JSON.stringify(this.user));
        this.$message.success(this.$t("头像挂件已更新"));
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.saving = false;
      }
    },
  },
  head: () => ({ title: "头像挂件 - 原木社区" }),
};
</script>
<style scoped>
.frames-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 240px;
  gap: 24px;
}
.frame-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(135px, 1fr));
  gap: 14px;
}
.frame-option {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  padding: 22px 10px;
  background: var(--surface, #fffdf9);
  border: 1px solid var(--line, #e9e0d5);
  border-radius: 12px;
  color: var(--ink, #382d25);
  cursor: pointer;
}
.frame-option.selected {
  border-color: var(--wood, #947358);
  background: var(--selection-bg, #f6e9dc);
  box-shadow: inset 0 0 0 1px var(--wood, #947358);
}
.frame-option strong {
  font-size: 13px;
  font-weight: 500;
}
.frame-option span {
  font-size: 11px;
  color: var(--muted, #82766c);
}
.frame-option.locked {
  background: var(--soft, #f1f3f5);
}
.frame-preview {
  text-align: center;
  align-self: start;
  position: sticky;
  top: 96px;
}
.frame-preview h3 {
  font-size: 18px;
  margin-top: 24px;
}
.frame-preview a {
  font-size: 12px;
  color: var(--wood, #947358);
}
@media (max-width: 1100px) {
  .frames-layout {
    grid-template-columns: 1fr;
  }
  .frame-preview {
    display: none;
  }
}
</style>
