<template>
  <Workspace
    :title="miniapp.name || $t('原木实验室')"
    :description="miniapp.description"
    active="/me"
    @theme-change="sendEnvironment"
    ><template #actions
      ><el-button
        :disabled="!ready || closing || !!error || opening"
        @click="openExternal"
        >{{ $t("新窗口打开") }}</el-button
      ><el-button :disabled="closing" @click="requestClose('reload')">{{
        $t("重新加载")
      }}</el-button
      ><el-button :disabled="closing" @click="requestClose('exit')">{{
        $t("退出")
      }}</el-button></template
    >
    <div class="miniapp-container">
      <iframe
        v-if="frameUrl"
        :key="frameKey"
        ref="frame"
        :src="frameUrl"
        :title="miniapp.name"
        referrerpolicy="no-referrer"
      />
      <div v-if="loading || error" class="miniapp-status social-panel" role="status">
        <el-skeleton v-if="loading && !error" :rows="3" animated />
        <p>{{ error || $t("正在启动实验项目…") }}</p>
        <el-button v-if="error" @click="reload">{{ $t("重试") }}</el-button>
      </div>
    </div></Workspace
  >
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import { socialRequest } from "~/plugins/api/social";
import { readingToken } from "~/plugins/api/reading";
export default {
  components: { Workspace },
  data: () => ({
    miniapp: {},
    accountToken: null,
    opening: false,
    frameUrl: "",
    frameKey: 0,
    loading: true,
    error: "",
    ready: false,
    closing: false,
  }),
  mounted() {
    if (!readingToken()) {
      this.$router.replace({
        path: "/login",
        query: { redirect: this.$route.fullPath },
      });
      return;
    }
    this.accountToken = readingToken();
    window.addEventListener("storage", this.checkAccount);
    window.addEventListener("focus", this.checkAccount);
    window.addEventListener("auth-state-changed", this.checkAccount);
    this.listener = (event) => this.onMessage(event);
    this.visibility = () => this.send(document.hidden ? "pause" : "resume");
    window.addEventListener("message", this.listener);
    document.addEventListener("visibilitychange", this.visibility);
    this.reload();
  },
  beforeDestroy() {
    this.disposed = true;
    window.removeEventListener("storage", this.checkAccount);
    window.removeEventListener("focus", this.checkAccount);
    window.removeEventListener("auth-state-changed", this.checkAccount);
    window.removeEventListener("message", this.listener);
    document.removeEventListener("visibilitychange", this.visibility);
    clearTimeout(this.loadTimer);
    clearTimeout(this.closeTimer);
  },
  beforeRouteLeave(to, from, next) {
    if (this.exiting || !this.ready) {
      next();
      return;
    }
    this.leaveNext = next;
    this.requestClose("route");
  },
  methods: {
    checkAccount() {
      if (this.disposed || readingToken() === this.accountToken) return;
      this.send("pause");
      this.frameUrl = "";
      this.ready = false;
      clearTimeout(this.loadTimer);
      clearTimeout(this.closeTimer);
      this.$router.replace({
        path: "/login",
        query: { redirect: this.$route.fullPath },
      });
    },
    async openExternal() {
      if (this.opening || !this.ready || this.error || !this.frameUrl) return;
      const popup = window.open("about:blank", "_blank");
      if (!popup) {
        this.$message.warning(this.$t("请允许弹出窗口后重试"));
        return;
      }
      popup.opener = null;
      this.opening = true;
      try {
        const result = await socialRequest(
          "/users/generate_cross_site_token",
          {},
          "GET",
          null,
          true
        );
        if (
          !result.crossSiteToken ||
          this.disposed ||
          readingToken() !== this.accountToken
        )
          throw new Error("无法打开实验项目，请重新登录后重试");
        const url = new URL(this.frameUrl);
        const environment = this.environment();
        url.hash = new URLSearchParams({
          ticket: result.crossSiteToken,
          theme: environment.theme,
          locale: environment.locale,
        }).toString();
        popup.location.replace(url.href);
      } catch (error) {
        popup.close();
        this.$message.error(error.message);
      } finally {
        this.opening = false;
      }
    },
    send(type, extra = {}) {
      const frame = this.$refs.frame;
      if (frame && frame.contentWindow && this.origin)
        frame.contentWindow.postMessage(
          { namespace: "loghome-miniapp", version: 1, type, ...extra },
          this.origin
        );
    },
    environment() {
      return {
        theme:
          document.documentElement.getAttribute("data-social-theme") ||
          (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
        locale: this.$language.state.locale,
        safeArea: { top: 0, bottom: 0 },
      };
    },
    sendEnvironment() {
      if (this.ready) this.send("environment", this.environment());
    },
    async reload() {
      this.error = "";
      this.loading = true;
      this.ready = false;
      this.closing = false;
      clearTimeout(this.loadTimer);
      try {
        const id = this.$route.params.id;
        if (!/^[a-z][a-z0-9-]{0,63}$/.test(id)) throw new Error("实验项目 ID 不正确");
        const response = await socialRequest(`/miniapps/${encodeURIComponent(id)}`, {
          environment: process.env.NODE_ENV === "development" ? "debug" : "production",
        });
        if (this.disposed) return;
        const app = response.data;
        if (!app || app.id !== id) throw new Error("实验项目配置不正确");
        const url = new URL(app.url);
        if (!["https:", "http:"].includes(url.protocol))
          throw new Error("实验项目地址无效");
        this.miniapp = app;
        this.origin = url.origin;
        this.frameUrl = url.href;
        this.frameKey++;
        this.loadTimer = setTimeout(() => {
          this.error = this.$t("实验项目未能加载，请检查网络后重试");
          this.loading = false;
        }, 45000);
      } catch (error) {
        this.error = error.message;
        this.loading = false;
      }
    },
    startLoadingTimeout(duration = 45000) {
      clearTimeout(this.loadTimer);
      this.loadTimer = setTimeout(() => {
        if (this.loading) {
          this.error = this.$t("实验项目未能加载，请检查网络后重试");
          this.loading = false;
        }
      }, duration);
    },
    async onMessage(event) {
      const frame = this.$refs.frame,
        message = event.data;
      if (
        !frame ||
        event.source !== frame.contentWindow ||
        event.origin !== this.origin ||
        !message ||
        message.namespace !== "loghome-miniapp" ||
        message.version !== 1
      )
        return;
      if (
        message.type === "loading" &&
        this.loading &&
        Number.isInteger(message.step) &&
        message.step >= 0 &&
        message.step < message.total &&
        message.total <= 20
      )
        this.startLoadingTimeout(120000);
      if (message.type === "ready" && !this.authenticating) {
        this.authenticating = true;
        const key = this.frameKey;
        try {
          const result = await socialRequest(
            "/users/generate_cross_site_token",
            {},
            "GET",
            null,
            true
          );
          if (key !== this.frameKey || this.disposed) return;
          if (!result.crossSiteToken) throw new Error("登录票据获取失败");
          this.ready = true;
          this.send("init", {
            crossSiteToken: result.crossSiteToken,
            ...this.environment(),
          });
        } catch (error) {
          this.error = error.message;
          this.loading = false;
        } finally {
          this.authenticating = false;
        }
      }
      if (message.type === "loaded" && this.ready) {
        this.loading = false;
        this.error = "";
        clearTimeout(this.loadTimer);
      }
      if (message.type === "error") {
        this.error = message.message || this.$t("实验项目启动失败");
        this.loading = false;
        clearTimeout(this.loadTimer);
      }
      if (message.type === "close-ready" && message.requestId === this.closeId) {
        clearTimeout(this.closeTimer);
        this.completeClose();
      }
      if (message.type === "close-failed" && message.requestId === this.closeId)
        this.forceClose();
    },
    requestClose(action) {
      if (this.closing) return;
      this.closeAction = action;
      if (!this.ready) {
        this.completeClose();
        return;
      }
      this.closing = true;
      this.closeId = `${Date.now()}:${Math.random()}`;
      this.send("close", { requestId: this.closeId });
      this.closeTimer = setTimeout(() => this.forceClose(), 8000);
    },
    completeClose() {
      this.closing = false;
      if (this.closeAction === "reload") this.reload();
      else {
        this.exiting = true;
        if (this.leaveNext) this.leaveNext();
        else this.$router.push("/me/lab");
      }
    },
    async forceClose() {
      clearTimeout(this.closeTimer);
      try {
        await this.$confirm(
          this.$t("实验项目未确认存档成功。退出可能丢失本次未保存进度。"),
          this.$t("存档尚未确认"),
          { confirmButtonText: this.$t("退出"), cancelButtonText: this.$t("继续等待") }
        );
        this.completeClose();
      } catch (_) {
        this.closing = false;
        this.closeId = "";
        this.send("resume");
        if (this.leaveNext) {
          this.leaveNext(false);
          this.leaveNext = null;
        }
      }
    },
  },
  head() {
    return { title: `${this.miniapp.name || "原木实验室"} - 原木社区` };
  },
};
</script>
<style scoped>
.miniapp-container {
  height: calc(100dvh - 230px);
  min-height: 500px;
  position: relative;
  border: 1px solid var(--line, #e2e6eb);
  border-radius: 16px;
  overflow: hidden;
  background: var(--soft, #f1f3f5);
}
.miniapp-container iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
.miniapp-status {
  position: absolute;
  top: 30%;
  left: 15%;
  right: 15%;
  text-align: center;
}
</style>
