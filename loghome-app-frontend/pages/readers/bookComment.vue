<template>
	<view class="commentOuter" :style="{'--statusBarHeight': jsBridge.inApp ? jsBridge.statusBarHeight + 'px' : 0 + 'px'}">
		<z-paging ref="paging" v-model="reviews" @query="refreshPage" :style="{'marginTop': jsBridge.inApp ? jsBridge.statusBarHeight + 'px' : 0 + 'px'}">
			<nothing :msg="'还没有评论哦\n快来抢沙发吧~'" slot="empty"></nothing>
			<div v-if="paragraphId != undefined" style="background-color: #e6e6e6; padding: 10px; margin: 5px 0; font-size: 14px;" @click="navToChapter">
				<svg t="1708145570940" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2306" width="14" height="14" style="margin: 0 5px 0 0;"><path d="M128 472.896h341.344v341.344H128zM128 472.896L272.096 192h110.08l-144.128 280.896z" fill="#8a8a8a" p-id="2307"></path><path d="M544 472.896h341.344v341.344H544zM544 472.896L688.096 192h110.08l-144.128 280.896z" fill="#8a8a8a" p-id="2308"></path></svg>
				<div class="cento" style="margin-top: 10rpx; color: #4b4b4b; padding: 0 30rpx;">
					{{paragraph}}
				</div>
			</div>
			<view class="comments">
				<commentItem v-for="item in reviews" :reviewMsg="item" :key="item.essay_comment_id"
				@childReview="childReview($event)" @refresh="refreshPage(1,10)" :paragraphMode="paragraphId"></commentItem>
			</view>
			<view class="blank_box"></view>
		</z-paging>

		<view class="reply">
			<textarea type="text" auto-height :placeholder="commentPlaceholder" 
			maxlength="300" v-model="commentText"
			@focus="textFocus" @blur="textBlur"></textarea>
			<view class="icon"><uni-icons type="redo-filled" size="30" color="#EA7034"
			@click="submitComment" :focus="isFocus"></uni-icons></view>
		</view>
	</view>
</template>

