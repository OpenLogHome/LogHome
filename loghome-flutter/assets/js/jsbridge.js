console.log('JS injection successful');

// 示例：向 Flutter 发送消息
// window.flutter_inappwebview.callHandler('Flutter', 'Hello from JS');

window.jsBridge = {
    inApp: true,
    appVersion: '250',
    statusBarHeight: 0, // 将被Flutter注入实际值
    ready(callback) {
        callback();
    },
    setNavigationBarVisible(visible) {
        window.flutter_inappwebview.callHandler('setNavigationBarVisible', visible);
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
    /**
     * 执行热更新
     * @param {string} url - 资源包URL
     * @param {string} version - 新版本号
     * @returns {Promise<boolean>} - 更新是否成功
     */
    hotUpdateAssets(url, version) {
        return window.flutter_inappwebview.callHandler('hotUpdateAssets', url, version);
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
*/