<template>
	<view class="content" v-dark :style="{ '--statusBarHeight': 0 + 'px' }">
		<view class="pagebody">
            <view class="header">
                <view class="novel-name">{{name}}</view>
                <view class="total-score">
                    <view class="label">当前<LogPowerWordmark /></view>
                    <countTo :startVal="0" :endVal="ranking" :duration="1500" class="score-value"></countTo>
                </view>
            </view>
            
            <view class="section card">
                <view class="section-title">基础分计算</view>
                <view class="formula-box">
                    <view class="row">
                        <text class="item">阅读 ({{clicks}})</text>
                        <text class="calc">× 8 =</text>
                        <text class="val">{{clicks * 8}}</text>
                    </view>
                    <view class="row">
                        <text class="item">收藏 ({{bookmarks}})</text>
                        <text class="calc">× 200 =</text>
                        <text class="val">{{bookmarks * 200}}</text>
                    </view>
                    <view class="row">
                        <text class="item">评论 ({{comments}})</text>
                        <text class="calc">× 20 =</text>
                        <text class="val">{{comments * 20}}</text>
                    </view>
                    <view class="row">
                        <text class="item">点赞 ({{nices}})</text>
                        <text class="calc">× 12 =</text>
                        <text class="val">{{nices * 12}}</text>
                    </view>
                    <view class="row">
                        <text class="item">打赏及其他</text>
                        <text class="calc">× 10 =</text>
                        <text class="val">{{tipsScore}}</text>
                    </view>
                    <view class="divider"></view>
                    <view class="row total">
                        <text class="item">基础分总计</text>
                        <text class="val">{{baseScore}}</text>
                    </view>
                </view>
            </view>

            <view class="section card">
                <view class="section-title">咕咕惩罚</view>
                <view class="info-row">
                    <text>最近更新</text>
                    <text>{{formatDate(update_time)}}</text>
                </view>
                <view class="info-row">
                    <text>距今</text>
                    <text>{{Math.abs(daysDiff)}} 天 {{daysDiff > 0 ? '后' : '前'}}</text>
                </view>
                
                <view class="formula-box" style="margin-top: 20rpx;">
                    <view class="row">
                        <text class="item">修正系数 A</text>
                        <text class="val">{{factorA.toFixed(4)}}</text>
                    </view>
                    <view class="formula-desc">
                        公式: 1 + ({{daysDiff}} + 5) * 0.066
                        <text v-if="factorA == 0.4" class="limit-tip"> (已触底 0.4)</text>
                    </view>

                    <view class="row" style="margin-top: 20rpx;">
                        <text class="item">修正系数 B</text>
                        <text class="val">{{factorB.toFixed(4)}}</text>
                    </view>
                     <view class="formula-desc">
                        公式: 1 + {{daysDiff}} * 0.0035
                        <text v-if="factorB == 0.6" class="limit-tip"> (已触底 0.6)</text>
                    </view>
                </view>
            </view>

             <view class="section card">
                <view class="section-title">最终公式</view>
                <view class="final-calc">
                    {{baseScore}} × {{factorA.toFixed(4)}} × {{factorB.toFixed(4)}} ≈ {{ranking}}
                </view>
                <view class="tips">
                    注：<LogPowerWordmark />根据作品数据和更新频率实时计算，是衡量作品热度的重要指标。
                </view>
            </view>

		</view>
	</view>
</template>

<script>
import LogPowerWordmark from '@/components/LogPowerWordmark.vue'
import countTo from "vue-count-to"
import darkModeMixin from '@/mixins/dark-mode.js'

