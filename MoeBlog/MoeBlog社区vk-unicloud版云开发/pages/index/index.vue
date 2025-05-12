<template>
	<z-paging ref="paging" v-model="artList" @query="queryList">
		<view class="index">
			<custom-tabbar-item>
				<template #custom>
					<view class="search" @click="Tosearch">
						<u-icon name="search" color="#E0E0E0" size="28"></u-icon>
						<text style="margin-left: 15rpx;">搜索帖子</text>
					</view>
				</template>
			</custom-tabbar-item>
			<view :style="{ height: BarHeight() + 'px' }"></view>

			<view class="name" style="margin-top: 30rpx;">推荐圈子</view>
			<view class="square-grid">
				<view class="square-grid-C" v-if="squareCommend.length > 0">
					<view class="square-grid-I">
						<view class="square-grid-I-R" @click.stop="Tosquare(squareCommend[0].id)">
							<image mode="aspectFill" :src="squareCommend[0].background"></image>
							<view class="square-grid-I-R-b">
								<image :src="squareCommend[0].avatar" mode="aspectFill"></image>
								<view>{{ squareCommend[0].name }}</view>
								<text>{{ squareCommend[0].count }}</text>
							</view>
						</view>
						<view class="square-grid-I-L" @click.stop="Tosquare(squareCommend[1].id)">
							<view class="square-grid-I-L-I">
								<image mode="aspectFill" :src="squareCommend[1].avatar"></image>
								<view>{{ squareCommend[1].name }}</view>
								<text>{{ squareCommend[1].count }}</text>
							</view>
							<view class="square-grid-I-L-I" @click.stop="Tosquare(squareCommend[2].id)">
								<image mode="aspectFill" :src="squareCommend[2].avatar"></image>
								<view>{{ squareCommend[2].name }}</view>
								<text>{{ squareCommend[2].count }}</text>
							</view>
						</view>
					</view>
					<view class="square-grid-I">
						<view class="square-grid-I-I" @click.stop="Tosquare(squareCommend[3].id)">
							<image mode="aspectFill" :src="squareCommend[3].avatar"></image>
							<view>{{ squareCommend[3].name }}</view>
							<text>{{ squareCommend[3].count }}</text>
						</view>
						<view class="square-grid-I-I" @click="ToAllSquare">
							<view>全部圈子</view>
							<u-icon name="arrow-right"></u-icon>
						</view>
					</view>
				</view>
			</view>

			<u-tabs v-if="tabsStatus" inactive-color="#000" active-color="#000" font-size="25" :list="tabList"
				:is-scroll="true" v-model="tabCurrent" @change="tabChange"></u-tabs>

			<view class="art">
				<art-item v-for="item in artList" :key="item._id" :item="item"></art-item>
			</view>
		</view>
	</z-paging>
	<uni-fab ref="fab" :pattern="fabData.pattern" :content="fabData.content" :horizontal="fabData.horizontal"
		:vertical="fabData.vertical" :direction="fabData.direction" @trigger="onFabTrigger" />
</template>

<script setup>
import { onMounted, ref } from "vue"
import { apiGetArt, apiGetIndexTax, apiGetSquareCommend } from "@/api/api";
import { onLoad, onReachBottom, onShareTimeline, onShareAppMessage } from "@dcloudio/uni-app"
import { BarHeight } from "@/utils/system";
const param = ref({ taxonmoy: "" })
const tabList = ref([
	{ name: "首页", value: "" },
	{ name: "推荐", value: "sticky" }
])
const paging = ref(null)
const tabsStatus = ref(false)
const tabCurrent = ref(0)
const artList = ref([])
const squareCommend = ref([])


const fabData = ref({
	horizontal: 'right',
	vertical: 'bottom',
	direction: 'vertical',
	pattern: {
		color: '#7A7E83',
		backgroundColor: '#fff',
		buttonColor: '#947358',
		iconColor: '#fff'
	},
	content: [{
		iconPath: '/static/fab/新建帖子.png',
		text: '帖子',
		active: false
	},
	{
		iconPath: '/static/fab/icon-圈子.png',
		text: '圈子',
		active: false
	},
	]
})

function onFabTrigger(e) {
	if(fabData.value.content[e.index].text=="帖子"){
		vk.navigateTo('/pages/art/addArt')
	}else if(fabData.value.content[e.index].text=="圈子"){
		vk.navigateTo('/pages/square/addSquare')
	}
}


onShareAppMessage((res) => {

})
//分享盆友圈
onShareTimeline((res) => {

})
onMounted(() => {
	getSquareCommend()
	getIndexTax()
})
onReachBottom(() => {

})

