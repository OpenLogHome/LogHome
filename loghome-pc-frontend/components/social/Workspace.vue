<template>
  <div class="social-workspace" :data-theme="resolvedTheme">
    <a class="social-skip" href="#social-main">{{ $t("跳转到页面内容") }}</a>
    <aside class="workspace-nav">
      <nav :aria-label="$t('社区与个人中心导航')">
        <nuxt-link
          v-for="item in links"
          :key="item.to"
          :to="item.to"
          :exact="item.exact"
          :class="{ selected: item.to === active }"
          ><i :class="item.icon" aria-hidden="true" />{{ $t(item.label) }}</nuxt-link
        >
      </nav>
      <nuxt-link v-if="showCompose" class="workspace-compose" to="/community/post/edit"
        ><i class="el-icon-edit" />{{ $t("发布帖子") }}</nuxt-link
      >
    </aside>
    <main class="workspace-main" id="social-main" tabindex="-1">
      <header
        v-if="!compact || $slots.heading || $slots.actions"
        class="workspace-heading"
      >
        <div>
          <h1 :class="{ 'social-sr-only': compact }">{{ title }}</h1>
          <slot name="heading" />
          <p v-if="description">{{ description }}</p>
        </div>
        <div class="workspace-actions">
          <slot name="actions" />
        </div>
      </header>
      <h1 v-else class="social-sr-only">{{ title }}</h1>
      <nav
        v-if="sectionNavigation"
        class="workspace-sections"
        :aria-label="$t(sectionNavigation.label)"
      >
        <nuxt-link
          v-for="item in sectionNavigation.links"
          :key="item.to"
          :to="item.to"
          :aria-current="item.current ? 'page' : undefined"
          :class="{ current: item.current }"
          >{{ $t(item.label) }}</nuxt-link
        >
      </nav>
      <slot />
    </main>
    <aside v-if="$slots.aside" class="workspace-aside">
      <slot name="aside" />
    </aside>
  </div>