<script>
	import nothing from '../../components/nothing.vue'
	import axios from 'axios'
	import commentItem from "../../components/dl-review/item.vue"
	export default {
		components: {
			commentItem,nothing
		},
		data() {
			return {
				novelId:0,
				reviews:[],
				commentText:"",
				commentPlaceholder:"发一条友善的评论",
				replyToId:-1,
				isFocus:false,
				fatherId:-1,
				articleId: undefined,
				paragraphId: undefined,
				paragraph: undefined
			}
		},
		onLoad(params){
			this.novelId = params.id;
			if(params.articleId){
				this.articleId = params.articleId;
				uni.setNavigationBarTitle({
					title: "章节评论"
				})
				if(params.paragraphId){
					this.paragraphId = params.paragraphId;
					this.loadParagraphInfo();
					uni.setNavigationBarTitle({
						title: "段落评论"
					})
				}
			}
		},
		methods:{
			utc2beijing(utc_datetime) {
			    // 转为正常的时间格式 年-月-日 时:分:秒
			    var T_pos = utc_datetime.indexOf('T');
			    var Z_pos = utc_datetime.indexOf('Z');
			    var year_month_day = utc_datetime.substr(0,T_pos);
			    var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
			    var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06
			
			    // 处理成为时间戳
			    timestamp = new Date(Date.parse(new_datetime));
			    timestamp = timestamp.getTime();
			    timestamp = timestamp/1000;
			
			    // 增加8个小时，北京时间比utc时间多八个时区
			    var timestamp = timestamp+8*60*60;
			
			    // 时间戳转为时间
			    var beijing_datetime = this.timeConvert(new Date(parseInt(timestamp) * 1000))
			    return beijing_datetime; // 2017-03-31 16:02:06
			},
			async refreshPage(pageNo,pageSize){
				uni.showLoading({
					title: '加载中'
				});
				let reviewDatas = [];
				let _this = this;
				await axios.get(this.$baseUrl + "/community/novel_commonts_all?id=" + this.novelId
				+ "&page=" + pageNo + "&pageSize=" + pageSize + ((this.articleId!= undefined) ? `&articleId=${this.articleId}` : ''))
				.then(async (res)=>{
					let data = res.data;
					console.log(data)
					if(_this.paragraphId) {
						data = data.filter((item) => {
							return item.cento && item.cento.paragraph_id == _this.paragraphId
						})
					}
					console.log(data);
					for(let item of data){
						reviewDatas.push(item)
						await axios.get(this.$baseUrl + "/community/novel_commonts_reply_to?id=" + item.essay_comment_id)
						.then((res)=>{
							let data = res.data;
							for(let subItem of data){
								reviewDatas.push(subItem)
							}
							
						}).catch((err)=>{
							uni.showToast({
								title: "评论信息获取失败",
								icon:'none',
								duration: 2000
							});
						})
					}
				}).catch((err)=>{
					uni.showToast({
						title: "评论信息获取失败",
						icon:'none',
						duration: 2000
					});
				})
				
				function findTargetUserName(reply_to_id){
					for(let item of reviewDatas){
						if(item.essay_comment_id == reply_to_id){
							return item.name;
						}
					}
				}
				let reviews = [];
				for(let item of reviewDatas){
					// console.log(item);
					if(item.father_comment_id == -1){
						console.log(item);
						let commentItem = {
							author_id:item.author_id,
							comment_id:item.essay_comment_id,
							headImgSrc: item.avatar_url,
							userName :item.name,
							userId : item.user_id,
							sendTime:_this.utc2beijing(item.comment_time),
							sendMsg:item.content,
							likeNum:item.likeNum,
							reviewLess:[],
							reviewNum:0,
							article_id: item.article_id,
							cento_id: item.cento_id,
							cento: item.cento
						}
						
						for(let subItem of reviewDatas){
							if(subItem.father_comment_id == item.essay_comment_id){
								commentItem.reviewLess.push({
									comment_id:subItem.essay_comment_id,
									userName:subItem.name,
									userId : subItem.user_id,
									targetUserName:findTargetUserName(subItem.reply_to_id),
									sendMsg:subItem.content,
									article_id: item.article_id
								})
							}
						}
						reviews.push(commentItem);
						// console.log("commentItem",commentItem);
					}
				}
				this.$refs.paging.complete(reviews);
				uni.hideLoading();
			},
			submitComment(){
				let _this = this;
				if(this.commentText == "") return;
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				//console.log(tk);
				if(this.replyToId == -1){
					axios.post(this.$baseUrl + '/community/comment_on_novel',
						{
							novel_id: this.novelId,
							content: this.commentText,
							article_id: this.articleId != undefined ? this.articleId : 0,
							paragraph_id: this.paragraphId != undefined ? this.paragraphId : undefined,
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
							title: "发表成功",
							icon: 'none',
							duration: 2000
						});
						_this.refreshPage(1,10);
						_this.commentText = "";
					})
					.catch(function(error) {
						if (error) {
							uni.showToast({
								title: "发表失败",
								icon: 'none',
								duration: 2000
							});
						}
					});
				} else {
					axios.post(this.$baseUrl + '/community/reply_to_novel_comment',
						{
							essay_comment_id:this.replyToId,
							novel_id: this.novelId,
							content: this.commentText,
							fatherId: this.fatherId,
							article_id: this.articleId != undefined ? this.articleId : 0
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
							title: "发表成功",
							icon: 'none',
							duration: 2000
						});
						_this.refreshPage(1,10);
						_this.commentText = "";
					})
					.catch(function(error) {
						if (error) {
							uni.showToast({
								title: "发表失败",
								icon: 'none',
								duration: 2000
							});
						}
					});
				}
			},
			loadParagraphInfo() {
				axios.get(this.$baseUrl + '/articles/get_article?id=' + this.articleId).then((res) => {
					let article = res.data[0];
					article.content = JSON.parse(article.content);
					for(let item of article.content){
						if(item.id == this.paragraphId) {
							this.paragraph = item.value;
							break;
						}
					}
				}).catch(function(error) {
					console.log(error);
					if (error) {
						uni.showToast({
							title: "获取文章信息失败",
							icon: 'none',
							duration: 2000
						});
					}
				}).then(function() {
					uni.hideLoading();
				})
			},
			childReview(item){
				this.replyToId = item.review.comment_id;
				this.fatherId = item.father;
				this.commentPlaceholder = "回复 " + item.review.userName + "：";
				
			},
			textFocus(){
				
			},
			textBlur(){
				this.commentPlaceholder = "发一条友善的评论";
				setTimeout(()=>{
					this.replyToId = -1;
				},300)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.commentOuter{
		background-color: rgb(255, 248, 234);
		.comments{
			
		}
		.reply{
			position:fixed;
			background-color: #f2f2f2;
			border-top: 1rpx rgb(195, 195, 195) solid;
			bottom:0;
			width:100vw;
			display:flex;
			z-index: 150;
			textarea{
				margin:20rpx;
				padding:20rpx;
				border-radius: 15rpx;
				background-color: rgba(127, 127, 127, 0.2);
				font-size:35rpx;
				line-height: 35rpx;
				color:rgb(113, 113, 113)
			}
			.icon{
				height:100%;
				padding-top:25rpx;
			}
		}
		
		.blank_box{
			height:calc(125rpx + 100rpx);
		}
	}
</style>
