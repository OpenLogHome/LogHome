<template>
	<div class="helper-box" v-show="!Object.values(problems).every((item)=>{return item == false})" v-dark>
		<div class="head">
			<div class="box-title">创作建议君</div>
			<div class="more">
				<p>为你的创作保驾护航</p>
			</div>
		</div>
		<div class="helper-body">
			<div class="card" v-show="problems.unPublic">
				<navigator @click="$emit('close-book-detail')" :url="'../pages/writers/essaySet?id='+novel_id">
					<p class="suggestion">
						作品处于私有状态
					</p>
					<p class="description">
						新创建的作品默认为私有状态，只有将作品设置为公开才能让别人看到你的作品哦！
					</p>
				</navigator>
			</div>
			<div class="card" v-show="problems.badDescription">
				<navigator @click="$emit('close-book-detail')" :url="'../pages/writers/changeEssayInfo?id='+novel_id">
					<p class="suggestion">
						作品简介太短了
					</p>
					<p class="description">
						好的作品简介可以吸引更多人来看你的作品哦，更长的简介会让大家感受到你的诚意。
					</p>
				</navigator>
			</div>
			<div class="card" v-show="problems.defaultCover">
				<navigator @click="$emit('close-book-detail')" :url="'../pages/writers/changeEssayInfo?id='+novel_id">
					<p class="suggestion">
						没有上传封面
					</p>
					<p class="description">
						独特的封面可以让作品从众多作品中脱颖而出，上传一张封面试试吧！
					</p>
				</navigator>
			</div>
			<div class="card" v-show="problems.noTags">
				<navigator @click="$emit('close-book-detail')" :url="'../pages/writers/changeNovelTags?id='+novel_id">
					<p class="suggestion">
						没有设置标签
					</p>
					<p class="description">
						标签可以让喜欢相关类型的读者更容易找到你的作品，试着添加两个标签吧！
					</p>
				</navigator>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import darkModeMixin from '@/mixins/dark-mode.js'

export default {
		mixins: [darkModeMixin],
		data(){
			return{
				novel:{},
				problems:{
					unPublic:false,
					badDescription:false,
					defaultCover: false,
					noTags: false
				}
			}
		},
		props:["novel_id"],
		watch: {
			novel_id: {
				handler(newValue, oldValue){
					let _this = this;
					axios.get(this.$baseUrl + '/essays/get_novel_by_id?id=' + newValue, {}).then((res) => {
						this.novel = res.data[0];
						this.problems.unPublic = this.novel.is_personal;
						this.problems.badDescription = this.novel.content.length < 30;
						this.problems.defaultCover = (this.novel.picUrl === "http://img.codesocean.top/img/1641194344563.png");
						//this.problems.noTags = this.;
						console.log(res.data[0]);
					}).catch(function(error) {
						uni.showToast({
							title: error.toString(),
							icon: 'none',
							duration: 2000,
						});
					}).then(function() {});
					axios.get(this.$baseUrl + '/library/get_novel_tags?novel_id=' + newValue, {}).then((res) => {
						_this.problems.noTags = (res.data.length===0);
						console.log(res.data+"我在这");
					}).catch(function (error) {
						uni.showToast({
							title: error.toString(),
							icon:'none',
							duration: 2000
						});
					}).then(function(){})
				},
				immediate: true
			}
		}
	}
</script>

<style scoped lang="scss">
	div.helper-box{
		margin:0rpx 0rpx;
		box-sizing: border-box;
		background-color: #ffffff;
		
		&.dark-mode {
			background-color: var(--card-background);
		}
		.head{
			margin:0rpx 50rpx;
			padding: 35rpx 0;
			height:30rpx;
			div.box-title{
				float:left;
				font-size: 34rpx;
				font-weight: bold;
				color:#2d2d2d;
				height:30rpx;
				
				.dark-mode & {
					color: var(--text-color-primary);
				}
			}
			div.more{
				float:right;
				display:flex;
				margin-top: 5rpx;
				p{
					margin:0rpx;
					color:#2d2d2d;
					font-size: 26rpx;
					line-height: 44rpx;
					height:44rpx;
					
					.dark-mode & {
						color: var(--text-color-regular);
					}
				}
				.moreImg{
					height:30rpx;
					width:30rpx;
					margin-right: 8rpx;
				}
			}
		}
		.helper-body{
			display:flex;
			margin:0 40rpx;
			flex-wrap: wrap;
			.card{
				margin:10rpx 10rpx;
				padding:25rpx;
				width:calc(100vw - 80rpx - 20rpx - 50rpx);
				background-color: #00000009;
				text-align:left;
				
				.dark-mode & {
					background-color: var(--background-color-tertiary);
				}
				.suggestion{
					font-size: 35rpx;
					margin-bottom:10rpx;
					font-weight: bold;
					color:rgb(113, 52, 24);
					
					.dark-mode & {
						color: var(--text-color-primary);
					}
				}
				.description{
					font-size: 28rpx;
					
					.dark-mode & {
						color: var(--text-color-regular);
					}
				}
			}
		}
		.statistics-body.no-statistic{
			justify-content:center;
		}
	}	
</style>
