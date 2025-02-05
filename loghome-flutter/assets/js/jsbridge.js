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
};