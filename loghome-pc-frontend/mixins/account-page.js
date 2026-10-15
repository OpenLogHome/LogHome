import { readingToken } from "~/plugins/api/reading";
export default {
  mounted() {
    this.accountToken = readingToken();
    this.accountChanged = () => {
      if (readingToken() !== this.accountToken) {
        this.accountToken = readingToken();
        this.$router.replace({
          path: "/login",
          query: { redirect: this.$route.fullPath },
        });
      }
    };
    window.addEventListener("storage", this.accountChanged);
    window.addEventListener("auth-state-changed", this.accountChanged);
    window.addEventListener("focus", this.accountChanged);
    if (this.$options.requiresAuth !== false && !readingToken()) {
      this.$router.replace({
        path: "/login",
        query: { redirect: this.$route.fullPath },
      });
      return;
    }
    this.load();
  },
  beforeDestroy() {
    window.removeEventListener("storage", this.accountChanged);
    window.removeEventListener("auth-state-changed", this.accountChanged);
    window.removeEventListener("focus", this.accountChanged);
  },
  methods: {
    async confirmAction(content, title) {
      const token = readingToken();
      try {
        await this.$confirm(content, title, {
          confirmButtonText: this.$t("确认"),
          cancelButtonText: this.$t("取消"),
        });
        if (!token || readingToken() !== token) {
          this.$message.info(this.$t("账号已切换，请刷新后重试"));
          return false;
        }
        return true;
      } catch (_) {
        return false;
      }
    },
    accountDate(value) {
      return value
        ? new Date(value).toLocaleString(
            this.$language ? this.$language.state.locale : "zh-CN"
          )
        : this.$t("暂无");
    },
  },
};
