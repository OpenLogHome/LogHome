<template>
	<view class="page-body no-user-select">
		<view class="login-view">
			<image class="image" :src="vk.getVuex('$app.staticUrl.navBar.logo')" mode="aspectFit"></image>
			<text class="login-title">欢迎登录</text>

			<el-form :model="form1" status-icon :rules="rules" ref="form1" label-width="60px" class="form-view">
				<el-form-item label="账 号" prop="pass" class="form-item"><el-input class="input" type="text" v-model="form1.username" placeholder="请输入用户名"></el-input></el-form-item>
				<el-form-item label="密 码" prop="checkPass" class="form-item">
					<el-input class="input" type="password" v-model="form1.password" show-password placeholder="请输入密码" maxlength="20"></el-input>
				</el-form-item>
				<view class="password-box">
					<view class="remember-password">
						<el-checkbox v-model="checked"><text class="tips" style="font-size: 12px;">记住密码</text></el-checkbox>
					</view>
					<view class="forget-password"><text @click="forgetPassWord" style="font-size: 12px;">忘记密码？</text></view>
				</view>
				<el-button class="login_but" type="primary" @click="submit">登录</el-button>
			</el-form>

			<view v-if="testUser && testUser.show && testUser.list && testUser.list.length > 0" class="test-user-list">
				<view>体验账号：</view>
				<view v-for="(item, index) in testUser.list" :key="index" class="test-user-item">
					<text class="test-user-item-nickname">{{ item.nickname }}</text>
					<text class="test-user-item-username">账号：{{ item.username }}</text>
					<text class="test-user-item-password">密码：{{ item.password }}</text>
				</view>
			</view>

			<!-- <view class="btns-box">
				<text @click="shortMessageLogin">短信验证码登录</text>
				<text @click="noCccount">没有账号？</text>
				<text class="register" @click="register">立即注册</text>
			</view> -->

		</view>
	</view>
</template>

<script>
var that; // 当前页面对象
var vk = uni.vk; // vk实例

import config from "@/app.config.js";
export default {
	data() {
		return {
			...config.staticUrl.navBar,
			testUser: (config.login && config.login.testUser) || {}, // 体验账号信息
			// 表单信息
			form1: {
				username: "",
				password: "",
				needPermission: true
			},
			checked: false, // 是否记录密码
			// 表单验证规则
			rules: {

			},
		};
	},
	// 监听 - 页面每次【加载时】执行(如：前进)
	onLoad(options = {}) {
		that = this;
		vk = that.vk;
		that.options = options;
		that.init(options);
	},
	mounted() {},
	methods: {
		// 页面初始化
		init() {
			let that = this;
			let { login } = vk.getVuex("$user");
			if (login) {
				if (login.username) that.form1.username = login.username;
				if (login.password) {
					that.form1.password = login.password;
					that.checked = true;
				}
			}
			if (!getApp().isAllowLoginBackground()) {
				return false;
			}
			// 执行以下函数,主要是为了使云函数提前热启动
			vk.userCenter.checkToken({
				loading: true,
				success: data => {
					that.login_success(data);
				}
			});
		},
		// 表单提交
		submit() {
			console.log(this.form1);
			let that = this;
			vk.userCenter.login({
				data: that.form1,
				success: data => {
					if (!getApp().isAllowLoginBackground(data.userInfo)) {
						vk.alert("您的账户无登陆权限");
						return false;
					}
					if (that.checked) {
						// 账号密码保存本地缓存
						vk.setVuex("$user.login.username", that.form1.username);
						vk.setVuex("$user.login.password", that.form1.password);
					} else {
						// 删除本地缓存
						vk.setVuex("$user.login.username", "");
						vk.setVuex("$user.login.password", "");
					}
					that.login_success(data);
				}
			});
		},
		//登陆成功
		login_success(data={}) {
			let { userInfo={} } = data;
			// 先清空下菜单缓存
			vk.setVuex("$app.inited", false);
			vk.setVuex("$app.navMenu", []);
			// 再执行init函数
			getApp().init();
			// 检查是否有指定跳转的页面
			if (this.options.uniIdRedirectUrl) {
				let uniIdRedirectUrl = decodeURIComponent(this.options.uniIdRedirectUrl);
				if (uniIdRedirectUrl) {
					vk.redirectTo(uniIdRedirectUrl);
					return;
				}
			}
			// 最后跳转到首页或页面返回
			let pages = getCurrentPages();
			if (
				pages.length >= 2 &&
				pages[pages.length - 2] &&
				pages[pages.length - 2].route &&
				pages[pages.length - 2].route.indexOf("login/") == -1
			) {
				// 如果上一个页面不是login目录下的，则调上一个页面
				vk.reLaunch("/" + pages[pages.length - 2].route);
			} else {
				// 否则进入首页
				vk.navigateToHome();
			}
		},
		forgetPassWord() {
			console.log(`忘记密码了`);
			vk.toast("暂不支持", "none");
		},
		shortMessageLogin() {
			console.log(`短信登录`);
		},
		noCccount() {
			console.log(`没有账号`);
		},
		register() {
			console.log(`立即注册`);
			vk.toast("暂不支持注册", "none");
		}
	}
};
</script>

<style lang="scss" scoped>
.page-body {
	width: 100%;
	height: 100vh;
	background: #46d0e7 url(../../static/bg/007.jpg?t=2) no-repeat fixed center center;
	background-size: cover;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	.login-view:hover {
		background-color: rgba(255, 255, 255, 1);
	}
	.login-view {
		width: 100%;
		max-width: 420px;
		border-radius: 7px;
		background-color: rgba(255, 255, 255, 0.97);
		padding: 40px 30px;
		box-sizing: border-box;
		border: 1px solid #f5f5f5;
		box-shadow: 6px 6px 10px 0px #888888;

		::v-deep .input .el-input__inner {
			border: 0 !important;
			background-color: rgba(255, 255, 255, 0);
		}
		.image {
			display: block;
			width: 64px;
			height: 64px;
			margin: 0 auto;
			margin-bottom: 15px;
			border-radius: 6px;
		}
		.form-view {
			margin-top: 20px;
			.form-item {
				border-bottom: 1px solid #f5f5f5;
			}
		}
		.login-title {
			display: block;
			text-align: center;
			color: #121212;
			font-size: 22px;
			letter-spacing: 2px;
		}
		.login_but {
			width: 100%;
			letter-spacing: 4px;
			font-size: 17px;
		}
		.password-box {
			font-size: 13px;
			color: #b1b1b1;
			margin-bottom: 20px;
			display: flex;
			align-items: center;
			.remember-password {
				flex: 1;
				cursor: pointer;
				user-select: none;
			}
			.forget-password {
				flex: 1;
				text-align: right;
				cursor: pointer;
				user-select: none;
				&:active {
					color: #3a6ffd;
				}
			}
		}
		.tips {
			color: #b1b1b1;
		}
		.btns-box {
			font-size: 13px;
			color: #b1b1b1;
			padding-top: 25px;
			display: flex;
			box-sizing: border-box;

			text {
				cursor: pointer;

				&:first-of-type {
					flex: 1;
				}

				&:nth-of-type(2) {
					margin-right: 8px;
				}
			}
			.register {
				color: #46d0e7;
			}
		}
	}
	.test-user-list {
		margin-top: 10px;
		user-select: text;
		font-size: 12px;
		color: #606266;
		.test-user-item {
			margin: 5px 0;
			.test-user-item-nickname {
			}
			.test-user-item-username {
				margin-left: 10px;
			}
			.test-user-item-password {
				margin-left: 10px;
			}
		}
	}
}
</style>
