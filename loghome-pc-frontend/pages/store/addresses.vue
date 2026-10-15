<template>
  <Workspace :title="$t('收货地址')" active="/me"
    ><template #actions
      ><el-button v-if="$route.query.returnTo" @click="back">{{ $t("返回") }}</el-button
      ><el-button type="primary" icon="el-icon-plus" @click="edit()">{{
        $t("新增地址")
      }}</el-button></template
    >
    <div v-if="error" class="social-panel social-state" role="alert">
      {{ error }}<br /><el-button @click="load">{{ $t("重试") }}</el-button>
    </div>
    <el-skeleton v-else-if="loading" class="social-panel" :rows="5" animated />
    <div v-else class="social-card-grid">
      <article
        v-for="address in addresses"
        :key="address.address_id"
        class="social-panel address-card"
      >
        <header>
          <strong>{{ address.receiver_name }}</strong
          ><span>{{ address.receiver_phone }}</span
          ><el-tag v-if="address.is_default" size="mini">{{ $t("默认") }}</el-tag>
        </header>
        <p>
          {{ address.province }}{{ address.city }}{{ address.district }}<br />{{
            address.detail
          }}
        </p>
        <footer>
          <el-button size="small" :disabled="busy" @click="edit(address)">{{
            $t("编辑")
          }}</el-button
          ><el-button
            v-if="!address.is_default"
            size="small"
            :disabled="busy"
            @click="makeDefault(address)"
            >{{ $t("设为默认") }}</el-button
          ><el-button type="text" :disabled="busy" @click="remove(address)">{{
            $t("删除")
          }}</el-button>
        </footer>
      </article>
    </div>
    <div v-if="!loading && !error && !addresses.length" class="social-panel social-state">
      <i class="el-icon-location-outline" />{{ $t("还没有收货地址") }}<br /><el-button
        type="primary"
        @click="edit()"
        >{{ $t("添加收货地址") }}</el-button
      >
    </div>
    <el-dialog
      :title="editingId ? $t('编辑收货地址') : $t('新增收货地址')"
      :visible.sync="dialog"
      width="min(620px, 94vw)"
      :close-on-click-modal="false"
      :before-close="closeEditor"
      ><AddressEditor
        v-if="dialog"
        ref="addressEditor"
        :address="editingAddress"
        @busy-change="busy = $event"
        @saved="addressSaved"
      />
      <template #footer
        ><el-button :disabled="busy" @click="closeEditor()">{{ $t("取消") }}</el-button
        ><el-button type="primary" :loading="busy" @click="save">{{
          $t("保存地址")
        }}</el-button></template
      ></el-dialog
    ></Workspace
  >
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import store from "~/plugins/api/store";
import accountPage from "~/mixins/account-page";
import AddressEditor from "~/components/social/AddressEditor.vue";
import { loginReturnPath } from "~/utils/login-return";
export default {
  components: { Workspace, AddressEditor },
  mixins: [accountPage],
  data: () => ({
    addresses: [],
    loading: true,
    error: "",
    busy: false,
    dialog: false,
    editingId: null,
    editingAddress: null,
  }),
  methods: {
    back() {
      this.$router.push(
        this.$route.query.returnTo
          ? loginReturnPath(this.$route.query.returnTo)
          : "/store"
      );
    },
    async load() {
      this.loading = true;
      this.error = "";
      try {
        this.addresses = await store.addresses();
        if (this.$route.query.edit && !this.dialog) {
          const saved = this.addresses.find(
            (item) => String(item.address_id) === String(this.$route.query.edit)
          );
          if (saved) this.edit(saved);
          else this.$message.warning(this.$t("该收货地址不存在"));
        } else if (this.$route.query.new === "1" && !this.dialog) this.edit();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    edit(address) {
      this.editingId = address ? address.address_id : null;
      this.editingAddress = address || null;
      this.dialog = true;
    },
    save() {
      this.$refs.addressEditor.save();
    },
    closeEditor(done) {
      if (this.busy) return;
      this.dialog = false;
      if (done) done();
    },
    async addressSaved() {
      this.dialog = false;
      this.$message.success(this.$t("地址已保存"));
      await this.load();
    },
    async makeDefault(address) {
      if (this.busy) return;
      this.busy = true;
      try {
        await store.defaultAddress(address.address_id);
        await this.load();
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.busy = false;
      }
    },
    async remove(address) {
      if (
        this.busy ||
        !(await this.confirmAction(
          `确定删除 ${address.receiver_name} 的收货地址？`,
          "删除地址"
        ))
      )
        return;
      this.busy = true;
      try {
        await store.deleteAddress(address.address_id);
        await this.load();
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.busy = false;
      }
    },
  },
  head: () => ({ title: "收货地址 - 原木商城" }),
};
</script>
<style scoped>
.address-card header {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.address-card header span {
  font-size: 13px;
  color: var(--muted, #82766c);
}
.address-card p {
  font-size: 14px;
  line-height: 1.9;
  color: var(--muted, #766858);
  margin: 18px 0;
}
.address-card footer {
  display: flex;
  gap: 8px;
}
.address-card footer .el-button {
  margin: 0;
}
.el-alert {
  margin-top: 16px;
}
</style>
