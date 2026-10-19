<template>
  <Workspace :title="product.title || $t('商品详情')" active="/me" compact>
    <div v-if="error" class="social-panel" role="alert">
      <el-alert :title="error" type="error" :closable="false" /><el-button
        @click="load"
        >{{ $t("重试") }}</el-button
      >
    </div>
    <el-skeleton v-if="loading" class="social-panel" :rows="7" animated /><template
      v-else-if="product.id"
      ><div class="product-detail">
        <section class="social-panel product-gallery">
          <button
            v-if="images.length"
            class="product-main-image"
            @click="$preview(images, imageIndex)"
          >
            <img :src="images[imageIndex]" :alt="product.title" />
          </button>
          <div class="product-thumbnails">
            <button
              v-for="(url, index) in images"
              :key="url + index"
              :class="{ selected: imageIndex === index }"
              :aria-label="$t('查看第 {p0} 张图片', { p0: index + 1 })"
              @click="imageIndex = index"
            >
              <img :src="url" alt="" />
            </button>
          </div>
        </section>
        <section class="social-panel product-summary">
          <span class="social-muted">{{
            product.type === "physical" ? $t("实物周边") : $t("虚拟权益")
          }}</span>
          <h2>{{ product.title }}</h2>
          <p>{{ product.summary }}</p>
          <div class="product-price">
            {{ price }} <small>{{ $t("原木") }}</small>
          </div>
          <p class="social-muted">{{ $t("去皮原木同价，优先扣除去皮原木。") }}</p>
          <template v-if="product.has_variants"
            ><h3>{{ $t("选择规格") }}</h3>
            <div class="product-variants">
              <button
                v-for="variant in product.variants"
                :key="variant.id"
                :class="{ selected: variantId === variant.id }"
                :disabled="variant.status === 'off' || Number(variant.stock) <= 0"
                @click="variantId = variant.id"
              >
                {{ variant.label
                }}<span>{{
                  $t("{p0} 原木{p1}", {
                    p0: variant.price,
                    p1: Number(variant.stock) <= 0 ? $t(" / 售罄") : "",
                  })
                }}</span>
              </button>
            </div></template
          >
          <p class="social-muted">
            {{
              product.shipping_desc ||
              (product.type === "physical" ? $t("提交后等待发货") : $t("购买后自动发放"))
            }}
          </p>
          <el-button type="primary" :disabled="!canBuy" @click="checkout">{{
            product.has_variants && !variant
              ? $t("请选择规格")
              : stock <= 0
              ? $t("已售罄")
              : $t("立即购买")
          }}</el-button>
        </section>
      </div>
      <section v-if="descriptionHtml" class="social-panel product-description">
        <h2>{{ $t("商品介绍") }}</h2>
        <div class="product-rich-text" v-html="descriptionHtml" /></section></template
    ><el-dialog
      :title="
        addressEditing
          ? $t(editingAddress ? '编辑收货地址' : '新增收货地址')
          : $t('确认订单')
      "
      :visible.sync="checkoutVisible"
      width="min(650px, 94vw)"
      :close-on-click-modal="false"
      :before-close="closeCheckout"
      ><AddressEditor
        v-if="addressEditing"
        ref="addressEditor"
        :address="editingAddress"
        @busy-change="addressSaving = $event"
        @saved="addressSaved"
      />
      <template v-else
        ><div class="social-list-row">
          <img :src="(variant && variant.cover_url) || product.cover_url" alt="" />
          <div class="row-main">
            <strong>{{ product.title }}</strong>
            <p>{{ variant && variant.label }}</p>
          </div>
          <strong>{{ $t("{p0} 原木", { p0: price }) }}</strong>
        </div>
        <el-form label-position="top"
          ><el-form-item v-if="product.type === 'physical'" :label="$t('收货地址')"
            ><el-select
              v-model="addressId"
              style="width: 100%"
              :placeholder="$t('请选择收货地址')"
              ><el-option
                v-for="address in addresses"
                :key="address.address_id"
                :value="address.address_id"
                :label="`${address.receiver_name} ${address.receiver_phone} / ${address.province}${address.city}${address.district}${address.detail}`"
            /></el-select>
            <div class="checkout-address-actions">
              <el-button
                type="text"
                :disabled="checkoutLoading || submitting"
                @click="editAddress()"
                >{{ $t("新增地址") }}</el-button
              >
              <el-button
                v-if="addressId"
                type="text"
                :disabled="checkoutLoading || submitting"
                @click="
                  editAddress(addresses.find((item) => item.address_id === addressId))
                "
                >{{ $t("编辑所选地址") }}</el-button
              >
            </div></el-form-item
          ></el-form
        >
        <p class="social-muted">
          {{
            $t("原木余额 {p0}，去皮原木 {p1}", {
              p0: balances.log || 0,
              p1: balances.cropped_log || 0,
            })
          }}
        </p>
        <p>
          {{
            $t("本次扣除 {p0} 去皮原木 + {p1} 原木", {
              p0: payCropped,
              p1: price - payCropped,
            })
          }}
        </p>
        <el-alert
          v-if="totalBalance < price"
          :title="$t('余额不足，请先充值原木')"
          type="warning"
          :closable="false"
        /><el-alert
          v-if="checkoutError"
          :title="checkoutError"
          type="error"
          :closable="false"
        /><el-button
          v-if="checkoutError"
          type="text"
          :loading="checkoutLoading"
          @click="loadCheckout"
          >{{ $t("重新加载") }}</el-button
        ></template
      ><template #footer
        ><template v-if="addressEditing"
          ><el-button :disabled="addressSaving" @click="addressEditing = false">{{
            $t("返回结算")
          }}</el-button
          ><el-button
            type="primary"
            :loading="addressSaving"
            @click="$refs.addressEditor.save()"
            >{{ $t("保存并使用地址") }}</el-button
          ></template
        >
        <template v-else
          ><el-button :disabled="submitting" @click="closeCheckout()">{{
            $t("取消")
          }}</el-button
          ><el-button
            type="primary"
            :loading="submitting"
            :disabled="
              checkoutLoading ||
              !!checkoutError ||
              !canBuy ||
              totalBalance < price ||
              (product.type === 'physical' && !addressId)
            "
            @click="submitOrder"
            >{{ $t("确认扣款并下单") }}</el-button
          ></template
        ></template
      ></el-dialog
    ></Workspace
  >
