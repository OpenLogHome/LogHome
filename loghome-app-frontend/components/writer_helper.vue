<template>
	<div class="helper-box" v-show="!Object.values(problems).every((item)=>{return item == false})" v-dark>
		<div class="head">
			<div class="box-title">{{ $t('writer.helper.title') }}</div>
			<div class="more">
				<p>{{ $t('writer.helper.subtitle') }}</p>
			</div>
		</div>
		<div class="helper-body">
			<div class="card" v-show="problems.unPublic">
				<navigator @click="$emit('close-book-detail')" :url="'../pages/writers/essaySet?id='+novel_id">
					<p class="suggestion">
						{{ $t('writer.helper.privateTitle') }}
					</p>
					<p class="description">
						{{ $t('writer.helper.privateDesc') }}
					</p>
				</navigator>
			</div>
			<div class="card" v-show="problems.badDescription">
				<navigator @click="$emit('close-book-detail')" :url="'../pages/writers/changeEssayInfo?id='+novel_id">
					<p class="suggestion">
						{{ $t('writer.helper.descTooShortTitle') }}
					</p>
					<p class="description">
						{{ $t('writer.helper.descTooShortDesc') }}
					</p>
				</navigator>
			</div>
			<div class="card" v-show="problems.defaultCover">
				<navigator @click="$emit('close-book-detail')" :url="'../pages/writers/changeEssayInfo?id='+novel_id">
					<p class="suggestion">
						{{ $t('writer.helper.noCoverTitle') }}
					</p>
					<p class="description">
						{{ $t('writer.helper.noCoverDesc') }}
					</p>
				</navigator>
			</div>
			<div class="card" v-show="problems.noTags">
				<navigator @click="$emit('close-book-detail')" :url="'../pages/writers/changeNovelTags?id='+novel_id">
					<p class="suggestion">
						{{ $t('writer.helper.noTagsTitle') }}
					</p>
					<p class="description">
						{{ $t('writer.helper.noTagsDesc') }}
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
