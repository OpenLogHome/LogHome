<template>
    <view>
<!-- 		<el-alert
			title="提示"
			type="warning"
			class="alert"
			:closable="false"
			close-text="知道了"
			description="近期部分用户反馈APP端在一些手机上无法正常上传图片,如果您遭遇了相似情形,请前往网页端 http://loghome.codesocean.top 更换图片,给您造成的不便我们深感歉意!"
			show-icon
			v-show="$store.state.appVersion"
			>
		</el-alert> -->
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