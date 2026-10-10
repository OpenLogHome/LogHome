import { readingToken } from '~/plugins/api/reading'
import { themes, DEFAULT_PREFERENCES, MEMBER_THEMES, normalizePreferences, readPreferences, savePreferences, readerFonts, membershipTier, canUseBackground } from '~/utils/reader-preferences'
import { normalizeBackgroundSkin, createBackgroundSkinStyle } from '~/utils/reader-backgrounds'
import { loadReaderFont } from '~/utils/reader-font-loader'

export default {
  data() {
    return { readerPreferences: { ...DEFAULT_PREFERENCES }, readerFonts: readerFonts(), readerSkins: [], readerTier: '', readerResourcesLoading: false, readerResourceError: '', readerFontError: '', readerFontStates: {}, readerFontFamily: '', readerLockedMessage: '', readerStorageError: false, readerResourceVersion: 0, readerFontVersion: 0, readerPreferenceRevision: 0 }
  },
  computed: {
    readerTheme() { return themes[this.readerPreferences.theme] || themes.white },
    currentReaderSkin() { return this.readerSkins.find(skin => skin.skin_key === this.readerPreferences.backgroundSkinKey && !skin.is_locked) || null },
    readerAppearance() {
      const skinStyle = createBackgroundSkinStyle(this.currentReaderSkin)
      if (this.currentReaderSkin && ['obsidian_orbit', 'ember_library'].includes(this.currentReaderSkin.skin_key)) skinStyle.backgroundSize = '100% 100%'
      return { backgroundColor: this.readerTheme.backgroundColor, color: this.readerTheme.fontColor, '--reader-secondary': this.readerTheme.secondaryFontColor, '--reader-line': this.readerTheme.lineColor, ...skinStyle }
    },
    readerTypography() {
      const system = '"PingFang SC", "Helvetica Neue", "Microsoft YaHei", Arial, sans-serif'
      const font = this.readerPreferences.font
      const family = font === 'serif' ? '"Songti SC", SimSun, serif' : font === 'sans-serif' ? '"Heiti SC", "Microsoft YaHei", sans-serif' : this.readerFontFamily ? `"${this.readerFontFamily}", ${system}` : system
      return { fontSize: `${this.readerPreferences.fontSize}px`, lineHeight: this.readerPreferences.lineHeight, fontFamily: family, maxWidth: `${this.readerPreferences.width}px` }
    }
  },
  mounted() {
    const restored = readPreferences({ getItem: key => window.localStorage.getItem(key) })
    this.readerPreferences = { ...restored, theme: MEMBER_THEMES.includes(restored.theme) || restored.theme === 'blockepoch' ? 'white' : restored.theme, backgroundSkinKey: '' }
    this.refreshReaderResources(restored)
    window.addEventListener('focus', this.onReaderAccountFocus)
    window.addEventListener('storage', this.onReaderStorage)
  },
  beforeDestroy() {
    this.readerResourceVersion++; this.readerFontVersion++
    window.removeEventListener('focus', this.onReaderAccountFocus)
    window.removeEventListener('storage', this.onReaderStorage)
  },
  methods: {
    onReaderStorage(event) { if (event.key === 'token') this.refreshReaderResources() },
    onReaderAccountFocus() { this.refreshReaderResources() },
    async refreshReaderResources(restored) {
      const version = ++this.readerResourceVersion, token = readingToken(), revision = this.readerPreferenceRevision
      const wanted = restored && typeof restored === 'object' && !restored.type ? restored : { ...this.readerPreferences }
      this.readerTier = ''; this.readerResourcesLoading = true; this.readerResourceError = ''; this.readerLockedMessage = ''
      // Until the new account's permission is known, protected appearances are not rendered.
      if (MEMBER_THEMES.includes(this.readerPreferences.theme) || this.readerPreferences.theme === 'blockepoch') this.readerPreferences = { ...this.readerPreferences, theme: 'white' }
      this.readerSkins = this.readerSkins.map(skin => ({ ...skin, is_locked: !canUseBackground(skin.required_membership, '') }))
      const results = await Promise.allSettled([this.$api.reader.fonts(), this.$api.reader.backgrounds(), token ? this.$api.reader.membership() : Promise.resolve(null)])
      if (version !== this.readerResourceVersion) return
      if (token !== readingToken()) return this.refreshReaderResources()
      const [fontResult, skinResult, memberResult] = results
      this.readerTier = memberResult.status === 'fulfilled' ? membershipTier(memberResult.value) : ''
      if (fontResult.status === 'fulfilled' && Array.isArray(fontResult.value)) this.readerFonts = readerFonts(fontResult.value)
      if (skinResult.status === 'fulfilled' && Array.isArray(skinResult.value)) this.readerSkins = skinResult.value.map(skin => normalizeBackgroundSkin({ ...skin, is_locked: !canUseBackground(skin.required_membership, this.readerTier) }, key => Boolean(themes[key]))).filter(Boolean)
      else this.readerSkins = []
      const failures = []
      if (fontResult.status === 'rejected') failures.push('字体配置暂不可用，使用内置配置。')
      if (skinResult.status === 'rejected') failures.push('背景配置加载失败，请刷新重试。')
      if (memberResult.status === 'rejected') failures.push('通行证权限暂不可用，请刷新重试。')
      this.readerResourceError = failures.join(' '); this.readerResourcesLoading = false
      const next = normalizePreferences(revision === this.readerPreferenceRevision ? wanted : this.readerPreferences)
      if (MEMBER_THEMES.includes(next.theme) && !canUseBackground('standard', this.readerTier)) next.theme = 'white'
      const selectedSkin = this.readerSkins.find(skin => skin.skin_key === next.backgroundSkinKey && !skin.is_locked)
      if (selectedSkin) next.theme = selectedSkin.theme_key
      else { next.backgroundSkinKey = ''; if (next.theme === 'blockepoch') next.theme = 'white' }
      if (!this.readerFonts[next.font] && !['serif', 'sans-serif'].includes(next.font)) next.font = 'default'
      this.readerPreferences = next
      // Failed configuration requests should not erase a saved appearance for the next online visit.
      if (!failures.length) this.persistReaderPreferences()
      await this.selectReaderFont(next.font, false)
    },
    persistReaderPreferences() { this.readerStorageError = !savePreferences({ setItem: (key, value) => window.localStorage.setItem(key, value) }, this.readerPreferences) },
    changeReaderPreferences(value) {
      this.readerPreferenceRevision++
      this.readerPreferences = normalizePreferences(value); this.persistReaderPreferences()
    },
    selectReaderTheme(key) {
      if (!themes[key] || key === 'blockepoch') return
      if (MEMBER_THEMES.includes(key) && !canUseBackground('standard', this.readerTier)) return this.explainReaderLock('standard')
      this.readerLockedMessage = ''
      this.changeReaderPreferences({ ...this.readerPreferences, theme: key, backgroundSkinKey: '' })
    },
    selectReaderSkin(key) {
      const skin = this.readerSkins.find(item => item.skin_key === key)
      if (key && !skin) return
      if (skin && skin.is_locked) return this.explainReaderLock(skin.required_membership)
      this.readerLockedMessage = ''
      this.changeReaderPreferences({ ...this.readerPreferences, backgroundSkinKey: skin ? key : '', theme: skin ? skin.theme_key : this.readerPreferences.theme === 'blockepoch' ? 'white' : this.readerPreferences.theme })
    },
    explainReaderLock(tier) { this.readerLockedMessage = tier === 'super' ? '此背景需要有效的超级原木通行证。' : '此背景需要有效的原木通行证或超级原木通行证。' },
    async selectReaderFont(key, persist = true) {
      const version = ++this.readerFontVersion
      this.readerFontError = ''
      if (key === 'default' || ['serif', 'sans-serif'].includes(key)) {
        this.readerFontFamily = ''; this.readerPreferences = { ...this.readerPreferences, font: key }
        if (persist) { this.readerPreferenceRevision++; this.persistReaderPreferences() }
        return
      }
      const config = this.readerFonts[key]
      if (!config) return
      this.$set(this.readerFontStates, key, 'loading')
      try {
        const family = await loadReaderFont(key, config)
        this.$set(this.readerFontStates, key, 'ready')
        if (version !== this.readerFontVersion) return
        this.readerFontFamily = family; this.readerPreferences = { ...this.readerPreferences, font: key }
        if (persist) { this.readerPreferenceRevision++; this.persistReaderPreferences() }
      } catch (error) {
        this.$set(this.readerFontStates, key, 'failed')
        if (version !== this.readerFontVersion) return
        this.readerFontError = error.message
        if (!persist) { this.readerFontFamily = ''; this.readerPreferences = { ...this.readerPreferences, font: 'default' } }
      }
    },
    resetReaderPreferences() { this.readerFontVersion++; this.readerPreferenceRevision++; this.readerFontFamily = ''; this.readerFontError = ''; this.readerLockedMessage = ''; this.readerPreferences = { ...DEFAULT_PREFERENCES }; this.persistReaderPreferences() },
    openReaderMembership() { this.$openMobileWindow('/pages/membership/index', { title: '原木通行证' }) }
  }
}
