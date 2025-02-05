<template>
	<view class="body" :style="{'--statusBarHeight': jsBridge.inApp ? jsBridge.statusBarHeight + 'px' : 0 + 'px'}">
		<!-- 	<el-alert
		title="提示"
		type="warning"
		class="alert"
		:closable="false"
		close-text="知道了"
		description="近期部分用户反馈APP端在一些手机上无法正常上传图片,如果您遭遇了相似情形,请前往网页端 http://loghome.codesocean.top 更换图片,给您造成的不便我们深感歉意!"
		show-icon
		v-show="$store.state.appVersion">
	</el-alert> -->
		<image id="img" :src="url" @load="imgLoad" :style="{
			width: imgWidth+'px',
			height: imgHeight+'px',
			transform: 'translate('+imgX+'px,'+imgY+'px) rotate('+imgRotate+'deg) scale('+imgScale+')',
			'transition-duration': imgTransition,
			'transform-origin': imgOrigin
		}" />
		<canvas id="touch" canvas-id="myCanvas" @touchstart="touchstart" @touchmove="touchmove"
			@touchend="touchend"></canvas>
		<view id="clipArea">
			<view class="top"></view>
			<view class="bottom"></view>
			<view class="left"></view>
			<view class="right"></view>
		</view>
		<view id="bottom">
			<view @click="jiazaiImg">{{!url ? '选择图片' : '重新选择'}}</view>
			<view @click="xvanzhuan">{{bottomText_2}}</view>
			<view @click="yulan">{{bottomText_3}}</view>
			<view @click="jieqv">{{bottomText_4}}</view>
		</view>
		<view class="tanchuang" v-show="yulanPicSrc !== ''">
			<view class="alert notitle">
				<view class="title"></view>
				<view class="content" style="padding-top: 70rpx;padding-bottom: 70rpx;">
					<view :style="{backgroundImage: 'url(\''+yulanPicSrc+'\')'}" class="img zheng"></view>
					<view :style="{backgroundImage: 'url(\''+yulanPicSrc+'\')'}" class="img yuan"></view>
				</view>
				<view class="bottom line">
					<view class="vertical_line" @click="yulanPicSrc = ''">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import axios from 'axios'
	let clipAreaOffsetLeft, clipAreaOffsetRight, clipAreaOffsetTop, clipAreaOffsetBottom, //截取框相对于视口的左右上下角位置【不含边框】
		clipAreaClientWidth, clipAreaClientHeight, //整个截取框的宽高【不含边框】
		borderWidth = 1, //边框的宽度
		anxiaY, anxiaX,
		start, //触摸屏幕的手指数量，可用于缩放图片
		scale, //图片的缩放倍率
		yuanMarginTop, yuanMarginLeft, //在手指按下时，原本图片左上角的位置
		img_yuanshi_width, img_yuanshi_height, //图片原始的宽高【用于放大】
		imageRotate = 0, //本次要旋转的角度【0,90,180,270】
		isPx = navigator.userAgent.indexOf('Mobile') === -1;
	export default {
		data() {
			return {
				imgX: 0,
				imgY: 0,
				imgWidth: 0,
				imgHeight: 0,
				imgTransition: '0ms',
				imgScale: 1,
				imgOrigin: '', //旋转中心点
				imgRotate: 0, //图片的旋转角度【0,90,180,270,n】css只要不断的叠加才能实现同一个方向的旋转

				bottomText_2: '旋转',
				bottomText_3: '预览',
				bottomText_4: '上传',
				url: '../../static/i/touxiang/212.jpg',
				yulanPicSrc: '', //预览图
				pixelRatio: 1,
				bodyLeftWidth: 0
			}
		},
		methods: {
			X_AND_Y: function() { //默认定位
				return [clipAreaOffsetLeft, clipAreaOffsetTop]
			},
			widht_AND_height: function() { //默认宽高【判断是宽度小还是高度小，拿小的一方来调整】
				var width, height
				if (img_yuanshi_width < img_yuanshi_height) {
					width = clipAreaClientWidth;
					height = img_yuanshi_height / (img_yuanshi_width / clipAreaClientWidth)
				} else {
					width = img_yuanshi_width / (img_yuanshi_height / clipAreaClientHeight)
					height = clipAreaClientHeight;
				}
				return [width, height]
			},
			imgLoad: function(e) { //理论上在选择图片后获取宽高会更好一点，不过在图片加载之后获取，可以实现图片为url的链接形式
				//图片原始宽度
				img_yuanshi_width = e.detail.width,
					img_yuanshi_height = e.detail.height;
				//默认宽高
				[this.imgWidth, this.imgHeight] = this.widht_AND_height();
				//默认定位【根据旋转的角度，做选择】
				[this.imgX, this.imgY] = this.X_AND_Y();
				//旋转的中心点
				var x = Math.min(this.imgWidth, this.imgHeight) / 2;
				this.imgOrigin = x + 'px ' + x + 'px';
			},
			upData: function(e) { //手指按下时、或手指离开时。更新多个变量的值
				if (isPx === true || e.touches.length === 1) {
					if (isPx === true) { //pc端
						anxiaY = e.y, //按下时，第一只手的位置
							anxiaX = e.x;
					} else {
						anxiaY = e.touches[0].y, //按下时，第一只手的位置
							anxiaX = e.touches[0].x;
					}
					yuanMarginTop = this.imgY, //按下时图片的位置
						yuanMarginLeft = this.imgX,
						scale = this.imgScale; //按下时图片的缩放比例
				} else if (e.touches.length === 2) {
					start = e.touches //记录所有手指按下时的位置
				}
			},
			touchstart: function(e) { //手指按下
				if (this.bottomText_2 === '旋转') {
					this.imgTransition = '50ms';
					this.upData(e);
				}
			},
			touchmove: function(e) { //手指移动
				if (anxiaY === undefined) {
					return
				} else if (isPx === true || e.touches.length === 1) {
					//图片小于等于图片框时，在移动图片要缓慢一些
					var [width, height] = this.imgWidht_AND_imgHeight();
					var widthBeishu = width <= clipAreaClientWidth ? 0.5 : 1,
						heightBeishu = height <= clipAreaClientHeight ? 0.5 : 1;
					//改变css平移属性，来实现移动
					this.imgY = ((((isPx ? e.y : e.touches[0].y) - anxiaY) * heightBeishu) +
					yuanMarginTop); //垂直移动了多少个像素 * 移动的速度 + 图片原本定位的位置
					this.imgX = ((((isPx ? e.x : e.touches[0].x) - anxiaX) * widthBeishu) + yuanMarginLeft);
				} else if (e.touches.length === 2) { //缩放
					//rotation = this.getAngle(e.touches[0],e.touches[1]) - this.getAngle(start[0],start[1]);//得到旋转角度，这个可以实现手势旋转
					var linshi = scale * (this.getDistance(e.touches[0], e.touches[1]) / this.getDistance(start[0],
						start[1]));
					if (linshi > 0.4 && linshi < 5) {
						this.imgScale = linshi;
					}
				}
			},
			touchend: function(e) { //手指离开！！！这里的手机屏幕有多少几手指，就会触发多少次
				if (isPx === true || e.touches.length === 0) { //全部手指，均已离开
					anxiaY = undefined;
					if (this.imgScale < 1) {
						this.imgScale = 1;
					}
					this.huitan(); //触发回弹
				}
				this.upData(e);
			},
			imgWidht_AND_imgHeight: function() { //计算图片的宽度和高度
				return [([0, 180].indexOf(imageRotate) > -1 ? this.imgWidth : this.imgHeight) * this.imgScale,
					([0, 180].indexOf(imageRotate) > -1 ? this.imgHeight : this.imgWidth) * this.imgScale
				]
			},
			imgLeft_AND_imgTop: function(width,
			height) { //【计算图片的左上定位】。有些同学看了之后就问啦！为什么不直接获取元素的布局信息，布局信息也有宽高和定位啊，而要大费周章的计算呢。那是因为直接获取元素布局信息，需要等元素的某些动画结束之后才能获取，例如，图片放小之后，缩放比例就要调整回100%并且可能还要靠边。那这时候靠边就得在缩放动画完成之后才能执行，所以两个动画就不能一起执行了。
				//获取原始的【基于旋转角度为0°】【基于100%的缩放】
				var left = this.imgX,
					top = this.imgY;
				//旋转之后，位置是不一样的，得重新计算
				if (this.imgWidth < this.imgHeight) { //图片比较高
					if (imageRotate === 90) {
						left = (left + height) - width
					} else if (imageRotate === 180) {
						top = (top + width) - height
					}
				} else if (this.imgHeight < this.imgWidth) { //图片比较长
					if (imageRotate === 180) {
						left = (left - width) + height
					} else if (imageRotate === 270) {
						top = (top - height) + width
					}
				}
				//缩放之后，位置是不一样的，得重新计算
				left -= (Math.min(this.imgWidth, this.imgHeight) / 2) * (this.imgScale -
					1) //为什么要取宽高中的最小值呢？大概率跟旋转中心点有关【没试验，猜的】
				top -= (Math.min(this.imgWidth, this.imgHeight) / 2) * (this.imgScale - 1)
				return [left, top]
			},
			huitan: function() {
				this.imgTransition = '400ms';
				var [width, height] = this.imgWidht_AND_imgHeight();
				//图片的左右上下位置
				var [imgOffsetLeft, imgOffsetTop] = this.imgLeft_AND_imgTop(width, height);
				var imgOffsetRight = imgOffsetLeft + width, //左边定位 + 元素宽度
					imgOffsetBottom = imgOffsetTop + height; //上边定位 + 元素高度
				//判定是否需要左右靠边
				if (clipAreaOffsetLeft < imgOffsetLeft) {
					var x = clipAreaOffsetLeft
					if (this.imgWidth > this.imgHeight) { //width > height
						if (imageRotate === 180) {
							x += width - height
						}
					} else { //(height > width) or (height = width)
						if (imageRotate === 90) {
							x -= height - width
						}
					}
				} else if (imgOffsetRight < clipAreaOffsetRight) {
					var x = clipAreaOffsetRight
					if (this.imgWidth > this.imgHeight) {
						x -= imageRotate === 180 ? height : width
					} else {
						x -= imageRotate === 90 ? height : width
					}
				}
				//判定是否需要上下靠边
				if (clipAreaOffsetTop < imgOffsetTop) {
					var y = clipAreaOffsetTop
					if (this.imgWidth > this.imgHeight) {
						y += imageRotate === 270 ? (height - width) : 0
					} else {
						y += imageRotate === 180 ? (height - width) : 0
					}
				} else if (imgOffsetBottom < clipAreaOffsetBottom) {
					var y = clipAreaOffsetBottom
					if (this.imgWidth > this.imgHeight) {
						y -= imageRotate === 270 ? width : height;
					} else {
						y -= imageRotate === 180 ? width : height;
					}
				}
				if (typeof(x) === 'number') {
					this.imgX = x + ((Math.min(this.imgWidth, this.imgHeight) * (this.imgScale - 1)) /
						2) //这里取最小值应该是和旋转中心点有关
				}
				if (typeof(y) === 'number') {
					this.imgY = y + ((Math.min(this.imgWidth, this.imgHeight) * (this.imgScale - 1)) / 2)
				}
			},
			getDistance: function(p1, p2) { //计算缩放的比例【利用勾股定理的方法】
				var x = p1.x - p2.x,
					y = p1.y - p2.y;
				return Math.sqrt((x * x) + (y * y));
			},
			/*getAngle: function(p1, p2) {//旋转的角度【夹角方法】
				var x = p1.x - p2.x,
					y = p1.y - p2.y;
				return Math.atan2(y, x) * 180 / Math.PI;
			},*/
			jiazaiImg: function() {
				uni.chooseImage({
					count: 1, //选择几张
					sizeType: ['compressed'], //压缩图
					//crop: {width: 250,height: 250},//原生的裁剪
					sourceType: ['album', 'camera'], //从相册和相机中选择【支持相册选择和相机拍照的意思】
					success: (res) => {
						this.url = res.tempFilePaths[0],
							imageRotate = this.imgRotate = 0; //重置旋转的角度
					}
				});
			},
			jieqv: function() {
				if (this.url === '') {
					this.jiazaiImg()
				} else if (this.bottomText_4 === '截取中...') {
					uni.showToast({
						title: '截取中，请稍等',
						icon: 'none',
						duration: 1500
					})
				} else if (this.bottomText_4 === '上传中...') {
					uni.showToast({
						title: '上传中，请稍等',
						icon: 'none',
						duration: 1500
					})
				} else if (this.bottomText_2 === '旋转中...') {
					uni.showToast({
						title: '旋转中，请稍等',
						icon: 'none',
						duration: 1000
					})
				} else {
					this.bottomText_4 = '截取中...'
					this.jieqvTobase64('base64UP');
				}
			},
			base64UP: function(text) {
				this.bottomText_4 = '上传中...';
				uni.showLoading({
					title: '上传中'
				});
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;;
				let _this = this;
				if (tk == null) {
					uni.navigateTo({
						url: './login?msg=' + 'unAuthorized'
					});
					return;
				}
				axios.post(this.$baseUrl + '/users/change_avater', {
						img: text
					}, {
						headers: {
							'Content-Type': 'application/json', //设置请求头请求格式为JSON
							'Authorization': tk //设置token 其中K名要和后端协调好
						}
					}, )
					.then(function(response) {
						uni.hideLoading();
						_this.bottomText_4 = '上传';
						uni.showToast({
							title: '上传成功',
							icon: 'none',
							duration: 2000
						});
						setTimeout(() => {
							uni.navigateBack({})
						}, 1000);
					})
					.catch(function(error) {
						//console.log(error);
						if (error) {
							uni.showToast({
								title: "上传失败",
								icon: 'none',
								duration: 2000
							});
						}
					})
			},
			getImageInClipAreaInfo: function() { //获取图片在裁剪区的信息
				var [imgWidth, imgHeight] = this.imgWidht_AND_imgHeight();
				var [imgLeft, imgTop] = this.imgLeft_AND_imgTop(imgWidth, imgHeight);
				//在源图像中截取的大小。源宽高 / 缩放比例就可以算出来
				var width = Math.min(img_yuanshi_width, img_yuanshi_height) / this.imgScale;
				//截取的位置
				//X轴（水平）
				var pianYiPxX = clipAreaOffsetLeft - imgLeft; //计算出【基于缩放之后的】的偏移px
				var beishuX = pianYiPxX / imgWidth; //计算出【基于缩放之后的】的偏移百分比
				var dx = ([0, 180].indexOf(imageRotate) > -1 ? img_yuanshi_width : img_yuanshi_height) *
				beishuX; //计算出【基于源图像】的偏移px
				if (imageRotate === 90) {
					dx = img_yuanshi_height - width - dx
				} else if (imageRotate === 180) {
					dx = img_yuanshi_width - width - dx
				}
				//Y轴（垂直）
				var pianYiPxY = clipAreaOffsetTop - imgTop;
				var beishuY = pianYiPxY / imgHeight;
				var dy = ([0, 180].indexOf(imageRotate) > -1 ? img_yuanshi_height : img_yuanshi_width) * beishuY;
				if (imageRotate === 180) {
					dy = img_yuanshi_height - width - dy
				} else if (imageRotate === 270) {
					dy = img_yuanshi_width - width - dy
				}
				return ([0, 180].indexOf(imageRotate) > -1) ? [dx, dy, width] : [dy, dx, width]
			},
			jieqvTobase64: function(fn) {
				var [dx, dy, width] = this.getImageInClipAreaInfo();
				console.log(dx);
				console.log(dy);
				console.log(width);
				//绘制裁剪图
				var ctx = uni.createCanvasContext('myCanvas')
				//旋转
				ctx.rotate((this.imgRotate * Math.PI) / 180)
				//水平 或 垂直运动
				if (imageRotate === 90) {
					ctx.transform(1, 0, 0, 1, 0, -(250 * this.pixelRatio))
				} else if (imageRotate === 180) {
					ctx.transform(1, 0, 0, 1, -(250 * this.pixelRatio), -(250 * this.pixelRatio))
				} else if (imageRotate === 270) {
					ctx.transform(1, 0, 0, 1, -(250 * this.pixelRatio), 0)
				}
				//截取
				ctx.drawImage(this.url, dx, dy, width, width, 0, 0, 250, 250)
				ctx.draw(false, (e) => { //绘制成功【绘制到 canvas 中】【false=清空canvas之前的内容】	return 
					this.bottomText_3 = '预览'
					uni.canvasToTempFilePath({ //canvas保存为图片
						destWidth: 250,
						destHeight: 250,
						width: 250,
						height: 250,
						canvasId: 'myCanvas',
						fileType: 'jpg',
						quality: 0.7,
						success: (res) => {
							//#ifdef APP-PLUS
							plus.io.resolveLocalFileSystemURL(res.tempFilePath, (
							entry) => { //通过URL参数获取目录对象或文件对象
								entry.file((file) => {
									var fileReader = new plus.io.FileReader()
									fileReader.onload = (data) => { //加载完成
										this[fn](data.target.result);
									}
									fileReader.readAsDataURL(
										file) //以URL编码格式读取文件数据内容【转Base64的意思】
								})
							})
							//#endif
							//#ifdef H5
							this[fn](res.tempFilePath);
							//#endif
						}
					})
				})
			},
			xvanzhuan: function() {
				if (this.url === '') {
					this.jiazaiImg()
				} else if (this.bottomText_2 === '旋转') {
					this.bottomText_2 = '旋转中...', //旋转中
						this.imgTransition = '400ms';
					[this.imgX, this.imgY] = this.X_AND_Y(); //默认定位
					this.imgScale = 1, //缩放比例
						//本轮旋转的角度
						this.imgRotate += 90; //旋转的角度【0-360++】
					imageRotate = this.imgRotate - (parseInt(this.imgRotate / 360) * 360); //【0-360】//旋转的中心点
					//关于旋转完成
					setTimeout(() => {
						this.bottomText_2 = '旋转';
					}, 400);
				}
			},
			yulan: function() {
				if (this.url === '') {
					this.jiazaiImg()
				} else if (this.bottomText_3 === '截取中...') {
					uni.showToast({
						title: '截取中，请稍等',
						icon: 'none',
						duration: 1500
					})
				} else if (this.bottomText_2 === '旋转中...') {
					uni.showToast({
						title: '旋转中，请稍等',
						icon: 'none',
						duration: 1000
					})
				} else {
					this.bottomText_3 = '截取中...'
					this.jieqvTobase64('yulanAlert');
				}
			},
			yulanAlert: function(text) {
				this.bottomText_3 = '预览'
				this.yulanPicSrc = text
			},
			onLoad() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;;
				let _this = this;
				if (tk == null) {
					uni.navigateTo({
						url: './login?msg=' + 'unAuthorized'
					});
					return;
				}
				//验活
				axios.get(this.$baseUrl + '/users/userprofile', {
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': tk //设置token 其中K名要和后端协调好
					}
				}).then((res) => {
					this.url = JSON.parse(JSON.stringify(res.data)).avatar_url;
				}).catch(function(error) {
					if (error.message == "Request failed with status code 401") {
						window.localStorage.removeItem('token');
						uni.navigateTo({
							url: './login'
						});
					}
				})

			}
		},
		onReady: function() {
			uni.getSystemInfo({
				success: (res) => {
					this.bodyLeftWidth = (res.windowWidth - uni.upx2px(750)) / 2, //body在pc端左边（空白区域）的宽度
						this.pixelRatio = res.pixelRatio; //设备的像素比【目前还没用到】

					uni.createSelectorQuery().select('#clipArea').boundingClientRect((
					data) => { //上下左右是相对于视口的
						clipAreaClientWidth = data.width - (borderWidth * 2),
							clipAreaClientHeight = data.height - (borderWidth * 2);

						clipAreaOffsetLeft = data.left + borderWidth - this.bodyLeftWidth,
							clipAreaOffsetRight = data.right - borderWidth - this.bodyLeftWidth,
							clipAreaOffsetTop = data.top + borderWidth,
							clipAreaOffsetBottom = data.bottom - borderWidth;
					}).exec();
				}
			});
			//PC端
			if (isPx === true) {
				//鼠标按下
				document.querySelector('#touch').addEventListener('mousedown', (e) => {
					//监听鼠标移动
					document.querySelector('body').addEventListener('mousemove', this.touchmove);
					this.touchstart(e)
				});
				//鼠标抬起
				document.querySelector('body').addEventListener('mouseup', (e) => {
					//移除鼠标移动监听
					document.querySelector('body').removeEventListener('mousemove', this.touchmove);
					this.touchend(e)
				});
			}
		},
		onBackPress: function(e) { //监听返回键
			if (this.yulanPicSrc !== '') { //退出登录弹窗
				this.yulanPicSrc = '';
				return true
			}
		}
	}
