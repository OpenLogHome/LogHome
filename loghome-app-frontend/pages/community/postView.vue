<template>
	<view class="outer">
		<view class="post" v-html="post.content"></view>
	</view>
	
</template>

<script>
	import axios from 'axios'
	export default {
		data() {
			return {
				post:{},
				uid:-1
			}
		},
		components: {
		},
		methods: {
			
		},
		onLoad(params){
			this.uid = params.id;
			axios.get(this.$baseUrl + '/posts/get_post?id=' + this.uid, {}).then((res) => {
				this.post = res.data[0];
			}).catch(function (error) {
				uni.showToast({
					title: error.toString(),
					icon:'none',
					duration: 2000
				});
			}).then(function(){
			})
		}
	}
</script>

<style scoped lang="scss">
	.outer{
		background-color: #ffffff;
	}
	.post{
		width:90vw;
		padding:5vw;
		overflow:hidden;
		/deep/ img{
			max-width:90vw;
		}
	}
	/deep/ .post{
		line-height: 1.6;
	}
</style>