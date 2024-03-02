<template>
	<div class="outer">
		<el-carousel :interval="5000" type="card" arrow="always" style="z-index:0">
			<el-carousel-item v-for="item in novel_pics" :key="item">
			  <el-image
					style="border-radius: 15rpx;"
			        :src="bookInfo.picUrl"
			        fit="contain"></el-image>
			</el-carousel-item>
		</el-carousel>
	</div>
</template>

<script>
	export default{
		data:{
			uid:-1
		},
		methods:{
			get_novel_pics(){
				axios.get(this.$baseUrl + "/library/get_novel_pics?novel_id=" + this.uid)
				.then((res)=>{
					this.novel_pics = res.data;
					console.log(res.data);
				}).catch(err=>{
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				})
			}
		},
		onLoad(params){
			if(params.novel_id){
				this.uid = params.novel_id;
			} else {
				uni.showToast({
					title: error.toString(),
					icon: 'none',
					duration: 2000
				});
			}
		},
		onShow(){
			
		}
	}
</script>

<style>
</style>
