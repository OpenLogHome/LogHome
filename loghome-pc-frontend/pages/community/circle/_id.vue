<template>
  <Workspace
    :title="circle.name || $t('圈子详情')"
    :description="circle.description"
    active="/community/circles"
    :circle-role="role"
    compact
  >
    <div v-if="error" class="social-panel social-state" role="alert">
      {{ error }}<br /><el-button @click="load">{{ $t("重试") }}</el-button>
    </div>
    <el-skeleton v-else-if="loading" class="social-panel" :rows="6" animated /><template
      v-else-if="circle.circle_id"
      ><section
        class="circle-hero"
        :style="{
          backgroundImage: circle.bg_url ? `url(${circle.bg_url})` : '',
        }"
      >
        <div class="circle-hero-shade" />
        <div class="circle-hero-content">
          <img :src="circle.icon || '/default-avatar.png'" :alt="circle.name" />
          <div>
            <h2>
              {{ circle.name }}
              <el-tag v-if="circle.is_official" size="mini" type="warning">{{
                $t("官方")
              }}</el-tag>
            </h2>
            <p>
              {{
                $t("{p0} 位成员 / {p1} 篇帖子", {
                  p0: circle.member_count || 0,
                  p1: circle.post_count || 0,
                })
              }}
            </p>
            <p v-if="circle.description" class="circle-description">
              {{ circle.description }}
            </p>
          </div>
          <el-button
            :type="joined ? '' : 'primary'"
            :loading="joinLoading"
            @click="toggleJoin"
            >{{
              joined ? $t("已加入") : applied ? $t("申请已提交") : $t("加入圈子")
            }}</el-button
          >
        </div>
      </section>
      <div class="circle-content-grid">
        <section>
          <div class="social-toolbar">
            <div class="social-tabs">
              <button
                v-for="item in filters"
                :key="item.key"
                :class="{ active: filter === item.key }"
                @click="changeFilter(item.key)"
              >
                {{ $t(item.label) }}
              </button>
            </div>
            <nuxt-link :to="`/community/post/edit?circle_id=${id}`"
              ><el-button type="primary" size="small" :disabled="banned">{{
                $t("发布帖子")
              }}</el-button></nuxt-link
            >
          </div>
          <el-alert
            v-if="banned"
            :title="$t('你在此圈子中被禁言，暂时无法发布内容。')"
            type="warning"
            :closable="false"
          />
          <div v-if="postsError" class="social-panel social-state" role="alert">
            {{ postsError }}<br /><el-button @click="loadPosts">{{
              $t("重试")
            }}</el-button>
          </div>
          <div v-if="postsLoading && !posts.length" class="social-panel">
            <el-skeleton :rows="6" animated />
          </div>
          <PostCard v-for="post in posts" :key="post.post_id" :post="post" />
          <div
            v-if="!postsLoading && !postsError && !posts.length"
            class="social-panel social-state"
          >
            <i class="el-icon-chat-dot-round" />{{
              $t("圈子里还没有帖子，分享第一条动态吧。")
            }}
          </div>
          <div v-if="posts.length" class="social-end">
            <el-button v-if="hasMore" :loading="postsLoading" @click="loadPosts">{{
              $t("加载更多")
            }}</el-button
            ><span v-else>{{ $t("已经看完全部帖子了") }}</span>
          </div>
        </section>
        <aside>
          <section class="social-panel">
            <h3>{{ $t("圈子公告") }}</h3>
            <p class="circle-copy">{{ circle.announcement || $t("暂无公告") }}</p>
            <h3>{{ $t("交流规则") }}</h3>
            <p class="circle-copy">
              {{ circle.rules || $t("尊重圈友，友善交流。") }}
            </p>
          </section>
          <section class="social-panel">
            <div class="social-toolbar">
              <h3>{{ $t("成员") }}</h3>
              <nuxt-link :to="`/community/circle/members/${id}`">{{
                $t("查看全部")
              }}</nuxt-link>
            </div>
            <div class="circle-member-grid">
              <nuxt-link
                v-for="member in members"
                :key="member.user_id"
                :to="`/users/${member.user_id}`"
                ><Avatar
                  :src="member.avatar_url"
                  :frame="member.avatar_frame"
                  :size="44"
                /><span>{{ member.name }}</span></nuxt-link
              >
            </div>
          </section>
        </aside>
      </div></template
    ></Workspace
  >
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import PostCard from "~/components/social/PostCard.vue";
import Avatar from "~/components/social/Avatar.vue";
import social from "~/plugins/api/social";
import { readingToken } from "~/plugins/api/reading";
import { normalizePost } from "~/utils/social";
export default {
  components: { Workspace, PostCard, Avatar },
  data: () => ({
    circle: {},
    members: [],
    role: 0,
    joined: false,
    banned: false,
    applied: false,
    loading: true,
    error: "",
    joinLoading: false,
    posts: [],
    page: 1,
    hasMore: true,
    postsLoading: false,
    postsError: "",
    filter: "all",
    filters: [
      { key: "all", label: "全部" },
      { key: "new", label: "最新" },
      { key: "hot", label: "热门" },
    ],
    requestId: 0,
  }),
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  mounted() {
    this.load();
  },
  beforeDestroy() {
    this.requestId++;
  },
  methods: {
    async load() {
      this.loading = true;
      this.error = "";
      try {
        this.circle = await social.circle(this.id);
        const result = await social.members(this.id, { page: 1, pageSize: 9 });
        this.members = result.list || [];
        if (readingToken()) {
          const mine = await social.myCircles();
          const membership = mine.find((item) => String(item.circle_id) === this.id);
          this.joined = !!membership;
          this.role = Number(membership && membership.role) || 0;
          const status = await social.circleStatus(this.id);
          this.banned = !!status.is_banned;
        }
        this.page = 1;
        this.posts = [];
        this.hasMore = true;
        this.loadPosts();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    changeFilter(filter) {
      if (this.filter === filter) return;
      this.filter = filter;
      this.requestId++;
      this.postsLoading = false;
      this.page = 1;
      this.posts = [];
      this.hasMore = true;
      this.loadPosts();
    },
    async loadPosts() {
      if (this.postsLoading || !this.hasMore) return;
      const request = ++this.requestId;
      this.postsLoading = true;
      this.postsError = "";
      try {
        const result = await social.circlePosts({
          page: this.page,
          pageSize: 12,
          circle_id: this.id,
          ...(this.filter === "all" ? {} : { sort: this.filter }),
        });
        if (request !== this.requestId) return;
        const list = (result.list || []).map(normalizePost);
        this.posts = [...this.posts, ...list];
        this.page++;
        this.hasMore = this.posts.length < Number(result.total);
        if (readingToken() && list.length) {
          try {
            const statuses = await social.likeStatuses(list.map((item) => item.post_id));
            if (request === this.requestId)
              this.posts.forEach((item) => {
                if (statuses[item.post_id] !== undefined)
                  this.$set(item, "is_liked", statuses[item.post_id]);
              });
          } catch (_) {}
        }
      } catch (error) {
        if (request === this.requestId) this.postsError = error.message;
      } finally {
        if (request === this.requestId) this.postsLoading = false;
      }
    },
    async toggleJoin() {
      if (this.joinLoading) return;
      if (!readingToken()) {
        this.$router.push({
          path: "/login",
          query: { redirect: this.$route.fullPath },
        });
        return;
      }
      this.joinLoading = true;
      try {
        if (this.joined) {
          if (this.role === 2) {
            this.$message.info(this.$t("圈主需要先转让圈子，才能退出"));
            return;
          }
          try {
            await this.$confirm(
              this.$t("退出后将不再是圈子成员，确定退出？"),
              this.$t("退出圈子")
            );
          } catch (_) {
            return;
          }
          await social.quitCircle(this.id);
          this.joined = false;
          this.role = 0;
          this.circle.member_count = Math.max(0, Number(this.circle.member_count) - 1);
          this.$message.success(this.$t("已退出圈子"));
        } else {
          let verification_info = "";
          if (this.circle.need_verification) {
            const questions = await social.verification(this.id);
            try {
              const result = await this.$prompt(
                questions.verification_questions || this.$t("请填写入圈验证信息"),
                this.$t("申请加入圈子"),
                {
                  inputType: "textarea",
                  inputValidator: (value) => !!value && !!value.trim(),
                  inputErrorMessage: "请填写验证信息",
                }
              );
              verification_info = result.value;
            } catch (_) {
              return;
            }
          }
          const result = await social.joinCircle({
            circle_id: Number(this.id),
            ...(verification_info ? { verification_info } : {}),
          });
          if (this.circle.need_verification) {
            this.applied = true;
            this.$message.success(result.msg || this.$t("申请已提交，等待审核"));
          } else {
            this.joined = true;
            this.circle.member_count = Number(this.circle.member_count) + 1;
            this.$message.success(this.$t("已加入圈子"));
          }
        }
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.joinLoading = false;
      }
    },
  },
  head() {
    return { title: `${this.circle.name || "圈子详情"} - 原木社区` };
  },
};
</script>
<style scoped>
.circle-hero {
  position: relative;
  background-color: #8e7254;
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 26px;
}
.circle-hero-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #32291fbb, #32291f33);
}
.circle-hero-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 36px;
  color: var(--surface, #fffdf9);
}
.circle-hero-content > img {
  width: 90px;
  height: 90px;
  border: 3px solid var(--surface, #fffdf9);
  border-radius: 18px;
  object-fit: cover;
}
.circle-hero h2 {
  font-size: 25px;
  margin: 0 0 12px;
}
.circle-hero p {
  font-size: 13px;
}
.circle-hero .el-button {
  margin-left: auto;
}
.circle-content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 270px;
  gap: 24px;
}
.circle-content-grid .social-tabs {
  margin: 0;
}
.circle-copy {
  font-size: 13px;
  line-height: 1.9;
  white-space: pre-line;
  color: var(--muted);
  margin: 12px 0 24px;
}
.circle-copy:last-child {
  margin-bottom: 0;
}
.circle-member-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.circle-member-grid a {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--ink);
  gap: 8px;
  min-width: 0;
}
.circle-member-grid span {
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
.circle-content-grid .social-toolbar h3 {
  margin: 0;
}
.circle-content-grid .social-toolbar a {
  font-size: 12px;
  color: var(--wood);
}
@media (max-width: 1100px) {
  .circle-content-grid {
    grid-template-columns: 1fr;
  }
  .circle-content-grid > aside {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}
@media (max-width: 650px) {
  .circle-hero-content {
    padding: 24px;
    flex-wrap: wrap;
  }
  .circle-hero-content > img {
    width: 60px;
    height: 60px;
  }
  .circle-hero h2 {
    font-size: 20px;
  }
  .circle-content-grid > aside {
    grid-template-columns: 1fr;
  }
}
</style>
