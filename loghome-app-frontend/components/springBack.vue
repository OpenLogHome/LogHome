<template>
	<view class="container" :style="[{
				transform: 'translateY(' + offsetY + 'px)',
				transition: dragSmoothing ? 'transform 0.08s linear' : 'transform 0s',
				top:top,
			}]" @touchstart="coverTouchstart"
	 @touchmove="coverTouchmove" @touchend="coverTouchend" @touchcancel="coverTouchend" v-dark>
		<slot></slot>
	</view>
</template>

<script>
	import darkModeMixin from '@/mixins/dark-mode.js'
	export default {
		props: {
			top: {
				type: String,
				default: () => '30%'
			},
			// 拉动阻尼的渐近上限（px）：手指拉得再远，位移也无限趋近该值
			maxPull: {
				type: Number,
				default: 110,
			},
		},
		mixins: [darkModeMixin],
		data() {
			return {
				offsetY: 0, // 当前面板位移（px）
				dragSmoothing: false, // 拖动跟手时关闭过渡，仅轻微平滑
				pageAtTop: true,
				moving: false,
			}
		},
		methods: {
			// ===== 阻尼（rubber-band）拉动：位移随手指距离衰减，渐近 maxPull =====
			rubberBand(distance) {
				const dim = this.maxPull;
				const c = 0.55;
				return (1 - 1 / ((distance * c / dim) + 1)) * dim;
			},
			// ===== 松手后的欠阻尼弹簧回弹（rAF 物理模拟，带过冲振荡） =====
			startSpring(initialVelocity) {
				this.stopSpring();
				const stiffness = 170; // 弹簧刚度（1/s^2）
				// 阻尼系数：欠阻尼（阻尼比≈0.55），回弹时带 2~3 次衰减过冲
				const damping = 2 * Math.sqrt(stiffness) * 0.55;
				let x = this.offsetY;
				let v = initialVelocity; // px/s
				let lastTime = null;
				this.moving = true;
				const step = (now) => {
					if (lastTime === null) lastTime = now;
					// 帧间隔封顶，防止后台切回时大步长跳变
					let dt = Math.min((now - lastTime) / 1000, 1 / 60);
					lastTime = now;
					// 半隐式欧拉积分：a = -k*x - c*v
					const a = -stiffness * x - damping * v;
					v += a * dt;
					x += v * dt;
					if (Math.abs(x) < 0.4 && Math.abs(v) < 15) {
						// 能量耗尽，吸附归零
						this.offsetY = 0;
						this.moving = false;
						this.$emit('cover-move', 0);
						this.springFrame = null;
						return;
					}
					this.offsetY = x;
					this.$emit('cover-move', Math.max(x, 0));
					this.springFrame = requestAnimationFrame(step);
				};
				this.springFrame = requestAnimationFrame(step);
			},
			stopSpring() {
				if (this.springFrame) {
					cancelAnimationFrame(this.springFrame);
					this.springFrame = null;
				}
				this.moving = false;
			},
			coverTouchstart(e) {
				if (this.pageAtTop === false) {
					return;
				}
				// 中断进行中的回弹，从当前位移继续拖动（带轻微平滑的跟手）
				this.stopSpring();
				this.dragSmoothing = true;
				this.baseOffset = this.offsetY > 0 ? this.offsetY : 0;
				this.startY = e.touches[0].clientY;
				this.lastMoveY = e.touches[0].clientY;
				this.lastMoveTime = Date.now();
				this.velocity = 0;
			},
			coverTouchmove(e) {
				if (this.startY === undefined || this.startY === null) {
					return;
				}
				const y = e.touches[0].clientY;
				const moveDistance = y - this.startY;
				// 速度估计（EMA 平滑，px/s），松手时作为弹簧初速度
				const now = Date.now();
				const dt = now - this.lastMoveTime;
				if (dt > 0) {
					const instV = (y - this.lastMoveY) / dt * 1000;
					this.velocity = this.velocity * 0.7 + instV * 0.3;
				}
				this.lastMoveY = y;
				this.lastMoveTime = now;
				if (moveDistance <= 0) {
					// 上滑交还给页面滚动，面板立即复位
					this.offsetY = 0;
					this.moving = false;
					this.$emit('cover-move', 0);
					return;
				}
				this.moving = true;
				// 从触点前的位移继续叠加阻尼增量，并封顶在渐近上限附近
				const target = Math.min(this.baseOffset + this.rubberBand(moveDistance), this.maxPull);
				this.offsetY = target;
				this.$emit('cover-move', target);
			},
			coverTouchend() {
				if (this.startY === undefined || this.startY === null) {
					return;
				}
				this.startY = null;
				if (this.offsetY <= 0) {
					return;
				}
				// 松手：保持释放瞬间的速度方向（先顺势再回弹），进入弹簧模拟
				this.startSpring(this.velocity);
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
		background:linear-gradient(to bottom, #fffcf2, #ffffff 40%);
		/* backdrop-filter: blur(50px); */
		z-index: 3;

		&.dark-mode {
			background:linear-gradient(to bottom, #2c2c2c, #1c1c1c 40%);
		}
	}
</style>
