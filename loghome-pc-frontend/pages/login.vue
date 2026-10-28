<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img style="width: 100px; margin-bottom: 20px;" src="~/assets/images/logo.png" alt="">
        <h1>{{ $t("原木社区") }}</h1>
        <p>{{ $t("auth.brand.tagline") }}</p>
      </div>
      
      <!-- 步骤0：输入邮箱 -->
      <div v-if="step == 0" class="login-step">
        <p class="step-tip">{{ $t("auth.login.unregisteredEmail") }}</p>
        <div class="input-group">
          <div class="input-icon">
            <img src="~/assets/images/icon_user.png" :alt="$t('auth.fields.user')" class="icon">
          </div>
          <input type="email" :placeholder="$t('auth.fields.email')" v-model="email" class="login-input">
        </div>
        <button class="login-btn" @click="nextStep()">{{ $t("common.actions.next") }}</button>
        <nuxt-link to="/forgot-password" class="forgot-link">{{ $t("auth.login.forgotPassword") }}</nuxt-link>
      </div>

      <!-- 步骤1：滑动验证 -->
      <transition name="fade">
        <div v-if="step == 1" class="login-step">
          <p class="step-tip">{{ $t("auth.login.sendCodeTo", { email }) }}</p>
          <div class="verify-container">
            <slide-verify
              :w="380"
              :slider-text="$t('auth.verify.slide')"
              @success="verifyResult"
            ></slide-verify>
          </div>
          <button class="login-btn cancel-btn" @click="step = 0">{{ $t("common.actions.previous") }}</button>
        </div>
      </transition>
      
      <!-- 步骤2：输入验证码 -->
      <transition name="fade">
        <div v-if="step == 2" class="login-step">
          <div class="verify-info">
            <div>
              <div>{{ $t("auth.login.codeSentTo") }}</div>
              <div>{{email}}</div>
            </div>
            <div>
              <span class="resend-btn" v-show="!isWaiting" @click="sendCode">{{ $t("auth.login.resend") }}</span>
              <span class="wait-timer" v-show="isWaiting">{{ $t("auth.login.waitSeconds", { seconds: waitTime }) }}</span>
            </div>
          </div>
          <div class="input-group">
            <div class="input-icon">
              <img src="~/assets/images/icon_password.png" :alt="$t('auth.fields.code')" class="icon">
            </div>
            <input type="text" :placeholder="$t('auth.fields.codePlaceholder')" v-model="verifyCode" class="login-input">
          </div>
          <button class="login-btn" @click="nextStep()">{{ $t("common.actions.next") }}</button>
          <button class="login-btn cancel-btn" @click="step = 0">{{ $t("common.actions.previous") }}</button>
        </div>
      </transition>
      
      <!-- 步骤3：设置账号和密码 -->
      <transition name="fade">
        <div v-if="step == 3" class="login-step">
          <p class="step-tip">{{ $t("auth.login.welcome") }}</p>
          <div class="input-group">
            <div class="input-icon">
              <img src="~/assets/images/icon_user.png" :alt="$t('auth.fields.user')" class="icon">
            </div>
            <input type="text" :placeholder="$t('auth.fields.account')" v-model="account" @input="checkAccount" class="login-input">
          </div>
          <div class="warning-text" v-show="accountUsed">{{ $t("auth.login.accountUsed") }}</div>
          
          <div class="input-group">
            <div class="input-icon">
              <img src="~/assets/images/icon_password.png" :alt="$t('auth.fields.password')" class="icon">
            </div>
            <input type="password" :placeholder="$t('auth.fields.passwordPlaceholder')" v-model="pwd" class="login-input">
          </div>
          
          <button class="login-btn" @click="nextStep()">{{ $t("common.actions.next") }}</button>
          <button class="login-btn cancel-btn" @click="step = 0">{{ $t("common.actions.previous") }}</button>
        </div>
      </transition>
      
      <!-- 步骤5：已有账号登录 -->
      <transition name="fade">
        <div v-if="step == 5" class="login-step">
          <div class="verify-info">
            <div>
              <div>{{ $t("auth.login.withEmail") }}</div>
              <div>{{email}}</div>
            </div>
          </div>
          
          <div class="input-group">
            <div class="input-icon">
              <img src="~/assets/images/icon_password.png" :alt="$t('auth.fields.password')" class="icon">
            </div>
            <input type="password" :placeholder="$t('auth.fields.passwordPlaceholder')" v-model="pwd" class="login-input">
          </div>
          
          <button class="login-btn" @click="nextStep()">{{ $t("登录") }}</button>
          <nuxt-link to="/forgot-password" class="forgot-link">{{ $t("auth.login.forgotPassword") }}</nuxt-link>
          <button class="login-btn cancel-btn" @click="step = 0">{{ $t("common.actions.previous") }}</button>
        </div>
      </transition>
      
      <div class="login-footer">
        <p>{{ $t("auth.login.agreement") }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import SlideVerify from '~/components/SlideVerify.vue'
import { loginReturnPath } from '~/utils/login-return'

export default {
  layout: 'default',
  head() {
    return { title: `${this.$t("登录")} - ${this.$t("原木社区")}` }
  },
  components: {
    SlideVerify
  },
  data() {
    return {
      step: 0,
      //0：待输入邮箱 1：新用户注册，滑动验证码 2：填写验证码 3：新用户注册，填写账号和密码 5：老用户登录，填写密码
      account: "",
      email: "",
      pwd: "",
      verifyCode: "",
      verifyState: false,
      isWaiting: false,
      waitTime: 60,
      waitTimer: undefined,
      accountUsed: false,
      registerVerify: "",
    }
  },
  methods: {
    async checkAccount() {
      try {
        this.accountUsed = await this.$api.users.checkAccount(this.account);
      } catch (error) {
        this.$message.error(error.message || this.$t("common.errors.requestFailed"));
      }
    },
    verifyResult(res) {
      this.step = 2;
      this.verifyState = true;
      this.sendCode();
    },
    async nextStep() {
      switch (this.step) {
        case 0:
          // 验证邮箱格式
          const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailPattern.test(this.email)) {
            this.$message.error(this.$t("auth.validation.email"));
            return;
          }
          
          try {
            const emailExists = await this.$api.users.checkEmail(this.email);
            if (emailExists) {
              this.step = 5;
            } else {
              this.step = 1;
            }
          } catch (error) {
            console.error(error);
            this.$message.error(error.message || this.$t("auth.messages.checkEmailFailed"));
          }
          break;
        
        case 2:
          try {
            const result = await this.$api.users.registerWithEmail(this.email, this.verifyCode);
            if (result && result.register_code) {
              this.registerVerify = result.register_code;
              this.step = 3;
            } else {
              this.$message.error((result && result.msg) || this.$t("auth.messages.codeFailed"));
            }
          } catch (error) {
            this.$message.error(error.message || this.$t("auth.messages.codeFailed"));
          }
          break;
        
        case 3:
          this.register();
          break;
        
        case 5:
          this.login();
          break;
      }
    },
    async sendCode() {
      try {
        const response = await this.$api.users.sendEmailVerifyCode(this.email);
        this.$message.success((response && response.msg) || this.$t("auth.messages.codeSent"));
        this.waitTime = 60;
        this.isWaiting = true;
        this.waitTimer = setInterval(() => {
          this.waitTime--;
          if (this.waitTime == 0) {
            this.isWaiting = false;
            clearInterval(this.waitTimer);
            this.waitTimer = undefined;
          }
        }, 1000);
      } catch (error) {
        console.error(error);
        this.$message.error(error.message || this.$t("auth.messages.sendCodeFailed"));
      }
    },
    async login() {
      try {
        await this.$api.users.login(this.email, this.pwd);
        this.$message.success(this.$t("auth.messages.loginSuccess"));
        this.$router.push(loginReturnPath(this.$route.query.redirect));
      } catch (error) {
        console.error(error);
        this.$message.error(this.$t("auth.messages.loginFailed"));
        this.pwd = "";
      }
    },
    //校验密码：只能输入6-20个字母、数字、下划线
    isPasswd(s) {
      var patrn = /^(\w){6,20}$/;
      if (!patrn.exec(s)) return false;
      return true;
    },
    async register() {
      if (this.pwd == "") {
        this.$message.error(this.$t("auth.validation.passwordRequired"));
        return;
      }
      if (this.isPasswd(this.pwd) != true) {
        this.$message.error(this.$t("auth.validation.passwordFormat"));
        return;
      }
      //账号格式4-12位字母数字
      let accountPattern = /^[a-zA-Z0-9]{4,12}$/;
      if (!accountPattern.test(this.account)) {
        this.$message.error(this.$t("auth.validation.accountFormat"));
        return;
      }
      
      try {
        await this.$api.users.register(
          this.account, 
          this.pwd, 
          this.email, 
          this.registerVerify
        );
        
        this.$message.success(this.$t("auth.messages.loginSuccess"));
        this.$router.push('/');
      } catch (error) {
        this.$message.error(error.message || this.$t("auth.messages.registerFailed"));
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.login-box {
  width: 460px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 40px;
  position: relative;
  overflow: hidden; /* 防止内容溢出 */
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  color: #947358;
  font-size: 32px;
  margin-bottom: 10px;
}

.login-header p {
  color: #666;
  font-size: 16px;
}

.login-step {
  height: 280px;
  position: absolute;
  width: calc(100% - 80px); /* 减去左右padding */
  transition: opacity 0.3s, transform 0.3s;
}

.step-tip {
  color: #333;
  margin-bottom: 20px;
  font-size: 16px;
}

.input-group {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f5f5f5;
  margin-bottom: 20px;
  height: 50px;
}

.input-icon {
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon {
  width: 35px;
  height: 35px;
}

.login-input {
  flex: 1;
  height: 48px;
  border: none;
  background-color: #f5f5f5;
  padding: 0 15px;
  font-size: 16px;
}

.login-input:focus {
  outline: none;
}

.warning-text {
  color: #ff5500;
  font-size: 14px;
  text-align: right;
  margin-top: -15px;
  margin-bottom: 15px;
}

.login-btn {
  width: 100%;
  height: 50px;
  background-color: #947358;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 15px;
  transition: background-color 0.3s;
}

.login-btn:hover {
  background-color: #826347;
}

.cancel-btn {
  background-color: white;
  color: #947358;
  border: 1px solid #947358;
}

.cancel-btn:hover {
  background-color: #f9f9f9;
}

.forgot-link {
  display: block;
  text-align: right;
  color: #947358;
  font-size: 14px;
  margin: -6px 0 12px;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.verify-container {
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

.slide-verify-placeholder {
  width: 100%;
  height: 155px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  color: #999;
}

.verify-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  color: #333;
}

.resend-btn {
  color: #947358;
  cursor: pointer;
}

.wait-timer {
  color: #999;
}

.login-footer {
  text-align: center;
  margin-top: 320px; /* 增加底部空间，确保有足够空间容纳步骤div */
  color: #999;
  font-size: 14px;
}

/* 过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s;
  position: absolute;
  width: calc(100% - 80px);
}

.fade-enter {
  transform: translateX(20px);
  opacity: 0;
}

.fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
