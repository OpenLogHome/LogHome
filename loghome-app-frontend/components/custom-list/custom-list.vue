<template>
	<view>
		<view>
			<view>
				<view class="goodsimgInfo">
					<transition-group name="flip-list" tag="p">
						<view v-for="(item,index) in addlist" :key="item.id" class="item">
							<!-- 文字 -->
							<view class="image_bg" v-if="addlist[index].type == 'text'">
								<view style="margin-bottom: 40rpx;padding: 10rpx;">
									<textarea v-if="movementButton" auto-height placeholder-style="color:#8a8a8a" :maxlength="textLength"
										style="width:100%" placeholder="请输入文字" v-model="addlist[index].value" 
										:style="{fontSize:fontSize.fontSize}"/>
									<textarea v-else auto-height placeholder-style="color:#8a8a8a" :maxlength="textLength"
										style="width:100%" placeholder="请输入文字" disabled
										v-model="addlist[index].value" :style="{fontSize:fontSize.fontSize}"/>
								</view>
								<!-- 移动 删除 begin -->
								<btnList v-if="movementButton" :list="addlist" :mobileLocation="index" @change="listChange">
								</btnList>
								<!-- 移动 删除 end -->
							</view>
							<!-- 图片 -->
							<view class="image_bg" v-else-if="addlist[index].type == 'image'">
								<img class="imga" mode="widthFix" :src="addlist[index].img" v-reload-img="10"></img>
								<!-- 移动 删除 begin -->
								<btnList v-if="movementButton" :list="addlist" :mobileLocation="index" @change="listChange">
								</btnList>
								<!-- 移动 删除 end -->
							</view>
							<!-- 复制框 -->
							<view class="image_bg" v-else-if="addlist[index].type == 'copy'">
								<view class="center1">
									<view class="bgcolor">
										<view style="display: flex; align-items: center;">
											<image src="./static/fuzhikuang.png" style="width: 50rpx; height: 50rpx;">
											</image>
											<view class="dazi">
												<input v-model="addlist[index].name" maxlength="10"
													placeholder="复制框提示文字" :disabled="!movementButton" />
											</view>
										</view>
										<view style="display: flex; align-items: center;justify-content: space-between;">
											<view class="xiaozif">
												<input v-model="addlist[index].content" :disabled="!movementButton"  placeholder="复制内容" />
											</view>
											<button class="btnn_add" @click="fuzhi(item)"
												style="background-color: #696969;">
												一键复制
											</button>
										</view>
									</view>
								</view>
								<!-- 移动 删除 begin -->
								<btnList v-if="movementButton" :list="addlist" :mobileLocation="index" @change="listChange">
								</btnList>
								<!-- 移动 删除 end -->
							</view>
							<!-- 书籍 -->
							<view class="image_bg" v-else-if="addlist[index].type == 'novel'">
								<view class="center1">
									<view class="bgcolor" style="display:flex;">
										<view style="display: flex; align-items: center;">
											<bookInCase :bookName="addlist[index].name" :picUrl="addlist[index].picUrl"
														@click.native="changeBook(index)"></bookInCase>
										</view>
										<view>
											<textarea v-model="addlist[index].content" :disabled="!movementButton"  placeholder="请输入描述"
											 style="height:80%; background-color: #bfbfbf; margin:25rpx 0; width:55vw; border-radius: 5px;"/>
										</view>
									</view>
								</view>
								<!-- 移动 删除 begin -->
								<btnList v-if="movementButton" :list="addlist" :mobileLocation="index" @change="listChange">
								</btnList>
								<!-- 移动 删除 end -->
							</view>
						</view>
					</transition-group>
					<view class="blank_box"></view>
				</view>
			</view>
		</view>
		<view class="buy">
			<view class="buy-wrapper">
				<view class="operate">
					<view class="operate_wu" @click="add('image')">
						<image class="operate_img" src="./static/1234/tup.png"></image>
						<view>+图片</view>
					</view>
					<view class="operate_wu" @click="add('text')">
						<image class="operate_img" src="./static/1234/text.png"></image>
						<view>+文字</view>
					</view>
