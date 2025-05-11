<template>
	<z-paging ref="paging" v-model="artData" @query="queryList">
		<view class="myArt">
			<view class="myArt-C">
				<u-tabs active-color="#000" font-size="24" :list="tabList" :is-scroll="false" v-model="currentIndex"
					@change="Tabchange"></u-tabs>
				<art-item v-for="items in artData" :key="items._id" :item="items"></art-item>
			</view>
		</view>
	</z-paging>
</template>

<script setup>
	import { ref } from "vue"
	import { onLoad, onShow, onReachBottom } from "@dcloudio/uni-app"
	import { apiGetUserArt } from "@/api/api.js"
	const tabList = ref([{ name: '已发布' }, { name: '审核中' }, { name: '未通过' }])
	const currentIndex = ref(0)
	const artData = ref([]) //圈子数据
	const paging=ref(null)
	onLoad(() => {
		
	})
	onReachBottom(() => {
		
	})

	function Tabchange(e) {
		currentIndex.value = e
		paging.value.reload()
	}

	function queryList(pageNo, pageSize) {
		let obj = {
			pageNo, 
			pageSize,
			Audit: currentIndex.value
		}
		apiGetUserArt(obj).then(res => {
			paging.value.complete(res.result)
		})
	}
</script>

<style lang="scss">
	.myArt {
		width: 100vw;
		.myArt-C {
			padding: 25rpx;

			.empty {
				padding-top: 250rpx;
			}
		}
	}
</style>