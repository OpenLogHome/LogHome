<template>
	<view class="outer">
		<div class="description">
			<div style=" background-color:#ffffff; padding:50rpx; font-size: 35rpx;" data-new-gr-c-s-check-loaded="14.1001.0" data-gr-ext-installed=""><p>
				<strong>关于本地备份：</strong>
			</p>
			<p style="text-indent:2em;">
				原木社区为您提供了强大的本地备份功能。在文章编辑器中进行文章撰写时，我们会以您设置的自动备份频率进行备份。
			</p>
			</div>
		</div>
		<div class="list-content">
			<view class="list">
<!-- 				<view class="li " @click="autoSaveSet">
					<view class="text">状态：{{dbStatus == "enabled" ? "启用" : "停用"}}</view>
					<image class="to" src="../../static/user/to.png"></image>
				</view> -->
				<view class="li " @click="saveTimeSet" v-show="dbStatus == 'enabled'">
					<view class="text">自动备份间隔：{{EditorAutoSaveProps.timeSpan}} 分钟</view>
					<image class="to" src="../../static/user/to.png"></image>
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
				    itemList: ['启用',"禁用"],
				    success: function (res) {
				        if(res.tapIndex == 0) {
							window.localStorage.setItem("IndexedDB","enabled");
						}
						if(res.tapIndex == 1) {
							window.localStorage.setItem("IndexedDB","disabled");
						}
						uni.showModal({
							title: '设置成功',
							content: '新设置重启应用后生效。',
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
					selectors.push(i + " 分钟");
				}
				uni.showActionSheet({
				    itemList: selectors,
				    success: function (res) {
						_this.EditorAutoSaveProps.timeSpan = res.tapIndex + 1;
						window.localStorage.setItem("EditorAutoSave",JSON.stringify(_this.EditorAutoSaveProps));
						uni.showModal({
							title: '设置成功',
							content: '新设置重启应用后生效。',
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
		background: #fff;
		margin-top:20upx;
	}
	.list{
		width:100%;
		border-bottom:15upx solid  rgb(255, 248, 234);
		background: #fff;
		&:last-child{
			border: none;
		}
		.li{
			width:92%;
			height:100upx;
			padding:0 4%;
			border-bottom:1px solid rgb(255, 248, 234);
			display:flex;
			align-items:center;
		&.noborder{
			border-bottom:0
			}
			.icon{
				flex-shrink:0;
				width:50upx;
				height:50upx;
				image{
					width:50upx;
					height:50upx;
				}
			}
			.text{
				padding-left:20upx;
				width:100%;
				color:#666;
			}
			.to{
				flex-shrink:0;
				width:40upx;
				height:40upx;
			}
		}
	}
</style>
