<template>
  <Workspace :title="$t('个人中心')" active="/me">
    <template #actions
      ><nuxt-link to="/me/settings"
        ><el-button icon="el-icon-setting">{{ $t("编辑资料") }}</el-button></nuxt-link
      ></template
    >
    <div v-if="error" class="social-panel social-state" role="alert">
      {{ error }}<br /><el-button @click="load">{{ $t("重新加载") }}</el-button>
    </div>
    <el-skeleton v-else-if="loading" class="social-panel" :rows="8" animated />
    <template v-else>
      <section
        class="profile-hero"
        :style="{
          backgroundImage: user.top_pic_url ? `url(${user.top_pic_url})` : '',
        }"
      >
        <div class="profile-hero-shade" />
        <div class="profile-hero-main">
          <Avatar :src="user.avatar_url" :frame="user.avatar_frame" :size="86" />
          <div>
            <h2>
              {{ user.name }} <span>ID {{ user.user_id }}</span>
            </h2>
            <p v-if="user.display_title" class="profile-title">
              {{ user.display_title }}
            </p>
            <p v-if="user.motto">{{ user.motto }}</p>
            <div class="profile-groups">
              <span v-for="group in groups" :key="group">{{ group }}</span>
            </div>
          </div>
          <nuxt-link :to="`/users/${user.user_id}`" class="profile-card-link">{{
            $t("查看个人名片 →")
          }}</nuxt-link>
        </div>
      </section>
      <nuxt-link
        to="/membership"
        class="membership-banner"
        :class="{ super: membership && membership.membership_type === 'super' }"
        ><img
          :src="
            membership && membership.membership_type === 'super'
              ? '/social/membership/loghome-super-pass.png'
              : '/social/membership/loghome-pass.png'
          "
          alt=""
        />
        <div>
          <strong>{{
            $t(
              membership
                ? membership.membership_type === "super"
                  ? "超级原木通行证"
                  : "原木通行证"
                : "原木通行证"
            )
          }}</strong>
          <p>{{ membershipCaption }}</p>
        </div>
        <span>{{ $t(membership ? "管理权益" : "了解权益") }} →</span></nuxt-link
      >
      <div
        v-if="!user.email || user.email === 'unbind'"
        class="social-panel account-security"
      >
        <i class="el-icon-warning-outline" />
        <div>
          <strong>{{ $t("保护你的账号") }}</strong>
          <p>{{ $t("绑定邮箱，方便找回密码和接收重要通知。") }}</p>
        </div>
        <nuxt-link to="/me/security"
          ><el-button size="small">{{ $t("绑定邮箱") }}</el-button></nuxt-link
        >
      </div>
      <section class="personal-quick">
        <nuxt-link v-for="item in quick" :key="item.to" :to="item.to" class="social-panel"
          ><i :class="item.icon" />
          <div>
            <strong>{{ $t(item.label) }}</strong>
            <p>{{ $t(item.description) }}</p>
          </div>
          <i class="el-icon-arrow-right"
        /></nuxt-link>
      </section>
      <div class="personal-columns">
        <div>
          <section class="social-panel">
            <h2>{{ $t("我的服务") }}</h2>
            <div class="personal-services">
              <nuxt-link v-for="item in services" :key="item.to" :to="item.to"
                ><i :class="item.icon" />
                <div>
                  <strong>{{ $t(item.label) }}</strong>
                  <p>{{ $t(item.description) }}</p>
                </div>
                <span v-if="item.to === '/me/wallet'">{{
                  $t("{p0} 原木", {
                    p0: balances.log === undefined ? $t("暂无") : balances.log,
                  })
                }}</span
                ><i class="el-icon-arrow-right"
              /></nuxt-link>
            </div>
          </section>
          <section class="social-panel">
            <h2>{{ $t("更多") }}</h2>
            <div class="personal-services">
              <nuxt-link v-for="item in more" :key="item.to" :to="item.to"
                ><i :class="item.icon" /><strong>{{ $t(item.label) }}</strong
                ><i class="el-icon-arrow-right"
              /></nuxt-link>
            </div>
          </section>
        </div>
        <div>
          <section class="social-panel personal-tree">
            <span>{{ $t("原木树场") }}</span>
            <h2>{{ $t(tree.treeState || "查看你的树场") }}</h2>
            <nuxt-link to="/me/tree"
              ><el-button type="primary">{{ $t("进入树场") }}</el-button></nuxt-link
            >
          </section>
          <section class="social-panel">
            <div class="social-toolbar">
              <h2>{{ $t("我的作品") }}</h2>
              <nuxt-link to="/write">{{ $t("创作中心 →") }}</nuxt-link>
            </div>
            <nuxt-link
              v-for="work in works.slice(0, 3)"
              :key="work.novel_id"
              :to="`/write/settings/${work.novel_id}`"
              class="social-list-row"
              ><img :src="work.picUrl || '/default-book-cover.png'" alt="" />
              <div class="row-main">
                <strong>{{ work.name }}</strong>
                <p>{{ work.content || $t("继续完善你的故事") }}</p>
              </div></nuxt-link
            >
            <p v-if="!works.length" class="social-muted">
              {{ $t("暂无作品") }}
            </p>
          </section>
          <section class="social-panel">
            <h2>{{ $t("账户收益") }}</h2>
            <div class="earnings">
              {{ earnings }} <small>{{ $t("元") }}</small>
            </div>
            <nuxt-link to="/me/wallet?tab=earnings">{{ $t("收益与提现 →") }}</nuxt-link>
          </section>
        </div>
      </div>
    </template>
  </Workspace>
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import Avatar from "~/components/social/Avatar.vue";
import account from "~/plugins/api/account";
import { readingToken } from "~/plugins/api/reading";
export default {
  components: { Workspace, Avatar },
  data: () => ({
    user: {},
    balances: {},
    membership: null,
    tree: {},
    works: [],
    loading: true,
    error: "",
    quick: [
      {
        to: "/me/messages",
        label: "我的消息",
        description: "查看互动、私信和社区通知",
        icon: "el-icon-message",
      },
      {
        to: "/me/friends",
        label: "好友与关注",
        description: "与志同道合的朋友保持联系",
        icon: "el-icon-user",
      },
    ],
    services: [
      {
        to: "/me/tree",
        label: "原木树场",
        description: "每日签到与成长任务",
        icon: "el-icon-pear",
      },
      {
        to: "/me/achievements",
        label: "我的勋章",
        description: "记录成长，组合专属称号",
        icon: "el-icon-medal",
      },
      {
        to: "/me/frames",
        label: "头像挂件",
        description: "装点你的社区身份",
        icon: "el-icon-picture-outline",
      },
      {
        to: "/me/invite",
        label: "邀请好友",
        description: "分享原木社区，一起成长",
        icon: "el-icon-share",
      },
      {
        to: "/me/wallet",
        label: "原木钱包",
        description: "充值、兑换与消费记录",
        icon: "el-icon-coin",
      },
      {
        to: "/read/redstone",
        label: "红石账户",
        description: "管理 AI 服务的红石余额",
        icon: "el-icon-magic-stick",
      },
      {
        to: "/store",
        label: "原木商城",
        description: "发现社区周边与精选商品",
        icon: "el-icon-shopping-bag-1",
      },
      {
        to: "/me/lab",
        label: "原木实验室",
        description: "探索社区的新鲜玩法",
        icon: "el-icon-s-opportunity",
      },
    ],
    more: [
      { to: "/me/credit", label: "我的信誉", icon: "el-icon-circle-check" },
      { to: "/me/help", label: "帮助与反馈", icon: "el-icon-chat-line-round" },
      { to: "/about/open-source", label: "关于原木社区", icon: "el-icon-info" },
      { to: "/me/settings", label: "设置与隐私", icon: "el-icon-setting" },
    ],
  }),
  computed: {
    membershipCaption() {
      if (!this.membership) return this.$t("专属身份、成长加速与更多个性体验");
      return this.$t("有效期至 {date} · {status}", {
        date: this.date(this.membership.expires_at),
        status: this.$t(this.membership.auto_renew ? "自动续费已开启" : "自动续费已关闭"),
      });
    },
    groups() {
      return String(this.user.user_group || "")
        .split(",")
        .filter(Boolean);
    },
    earnings() {
      return (Number(this.balances.cropped_log || 0) / 100).toFixed(2);
    },
  },
  mounted() {
    if (!readingToken()) {
      this.$router.replace({ path: "/login", query: { redirect: "/me" } });
      return;
    }
    this.load();
  },
  methods: {
    date(value) {
      return value
        ? new Date(value).toLocaleDateString(this.$language.state.locale)
        : "暂无";
    },
    async load() {
      this.loading = true;
      this.error = "";
      try {
        this.user = await account.profile();
        localStorage.setItem("LogHomeUserInfo", JSON.stringify(this.user));
        const results = await Promise.allSettled([
          account.balances(),
          account.membership(),
          this.$api.treePlant.getTreePlantInfo(),
          this.$api.users.getUserNovels(this.user.user_id),
        ]);
        if (results[0].status === "fulfilled") this.balances = results[0].value;
        if (results[1].status === "fulfilled")
          this.membership = results[1].value.subscription;
        if (results[2].status === "fulfilled") this.tree = results[2].value;
        if (results[3].status === "fulfilled") this.works = results[3].value.data || [];
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
  head: () => ({ title: "个人中心 - 原木社区" }),
};
</script>
<style scoped>
.profile-hero {
  position: relative;
  min-height: 230px;
  background: #86674c;
  background-size: cover;
  background-position: center;
  border-radius: 18px;
  overflow: hidden;
  color: white;
}
.profile-hero-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, #30241ed9, #30241e40);
}
.profile-hero-main {
  position: relative;
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 46px 30px;
  min-height: 230px;
}
.profile-hero h2 {
  font-size: 26px;
  margin: 0 0 8px;
}
.profile-hero h2 span {
  font-size: 11px;
  color: #e3d5c3;
  font-weight: 400;
  margin-left: 12px;
}
.profile-hero p {
  font-size: 13px;
  color: #f0e6d9;
}
.profile-card-link {
  margin-left: auto;
  color: #fff3df;
  white-space: nowrap;
  font-size: 13px;
}
.profile-groups {
  display: flex;
  gap: 6px;
}
.profile-groups span {
  font-size: 11px;
  background: #ffffff26;
  padding: 3px 7px;
  border-radius: 4px;
}
.membership-banner {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 22px 26px;
  background: linear-gradient(110deg, #33241b, #704b2e);
  border: 1px solid #ae8a52;
  color: #f1cf94;
  border-radius: 15px;
  margin: 18px 0;
}
.membership-banner.super {
  background: linear-gradient(110deg, #122734, #254d61);
}
.membership-banner img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  image-rendering: pixelated;
}
.membership-banner strong {
  font-size: 18px;
}
.membership-banner p {
  font-size: 12px;
  opacity: 0.75;
  margin: 8px 0 0;
}
.membership-banner > span {
  margin-left: auto;
  white-space: nowrap;
  font-size: 13px;
}
.personal-quick {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
.personal-quick a {
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--ink, #382d25);
}
.personal-quick a > i:first-child {
  font-size: 25px;
  color: var(--wood, #947358);
}
.personal-quick p {
  font-size: 12px;
  color: var(--muted, #82766c);
  margin: 7px 0 0;
}
.personal-quick a > i:last-child {
  margin-left: auto;
  color: #baac9b;
}
.personal-columns {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 20px;
}
.personal-services a,
.personal-services button {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 16px 0;
  color: var(--ink, #382d25);
  border-bottom: 1px solid #eee6dc;
}
.personal-services a:last-child {
  border: 0;
}
.personal-services a > i:first-child {
  font-size: 20px;
  color: var(--wood, #947358);
}
.personal-services p {
  font-size: 12px;
  color: var(--muted, #82766c);
  margin: 6px 0 0;
}
.personal-services a > i:last-child {
  margin-left: auto;
  color: #baa891;
}
.personal-services span {
  margin-left: auto;
  font-size: 12px;
  color: var(--wood, #947358);
}
.personal-services button {
  background: none;
  border: 0;
  cursor: pointer;
  width: 100%;
  font: inherit;
}
.personal-services strong {
  font-size: 14px;
  font-weight: 500;
}
.personal-tree {
  background: linear-gradient(130deg, #f1f2dc, #e0e8ca);
}
.personal-tree > span {
  font-size: 12px;
  color: #778453;
}
.personal-tree h2 {
  margin: 14px 0;
}
.earnings {
  font-size: 30px;
  color: var(--wood, #947358);
  margin: 18px 0;
}
.earnings small {
  font-size: 13px;
}
.social-toolbar h2 {
  margin: 0;
}
.social-toolbar a,
.personal-columns a {
  font-size: 13px;
}
.account-security {
  display: flex;
  align-items: center;
  gap: 16px;
}
.account-security > i {
  font-size: 24px;
  color: #cc8e3c;
}
.account-security p {
  font-size: 12px;
  color: var(--muted, #82766c);
  margin: 5px 0;
}
.account-security > a {
  margin-left: auto;
}
.row-main p {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
@media (max-width: 1100px) {
  .personal-columns {
    grid-template-columns: 1fr;
  }
  .profile-hero-main {
    flex-wrap: wrap;
  }
  .profile-card-link {
    margin-left: 108px;
  }
}
@media (max-width: 650px) {
  .personal-quick {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .membership-banner {
    padding: 18px;
    flex-wrap: wrap;
  }
  .membership-banner strong {
    font-size: 15px;
  }
  .profile-hero-main {
    padding: 26px 20px;
    gap: 14px;
  }
  .profile-card-link {
    margin-left: 0;
  }
  .profile-hero h2 {
    font-size: 22px;
  }
}
</style>
