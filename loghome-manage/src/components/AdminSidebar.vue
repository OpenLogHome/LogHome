<template>
  <aside class="aside" aria-label="管理系统导航">
    <router-link class="site-title" to="/" aria-label="返回仪表盘">
      <img src="../assets/applogo_white.png" alt="" />
      <span>原木罗盘系统</span>
    </router-link>

    <div class="menu-search">
      <el-input
        ref="menuSearch"
        v-model="searchKeyword"
        size="small"
        placeholder="搜索菜单"
        label="搜索菜单名称或分组"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="openFirstResult"
        @keydown.esc.native.stop="searchKeyword = ''"
      />
      <div v-if="isSearching" class="search-summary" role="status" aria-live="polite">
        找到 {{ searchResults.length }} 个入口
        <span v-if="searchResults.length"> · Enter 打开首项</span>
      </div>
    </div>

    <nav
      ref="menuScroll"
      class="menu-scroll"
      aria-label="功能菜单"
      tabindex="0"
      @transitionend="onMenuTransitionEnd"
    >
      <el-menu
        v-if="!isSearching"
        key="navigation"
        ref="navigationMenu"
        :default-active="activeMenuPath"
        :default-openeds="activeGroupIds"
        :collapse-transition="false"
        unique-opened
        router
        class="navigation-menu"
        background-color="#795548"
        text-color="#f5eeeb"
        active-text-color="#ffffff"
      >
        <el-menu-item :index="dashboard.path" :title="dashboard.label">
          <i :class="dashboard.icon" aria-hidden="true"></i>
          <span>{{ dashboard.label }}</span>
        </el-menu-item>
        <el-submenu v-for="group in menuGroups" :key="group.id" :index="group.id">
          <template slot="title">
            <i :class="group.icon" aria-hidden="true"></i>
            <span>{{ group.label }}</span>
          </template>
          <el-menu-item
            v-for="item in group.children"
            :key="item.path"
            :index="item.path"
            :title="item.label"
          >
            <i :class="item.icon" aria-hidden="true"></i>
            <span>{{ item.label }}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>

      <el-menu
        v-else-if="searchResults.length"
        key="search"
        :default-active="activeMenuPath"
        :collapse-transition="false"
        router
        class="navigation-menu search-results"
        background-color="#795548"
        text-color="#f5eeeb"
        active-text-color="#ffffff"
      >
        <el-menu-item v-for="item in searchResults" :key="item.path" :index="item.path">
          <i :class="item.icon" aria-hidden="true"></i>
          <div class="search-result-text">
            <span>{{ item.label }}</span>
            <small>{{ item.groupLabel }}</small>
          </div>
        </el-menu-item>
      </el-menu>
      <div v-else class="search-empty" role="status">
        <i class="el-icon-search" aria-hidden="true"></i>
        <p>没有找到相关菜单</p>
        <span>试试功能名称或分组名称</span>
        <button type="button" @click="searchKeyword = ''">清空搜索</button>
      </div>
    </nav>
  </aside>
</template>

<script>
import { adminMenuGroups, dashboardMenu } from '../navigation/adminMenu'

