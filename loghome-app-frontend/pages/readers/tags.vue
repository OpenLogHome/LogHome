<template>
	<view class="outer" v-dark>
		<view class="tags">
			<div class="tag" v-for="(item,index) in tags" :key="item.tag_id"
			:class="{'activity':item.is_activity_tag, 'suggested': item.is_suggested}"
			@click="gotoTagNovels(item.tag_id)">
				{{item.tag_name}} ({{item.count}})
			</div>
		</view>
	</view>
</template>

<script>
	import axios from "axios"
	export default{
		data(){
			return{
				tags: [],
			}
		},
		methods:{
			getNovelTags(){
				let _this = this;
				axios.get(_this.$baseUrl + '/library/get_all_tags', {}).then((res) => {
					_this.tags = res.data;
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
				}).then(function(){})
			},
			gotoTagNovels(tag_id){
				uni.navigateTo({
					url:"./tagCollections?tag_id=" + tag_id
				})
			}
		},
		onLoad(params){
			this.getNovelTags();
		}
	}
</script>

<style scoped lang="scss">
	// .title_bar{
	// 	padding: 8px 30rpx;
	// 	font-size: 40rpx;
	// 	font-weight: bold;
	// 	background-color: #f2f2f2;
	// 	margin: 25rpx auto;
	// 	color: #934900;
	// }
	.tags{
		display:flex;
		flex-wrap: wrap;
		height:auto;
		min-height:100rpx;
		padding: 30rpx;
		background-color: #F2F2F2;
		.tag{
			background-color: #eeeeee;
			font-size: 35rpx;
			color:#666666;
			height:70rpx;
			line-height: 70rpx;
			padding:0 30rpx;
			border-radius: 10rpx;
			margin-right: 30rpx;
			margin-bottom: 30rpx;
			display:flex;
		}
		.tag.activity{
			color:#ec8600;
			background-color: #ffcfa5;
		}
		.tag.add{
			background-color: #eeeeee;
			border:4rpx dashed #787878;
			box-sizing: border-box;
		}
		.tag.suggested{
			border: solid 1px #ec8600;
			color: #ec8600;
		}
		.deletePoint{
			margin-left: 10rpx;
			padding-top:20rpx;
			width:30rpx;
			height:30rpx;
		}
	}
	.suggested_tags{
		display:flex;
		flex-wrap: wrap;
		height:auto;
		min-height:100rpx;
		margin:30rpx;
		.tag{
			background-color: #eeeeee;
			font-size: 35rpx;
			color:#666666;
			height:70rpx;
			line-height: 70rpx;
			padding:0 30rpx;
			border-radius: 10rpx;
			margin-right: 30rpx;
			margin-bottom: 30rpx;
			display:flex;
		}
		.tag.activity{
			color:#ec8600;
			background-color: #ffcfa5;
		}
		.tag.chosen{
			border: solid 1px #ec8600;
			color: #ec8600;
		}
	}
	.outer{
		background-color: #ffffff;
		
		&.dark-mode{
			background-color: #1E1E1E;
		}
	}
	
	.dark-mode {
		.tags {
			background-color: #2C2C2C;
			
			.tag {
				background-color: #3C3C3C;
				color: #CCCCCC;
				
				&.activity {
					color: #ec8600;
					background-color: #573013;
				}
				
				&.suggested {
					border: solid 1px #ec8600;
					color: #ec8600;
				}
			}
		}
		
		.suggested_tags {
			.tag {
				background-color: #3C3C3C;
				color: #CCCCCC;
				
				&.activity {
					color: #ec8600;
					background-color: #573013;
				}
				
				&.chosen {
					border: solid 1px #ec8600;
					color: #ec8600;
				}
			}
		}
	}
</style>