</template>
<script>
import { productDescriptionHtml } from "~/utils/social-content";
import Workspace from "~/components/social/Workspace.vue";
import AddressEditor from "~/components/social/AddressEditor.vue";
import store from "~/plugins/api/store";
import account, { accountRequestId } from "~/plugins/api/account";
import { readingToken } from "~/plugins/api/reading";
import { mediaUrls } from "~/utils/social";
export default {
  components: { Workspace, AddressEditor },
  data: () => ({
    product: {},
    imageIndex: 0,
    variantId: null,
    loading: true,
    error: "",
    checkoutVisible: false,
    checkoutLoading: false,
    addressEditing: false,
    editingAddress: null,
    addressSaving: false,
    checkoutError: "",
    submitting: false,
    addresses: [],
    addressId: null,
    balances: {},
    requestId: "",
    requestPayload: "",
  }),
  computed: {
    variant() {
      return (this.product.variants || []).find(
        (item) => item.id === this.variantId && item.status !== "off"
      );
    },
    price() {
      return Number(this.variant ? this.variant.price : this.product.price) || 0;
    },
    stock() {
      return Number(this.variant ? this.variant.stock : this.product.stock) || 0;
    },
    canBuy() {
      return (
        (!this.product.has_variants || !!this.variant) && this.stock > 0 && this.price > 0
      );
    },
    images() {
      return [
        ...new Set(
          [
            this.variant && this.variant.cover_url,
            this.product.cover_url,
            ...mediaUrls(this.product.media_urls),
          ].filter(Boolean)
        ),
      ];
    },
    descriptionHtml() {
      return productDescriptionHtml(this.product.description || "");
    },
    totalBalance() {
      return Number(this.balances.log || 0) + Number(this.balances.cropped_log || 0);
    },
    payCropped() {
      return Math.min(Number(this.balances.cropped_log || 0), this.price);
    },
  },
  watch: {
    variantId() {
      this.imageIndex = 0;
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    editAddress(address) {
      this.editingAddress = address || null;
      this.addressEditing = true;
    },
    closeCheckout(done) {
      if (this.submitting || this.addressSaving) return;
      this.checkoutVisible = false;
      this.addressEditing = false;
      if (done) done();
    },
    async addressSaved(address) {
      this.addressEditing = false;
      this.addressId = address.address_id;
      await this.loadCheckout();
      if (!this.checkoutError) this.$message.success(this.$t("地址已保存"));
    },
    async load() {
      this.loading = true;
      this.error = "";
      try {
        this.product = await store.product(this.$route.params.id);
        this.variantId = Number(this.$route.query.variant_id) || null;
        if (this.$route.query.checkout === "1") this.$nextTick(() => this.checkout());
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async checkout() {
      if (!readingToken()) {
        this.$router.push({
          path: "/login",
          query: { redirect: this.$route.fullPath },
        });
        return;
      }
      this.addressEditing = false;
      this.checkoutVisible = true;
      await this.loadCheckout();
    },
    async loadCheckout() {
      this.checkoutLoading = true;
      this.checkoutError = "";
      try {
        const [balances, addresses] = await Promise.all([
          account.balances(),
          this.product.type === "physical" ? store.addresses() : Promise.resolve([]),
        ]);
        this.balances = balances;
        this.addresses = addresses;
        if (!this.addressId)
          this.addressId =
            (addresses.find((item) => item.is_default) || addresses[0] || {})
              .address_id || null;
      } catch (error) {
        this.checkoutError = error.message;
      } finally {
        this.checkoutLoading = false;
      }
    },
    async submitOrder() {
      if (
        this.submitting ||
        this.checkoutLoading ||
        !this.canBuy ||
        this.totalBalance < this.price ||
        (this.product.type === "physical" && !this.addressId)
      )
        return;
      this.submitting = true;
      this.checkoutError = "";
      const body = {
        product_id: Number(this.product.id),
        variant_id: this.variant ? this.variant.id : null,
        address_id: this.product.type === "physical" ? this.addressId : null,
      };
      const payload = JSON.stringify(body);
      if (payload !== this.requestPayload) {
        this.requestId = accountRequestId("store");
        this.requestPayload = payload;
      }
      try {
        await store.createOrder({ ...body, client_request_id: this.requestId });
        this.requestId = "";
        this.requestPayload = "";
        this.$message.success(this.$t("下单成功"));
        this.checkoutVisible = false;
        this.$router.push("/store/orders");
      } catch (error) {
        this.checkoutError = error.message;
      } finally {
        this.submitting = false;
      }
    },
  },
  head() {
    return { title: `${this.product.title || "商品详情"} - 原木商城` };
  },
};
</script>
<style scoped>
.product-detail {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 24px;
}
.product-gallery {
  align-self: start;
}
.product-main-image {
  border: 0;
  background: none;
  width: 100%;
  padding: 0;
  cursor: zoom-in;
}
.product-main-image img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
  border-radius: 12px;
}
.product-thumbnails {
  display: flex;
  gap: 10px;
  overflow: auto;
  margin-top: 16px;
}
.product-thumbnails button {
  border: 1px solid var(--line, #e9e0d5);
  padding: 3px;
  border-radius: 8px;
  background: none;
  cursor: pointer;
  flex-shrink: 0;
}
.product-thumbnails .selected {
  border-color: var(--wood, #947358);
}
.product-thumbnails img {
  width: 62px;
  height: 62px;
  object-fit: cover;
  display: block;
}
.product-summary h2 {
  font-size: 25px;
  margin: 16px 0;
}
.product-summary > p {
  font-size: 14px;
  line-height: 1.9;
  color: var(--muted, #82766c);
}
.product-price {
  font-size: 36px;
  color: var(--wood, #b94a18);
  margin: 24px 0 8px;
}
.product-price small {
  font-size: 13px;
}
.product-summary h3 {
  font-size: 14px;
  margin: 26px 0 12px;
}
.product-variants {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}
.product-variants button {
  background: var(--surface, #fffdf9);
  color: var(--ink, #382d25);
  border: 1px solid var(--line, #e9e0d5);
  border-radius: 9px;
  padding: 12px;
  cursor: pointer;
  text-align: left;
}
.product-variants span {
  display: block;
  font-size: 11px;
  color: var(--muted, #82766c);
  margin-top: 5px;
}
.social-workspace .product-variants .selected {
  background: var(--selection-bg, #f6e9dc);
  border-color: var(--wood, #947358);
  box-shadow: inset 0 0 0 1px var(--wood, #947358);
}
.product-variants button:disabled {
  background: var(--soft, #f1f3f5);
  color: var(--muted, #5b626d);
  opacity: 1;
  cursor: not-allowed;
}
.product-summary > .el-button {
  width: 100%;
  margin-top: 16px;
}
.product-description p {
  white-space: pre-line;
  line-height: 1.9;
  font-size: 14px;
  color: var(--muted, #766858);
}
.product-description img {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 20px auto;
}
@media (max-width: 1050px) {
  .product-detail {
    grid-template-columns: 1fr;
  }
}
.product-rich-text ::v-deep p,
.product-rich-text ::v-deep div {
  line-height: 1.9;
  margin: 12px 0;
}
.product-rich-text ::v-deep img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 20px auto;
}
.product-rich-text ::v-deep h2,
.product-rich-text ::v-deep h3 {
  margin: 24px 0 12px;
  font-size: 21px;
}
.product-rich-text ::v-deep ul,
.product-rich-text ::v-deep ol {
  padding-left: 24px;
  line-height: 1.9;
}
.product-rich-text ::v-deep a {
  color: var(--wood);
}
.product-rich-text ::v-deep table {
  display: block;
  overflow: auto;
  max-width: 100%;
  border-collapse: collapse;
}
.product-rich-text ::v-deep td,
.product-rich-text ::v-deep th {
  padding: 12px;
  border: 1px solid var(--line);
}
</style>
