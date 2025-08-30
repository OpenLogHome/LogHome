<template>
    <div class="complete-icon-container">
        <img v-if="isAnimating" class="icon" src="./completeIcon/system-regular-31-check-morph-check-in-1.gif" mode="aspectFit"></img>
        <img v-else class="icon" src="./completeIcon/system-regular-31-check-hover-check.png" mode="aspectFit"></img>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isAnimating: false,
            animationTimer: null
        }
    },
    methods: {
        /**
         * 触发动画效果
         * @param {Number} duration 动画持续时间，默认500毫秒（与GIF动画时长一致）
         */
        playAnimation(duration = 2000) {
            // 清除之前可能存在的定时器
            if (this.animationTimer) {
                clearTimeout(this.animationTimer);
            }
            
            // 激活动画（显示GIF）
            this.isAnimating = true;
            
            // 设置动画结束后恢复静止状态（显示静态图片）
            this.animationTimer = setTimeout(() => {
                this.isAnimating = false;
            }, duration);
        }
    },
    beforeDestroy() {
        // 组件销毁前清除定时器
        if (this.animationTimer) {
            clearTimeout(this.animationTimer);
        }
    }
}
</script>

<style scoped>
.complete-icon-container {
    display: inline-block;
}

.icon {
    width: 30rpx;
    height: 30rpx;
}
</style>