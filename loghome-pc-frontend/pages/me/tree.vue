<template>
  <Workspace :title="$t('原木树场')" active="/me"
    ><template #actions
      ><el-switch v-model="night" :active-text="$t('夜景')" /><el-button
        icon="el-icon-refresh"
        :loading="loading"
        @click="load"
        >{{ $t("刷新树场") }}</el-button
      ></template
    >
    <div v-if="error" class="social-panel" role="alert">
      <el-alert :title="error" type="error" :closable="false" /><el-button
        @click="load"
        >{{ $t("重试") }}</el-button
      >
    </div>
    <el-skeleton v-if="loading" class="social-panel" :rows="5" animated /><template v-else
      ><div class="tree-desktop-grid">
        <section class="social-panel tree-scene-panel">
          <client-only
            ><TreeScene
              v-if="highQuality"
              :state="sceneState"
              :scene-theme="sceneState.treeType || 'oak_island'"
              :night-mode="night"
              @scene-unavailable="highQuality = false" />
            <div v-else class="tree-classic">
              <img :src="classicImage" :alt="$t('树木成长阶段')" /></div
          ></client-only>
          <div class="tree-scene-caption">
            <strong>{{
              visiting ? $t("{p0} 的树场", { p0: visiting.target_name }) : $t("我的树场")
            }}</strong
            ><span>{{
              $t("{p0} / {p1} 成长值", {
                p0: sceneState.tree_status || $t("未种植"),
                p1: Math.floor(sceneState.growth_val || 0),
              })
            }}</span
            ><el-button v-if="visiting" size="small" @click="visiting = null">{{
              $t("返回自己的树场")
            }}</el-button>
          </div>
          <div v-if="visiting" class="friend-orbs">
            <p class="social-muted">{{ visiting.steal_tip }}</p>
            <button
              v-for="orb in sceneState.exp_orbs || []"
              :key="orb.orb_id"
              :disabled="busy || !visiting.can_steal"
              @click="steal(orb)"
            >
              <i class="el-icon-sugar" />{{
                $t("{p0} 成长值", { p0: orb.reward })
              }}</button
            ><el-button
              v-if="(sceneState.exp_orbs || []).length"
              :disabled="busy || !visiting.can_steal"
              @click="steal()"
              >{{ $t("收集可获取成长值") }}</el-button
            >
          </div>
        </section>
        <aside>
          <section class="social-panel">
            <h2>{{ $t("场景设置") }}</h2>
            <el-select
              v-model="selectedTheme"
              style="width: 100%; margin-bottom: 18px"
              :disabled="busy || !!visiting"
              :aria-label="$t('树场场景')"
              @change="changeScene"
              ><el-option
                v-for="theme in themes"
                :key="theme.key"
                :value="theme.key"
                :label="`${$t(theme.label)}${
                  !['oak_island', 'birch_blossom'].includes(theme.key) &&
                  !membershipActive
                    ? $t(' / 通行证专属')
                    : ''
                }`"
            /></el-select>
            <p v-if="settingsError" class="social-muted" role="alert">
              {{ settingsError }}
            </p>
            <el-switch
              v-model="highQuality"
              :active-text="$t('高质量 3D')"
              @change="saveQuality"
            />
            <p class="social-muted">{{ $t("关闭后使用经典视图，减少渲染开销。") }}</p>
            <el-divider /><el-switch
              v-model="notificationsDisabled"
              :disabled="busy"
              :active-text="$t('关闭树场通知')"
              @change="changeNotifications"
            />
            <p class="social-muted">{{ $t("关闭后不接收成长和好友串门通知。") }}</p>
          </section>
          <section class="social-panel">
            <h2>{{ $t("好友树场") }}</h2>
            <p v-if="!dashboard.steal_feature_enabled" class="social-muted">
              {{ $t("好友串门暂未开放") }}
            </p>
            <template v-else
              ><nuxt-link to="/me/friends" class="social-muted">{{
                $t("互相关注后，一起培育小树。")
              }}</nuxt-link>
              <div
                v-for="friend in dashboard.steal_targets || []"
                :key="friend.user_id"
                class="social-list-row"
              >
                <Avatar
                  :src="friend.avatar_url"
                  :frame="friend.avatar_frame"
                  :size="40"
                />
                <div class="row-main">
                  <strong>{{ friend.name }}</strong>
                  <p>{{ friend.has_active_tree ? $t("已种植") : $t("未种植") }}</p>
                </div>
                <el-button
                  size="small"
                  :disabled="busy || !friend.has_active_tree"
                  @click="visit(friend)"
                  >{{ $t("串门") }}</el-button
                >
              </div>
              <p v-if="!(dashboard.steal_targets || []).length" class="social-muted">
                {{ $t("暂时没有可串门的好友树场") }}
              </p></template
            >
          </section>
        </aside>
      </div>
      <ReaderRewards
        v-show="!visiting"
        ref="rewards"
        @tree-updated="ownTree = $event"
        embedded
      />
      <section
        v-if="dashboard.recent_steal_logs && dashboard.recent_steal_logs.length"
        class="social-panel"
      >
        <h2>{{ $t("树场动态") }}</h2>
        <div
          v-for="(log, index) in dashboard.recent_steal_logs"
          :key="log.id || index"
          class="social-list-row"
        >
          <div class="row-main">
            <strong>{{
              $t("{p0} 收集了 {p1} 成长值", {
                p0: log.thief_name || log.name || $t("好友"),
                p1: log.stolen_reward || log.reward || 0,
              })
            }}</strong>
            <p>{{ accountDate(log.created_at || log.create_time) }}</p>
          </div>
        </div>
      </section></template
    ></Workspace
  >
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import Avatar from "~/components/social/Avatar.vue";
import ReaderRewards from "~/components/read/ReaderRewards.vue";
import { socialRequest } from "~/plugins/api/social";
import account from "~/plugins/api/account";
import accountPage from "~/mixins/account-page";
import {
  isTreePlantLowPerformanceMode,
  setTreePlantLowPerformanceMode,
  TREE_PLANT_SCENE_THEMES,
} from "~/utils/tree-scene-settings";
const get = (path, params = {}) =>
  socialRequest(`/treePlant/${path}`, params, "GET", null, true);
export default {
  components: {
    Workspace,
    Avatar,
    ReaderRewards,
    TreeScene: () => import("~/components/social/tree/TreeScene.vue"),
  },
  mixins: [accountPage],
  data: () => ({
    ownTree: {},
    dashboard: {},
    visiting: null,
    loading: true,
    error: "",
    busy: false,
    night: false,
    highQuality: true,
    selectedTheme: "oak_island",
    membershipActive: false,
    notificationsDisabled: false,
    settingsError: "",
    themes: TREE_PLANT_SCENE_THEMES,
  }),
  computed: {
    sceneState() {
      if (this.visiting) return this.visiting.tree || {};
      return this.ownTree;
    },
    classicImage() {
      const map = {
        未种植: "none",
        种植: "planted",
        开花: "flower",
        结果: "fruit",
      };
      return `/social/tree/island-${map[this.sceneState.tree_status] || "none"}.png`;
    },
  },
  mounted() {
    this.highQuality = !isTreePlantLowPerformanceMode();
  },
  methods: {
    async changeScene(theme) {
      if (this.busy || this.visiting) return;
      const old = this.ownTree.treeType || "oak_island";
      if (!["oak_island", "birch_blossom"].includes(theme) && !this.membershipActive) {
        this.selectedTheme = old;
        this.$confirm(
          this.$t("此树场场景需要原木通行证或超级原木通行证。"),
          this.$t("通行证专属场景"),
          {
            confirmButtonText: this.$t("了解通行证"),
            cancelButtonText: this.$t("继续浏览"),
          }
        )
          .then(() => this.$router.push("/membership"))
          .catch(() => {});
        return;
      }
      this.busy = true;
      try {
        const result = await socialRequest(
          "/treePlant/set_tree_scene_theme",
          {},
          "POST",
          { tree_type: theme },
          true
        );
        this.$set(this.ownTree, "treeType", result.tree_type);
        if (this.$refs.rewards) {
          this.$refs.rewards.theme = result.tree_type;
          if (this.$refs.rewards.tree) this.$refs.rewards.tree.theme = result.tree_type;
        }
        this.$message.success(this.$t("树场场景已更新"));
      } catch (error) {
        this.selectedTheme = old;
        this.$message.error(error.message);
      } finally {
        this.busy = false;
      }
    },
    async changeNotifications(disabled) {
      if (this.busy) return;
      this.busy = true;
      try {
        const result = await socialRequest(
          "/treePlant/notification_settings",
          {},
          "POST",
          { notifications_disabled: disabled },
          true
        );
        this.notificationsDisabled = !!result.notifications_disabled;
        this.$message.success(this.$t("树场通知设置已更新"));
      } catch (error) {
        this.notificationsDisabled = !disabled;
        this.$message.error(error.message);
      } finally {
        this.busy = false;
      }
    },
    saveQuality() {
      setTreePlantLowPerformanceMode(!this.highQuality);
    },
    async load() {
      if (this.busy) return;
      this.loading = true;
      this.error = "";
      try {
        const [rows, dashboard] = await Promise.all([
          get("get_treePlant_of"),
          get("steal_dashboard"),
        ]);
        this.ownTree = rows[0] || {
          tree_status: "未种植",
          treeType: "oak_island",
        };
        this.dashboard = dashboard;
        this.selectedTheme = this.ownTree.treeType || "oak_island";
        this.settingsError = "";
        const settings = await Promise.allSettled([
          account.membership(),
          get("notification_settings"),
        ]);
        if (settings[0].status === "fulfilled")
          this.membershipActive = !!settings[0].value.active;
        if (settings[1].status === "fulfilled")
          this.notificationsDisabled = !!settings[1].value.notifications_disabled;
        else this.settingsError = this.$t("通知设置暂不可用，请刷新重试");
        this.visiting = null;
        this.$nextTick(() => {
          if (this.$refs.rewards) this.$refs.rewards.load();
        });
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async visit(friend) {
      if (this.busy) return;
      this.busy = true;
      try {
        this.visiting = await get("visit_friend_tree", {
          target_user_id: friend.user_id,
        });
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.busy = false;
      }
    },
    async steal(orb) {
      if (this.busy || !this.visiting || !this.visiting.can_steal) return;
      this.busy = true;
      try {
        const result = await socialRequest(
          "/treePlant/steal_friend_energy",
          {},
          "POST",
          {
            target_user_id: this.visiting.target_user_id,
            ...(orb ? { orb_id: orb.orb_id } : {}),
          },
          true
        );
        if (result.visit_scene) this.visiting = result.visit_scene;
        if (result.steal_dashboard) this.dashboard = result.steal_dashboard;
        this.$message.success(this.$t("获得 {p0} 成长值", { p0: result.reward || 0 }));
      } catch (error) {
        this.$message.error(error.message);
        try {
          this.visiting = await get("visit_friend_tree", {
            target_user_id: this.visiting.target_user_id,
          });
        } catch (_) {}
      } finally {
        this.busy = false;
      }
    },
  },
  head: () => ({ title: "原木树场 - 原木社区" }),
};
</script>
<style scoped>
.tree-desktop-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 290px;
  gap: 24px;
}
.tree-scene-panel {
  padding: 0;
  overflow: hidden;
  position: relative;
}
.tree-scene-panel .oak-tree-3d {
  height: 420px;
}
.tree-classic {
  height: 420px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #edf2d7;
}
.tree-classic img {
  width: 70%;
  max-height: 380px;
  object-fit: contain;
}
.tree-scene-caption {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  gap: 16px;
  border-top: 1px solid var(--line, #e9e0d5);
}
.tree-scene-caption strong {
  font-size: 16px;
}
.tree-scene-caption span {
  font-size: 12px;
  color: var(--muted);
}
.friend-orbs {
  padding: 0 20px 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.friend-orbs p {
  width: 100%;
}
.friend-orbs > button:not(.el-button) {
  background: #e9efd8;
  color: #596a39;
  border: 1px solid #b7c58d;
  border-radius: 9px;
  padding: 10px;
  cursor: pointer;
}
@media (max-width: 1100px) {
  .tree-desktop-grid {
    grid-template-columns: 1fr;
  }
  .tree-desktop-grid > aside {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}
@media (max-width: 650px) {
  .tree-desktop-grid > aside {
    grid-template-columns: 1fr;
  }
  .tree-scene-caption {
    flex-wrap: wrap;
  }
}
</style>
