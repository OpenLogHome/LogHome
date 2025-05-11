<template>
	<view class="userCenter">
		<view class="userCenter-C">
			<view class="bj">
				<image mode="aspectFill" :src="userinfo.background"></image>
			</view>
			<view class="userinfo">
				<view class="userinfo-C">
					<view class="avatar">
						<view @click="swapAvatar"><avatar-item height="220" width="220" :avatar="userinfo.avatar"></avatar-item></view>
						<view @click="swapAvatar">点击更换头像</view>
					</view>
					<view class="info">
						<view class="info-I">
							<view class="info-I-I">
								<view class="text">
									头像框
								</view>
								<view class="input">
									<u-button @click="ToAvatar" size="mini" type="primary">去切换头像框</u-button>
								</view>
							</view>
							<view class="hr"></view>
						</view>
						
						<view class="info-I">
							<view class="info-I-I">
								<view class="text">
									昵称
								</view>
								<view class="input">
								   <input v-model="userinfo.nickname"/>
								</view>
							</view>
							<view class="hr"></view>
						</view>
						
						<view class="info-I">
							<view class="info-I-I">
								<view class="text">
									签名
								</view>
								<view class="input">
								   <input v-model="userinfo.gxqm"/>
								</view>
							</view>
							<view class="hr"></view>
						</view>
						
						<view class="info-I">
							<view class="info-I-I">
								<view class="text">
									背景
								</view>
								<view class="input">
								   <u-button @click="swapBj" size="mini" type="primary">点击更换背景</u-button>
								</view>
							</view>
							<view class="hr"></view>
						</view>
						
						<view class="info-I">
							<view class="info-I-I">
								<view class="text">
									性别
								</view>
								<view class="input gender">
								   <view class="gender-I " :class="userinfo.gender==0?'man':''" @click="genderSel(0)">
									   <image mode="aspectFill" src="../../static/img/man.png"></image>
								   </view>
								   <view class="gender-I" :class="userinfo.gender==1?'woman':''" @click="genderSel(1)">
									   <image mode="aspectFill" src="../../static/img/woman.png"></image>
								   </view>
								   <view class="gender-I" :class="userinfo.gender==2?'wz':''" @click="genderSel(2)">
									   <image mode="aspectFill" src="../../static/img/Genderunknown.png"></image>
								   </view>
								</view>
							</view>
							<view class="hr"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="btn">
				<u-button @click="SaveInfo" type="primary">保存</u-button>
			</view>
		</view>
	</view>
</template>

<script setup>
import {ref} from "vue"
import {username,avatar,gxqm,gender,background} from "@/utils/utils.js"
import {apiUpUserInfo} from "@/api/api.js"
import {getCheck} from "@/utils/check.js"
const userinfo=ref({
      nickname:username(vk.getVuex('$user.userInfo')),
	  avatar:avatar(vk.getVuex('$user.userInfo')),
	  gender:gender(vk.getVuex('$user.userInfo')), //0是男 1是女 2是未知
	  background:background(vk.getVuex('$user.userInfo')),
	  gxqm:gxqm(vk.getVuex('$user.userInfo'))
})
const bgUrl=ref({})
const avatarUrl=ref({})
function ToAvatar(){
	vk.navigateTo('/pages/my/AvatarFrame');
}
function genderSel(num){
	userinfo.value.gender=num
}
function SaveInfo(){
	if(userinfo.value.nickname.length==0){
		vk.toast('用户名不能为空');
	}else if("path" in bgUrl.value || "path" in avatarUrl.value){
		console.log("这是保存后的信息",userinfo.value)
		upImg().then(res=>{
			SubList()
		})
	}else{
		SubList()
	}
}
function swapAvatar(){
	console.log(123456)
	//更换头像
	uni.chooseImage({
		count:1,
		sizeType:["original"],
		success:res=>{
			avatarUrl.value=res.tempFiles[0]
			userinfo.value.avatar=res.tempFiles[0].path
		}
	})
	
}
function swapBj(){
	//更换背景
	uni.chooseImage({
		count:1,
		sizeType:["original"],
		success:(res)=>{
			bgUrl.value=res.tempFiles[0]
			userinfo.value.background=res.tempFiles[0].path
		}
	})
}
async function upImg(){
	if ("path" in bgUrl.value) {
	    await upload(bgUrl.value, "bg");
	}
	if ("path" in avatarUrl.value) {
	    await upload(avatarUrl.value, "avatar");
	}
  }
function SubList(){
	let obj={
		content:userinfo.value.nickname,
		signature:userinfo.value.gxqm,
		openid:vk.getVuex('$user.userInfo')?.wx_openid?.['mp-weixin'] || "",
		scene:1
	}
	getCheck(obj).then(res=>{
		if(res.isT){
			apiUpUserInfo(userinfo.value).then(res=>{
				let user = vk.getVuex('$user.userInfo');
				    // 直接使用 userinfo.value 更新状态
				vk.setVuex('$user.userInfo', {...user, ...userinfo.value});
				vk.toast("用户信息修改成功")
			})
		}else{
			vk.toast(res.msg);
		}
	})
	
}
async function upload(img,type){
	console.log(img)
	await vk.uploadFile({
	     title: "图片上传中...",
	     file: img,
	     success: (res) => {
	      // 上传成功
	      let url = res.url;
		  if(type=="bg"){
			   userinfo.value.background=url
		  }
	     if(type=="avatar"){
			 userinfo.value.avatar=url
		 }
			  
	     },
	     fail: (err) => {
	      // 上传失败
	     
	     }
	   });
}
</script>

<style lang="scss">
	page{
		box-sizing: border-box;
	}
	.userCenter{
		.userCenter-C{
			position: relative;
			width: 100%;
			padding-bottom: 50rpx;
			.bj{
				width: 100%;
				height: 520rpx;
				position: relative;
				z-index: -1;
				image{
					width: 100%;
					height: 500rpx;
					position: relative;
					z-index: 1;
				}
			}
			.userinfo{
				background: #fff;
				border-top-left-radius: 40rpx;
				border-top-right-radius: 40rpx;
				z-index: 99;
				margin-top: -80rpx;
				.userinfo-C{
					.avatar{
						padding: 50rpx 0;
						@include flex-center;
						flex-direction: column;
						image{
							height: 160rpx;
							width: 160rpx;
							border-radius: 50%;
							margin: 15rpx 0;
						}
					}
					.info{
						.info-I{
							padding: 15rpx 50rpx;
							.info-I-I{
								@include flex;
								.text{
									font-size: 28rpx;
									font-weight: 550;
			
								}
								.input{
									margin-left: auto;
									input{
										text-align: right;
									}
								}
								.gender{
									@include flex;
									image{
										width: 44rpx;
										height: 44rpx;
									}
									.gender-I{
										padding:20rpx 45rpx;
										margin: 0 10rpx;
										border:1px solid #eee;
										border-radius: 15rpx;
										&.man{
											background: #B3E5FC;
											border: 2px solid #039BE5;
										}
										&.woman{
											background: #F8BBD0;
											border: 2px solid #EC407A;
										}
										&.wz{
											background: #E0E0E0;
											border: 2px solid #9E9E9E;
										}
									}
								}
							}
							.hr{
								padding-top: 25rpx;
								border-bottom: 2px solid #eee;
							}
						}
					}
				}
			}
			.btn{
				margin-top: 100rpx;
				padding: 0 50rpx;
			}
		}
	}

</style>
