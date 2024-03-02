<template>
	<view class="drag" @touchmove.stop.prevent="clear">
		<view class="dragwrap" v-if="isShow">
			<view class="dragmask" @click.stop="close"></view>
			<view class="dragbox" @touchstart="dragStart" @touchmove="dragMove" @touchend="dragEnd">
				<view class="title" @touchstart="titleStart" @touchend="titleEnd">
					<view class="title-h3">
						<text>{{title}}</text>
					</view>
					<view class="title-close" @click.stop="close"></view>
				</view>
				<scroll-view class="scroll" scroll-y>
					<view class="scrollbox">
						<slot/>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>
<script module="render" lang="renderjs">
let el,mask,scroll;
let startY=null,
	scrolling = false,
	newY = null,
	isTitle=false;
export default {
	name: 'uDrag',
	props: {
		title:{
			type:String,
			default:''
		}
	},
	data() {
		return {
			isShow: false,
			duration: 0.3
		};
	},
	mounted() {},
	methods: {
		clear(e) {
			e.stopPropagation()
		},
		titleStart(){
			isTitle = true;
		},
		titleEnd(){
			isTitle = false;
		},
		dragStart(e){
			let ev = e.touches ? e.touches[0] : e;
			startY = ev.clientY;
			el.style.transition = null;
			mask.style.transition = null;
		},
		dragMove(e){
			if(startY == null) return;
			let ev = e.touches ? e.touches[0] : e;
			if(scroll.scrollTop === 0 || isTitle){
				let fs = false;
				if(scrolling){
					startY = ev.clientY;
					scrolling = false;
					fs = true;
				}
				newY = ev.clientY - startY;
				if(newY < 0){newY = 0;}
				el.style.transform = `translateY(${newY}px)`;
				if(!fs && newY > 0 && e.cancelable){
					e.preventDefault()
				}
				if(mask){
					mask.style.opacity = 1 - newY / el.offsetHeight;
				}
			}else{
				scrolling = true;
				newY = ev.clientY - startY;
			}
		},
		dragEnd(e){
			const { duration} = this;
			el.style.transition = `transform ${duration}s`;
			if(newY  && newY > el.offsetHeight / 2.4){
				this.close();
			}else{
				el.style.transform = 'translateY(0)';
				mask.style.opacity = 1;
			}
			startY = null;
			newY = null;
		},
		open(){
			this.isShow = true;
			this.$nextTick(()=>{
				el = document.querySelector('.dragbox');
				mask = document.querySelector('.dragmask');
				scroll = document.querySelector('.scroll .uni-scroll-view .uni-scroll-view');
				const { duration} = this;
				el.style.display = 'block';
				el.style.transition = null;
				el.style.transform = `translateY(${el.offsetHeight}px)`;
				if(mask){
					mask.style.display = 'block';
					mask.style.opacity = '0';
				}
				setTimeout(function(){
					el.style.transition = `transform ${duration}s`;
					el.style.transform = 'translateY(0)';
					if(mask){
						mask.style.transition = `opacity ${duration}s`;
						mask.style.opacity = '1';
					}
				},20);
			})
		},
		close(){
			const { duration} = this;
			el.style.transition = `transform ${duration}s`;
			el.style.transform = `translateY(${el.offsetHeight}px)`;
			if(mask){
				mask.style.transition = `transform ${duration}s`;
				mask.style.opacity = '0';
			}
			setTimeout(function(){
				this.isShow = false;
				el.style.display = 'none';
				if(mask){
					mask.style.display = 'none';
				}
			},300);
		}
	},
};
</script>

<style lang="scss" scoped>
	.dragWrap{
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 491;
		width: 100%;
		height: 100vh;
	}
	.dragmask{
		display: none;
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		background-color: rgba($color: #000000, $alpha: .5);
		width: 100%;
		height: 100%;
	}
	.dragbox{
		display: none;
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 2;
		width: 100%;
		height: 70%;
		background-color: #fff;
		border-radius: 20rpx 20rpx 0 0;
	}
	.title{
		padding: 30rpx 50rpx;
		position: relative;
		border-bottom: 1px solid #f6f6f6;
		.title-h3{
			display: block;
			text-align: center;
			text{
				text-align: center;
				font-size: 28rpx;
				color: #333;
				line-height: 30rpx;
			}
		}
		.title-close{
			display: block;
			position: absolute;
			top: 50%;
			right: 20rpx;
			width: 40rpx;
			height: 40rpx;
			margin-top: -20rpx;
			background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDU4QTQ1MzkyMEY1MTFFQzkwRUZEOUU0MDZDNDUzQ0MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDU4QTQ1MzgyMEY1MTFFQzkwRUZEOUU0MDZDNDUzQ0MiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkMwRjk1NzE0MUVDODExRUNBQjBFQjk4RDkwMDYyODk2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkMwRjk1NzE1MUVDODExRUNBQjBFQjk4RDkwMDYyODk2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+QjCb6gAAB5dJREFUeNrsmwlvVUUU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') no-repeat center;
			background-size: 100%;
		}
	}
	.scroll{
		display: block;
		width: 100%;
		height: calc(100% - 90rpx);
	}
</style>
