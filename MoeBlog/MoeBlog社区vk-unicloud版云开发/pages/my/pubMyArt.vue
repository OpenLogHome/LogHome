<template>
	<z-paging ref="paging" v-model="artData" @query="queryList">
		<view class="art">
			<art-item v-for="item in artData" :key="item._id" :item="item"></art-item>
		</view>
	</z-paging>
</template>

<script setup>
	import { ref } from "vue"
	import { onLoad, onReachBottom } from "@dcloudio/uni-app"
	import { apiGetUserLikeArt } from "@/api/api.js"
	onLoad(() => {
		
	})
	onReachBottom(() => {
		
	})
	const loading = ref(true)
	const artData = ref([])
	const paging=ref(null)
	function queryList(pageNo, pageSize) {
		let data = {
			pageNo, 
			pageSize,
			Audit: 0
		}
		apiGetUserLikeArt(data).then(res => {
			paging.value.complete(res.result)
		})
	}
</script>

<style lang="scss">
	.art {
		padding: 0 25rpx;
	}
</style>