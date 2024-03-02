<template>
	<view class="content">
		<div class="searchBar">
		</div>
		<transition-group name="flip-list" tag="div" class="bookcase">
			<div class="bookInCase" v-for="(item,index) in booksOnShow" :key="item.novel_id"
				 :style="{animationDelay:-Math.random() + 's'}"
				 :class="{'deleted':item.deleted}">
				<bookInCase :bookName="item.name" :picUrl="item.picUrl"></bookInCase>
				<img src="../../static/icons/deletePointNew.png" v-show="item.novel_id > 0"
				 alt="" class="deletePoint" @click="deleteItem(item.novel_id,index)" style="background-color: white;">
			</div>
		</transition-group>
		<div class="underBar"></div>
	</view>
</template>

<script>
import bookInCase from '../../components/book_in_case.vue'
import uniSearchBar from '../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.vue'
import uniNavBar from '../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue'
import axios from 'axios'
export default {
	components:{
		bookInCase,uniSearchBar,uniNavBar
	},
	methods:{

		trimBookOnShow(){
			for(let i = this.booksOnShow.length; i < 9 ; i ++) {
				this.booksOnShow.push({
					name:"",
					picUrl:"",
					novel_id:-1 * Math.floor(Math.random()*2147483647)
				})
			}
		},
		refreshPage(){
			let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
			let _this = this;
			let trimBookOnShow = this.trimBookOnShow;
			axios.get(this.$baseUrl + '/bookcase/get_likes_of', {
				headers: { 
				     'Content-Type': 'application/json',//设置请求头请求格式为JSON
				     'Authorization': "Bearer " + tk //设置token 其中K名要和后端协调好
				}
			}).then((res) => {
				_this.booksOnShow=res.data;
				_this.booksOnShow.sort(function(item1,item2){
					return (Date.parse(item2.update_time) - Date.parse(item1.update_time));
				});
				trimBookOnShow();
			}).catch(function(error) {
				if(error.message == "Request failed with status code 401"){
					window.localStorage.removeItem('token');
					uni.navigateTo({
						url: './users/login?msg=' + 'unAuthorized'
					});
				}
			})
		},
		deleteItem(novel_id,index){
			let _this = this;
			let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;
			axios.post(this.$baseUrl + '/bookcase/remove_like_novel',
					{
						novel_id: novel_id
					},
					{
						headers: {
							'Content-Type': 'application/json', //设置请求头请求格式为JSON
							'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
						}
					},
				)
				.then(function(response) {
					uni.showToast({
						title: "已从书架移除",
						icon: 'none',
						duration: 2000
					});
					_this.booksOnShow[index].deleted = true;
					setTimeout(()=>{
						_this.booksOnShow.splice(index,1);
					},500);
				})
				.catch(function(error) {
					console.log(error);
					if (error) {
						uni.showToast({
							title: "移除失败",
							icon: 'none',
							duration: 2000
						});
					}
				});
		}
	},
	onShow(){
		this.refreshPage();
	},
    data(){
		return{
			booksOnShow:[],
			manageMode:false
		}
	},
	onNavigationBarButtonTap(){
		
	}
}
</script>

<style lang="scss" scoped>
	.content{
		background-color: #f2f2f2;
		font-size:30rpx;
		
	}
	@keyframes toDelete{
		0%{
			transform:matrix(1, 0, 0, 1, 0.4, 0.1);
		}
		25%{
			transform:matrix(1, 0.01, -0.01, 1, -0.1, 0);
		}
		50%{
			transform:matrix(1, 0, 0, 1, -0.4, -0.1);
		}
		75%{
			transform:matrix(1, -0.01, 0.01, 1, 0.1, 0);
		}
		100%{
			transform:matrix(1, 0, 0, 1, 0.4, 0.1);
		}
	}
	
	@keyframes deleted{
		0%{
			transform:scale(1);
		}
		100%{
			transform:scale(0);
		}
	}
	
	.bookcase {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		flex-flow: wrap;
		padding:0 20rpx;
		padding-bottom:40rpx;
	}
	.bookInCase{
		position:relative;
		animation:toDelete 0.2s linear infinite;
	}
	.bookInCase.deleted{
		animation:deleted 0.5s linear infinite;
	}
	.deletePoint{
		position:absolute;
		height:50rpx;
		top:0rpx;
		right:0rpx;
		transform: scale(.9);
	}
	div.searchBar{
		margin:0 20rpx;
		padding-top:20rpx;
	}
	div.underBar{
		height: 150rpx
	}


</style>
