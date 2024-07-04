<template>
    <view>
        <okingtz-cropper @uploadSuccess="uploadSuccess" :fixedNumber="[741,962]"></okingtz-cropper>
    </view>
</template>

<script>
	
  //  1.引入项目
  import axios from 'axios'
  import OkingtzCropper from '@/uni_modules/okingtz-cropper/components/okingtz-cropper/okingtz-cropper'
  export default {
		data(){
			return{
				id:0
			}
		},
        components:{
            //2.使用组件
            OkingtzCropper
        },
		onLoad(params){
				this.id = params.id;  
		},
        methods: {
            // 3.定义自己的回调函数
            uploadSuccess(tempFilePath){
				uni.showLoading({
					title: '上传中'
				});
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				let _this = this;
				if(tk == null){
					uni.navigateTo({
						url: './login?msg=' + 'unAuthorized'
					});
					return;
				}
				axios.post(this.$baseUrl + '/essays/change_cover',
						{
							img:tempFilePath,
							novel_id:this.id
						},
						{
							headers: {
								'Content-Type': 'application/json', //设置请求头请求格式为JSON
								'Authorization': tk //设置token 其中K名要和后端协调好
							}
						},
					)
					.then(function(response) {
						uni.hideLoading();
						uni.showToast({title: '上传成功',icon: 'none',duration: 2000});
						setTimeout(() => {
							uni.reLaunch({
								url:"../essays"
							})
						}, 1000);
					})
					.catch(function(error) {
						//console.log(error);
						if (error) {
							uni.showToast({
									title: "上传失败",
									icon:'none',
									duration: 2000
							});
						}
					})  
            }
        }
    }
</script>