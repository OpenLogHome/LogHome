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
    setStatusBarStyle(isDark) {
        window.flutter_inappwebview.callHandler('setStatusBarStyle', isDark);
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
};

// 使用示例:
/*
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
*/