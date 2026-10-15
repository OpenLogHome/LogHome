<template>
  <section class="activity-inbox" :class="{ embedded }">
    <header v-if="!embedded">
      <div>
        <nuxt-link to="/read/resources">{{ $t("← 获取原木") }}</nuxt-link>
        <h1>{{ $t("活动消息") }}</h1>
        <p>{{ $t("社区活动的参与条件、截止时间与奖励说明。") }}</p>
      </div>
      <button v-if="token && !authExpired" :disabled="loading" @click="load(page)">
        {{ loading ? $t("刷新中…") : $t("刷新消息") }}
      </button>
    </header>
    <div v-if="!ready" class="state">{{ $t("正在准备消息列表…") }}</div>
    <div v-else-if="!token || authExpired" class="state">
      <h2>{{ authExpired ? $t("登录状态已过期") : $t("登录后查看活动消息") }}</h2>
      <p>{{ $t("活动消息与账号关联，登录后可查看收到的通知。") }}</p>
      <nuxt-link :to="loginUrl">{{ $t("前往登录 →") }}</nuxt-link>
    </div>
    <template v-else
      ><p v-if="error" class="error" role="alert">
        {{ error }}
        <button :disabled="loading" @click="load(failedPage)">{{ $t("重试") }}</button>
      </p>
      <p class="summary" aria-live="polite">
        {{
          loading
            ? $t("正在读取活动消息…")
            : $t("共 {p0} 条活动消息 · 最新消息在前", { p0: total })
        }}
      </p>
      <div class="message-grid" :aria-busy="loading">
        <article v-for="item in messages" :key="item.message_id">
          <img
            v-if="item.bg_url"
            :src="item.bg_url"
            alt=""
            loading="lazy"
            @error="$event.target.style.display = 'none'"
          />
          <div class="message-body">
            <time :datetime="item.time">{{ date(item.time) }}</time>
            <p>{{ item.message_content }}</p>
            <nuxt-link v-if="item.link && !item.link.external" :to="item.link.href">{{
              $t("查看活动详情 →")
            }}</nuxt-link
            ><a
              v-else-if="item.link"
              :href="item.link.href"
              target="_blank"
              rel="noopener noreferrer"
              >{{ $t("查看活动详情 ↗") }}</a
            ><span v-else class="quiet">{{ $t("这条通知暂无详情链接") }}</span>
          </div>
        </article>
      </div>
      <p v-if="!loading && !error && !messages.length" class="state">
        {{ $t("暂无活动消息") }}
      </p>
      <nav v-if="totalPages > 1" :aria-label="$t('活动消息分页')">
        <button :disabled="loading || page <= 1" @click="load(page - 1)">
          {{ $t("上一页") }}</button
        ><span>{{ $t("第 {p0} / {p1} 页", { p0: page, p1: totalPages }) }}</span
        ><button :disabled="loading || page >= totalPages" @click="load(page + 1)">
          {{ $t("下一页") }}
        </button>
      </nav></template
    >
  </section>
