<template>
	<view class="qaBox">
		<view style="width: 100%; text-align: left;">
			<span :class="[{ watchMoreContent: isWatchMore  }, {contentt:isLongContent} ,'xzj']" :style="[zxy]" @click="$emit('active')"><slot></slot></span>
			<view class="menu" :class="{'singleLine': isSingleLineDisplayPossible}">
				<div style="display: flex;" class="realMenu">
					<view class="watchMore" v-if="isLongContent" @click="watchMore">
						{{ isWatchMore ? '收起' : '查看更多' }}
					</view>
					<view class="more" v-if="showMenu" @click="$emit('menu')">
						<i class="el-icon-more"></i>
					</view>
				</div>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			isWatchMore: false,
			isLongContent: false,
			zxy:{
				'-webkit-line-clamp':'', /* 行数*/
				lineClamp: '', /*行数*/
			},
			isSingleLineDisplayPossible: false
		};
	},
	props: {
		// 默认的显示占位高度，单位为rpx
		showHeight: { //文本本身高度超出   showHeight  才会显示 查看更多
			type: [Number, String],
			default: 74,
			// 这里是rpx
		},
		hideLineNum:{
			type:[Number,String],
			default:4,
			// 4行
		},
		showMenu: {
			type: Boolean,
			default: false
		}
	},
	mounted() {
		this.$nextTick(function() {
			this.init();
		});
	},
	created(){
		for (let key in this.zxy) {
			this.zxy[key]=this.hideLineNum
		}
	}
	,
	methods: {
		watchMore() {
			this.isWatchMore = !this.isWatchMore;
		},
		init() {
			this.getRect('.xzj').then(async res => {
				// 判断高度，如果真实内容高度大于占位高度，则显示收起与展开的控制按钮
				if (res.height > uni.upx2px(this.showHeight)) {
					this.isLongContent = true;
				}
				// 判断宽度，如果宽度不足一行的话则将按钮显示在行内
				let fatherRect = await this.getRect(".qaBox");
				let menuRect = await this.getRect(".realMenu");
				if(res.width + menuRect.width <= fatherRect.width) {
					this.isSingleLineDisplayPossible = true;
				}
			});
		},
		getRect(selector, all) {
			return new Promise(resolve => {
				uni.createSelectorQuery()
					.in(this)
					[all ? 'selectAll' : 'select'](selector)
					.boundingClientRect(rect => {
						if (all && Array.isArray(rect) && rect.length) {
							resolve(rect);
						}
						if (!all && rect) {
							resolve(rect);
						}
					})
					.exec();
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.qaBox {
	text-align: right;
	font-size: 24rpx;
	font-weight: 400;
	margin-top: 14rpx;
	color: #EA7034;
	display: flex;
	position: relative;
}
.contentt {
	overflow: hidden;
	text-overflow: ellipsis; /*超出则...代替*/
	display: -webkit-box;
	// -webkit-line-clamp: 4; /* 行数*/
	// line-clamp: 4; /*行数*/
	-webkit-box-orient: vertical;
	// line-height: 56rpx;
}
.xzj{
	color: #47494c;
	font-size: 28rpx;
	// text-align;
	text-align: left !important;
	word-break: normal;
	width: auto;
}

.menu{
	display: flex;
	justify-content: flex-end;
	align-items: center;
}

.menu.singleLine{
	position: absolute;
	top: 50%;
	right: 0;
	transform: translateY(-50%);
}


.menu *{
	margin-top: 3px;
	margin-left: 20rpx;
}

.menu.singleLine *{
	margin-top: 0;
}


.watchMoreContent {
	display: inline-block ;
	width: 100%;
}
</style>
