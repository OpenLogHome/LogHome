<template>
	<view class="index">
		<el-row style="padding-top: 100rpx;" class="mgb48">
			<el-col :span="4" v-for="(o, index) in dataList" :key="index" :push="1" :offset="1" :pull="1">
				<view class="index-H" style="padding-left: 50rpx;">
					<view style="display: flex;align-items: center;">
						<view>
							<view style="color: #707582;margin-bottom: 25rpx;font-weight: 550;">{{o.title}}</view>
							<view style="font-weight: 550;font-size: 36rpx;">{{o.num}}</view>
						</view>
						<view style="margin-left: auto;">
							<view class="index-H-I" :style="{background:o.color}">
								<image mode="aspectFill" :src="o.img"></image>
							</view>
						</view>
					</view>
				</view>
			</el-col>
		</el-row>

		<el-row class="mgb48">
			<el-col :span="9" class="index-C pad36 bdr25" :push="1" :offset="1" :pull="1">
				<view class="ftB mgb48">每月会员注册人数</view>
				<qiun-data-charts type="line" :opts="optsOne" :chartData="chartDataOne" />
			</el-col>
			<el-col :span="9" class="index-C pad36 bdr25" :push="1" :offset="1" :pull="1">
				<view class="ftB mgb48">壁纸分类占比</view>
				<qiun-data-charts type="ring" :opts="optsTow" :chartData="chartDataTow" />
			</el-col>
		</el-row>

		<el-row class="mgb48">
			<el-col :span="19" class="index-C pad36 bdr25" :push="2">
				<view class="ftB mgb48">最新发布文章</view>
				<el-table :data="imgList" style="width: 100%">
					<el-table-column prop="_id" label="壁纸ID">
					</el-table-column>
					<el-table-column prop="date" label="壁纸预览">
						<template slot-scope="scope">
							<el-image style="width: 100px; height: 100px;border-radius: 25rpx;" :src="scope.row.pic"></el-image>
						</template>
					</el-table-column>
					<el-table-column prop="desc" label="壁纸描述" width="180">
					</el-table-column>
					<el-table-column prop="cateName" label="分类">
					</el-table-column>
					<el-table-column prop="tag" label="标签">
					</el-table-column>
					<el-table-column prop="address" label="显示壁纸">
						<template slot-scope="scope">
							<el-switch
							  v-model="scope.row.isShow"
							  disabled
							  active-color="#13ce66"
							  inactive-color="#ff4949">
							</el-switch>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
		</el-row>
	</view>
</template>

<script>
	// import { getIndexCount, getImgList,getCate,getUserCount} from "@/common/api/api.js"
	export default {
		data() {
			// 页面数据变量
			return {
				dataList: [{
						title: "文章数量",
						num: 0,
						img: "../../static/img/img1.png",
						color: "#DFE9FD"
					},
					{
						title: "圈子数量",
						num: 0,
						img: "../../static/img/img2.png",
						color: "#E3FBE7"
					},
					{
						title: "评论次数",
						num: 0,
						img: "../../static/img/img3.png",
						color: "#F1E8FE"
					},
					{
						title: "用户总数",
						num: 0,
						img: "../../static/img/img4.png",
						color: "#FAEED6"
					}
				],
				imgList: [],
				tableData: [],
				optsOne: {
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: [15, 10, 0, 15],
					dataLabel: false,
					dataPointShape: false,
					enableScroll: false,
					legend: {},
					xAxis: {
						disableGrid: true
					},
					yAxis: {
						gridType: "dash",
						dashLength: 2,
						data: [{
							min: 0,
							max: 150
						}]
					},
					extra: {
						line: {
							type: "curve",
							width: 2,
							activeType: "hollow",
							linearType: "custom"
						}
					}
				},
				optsTow: { //第二个图标的设置
					rotate: false,
					rotateLock: false,
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: [5, 5, 5, 5],
					dataLabel: true,
					enableScroll: false,
					legend: {
						show: true,
						position: "right",
						lineHeight: 25
					},
					title: {
						name: "壁纸数",
						fontSize: 15,
						color: "#666666"
					},
					subtitle: {
						name: 0,
						fontSize: 15,
						color: "#FF0230"
					},
					extra: {
						ring: {
							ringWidth: 60,
							activeOpacity: 0.5,
							activeRadius: 10,
							offsetAngle: 0,
							labelWidth: 15,
							border: true,
							borderWidth: 3,
							borderColor: "#FFFFFF",
							linearType: "custom"
						}
					}
				},
				chartDataTow: {
					series: [{
						data: [{ "name": "一班", "value": 50 }, { "name": "二班", "value": 30 },
							{ "name": "三班", "value": 20 }, { "name": "四班", "value": 18 },
							{ "name": "五班", "value": 8 }
						]
					}]
				},
				chartDataOne: {
					categories: ["2018", "2019", "2020", "2021", "2022", "2023"],
					series: [{
						name: "注册人数",
						linearColor: [
							[
								0,
								"#1890FF"
							],
							[
								0.25,
								"#00B5FF"
							],
							[
								0.5,
								"#00D1ED"
							],
							[
								0.75,
								"#00E6BB"
							],
							[
								1,
								"#90F489"
							]
						],
						data: [15, 45, 15, 45, 15, 45]
					}]
				}
			}
		},
		// 监听 - 页面每次【加载时】执行(如：前进)
		onLoad() {
			this.getCountFn()
			this.getImgListFn()
			this.getCateFn()
			this.getUserCountFn()
		},
		// 函数
		methods: {
			 getCountFn() {
				getIndexCount().then(res=>{
					this.dataList[0].num=res.wallpaperAllCount
					this.optsTow.subtitle.name=res.wallpaperAllCount
					this.dataList[1].num=res.uploadCount
					this.dataList[2].num=res.downCount
					this.dataList[3].num=res.userCount
					console.log(res)
				})
				
			},
			getImgListFn() {
				getImgList().then(res=>{
					this.imgList=res.data
					console.log(res)
				})
			},
			getCateFn(){
				getCate().then(res=>{
					this.chartDataTow.series[0].data=res.data.map(item=>{
						return {
							name:item.name,
							value:item.count
						}
					})
				})
			},
			getUserCountFn(){
				getUserCount().then(res=>{
					this.chartDataOne.categories=res.data.map(item=>{
						return item._id
					})
					this.chartDataOne.series[0].data=res.data.map(item=>{
						return item.count
					})
				})
			}
		}

	}
</script>
<style lang="scss" scoped>
	.index {
		// width: 100vw;
		height: 100vh;
		background: #F1F2F5;

		.index-H {
			background: #fff;
			padding: 80rpx 50rpx;
			border-radius: 25rpx;

			.index-H-I {
				padding: 25rpx 35rpx;
				border-radius: 30rpx;

				image {
					height: 62rpx;
					width: 62rpx;
				}
			}
		}

		.index-C {
			background: #fff;
		}
	}
</style>