</template>
<script>
import { workspaceNavigation, showWorkspaceCompose } from "~/utils/workspace-navigation";
export default {
  props: {
    title: String,
    description: String,
    compact: Boolean,
    active: String,
    circleRole: { type: Number, default: 0 },
  },
  data: () => ({
    themeReady: false,
    links: [
      {
        to: "/community",
        label: "社区动态",
        icon: "el-icon-discover",
        exact: true,
      },
      {
        to: "/community/circles",
        label: "圈子广场",
        icon: "el-icon-chat-dot-round",
      },
      { to: "/community/search", label: "搜索社区", icon: "el-icon-search" },
      { to: "/me/messages", label: "消息中心", icon: "el-icon-bell" },
      { to: "/me/friends", label: "好友与关注", icon: "el-icon-user" },
      { to: "/me", label: "个人中心", icon: "el-icon-house", exact: true },
      { to: "/me/settings", label: "账号设置", icon: "el-icon-setting" },
    ],
  }),
  mounted() {
    this.themeReady = true;
  },
  computed: {
    sectionNavigation() {
      return workspaceNavigation(this.$route.path, this.circleRole);
    },
    showCompose() {
      return showWorkspaceCompose(this.$route.path);
    },
    resolvedTheme() {
      return this.themeReady ? this.$theme.resolved : "light";
    },
  },
  watch: {
    resolvedTheme(value) {
      this.$emit("theme-change", value);
    },
  },
};
</script>
<style>
.social-workspace {
  --wood: #79573d;
  --ink: #382d25;
  --muted: #776a5d;
  --line: #e9e0d5;
  --surface: #fffdf9;
  --soft: #f2e9dd;
  max-width: 1440px;
  margin: auto;
  display: grid;
  grid-template-columns: 190px minmax(0, 1fr);
  gap: 24px;
  padding: 24px 28px 48px;
  color: var(--ink);
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei",
    sans-serif;
}
.social-workspace:has(.workspace-aside) {
  grid-template-columns: 190px minmax(0, 1fr) 280px;
}
.workspace-nav {
  position: sticky;
  top: 90px;
  align-self: start;
}
.workspace-nav nav {
  display: grid;
  gap: 6px;
  margin: 8px 0 24px;
}
.workspace-nav nav a {
  padding: 13px 14px;
  display: flex;
  gap: 12px;
  align-items: center;
  border-radius: 10px;
  color: var(--muted);
}
.workspace-nav nav a:hover,
.workspace-nav nav a.nuxt-link-active,
.workspace-nav nav a.selected {
  background: var(--soft);
  color: #704c35;
}
.workspace-compose {
  display: flex;
  justify-content: center;
  gap: 8px;
  background: var(--wood);
  color: white !important;
  border-radius: 10px;
  padding: 13px;
}
.workspace-main {
  min-width: 0;
}
.workspace-heading {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin: 0 0 20px;
  align-items: center;
}
.workspace-heading h1 {
  font-size: 26px;
  line-height: 1.4;
  margin: 0;
  color: var(--ink);
}
.workspace-heading p {
  font-size: 14px;
  color: var(--muted);
  margin: 0;
  line-height: 1.7;
}
.workspace-actions {
  display: flex;
  gap: 8px;
}
.workspace-aside {
  align-self: start;
  position: sticky;
  top: 96px;
  padding-top: 8px;
}
.social-panel {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 22px;
  margin-bottom: 18px;
}
.social-panel h2,
.social-panel h3 {
  margin: 0 0 16px;
  font-size: 18px;
}
.social-muted {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.7;
}
.social-state {
  text-align: center;
  padding: 56px 16px;
  color: var(--muted);
  line-height: 1.8;
}
.social-state i {
  display: block;
  font-size: 34px;
  margin-bottom: 14px;
  color: #b9a58c;
}
.social-state button {
  margin-top: 12px;
}
.social-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.social-tabs button {
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--muted);
  border-radius: 9px;
  padding: 10px 16px;
  cursor: pointer;
}
.social-tabs button.active {
  background: var(--wood);
  border-color: var(--wood);
  color: white;
}
.social-workspace a:focus-visible,
.social-workspace button:focus-visible {
  outline: 3px solid #bb9566;
  outline-offset: 3px;
}
.social-list-row {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--line);
}
.social-list-row:last-child {
  border-bottom: 0;
}
.social-list-row img {
  width: 46px;
  height: 46px;
  object-fit: cover;
  border-radius: 12px;
}
.social-list-row .row-main {
  flex: 1;
  min-width: 0;
}
.social-list-row p {
  margin: 6px 0 0;
  line-height: 1.6;
  font-size: 13px;
  color: var(--muted);
}
.social-list-row a {
  color: var(--ink);
}
.social-end {
  text-align: center;
  padding: 20px;
  color: var(--muted);
  font-size: 13px;
}
.social-card-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.social-toolbar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
}
.social-toolbar .el-input {
  max-width: 420px;
}
@media (max-width: 1200px) {
  .social-workspace:has(.workspace-aside) {
    grid-template-columns: 170px minmax(0, 1fr);
  }
  .workspace-aside {
    display: none;
  }
}
@media (max-width: 850px) {
  .social-workspace,
  .social-workspace:has(.workspace-aside) {
    grid-template-columns: minmax(0, 1fr);
    padding: 20px 16px;
    gap: 20px;
  }
  .workspace-nav {
    position: static;
  }
  .workspace-compose {
    display: none;
  }
  .workspace-nav nav {
    display: flex;
    overflow: auto;
    margin: 0;
    gap: 4px;
  }
  .workspace-nav nav a {
    white-space: nowrap;
    padding: 10px;
  }
  .workspace-heading {
    align-items: flex-start;
  }
  .workspace-heading h1 {
    font-size: 24px;
  }
  .social-card-grid {
    grid-template-columns: 1fr;
  }
  .social-toolbar {
    flex-wrap: wrap;
  }
}