export default {
  name: 'AdminSidebar',
  data() {
    return {
      searchKeyword: '',
      dashboard: dashboardMenu,
      menuGroups: adminMenuGroups
    }
  },
  computed: {
    isSearching() {
      return Boolean(this.searchKeyword.trim())
    },
    activeMenuPath() {
      // 文章详情仍归属于小说管理入口。
      return this.$route.path.startsWith('/articlesManage/') ? '/novelsManage' : this.$route.path
    },
    activeGroupIds() {
      const group = this.menuGroups.find(group =>
        group.children.some(item => item.path === this.activeMenuPath)
      )
      return group ? [group.id] : []
    },
    searchResults() {
      const keywords = this.searchKeyword.trim().toLowerCase().split(/\s+/)
      const entries = [
        { ...this.dashboard, groupLabel: '首页' },
        ...this.menuGroups.reduce((items, group) => items.concat(
          group.children.map(item => ({ ...item, groupLabel: group.label }))
        ), [])
      ]
      return entries.filter(item => {
        const text = `${item.groupLabel} ${item.label}`.toLowerCase()
        return keywords.every(keyword => text.includes(keyword))
      })
    }
  },
  watch: {
    '$route.path'() {
      this.revealActiveMenu()
    },
    isSearching(searching) {
      this.$nextTick(() => {
        this.$refs.menuScroll.scrollTop = 0
        if (!searching) this.revealActiveMenu()
      })
    },
    searchKeyword() {
      this.$nextTick(() => {
        this.$refs.menuScroll.scrollTop = 0
      })
    }
  },
  mounted() {
    this.revealActiveMenu()
  },
  methods: {
    focusSearch() {
      this.$refs.menuSearch.focus()
    },
    openFirstResult(event) {
      if (event && (event.isComposing || event.keyCode === 229)) return
      if (!this.isSearching || !this.searchResults.length) return
      const path = this.searchResults[0].path
      if (path !== this.$route.path) this.$router.push(path)
    },
    revealActiveMenu() {
      this.$nextTick(() => {
        if (this.isSearching || !this.$refs.navigationMenu) return
        this.activeGroupIds.forEach(id => this.$refs.navigationMenu.open(id))
        this.$nextTick(this.scrollActiveMenuIntoView)
      })
    },
    onMenuTransitionEnd(event) {
      if (event.propertyName !== 'height' || this.isSearching) return
      const activeItem = this.$refs.menuScroll.querySelector('.el-menu-item.is-active')
      // 分组展开会改变可滚动高度，动画结束后再次校正当前入口的位置。
      if (activeItem && event.target.contains(activeItem)) this.scrollActiveMenuIntoView()
    },
    scrollActiveMenuIntoView() {
      const container = this.$refs.menuScroll
      const activeItem = container.querySelector('.el-menu-item.is-active')
      if (!activeItem || !activeItem.getClientRects().length) return
      const itemRect = activeItem.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      if (itemRect.bottom > containerRect.bottom) {
        container.scrollTop += itemRect.bottom - containerRect.bottom + 8
      } else if (itemRect.top < containerRect.top) {
        container.scrollTop += itemRect.top - containerRect.top - 8
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.aside {
  display: flex;
  flex: 0 0 232px;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  background: #795548;
  color: #f5eeeb;
}

.site-title {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 12px;
  height: 60px;
  padding: 0 20px;
  color: #fff !important;
  font-size: 17px;
  font-weight: 600;
  text-decoration: none;

  img {
    width: 28px;
    height: 28px;
    object-fit: contain;
  }
}

.menu-search {
  flex-shrink: 0;
  padding: 4px 14px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, .1);

  ::v-deep .el-input__inner {
    height: 34px;
    border-color: rgba(255, 255, 255, .2);
    border-radius: 6px;
    background: rgba(0, 0, 0, .12);
    color: #fff;

    &::placeholder {
      color: #e2d5cf;
    }

    &:focus {
      border-color: #f6b68e;
    }
  }

  ::v-deep .el-input__icon {
    line-height: 34px;
    color: #e2d5cf;
  }
}

.search-summary {
  padding-top: 10px;
  color: #e2d5cf;
  font-size: 11px;
  line-height: 18px;
}

.menu-scroll {
  flex: 1;
  min-height: 0;
  padding: 8px 6px 16px 8px;
  overflow-x: hidden;
  overflow-y: scroll;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: #bda59a #795548;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, .08);
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #bda59a;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #d7c4b9;
  }

  &:focus-visible {
    outline: 2px solid #f6b68e;
    outline-offset: -2px;
  }
}

.navigation-menu {
  border-right: 0;

  ::v-deep .el-submenu__title,
  ::v-deep .el-menu-item {
    height: 40px;
    line-height: 40px;
    padding-left: 12px !important;
    border-radius: 5px;
    font-size: 14px !important;

    i {
      color: #d7c4b9;
      font-size: 18px;
    }

    &:hover,
    &:focus-visible {
      background: rgba(255, 255, 255, .1) !important;
      color: #fff !important;
    }
  }

  ::v-deep .el-submenu .el-menu-item {
    min-width: 0;
    height: 36px;
    line-height: 36px;
    padding-left: 26px !important;
    font-size: 13px !important;
  }

  ::v-deep .el-submenu .el-menu {
    padding: 4px 0;
    background: rgba(0, 0, 0, .06) !important;
    border-radius: 5px;
  }

  ::v-deep .el-menu-item.is-active {
    background: rgba(255, 255, 255, .15) !important;
    box-shadow: inset 3px 0 #f6a36b;
    color: #fff !important;

    i {
      color: #ffc49c;
    }
  }
}

.search-results ::v-deep .el-menu-item {
  display: flex;
  align-items: center;
  height: 54px;
  line-height: normal;
}

.search-result-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;

  span {
    overflow: hidden;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    color: #e2d5cf;
    font-size: 11px;
  }
}

.search-empty {
  padding: 36px 8px;
  text-align: center;

  > i {
    color: #d7c4b9;
    font-size: 28px;
  }

  p {
    margin: 14px 0 8px;
    font-size: 14px;
  }

  > span {
    display: block;
    color: #e2d5cf;
    font-size: 12px;
  }

  button {
    margin-top: 16px;
    padding: 6px 12px;
    border: 1px solid rgba(255, 255, 255, .35);
    border-radius: 5px;
    background: transparent;
    color: #fff;
    cursor: pointer;

    &:hover,
    &:focus-visible {
      background: rgba(255, 255, 255, .1);
    }
  }
}
</style>
