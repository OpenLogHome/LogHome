<template>
	<view v-dark>
		<view class="list-content">
			<view class="list">
				<view class="li " @click="pushSet">
					<view class="text">消息推送与QQ绑定</view>
					<log-image class="to" src="../../static/user/to.png"></log-image>
				</view>
				<view class="li " @click="changePwd">
					<view class="text">修改密码</view>
					<img class="to" src="../../static/user/to.png" />
				</view>
				<view class="li " @click="activateAccount">
					<view class="text">账号绑定</view>
					<img class="to" src="../../static/user/to.png" />
				</view>
				<view class="li " @click="storageManage">
					<view class="text">空间占用管理</view>
					<img class="to" src="../../static/user/to.png" />
				</view>
				<view class="li " @click="changeLanguage">
					<view class="text" style="width:auto">语言 / Language</view>
					<view class="lang-current">{{ currentLanguageLabel }}</view>
					<img class="to" src="../../static/user/to.png" />
				</view>
			</view>
			<view class="list">
				<view class="li noborder" @click="logout">
					<view class="text" style="color:red">登出</view>
					<img class="to" src="../../static/user/to.png" />
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import { FOLLOW_SYSTEM, getSavedLanguage } from '@/i18n/resolve.js';
	import { applyLanguagePreference } from '@/common/lang.js';
	export default {
		data() {
			return {
				user:{},
				savedPreference: getSavedLanguage()
			}
		},
		computed: {
			currentLanguageLabel() {
				if (this.savedPreference === 'zh-CN') return '简体中文';
				if (this.savedPreference === 'en') return 'English';
				return this.$t('settings.language.followSystem');
			}
		},
		methods: {
			changeLanguage(){
				const options = [FOLLOW_SYSTEM, 'zh-CN', 'en'];
				uni.showActionSheet({
					itemList: [
						this.$t('settings.language.followSystem') + ' / Follow system',
						'简体中文',
						'English'
					],
					success: (res) => {
						const picked = options[res.tapIndex];
						if (picked === undefined) return;
						applyLanguagePreference(picked);
						this.savedPreference = picked;
						uni.showToast({
							title: this.$t('settings.language.switched'),
							icon: 'none'
						});
					}
				});
			},
			logout(){
				uni.showModal({
				    title: '提示',
				    content: '确定要登出吗？',
					confirmColor:"#EA7034",
				    success: function (res) {
				        if (res.confirm) {
				            window.localStorage.removeItem('token');
							window.localStorage.setItem('messages',[]);
				            uni.switchTab({
				            	url: '../library'
				            });
				        } else if (res.cancel) {
				        }
				    }
				});

			},
			changePwd(){
				uni.navigateTo({
					url: './changePwd'
				});
			},
			autoSaveSet(){
				uni.navigateTo({
					url: '../settings/autoSaveSettings'
				});
			},
			activateAccount(){
				uni.navigateTo({
					url: "./activateAccount"
				})
			},
			pushSet(){
				uni.navigateTo({
					url: "../settings/pushSettings"
				})
			},
			storageManage(){
				uni.navigateTo({
					url: "./storageManage"
				})
			}
		}
	}
</script>

<style scoped lang="scss">

.text{
	font-size: 30rpx;
	width: 100%;
}

page{
	background-color: var(--background-color-secondary);
	font-size: 30upx;
}
.list-content{
	background: var(--card-background);
	margin-top:20upx;
}
.list{
	width:100%;
	border-bottom:15upx solid var(--border-color);
	background: var(--card-background);
	&:last-child{
		border: none;
	}
	.li{
		width:92%;
		height:100upx;
		padding:0 4%;
		border-bottom:1px solid var(--border-color);
		display:flex;
		align-items:center;
	&.noborder{
		border-bottom:0
		}
		.icon{
			flex-shrink:0;
			width:50upx;
			height:50upx;
			img{
				width:50upx;
				height:50upx;
			}
		}
		.text{
			padding-left:20upx;
			width:100%;
			color:var(--text-color-regular);
		}
		.to{
			flex-shrink:0;
			width:40upx;
			height:40upx;
		}
		.lang-current{
			flex-shrink:0;
			margin-left:auto;
			color:#999;
			font-size:26upx;
		}
	}
}
</style>
