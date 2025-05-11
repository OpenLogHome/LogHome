<template>
	<view class="square-C">
		<view class="square-ctx">
			<scroll-view scroll-y class="scroll-L">
				<view class="square-L">
					<view class="square-L-I" v-for="(item,index) in squareList" :key="item._id" :class="currentIndex==index?'active':''" @click="switchL(index)">
						{{item.name}}
					</view>
				</view>
			</scroll-view>
			<scroll-view scroll-y class="scroll-R">
				<view class="square-R">
					<view class="square-R-I">
						<view class="square-R-1" v-for="(items,indexs) in squareList" :key="items._id">
							<view class="square-R-2" v-for="(itemss,indexss) in items.children" :key="indexss" v-if="indexs == currentIndex" @click="itemCl(itemss,type)">
								<view class="square-R-2-C">
									<view class="head">
										<view class="avatar">
											<image mode="aspectFill" :src="itemss.avatarUrl"></image>
										</view>
										<view class="info">
											<view class="name">{{itemss.name}}</view>
											<view class="infoData">
												<text>关注 {{itemss.fans_count || 0}}</text>
												<text>帖子 {{itemss.count || 0}}</text>
											</view>
										</view>
										<view class="custom">
											<view v-if="type=='into'">
												<uni-icons type="right" size="20"></uni-icons>
											</view>
											<view v-if="type=='sel'">
												<u-tag text="选择" mode="dark" />
											</view>
										</view>
									</view>
									<view class="btm">
										<view class="desc">{{itemss.description}}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup>
	import {ref,onMounted,defineEmits} from "vue"
	import { apiGetTaxonomy } from "@/api/api";
	const squareList=ref([])
	const currentIndex=ref(0)
	const emit=defineEmits(['callBack'])
	defineProps({
		type:String,
		default(){
			return
		}
	})
	onMounted(()=>{
		GetSquare()
	})
	
	function switchL(index){
		currentIndex.value=index
	}
	function itemCl(item,type){
		if(type=='into'){
			vk.navigateTo('/pages/square/squareInfo?id='+item._id);
		}
		if(type=='sel'){
			let obj={
				id:item._id,
				name:item.name
			}
			emit('callBack', obj)
		}
	}
	function GetSquare(){
		apiGetTaxonomy().then(res=>{
			console.log(res.result.rows)
			res.result.rows.forEach(item=>{
				if(item.parent_id == null || item.parent_id == ""){
					squareList.value.push({
						...item,
						children:[]
					})
				}
			})
			for(let i=0;i<res.result.rows.length;i++){
				for(let j=0;j<squareList.value.length;j++){
					if(squareList.value[j]._id==res.result.rows[i].parent_id){
						squareList.value[j].children.push(res.result.rows[i])
					}
				}
			}
			console.log(squareList.value)
		})
	}
</script>

<style lang="scss">
	.square-C{
		.square-ctx{
			display: flex;
			.scroll-L{
				height: calc(100vh - 44px);
				width: 20vw;
				.square-L{
					font-size: 27rpx;
					.square-L-I{
						padding:30rpx 0 ;
						text-align: center;
						cursor: pointer; // 提示用户可点击
						transition: background-color 0.3s; // 平滑过渡背景色
						&.active{
							background: #fff;
							color: #03A9F4;
							border-left: 1px solid #03A9F4;
						}
					}
				}
			}
			.scroll-R{
				background: #fff;
				height: calc(100vh - 44px);
				width: 80vw;
				.square-R{
					.square-R-I{
						.square-R-1{
							.square-R-2{
								padding:15rpx 25rpx;
								.head{
									@include flex;
									.avatar{
										padding-right: 20rpx;
										image{
											height: 90rpx;
											width: 90rpx;
											border-radius: 50%;
										}
									}
									.info{
										.name{
											padding: 5rpx 0;
											font-size: 28rpx;
											font-weight: 550;
										}
										.infoData{
											padding: 5rpx 0;
											font-size: 25rpx;
											color: #9E9E9E;
											text{
												padding: 0 10rpx;
											}
										}
									}
									.custom{
										margin-left: auto;
									}
								}
								.btm{
									margin: 10rpx 0;
									padding: 10rpx;
									background: #F4F4F4;
									border-radius: 10rpx;
									.desc{
										color: #9E9E9E;
										font-size: 24rpx;
										@include ellipsis(1)
									}
								}
							}
						}
					}
				}
			}
		}
	}

</style>