<template>
	<div class="outer">
		<div class="articles">
			<navigator v-for="(item, idx) in articles" :key="item.article_id"
					   :url="'./newReader/article?id=' +  item.article_id"
					   open-type="redirect" @click="$emit('change', idx)">  
				<div class="article" :key="item.article_id">
					<div class="title">{{item.title}}</div>
				</div>
			</navigator>
		</div>
	</div>
</template>

<script>
	import axios from "axios"
	export default{
		data(){
			return{
				uid:0,
				bookInfo:{},
				articles:[]
			}
		},
		props:['novel_id'],
		mounted(){
			uni.showLoading({
				title: '加载中'
			});
			const uid = this.novel_id;
			axios.get(this.$baseUrl + '/library/get_articles?id=' + uid, {}).then((res) => {
				this.articles = res.data;
				console.log(this.articles)
			}).catch(function (error) {
				uni.showToast({
					title: error.toString(),
					icon:'none',
					duration: 2000
				});
			}).then(function(){
				uni.hideLoading();
			})
		}
	}
</script>

<style scoped lang="scss">
	.articles{
		width:100%;
		background-color: #000a;
		color: #dddddd;
		.article{
			padding-left:35rpx;
			border-bottom: #cacaca 1rpx solid;
			background-color: transparent;
			.title{
				background-color: transparent;
				font-size: 35rpx;
				color:white;
				line-height: 100rpx;
			}
		}
		
	}
</style>
