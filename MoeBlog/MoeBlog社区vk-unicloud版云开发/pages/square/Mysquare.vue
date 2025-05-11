<template>
	<z-paging ref="paging" v-model="squareData" @query="queryList">
		<view class="Mysquare">
			<view class="Mysquare-C">
				<u-tabs active-color="#000" font-size="24" :list="tabList" :is-scroll="false" v-model="currentIndex"
					@change="Tabchange"></u-tabs>
				<Mysquare-item v-for="(item,index) in squareData" :key="item._id" :item="item"></Mysquare-item>
			</view>
		</view>
	</z-paging>
</template>

<script setup>
	import { ref } from "vue"
	import { onLoad } from "@dcloudio/uni-app"
	import { apiGetSquareAll } from "@/api/api.js"
	onLoad(() => {
		
	})
	const tabList = ref([{ name: '已通过' }, { name: '审核中' }, { name: '未通过' }])
	const currentIndex = ref(0)
	const squareData = ref([]) //圈子数据
	const paging=ref(null)


	function Tabchange(e) {
		currentIndex.value = e
		paging.value.reload()
	}

	function queryList() {
		apiGetSquareAll({ Audit: currentIndex.value }).then(res => {
			paging.value.complete(res.result.rows)
		})
	}
</script>

<style lang="scss">
	.Mysquare {
		width: 100vw;
		.Mysquare-C {
			
		}
	}
</style>