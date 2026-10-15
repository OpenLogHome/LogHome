<template>
  <article class="social-post">
    <header>
      <nuxt-link :to="`/users/${post.user_id}`" class="post-author"
        ><Avatar
          :src="post.author_avatar"
          :frame="post.author_avatar_frame"
          :size="42"
        /><span
          ><strong>{{ post.author_name }}</strong
          ><time>{{ time }}</time></span
        ></nuxt-link
      ><nuxt-link
        v-if="post.circle_id"
        :to="`/community/circle/${post.circle_id}`"
        class="post-circle"
        >{{ post.circle_name }}</nuxt-link
      >
    </header>
    <nuxt-link :to="`/community/post/${post.post_id}`" class="post-body"
      ><h2>{{ post.title }}</h2>
      <p>{{ post.content }}</p></nuxt-link
    >
    <div
      v-if="images.length"
      class="social-post-images"
      :class="{ single: images.length === 1 }"
    >
      <button
        v-for="(url, index) in images.slice(0, 9)"
        :key="url + index"
        :aria-label="$t('查看第 {p0} 张图片', { p0: index + 1 })"
        @click="$preview(images, index)"
      >
        <img :src="url" :alt="$t('帖子图片')" loading="lazy" />
      </button>
    </div>
    <nuxt-link v-if="post.novel_id" :to="`/novel/${post.novel_id}`" class="post-work"
      ><i class="el-icon-reading" />{{ post.novel_name || $t("查看关联作品") }}</nuxt-link
    >
    <footer>
      <nuxt-link :to="`/community/post/${post.post_id}`"
        ><i class="el-icon-chat-dot-round" /> {{ post.comment_count || 0 }}</nuxt-link
      ><button
        :class="{ liked }"
        :aria-pressed="liked"
        :disabled="pending"
        @click="toggleLike"
      >
        <i :class="liked ? 'el-icon-star-on' : 'el-icon-star-off'" />
        {{ count }}</button
      ><button :disabled="sharing" @click="share">
        <i class="el-icon-share" /> {{ $t("分享") }}
      </button>
    </footer>
  </article>
</template>
<script>
import Avatar from "./Avatar.vue";
import social from "~/plugins/api/social";
import { postShareMessage, mediaUrls } from "~/utils/social";
import { readingToken } from "~/plugins/api/reading";
import moment from "moment";
import "moment/locale/zh-cn";
export default {
  components: { Avatar },
  props: { post: { type: Object, required: true } },
  data() {
    return {
      pending: false,
      sharing: false,
      liked: !!this.post.is_liked,
      count: Number(this.post.like_count) || 0,
    };
  },
  computed: {
    images() {
      return mediaUrls(this.post.media_urls);
    },
    time() {
      return moment(this.post.create_time)
        .locale(this.$language.state.locale === "en" ? "en" : "zh-cn")
        .fromNow();
    },
  },
  watch: {
    "post.is_liked"(value) {
      this.liked = !!value;
    },
  },
  methods: {
    async toggleLike() {
      if (this.pending) return;
      if (!readingToken()) {
        this.$router.push({
          path: "/login",
          query: { redirect: this.$route.fullPath },
        });
        return;
      }
      this.pending = true;
      try {
        const result = await social.like(this.post.post_id);
        const next = !!result.liked;
        this.count = Math.max(0, this.count + (next === this.liked ? 0 : next ? 1 : -1));
        this.liked = next;
        this.$emit("liked", {
          id: this.post.post_id,
          liked: next,
          count: this.count,
        });
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.pending = false;
      }
    },
    async share() {
      if (this.sharing) return;
      if (!readingToken()) {
        this.$router.push({
          path: "/login",
          query: { redirect: this.$route.fullPath },
        });
        return;
      }
      this.sharing = true;
      try {
        const value = await social.sharePost(
          this.post.post_id,
          postShareMessage(this.post, window.location.origin)
        );
        try {
          await navigator.clipboard.writeText(value);
          this.$message.success(this.$t("分享口令已复制"));
        } catch (_) {
          this.$prompt(this.$t("复制口令与朋友分享"), this.$t("分享帖子"), {
            inputValue: value,
            confirmButtonText: this.$t("完成"),
            cancelButtonText: this.$t("关闭"),
          }).catch(() => {});
        }
      } catch (error) {
        this.$message.error(error.message || this.$t("分享失败，请重试"));
      } finally {
        this.sharing = false;
      }
    },
  },
};
</script>
<style scoped>
.social-post {
  background: var(--surface, #fffdf9);
  border: 1px solid var(--line, #e9e0d5);
  border-radius: 16px;
  padding: 22px;
  margin-bottom: 16px;
  overflow: hidden;
}
.social-post header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.post-author {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--ink, #382d25);
}
.post-author img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
}
.post-author strong {
  font-size: 14px;
}
.post-author time {
  display: block;
  margin-top: 5px;
  font-size: 11px;
  color: #978a7c;
}
.post-circle {
  background: #f1e8dc;
  color: var(--wood, #947358);
  padding: 5px 9px;
  border-radius: 6px;
  font-size: 12px;
}
.post-body {
  display: block;
  color: var(--ink, #382d25);
}
.post-body h2 {
  font-size: 19px;
  line-height: 1.5;
  margin: 18px 0 8px;
}
.post-body p {
  font-size: 14px;
  line-height: 1.9;
  white-space: pre-line;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: var(--muted, #766858);
}
.social-post-images {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
  max-width: 540px;
  margin: 14px 0;
}
.social-post-images button {
  border: 0;
  background: #f4eee6;
  padding: 0;
  border-radius: 9px;
  overflow: hidden;
  cursor: zoom-in;
  aspect-ratio: 1;
}
.social-post-images img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.social-post-images.single {
  grid-template-columns: minmax(0, 340px);
}
.social-post-images.single button {
  aspect-ratio: 4/3;
}
.post-work {
  display: block;
  padding: 12px;
  background: #f4eee6;
  color: var(--wood, #947358);
  border-radius: 8px;
  font-size: 13px;
  margin-top: 12px;
}
.social-post footer {
  display: flex;
  gap: 26px;
  border-top: 1px solid #eee6dc;
  margin-top: 18px;
  padding-top: 14px;
}
.social-post footer button,
.social-post footer a {
  background: none;
  border: 0;
  color: var(--muted, #82766c);
  font-size: 13px;
  padding: 4px;
  cursor: pointer;
}
.social-post footer .liked {
  color: #ea7034;
}
.social-post footer button:disabled {
  opacity: 0.5;
}
</style>
