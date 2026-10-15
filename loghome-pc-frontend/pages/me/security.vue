<template>
  <Workspace :title="$t('账号安全')" active="/me/settings"
    ><div v-if="error" class="social-panel" role="alert">
      <el-alert :title="error" type="error" :closable="false" />
    </div>
    <section class="social-panel" v-if="user.user_id">
      <h2>{{ $t("账号绑定") }}</h2>
      <dl class="binding-overview">
        <div>
          <dt>{{ $t("手机号") }}</dt>
          <dd>
            {{ user.mobile && user.mobile !== "unbind" ? user.mobile : $t("未绑定") }}
          </dd>
        </div>
        <div>
          <dt>{{ $t("QQ 账号") }}</dt>
          <dd>
            {{
              user.oicq_account && user.oicq_account !== "unbind"
                ? user.oicq_account
                : $t("未绑定")
            }}
          </dd>
        </div>
      </dl>
    </section>
    <section class="social-panel security-form">
      <h2>{{ $t("绑定邮箱") }}</h2>
      <p class="social-muted">
        {{
          $t("当前邮箱：{p0}", {
            p0: user.email && user.email !== "unbind" ? user.email : $t("未绑定"),
          })
        }}
      </p>
      <el-form
        ref="emailForm"
        :model="email"
        :rules="emailRules"
        label-position="top"
        @submit.native.prevent="bind"
        ><el-form-item prop="email" :label="$t('邮箱地址')"
          ><el-input
            v-model="email.email"
            autocomplete="email"
            type="email" /></el-form-item
        ><el-form-item prop="code" :label="$t('验证码')"
          ><div class="email-code-row">
            <el-input
              v-model="email.code"
              autocomplete="one-time-code"
              maxlength="10"
            /><el-button :loading="sending" :disabled="cooldown > 0" @click="sendCode">{{
              cooldown > 0 ? $t("{p0} 秒后重发", { p0: cooldown }) : $t("发送验证码")
            }}</el-button>
          </div></el-form-item
        ><el-button type="primary" native-type="submit" :loading="binding">{{
          $t("绑定邮箱")
        }}</el-button></el-form
      >
    </section>
    <section class="social-panel security-form">
      <h2>{{ $t("修改密码") }}</h2>
      <el-form
        ref="passwordForm"
        :model="password"
        :rules="passwordRules"
        label-position="top"
        @submit.native.prevent="changePassword"
        ><el-form-item prop="password" :label="$t('当前密码')"
          ><el-input
            v-model="password.password"
            type="password"
            show-password
            autocomplete="current-password" /></el-form-item
        ><el-form-item prop="newPwd" :label="$t('新密码')"
          ><el-input
            v-model="password.newPwd"
            type="password"
            show-password
            autocomplete="new-password"
            :placeholder="$t('6-20 位字母、数字或下划线')" /></el-form-item
        ><el-form-item prop="confirm" :label="$t('再次输入新密码')"
          ><el-input
            v-model="password.confirm"
            type="password"
            show-password
            autocomplete="new-password" /></el-form-item
        ><el-button type="primary" native-type="submit" :loading="changing">{{
          $t("保存密码")
        }}</el-button></el-form
      >
      <p class="social-muted">{{ $t("密码修改成功后需要重新登录。") }}</p>
    </section></Workspace
  >
</template>
<script>
import Workspace from "~/components/social/Workspace.vue";
import account from "~/plugins/api/account";
import { socialRequest } from "~/plugins/api/social";
import accountPage from "~/mixins/account-page";
export default {
  components: { Workspace },
  mixins: [accountPage],
  data() {
    return {
      user: {},
      error: "",
      email: { email: "", code: "" },
      password: { password: "", newPwd: "", confirm: "" },
      sending: false,
      binding: false,
      changing: false,
      cooldown: 0,
      timer: null,
      emailRules: {
        email: [
          {
            required: true,
            type: "email",
            message: this.$t("请输入有效的邮箱地址"),
            trigger: "blur",
          },
        ],
        code: [{ required: true, message: this.$t("请输入验证码"), trigger: "blur" }],
      },
      passwordRules: {
        password: [{ required: true, message: this.$t("请输入当前密码") }],
        newPwd: [
          {
            required: true,
            pattern: /^\w{6,20}$/,
            message: this.$t("密码需要 6-20 位字母、数字或下划线"),
          },
        ],
        confirm: [
          {
            validator: (rule, value, callback) =>
              callback(
                value === this.password.newPwd
                  ? undefined
                  : new Error(this.$t("两次输入的密码不一致"))
              ),
            trigger: "blur",
          },
        ],
      },
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    async load() {
      try {
        this.user = await account.profile();
      } catch (error) {
        this.error = error.message;
      }
    },
    sendCode() {
      if (this.sending || this.cooldown) return;
      this.$refs.emailForm.validateField("email", async (error) => {
        if (error) return;
        this.sending = true;
        this.error = "";
        try {
          await socialRequest(
            "/users/send_bind_email_code",
            { email: this.email.email },
            "GET",
            null,
            true
          );
          this.$message.success(this.$t("验证码已发送"));
          this.cooldown = 60;
          this.timer = setInterval(() => {
            this.cooldown--;
            if (!this.cooldown) clearInterval(this.timer);
          }, 1000);
        } catch (error) {
          this.error = error.message;
        } finally {
          this.sending = false;
        }
      });
    },
    bind() {
      if (this.binding) return;
      this.$refs.emailForm.validate(async (valid) => {
        if (!valid) return;
        this.binding = true;
        this.error = "";
        try {
          await socialRequest("/users/verify_bind_email", {}, "POST", this.email, true);
          this.$message.success(this.$t("邮箱已绑定"));
          this.email.code = "";
          await this.load();
        } catch (error) {
          this.error = error.message;
        } finally {
          this.binding = false;
        }
      });
    },
    changePassword() {
      if (this.changing) return;
      this.$refs.passwordForm.validate(async (valid) => {
        if (!valid) return;
        this.changing = true;
        this.error = "";
        try {
          await socialRequest(
            "/users/change_pwd",
            {},
            "POST",
            { password: this.password.password, newPwd: this.password.newPwd },
            true
          );
          localStorage.removeItem("token");
          localStorage.removeItem("LogHomeUserInfo");
          this.$message.success(this.$t("密码已修改，请重新登录"));
          this.$router.replace("/login");
        } catch (error) {
          this.error = error.message;
        } finally {
          this.changing = false;
        }
      });
    },
  },
  head: () => ({ title: "账号安全 - 原木社区" }),
};
</script>
<style scoped>
.security-form {
  max-width: 760px;
}
.email-code-row {
  display: flex;
  gap: 12px;
}
</style>

<style scoped>
.binding-overview {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}
.binding-overview div {
  display: flex;
  gap: 16px;
}
.binding-overview dt {
  color: var(--muted, #776a5d);
}
.binding-overview dd {
  margin: 0;
}
</style>
