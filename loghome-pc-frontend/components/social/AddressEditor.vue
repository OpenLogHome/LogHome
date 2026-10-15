<template>
  <el-form
    ref="form"
    class="address-editor"
    :model="form"
    :rules="rules"
    label-position="top"
    :disabled="saving"
    @submit.native.prevent="save"
  >
    <div class="address-contact-fields">
      <el-form-item :label="$t('收货人')" :for="fieldPrefix + 'name'" prop="receiver_name"
        ><el-input
          v-model="form.receiver_name"
          :id="fieldPrefix + 'name'"
          maxlength="50"
          autocomplete="name"
      /></el-form-item>
      <el-form-item
        :label="$t('联系电话')"
        :for="fieldPrefix + 'phone'"
        prop="receiver_phone"
        ><el-input
          v-model="form.receiver_phone"
          :id="fieldPrefix + 'phone'"
          type="tel"
          maxlength="20"
          autocomplete="tel"
      /></el-form-item>
    </div>
    <el-form-item :label="$t('省市区')"
      ><el-cascader
        v-model="region"
        :options="regions"
        :props="{ value: 'name', label: 'name', children: 'children' }"
        filterable
        :placeholder="$t('请选择省市区')"
    /></el-form-item>
    <el-form-item :label="$t('详细地址')" :for="fieldPrefix + 'detail'" prop="detail"
      ><el-input
        v-model="form.detail"
        :id="fieldPrefix + 'detail'"
        type="textarea"
        :rows="3"
        maxlength="200"
        autocomplete="street-address"
        :placeholder="$t('街道、门牌号等')"
    /></el-form-item>
    <el-switch v-model="form.is_default" :active-text="$t('设为默认收货地址')" />
    <el-alert v-if="error" :title="error" type="error" :closable="false" role="alert" />
  </el-form>
</template>
<script>
import store from "~/plugins/api/store";
import { readingToken } from "~/plugins/api/reading";
import { createRegionOptions } from "~/utils/address-region-picker";
export default {
  props: { address: { type: Object, default: null } },
  data() {
    const address = this.address || {};
    return {
      form: {
        receiver_name: address.receiver_name || "",
        receiver_phone: address.receiver_phone || "",
        detail: address.detail || "",
        is_default: !!address.is_default,
      },
      region: this.address ? [address.province, address.city, address.district] : [],
      saving: false,
      error: "",
      token: readingToken(),
    };
  },
  computed: {
    fieldPrefix() {
      return "address-" + this._uid + "-";
    },
    regions() {
      return createRegionOptions(this.region).map((province) => ({
        ...province,
        children: province.children.map((city) => ({
          ...city,
          children: city.children.map((name) => ({ name })),
        })),
      }));
    },
    rules() {
      return {
        receiver_name: [
          { required: true, whitespace: true, message: this.$t("请输入收货人") },
        ],
        receiver_phone: [
          {
            required: true,
            pattern: /^\d{5,20}$/,
            message: this.$t("请输入 5-20 位联系电话"),
          },
        ],
        detail: [
          { required: true, whitespace: true, message: this.$t("请输入详细地址") },
        ],
      };
    },
  },
  methods: {
    save() {
      if (this.saving) return;
      this.$refs.form.validate(async (valid) => {
        if (!valid || this.saving) return;
        if (this.region.length !== 3 || !this.region.every(Boolean)) {
          this.error = this.$t("请选择完整的省市区");
          return;
        }
        if (!this.token || this.token !== readingToken()) {
          this.error = this.$t("账号已切换，请刷新后重试");
          return;
        }
        const payload = {
          receiver_name: this.form.receiver_name.trim(),
          receiver_phone: this.form.receiver_phone.trim(),
          detail: this.form.detail.trim(),
          province: this.region[0],
          city: this.region[1],
          district: this.region[2],
          is_default: this.form.is_default ? 1 : 0,
        };
        this.saving = true;
        this.error = "";
        this.$emit("busy-change", true);
        try {
          const result = await store.saveAddress(
            this.address && this.address.address_id,
            payload
          );
          if (this.token !== readingToken()) return;
          const id =
            (this.address && this.address.address_id) || (result && result.address_id);
          if (!id) throw new Error(this.$t("地址保存结果异常，请刷新核对"));
          this.$emit("saved", { ...payload, address_id: id });
        } catch (error) {
          this.error = error.message;
        } finally {
          this.saving = false;
          this.$emit("busy-change", false);
        }
      });
    },
  },
};
</script>
<style scoped>
.address-editor .el-cascader {
  width: 100%;
}
.address-editor .el-alert {
  margin-top: 16px;
}
.address-contact-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 540px) {
  .address-contact-fields {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