function Tosearch() {
	vk.navigateTo('/pages/search/search');
}

function ToArt(id) {
	vk.navigateTo('/pages/art/art?id=' + id)
}

function tabChange(e) {
	param.value.taxonmoy = tabList.value[e].value
	paging.value.reload()
}

function queryList(pageNo, pageSize) {
	param.value.pageNo = pageNo
	param.value.pageSize = pageSize
	//获取文章内容
	apiGetArt(param.value).then(res => {
		paging.value.complete(res.result)
	})
}

function getIndexTax() {
	apiGetIndexTax().then(res => {
		res.result.forEach(item => {
			let obj = {
				name: item.name,
				value: item.taxonomy_id
			}
			tabList.value.push(obj)
		})
		tabsStatus.value = true
		console.log(tabList.value)
	})
}

function getSquareCommend() {
	apiGetSquareCommend().then(res => {
		squareCommend.value = res.result
		squareCommend.value = squareCommend.value.map(item => {
			return {
				name: item.name,
				background: item.backgroundUrl,
				avatar: item.avatarUrl,
				id: item._id,
				count: item.count
			}
		})
		for (let i = 0; i < 4 - res.result.length; i++) {
			let obj = {
				name: "暂无推荐",
				background: "/static/img/default-bg.jpg",
				avatar: "/static/img/user-default.png",
				id: "",
				count: 0
			}
			squareCommend.value.push(obj)
		}
	})
}

function ToAllSquare() {
	vk.navigateTo('/pages/square/allSquare');
}

function Tosquare(id) {
	if (id === '') {
		return 0;
	}
	vk.navigateTo('/pages/square/squareInfo?id=' + id);
}
</script>

<style lang="scss" scoped>
.index {
	.search {
		@include flex;
		background: rgba(255, 255, 255, 0.8);
		border: 1px solid #EEEEEE;
		padding: 10rpx 25rpx;
		width: calc(100vw - 100rpx);
		border-radius: 10rpx;
	}

	.name {
		padding: 0 25rpx;
		font-size: 28rpx;
		font-weight: 550;
		border-left: 5rpx solid black;
	}

	.square-grid {
		padding: 25rpx;

		.square-grid-C {
			.square-grid-I {
				@include flex;

				.square-grid-I-I:nth-child(1) {
					margin-right: 15rpx;
				}

				.square-grid-I-I:nth-child(2) {
					margin-left: 15rpx;
					background: #fff;
					border: 1px solid black;
					color: #333333;
				}

				.square-grid-I-I {
					margin-top: 35rpx;
					@include flex-center;
					justify-content: space-between;
					padding: 0 25rpx;
					height: 70rpx;
					width: 100%;
					background: #333333;
					border-radius: 55rpx;
					color: #fff;
					font-size: 26rpx;
					font-weight: 550;

					view {
						margin-left: 10rpx;
					}

					image {
						width: 45rpx;
						height: 45rpx;
						border-radius: 50%;
					}

					text {
						margin-left: auto;
					}
				}

				.square-grid-I-R {
					position: relative;
					width: 48%;
					margin-right: 15rpx;
					height: 180rpx;
					background: #eee;
					border-radius: 25rpx;

					image {
						height: 180rpx;
						width: 100%;
						border-radius: 25rpx;
					}

					.square-grid-I-R-b {
						position: absolute;
						bottom: 0;
						height: 60rpx;
						width: 100%;
						background: rgba(0, 0, 0, 0.3);
						@include flex-center;
						padding: 0 25rpx;
						color: #fff;
						font-size: 26rpx;
						font-weight: 550;
						border-bottom-left-radius: 25rpx;
						border-bottom-right-radius: 25rpx;

						image {
							height: 45rpx;
							width: 45rpx;
							border-radius: 50%;
						}

						text {
							margin-left: auto;
						}

						view {
							margin-left: 15rpx;
						}
					}
				}

				.square-grid-I-L {
					margin-left: 15rpx;
					width: 48%;
					height: 180rpx;
					@include flex;
					flex-direction: column;
					justify-content: space-between;

					.square-grid-I-L-I {
						@include flex-center;
						justify-content: space-between;
						padding: 0 25rpx;
						height: 70rpx;
						width: 100%;
						background: #333333;
						border-radius: 55rpx;
						color: #fff;
						font-size: 28rpx;
						font-weight: 550;

						image {
							width: 45rpx;
							height: 45rpx;
							border-radius: 50%;
						}

						text {
							margin-left: auto;
						}

						view {
							margin-left: 15rpx;
						}
					}
				}
			}
		}
	}

	.art {
		padding: 0 25rpx;
	}
}
</style>