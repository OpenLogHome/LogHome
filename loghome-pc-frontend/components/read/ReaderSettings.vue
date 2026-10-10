<template>
  <el-drawer custom-class="reading-drawer reading-settings-drawer" title="阅读设置" :visible="visible" @update:visible="$emit('update:visible', $event)" size="min(480px, 100%)" append-to-body>
    <div class="reader-settings-shell">
      <div class="reader-settings">
        <section>
          <h3>排版</h3>
          <div class="setting-row"><span>阅读模式</span><div class="options"><button :aria-pressed="value.mode === 'page'" @click="change({ mode: 'page' })">翻页</button><button :aria-pressed="value.mode === 'text'" @click="change({ mode: 'text' })">滚动</button></div></div>
          <div class="setting-row"><span>字号</span><div class="stepper"><button aria-label="减小字号" :disabled="value.fontSize <= 14" @click="change({ fontSize: value.fontSize - 1 })">A−</button><output>{{ value.fontSize }} px</output><button aria-label="增大字号" :disabled="value.fontSize >= 36" @click="change({ fontSize: value.fontSize + 1 })">A＋</button></div></div>
          <div class="setting-row"><span>行距</span><div class="options"><button v-for="height in [1.5, 1.7, 1.8, 2]" :key="height" :aria-pressed="value.lineHeight === height" @click="change({ lineHeight: height })">{{ height }}</button></div></div>
          <div class="setting-row"><label for="reader-width">正文宽度</label><div class="width-control"><input id="reader-width" type="range" min="620" max="1120" step="20" :value="value.width" @input="change({ width: Number($event.target.value) })"><output>{{ value.width }} px</output></div></div>
        </section>
        <section>
          <h3>字体 <small v-if="resourcesLoading">配置加载中…</small></h3>
          <div class="font-grid"><button v-for="(font, key) in fonts" :key="key" :aria-pressed="value.font === key" :disabled="fontStates[key] === 'loading'" @click="$emit('font', key)"><strong>{{ font.name }}</strong><span>{{ fontStates[key] === 'loading' ? '正在下载…' : fontStates[key] === 'failed' ? '加载失败，点击重试' : value.font === key ? '当前字体' : '山川湖海，落笔成诗。' }}</span></button><button v-for="font in legacyFonts" :key="font.key" :aria-pressed="value.font === font.key" @click="$emit('font', font.key)"><strong>{{ font.name }}</strong><span>使用本机字体</span></button></div>
          <p v-if="fontError" class="error" role="alert">{{ fontError }}</p>
        </section>
        <section>
          <h3>纯色主题</h3>
          <div class="themes"><button v-for="option in options" :key="option.key" :style="{ backgroundColor: option.backgroundColor, color: option.fontColor }" :aria-label="`${option.name}${option.locked ? '，通行证专享' : ''}`" :aria-pressed="value.theme === option.key && !value.backgroundSkinKey" @click="$emit('theme', option.key)"><span>{{ option.name }}</span><i v-if="option.locked" class="el-icon-lock" aria-hidden="true" /></button></div>
        </section>
        <section>
          <h3>背景皮肤 <button class="refresh" :disabled="resourcesLoading" @click="$emit('refresh')">刷新配置</button></h3>
          <p v-if="resourceError" class="error" role="alert">{{ resourceError }}</p>
          <div class="skin-grid"><button :aria-pressed="!value.backgroundSkinKey" @click="$emit('skin', '')"><div class="skin-preview plain" :style="{ backgroundColor: theme.backgroundColor }">Aa</div><span>纯色背景</span></button><button v-for="skin in skins" :key="skin.skin_key" :aria-pressed="value.backgroundSkinKey === skin.skin_key" @click="$emit('skin', skin.skin_key)"><img :src="skin.image_url" alt="" loading="lazy" class="skin-preview"><span>{{ skin.skin_name }} <i v-if="skin.is_locked" class="el-icon-lock" aria-hidden="true" /></span><small v-if="skin.is_locked">{{ skin.required_membership === 'super' ? '超级通行证专享' : '通行证专享' }}</small></button></div>
        </section>
        <p v-if="storageError" class="error" role="status">浏览器无法保存设置，本次阅读仍可使用。</p>
        <button class="reset" @click="$emit('reset')">恢复默认设置</button>
      </div>
      <div v-if="lockedMessage" class="settings-feedback" role="status" aria-live="polite" aria-atomic="true">
        <i class="el-icon-lock" aria-hidden="true" />
        <div class="feedback-copy"><strong>通行证专享</strong><p>{{ lockedMessage }}</p></div>
        <button class="membership-action" @click="$emit('membership')">查看通行证</button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import { themes, THEME_NAMES, MEMBER_THEMES, canUseBackground } from '~/utils/reader-preferences'