</script>
<style lang="scss" scoped>
	.alert {
		position: absolute;
		z-index: 100;
	}

	.body>>>#headNavHeight {
		display: none;
	}

	.body {
		Position: relative;
		width: 750rpx;
		height: calc(100vh - 44px - var(--statusBarHeight));
	}

	#touch {
		Position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		min-width: 750rpx;
		min-height: 100vh;
		opacity: 0;
	}

	#img.show:before {
		content: "旋转中";
		background: #FFF;
		color: #333;
		font-size: 34rpx;
		text-align: center;
		display: block;
		height: 100%;
		opacity: 0.8;
	}

	#clipArea {
		width: 458rpx;
		height: 458rpx;
		Position: absolute;
		top: 50%;
		left: 50%;
		z-index: 1;
		margin: -231rpx 0 0 -231rpx;
		background: #FFF;
		border: 1px solid #FFF;
		background: RGBA(0, 0, 0, 0);
	}

	#clipArea view {
		Position: absolute;
		background: RGBA(0, 0, 0, 0.25);
	}

	#clipArea .top,
	#clipArea .bottom {
		width: 200vw;
		height: 2083rpx;
		left: -100vw;
	}

	#clipArea .top {
		top: -2083rpx;
		margin-top: -1px;
	}

	#clipArea .bottom {
		bottom: -2083rpx;
		margin-bottom: -1px;
	}

	#clipArea .left,
	#clipArea .right {
		width: 2083rpx;
		height: 458rpx;
		top: -1px;
	}

	#clipArea .left {
		left: -2083rpx;
		margin-left: -1px;
	}

	#clipArea .right {
		right: -2083rpx;
		margin-right: -1px;
	}

	#bottom {
		Position: absolute;
		bottom: 0;
		z-index: 3;
		width: 750rpx;
		height: 100rpx;
		padding: 0 0 0 30rpx;
		background: #FFF;
	}

	#bottom>view {
		display: inline-block;
		color: #444;
		background: #FFF;
		width: 150rpx;
		line-height: 66rpx;
		text-align: center;
		font-size: 26rpx;
		border: 1rpx solid rgba(0, 0, 0, 0.1);
		margin: 17rpx 30rpx 0 0;
	}

	.tanchuang .content .img {
		width: 200rpx;
		height: 200rpx;
		margin: 0 auto;
		background-size: 100%;
		box-shadow: 0 0 24rpx rgba(200, 200, 200, 0.4);
	}

	.tanchuang .content .img.yuan {
		border-radius: 500%;
		margin: 75rpx auto 0 auto;
	}

	/* 一些全局的 */
	.body {
		overflow: hidden;
		color: #333;
	}

	::-webkit-scrollbar {
		display: none;
	}

	* {
		vertical-align: top;
		box-sizing: border-box;
	}

	/* 绘制一条很细的线 */
	.line,
	.vertical_line {
		Position: relative;
	}

	.line:before {
		Position: absolute;
		left: 0;
		bottom: 0;
		z-index: 1;
		content: "";
		width: 100%;
		height: 2rpx;
		background-image: linear-gradient(to bottom, transparent 0%, #F1F1F1 0%);
	}

	.vertical_line:after {
		Position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		content: "";
		width: 2rpx;
		height: 100%;
		background-image: linear-gradient(to right, #F1F1F1 100%, transparent 100%);
	}

	@media screen and (-webkit-min-device-pixel-ratio: 2) {
		.line:before {
			background-image: linear-gradient(to bottom, transparent 50%, #F1F1F1 0%);
		}

		.vertical_line:after {
			background-image: linear-gradient(to right, #F1F1F1 50%, transparent 50%);
		}
	}

	@media screen and (-webkit-min-device-pixel-ratio: 2.5) {
		.line:before {
			background-image: linear-gradient(to bottom, transparent 50%, #F1F1F1 0%);
		}

		.vertical_line:after {
			background-image: linear-gradient(to right, #F1F1F1 55%, transparent 55%);
		}
	}

	@media screen and (-webkit-min-device-pixel-ratio: 3) {
		.line:before {
			background-image: linear-gradient(to bottom, transparent 60%, #F1F1F1 0%);
		}

		.vertical_line:after {
			background-image: linear-gradient(to right, #F1F1F1 60%, transparent 60%);
		}
	}

	/* 弹窗的样式开始 */
	.tanchuang {
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, 0.3);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 900;
	}

	.tanchuang>.alert {
		Position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: #FFF;
		border-radius: 14rpx;
		text-align: center;
		overflow: hidden;
		width: 600rpx;
	}

	.tanchuang>.alert .title {
		color: #000000;
		padding: 42rpx 11rpx 0 11rpx;
		font-weight: bold;
		font-size: 31rpx;
	}

	.tanchuang>.alert .content {
		display: block;
		color: #656565;
		padding: 24rpx 54rpx 41rpx 54rpx;
		line-height: 38rpx;
		font-size: 30rpx;
		max-height: 72vh;
		overflow: scroll;
	}

	.tanchuang>.alert .content::-webkit-scrollbar {
		/* 隐藏滚动条，css3属性 */
		display: none;
	}

	/* 无标题时，改变一下 “标题” 和 “内容” 区域的内边距  */
	.tanchuang>.alert.notitle .title {
		padding: 0;
	}

	.tanchuang>.alert.notitle .content {
		padding: 54rpx;
	}

	.tanchuang>.alert .bottom {
		display: -webkit-box;
		line-height: 94rpx;
	}

	.tanchuang>.alert .bottom view {
		-webkit-box-flex: 1;
		width: 100%;
		display: block;
		background: #FFF;
		font-size: 30rpx;
	}

	.tanchuang>.alert .bottom view:nth-of-type(1) {
		color: rgb(30, 144, 255);
	}

	.tanchuang>.alert .bottom view:nth-of-type(2) {
		color: #333;
	}

	.tanchuang>.alert .bottom view:active {
		background: #E0E0E0;
	}

	.tanchuang>.alert .bottom.line:before {
		top: -2rpx;
	}
</style>