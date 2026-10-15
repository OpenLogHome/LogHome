<template>
  <Workspace :title="$t('搜索社区')" active="/community/search">
    <form class="social-panel search-form" @submit.prevent="submit">
      <el-input
        v-model="keyword"
        clearable
        :placeholder="$t('搜索帖子、圈子、用户或作品')"
        :aria-label="$t('搜索关键词')"
      /><el-button type="primary" native-type="submit" icon="el-icon-search">{{
        $t("搜索")
      }}</el-button>
    </form>
    <div v-if="!submitted" class="social-panel">
      <h2>{{ $t("热门搜索") }}</h2>
      <div class="hot-words">
        <button
          v-for="(word, index) in hotWords"
          :key="index"
          @click="
            keyword = word.keyword || word;
            submit();
          "
        >
          {{ word.keyword || word }}
        </button>
      </div>
      <p v-if="!hotWords.length" class="social-muted">
        {{ $t("输入关键词，开始发现社区内容。") }}
      </p>
      <template v-if="history.length"
        ><h3>
          {{ $t("最近搜索") }}
          <el-button type="text" @click="clearHistory">{{ $t("清空") }}</el-button>
        </h3>
        <div class="hot-words">
          <button
            v-for="word in history"
            :key="word"
            @click="
              keyword = word;
              submit();
            "
          >
            {{ word }}
          </button>
        </div></template
      >
    </div>
    <template v-else>
      <div class="social-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          :class="{ active: type === tab.value }"
          :aria-pressed="type === tab.value"
          @click="switchType(tab.value)"
        >
          {{ $t(tab.label) }}
        </button>
      </div>
      <div v-if="error" class="social-state social-panel" role="alert">
        {{ error }}<br /><el-button @click="search">{{ $t("重试") }}</el-button>
      </div>
      <div v-else-if="loading && page === 1" class="social-panel">
        <el-skeleton :rows="5" animated />
      </div>
      <template v-else
        ><section v-for="group in visibleGroups" :key="group.value" class="social-panel">
          <div class="social-toolbar">
            <h2>
              {{ $t(group.label) }} <small>{{ group.total }}</small>
            </h2>
            <el-button
              v-if="type === 'all' && group.total > group.list.length"
              type="text"
              @click="switchType(group.value)"
              >{{ $t("查看全部") }}</el-button
            >
          </div>
          <PostCard
            v-if="group.value === 'posts'"
            v-for="post in group.list"
            :key="post.post_id"
            :post="post"
          /><nuxt-link
            v-else
            v-for="item in group.list"
            :key="item.circle_id || item.user_id || item.novel_id"
            :to="target(group.value, item)"
            class="social-list-row"
            ><img
              :src="item.icon || item.avatar_url || item.picUrl || '/default-avatar.png'"
              alt=""
              loading="lazy" />
            <div class="row-main">
              <strong>{{ item.name }}</strong>
              <p>
                {{
                  item.description ||
                  item.motto ||
                  item.content ||
                  (item.member_count ? $t("{p0} 位成员", { p0: item.member_count }) : "")
                }}
              </p>
            </div>
            <i class="el-icon-arrow-right"
          /></nuxt-link>
        </section>
        <div v-if="!visibleGroups.length" class="social-panel social-state">
          <i class="el-icon-search" />{{
            $t("没有找到“{p0}”的相关内容", { p0: searchedKeyword })
          }}<br />{{ $t("试试更短的关键词。") }}
        </div>
        <div v-if="type !== 'all' && hasMore" class="social-end">
          <el-button :loading="loading" @click="search">{{ $t("加载更多") }}</el-button>
        </div></template
      >
    </template>
  </Workspace>
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import PostCard from "~/components/social/PostCard.vue";
import social from "~/plugins/api/social";
export default {
  components: { Workspace, PostCard },
  data: () => ({
    keyword: "",
    searchedKeyword: "",
    type: "all",
    tabs: [
      { value: "all", label: "全部" },
      { value: "posts", label: "帖子" },
      { value: "circles", label: "圈子" },
      { value: "users", label: "用户" },
      { value: "books", label: "作品" },
    ],
    results: {},
    history: [],
    hotWords: [],
    submitted: false,
    loading: false,
    error: "",
    page: 1,
    hasMore: false,
    requestId: 0,
  }),
  computed: {
    visibleGroups() {
      return this.tabs
        .filter(
          (tab) => tab.value !== "all" && (this.type === "all" || this.type === tab.value)
        )
        .map((tab) => ({
          ...tab,
          ...(this.results[tab.value] || { list: [], total: 0 }),
        }))
        .filter((group) => group.list.length);
    },
  },
  async mounted() {
    if (this.tabs.some((tab) => tab.value === this.$route.query.type))
      this.type = this.$route.query.type;
    try {
      this.history = JSON.parse(localStorage.getItem("community.search.history") || "[]");
      if (!Array.isArray(this.history)) this.history = [];
    } catch (_) {}
    try {
      this.hotWords = await social.hotSearch("all");
    } catch (_) {}
    if (this.$route.query.keyword) {
      this.keyword = this.$route.query.keyword;
      this.submit();
    }
  },
  beforeDestroy() {
    this.requestId++;
  },
  methods: {
    clearHistory() {
      this.history = [];
      localStorage.removeItem("community.search.history");
    },
    submit() {
      const word = this.keyword.trim();
      if (!word) return;
      this.searchedKeyword = word;
      this.history = [word, ...this.history.filter((item) => item !== word)].slice(0, 10);
      try {
        localStorage.setItem("community.search.history", JSON.stringify(this.history));
      } catch (_) {}
      this.reset();
      this.$router.replace({ query: { keyword: word, type: this.type } }).catch(() => {});
      this.search();
    },
    reset() {
      this.requestId++;
      this.loading = false;
      this.results = {};
      this.page = 1;
      this.hasMore = false;
      this.submitted = true;
    },
    switchType(type) {
      if (type === this.type) return;
      this.type = type;
      this.reset();
      this.search();
    },
    async search() {
      if (this.loading) return;
      const request = ++this.requestId;
      this.loading = true;
      this.error = "";
      try {
        const result = await social.search({
          keyword: this.searchedKeyword,
          type: this.type,
          page: this.page,
          pageSize: 12,
        });
        if (request !== this.requestId) return;
        Object.entries(result.results || {}).forEach(([key, group]) => {
          const old = this.page > 1 && this.results[key] ? this.results[key].list : [];
          this.$set(this.results, key, {
            ...group,
            list: [...old, ...(group.list || [])],
          });
        });
        this.page++;
        const group = this.results[this.type];
        this.hasMore = !!group && group.list.length < group.total;
      } catch (error) {
        if (request === this.requestId) this.error = error.message;
      } finally {
        if (request === this.requestId) this.loading = false;
      }
    },
    target(type, item) {
      return type === "circles"
        ? `/community/circle/${item.circle_id}`
        : type === "users"
        ? `/users/${item.user_id}`
        : Number(item.novel_type) === 1
        ? `/manga/${item.novel_id}`
        : `/novel/${item.novel_id}`;
    },
  },
  head: () => ({ title: "搜索社区 - 原木社区" }),
};
</script>
<style scoped>
.search-form {
  display: flex;
  gap: 12px;
}
.hot-words {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 22px;
}
.hot-words button {
  background: #f3eadf;
  color: #704c35;
  border: 0;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}
.social-toolbar h2 {
  margin: 0;
}
.social-toolbar small {
  font-size: 12px;
  font-weight: 400;
  color: var(--muted, #82766c);
}
.social-list-row p {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
