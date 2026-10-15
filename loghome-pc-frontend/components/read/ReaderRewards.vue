<template>
  <section
    class="reader-rewards"
    :class="{ embedded }"
    aria-labelledby="reader-rewards-title"
  >
    <header v-if="!embedded" class="rewards-heading">
      <div>
        <nuxt-link to="/read">{{ $t("← 返回书库") }}</nuxt-link>
        <h1 id="reader-rewards-title">{{ $t("阅读奖励与树场") }}</h1>
        <p>{{ $t("阅读、分享与交流，让你的树慢慢长大。") }}</p>
      </div>
      <div>
        <nuxt-link to="/read/resources">{{ $t("如何获取原木") }}</nuxt-link
        ><button :disabled="loading || !!busy" @click="load">
          {{ loading ? $t("刷新中…") : $t("刷新状态") }}
        </button>
      </div>
    </header>
    <div v-if="!ready" class="rewards-gate">{{ $t("正在确认账户…") }}</div>
    <div v-else-if="!token || authExpired" class="rewards-gate">
      <h2>{{ authExpired ? $t("登录已失效") : $t("登录后培育你的树木") }}</h2>
      <p>{{ $t("成长值、经验球、收获和余额由当前账号的树场记录决定。") }}</p>
      <nuxt-link :to="loginUrl">{{ $t("登录后继续") }}</nuxt-link>
    </div>
    <template v-else>
      <p v-if="error" class="error" role="alert">
        {{ error }}
        <button :disabled="!!busy || loading" @click="load">{{ $t("刷新核对") }}</button>
      </p>
      <p v-if="balanceError" class="error" role="alert">{{ balanceError }}</p>
      <p v-if="notice" class="notice" role="status">{{ notice }}</p>
      <p v-if="uncertain" class="error" role="alert">
        {{ $t("上次操作结果尚未确认，请先刷新树场和余额后再操作。") }}
      </p>
      <div class="rewards-layout">
        <aside class="tree-card" :aria-label="$t('我的树木')">
          <template v-if="tree"
            ><div
              class="tree-pixel-art"
              :class="{ mature: tree.status === '结果', empty: !tree.active }"
              aria-hidden="true"
            >
              <div class="pixel-ground" />
              <div class="pixel-trunk" />
              <div class="pixel-leaves" />
              <div class="pixel-fruit" v-if="tree.status === '结果'" />
            </div>
            <span class="tree-label">{{ themeName }}</span>
            <h2>
              {{
                tree.status === "未种植"
                  ? tree.id
                    ? $t("继续种下下一棵树")
                    : $t("种下你的第一份期待")
                  : tree.status === "结果"
                  ? $t("这棵树可以收获了")
                  : tree.status === "开花"
                  ? $t("树木正在开花")
                  : $t("树苗正在生长")
              }}
            </h2>
            <div class="growth-row">
              <span>{{ $t("成长值") }}</span
              ><strong>{{ tree.growth }} / {{ tree.maximum }}</strong>
            </div>
            <progress
              :value="Math.min(tree.growth, tree.maximum)"
              :max="tree.maximum"
              :aria-label="$t('树木成长进度')"
            />
            <p class="quiet" v-if="tree.growth > tree.maximum">
              {{
                $t("多出的 {p0} 成长值在下次种植时继续保留。", {
                  p0: tree.growth - tree.maximum,
                })
              }}
            </p>
            <p class="quiet">
              {{ tree.benefits.name
              }}<template v-if="tree.benefits.multiplier > 1">{{
                $t("· 任务成长值 {p0} 倍加成", { p0: tree.benefits.multiplier })
              }}</template>
            </p>
            <template v-if="!tree.active"
              ><label class="theme-label"
                >{{ $t("树苗主题")
                }}<select v-model="theme" :disabled="!!busy">
                  <option v-for="option in themes" :key="option.key" :value="option.key">
                    {{ option.name }}
                  </option>
                </select></label
              ><button
                class="primary"
                :disabled="!!busy || loading || uncertain"
                @click="plant"
              >
                {{ busy === "plant" ? $t("种植中…") : $t("种下树苗") }}
              </button></template
            ><button
              v-else-if="tree.status === '结果'"
              class="primary"
              :disabled="!!busy || loading || uncertain"
              @click="harvest"
            >
              {{ busy === "harvest" ? $t("收获中…") : $t("收获原木与苹果") }}
            </button>
            <p v-else class="quiet">
              {{ $t("完成任务、收集经验球，继续积累成长值。") }}
            </p></template
          >
          <p v-else class="quiet">
            {{ loading ? $t("正在读取树木信息…") : $t("树木信息暂不可用，请刷新重试。") }}
          </p>
          <dl class="resource-balances">
            <div>
              <dt>{{ $t("我的原木") }}</dt>
              <dd>{{ balances ? balances.log.toLocaleString() : "—" }}</dd>
            </div>
            <div>
              <dt>{{ $t("我的苹果") }}</dt>
              <dd>{{ balances ? balances.apple.toLocaleString() : "—" }}</dd>
            </div>
          </dl>
          <nuxt-link to="/read/resources">{{ $t("获取原木的方法 →") }}</nuxt-link>
        </aside>
        <div class="rewards-main" v-if="tree">
          <section class="rewards-panel" aria-labelledby="orbs-title">
            <header>
              <div>
                <h2 id="orbs-title">{{ $t("经验球") }}</h2>
                <p class="quiet">
                  {{
                    tree.orbs.length
                      ? $t("待收集 ") + tree.orbs.length + $t(" 个 · 成长值 ") + orbTotal
                      : tree.active
                      ? $t("新的经验球出现后会显示在这里。")
                      : $t("种下树苗后，开始积累成长值。")
                  }}
                </p>
              </div>
              <button
                v-if="tree.orbs.length"
                :disabled="!!busy || loading || uncertain"
                @click="collect()"
              >
                {{ busy === "collect" ? $t("收集中…") : $t("一键收集") }}
              </button>
            </header>
            <div class="orb-grid">
              <button
                v-for="orb in tree.orbs"
                :key="orb.orb_id"
                :disabled="!!busy || loading || uncertain"
                :aria-label="
                  $t('收集经验球 {p0}，成长值 {p1}', { p0: orb.orb_id, p1: orb.reward })
                "
                @click="collect(orb.orb_id)"
              >
                <span aria-hidden="true" class="orb-pixel" /><strong
                  >+{{ orb.reward }}</strong
                ><small>{{ $t("收集成长值") }}</small>
              </button>
            </div>
          </section>
          <section class="rewards-panel" aria-labelledby="daily-tasks-title">
            <header>
              <h2 id="daily-tasks-title">{{ $t("日常任务") }}</h2>
              <span class="quiet">{{
                $t("{p0} / {p1} 已完成", { p0: completedTasks, p1: tree.tasks.length })
              }}</span>
            </header>
            <div class="task-list">
              <article v-for="task in tree.tasks" :key="task.task_code">
                <div>
                  <h3>{{ task.task_name }}</h3>
                  <p>{{ task.task_desc }}</p>
                  <small v-if="task.multiplier > 1 && task.base != null">{{
                    $t("基础 {p0} × {p1}", { p0: task.base, p1: task.multiplier })
                  }}</small>
                </div>
                <strong class="task-reward">+{{ task.reward }} XP</strong
                ><span v-if="task.completed" class="completed">{{ $t("已完成") }}</span
                ><button
                  v-else-if="isCheckin(task)"
                  :disabled="!!busy || loading || uncertain"
                  @click="claim(task)"
                >
                  {{ busy === task.task_code ? $t("领取中…") : $t("领取") }}</button
                ><nuxt-link v-else :to="taskLink(task)">{{ $t("去完成 →") }}</nuxt-link>
              </article>
            </div>
            <p v-if="!tree.tasks.length" class="quiet">
              {{ tree.active ? $t("暂无日常任务") : $t("种植后查看今日任务") }}
            </p>
          </section>
          <section class="rewards-panel" aria-labelledby="exp-tasks-title">
            <header>
              <h2 id="exp-tasks-title">{{ $t("经验任务") }}</h2>
              <span class="quiet">{{
                $t("{p0} / {p1} 已完成", {
                  p0: completedExpTasks,
                  p1: tree.expTasks.length,
                })
              }}</span>
            </header>
            <div class="task-list">
              <article v-for="task in tree.expTasks" :key="task.task_code">
                <div>
                  <h3>{{ task.task_name }}</h3>
                  <p>{{ task.task_desc }}</p>
                  <small>{{
                    $t("{p0} · 已结算 {p1} / {p2} 次", {
                      p0: task.progress_text,
                      p1: task.completed_times,
                      p2: task.daily_limit,
                    })
                  }}</small
                  ><small v-if="task.multiplier > 1 && task.base != null">{{
                    $t("基础 {p0} × {p1}", { p0: task.base, p1: task.multiplier })
                  }}</small>
                </div>
                <strong class="task-reward">+{{ task.reward }} XP</strong
                ><span v-if="task.completed" class="completed">{{
                  $t("已自动完成")
                }}</span
                ><nuxt-link v-else :to="taskLink(task)">{{ $t("去完成 →") }}</nuxt-link>
              </article>
            </div>
            <p class="quiet" v-if="!tree.expTasks.length">
              {{ tree.active ? $t("暂无经验任务") : $t("种植后查看阅读等经验任务") }}
            </p>
            <p class="quiet" v-else>
              {{ $t("阅读等经验任务由服务端按实际进度自动结算，刷新可查看最新状态。") }}
            </p>
          </section>
        </div>
      </div>
      <footer v-if="!embedded" class="rewards-footer">
        <nuxt-link to="/me/tree">{{ $t("完整树场与好友互动 →") }}</nuxt-link
        ><nuxt-link to="/read">{{ $t("继续发现好作品 →") }}</nuxt-link>
      </footer>
    </template>
  </section>