</template>
<script>
import { readingToken } from "~/plugins/api/reading";
import { activityMessagePage } from "~/utils/reader-activities";
export default {
  props: { embedded: Boolean },
  data: () => ({
    ready: false,
    token: null,
    authExpired: false,
    messages: [],
    page: 1,
    total: 0,
    loading: false,
    error: "",
    failedPage: 1,
    version: 0,
    epoch: 0,
  }),
  computed: {
    loginUrl() {
      return {
        path: "/login",
        query: {
          redirect: this.embedded ? "/me/messages?tab=activity" : "/read/activities",
        },
      };
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.total / 20));
    },
  },
  mounted() {
    this.ready = true;
    this.checkAccount();
    window.addEventListener("storage", this.storage);
    window.addEventListener("focus", this.checkAccount);
    window.addEventListener("auth-state-changed", this.checkAccount);
  },
  beforeDestroy() {
    this.version++;
    this.epoch++;
    window.removeEventListener("storage", this.storage);
    window.removeEventListener("focus", this.checkAccount);
    window.removeEventListener("auth-state-changed", this.checkAccount);
  },
  methods: {
    storage(event) {
      if (event.key === "token") this.checkAccount();
    },
    checkAccount() {
      const token = readingToken();
      if (token === this.token) return;
      this.epoch++;
      this.version++;
      Object.assign(this, {
        token,
        authExpired: false,
        messages: [],
        page: 1,
        total: 0,
        loading: false,
        error: "",
        failedPage: 1,
      });
      if (token) this.load(1);
    },
    current(token, epoch, version) {
      return (
        token === readingToken() &&
        token === this.token &&
        epoch === this.epoch &&
        version === this.version
      );
    },
    async load(page = 1) {
      if (!this.token || this.authExpired) return;
      const token = this.token,
        epoch = this.epoch,
        version = ++this.version;
      this.loading = true;
      this.error = "";
      this.failedPage = page;
      try {
        const raw = await this.$api.reader.activityMessages(page);
        if (!this.current(token, epoch, version)) return;
        const result = activityMessagePage(raw, page, 20, process.env.mobileUrl);
        if (page > 1 && !result.messages.length) return this.load(1);
        this.messages = result.messages;
        this.total = result.total;
        this.page = page;
      } catch (error) {
        if (!this.current(token, epoch, version)) return;
        this.error = error.message || "活动消息加载失败";
        if ([401, 403].includes(error.status)) {
          this.authExpired = true;
          this.messages = [];
          this.total = 0;
        }
      } finally {
        if (this.current(token, epoch, version)) this.loading = false;
      }
    },
    date(value) {
      const date = new Date(value);
      return Number.isFinite(date.getTime())
        ? date.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai", hour12: false })
        : "时间未提供";
    },
  },
};
</script>
<style scoped>
.activity-inbox {
  max-width: 1180px;
  margin: auto;
  padding: 110px 28px 65px;
  color: #514739;
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 30px;
}
h1 {
  font-size: 28px;
  margin: 18px 0 12px;
}
header p,
.summary,
.quiet {
  color: #968978;
  font-size: 13px;
  line-height: 1.8;
}
a {
  color: #788858;
  text-decoration: none;
}
button {
  background: white;
  border: 1px solid #dcd7cc;
  color: #7c674d;
  border-radius: 6px;
  padding: 9px 16px;
  cursor: pointer;
}
button:disabled {
  opacity: 0.45;
  cursor: default;
}
.message-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  align-items: start;
}
.message-grid article {
  min-width: 0;
  background: white;
  border: 1px solid #e7e2d9;
  border-radius: 12px;
  overflow: hidden;
}
.message-grid img {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
}
.message-body {
  padding: 22px;
}
time {
  font-size: 12px;
  color: #a09383;
}
.message-body p {
  font-size: 15px;
  line-height: 1.9;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  margin: 16px 0;
}
.message-body a {
  font-size: 13px;
}
.state {
  text-align: center;
  background: #fff;
  padding: 55px 20px;
  border: 1px solid #e7e2d9;
  border-radius: 10px;
  color: #998978;
  font-size: 14px;
}
.state h2 {
  color: #615442;
  font-size: 20px;
}
.state p {
  line-height: 1.8;
  margin: 16px 0;
}
.error {
  color: #a14b39;
  font-size: 13px;
  background: #fff5ed;
  padding: 16px;
  border-radius: 7px;
}
.error button {
  margin-left: 12px;
}
nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  font-size: 13px;
}
a:focus-visible,
button:focus-visible {
  outline: 2px solid #8e9e69;
  outline-offset: 3px;
}
@media (max-width: 760px) {
  .activity-inbox {
    padding: 100px 18px 45px;
  }
  .message-grid {
    grid-template-columns: 1fr;
  }
  header {
    align-items: flex-start;
  }
  h1 {
    font-size: 25px;
  }
  .message-body {
    padding: 18px;
  }
}
.activity-inbox.embedded {
  padding: 0;
  max-width: none;
  color: var(--ink, #52483c);
}
.embedded .message-grid {
  grid-template-columns: 1fr;
}
.embedded .message-grid article {
  background: var(--surface, #fffdf9);
  border-color: var(--line, #e9e0d5);
}
.embedded .message-grid p {
  color: var(--ink, #52483c);
}
</style>
