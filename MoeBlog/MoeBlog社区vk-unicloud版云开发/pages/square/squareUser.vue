<template>
	<z-paging ref="paging" v-model="dataList" @query="queryList">
		<view class="square_User">
			<user-item v-for="item in dataList" :key="item._id" :item="item"></user-item>
		</view>
	</z-paging>
</template>

<script setup>
	import { ref } from "vue"
	import { onLoad, onReachBottom } from "@dcloudio/uni-app"
	import { apiGetSquareUser } from "@/api/api.js"
	onLoad((id) => {
		square_id.value = id.id
	})
	onReachBottom(() => {
		
	})
	const square_id = ref("")
	const title = ref("")
	const dataList = ref([])
	const paging=ref(null)
	function queryList(pageNo, pageSize) {
		let data = {
			pageNo,
			pageSize,
			square_id: square_id.value
		}
		apiGetSquareUser(data).then(res => {
			paging.value.complete(res.result.rows)
		})
	}
</script>

<style lang="scss">
	.square_User {
		.title {
			padding: 25rpx 0;
			@include flex-center;
			font-size: 28rpx;
			font-weight: 550;
		}

		.user-item {
			padding: 0 25rpx;
		}
	}
</style>