</template>
<script>
import { readingToken } from "~/plugins/api/reading";
import {
  rewardTree,
  rewardBalances,
  harvestReceipt,
  collectionReceipt,
  TREE_THEMES,
  rewardTaskLink,
} from "~/utils/reader-rewards";
export default {
  props: { embedded: Boolean },
  data: () => ({
    ready: false,
    token: null,
    authExpired: false,
    tree: null,
    balances: null,
    theme: "oak_island",
    loading: false,
    busy: "",
    error: "",
    balanceError: "",
    notice: "",
    uncertain: false,
    version: 0,
    epoch: 0,
    themes: TREE_THEMES,
  }),
  computed: {
    loginUrl() {
      return { path: "/login", query: { redirect: "/read/rewards" } };
    },
    fullTreeUrl() {
      return `${process.env.mobileUrl}/#/pages/treePlant/treeplant`;
    },
    themeName() {
      return (
        this.themes.find((theme) => theme.key === (this.tree && this.tree.theme)) ||
        this.themes[0]
      ).name;
    },
    orbTotal() {
      return this.tree ? this.tree.orbs.reduce((sum, orb) => sum + orb.reward, 0) : 0;
    },
    completedTasks() {
      return this.tree ? this.tree.tasks.filter((task) => task.completed).length : 0;
    },
    completedExpTasks() {
      return this.tree ? this.tree.expTasks.filter((task) => task.completed).length : 0;
    },
  },
  mounted() {
    this.checkAccount();
    this.ready = true;
    window.addEventListener("storage", this.checkAccount);
    window.addEventListener("focus", this.checkAccount);
  },
  beforeDestroy() {
    this.epoch++;
    this.version++;
    window.removeEventListener("storage", this.checkAccount);
    window.removeEventListener("focus", this.checkAccount);
  },
  methods: {
    taskLink: rewardTaskLink,
    isCheckin(task) {
      return task.task_name.includes("签到");
    },
    current(token, epoch) {
      return token === readingToken() && token === this.token && epoch === this.epoch;
    },
    checkAccount() {
      const token = readingToken();
      if (this.ready && token === this.token) return;
      this.epoch++;
      this.version++;
      Object.assign(this, {
        token,
        authExpired: false,
        tree: null,
        balances: null,
        theme: "oak_island",
        loading: false,
        busy: "",
        error: "",
        balanceError: "",
        notice: "",
        uncertain: false,
      });
      if (token) this.load();
    },
    expire(error) {
      if ([401, 403].includes(error.status)) this.authExpired = true;
    },
    async load() {
      if (readingToken() !== this.token) {
        this.checkAccount();
        return;
      }
      if (!this.token || this.busy) return;
      const token = this.token,
        epoch = this.epoch,
        version = ++this.version;
      this.loading = true;
      this.error = "";
      this.balanceError = "";
      const results = await Promise.allSettled([
        this.$api.reader.tree(),
        this.$api.reader.balances(),
      ]);
      if (!this.current(token, epoch) || version !== this.version) return;
      try {
        if (results[0].status === "rejected") throw results[0].reason;
        this.tree = rewardTree(results[0].value);
        this.theme = this.tree.theme;
        if (this.$emit)
          this.$emit(
            "tree-updated",
            results[0].value[0] || { tree_status: "未种植", treeType: this.theme }
          );
      } catch (error) {
        this.tree = null;
        this.error = error.message || "树场加载失败";
        this.expire(error);
      }
      try {
        if (results[1].status === "rejected") throw results[1].reason;
        this.balances = rewardBalances(results[1].value);
      } catch (error) {
        this.balances = null;
        this.balanceError = error.message || "资源余额读取失败";
        this.expire(error);
      }
      if (!this.error && !this.balanceError) this.uncertain = false;
      this.loading = false;
    },
    async mutate(action, request, receipt) {
      if (readingToken() !== this.token) {
        this.checkAccount();
        return;
      }
      if (
        !this.token ||
        this.authExpired ||
        this.busy ||
        this.loading ||
        this.uncertain ||
        !this.tree
      )
        return;
      const token = this.token,
        epoch = this.epoch;
      this.busy = action;
      this.version++;
      this.error = "";
      this.notice = "";
      try {
        const raw = await request();
        if (!this.current(token, epoch)) return;
        this.notice = receipt(raw);
      } catch (error) {
        if (!this.current(token, epoch)) return;
        this.error = error.message || "操作失败，请刷新后重试";
        this.uncertain = !error.status || error.status >= 500;
        this.expire(error);
      } finally {
        if (this.current(token, epoch)) {
          this.busy = "";
          if (!this.uncertain) await this.load();
        }
      }
    },
    plant() {
      if (!this.tree || this.tree.active) return;
      const theme = this.theme;
      return this.mutate(
        "plant",
        () => this.$api.reader.plantTree(theme),
        (raw) => {
          if (
            !raw ||
            raw.success !== true ||
            !Number.isSafeInteger(Number(raw.plant_id)) ||
            Number(raw.plant_id) <= 0
          )
            throw new Error("种植结果尚未确认，请刷新树场");
          return "树苗已种下，开始积累成长值吧。";
        }
      );
    },
    collect(orbId) {
      if (
        !this.tree ||
        !this.tree.active ||
        !this.tree.orbs.length ||
        (orbId && !this.tree.orbs.some((orb) => orb.orb_id === orbId))
      )
        return;
      const id = this.tree.id;
      return this.mutate(
        "collect",
        () => this.$api.reader.collectTreeOrbs(id, orbId),
        (raw) => `经验球已收集，成长值 +${collectionReceipt(raw)}。`
      );
    },
    claim(task) {
      if (
        !this.tree ||
        !this.tree.active ||
        task.completed ||
        !this.isCheckin(task) ||
        !this.tree.tasks.some((row) => row.task_code === task.task_code)
      )
        return;
      return this.mutate(
        task.task_code,
        () => this.$api.reader.treeTask(task.task_code),
        (raw) => {
          if (
            !raw ||
            raw.msg !== "Task completed" ||
            typeof raw.reward !== "number" ||
            !Number.isFinite(raw.reward) ||
            raw.reward < 0
          )
            throw new Error("签到奖励尚未确认，请刷新状态");
          return `签到任务已完成，成长值 +${raw.reward}。`;
        }
      );
    },
    async harvest() {
      if (readingToken() !== this.token) {
        this.checkAccount();
        return;
      }
      if (
        !this.tree ||
        this.tree.status !== "结果" ||
        this.busy ||
        this.loading ||
        this.uncertain
      )
        return;
      const token = this.token,
        epoch = this.epoch,
        id = this.tree.id;
      this.busy = "confirm";
      try {
        await this.$confirm(
          `收获当前树木的原木与苹果？${
            this.tree.orbs.length
              ? "剩余经验球会先一并收集，多出的成长值保留给下一棵树。"
              : ""
          }`,
          "确认收获",
          { confirmButtonText: "收获", cancelButtonText: "取消", type: "info" }
        );
        if (
          !this.current(token, epoch) ||
          !this.tree ||
          this.tree.id !== id ||
          this.tree.status !== "结果"
        )
          return;
        this.busy = "";
        await this.mutate(
          "harvest",
          () => this.$api.reader.harvestTree(id),
          (raw) => {
            const result = harvestReceipt(raw, id);
            this.balances = result.balances;
            return result.replayed
              ? "已确认这棵树先前已收获，余额已更新。"
              : `收获成功：原木 +${result.rewards.log}${
                  result.rewards.apple ? "，苹果 +" + result.rewards.apple : ""
                }。`;
          }
        );
      } catch (error) {
        if (this.current(token, epoch) && error !== "cancel" && error !== "close")
          this.error = error.message || "收获确认未完成";
      } finally {
        if (this.current(token, epoch) && this.busy === "confirm") this.busy = "";
      }
    },
  },
};
</script>
<style scoped>
.reader-rewards {
  max-width: 1180px;
  margin: 0 auto;
  padding: 112px 28px 65px;
  color: #52483c;
  font-size: 14px;
}
.rewards-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 22px;
  margin-bottom: 26px;
}
.rewards-heading h1 {
  font-size: 28px;
  margin: 15px 0 10px;
}
.rewards-heading p,
.quiet {
  font-size: 13px;
  color: #998c7a;
  line-height: 1.8;
}
.rewards-heading > div:last-child {
  display: flex;
  gap: 18px;
  align-items: center;
}
a {
  color: #829355;
  text-decoration: none;
}
button,
select {
  font: inherit;
  border: 1px solid #e0d8cb;
  border-radius: 7px;
  background: white;
  color: #8a7254;
  padding: 8px 13px;
  cursor: pointer;
}
button:disabled,
select:disabled {
  opacity: 0.5;
  cursor: default;
}
button:focus-visible,
select:focus-visible,
a:focus-visible {
  outline: 2px solid #8da35e;
  outline-offset: 3px;
}
.rewards-gate {
  padding: 36px;
  background: white;
  border: 1px solid #e5e3dc;
  border-radius: 13px;
  line-height: 1.9;
}
.rewards-layout {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 22px;
}
.tree-card,
.rewards-panel {
  border: 1px solid #e5e5da;
  background: white;
  border-radius: 13px;
  padding: 24px;
  min-width: 0;
}
.tree-card {
  align-self: start;
  position: sticky;
  top: 84px;
  text-align: center;
}
.tree-card h2 {
  font-size: 19px;
  line-height: 1.6;
  margin: 10px 0 22px;
}
.tree-label {
  font-size: 12px;
  color: #a19279;
}
.growth-row {
  display: flex;
  justify-content: space-between;
  margin: 18px 0 10px;
  font-size: 13px;
  color: #968775;
}
.growth-row strong {
  font-variant-numeric: tabular-nums;
  color: #7a8c50;
}
progress {
  appearance: none;
  height: 9px;
  width: 100%;
  border: 0;
  border-radius: 5px;
  overflow: hidden;
  background: #eeeee4;
}
progress::-webkit-progress-bar {
  background: #eeeee4;
}
progress::-webkit-progress-value {
  background: #8ba158;
}
progress::-moz-progress-bar {
  background: #8ba158;
}
.primary {
  width: 100%;
  background: #879b59;
  border-color: #879b59;
  color: white;
  margin: 14px 0;
  padding: 12px;
}
.resource-balances {
  display: flex;
  border-top: 1px solid #eee8dc;
  margin: 23px 0 15px;
  padding-top: 20px;
  gap: 22px;
  justify-content: center;
}
.resource-balances dt {
  font-size: 12px;
  color: #a3947d;
  margin-bottom: 8px;
}
.resource-balances dd {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #8e744f;
}
.tree-card > a {
  font-size: 12px;
}
.theme-label {
  display: grid;
  text-align: left;
  gap: 8px;
  font-size: 12px;
  color: #a1917a;
  margin-top: 20px;
}
.theme-label select {
  width: 100%;
}
.rewards-panel {
  margin-bottom: 20px;
}
.rewards-panel > header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}
.rewards-panel h2 {
  font-size: 17px;
  margin: 0;
}
.rewards-panel header p {
  margin: 8px 0;
}
.orb-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin-top: 15px;
}
.orb-grid button {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 6px;
  background: #f8faef;
  border-color: #e2e9cc;
  padding: 12px 4px;
  color: #819549;
}
.orb-grid small {
  font-size: 10px;
}
.orb-pixel {
  display: block;
  width: 18px;
  height: 18px;
  box-shadow: 4px 0 #acc656, -4px 0 #acc656, 0 4px #acc656, 0 -4px #acc656;
  background: #d6eb83;
  margin: 5px;
}
.task-list article {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 75px 85px;
  gap: 14px;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid #eeeade;
}
.task-list article:last-child {
  border-bottom: 0;
}
.task-list h3 {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 7px;
}
.task-list p {
  margin: 0;
  font-size: 12px;
  color: #a0927e;
  line-height: 1.7;
}
.task-list small {
  display: block;
  font-size: 11px;
  color: #a59885;
  margin-top: 7px;
}
.task-reward {
  font-size: 12px;
  color: #8d9e60;
  text-align: right;
}
.task-list a,
.completed {
  font-size: 12px;
  text-align: right;
}
.completed {
  color: #aaa28d;
}
.task-list button {
  font-size: 12px;
}
.error {
  font-size: 13px;
  color: #b05d43;
  line-height: 1.8;
}
.notice {
  padding: 12px 16px;
  background: #edf3df;
  border: 1px solid #dce6c5;
  border-radius: 8px;
  color: #7c8d51;
}
.rewards-footer {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 10px;
  font-size: 13px;
}
.tree-pixel-art {
  width: 190px;
  height: 175px;
  position: relative;
  margin: 0 auto 15px;
}
.pixel-ground {
  position: absolute;
  bottom: 8px;
  left: 12px;
  width: 166px;
  height: 18px;
  background: #a8bb72;
  box-shadow: 0 8px #b2946b;
}
.pixel-trunk {
  position: absolute;
  bottom: 26px;
  left: 83px;
  width: 24px;
  height: 71px;
  background: #b08b5a;
  box-shadow: inset -7px 0 #957044;
}
.pixel-leaves {
  position: absolute;
  top: 10px;
  left: 28px;
  width: 134px;
  height: 80px;
  background: #a4b970;
  box-shadow: inset -18px -15px #91a65f, 16px 20px #a4b970, -16px 20px #a4b970,
    0 -8px #bacb8b;
}
.pixel-fruit {
  position: absolute;
  left: 55px;
  top: 60px;
  width: 12px;
  height: 12px;
  background: #dda777;
  box-shadow: 48px 18px #dda777, 76px -10px #dda777;
}
.tree-pixel-art.empty .pixel-trunk {
  height: 35px;
}
.tree-pixel-art.empty .pixel-leaves {
  transform: scale(0.4);
  top: 60px;
}
.tree-pixel-art.mature .pixel-leaves {
  background: #8ca651;
  box-shadow: inset -18px -15px #7f984c, 16px 20px #8ca651, -16px 20px #8ca651,
    0 -8px #a5bb72;
}
@media (max-width: 1000px) {
  .rewards-layout {
    grid-template-columns: 280px minmax(0, 1fr);
  }
  .tree-card,
  .rewards-panel {
    padding: 20px;
  }
  .orb-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
@media (max-width: 800px) {
  .reader-rewards {
    padding: 100px 20px 50px;
  }
  .rewards-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .rewards-layout {
    grid-template-columns: minmax(0, 1fr);
  }
  .tree-card {
    position: static;
  }
  .tree-pixel-art {
    height: 145px;
  }
  .tree-pixel-art .pixel-leaves {
    top: 0;
  }
  .orb-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}
@media (max-width: 500px) {
  .reader-rewards {
    padding-left: 14px;
    padding-right: 14px;
  }
  .task-list article {
    grid-template-columns: minmax(0, 1fr) 65px 65px;
    gap: 8px;
  }
  .task-list button {
    padding: 8px;
  }
  .orb-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .rewards-footer {
    flex-direction: column;
  }
}
.reader-rewards.embedded {
  padding: 0;
  max-width: none;
}
.embedded .rewards-layout {
  grid-template-columns: 1fr;
}
.embedded .tree-preview {
  display: none;
}
.embedded .tree-panel {
  padding: 22px;
}
.embedded .rewards-panel {
  border-radius: 14px;
}
.embedded .tasks-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
@media (max-width: 1100px) {
  .embedded .tasks-column {
    grid-template-columns: 1fr;
  }
}
</style>
