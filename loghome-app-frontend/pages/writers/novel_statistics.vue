<template>
    <view class="outer">
		<div class="chart" v-for="statistic_type in Object.keys(statistics)||[]">
			<histogram-chart
			    :dataAs="statistics[statistic_type]"
			    :canvasId="statistic_type"
			    labelKey="labels"
			    valueKey="values"
			    :yAxisAs="{
			        formatter: {
			            type: 'number' //type:number percent String,额外参数:fixed:NUmber,name:String
			        }
			    }"
				:basicAs="{
					fontSize: 15,
					colors:['#ea7034'],
				}"
			/>
			<view style="text-align: center;line-height: 40px; font-size:35rpx;">近30天{{translation[statistic_type]}}</view>
		</div>
    </view>
</template>
<script>
	import axios from 'axios'
	import HistogramChart from '@/components/stan-ucharts/HistogramChart.vue';
	export default {
	    name: 'Index',
	    components: {
	        HistogramChart
	    },
	    data() {
	        return {
	            histogramData2: {
	                //柱状图Compent  //label应为series value 应为
	                label: ['2052', '2013', '2014', '2015', '2016', '2017', '2018'],
	                value: [
	                    {
	                        name: 'labelKey改变',
	                        data: [0.3, 0.2, 0.5, 0.4, 0.3, 0.1, 0.2]
	                    }
	                ]
	            },
				novel_id:-1,
				statistics:{},
				translation:{
					'clicks':'阅读量',
					'nices':'点赞数',
					'likes':'收藏数',
					'comments':'评论数',
					'tippings':'打赏值'
				}
	        }
	    },
		onLoad(params){
			let _this = this;
			if(params.id){
				this.novel_id = params.id;
			} else {
				uni.navigateBack({});
			}
			axios.get(this.$baseUrl + '/articles/get_novel_specific_statistics?novel_id=' + this.novel_id
			).then((res) => {
				let statistics = res.data;
				for(let item of statistics){
					delete item.novel_id;
					delete item.statistic_date;
				}
				let time=(new Date).getTime();
				let day = new Date(time-24*60*60*1000); // 获取当天的数据
				let dateLabels = [];
				for(let i = 0 ; i < statistics.length; i ++){
					let nday = new Date(day - i * 24*60*60*1000)
					nday=(nday.getMonth()> 9 ? (nday.getMonth() + 1) : "0" + (nday.getMonth() + 1)) + "-" +(nday.getDate()> 9 ? (nday.getDate()) : "0" + (nday.getDate()));
					dateLabels.push(nday);
				}
				dateLabels.reverse();
				for(let key of Object.keys(statistics[0])){
					_this.statistics[key] = {
						labels:JSON.parse(JSON.stringify(dateLabels)),
						values:[
							{
								name:_this.translation[key],
								data:[]
							}
						]
					}
				}
				for(let item of statistics){
					for(let key of Object.keys(statistics[0])){
						_this.statistics[key].values[0].data.push(item[key]);
					}
				}
				_this.$forceUpdate();
				console.log(_this.statistics);
			}).catch(function (error) {
				console.log(error);
				if(error.message == "Request failed with status code 401"){
					window.localStorage.removeItem('token');
					this.$isFromLogin = true;
					uni.navigateTo({
						url: './users/login?msg=' + 'unAuthorized'
					});
				} else {
					uni.showToast({
						title: "获取书籍数据失败",
						icon:'none',
						duration: 2000
					});
				}
			}).then(function(){
				uni.hideLoading();
			})
		}
	}
</script>

<style scoped>
	
	.outer{
		background-color: rgb(255,248,234);
	}
	
	.chart{
		padding:50rpx 0;
	}
	
</style>