<template>
	<view style="width: 100%; height: 100%;" @touchstart="touchStart" @touchend="touchEnd">
		<slot></slot>
	</view>
</template>

<script>
	var vertDifference = 30 // 垂直判断阈值
	var horiDifference = 30 // 水平判断阈值
	var vertDegree = 45 // 垂直容差角度值
	var horiDegree = 45 // 水平容差角度值
	var vertToleranceDeg = Math.tan(vertDegree) // 垂直容差角度判断阈值
	var horiToleranceDeg = Math.tan(horiDegree) // 水平容差角度判断阈值
	var timeLimit = 1000 // 手指停留时间阈值（ms）
	var stayTime = 0 // 手指停留时间（ms）
	var timer = {} // 计时器

	export default {
		name: 'wyb-slide-listener',
		data() {
			return {
				startX: 0,
				startY: 0,
				lastX: 0,
				lastY: 0
			}
		},
		props:{
			vertDeg: {
				type: Number,
				default: 45
			},
			horiDeg: {
				type: Number,
				default: 45
			},
			vertDif: {
				type: Number,
				default: 30
			},
			horiDif: {
				type: Number,
				default: 30
			},
			timeLim: {
				type: Number,
				default: 1000
			}
		},
		created() {
			vertDegree = this.vertDeg
			horiDegree = this.horiDeg
			vertDifference = this.vertDif
			horiDifference = this.horiDif
			timeLimit = this.timeLim
		},
		methods: {
			touchStart: function(e) {
				this.startX = e.touches[0].clientX
				this.startY = e.touches[0].clientY
				// 开始计时
				timer = setInterval(() => {
					stayTime += 100
				}, 100)
			},

			touchEnd: function(e) {
				this.lastX = e.changedTouches[0].clientX
				this.lastY = e.changedTouches[0].clientY

				let temp = {
					point: {
						startX: this.startX, // 起始X坐标
						startY: this.startY, // 起始Y坐标
						lastX: this.lastX, // 终止X坐标
						lastY: this.lastY  // 终止Y坐标
					},
					difference: {
						differenceAbsX: Math.abs(this.startX - this.lastX), // X轴绝对坐标差
						differenceAbsY: Math.abs(this.startY - this.lastY), // Y轴绝对坐标差
						differenceX: this.startX - this.lastX, // X轴坐标差
						differenceY: this.startY - this.lastY  // Y轴坐标差
					},
					stayTime
				}

				// 停止计时
				clearInterval(timer)

				// 判断手指的停留时间是否小于阈值
				if (stayTime <= timeLimit) {

					// 判断滑动距离比是否小于垂直容差角度值
					if (Math.abs((this.lastX - this.startX) / (this.lastY - this.startY)) < vertToleranceDeg) {

						// 上滑事件，判断垂直滑动距离是否大于垂直判断阈值
						if (Math.abs(this.startY - this.lastY) >= vertDifference && this.startY - this.lastY > 0) {
							temp['type'] = 'slideUp'
							this.$emit('slideUp', temp)
						}

						// 下滑事件，判断垂直滑动距离是否大于垂直判断阈值
						else if (Math.abs(this.startY - this.lastY) >= vertDifference && this.startY - this.lastY < 0) {
							temp['type'] = 'slideDown'
							this.$emit('slideDown', temp)
						}

					}

					// 判断滑动距离比是否小于水平容差角度值
					else if (Math.abs((this.lastY - this.startY) / (this.lastX - this.startX)) < horiToleranceDeg) {

						// 左滑事件，判断水平滑动距离是否大于垂直判断阈值
						if (Math.abs(this.startX - this.lastX) >= vertDifference && this.startX - this.lastX > 0) {
							temp['type'] = 'slideLeft'
							this.$emit('slideLeft', temp)
						}

						// 右滑事件，判断水平滑动距离是否大于垂直判断阈值
						else if (Math.abs(this.startX - this.lastX) >= vertDifference && this.startX - this.lastX < 0) {
							temp['type'] = 'slideRight'
							this.$emit('slideRight', temp)
						}

					}

				}

				// 手指停留时间归零
				stayTime = 0
			}
		}
	}

	/*开发时Log
	console.log("开始时的X坐标：" + this.startX)
	console.log("开始时的Y坐标：" + this.startY)
	console.log("结束时的X坐标：" + this.lastX)
	console.log("结束时的Y坐标：" + this.lastY)
	console.log("X坐标绝对差值：" + Math.abs(this.startX - this.lastX))
	console.log("Y坐标绝对差值：" + Math.abs(this.startX - this.lastX))
	console.log("X坐标差值：" + (this.startX - this.lastX))
	console.log("Y坐标差值：" + (this.startY - this.lastY))*/
</script>