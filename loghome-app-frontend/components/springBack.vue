<template>
	<view class="container" :style="[{
				transform: coverTransform,
				transition: coverTransition,
				top:top,
				
			}]" @touchstart="coverTouchstart"
	 @touchmove="coverTouchmove" @touchend="coverTouchend">
		<slot></slot>
	</view>
</template>

<script>
	let startY = 0,
		moveY = 0,
		pageAtTop = true;
	export default {
		props: {
			top: {
				type: String,
				default: () => '30%'
			},
		},
		data() {
			return {
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
			}
		},
		computed:{
			
		},
		methods: {
			coverTouchstart(e) {
				if (pageAtTop === false) {
					return;
				}
				this.coverTransition = 'transform .1s linear';
				startY = e.touches[0].clientY;
			},
			coverTouchmove(e) {
				moveY = e.touches[0].clientY;
				let moveDistance = moveY - startY;
				if (moveDistance < 0) {
					this.moving = false;
					return;
				}
				this.moving = true;
				if (moveDistance >= 80 && moveDistance < 100) {
					moveDistance = 80;
				}

				if (moveDistance > 0 && moveDistance <= 80) {
					this.coverTransform = `translateY(${moveDistance}px)`;
				}
			},
			coverTouchend() {
				if (this.moving === false) {
					return;
				}
				this.moving = false;
				this.coverTransition = 'transform 0.2s ease-out';
				this.coverTransform = 'translateY(0px)';
			},
		}
	}
</script>

<style>
	.container {
		border-top-left-radius: 0;
		border-top-right-radius: 0;
		width: 100%;
		position: absolute;
		background:linear-gradient(to bottom, #ffffffdd, #ffffffFF 40%);
		backdrop-filter: blur(50px);
		z-index: 3;
	}
</style>
