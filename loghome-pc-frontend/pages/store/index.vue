<template>
  <Workspace :title="$t('原木商城')" active="/me"
    >
    <div class="social-tabs">
      <button
        v-for="item in types"
        :key="item.key"
        :class="{ active: type === item.key }"
        @click="changeType(item.key)"
      >
        {{ $t(item.label) }}
      </button>
    </div>
    <div class="store-categories">
      <button
        v-for="item in categories"
        :key="item.key"
        :class="{ active: category === item.key }"
        @click="changeCategory(item.key)"
      >
        {{ $t(item.label) }}
      </button>
    </div>
    <div v-if="error" class="social-panel social-state" role="alert">
      {{ error }}<br /><el-button @click="load">{{ $t("重试") }}</el-button>
    </div>
    <div v-if="loading && !products.length" class="social-panel">
      <el-skeleton :rows="6" animated />
    </div>
    <div class="product-grid">
      <nuxt-link
        v-for="product in products"
        :key="product.id"
        :to="`/store/${product.id}`"
        class="product-card"
        ><img
          :src="product.cover_url || '/social/icons/store.png'"
          :alt="product.title"
          loading="lazy"
        />
        <div>
          <span class="product-kind">{{
            product.type === "physical" ? $t("实物周边") : $t("虚拟权益")
          }}</span>
          <h2>{{ product.title }}</h2>
          <p>{{ product.summary }}</p>
          <footer>
            <strong
              >{{ product.price }} <small>{{ $t("原木") }}</small></strong
            ><span>{{ Number(product.stock) > 0 ? $t("查看详情") : $t("已售罄") }}</span>
          </footer>
        </div></nuxt-link
      >
    </div>
    <div v-if="!loading && !error && !products.length" class="social-panel social-state">
      <i class="el-icon-shopping-bag-1" />{{
        $t("这个分类暂时没有商品，试试其他分类吧。")
      }}
    </div>
    <div class="social-end" v-if="products.length">
      <el-button v-if="hasMore" :loading="loading" @click="load">{{
        $t("加载更多")
      }}</el-button
      ><span v-else>{{ $t("全部商品已展示") }}</span>
    </div></Workspace
  >
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import store from "~/plugins/api/store";
export default {
  components: { Workspace },
  data: () => ({
    type: "all",
    category: "",
    types: [
      { key: "all", label: "全部商品" },
      { key: "virtual", label: "虚拟权益" },
      { key: "physical", label: "实物周边" },
    ],
    categories: [
      { key: "", label: "全部好物" },
      { key: "Minecraft", label: "Minecraft" },
      { key: "写作", label: "写作灵感" },
    ],
    products: [],
    page: 1,
    loading: false,
    error: "",
    hasMore: true,
    requestId: 0,
  }),
  mounted() {
    this.load();
  },
  beforeDestroy() {
    this.requestId++;
  },
  methods: {
    changeType(type) {
      this.type = type;
      this.reset();
    },
    changeCategory(category) {
      this.category = category;
      this.reset();
    },
    reset() {
      this.requestId++;
      this.loading = false;
      this.products = [];
      this.page = 1;
      this.hasMore = true;
      this.load();
    },
    async load() {
      if (this.loading || !this.hasMore) return;
      const request = ++this.requestId;
      this.loading = true;
      this.error = "";
      try {
        const result = await store.products({
          type: this.type,
          ...(this.category ? { category: this.category } : {}),
          page: this.page,
          pageSize: 12,
        });
        if (request !== this.requestId) return;
        this.products = [...this.products, ...result.list];
        this.page++;
        this.hasMore = this.products.length < result.total;
      } catch (error) {
        if (request === this.requestId) this.error = error.message;
      } finally {
        if (request === this.requestId) this.loading = false;
      }
    },
  },
  head: () => ({ title: "原木商城 - 原木社区" }),
};
</script>
<style scoped>
.store-categories {
  display: flex;
  gap: 16px;
  margin: 0 0 24px;
}
.store-categories button {
  border: 0;
  background: none;
  color: var(--muted, #82766c);
  cursor: pointer;
  padding: 5px;
}
.store-categories .active {
  color: var(--wood, #c65320);
  font-weight: 600;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 22px;
}
.product-card {
  border: 1px solid var(--line, #e9e0d5);
  border-radius: 14px;
  overflow: hidden;
  background: var(--surface, #fffdf9);
  color: var(--ink, #382d25);
}
.product-card > img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  display: block;
}
.product-card > div {
  padding: 22px;
}
.product-kind {
  font-size: 11px;
  color: var(--wood, #947358);
}
.product-card h2 {
  font-size: 19px;
  margin: 10px 0;
}
.product-card p {
  font-size: 13px;
  line-height: 1.8;
  color: var(--muted, #82766c);
  min-height: 46px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.product-card footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}
.product-card strong {
  font-size: 20px;
  font-weight: 500;
  color: var(--wood, #b94a18);
}
.product-card small,
.product-card footer > span {
  font-size: 11px;
  font-weight: 400;
  color: var(--muted, #82766c);
}
@media (max-width: 650px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
