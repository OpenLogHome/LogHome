<template>
	<view class="outer" v-dark>
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
		background-color: var(--background-color);
		min-height: 100vh;
	}
	.post{
		width:90vw;
		padding:5vw;
		overflow:hidden;
		color: var(--text-color-primary);
		/deep/ img{
			max-width:90vw;
		}
	}
	/deep/ .post{
		color: var(--text-color-primary);
		line-height: 1.6;
	}
	/deep/ .post p,
	/deep/ .post span,
	/deep/ .post div,
	/deep/ .post li,
	/deep/ .post h1,
	/deep/ .post h2,
	/deep/ .post h3,
	/deep/ .post h4,
	/deep/ .post h5,
	/deep/ .post h6{
		color: inherit !important;
	}
</style>
