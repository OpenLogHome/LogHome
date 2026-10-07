<template>
  <view class="comic-loader" role="status" aria-live="polite" aria-label="正在加载漫画">
    <view v-if="!assetFailed" class="comic-board" aria-hidden="true">
      <view class="comic-panel panel-start">
        <view class="panel-ink">
          <text class="speech speech-start">出发！</text>
          <view class="pose pose-start"><image class="pose-atlas" src="/static/manga/loggirl-loading-poses.png" @error="assetFailed = true" /></view>
          <view class="ground"></view>
        </view>
      </view>
      <view class="comic-panel panel-run">
        <view class="panel-ink">
          <view class="speed-lines"></view>
          <view class="run-bounce"><view class="pose pose-run"><image class="pose-atlas" src="/static/manga/loggirl-loading-poses.png" @error="assetFailed = true" /></view></view>
          <text class="footsteps">哒哒哒…</text>
        </view>
      </view>
      <view class="comic-panel panel-deliver">
        <view class="panel-ink">
          <view class="delivery-rays"></view>
          <text class="speech speech-deliver">漫画<br />送达！</text>
          <view class="delivery-flight"><view class="pose pose-deliver"><image class="pose-atlas" src="/static/manga/loggirl-loading-poses.png" @error="assetFailed = true" /></view></view>
          <text class="spark spark-one">✦</text><text class="spark spark-two">✦</text>
        </view>
      </view>
    </view>
    <image v-else class="fallback-runner" src="/static/loading.gif" mode="aspectFit" aria-hidden="true" />
    <text class="loading-caption">原木娘正在搬运漫画</text>
    <!-- <view class="loading-dots" aria-hidden="true"><view class="dot dot-start"></view><view class="dot dot-run"></view><view class="dot dot-deliver"></view></view> -->
  </view>
</template>

<script>
export default {
  name: 'MangaComicLoader',
  data() { return { assetFailed: false } }
}
</script>

