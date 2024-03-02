<template>
	<view class="outer">
		<el-result title="啊哦，这个版本有些过于古老了..." subTitle="你可以继续使用，但是我们无法确保这个版本能跑">
		  <template slot="icon">
		    <img src="../../static/images/creeper.png" style="height:300rpx;"></img>
		  </template>
		  <template slot="extra">
			<el-button type="primary" size="large" @click="checkUpdate">立即获取最新版本</el-button>
		    <el-button size="large" @click="goBack">返回</el-button>
		  </template>
		</el-result>
	</view>
</template>

<script>
	import axios from "axios";
	export default{
		methods:{
			goBack(){
				uni.navigateBack({});
			},
			checkUpdate(){
				let _this = this;
				axios.get(this.$baseUrl + '/app/get_app_update', {}).then((res) => {
					window.location.href = res.data[0].update_url;
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
				}).then(function(){
					uni.hideLoading();
				})
			},
		}
	}
</script>

<style scoped lang="scss">
</style>
