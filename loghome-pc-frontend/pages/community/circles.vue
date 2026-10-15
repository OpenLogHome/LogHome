<template>
  <Workspace :title="$t('圈子广场')" active="/community/circles"
    ><template #actions
      ><nuxt-link to="/community/circle/create"
        ><el-button type="primary" icon="el-icon-plus">{{
          $t("创建圈子")
        }}</el-button></nuxt-link
      ></template
    >
    <form class="social-panel circles-search" @submit.prevent="search">
      <el-input
        v-model="keyword"
        clearable
        :placeholder="$t('搜索圈子名称或描述')"
        :aria-label="$t('搜索圈子名称或描述')"
      /><el-button native-type="submit" icon="el-icon-search">{{ $t("搜索") }}</el-button>
    </form>
    <div class="social-tabs">
      <button :class="{ active: filter === 'all' }" @click="switchFilter('all')">
        {{ $t("全部圈子") }}</button
      ><button :class="{ active: filter === 'mine' }" @click="switchFilter('mine')">
        {{ $t("我的圈子") }}</button
      ><button
        v-for="category in categories"
        :key="category.category_id"
        :class="{ active: filter === String(category.category_id) }"
        @click="switchFilter(String(category.category_id))"
      >
        {{ category.name }}
      </button>
    </div>
    <div v-if="error" class="social-panel social-state" role="alert">
      {{ error }}<br /><el-button @click="load">{{ $t("重试") }}</el-button>
    </div>
    <el-skeleton
      v-if="loading && !circles.length"
      class="social-panel"
      :rows="6"
      animated
    />
    <div class="circle-grid">
      <nuxt-link
        v-for="circle in circles"
        :key="circle.circle_id"
        :to="`/community/circle/${circle.circle_id}`"
        class="circle-tile"
        ><div
          class="circle-tile-cover"
          :style="{
            backgroundImage: circle.bg_url ? `url(${circle.bg_url})` : '',
          }"
        >
          <img :src="circle.icon || '/default-avatar.png'" alt="" />
        </div>
        <div class="circle-tile-body">
          <header>
            <h2>{{ circle.name }}</h2>
            <el-tag v-if="circle.is_official" size="mini" type="warning">{{
              $t("官方")
            }}</el-tag>
          </header>
          <p>{{ circle.description || $t("来这里与圈友交流吧。") }}</p>
          <footer>
            <span>{{
              $t("{p0} 位成员 / {p1} 篇帖子", {
                p0: circle.member_count || 0,
                p1: circle.post_count || 0,
              })
            }}</span
            ><el-tag
              v-if="joinedIds.has(String(circle.circle_id))"
              size="mini"
              type="info"
              >{{ $t("已加入") }}</el-tag
            >
          </footer>
        </div></nuxt-link
      >
    </div>
    <div v-if="!loading && !error && !circles.length" class="social-panel social-state">
      <i class="el-icon-chat-dot-round" />{{
        filter === "mine"
          ? $t("还没有加入圈子，去广场寻找同好吧。")
          : $t("没有找到相关圈子，试试其他分类或关键词。")
      }}
    </div>
    <div v-if="circles.length" class="social-end">
      <el-button v-if="hasMore" :loading="loading" @click="load">{{
        $t("加载更多")
      }}</el-button
      ><span v-else>{{ $t("全部圈子已展示") }}</span>
    </div></Workspace
  >
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import social from "~/plugins/api/social";
import { readingToken } from "~/plugins/api/reading";
export default {
  components: { Workspace },
  data: () => ({
    categories: [],
    circles: [],
    mine: [],
    filter: "all",
    keyword: "",
    searchedKeyword: "",
    page: 1,
    loading: false,
    error: "",
    hasMore: true,
    requestId: 0,
  }),
  computed: {
    joinedIds() {
      return new Set(this.mine.map((item) => String(item.circle_id)));
    },
  },
  async mounted() {
    try {
      const [categories, mine] = await Promise.all([
        social.categories(),
        readingToken() ? social.myCircles() : Promise.resolve([]),
      ]);
      this.categories = categories;
      this.mine = mine;
    } catch (error) {
      this.$message.error(error.message);
    }
    this.load();
  },
  beforeDestroy() {
    this.requestId++;
  },
  methods: {
    switchFilter(filter) {
      if (this.filter === filter) return;
      if (filter === "mine" && !readingToken()) {
        this.$router.push({
          path: "/login",
          query: { redirect: "/community/circles" },
        });
        return;
      }
      this.filter = filter;
      this.reset();
    },
    search() {
      this.searchedKeyword = this.keyword.trim();
      this.reset();
    },
    reset() {
      this.requestId++;
      this.loading = false;
      this.page = 1;
      this.hasMore = true;
      this.circles = [];
      this.load();
    },
    async load() {
      if (this.loading || !this.hasMore) return;
      const request = ++this.requestId;
      this.loading = true;
      this.error = "";
      try {
        if (this.filter === "mine") {
          this.mine = await social.myCircles();
          if (request !== this.requestId) return;
          this.circles = this.mine.filter((item) =>
            `${item.name} ${item.description || ""}`.includes(this.searchedKeyword)
          );
          this.hasMore = false;
          return;
        }
        const result = await social.circles({
          page: this.page,
          pageSize: 12,
          keyword: this.searchedKeyword,
          ...(this.filter === "all" ? {} : { category_id: this.filter }),
        });
        if (request !== this.requestId) return;
        this.circles = [...this.circles, ...result.list];
        this.page++;
        this.hasMore = this.circles.length < result.total;
      } catch (error) {
        if (request === this.requestId) this.error = error.message;
      } finally {
        if (request === this.requestId) this.loading = false;
      }
    },
  },
  head: () => ({ title: "圈子广场 - 原木社区" }),
};
</script>
<style scoped>
.circles-search {
  display: flex;
  gap: 12px;
}
.circle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}
.circle-tile {
  border: 1px solid var(--line, #e9e0d5);
  border-radius: 14px;
  overflow: hidden;
  background: var(--surface, #fffdf9);
  color: var(--ink, #382d25);
}
.circle-tile-cover {
  height: 112px;
  background-color: #e8ddcc;
  background-size: cover;
  background-position: center;
  position: relative;
}
.circle-tile-cover img {
  position: absolute;
  left: 22px;
  bottom: -20px;
  width: 64px;
  height: 64px;
  border-radius: 14px;
  border: 4px solid var(--surface, #fffdf9);
  object-fit: cover;
}
.circle-tile-body {
  padding: 34px 22px 22px;
}
.circle-tile header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.circle-tile h2 {
  font-size: 19px;
  margin: 0;
}
.circle-tile p {
  font-size: 13px;
  color: var(--muted, #82766c);
  line-height: 1.8;
  height: 46px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 12px 0 20px;
}
.circle-tile footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--muted, #82766c);
}
@media (max-width: 650px) {
  .circle-grid {
    grid-template-columns: 1fr;
  }
}
</style>