<!-- 					<view class="operate_wu" @click="add('copy')">
						<image class="operate_img" src="./static/1234/fuzhi.png"></image>
						<view>+复制框</view>
					</view> -->
					<view class="operate_wu" @click="add('novel')">
						<image class="operate_img" src="./static/1234/novel.png"></image>
						<view>+书链</view>
					</view>
				</view>
			</view>
		</view>
		<el-drawer
		  title="书籍选择"
		  :visible.sync="bookSelectDrawer"
		  :with-header="false"
		  :direction="'btt'"
		  size="80%">
		  <div class="searchBar" style="position:absolute; background-color: #ffe6b4; width:100%; z-index:100;">
		  	<uni-search-bar bgColor="#ffffff" :radius="0" @input="searchLibrary"
		  					placeholder = "搜索书库" cancelButton="none">
		  		<img src="../../static/icons/icon_search.png" alt="" slot="searchIcon" style="height:25px;">
		  		<img src="../../static/icons/icon_r_x.png" alt="" slot="clearIcon" style="height:20px;">
		  	</uni-search-bar>
		  </div>
		  <div style="height:52px; width:100%;"></div>
		  <navigator v-for="item in [...searchBooks]" :key="item.novel_id"
		  		   @click="selectBook(item)">    
		  	<div class="books">
		  		<img :src="item.picUrl + '?thumbnail=1'" alt=""
		  		:onerror="`onerror=null;src='`+ $backupResources.bookCover +`'`">
		  		<div class="bookInfo">
		  			<div class="title">{{item.name}}</div>
		  			<view class="author">
		  				<img :src="item.auther_avatar" alt="" class="auther_avatar"
		  				onerror="onerror=null;src='../static/user/defaultAvatar.jpg'">
		  				<div class="auther_name">{{item.author_name}}</div>
		  			</view>
		  			<div class="description">{{item.content}}</div>
		  		</div>
		  	</div>
		  </navigator>
		</el-drawer>
	</view>
</template>

