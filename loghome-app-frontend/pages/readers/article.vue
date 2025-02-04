<template>
	<view class="outer">
		<div class="lost" v-show="lostArticle">
			<img src="../../static/faces/sad.png" alt="" class="icon"/>
			<p class="des">哎呀，章节走丢了...</p>
			<div class="button" @click="gotoAllArticles">查看其他章节</div>
		</div>
	</view>
</template>

<script>
	import axios from 'axios'
	export default {
		data() {
			return {
				articleId: -1,
				history: 0,
				isDirectJump: 0,
				lostArticle: false,
				novelId: 0
			}
		},
		onShow() {
			uni.showLoading({
				title: '加载中'
			});
			let _this = this;
			console.log(this.articleId)
			if (this.articleId) {
				axios.get(this.$baseUrl + '/articles/get_article_info?id=' + this.articleId).then((res) => {
					let article = res.data[0];
					let waitTime = this.isDirectJump ? 0 : 400;
					setTimeout(() => {
						uni.redirectTo({
							url: "./article_rich?noneAnimation=1&id=" + article.article_id
						})
					}, waitTime);
				}).catch(function(error) {
					_this.lostArticle = true;
				}).then(function() {
					uni.hideLoading();
				})
			} else {
				uni.showToast({
					title: "哎呀，章节走丢了...",
					icon: 'none',
					duration: 2000
				});
			}
		},
		onLoad(params) {
			this.articleId = params.id;
			this.novelId = params.novelId;
			this.isDirectJump = params.isDirectJump;
		},
		methods: {
			gotoAllArticles() {
				uni.navigateTo({
					url: "./allArticles?id=" + this.novelId
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.outer {
		.lost {
			height: calc(100vh - 44px);
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.icon {
				width: 200rpx;
			}

			p.des {
				margin: 30rpx;
				font-size: 40rpx;
			}

			.button {
				height: 40px;
				width: 40vw;
				margin-top: 15px;
				margin-left: 10px;
				margin-right: 10px;
				font-size: 16px;
				font-weight: bold;
				line-height: 38px;
				border-radius: 5px;
				color: #ffffff;
				background-color: rgb(234, 112, 52);
				text-align: center;
			}

			.button:active {
				background-color: rgb(234, 171, 11);
			}
		}
	}
</style>