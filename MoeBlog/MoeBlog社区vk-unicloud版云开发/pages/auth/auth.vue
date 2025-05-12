<template>
	<view class="auth">
		<view class="back" @click="Toindex">
			<view class="back-ctx">
				<uni-icons type="left" size="22"></uni-icons>
			</view>
		</view>
		<view class="auth-ctx">
			<view class="bj">
				<image mode="aspectFill" src="https://img.dashi109.top/imgs/7540e126-8977-40bb-b78a-fc9fecde0c5a.png">
				</image>
			</view>
			<view class="login">
				<view class="login-ctx">
					<view class="login-H">
					</view>
					<view class="form">
						<view class="form-ctx">
							<view class="item1">
								自动登录中
							</view>
							<view class="form-item" @click="Toindex">
								<button>取消</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from "vue"
import { getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();

proxy.$framePostman.send({ type: 'LOGIN_NEEDED' });

function Toindex() {
	//返回首页
	vk.navigateTo('/pages/index/index');
}
</script>

<style lang="scss">
.auth {
	.back {
		position: fixed;
		top: 120rpx;
		/* #ifdef MP */
		top: 60rpx;
		/* #endif */
		left: 50rpx;

		.back-ctx {
			background: #FFFFFF;
			border-radius: 50%;
			padding: 10rpx;
		}
	}

	.auth-ctx {
		.bj {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: -1;

			image {
				height: 100vh;
				width: 100vw;
			}
		}

		.login {
			.login-ctx {
				.login-H {
					height: 450rpx;
					width: 100%;
					@include flex-center;

					image {
						height: 130rpx;
						width: 130rpx;
						border-radius: 50%;
					}
				}

				.form {
					padding: 0 50rpx;

					.form-ctx {
						height: fit-content;
						width: 100%;
						padding: 50rpx;
						background: rgba(255, 255, 255, 0.5);
						backdrop-filter: blur(10rpx);
						border-radius: 35rpx;

						.item1 {
							@include flex-center;
							font-size: 35rpx;
							font-weight: 550;
						}

						.form-item {
							margin: 30rpx 0;
							@include flex;
							padding: 0 25rpx;

							button {
								background: rgba(0, 0, 0, 0.9);
								color: #fff;
								width: fit-content;
								padding: 0 200rpx;
								font-size: 28rpx;
								font-weight: 550;
								border-radius: 45rpx;
							}
						}
					}
				}
			}
		}

		.reg {}

		.wxlogin {
			.wxlogin-C {
				padding: 200rpx 25rpx;

				.wxlogin-H {
					@include flex;
					flex-direction: column;
					background: rgba(255, 255, 255, 0.5);
					backdrop-filter: blur(10rpx);
					border-radius: 35rpx;
					margin: 50rpx 0;

					.wxlogin-I {
						margin: 25rpx 0;
						@include flex;

						image {
							width: 180rpx;
							height: 180rpx;
							border-radius: 50%;
						}

						button {
							background: #07C160;
							color: #fff;
							width: fit-content;
							padding: 8rpx 200rpx;
							font-size: 28rpx;
							font-weight: 550;
							border-radius: 45rpx;
						}
					}

					.name {
						font-size: 50rpx;
						font-weight: 550;
					}

					.desc {
						padding: 25rpx 50rpx;
						text-align: center;
						font-size: 32rpx;
						color: #424242;
					}

					.xy {
						font-size: 22rpx;
						display: flex;
						align-items: center;
					}

					.btm {
						.btm-I {
							padding: 0 50rpx;
							width: 50%;
							font-weight: 550;
						}
					}
				}
			}
		}
	}
}
</style>