<script>
	import btnList from './components/btn-list/btn-list.vue'
	import reloadimg from '../../lib/reload_img.js'
	import bookInCase from '../book_in_case.vue'
	import axios from "axios"
	export default {
		name: 'custom-list',
		components: {
			btnList,bookInCase
		},
		props: {
			movementButton: {
				type: [Boolean],
				default: true
			},
			fontSize: {
				type: [Object],
				default: () => {
					return {fontSize:32 + 'rpx'}
				}
			},
			textLength:{
				type: [Number],
				default: -1
			}
		},
		data() {
			return {
				addlist: [],
				additem: {
					image: { //添加图片
						img: '',
						type: 'image'
					},
					text: { //添加文字
						value: '',
						type: 'text',
					},
					copy: { //添加复制文本框
						name: '',
						content: '',
						type: 'copy',
					},
					novel: { //添加小程序跳转框
						novel_id: undefined,
						name:"未选择书籍",
						picUrl:"",
						content: "",
						type: 'novel',
					}
				},
				bookSelectDrawer:false, //是否打开书籍选择抽屉
				bookSelectItemIndex:undefined ,//即将需要选择书籍的书链item的index
				timer:undefined,
				searchBooks:[] //搜索到的书
			}
		},
		watch: {
			addlist:{
				handler(newlist, oldlist) {
					this.$emit("on-change", newlist)
				},
				deep:true
			}
		},
		mounted(){
		},
		methods: {
			//新增项目
			async add(type) {
				let item;
				switch (type) {
					// 进行image添加操作
					case "image":
						this.additem.image.img = await this.addimage();
						item = this.jsonCopy(this.additem.image);
						item.id = Math.floor(Math.random()*1000000);
						this.addlist.push(item);
						break;
					case "text":
						item = this.jsonCopy(this.additem.text);
						item.id = Math.floor(Math.random()*1000000);
						this.addlist.push(item);
						break;
					case "copy":
						item = this.jsonCopy(this.additem.copy);
						item.id = Math.floor(Math.random()*1000000);
						this.addlist.push(item);
						break;
					case "novel":
						item = this.jsonCopy(this.additem.novel);
						item.id = Math.floor(Math.random()*1000000);
						this.addlist.push(item);
						break;
				}
			},
			/**
			 * @description 简单深拷贝
			 * @param {Object} data 被拷贝数据
			 * @return {Object} data 被拷贝数据
			 * */
			jsonCopy(data) {
				return JSON.parse(JSON.stringify(data))
			},
			// 上传图片 
			addimage() {
				return new Promise((resolve) => {
					uni.chooseImage({
						count: 1, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album'], //从相册选择
						success: (res) => {
							uni.showLoading({
								title:"上传图片中"
							})
							uni.uploadFile({
								url: 'https://img.codesocean.top/upload/img', //直接上传到原木的图片后台
								filePath: res.tempFilePaths[0],
								name: 'img',
								header:{
									apikey:"45qEQfILCQ3tAXxmUJF8O562bJU2D0"
								},
								success: (uploadFileRes) => {
									let data = JSON.parse(uploadFileRes.data);
									setTimeout(()=>{
										resolve(data.url);
										uni.hideLoading();
										uni.showToast({
											title:"上传完毕，等待处理"
										})
									},1000)
								}
							});
							
						}
					});
				}).catch(() => {})
			},
			listChange(data) {
				this.addlist = data.list
			},
			/**
			 * @description  复制
			 * @param {Object} item 需要复制的内容 
			 * */
			fuzhi(item) {
				uni.setClipboardData({
					data: item.content,
					success: function() {
						// 添加下面的代码可以复写复制成功默认提示文本`内容已复制` 
						uni.showToast({
							title: '复制成功',
							duration: 5000
						})
						uni.getClipboardData({
							success: function(res) {}
						});
					}
				});
			},
			reInit(code){
				this.addlist = JSON.parse(code);
			},
			//重选书链的书籍
			changeBook(index){
				this.bookSelectItemIndex = index;
				this.bookSelectDrawer = true;
			},
			//搜索书库，这个方法与library.vue的一致
			searchLibrary(e){
				clearTimeout(this.timer);
				let _this = this;
				this.timer= setTimeout(()=>{
					axios.get(_this.$baseUrl + '/library/get_novels_search?keyword=' + e, {}).then((res) => {
						_this.searchBooks = res.data;
					}).catch(function (error) {
						uni.showToast({
							title: error.toString(),
							icon:'none',
							duration: 2000
						});
					}).then(function(){
						uni.hideLoading();
					})
				},500)
			},
			//选择书籍
			selectBook(book_item){
				console.log(book_item);
				this.addlist[this.bookSelectItemIndex].novel_id = book_item.novel_id;
				this.addlist[this.bookSelectItemIndex].name = book_item.name;
				this.addlist[this.bookSelectItemIndex].picUrl = book_item.picUrl;
				this.bookSelectDrawer = false;
			}
		}
	}
</script>

