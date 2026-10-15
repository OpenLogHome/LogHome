<template>
  <Workspace :title="$t('社区动态')" compact active="/community">
    <template #heading>
      <div class="social-tabs" :aria-label="$t('动态排序')">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          :class="{ active: sort === tab.value }"
          :aria-pressed="sort === tab.value"
          @click="changeSort(tab.value)"
        >
          {{ $t(tab.label) }}
        </button>
      </div>
    </template>
    <template #actions
      ><nuxt-link to="/community/search" class="feed-search"
        ><i class="el-icon-search" /> {{ $t("搜索帖子、圈子与创作者") }}</nuxt-link
      ><nuxt-link to="/community/post/edit"
        ><el-button type="primary" icon="el-icon-edit">{{
          $t("发布帖子")
        }}</el-button></nuxt-link
      ></template
    >
    <Banner v-if="banners.length" :banners="banners" page="community_index" />
    <div v-if="error" class="social-panel social-state" role="alert">
      {{ error }}<br /><el-button @click="loadPosts">{{ $t("重新加载") }}</el-button>
    </div>
    <div
      v-if="loading && !posts.length"
      class="social-panel"
      :aria-label="$t('正在加载帖子')"
    >
      <el-skeleton :rows="6" animated />
    </div>
    <div
      v-else-if="!loading && !error && !posts.length"
      class="social-panel social-state"
    >
      <i class="el-icon-chat-dot-round" />{{ $t("暂无动态") }}
    </div>
    <PostCard v-for="post in posts" :key="post.post_id" :post="post" />
    <div v-if="posts.length" class="social-end">
      <el-button v-if="hasMore" :loading="loading" @click="loadPosts">{{
        $t("加载更多动态")
      }}</el-button
      ><span v-else>{{ $t("已经看完全部动态了") }}</span>
    </div>
    <template #aside>
      <section class="social-panel">
        <h3>{{ $t("发现圈子") }}</h3>
        <nuxt-link
          v-for="circle in circles"
          :key="circle.circle_id"
          :to="`/community/circle/${circle.circle_id}`"
          class="feed-circle"
          ><img :src="circle.icon || '/default-avatar.png'" alt="" />
          <div>
            <strong>{{ circle.name }}</strong
            ><span>{{ $t("{p0} 位成员", { p0: circle.member_count || 0 }) }}</span>
          </div></nuxt-link
        >
        <p v-if="!circles.length" class="social-muted">{{ $t("圈子推荐暂时为空") }}</p>
        <nuxt-link to="/community/circles" class="feed-more">{{
          $t("浏览全部圈子 →")
        }}</nuxt-link>
      </section>
      <section class="social-panel">
        <h3>{{ $t("我的圈子") }}</h3>
        <p v-if="!loggedIn" class="social-muted">
          {{ $t("登录后，在这里查看你加入的圈子。") }}
        </p>
        <nuxt-link
          v-for="circle in myCircles"
          :key="circle.circle_id"
          :to="`/community/circle/${circle.circle_id}`"
          class="feed-circle"
          ><img :src="circle.icon || '/default-avatar.png'" alt="" /><strong>{{
            circle.name
          }}</strong></nuxt-link
        >
        <p v-if="loggedIn && !myCircles.length" class="social-muted">
          {{ $t("加入感兴趣的圈子，认识同好。") }}
        </p>
        <nuxt-link to="/community/circle/create" class="feed-more">{{
          $t("创建圈子 →")
        }}</nuxt-link>
      </section>
    </template>
  </Workspace>
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import PostCard from "~/components/social/PostCard.vue";
import Banner from "~/components/Banner.vue";
import social from "~/plugins/api/social";
import { readingToken } from "~/plugins/api/reading";
import { normalizePost } from "~/utils/social";
export default {
  components: { Workspace, PostCard, Banner },
  data: () => ({
    sort: "new",
    tabs: [
      { value: "new", label: "最新动态" },
      { value: "hot", label: "热门讨论" },
    ],
    posts: [],
    circles: [],
    myCircles: [],
    banners: [],
    page: 1,
    hasMore: true,
    loading: false,
    error: "",
    requestId: 0,
    loggedIn: false,
    initialLoaded: false,
  }),
  async asyncData() {
    const results = await Promise.allSettled([
      social.posts({ page: 1, pageSize: 12, sort: "new" }),
      social.recommendedCircles(),
    ]);
    const state = { initialLoaded: true };
    if (results[0].status === "fulfilled") {
      const result = results[0].value;
      state.posts = (result.list || []).map(normalizePost);
      state.page = 2;
      state.hasMore = state.posts.length < Number(result.total);
    } else state.error = results[0].reason.message;
    if (results[1].status === "fulfilled") state.circles = results[1].value.list || [];
    return state;
  },
  async mounted() {
    this.loggedIn = !!readingToken();
    if (!this.initialLoaded) this.loadPosts();
    else if (this.loggedIn && this.posts.length) {
      social
        .likeStatuses(this.posts.map((item) => item.post_id))
        .then((statuses) =>
          this.posts.forEach((item) =>
            this.$set(item, "is_liked", !!statuses[item.post_id])
          )
        )
        .catch(() => {});
    }
    const tasks = [
      social.recommendedCircles(),
      this.$api.novels.getLibraryRoulousChart(),
      this.loggedIn ? social.myCircles() : Promise.resolve([]),
    ];
    const results = await Promise.allSettled(tasks);
    if (results[0].status === "fulfilled") this.circles = results[0].value.list || [];
    if (results[1].status === "fulfilled")
      this.banners = (results[1].value || [])
        .filter((item) => item.isValid === 1)
        .map((item) => ({
          image_url: item.image,
          title: item.title,
          link_url: item.navigate_to === "None" ? null : item.navigate_to,
        }));
    if (results[2].status === "fulfilled") this.myCircles = results[2].value || [];
  },
  beforeDestroy() {
    this.requestId++;
  },
  methods: {
    changeSort(sort) {
      if (this.sort === sort) return;
      this.sort = sort;
      this.requestId++;
      this.loading = false;
      this.page = 1;
      this.posts = [];
      this.hasMore = true;
      this.loadPosts();
    },
    async loadPosts() {
      if (this.loading || !this.hasMore) return;
      const request = ++this.requestId;
      this.loading = true;
      this.error = "";
      try {
        const result = await social.posts({
          page: this.page,
          pageSize: 12,
          sort: this.sort,
        });
        if (request !== this.requestId) return;
        const list = (result.list || []).map(normalizePost);
        const ids = new Set(this.posts.map((post) => post.post_id));
        this.posts = [...this.posts, ...list.filter((post) => !ids.has(post.post_id))];
        this.page++;
        this.hasMore = this.posts.length < Number(result.total);
        if (this.loggedIn && list.length) {
          try {
            const statuses = await social.likeStatuses(list.map((post) => post.post_id));
            if (request === this.requestId)
              this.posts.forEach((post) => {
                if (statuses[post.post_id] !== undefined)
                  this.$set(post, "is_liked", statuses[post.post_id]);
              });
          } catch (_) {}
        }
      } catch (error) {
        if (request === this.requestId) this.error = error.message;
      } finally {
        if (request === this.requestId) this.loading = false;
      }
    },
  },
  head: () => ({
    title: "社区动态 - 原木社区",
    meta: [
      {
        hid: "description",
        name: "description",
        content: "在原木社区分享创作与阅读心得，与圈友交流方块世界的故事。",
      },
    ],
    link: [{ rel: "canonical", href: "https://loghome.ink/community" }],
  }),
};
</script>
<style scoped>
.feed-search {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  color: var(--wood, #947358);
  background: var(--surface, #fffdf9);
  border: 1px solid var(--line, #e9e0d5);
  border-radius: 10px;
  padding: 12px 16px;
}
.feed-circle {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 12px 0;
  color: var(--ink, #382d25);
}
.feed-circle img {
  width: 42px;
  height: 42px;
  object-fit: cover;
  border-radius: 10px;
}
.feed-circle strong {
  font-size: 14px;
}
.feed-circle span {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: var(--muted, #82766c);
}
.feed-more {
  display: block;
  color: var(--wood, #947358);
  font-size: 13px;
  margin-top: 16px;
}
@media (max-width: 850px) {
  .feed-search {
    font-size: 0;
  }
  .feed-search i {
    font-size: 16px;
  }
}
</style>