.social-workspace a {
  text-decoration: none;
}
.social-workspace button {
  font-family: inherit;
}
.social-workspace .el-button {
  border-radius: 8px;
  white-space: nowrap;
}
.social-workspace .el-button--primary {
  background: var(--wood);
  border-color: var(--wood);
  color: #fffdf9;
}
.social-workspace .el-button--primary:hover,
.social-workspace .el-button--primary:focus {
  background: #67472f;
  border-color: #67472f;
}
.social-workspace .el-button--primary.is-disabled {
  background: #e4d9cb;
  border-color: #e4d9cb;
  color: #766858;
}
.social-workspace .el-button--text {
  color: var(--wood);
}
.social-workspace .el-input__inner,
.social-workspace .el-textarea__inner {
  border-radius: 8px;
  border-color: #c6b9a7;
  background: var(--surface);
  color: var(--ink);
}
.social-workspace .el-input__inner::placeholder,
.social-workspace .el-textarea__inner::placeholder {
  color: #776e63;
}
.social-workspace .el-input__inner:focus,
.social-workspace .el-textarea__inner:focus {
  border-color: var(--wood);
  box-shadow: 0 0 0 2px #94735820;
}
.social-workspace .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background: var(--wood);
  border-color: var(--wood);
  box-shadow: -1px 0 0 0 var(--wood);
}
.social-workspace .el-switch.is-checked .el-switch__core {
  border-color: var(--wood);
  background: var(--wood);
}
.social-workspace .el-button:active,
.social-tabs button:active {
  transform: translateY(1px);
}
.social-skip {
  position: absolute;
  left: 16px;
  top: -100px;
  z-index: 100;
  background: var(--surface);
  border: 2px solid var(--wood);
  padding: 12px;
}
.social-skip:focus {
  top: 90px;
}
.social-workspace .el-dialog {
  border-radius: 16px;
  overflow: hidden;
}
.social-workspace .el-dialog__body {
  color: var(--ink);
}
.social-workspace .el-progress-bar__inner {
  background: var(--wood);
}
.social-workspace .el-collapse-item__header,
.social-workspace .el-collapse-item__wrap {
  background: transparent;
  color: var(--ink);
}
.social-workspace .el-collapse-item__content {
  color: var(--muted);
}
@media (prefers-reduced-motion: no-preference) {
  .social-workspace button,
  .social-workspace a {
    transition: transform 0.16s ease, opacity 0.16s ease;
  }
  .social-post {
    animation: social-enter 0.2s ease-out;
  }
  @keyframes social-enter {
    from {
      opacity: 0.5;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
@media (prefers-reduced-motion: reduce) {
  .social-workspace * {
    animation: none !important;
    transition: none !important;
  }
}
[data-theme="dark"].social-workspace {
  --ink: #eee5d9;
  --muted: #c4b6a5;
  --line: #504536;
  --surface: #2a2621;
  --soft: #383126;
  --wood: #c8a782;
}
@media all {
  [data-theme="dark"].social-workspace {
    --ink: #eee5d9;
    --muted: #c4b6a5;
    --line: #504536;
    --surface: #2a2621;
    --soft: #383126;
    --wood: #c8a782;
    background: #211e19;
    border-radius: 16px;
  }
  [data-theme="dark"].social-workspace .social-panel,
  [data-theme="dark"].social-workspace .social-post,
  [data-theme="dark"].social-workspace .circle-tile,
  [data-theme="dark"].social-workspace .product-card,
  [data-theme="dark"].social-workspace .frame-option,
  [data-theme="dark"].social-workspace .badge-option,
  [data-theme="dark"].social-workspace .pass-card {
    background: var(--surface);
    border-color: var(--line);
    color: var(--ink);
  }
  [data-theme="dark"].social-workspace .post-body,
  [data-theme="dark"].social-workspace .post-author,
  [data-theme="dark"].social-workspace .feed-circle,
  [data-theme="dark"].social-workspace .personal-services a,
  [data-theme="dark"].social-workspace .personal-quick a,
  [data-theme="dark"].social-workspace .lab-entry {
    color: var(--ink);
  }
  [data-theme="dark"].social-workspace .post-body p,
  [data-theme="dark"].social-workspace .social-post footer a,
  [data-theme="dark"].social-workspace .social-post footer button,
  [data-theme="dark"].social-workspace .personal-services p,
  [data-theme="dark"].social-workspace .personal-quick p,
  [data-theme="dark"].social-workspace .circle-tile p,
  [data-theme="dark"].social-workspace .product-card p,
  [data-theme="dark"].social-workspace .product-summary p,
  [data-theme="dark"].social-workspace .product-description p,
  [data-theme="dark"].social-workspace .pass-card li p,
  [data-theme="dark"].social-workspace .pass-summary,
  [data-theme="dark"].social-workspace .message-target {
    color: var(--muted);
  }
  [data-theme="dark"].social-workspace
    .el-button:not(.el-button--primary):not(.el-button--text),
  [data-theme="dark"].social-workspace .el-radio-button__inner {
    background: var(--surface);
    border-color: var(--line);
    color: var(--ink);
  }
  [data-theme="dark"].social-workspace .el-button--primary {
    color: #211e19;
  }
  [data-theme="dark"].social-workspace .el-button--primary:hover {
    background: #d6b58e;
    border-color: #d6b58e;
  }
  [data-theme="dark"].social-workspace .el-dialog {
    background: var(--surface);
  }
  [data-theme="dark"].social-workspace .el-dialog__title,
  [data-theme="dark"].social-workspace .el-form-item__label {
    color: var(--ink);
  }
  [data-theme="dark"].social-workspace .el-input__inner::placeholder,
  [data-theme="dark"].social-workspace .el-textarea__inner::placeholder {
    color: #c4b6a5;
  }
  [data-theme="dark"].social-workspace .personal-tree,
  [data-theme="dark"].social-workspace .store-intro,
  [data-theme="dark"].social-workspace .post-work,
  [data-theme="dark"].social-workspace .post-circle,
  [data-theme="dark"].social-workspace .message-categories button.active,
  [data-theme="dark"].social-workspace .frame-option.selected,
  [data-theme="dark"].social-workspace .pass-plans button,
  [data-theme="dark"].social-workspace .product-variants button,
  [data-theme="dark"].social-workspace .recharge-plans button,
  [data-theme="dark"].social-workspace .rules-hero,
  [data-theme="dark"].social-workspace .rules-section,
  [data-theme="dark"].social-workspace .badge-detail-image,
  [data-theme="dark"].social-workspace .badge-condition-group {
    background: var(--soft);
    color: var(--ink);
    border-color: var(--line);
  }
  [data-theme="dark"].social-workspace .pass-plans span,
  [data-theme="dark"].social-workspace .product-variants span,
  [data-theme="dark"].social-workspace .frame-option span {
    color: var(--muted);
  }
  [data-theme="dark"].social-workspace .workspace-nav nav a:hover,
  [data-theme="dark"].social-workspace .workspace-nav nav a.nuxt-link-active {
    background: var(--soft);
    color: var(--wood);
  }
  [data-theme="dark"].social-workspace .workspace-compose {
    color: #211e19 !important;
  }
  [data-theme="dark"].social-workspace .social-tabs button.active {
    color: #211e19;
  }
  [data-theme="dark"].social-workspace .el-input__count,
  [data-theme="dark"].social-workspace .el-textarea .el-input__count {
    background: var(--surface);
    color: var(--muted);
  }
}

.workspace-theme {
  height: 38px;
  width: 38px;
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: var(--surface);
  color: var(--muted);
  cursor: pointer;
  flex-shrink: 0;
  font-size: 17px;
}
.social-workspace .workspace-actions {
  align-items: center;
}
.social-workspace .workspace-compose {
  color: #fffdf9 !important;
}
.social-workspace .el-button--primary {
  color: #fffdf9;
}
.social-workspace[data-theme="dark"] .workspace-compose,
.social-workspace[data-theme="dark"] .el-button--primary {
  color: #211e19 !important;
}
.social-workspace[data-theme="dark"] .settings-card,
.social-workspace[data-theme="dark"] .friends-card,
.social-workspace[data-theme="dark"] .post-detail,
.social-workspace[data-theme="dark"] .comments-section {
  background: var(--surface) !important;
  border-color: var(--line) !important;
  color: var(--ink);
}
.social-workspace .el-switch__label.is-active {
  color: var(--wood);
}
</style>

<style>
.social-workspace .social-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.workspace-heading .social-tabs {
  margin: 0;
}
.workspace-actions {
  align-items: center;
}
.workspace-heading > div:first-child {
  min-width: 0;
}
</style>
