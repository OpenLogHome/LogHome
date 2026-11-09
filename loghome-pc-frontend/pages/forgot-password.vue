<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img style="width: 100px; margin-bottom: 20px;" src="~/assets/images/logo.png" alt="">
        <h1>{{ $t("auth.recovery.title") }}</h1>
        <p>{{ $t("auth.recovery.intro") }}</p>
      </div>

      <div class="forgot-body">
        <p class="step-line">{{ $t("auth.recovery.joinGroup") }}</p>
        <div class="bordered groups">
          <p class="group-title">{{ $t("auth.recovery.groupList") }}</p>
          <p>{{ $t("auth.recovery.userGroup") }}</p>
          <p>{{ $t("auth.recovery.clubGroup") }}</p>
        </div>
        <p class="step-line">{{ $t("auth.recovery.contactAdmin") }}</p>
        <p class="tip-line">{{ $t("auth.recovery.boundQQ") }}</p>
        <p class="tip-line">{{ $t("auth.recovery.proof") }}</p>
      </div>

      <button class="login-btn cancel-btn" @click="goBack">{{ $t("auth.recovery.back") }}</button>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'default',
  head() {
    return { title: `${this.$t("auth.recovery.title")} - ${this.$t("原木社区")}` }
  },
  methods: {
    goBack() {
      this.$router.push('/login')
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
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.login-header h1 {
  color: #947358;
  font-size: 28px;
  margin-bottom: 10px;
}

.login-header p {
  color: #666;
  font-size: 15px;
}

.forgot-body {
  color: #444;
  font-size: 15px;
  line-height: 1.8;
  margin-bottom: 24px;
}

.step-line { margin-bottom: 10px; }
.group-title { font-weight: bold; }
.tip-line { color: #777; font-size: 14px; margin-bottom: 6px; }

.bordered.groups {
  border: 1px solid #d9c8bc;
  border-radius: 6px;
  padding: 12px 16px;
  margin: 10px 0 14px;
  background: #faf7f4;
}

.login-btn {
  width: 100%;
  height: 50px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.cancel-btn {
  background-color: white;
  color: #947358;
  border: 1px solid #947358;
}

.cancel-btn:hover {
  background-color: #f9f9f9;
}
</style>