<style scoped lang="scss">
	
	.center1 {
		// width: 100%;
		// margin: 10rpx auto;
		margin-bottom: 40rpx;

		.bgcolor {
			background-color: #ffffff;
			border-radius: 10rpx;
			padding: 30rpx 15rpx 30rpx 15rpx;

			.wenzi {
				margin-top: 10rpx;
				margin-left: 10rpx;
				width: 300rpx;

				.dazi {
					font-weight: bold;
					font-size: 30rpx;
					width: 330rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.xiaozi {
					font-size: 24rpx;
					font-weight: 100;
					width: 330rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

			}

			.xiaozif {
				text-align: center;
				width: 360rpx;
				font-size: 30rpx;
				font-weight: 100;
				padding: 10rpx 25rpx 10rpx 25rpx;
				background-color: #dadada;
				border-radius: 10rpx;
				margin-right: 20rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.btnn_add {
				color: #FFFFFF;
				// padding: 5rpx 25rpx 5rpx 25rpx;
				float: right;
				// width: 140rpx;
				height: 70rpx;
				font-size: 26rpx;
				text-align: center;
				line-height: 70rpx;
				border-radius: 50rpx;
				background-color: #18B566;
			}
		}
	}

	.app {
		.textarea {
			background: #FFFFFF;
			width: 100%;
			padding: 40upx 40upx;
			border: 1upx solid #f3f3f3;
			font-size: 32upx;
			height: 220upx;
			box-sizing: border-box;

			textarea {
				width: 100%;
				height: 100%;
			}
		}

	}

	.goodsimgInfo {
		padding: 20upx;
		box-sizing: border-box;
		.item{
			width:calc(100vw - 40upx);
			.image_bg {
				padding: 10rpx 10rpx;
				border-radius: 20rpx;
				margin-top: 20upx;
				background: #f3f3f3;
				position: relative;
				
				.imga {
					width: 100%;
					margin-bottom: 70rpx;
					display: block;
				}
			
			
			}
		}
		

	}

	.buy {

		padding: 20rpx 0;
		position: fixed;
		bottom: 0;
		background-color: #FFFFFF;
		border-top: 1rpx solid #C8C7CC;
		z-index: 100;
		width: 100%;

		.buy-wrapper {
			display: flex;
			align-items: center;
			justify-content: space-around;

			.operate {
				display: flex;
				// position: fixed;
				// z-index: 999;
				background: #FFFFFF;
				// box-sizing: border-box;
				width: 100%;

				// bottom: 0;
				.operate_wu {
					width: 100rpx;
					margin: 0 auto;
					text-align: center;
					font-size: 20rpx;
					color: #707070;

					.operate_img {
						width: 60rpx;
						height: 60rpx;
					}
				}
			}
		}
	}

	.flip-list-item {
		transition: all .5s;
		display: inline-block;
		margin-right: 10px;
	}
	.flip-list-enter-active, .flip-list-leave-active {
	  transition: all .5s;
	  position:absolute;
	}
	.flip-list-enter, .flip-list-leave-to
	/* .list-leave-active for below version 2.1.8 */ {
	  opacity: 0;
	  transform: translateY(30px);
	}
	.flip-list-move {
	  transition: transform .5s;
	}
	
	.blank_box{
		height:200rpx;
	}
	
	.books {
		height: 240rpx;
		width: 100vw;
		border-bottom: #d0c5b1 1rpx solid;
		display: flex;
		background-color:rgb(255, 248, 234);
		
		img {
			height: 210rpx;
			width: 161.63rpx;
			border:#cacaca 1rpx solid;
			border-radius: 7rpx;
			margin:15rpx;
		}
		.bookInfo {
			margin-left:15rpx;
			margin-top: 22rpx;
			.title{
				font-size: 35rpx;
				height:42rpx;
				margin-bottom: 10rpx;
				overflow: hidden;
				font-weight: bold;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				color:rgb(113, 52, 24);
				margin:5rpx;
			}
			.author{
				position:relative;
				margin-top:15rpx;
				margin-bottom:10rpx;
				.auther_avatar{
					position:absolute;
					top:-17rpx;
					left:-10rpx;
					height:35rpx;
					width:35rpx;
					border-radius: 10rpx;
				}
				.auther_name{
					font-size: 25rpx;
					// font-weight: bold;
					color:rgb(113, 52, 24);
					margin-left:47rpx;
				}
			}
			
			.description{
				font-size: 25rpx;
				color:rgb(157, 157, 157);
				height:100rpx;
				margin:5rpx;
				margin-right:40rpx;
				overflow: hidden;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 3;
			}
		}
	}

</style>
