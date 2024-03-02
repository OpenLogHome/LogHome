<template>
	<view>

	</view>
</template>

<script>
	import MobileDetect from "mobile-detect"
	import axios from 'axios'
	export default {
		data() {
			return {

			};
		},
		onShow() {
			//判断数组中是否包含某字符串 
			Array.prototype.contains = function(needle) {
				for (let i = 0 ; i < this.length ; i ++) {
					if (this[i].indexOf(needle) > 0)
						return i;
				}
				return -1;
			}
			
			// 获取系统信息，包括操作系统os和设备型号model
			let device_type = navigator.userAgent; //获取userAgent信息 
			let md = new MobileDetect(device_type); //初始化mobile-detect 
			let os = md.os(); //获取系统 
			let model = "";
			if (os == "iOS") { //ios系统的处理 
				os = md.os() + md.version("iPhone");
				model = md.mobile();
			} else if (os == "AndroidOS") { //Android系统的处理 
				os = md.os() + md.version("Android");
				let sss = device_type.split(";");
				let i = sss.contains("Build/");
				if (i > -1) {
					model = sss[i].substring(0, sss[i].indexOf("Build/"));
				} else {
					let i = sss.contains(")");
					if (i > -1) {
						model = sss[i].substring(0, sss[i].indexOf(")"));
					}
				}
			}
			let _this = this;
			//获取localStorage中的设备指纹
			let deviceFingerprint = localStorage.getItem("LogHomeDeviceFingerprint");
			let deviceVerifyQuery = "";
			//如果存在设备指纹，则向云端验证设备指纹合法性，包括：检查指纹是否存在、检查指纹对应的设备型号是否一致。
			if(deviceFingerprint != undefined){
				deviceVerifyQuery = "?deviceFingerprint=" + deviceFingerprint + "&os=" + os + "&model=" + model;
				// 存在设备指纹，说明并不是第一次进入应用，可以直接先进入书库页面，在后台继续进行设备指纹的验证操作。
				_this.gotoLibrary();
			} else {
				deviceVerifyQuery = "?os=" + os + "&model=" + model;
			}
			
			// 发送设备验证请求
			axios.get(this.$baseUrl + '/users/device_verify' + deviceVerifyQuery, {}).then((res) => {
				if(res.status == 202){
					localStorage.setItem("LogHomeDeviceFingerprint",res.data.newFingerprint);
					console.log("resetFingerPrint")
				}
			}).catch(function (error) {
				uni.showToast({
					title: error.toString(),
					icon:'none',
					duration: 2000
				});
			}).then(function(){
				//如果不存在设备指纹，则说明还没有进入书库界面，进行跳转
				if(deviceFingerprint == undefined) _this.gotoLibrary();
			})
			
			
		},
		methods:{
			gotoLibrary(){
				setTimeout(() => {
					uni.reLaunch({
						url: "./library"
					})
				}, 500)
			}
		}
	}
</script>

<style lang="scss">

</style>
