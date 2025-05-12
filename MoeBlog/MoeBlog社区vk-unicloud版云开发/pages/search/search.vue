<template>
	<view class="search">
		<u-search placeholder="请输入文章" v-model="text" @search="search" @custom="search"></u-search>
		<view class="loading" v-if="loading">
			<skeleton-item1 :num="4"></skeleton-item1>
		</view>
		<view v-else class="loading">
			<view class="art">
				<art-item v-for="(item,index) in artData" :key="item._id" :item="item"></art-item>
				<loading-item v-if="noMore" :status="noMore"></loading-item>
			</view>
		</view>
	</view>
</template>

<script setup>
import {ref} from "vue"
import { apiGetSearch } from "@/api/api";
import {onReachBottom} from "@dcloudio/uni-app"
const text=ref("")
const artData=ref([])
const pageIndex=ref(1)
const loading=ref(false)
const noMore=ref(false)
function search(){
	pageIndex.value=1
	loading.value=true
	let data={
		pageIndex:pageIndex.value,
		text:text.value
	}
	artData.value=[]
	apiGetSearch(data).then(res=>{
		loading.value=false
		let newArr=res.result
		if(res.result.length==0){
			noMore.value=true
		}
		artData.value=[...artData.value,...newArr]
	})
}
</script>

<style lang="scss">
	.search{
		padding: 25rpx;
		.loading{
			padding: 25rpx 0;
		}
	}

</style>
