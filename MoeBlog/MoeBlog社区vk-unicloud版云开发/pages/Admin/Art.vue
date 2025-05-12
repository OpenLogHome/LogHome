<template>
	<z-paging ref="paging" v-model="artData" @query="queryList">
		<view class="art">
			<view class="art-C">
				<u-tabs active-color="#000" font-size="24" :list="list" :is-scroll="false" v-model="tabIndex"
					@change="tabCl"></u-tabs>
			</view>
			<art-item v-for="items in artData" :key="items._id" :item="items" @refresh="refresh"></art-item>
		</view>
	</z-paging>
</template>

<script setup>
	import { ref } from "vue"
	import { onLoad, onReachBottom } from "@dcloudio/uni-app"
	import { apiGetAdminArt } from "@/api/api.js"
	onLoad(() => {

	})
	onReachBottom(() => {

	})
	const list = ref([
		{ name: '已审核' },
		{ name: '审核中' },
		{ name: '未通过' }
	])
	const paging = ref(null)
	const tabIndex = ref(0)
	const Audit = ref(0)
	const artData = ref([]) //圈子数据
	function tabCl(e) {
		tabIndex.value = e
		Audit.value = e
		paging.value.reload()
	}
	function refresh(){
		paging.value.reload()
	}
	function queryList(pageNo, pageSize) {
		let data = {
			pageNo,
			pageSize,
			Audit: Audit.value
		}
		apiGetAdminArt(data).then(res => {
			paging.value.complete(res.result)
		})
	}
</script>

<style lang="scss" scoped>
	.art {
		padding: 0 32rpx;
		width: 100vw;
		.art-C {
			height: 100rpx;
		}
	}
</style>