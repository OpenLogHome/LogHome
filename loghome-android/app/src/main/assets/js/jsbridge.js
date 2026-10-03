console.log('JS injection successful');

function withCurrentThemeBackground(payload) {
    const enrichedPayload = Object.assign({}, payload || {});
    try {
        enrichedPayload.themeBackgroundColor = window.localStorage.getItem('themeMode') === 'dark'
            ? '#252525'
            : '#ffffff';
    } catch (error) {}
    return enrichedPayload;
}

// 示例：向 Flutter 发送消息
// window.flutter_inappwebview.callHandler('Flutter', 'Hello from JS');

window.jsBridge = {
    inApp: true,
    nativeRouterAvailable: true,
    nativeLogisticsAvailable: true,
    appVersion: '250',
    language: 'zh-CN', // 将被原生注入实际生效语言
    statusBarHeight: 0, // 将被Flutter注入实际值
    ready(callback) {
        callback();
    },
    setNavigationBarVisible(visible) {
        window.flutter_inappwebview.callHandler('setNavigationBarVisible', visible);
    },
    /**
     * 同步应用显示语言到原生壳，使原生界面（听书条、对话框等）与 H5 保持一致。
     * @param {string} language - 'zh-CN' | 'en' | 'follow-system'
     * @returns {Promise<boolean>}
     */
    setAppLanguage(language) {
        return window.flutter_inappwebview.callHandler('setAppLanguage', language);
    },
    /**
     * 设置状态栏和导航栏样式
     * @param {string} backgroundColor - 系统UI（状态栏和导航栏）背景色，16进制颜色值，如 '#FFFFFF'
     * @returns {Promise<boolean>} - 设置是否成功
     */
    setSystemUIStyle(backgroundColor) {
        return window.flutter_inappwebview.callHandler('setStatusBarStyle', backgroundColor);
    },

    /**
     * 记录应用主题背景色，供新原生页面的首帧使用。
     * 此颜色独立于状态栏颜色，避免浅色页面的深色导航栏污染页面背景。
     */
    rememberThemeBackground(backgroundColor) {
        return window.flutter_inappwebview.callHandler('rememberThemeBackground', backgroundColor);
    },
    
    /**
     * 设置状态栏样式（兼容旧版本）
     * @param {string} backgroundColor - 状态栏背景色，16进制颜色值，如 '#FFFFFF'
     * @returns {Promise<boolean>} - 设置是否成功
     * @deprecated 请使用 setSystemUIStyle 代替
     */
    setStatusBarStyle(backgroundColor) {
        return this.setSystemUIStyle(backgroundColor);
    },
    getBatteryLevel() {
        return new Promise((resolve, reject) => {
            window.flutter_inappwebview.callHandler('getBatteryLevel')
                .then(resolve)
                .catch(reject);
        });
    },
    getBatteryState() {
        return new Promise((resolve, reject) => {
            window.flutter_inappwebview.callHandler('getBatteryState')
                .then(resolve)
                .catch(reject);
        });
    },
    enableVolumeKeyListener() {
        return window.flutter_inappwebview.callHandler('enableVolumeKeyListener');
    },
    disableVolumeKeyListener() {
        return window.flutter_inappwebview.callHandler('disableVolumeKeyListener');
    },
    openInBrowser(url) {
        return window.flutter_inappwebview.callHandler('openInBrowser', url);
    },
    queryStoreLogistics(payload) {
        return window.flutter_inappwebview.callHandler('queryStoreLogistics', payload || {});
    },
    /**
     * 执行热更新
     * @param {string} url - 资源包URL
     * @param {string} version - 新版本号
     * @returns {Promise<boolean>} - 更新是否成功
     */
    hotUpdateAssets(url, version) {
        return window.flutter_inappwebview.callHandler('hotUpdateAssets', url, version);
    },

    /**
     * 打开由 Android 原生层管理的听书播放器。
     * H5 只需监听 loghome:audiobook-progress 事件进行段落高亮。
     * @param {{articleIds: string[], articles?: Array<object>, playlistKey?: string, startArticleId?: string, startParagraphId?: string, bookTitle?: string, coverUrl?: string}} payload
     * @returns {Promise<boolean>}
     */
    openNativeAudiobookPlayer(payload) {
        return window.flutter_inappwebview.callHandler('openNativeAudiobookPlayer', payload || {});
    },

    /**
     * 替换播放列表
     * @param {Array<string>} articleIds - 文章ID列表
     * @param {string} [startArticleId] - 可选，指定从哪个文章开始播放，如果不指定则从第一个文章开始
     * @returns {Promise<boolean>} - 替换是否成功
     */
    replacePlaylist(articleIds, startArticleId) {
        return window.flutter_inappwebview.callHandler('replacePlaylist', articleIds, startArticleId);
    },

    /**
     * 获取系统语音及可按需下载的内嵌离线语音
     * @returns {Promise<Array<{id: string, name: string, description: string, engine: string, installed: boolean, requiresDownload: boolean, downloadSizeBytes?: number}>>}
     */
    getAvailableVoices() {
        return window.flutter_inappwebview.callHandler('getAvailableVoices');
    },

    /**
     * 设置TTS语音
     * 选择尚未安装的内嵌语音时会先下载并校验模型。
     * @param {string} voice - 语音标识符，例如 'system-default'、系统 voice name 或 sherpa voice id
     * @returns {Promise<boolean>} - 设置是否成功
     */
    setVoice(voice) {
        return window.flutter_inappwebview.callHandler('setVoice', voice);
    },

    playAudio() {
        return window.flutter_inappwebview.callHandler('playAudio');
    },

    pauseAudio() {
        return window.flutter_inappwebview.callHandler('pauseAudio');
    },

    getPlaybackProgress() {
        return window.flutter_inappwebview.callHandler('getPlaybackProgress');
    },

    /**
     * 跳转到指定文章的指定段落
     * @param {string} articleId - 文章ID
     * @param {string} paragraphId - 段落ID
     * @returns {Promise<boolean>} - 跳转是否成功
     */
    jumpToArticleParagraph(articleId, paragraphId) {
        return window.flutter_inappwebview.callHandler('jumpToArticleParagraph', articleId, paragraphId);
    },

    /**
     * 获取系统剪贴板内容
     * @returns {Promise<string>} - 剪贴板内容，如果获取失败则返回空字符串
     */
    getClipboardData() {
        return new Promise((resolve, reject) => {
            window.flutter_inappwebview.callHandler('getClipboardData')
                .then(resolve)
                .catch(reject);
        });
    },

    /**
     * 复制文本到系统剪贴板
     * @param {string} text - 要复制的文本内容
     * @returns {Promise<boolean>} - 复制是否成功
     */
    copyToClipboard(text) {
        return new Promise((resolve, reject) => {
            window.flutter_inappwebview.callHandler('copyToClipboard', text)
                .then(resolve)
                .catch(reject);
        });
    },

    /**
     * 下载字体到本地并返回可用于 @font-face 的本地 URI
     * @param {string} fontKey - 字体 key（用于缓存）
     * @param {string} fontUrl - 字体下载地址
     * @param {string} [fontFormat='ttf'] - 字体格式（ttf/otf/woff/woff2）
     * @param {string} [fontVersion='1'] - 字体版本（用于缓存失效）
     * @returns {Promise<string>} - 本地字体 URI（file://...）
     */
    downloadFont(fontKey, fontUrl, fontFormat = 'ttf', fontVersion = '1') {
        return window.flutter_inappwebview.callHandler(
            'downloadFont',
            fontKey,
            fontUrl,
            fontFormat,
            fontVersion
        );
    },

    nativeNavigateTo(payload) {
        return window.flutter_inappwebview.callHandler('nativeNavigateTo', withCurrentThemeBackground(payload));
    },

    nativeRedirectTo(payload) {
        return window.flutter_inappwebview.callHandler('nativeRedirectTo', withCurrentThemeBackground(payload));
    },

    nativeReLaunch(payload) {
        return window.flutter_inappwebview.callHandler('nativeReLaunch', withCurrentThemeBackground(payload));
    },

    nativeSwitchTab(payload) {
        return window.flutter_inappwebview.callHandler('nativeSwitchTab', withCurrentThemeBackground(payload));
    },

    nativeNavigateBack(payload) {
        return window.flutter_inappwebview.callHandler('nativeNavigateBack', payload || {});
    },
};

