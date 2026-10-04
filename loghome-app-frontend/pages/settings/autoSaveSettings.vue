<template>
	<view class="outer" v-dark>
		<div class="description">
			<div style=" background-color:var(--card-background); padding:50rpx; font-size: 35rpx;" data-new-gr-c-s-check-loaded="14.1001.0" data-gr-ext-installed=""><p>
				<strong>{{ $t('settings.autoSave.aboutTitle') }}</strong>
			</p>
			<p style="text-indent:2em;">
				{{ $t('settings.autoSave.aboutDesc') }}
			</p>
			</div>
		</div>
		<div class="list-content">
			<view class="list">
<!-- 				<view class="li " @click="autoSaveSet">
					<view class="text">状态：{{dbStatus == "enabled" ? "启用" : "停用"}}</view>
					<img class="to" src="../../static/user/to.png"></img>
				</view> -->
				<view class="li " @click="saveTimeSet" v-show="dbStatus == 'enabled'">
					<view class="text">{{ $t('settings.autoSave.interval', { minutes: EditorAutoSaveProps.timeSpan }) }}</view>
					<img class="to" src="../../static/user/to.png"></img>
				</view>
			</view>
		</div>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				dbStatus:"disabled",
				EditorAutoSaveProps:{}
			}
		},
		onLoad(){
			this.dbStatus = window.localStorage.getItem("IndexedDB");
			if(this.dbStatus == "enabled"){
				this.EditorAutoSaveProps = JSON.parse(window.localStorage.getItem("EditorAutoSave"));
			}
		},
		methods:{
			autoSaveSet(){
				let _this = this;
				uni.showActionSheet({
				    itemList: [this.$t('settings.autoSave.enable'), this.$t('settings.autoSave.disable')],
				    success: function (res) {
				        if(res.tapIndex == 0) {
							window.localStorage.setItem("IndexedDB","enabled");
						}
						if(res.tapIndex == 1) {
							window.localStorage.setItem("IndexedDB","disabled");
						}
						uni.showModal({
							title: _this.$t('common.settingSuccess'),
							content: _this.$t('settings.autoSave.restartNote'),
							confirmColor:"#EA7034",
							showCancel: false,
							success: function (res) {
								uni.redirectTo({
									url:"/pages/settings/autoSaveSettings"
								})
							}
						});
				    },
				    fail: function (res) {
				        console.log(res.errMsg);
				    }
				});
			},
			saveTimeSet(){
				let _this = this;
				let selectors = [];
				for(let i = 1;i < 11 ; i ++){
					selectors.push(_this.$t('settings.autoSave.minutesOption', { count: i }));
				}
				uni.showActionSheet({
				    itemList: selectors,
				    success: function (res) {
						_this.EditorAutoSaveProps.timeSpan = res.tapIndex + 1;
						window.localStorage.setItem("EditorAutoSave",JSON.stringify(_this.EditorAutoSaveProps));
						uni.showModal({
							title: _this.$t('common.settingSuccess'),
							content: _this.$t('settings.autoSave.restartNote'),
							confirmColor:"#EA7034",
							showCancel: false,
							success: function (res) {
								uni.redirectTo({
									url:"/pages/settings/autoSaveSettings"
								})
							}
						});
				    },
				    fail: function (res) {
				        console.log(res.errMsg);
				    }
				});
			}
		}
	}
</script>

<style scoped lang="scss">

	.text{
		font-size: 30rpx;
		width: 100%;
	}

	.list-content{
		background: var(--card-background);
		margin-top:20upx;
	}
	.list{
		width:100%;
		border-bottom:15upx solid  var(--border-color);
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
		}
	}
</style>
