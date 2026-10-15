<template>
  <Workspace :title="$t('消息推送设置')" active="/me/settings"
    ><div v-if="error" class="social-panel" role="alert">
      <el-alert :title="error" type="error" :closable="false" /><el-button
        @click="load"
        >{{ $t("重试") }}</el-button
      >
    </div>
    <el-skeleton v-if="loading" class="social-panel" :rows="5" animated /><template v-else
      ><section class="social-panel">
        <h2>{{ $t("QQ 推送绑定") }}</h2>
        <p class="social-muted">
          {{
            $t(
              "将绑定码发送给原木社区 QQ\n        推送服务，绑定后可接收社区消息。绑定码用于识别你的账号。"
            )
          }}
        </p>
        <div class="push-code">
          <strong>{{ code || $t("暂不可用") }}</strong
          ><el-button :disabled="!code" @click="copy">{{ $t("复制绑定码") }}</el-button
          ><el-button :loading="busy" @click="refreshCode">{{
            $t("刷新绑定码")
          }}</el-button>
        </div>
      </section>
      <section class="social-panel">
        <h2>{{ $t("接收设置") }}</h2>
        <el-form label-position="top"
          ><el-form-item :label="$t('消息推送')"
            ><el-switch
              v-model="enabled"
              :disabled="busy"
              :active-text="$t('启用 QQ 推送')"
              @change="changeEnabled" /></el-form-item
          ><el-form-item :label="$t('接收时间段')"
            ><div class="push-times">
              <el-time-picker
                v-model="start"
                value-format="HH:mm"
                format="HH:mm"
                :placeholder="$t('开始时间')"
              /><span>{{ $t("至") }}</span
              ><el-time-picker
                v-model="end"
                value-format="HH:mm"
                format="HH:mm"
                :placeholder="$t('结束时间')"
              />
            </div>
            <p v-if="end < start" class="social-muted">
              {{ $t("结束时间在次日，可跨午夜接收推送。") }}
            </p></el-form-item
          ><el-button
            type="primary"
            :loading="busy"
            :disabled="!start || !end"
            @click="saveTime"
            >{{ $t("保存时间段") }}</el-button
          ></el-form
        >
      </section></template
    ></Workspace
  >
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import { socialRequest } from "~/plugins/api/social";
import accountPage from "~/mixins/account-page";
const get = (path, params = {}) =>
  socialRequest(`/users/${path}`, params, "GET", null, true);
export default {
  components: { Workspace },
  mixins: [accountPage],
  data: () => ({
    code: "",
    start: "00:00",
    end: "23:59",
    enabled: false,
    loading: true,
    error: "",
    busy: false,
  }),
  methods: {
    async load() {
      this.loading = true;
      this.error = "";
      try {
        const [binding, status] = await Promise.all([
          get("get_binding_code"),
          get("push_status"),
        ]);
        this.code = binding.binding_code;
        this.start = binding.push_start_time || "00:00";
        this.end = binding.push_end_time || "23:59";
        this.enabled = Number(status[0] && status[0].push_set_status) === 1;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async copy() {
      try {
        await navigator.clipboard.writeText(this.code);
        this.$message.success(this.$t("绑定码已复制"));
      } catch (_) {
        this.$prompt(this.$t("复制绑定码"), this.$t("QQ 推送绑定"), {
          inputValue: this.code,
        }).catch(() => {});
      }
    },
    async refreshCode() {
      if (
        this.busy ||
        !(await this.confirmAction("刷新后旧绑定码将失效，确定刷新？", "刷新绑定码"))
      )
        return;
      this.busy = true;
      try {
        const result = await get("get_binding_code", { refresh: true });
        this.code = result.binding_code;
        this.$message.success(this.$t("绑定码已刷新"));
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.busy = false;
      }
    },
    async changeEnabled(value) {
      if (this.busy) return;
      this.busy = true;
      try {
        await get("push_set", { status: value ? 1 : 0 });
        this.$message.success(this.$t("推送状态已更新"));
      } catch (error) {
        this.enabled = !value;
        this.$message.error(error.message);
      } finally {
        this.busy = false;
      }
    },
    async saveTime() {
      if (this.busy || !this.start || !this.end) return;
      this.busy = true;
      try {
        await socialRequest(
          "/users/update_push_time",
          {},
          "POST",
          { start_time: this.start, end_time: this.end },
          true
        );
        this.$message.success(this.$t("推送时间已保存"));
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.busy = false;
      }
    },
  },
  head: () => ({ title: "消息推送设置 - 原木社区" }),
};
</script>
<style scoped>
.push-code,
.push-times {
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
}
.push-code strong {
  font-size: 26px;
  font-weight: 500;
  letter-spacing: 3px;
  color: var(--wood);
  margin-right: auto;
}
.push-times .el-date-editor {
  width: 190px;
}
</style>
