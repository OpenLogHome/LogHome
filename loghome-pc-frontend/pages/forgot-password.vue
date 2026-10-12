<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img style="width: 100px; margin-bottom: 20px;" src="~/assets/images/logo.png" alt="">
        <h1>找回密码</h1>
        <p>如果你忘记了密码，请通过以下渠道联系我们：</p>
      </div>

      <div class="forgot-body">
        <p class="step-line">1. 加入原木社区任意用户QQ群</p>
        <div class="bordered groups">
          <p class="group-title">原木社区用户群列表：</p>
          <p>原木社区用户交流群：644467605</p>
          <p>原木文社总群：464239748</p>
        </div>
        <p class="step-line">2. <strong>联系群内管理员</strong>，通过私聊发送恢复账号的请求。</p>
        <p class="tip-line">如果你的账号此前绑定过QQ号，请使用绑定的QQ号进行账号恢复，将更有可能成功恢复你的账号。</p>
        <p class="tip-line">否则，我们需要你提供账号的其他信息，来证明你确实是账号的主人。</p>
      </div>

      <button class="login-btn cancel-btn" @click="goBack">返回登录</button>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'default',
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
