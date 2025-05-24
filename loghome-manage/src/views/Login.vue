<template>
    <div class="outer">
        <div class="color"></div>
        <div class="color"></div>
        <div class="color"></div>
        <div class="box">
            <div class="circle" style="--i:0"></div>
            <div class="circle" style="--i:1"></div>
            <div class="circle" style="--i:2"></div>
            <div class="circle" style="--i:3"></div>
            <div class="circle" style="--i:4"></div>
            <div class="container">
                <div class="form">
                    <h2>原木通行证登录</h2>
                    <form>
                        <div class="inputbox">
                            <input type="text" placeholder="邮箱" v-model="account">
                        </div>
                        <div class="inputbox">
                            <input type="password" placeholder="密码" v-model="pwd">
                        </div>
                        <div class="inputbox submit">
                            <input type="button" value="登录" @click="login">
                        </div>
                        <p class="forget">
                            <a href="#">返回原木社区</a>
                        </p>
                        <!-- <p class="forget">没有账号？
                            <a href="#">点击注册</a>
                        </p> -->
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
export default{
    data(){
        return{
            account:"",
            pwd:""
        }

    },
    methods:{
        login(){
            const loading = this.$loading({
                lock: true,
                text: '登录中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            let _this = this;
            this.axios.post(this.$baseUrl + '/users/login', {
                username: this.account,
                password: this.pwd
            })
            .then(function (response) {
                window.localStorage.setItem('token', JSON.stringify(response.data.token));
                _this.$router.push({name:"仪表盘"})
            })
            .catch(function (error) {
                //console.log(error);
                if(error) {
                    _this.$message({
                        showClose: true,
                        message: '账号或密码错误',
                        type: 'error'
                    });
                }
            }).then(function(){
                loading.close();
            })
		},
    }
}
</script>


<style lang="scss" scoped>
.outer {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.outer {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    background: linear-gradient(to bottom, #f5f7fa, #e4edf5);
}

.outer .color {
    position: absolute;
    filter: blur(200px);
}

.outer .color:nth-child(1) {
    top: -350px;
    width: 600px;
    height: 600px;
    background: #3a506b;
}

.outer .color:nth-child(2) {
    bottom: -150px;
    left: 100px;
    width: 500px;
    height: 600px;
    background: #5b7da0;
}

.outer .color:nth-child(3) {
    bottom: -150px;
    right: 100px;
    width: 500px;
    height: 500px;
    background: #1c2541;
}

.box {
    position: relative;
}

.box .circle {
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    filter: hue-rotate(calc(var(--i)*80deg));
    animation: run 10s linear infinite;
    animation-delay: calc(var(--i)*-2s);
}

@keyframes run {

    from,
    to {
        transform: translateY(-50px);
    }

    50% {
        transform: translateY(50px);
    }
}

.box .circle:nth-child(1) {
    border-radius: 50%;
    top: -50px;
    right: -60px;
    width: 100px;
    height: 100px;
}

.box .circle:nth-child(2) {
    border-radius: 50%;
    top: 200px;
    left: -100px;
    width: 120px;
    height: 120px;
    z-index: 2;
}

.box .circle:nth-child(3) {
    border-radius: 50%;
    bottom: 50px;
    right: -60px;
    width: 80px;
    height: 80px;
    z-index: 2;
}

.box .circle:nth-child(4) {
    border-radius: 50%;
    bottom: -50px;
    right: 200px;
    width: 80px;
    height: 80px;
}

.box .circle:nth-child(5) {
    border-radius: 50%;
    top: -80px;
    left: 140px;
    width: 60px;
    height: 60px;
}




.container {
    position: relative;
    width: 400px;
    min-height: 400px;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 8px;
}

.form {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 50px;
}

.form h2 {
    position: relative;
    color: #1c2541;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 2px;
    margin-bottom: 30px;
    cursor: pointer;
    text-align: center;
}

.form h2::before {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 0px;
    height: 2px;
    background-color: #1c2541;
    transition: 0.5s;
}

.form h2:hover:before {
    width: 100px;
}

.form .inputbox {
    width: 90%;
    margin-top: 20px;
}

.form .inputbox input {
    width: 100%;
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.5);
    border: none;
    outline: none;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 16px;
    letter-spacing: 1px;
    color: #333;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form .inputbox.submit input{
    background-color: #1c2541;
    color: white;
    font-weight: 500;
    width: 150px;
    margin-bottom: 25px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.form .inputbox.submit input:hover {
    background-color: #2c3e50;
}

.form .inputbox input::placeholder {
    color: #666;
}

.forget {
    margin-top: 5px;
    color: #1c2541;
    letter-spacing: 1px;
    text-align: center;
}

.forget a {
    font-weight: 600;
    text-decoration: none;
    color: #3a506b;
    transition: color 0.3s ease;
}

.forget a:hover {
    color: #5b7da0;
}
</style>