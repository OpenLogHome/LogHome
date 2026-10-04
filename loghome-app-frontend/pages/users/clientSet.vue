<template>
	<view v-dark>
		<view class="list-content">
			<view class="list">
				<view class="li " @click="pushSet">
					<view class="text">{{ $t('settings.clientSet.pushQq') }}</view>
					<log-image class="to" src="../../static/user/to.png"></log-image>
				</view>
				<view class="li " @click="changePwd">
					<view class="text">{{ $t('settings.clientSet.changePassword') }}</view>
					<img class="to" src="../../static/user/to.png" />
				</view>
				<view class="li " @click="activateAccount">
					<view class="text">{{ $t('settings.clientSet.accountBinding') }}</view>
					<img class="to" src="../../static/user/to.png" />
				</view>
				<view class="li" @click="privacySet">
					<view class="text">{{ $t('settings.privacy.title') }}</view>
					<log-image class="to" src="../../static/user/to.png"></log-image>
				</view>
				<view class="li " @click="storageManage">
					<view class="text">{{ $t('settings.clientSet.storageManage') }}</view>
					<img class="to" src="../../static/user/to.png" />
				</view>
				<view class="li " @click="changeLanguage">
					<view class="text" style="width:auto">语言 / Language</view>
					<view class="lang-current">{{ currentLanguageLabel }}</view>
					<img class="to" src="../../static/user/to.png" />
				</view>
			</view>
			<view class="list">
				<view class="li ai-setting">
					<view class="text ai-setting-copy">
						<view>{{ $t('settings.ai.disable') }}</view>
						<view class="ai-setting-hint">{{ $t('settings.ai.hint') }}</view>
					</view>
					<switch class="ai-setting-switch" :key="'ai-switch-' + aiSwitchRevision" :checked="!aiAssistanceEnabled" :disabled="savingAiPreference" :aria-label="$t('settings.ai.disable')" color="#EA7034" @change="changeAiPreference" />
				</view>
				<view class="li noborder" @click="logout">
					<view class="text" style="color:red">{{ $t('settings.clientSet.logout') }}</view>
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
				savingAiPreference: false,
				aiSwitchRevision: 0,
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
			async changeAiPreference(event) {
				if (this.savingAiPreference) return;
				this.savingAiPreference = true;
				try {
					await this.$store.dispatch('setAiAssistanceDisabled', event.detail.value);
				} catch (error) {
					uni.showToast({ title: this.$t('settings.ai.saveFailed'), icon: 'none' });
				} finally {
					this.savingAiPreference = false;
					this.aiSwitchRevision++;
				}
			},
			privacySet() {
				uni.navigateTo({ url: '../settings/privacySettings' });
			},
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
				    title: this.$t('common.prompt'),
				    content: this.$t('settings.clientSet.logoutConfirm'),
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
.list .li.ai-setting { width: 100%; height: auto; min-height: 120rpx; padding-top: 16rpx; padding-bottom: 16rpx; box-sizing: border-box; }
.ai-setting-switch { flex-shrink: 0; }
.ai-setting-copy { margin-right: 20rpx; }
.ai-setting-hint { margin-top: 10rpx; font-size: 24rpx; line-height: 1.5; color: var(--text-color-secondary); }

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
