<template>
	<view class="content">
		<nothing :msg="'这本书还没有章节哦\n快去评论区催更~'" v-show="articles.length == 0"></nothing>
		<div class="articles">
			<navigator v-for="item in articles" :key="item.article_id"
					   :url="'./article?id=' +  item.article_id"
					   open-type="navigate">  
				<div class="article" :key="item.article_id">
					<div class="title">{{item.title}}</div>
				</div>
			</navigator>
		</div>
	</view>
</template>

<script>
import axios from 'axios'
import nothing from '../../components/nothing.vue'
export default{
	components:{
		nothing
	},
	data(){
		return{
			uid:0,
			bookInfo:{},
			articles:[]
		}
	},
	onLoad(option){
		uni.showLoading({
			title: '加载中'
		});
		if(JSON.stringify(option) == "{}"){
			uni.showToast({
				title: "undefined",
				icon:'none',
				duration: 2000
			});
			return;
		}
		const uid = option.id;
		axios.get(this.$baseUrl + '/library/get_articles?id=' + uid, {}).then((res) => {
			this.articles = res.data;
			console.log(this.articles)
			uni.setNavigationBarTitle({
				title:this.bookInfo.name
			});
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

<style scoped lang="less">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-flow: wrap;
		background-color: rgb(255,248,234);
		width:100vw;
		.articles{
			width:100%;
			.article{
				padding-left:35rpx;
				border-bottom: #cacaca 1rpx solid;
				.title{
					font-size: 35rpx;
					font-weight: bold;
					color:rgb(113, 52, 24);
					line-height: 100rpx;
				}
			}
			
		}
		div.underBar{
			height: 150rpx
		}
	}
</style>