export default {
    components: { countTo, LogPowerWordmark },
    mixins: [darkModeMixin],
    data() {
        return {
            statusBarHeight: 0,
            name: '',
            clicks: 0,
            nices: 0,
            bookmarks: 0,
            comments: 0,
            update_time: '',
            ranking: 0,
            tipsScore: 0
        }
    },
    onLoad(options) {
        this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
        this.name = options.name || '未知小说';
        this.clicks = parseInt(options.clicks || 0);
        this.nices = parseInt(options.nices || 0);
        this.bookmarks = parseInt(options.bookmarks || 0);
        this.comments = parseInt(options.comments || 0);
        this.update_time = options.update_time;
        this.ranking = parseFloat(options.ranking || 0);
    },
    computed: {
        daysDiff() {
            if (!this.update_time) return 0;
            // Mimic MySQL DATEDIFF which compares date parts only
            const now = new Date();
            const update = new Date(this.update_time);
            
            const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const updateDay = new Date(update.getFullYear(), update.getMonth(), update.getDate());
            
            const diffTime = updateDay.getTime() - nowDay.getTime();
            return Math.round(diffTime / (1000 * 60 * 60 * 24)); 
        },
        factorA() {
             // (1 + (daysDiff + 5) * 0.33 * 0.2) > 0.4
             // 0.33 * 0.2 = 0.066
             let val = 1 + (this.daysDiff + 5) * 0.066;
             return val > 0.4 ? val : 0.4;
        },
        factorB() {
            // (1 + (daysDiff) * 0.07 * 0.05) > 0.6
            // 0.07 * 0.05 = 0.0035
            let val = 1 + (this.daysDiff) * 0.0035;
            return val > 0.6 ? val : 0.6;
        },
        baseScore() {
             // Calculate base score from components first to be accurate to inputs
             let known = this.clicks * 8 + this.nices * 12 + this.bookmarks * 200 + this.comments * 20;
             // But we need to reverse calculate to find tips
             if (this.factorA * this.factorB <= 0.0001) return known;
             
             let totalBase = this.ranking / (this.factorA * this.factorB);
             return Math.round(totalBase);
        }
    },
    watch: {
        baseScore: {
            handler(newVal) {
                let known = this.clicks * 8 + this.nices * 12 + this.bookmarks * 200 + this.comments * 20;
                let diff = newVal - known;
                this.tipsScore = diff > 0 ? diff : 0;
            },
            immediate: true
        }
    },
    methods: {
        formatDate(str) {
            if(!str) return '';
            // Basic formatting
            return str.replace('T', ' ').substring(0, 16);
        }
    }
}
</script>

<style scoped>
.content {
    min-height: 100vh;
    background-color: var(--background-color-secondary);
    color: var(--text-color-primary);
    padding-bottom: 40rpx;
}
.pagebody {
    padding: 30rpx;
}
.header {
    text-align: center;
    margin-bottom: 40rpx;
}
.novel-name {
    font-size: 36rpx;
    font-weight: bold;
    color: var(--text-color-primary);
    margin-bottom: 20rpx;
}
.total-score {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.label {
    font-size: 28rpx;
    color: var(--text-color-regular);
}
.score-value {
    font-size: 60rpx;
    font-weight: bold;
    color: #EA7034;
}
.card {
    background: var(--card-background);
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}
.section-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    border-left: 8rpx solid #EA7034;
    padding-left: 16rpx;
}
.formula-box {
    background: var(--background-color-tertiary);
    padding: 20rpx;
    border-radius: 10rpx;
}
.row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12rpx;
    font-size: 28rpx;
    color: var(--text-color-regular);
}
.row.total {
    font-weight: bold;
    color: var(--text-color-primary);
    margin-top: 10rpx;
    font-size: 30rpx;
}
.divider {
    height: 1px;
    background: var(--border-color);
    margin: 10rpx 0;
}
.item {
    flex: 1;
}
.calc {
    margin: 0 20rpx;
    color: var(--text-color-secondary);
}
.val {
    width: 120rpx;
    text-align: right;
    font-family: monospace;
}
.info-row {
    display: flex;
    justify-content: space-between;
    font-size: 28rpx;
    color: var(--text-color-regular);
    margin-bottom: 10rpx;
}
.formula-desc {
    font-size: 24rpx;
    color: var(--text-color-secondary);
    text-align: right;
}
.limit-tip {
    color: #EA7034;
}
.final-calc {
    text-align: center;
    font-size: 32rpx;
    font-weight: bold;
    color: #EA7034;
    margin: 20rpx 0;
}
.tips {
    font-size: 24rpx;
    color: var(--text-color-secondary);
    margin-top: 20rpx;
}
</style>