export default {
  props: { visible: Boolean, value: { type: Object, required: true }, fonts: { type: Object, required: true }, skins: { type: Array, default: () => [] }, tier: String, fontStates: { type: Object, default: () => ({}) }, fontError: String, resourceError: String, lockedMessage: String, resourcesLoading: Boolean, storageError: Boolean },
  computed: {
    theme() { return themes[this.value.theme] || themes.white },
    options() { return Object.keys(themes).filter(key => key !== 'blockepoch').map(key => ({ key, name: THEME_NAMES[key], ...themes[key], locked: MEMBER_THEMES.includes(key) && !canUseBackground('standard', this.tier) })) },
    legacyFonts() { return [{ key: 'serif', name: '本机宋体' }, { key: 'sans-serif', name: '本机黑体' }] }
  },
  methods: { change(patch) { this.$emit('input', { ...this.value, ...patch }) } }
}
</script>
<style scoped>
.reader-settings-shell { display: flex; flex-direction: column; flex: 1; min-height: 0; height: 100%; overflow: hidden; }
.reader-settings { flex: 1; min-height: 0; padding: 0 24px 30px; overflow-y: auto; color: #433b35; font-size: 14px; }section { border-bottom: 1px solid #eae5df; padding-bottom: 22px; margin-bottom: 20px; }h3 { font-size: 15px; display: flex; justify-content: space-between; align-items: center; margin: 5px 0 18px; }h3 small { font-weight: 400; font-size: 12px; }button { cursor: pointer; border: 1px solid #ded8cf; background: #fff; color: inherit; border-radius: 6px; padding: 8px 12px; }button:disabled { opacity: .5; cursor: default; }button[aria-pressed="true"] { border-color: #806649; box-shadow: inset 0 0 0 1px #806649; }.setting-row { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin: 14px 0; }.stepper,.options { display: flex; align-items: center; gap: 6px; }output { font-variant-numeric: tabular-nums; font-size: 12px; }.stepper output { width: 58px; text-align: center; }.width-control { display: flex; align-items: center; gap: 10px; min-width: 0; }.width-control input { width: 130px; accent-color: #806649; }.font-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 8px; }.font-grid button { display: flex; flex-direction: column; gap: 8px; text-align: left; padding: 12px; }.font-grid span,small { color: #85776b; font-size: 12px; }.themes { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8px; }.themes button { display: flex; justify-content: space-between; align-items: center; padding: 12px 8px; }.skin-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 9px; }.skin-grid button { padding: 0 0 8px; overflow: hidden; min-width: 0; }.skin-preview { width: 100%; height: 65px; object-fit: cover; }.plain { display: flex; align-items: center; justify-content: center; font-size: 22px; color: #6a624c; }.skin-grid span,.skin-grid small { display: block; font-size: 12px; margin: 5px 2px 0; }.refresh { border: 0; padding: 4px; background: none; color: #806649; font-size: 12px; text-decoration: underline; }.error { color: #a44735; font-size: 12px; line-height: 1.7; margin: 12px 0; }.reset { width: 100%; }button:focus-visible,input:focus-visible { outline: 2px solid #806649; outline-offset: 2px; }@media(max-width:400px) { .reader-settings { padding: 0 14px 24px; }.themes { grid-template-columns: repeat(2,minmax(0,1fr)); }.width-control input { width: 95px; } }

.settings-feedback { flex: none; display: flex; align-items: center; gap: 12px; padding: 16px 24px calc(16px + env(safe-area-inset-bottom, 0px)); border-top: 1px solid var(--reading-line, #e4e3de); background: var(--reading-hover, #f5f4f0); color: var(--reading-ink, #302f2a); }
.settings-feedback > i { align-self: flex-start; margin-top: 2px; color: var(--reading-accent, #79573c); font-size: 17px; }
.feedback-copy { flex: 1; min-width: 0; }
.feedback-copy strong { display: block; margin-bottom: 4px; font-size: 13px; font-weight: 600; }
.feedback-copy p { margin: 0; color: var(--reading-secondary, #615e57); font-size: 12px; line-height: 1.7; overflow-wrap: anywhere; }
.membership-action { flex: none; min-height: 38px; padding: 8px 12px; border-color: var(--reading-line, #e4e3de); color: var(--reading-accent, #79573c); font: inherit; font-size: 13px; white-space: nowrap; }
.membership-action:hover { border-color: var(--reading-accent, #79573c); background: var(--reading-surface, #fff); }
@media(max-width:400px) { .settings-feedback { padding-left: 14px; padding-right: 14px; gap: 8px; } }
</style>