// 使用示例:
/*
// 音量键监听示例
// 开启监听
await window.jsBridge.enableVolumeKeyListener();

// 添加事件监听
window.addEventListener('volumeKeyPress', (event) => {
    if (event.detail === 'up') {
        console.log('音量+键被按下');
    } else if (event.detail === 'down') {
        console.log('音量-键被按下');
    }
});

// 取消监听
await window.jsBridge.disableVolumeKeyListener();

// 系统UI样式设置示例
// 设置状态栏和导航栏背景色为蓝色
await window.jsBridge.setSystemUIStyle('#1B4B88');
console.log('设置系统UI为蓝色');

// 设置状态栏和导航栏背景色为白色
await window.jsBridge.setSystemUIStyle('#FFFFFF');
console.log('设置系统UI为白色');

// 设置状态栏和导航栏背景色为黑色
await window.jsBridge.setSystemUIStyle('#000000');
console.log('设置系统UI为黑色');

// 兼容旧版本的调用方式
// await window.jsBridge.setStatusBarStyle('#1B4B88');

// 触发热更新示例：
await window.jsBridge.hotUpdateAssets('https://yourdomain.com/web.zip', '250202');

// 剪贴板操作示例
// 复制文本到剪贴板
await window.jsBridge.copyToClipboard('要复制的文本内容');
console.log('文本已复制到剪贴板');

// 获取剪贴板内容
const clipboardText = await window.jsBridge.getClipboardData();
console.log('剪贴板内容:', clipboardText);
*/