<style scoped lang="scss">
.comic-loader {
  --comic-paper: #fffaf0;
  --comic-ink: #342f2a;
  --comic-green: #88a76b;
  --comic-dot: #dce1d7;
  width: 560rpx;
  max-width: calc(100vw - 64rpx);
  color: var(--manga-text, #252b30);
  text-align: center;
}
.comic-board { display: grid; grid-template-columns: 1fr 1.08fr; gap: 14rpx; }
.comic-panel {
  position: relative;
  height: 226rpx;
  border: 4rpx solid var(--comic-ink);
  background-color: var(--comic-paper);
  background-image: radial-gradient(#b3b29c55 1rpx, transparent 1rpx);
  background-size: 7rpx 7rpx;
  box-shadow: 3rpx 4rpx 0 #342f2a16;
  text-align: left;
}
.panel-start { transform: rotate(-1deg); }
.panel-run { transform: rotate(.6deg); }
.panel-deliver { grid-column: 1 / -1; height: 244rpx; margin-top: 6rpx; }
.panel-ink { position: absolute; inset: 0; animation: start-focus 1.8s linear infinite; }
.panel-run .panel-ink { animation-name: run-focus; }
.panel-deliver .panel-ink { animation-name: deliver-focus; }
.pose { position: absolute; width: 220rpx; height: 220rpx; overflow: hidden; }
.pose-atlas { position: absolute; top: 0; left: 0; width: 300%; height: 100%; max-width: none; }
.pose-start { bottom: -7rpx; right: -5rpx; }
.pose-run { top: 0; right: -4rpx; transform: scaleX(-1); }
.pose-run .pose-atlas { left: -100%; }
.pose-deliver { width: 308rpx; height: 308rpx; right: 10rpx; top: -56rpx; }
.pose-deliver .pose-atlas { left: -200%; }
.speech {
  position: absolute; z-index: 2; padding: 10rpx 14rpx;
  background: #fffdf7; color: var(--comic-ink); border: 3rpx solid var(--comic-ink);
  font-size: 27rpx; line-height: 1.25; font-weight: 800;
  box-shadow: 3rpx 3rpx 0 #342f2a1c;
}
.speech-start { left: -10rpx; top: 14rpx; transform: rotate(-9deg); }
.speech-deliver { left: 20rpx; top: 46rpx; transform: rotate(-6deg); font-size: 30rpx; }
.speech::before, .speech::after {
  content: '';
  position: absolute;
  bottom: -19rpx;
  right: 10rpx;
  width: 26rpx;
  height: 24rpx;
  pointer-events: none;
}
/* Two nested triangles join across the bottom border, with the tip aimed
   down and right toward the character instead of a skewed square corner. */
.speech::before {
  background: var(--comic-ink);
  clip-path: polygon(0 0, 72% 0, 100% 100%);
}
.speech::after {
  background: #fffdf7;
  clip-path: polygon(13% 0, 60% 0, 84% 76%);
}
.ground { position: absolute; left: 10rpx; right: 8rpx; bottom: 15rpx; border-bottom: 2rpx solid #342f2a55; z-index: -1; transform: rotate(-4deg); }
.speed-lines { position: absolute; inset: 0; overflow: hidden; }
.speed-lines::before { content: ''; position: absolute; width: 200%; height: 100%; background: linear-gradient(#342f2a80, #342f2a80) 0 18% / 28% 2rpx no-repeat, linear-gradient(#342f2a80, #342f2a80) 15% 42% / 34% 2rpx no-repeat, linear-gradient(#342f2a80, #342f2a80) 0 72% / 24% 2rpx no-repeat; opacity: .4; animation: speed-drift .4s linear infinite; }
.run-bounce { position: absolute; inset: 0; animation: running-bounce .22s ease-in-out infinite alternate; }
.footsteps { position: absolute; right: 8rpx; bottom: 8rpx; color: var(--comic-ink); font-size: 21rpx; font-weight: 700; transform: rotate(-8deg); }
.delivery-rays { position: absolute; inset: 0; overflow: hidden; background: repeating-conic-gradient(from 25deg at 70% 60%, transparent 0deg 23deg, #88a76b30 24deg 25deg, transparent 26deg 43deg); }
.delivery-flight { position: absolute; inset: 0; animation: delivery-hop 1.8s ease-in-out infinite; }
.spark { position: absolute; color: #71914f; font-size: 36rpx; }
.spark-one { top: 24rpx; right: 18rpx; }
.spark-two { bottom: 22rpx; left: 160rpx; font-size: 25rpx; }
.loading-caption { display: block; margin-top: 42rpx; font-size: 27rpx; font-weight: 500; line-height: 1.5; }
.loading-dots { display: flex; justify-content: center; gap: 14rpx; margin-top: 22rpx; }
.dot { width: 14rpx; height: 14rpx; border-radius: 50%; background: var(--comic-dot); animation: start-dot 1.8s linear infinite; }
.dot-run { animation-name: run-dot; }
.dot-deliver { animation-name: deliver-dot; }
.fallback-runner { width: 240rpx; height: 240rpx; }
@keyframes start-focus { 0%, 22.2% { opacity: 1; filter: grayscale(0); } 24%, 98% { opacity: .35; filter: grayscale(1); } 100% { opacity: 1; filter: grayscale(0); } }
@keyframes run-focus { 0%, 21% { opacity: .35; filter: grayscale(1); } 22.2%, 66.6% { opacity: 1; filter: grayscale(0); } 68%, 100% { opacity: .35; filter: grayscale(1); } }
@keyframes deliver-focus { 0%, 65% { opacity: .35; filter: grayscale(1); } 66.6%, 98% { opacity: 1; filter: grayscale(0); } 100% { opacity: .35; filter: grayscale(1); } }
@keyframes start-dot { 0%, 22.2%, 100% { background: var(--comic-green); } 24%, 98% { background: var(--comic-dot); } }
@keyframes run-dot { 0%, 21%, 68%, 100% { background: var(--comic-dot); } 22.2%, 66.6% { background: var(--comic-green); } }
@keyframes deliver-dot { 0%, 65%, 100% { background: var(--comic-dot); } 66.6%, 98% { background: var(--comic-green); } }
@keyframes speed-drift { to { transform: translateX(-25%); } }
@keyframes running-bounce { to { transform: translateY(-6rpx); } }
@keyframes delivery-hop { 0%, 64%, 100% { transform: translate(-8rpx, 5rpx); } 82% { transform: translate(8rpx, -7rpx); } }
@media (prefers-reduced-motion: reduce) {
  .panel-ink, .run-bounce, .delivery-flight, .speed-lines::before, .dot { animation: none; }
  .panel-ink { opacity: 1; filter: none; }
  .dot-start { background: var(--comic-green); }
  .fallback-runner { display: none; }
}
@media (max-height: 520px) { .comic-loader { width: 400rpx; } .comic-board { transform: scale(.7); margin: -70rpx -40rpx; } .loading-caption { margin-top: 24rpx; } }
</style>
