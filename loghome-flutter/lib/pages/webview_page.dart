import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'dart:io';
import 'dart:ui' as ui;
import 'package:package_info_plus/package_info_plus.dart';
import 'dart:collection';
import 'dart:async';
import 'package:battery_plus/battery_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import 'dart:math';
import '../main.dart';  // 导入SplashScreen

class WebViewPage extends StatefulWidget {
  final String localPath; // 新增参数

  const WebViewPage({
    super.key,
    required this.localPath, // 必需参数
  });

  @override
  State<WebViewPage> createState() => _WebViewPageState();
}

class _WebViewPageState extends State<WebViewPage> with WidgetsBindingObserver {
  late InAppWebViewController _webViewController;
  final Battery _battery = Battery();
  Timer? _colorCheckTimer;
  DateTime? _lastPressedAt;
  bool _volumeKeyEnabled = false;
  Color _currentNavBarColor = Colors.white; // 当前导航栏颜色
  SystemUiOverlayStyle? _currentStyle; // 当前系统UI样式

  @override
  void initState() {
    super.initState();
    _verifyResourcePath();
    
    // 添加观察者以监听应用生命周期变化
    WidgetsBinding.instance.addObserver(this);
    
    // 初始化系统UI样式
    _currentStyle = SystemUiOverlayStyle(
      statusBarColor: Colors.white,
      statusBarIconBrightness: Brightness.dark,
      statusBarBrightness: Brightness.light,
      systemNavigationBarColor: Colors.white,
      systemNavigationBarIconBrightness: Brightness.dark,
      systemNavigationBarDividerColor: Colors.white,
    );
    
    // 直接应用系统UI样式
    SystemChrome.setSystemUIOverlayStyle(_currentStyle!);
    
    // 设置初始导航栏颜色
    _currentNavBarColor = Colors.white;
  }
  
  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    // 当应用恢复前台时，重新应用系统UI样式
    if (state == AppLifecycleState.resumed && _currentStyle != null) {
      SystemChrome.setSystemUIOverlayStyle(_currentStyle!);
    }
  }

  // 设置系统UI样式的统一方法
  void _setSystemUIStyle(Color backgroundColor, {bool forceDarkIcons = false}) {
    // 根据背景色亮度自动计算前景色亮度
    int r = (backgroundColor.value >> 16) & 0xFF;
    int g = (backgroundColor.value >> 8) & 0xFF;
    int b = backgroundColor.value & 0xFF;
    double brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    Brightness iconBrightness = forceDarkIcons ? Brightness.dark : 
                               (brightness > 128 ? Brightness.dark : Brightness.light);
    
    // 保存当前导航栏颜色
    _currentNavBarColor = backgroundColor;
    
    // 设置状态栏和导航栏样式
    final style = SystemUiOverlayStyle(
      // 状态栏设置
      statusBarColor: backgroundColor, // Android 状态栏背景色
      statusBarIconBrightness: iconBrightness, // Android 状态栏图标颜色
      statusBarBrightness: iconBrightness == Brightness.dark ? Brightness.light : Brightness.dark, // iOS 状态栏样式
      // 导航栏设置
      systemNavigationBarColor: backgroundColor, // 导航栏背景色
      systemNavigationBarIconBrightness: iconBrightness, // 导航栏图标颜色
      systemNavigationBarDividerColor: backgroundColor, // 导航栏分隔线颜色
    );
    
    // 直接应用样式，不需要强制刷新
    SystemChrome.setSystemUIOverlayStyle(style);
    
    // 打印详细的调试信息
    print('设置UI样式: 背景色=${backgroundColor.toString()}, 图标亮度=$iconBrightness');
    print('RGB值: r=$r, g=$g, b=$b, 亮度=$brightness');
    print('状态栏颜色: ${style.statusBarColor.toString()}');
    
    // 在iOS上，状态栏颜色是通过statusBarBrightness控制的
    if (Platform.isIOS) {
      print('iOS状态栏亮度: ${style.statusBarBrightness}');
    }
    
    // 更新当前样式，供 AnnotatedRegion 使用
    setState(() {
      _currentStyle = style;
    });
  }
  
  // 验证资源文件是否存在，不存在则重新初始化
  Future<void> _verifyResourcePath() async {
    // 验证本地文件是否存在
    final file = File(widget.localPath);
    if (!await file.exists()) {
      print('资源文件不存在，需要重新初始化: ${widget.localPath}');
      // 显示错误信息
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('资源文件丢失，正在尝试恢复...'),
            duration: Duration(seconds: 3),
          ),
        );
        
        // 等待提示显示后，重新导航到启动页面以重新初始化
        await Future.delayed(const Duration(seconds: 3));
        if (mounted) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const SplashScreen()),
          );
        }
      }
    }
  }

  Future<bool> _onWillPop() async {
    bool canGoBack = await _webViewController.canGoBack();

    if (canGoBack) {
      _webViewController.goBack();
      return false;
    } else {
      if (_lastPressedAt == null ||
          DateTime.now().difference(_lastPressedAt!) >
              const Duration(seconds: 2)) {
        // 第一次按下返回键
        _lastPressedAt = DateTime.now();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('再按一次退出应用'),
            duration: Duration(seconds: 2),
          ),
        );
        return false;
      }
      return true;
    }
  }

  Future<UnmodifiableListView<UserScript>> _prepareUserScripts() async {
    String jsContent = await rootBundle.loadString('assets/js/jsbridge.js');

    final statusBarHeightPx = min(MediaQuery.of(context).padding.top, 29);
    final bottomPadding = MediaQuery.of(context).padding.bottom;
    PackageInfo packageInfo = await PackageInfo.fromPlatform();
    String buildNumber = packageInfo.buildNumber;
    print('statusBarHeightPx, $statusBarHeightPx');

    jsContent += """
        window.jsBridge.statusBarHeight = $statusBarHeightPx;
        window.jsBridge.navigationBarHeight = $bottomPadding;
        window.jsBridge.appVersion = '$buildNumber';
    """;


    return UnmodifiableListView([
      UserScript(
        source: jsContent,
        injectionTime: UserScriptInjectionTime.AT_DOCUMENT_START,
        contentWorld: ContentWorld.PAGE,
      ),
    ]);
  }

  bool volumeKeyHandler(KeyEvent event) {
    if (_volumeKeyEnabled && event is KeyDownEvent) {
      if (event.logicalKey == LogicalKeyboardKey.audioVolumeUp) {
        _webViewController.evaluateJavascript(
          source:
              'window.dispatchEvent(new CustomEvent("volumeKeyPress", {detail: "up"}))',
        );
        return true; // 阻止默认行为
      } else if (event.logicalKey == LogicalKeyboardKey.audioVolumeDown) {
        _webViewController.evaluateJavascript(
          source:
              'window.dispatchEvent(new CustomEvent("volumeKeyPress", {detail: "down"}))',
        );
        return true; // 阻止默认行为
      }
    }
    return false; // 允许默认行为
  }

  void _initializeJavaScriptHandlers(InAppWebViewController controller) {
    controller.addJavaScriptHandler(
      handlerName: 'setNavigationBarVisible',
      callback: (args) async {
        if (args.isNotEmpty && args[0] is bool) {
          bool visible = args[0];
          print("Setting Navigation Bar Visibility: $visible");

          if (!visible) {
            // 隐藏系统UI
            await SystemChrome.setEnabledSystemUIMode(
              SystemUiMode.immersiveSticky,
            );
          } else {
            // 显示系统UI并恢复之前的导航栏颜色
            await SystemChrome.setEnabledSystemUIMode(
              SystemUiMode.edgeToEdge,
              overlays: [SystemUiOverlay.top, SystemUiOverlay.bottom],
            );
            
            // 恢复之前设置的颜色
            if (_currentStyle != null) {
              // 直接应用之前的系统UI样式
              SystemChrome.setSystemUIOverlayStyle(_currentStyle!);
            }
          }
        }
      },
    );

    controller.addJavaScriptHandler(
      handlerName: 'setStatusBarStyle',
      callback: (args) async {
        if (args.isNotEmpty && args[0] is String) {
          // 解析背景色
          String backgroundColor = args[0];
          print('收到setStatusBarStyle调用，参数: $backgroundColor');
          
          // 将16进制颜色字符串转换为Color对象
          Color bgColor;
          try {
            String hexColor = backgroundColor.startsWith('#') 
                ? backgroundColor.substring(1) 
                : backgroundColor;
            
            // 标准化颜色格式
            if (hexColor.length == 3) {
              // 将 #RGB 转换为 #RRGGBB
              hexColor = hexColor.split('').map((c) => '$c$c').join('');
            }
            
            if (hexColor.length == 6) {
              hexColor = 'FF$hexColor'; // 添加不透明度
            } else if (hexColor.length == 8) {
              // 已经包含透明度，保持原样
            } else {
              throw FormatException('无效的颜色格式: $hexColor');
            }
            
            int colorValue = int.parse(hexColor, radix: 16);
            bgColor = Color(colorValue);
            print('解析后的颜色: 0x$hexColor, Color值: ${bgColor.toString()}');
          } catch (e) {
            print('无效的背景色格式: $backgroundColor, 错误: $e');
            bgColor = Colors.white; // 默认白色
          }
          
          // 根据背景色亮度自动计算前景色亮度
          int r = (bgColor.value >> 16) & 0xFF;
          int g = (bgColor.value >> 8) & 0xFF;
          int b = bgColor.value & 0xFF;
          double brightness = (r * 299 + g * 587 + b * 114) / 1000;
          Brightness iconBrightness = brightness > 128 ? Brightness.dark : Brightness.light;
          
          // 保存当前导航栏颜色
          _currentNavBarColor = bgColor;
          
          // 创建新的系统UI样式
          final newStyle = SystemUiOverlayStyle(
            // 状态栏设置
            statusBarColor: bgColor, // Android 状态栏背景色
            statusBarIconBrightness: iconBrightness, // Android 状态栏图标颜色
            statusBarBrightness: iconBrightness == Brightness.dark ? Brightness.light : Brightness.dark, // iOS 状态栏样式
            // 导航栏设置
            systemNavigationBarColor: bgColor, // 导航栏背景色
            systemNavigationBarIconBrightness: iconBrightness, // 导航栏图标颜色
            systemNavigationBarDividerColor: bgColor, // 导航栏分隔线颜色
          );
          
          // 更新当前样式
          setState(() {
            _currentStyle = newStyle;
          });
          
          // 直接应用系统UI样式
          SystemChrome.setSystemUIOverlayStyle(newStyle);
          
          // 打印详细的调试信息
          print('设置UI样式: 背景色=${bgColor.toString()}, 图标亮度=$iconBrightness');
          print('RGB值: r=$r, g=$g, b=$b, 亮度=$brightness');
          
          return true;
        }
        return false;
      },
    );

    controller.addJavaScriptHandler(
      handlerName: 'getBatteryLevel',
      callback: (args) async {
        try {
          final batteryLevel = await _battery.batteryLevel;
          return batteryLevel;
        } catch (e) {
          print('Error getting battery level: $e');
          return -1;
        }
      },
    );

    controller.addJavaScriptHandler(
      handlerName: 'getBatteryState',
      callback: (args) async {
        try {
          final batteryState = await _battery.batteryState;
          // 将 BatteryState 枚举转换为易于前端使用的字符串
          switch (batteryState) {
            case BatteryState.charging:
              return 'charging';
            case BatteryState.discharging:
              return 'discharging';
            case BatteryState.full:
              return 'full';
            default:
              return 'unknown';
          }
        } catch (e) {
          print('Error getting battery state: $e');
          return 'unknown';
        }
      },
    );

    controller.addJavaScriptHandler(
      handlerName: 'enableVolumeKeyListener',
      callback: (args) async {
        if (!_volumeKeyEnabled) {
          _volumeKeyEnabled = true;
          HardwareKeyboard.instance.addHandler(volumeKeyHandler);
        }
        return true;
      },
    );

    controller.addJavaScriptHandler(
      handlerName: 'disableVolumeKeyListener',
      callback: (args) async {
        _volumeKeyEnabled = false;
        HardwareKeyboard.instance.removeHandler(volumeKeyHandler);
        return true;
      },
    );

    controller.addJavaScriptHandler(
      handlerName: 'openInBrowser',
      callback: (args) async {
        if (args.isNotEmpty && args[0] is String) {
          final urlString = args[0];
          final uri = Uri.parse(urlString);
          try {
            await launchUrl(
              uri,
              mode: LaunchMode.externalApplication,
              webViewConfiguration: const WebViewConfiguration(
                enableJavaScript: true,
                enableDomStorage: true,
              ),
            );
            return true;
          } catch (e) {
            print('无法打开链接 $urlString: $e');
            // 尝试降级到默认浏览器打开
            if (await canLaunchUrl(uri)) {
              await launchUrl(uri);
              return true;
            }
          }
        }
        return false;
      },
    );
  }

  @override
  void dispose() {
    // 移除观察者
    WidgetsBinding.instance.removeObserver(this);
    HardwareKeyboard.instance.removeHandler(volumeKeyHandler);
    _colorCheckTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);
    final bottomPadding = mediaQuery.padding.bottom;
    final topPadding = mediaQuery.padding.top;
      
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: _currentStyle ?? SystemUiOverlayStyle(
        statusBarColor: _currentNavBarColor,
        statusBarIconBrightness: _currentNavBarColor.computeLuminance() > 0.5 ? Brightness.dark : Brightness.light,
        systemNavigationBarColor: _currentNavBarColor,
        systemNavigationBarIconBrightness: _currentNavBarColor.computeLuminance() > 0.5 ? Brightness.dark : Brightness.light,
      ),
      child: WillPopScope(
        onWillPop: _onWillPop,
        child: Scaffold(
          // 设置为true允许内容区域随键盘调整
          resizeToAvoidBottomInset: true,
          backgroundColor: _currentNavBarColor,
          // 不再扩展body到系统UI区域
          extendBody: false,
          extendBodyBehindAppBar: false,
          body: SafeArea(
            // 使用SafeArea确保内容在安全区域内
            child: Container(
              width: MediaQuery.of(context).size.width,
              color: Colors.white, // WebView容器背景色
              child: FutureBuilder<UnmodifiableListView<UserScript>>(
                future: _prepareUserScripts(),
                builder: (context, snapshot) {
                  if (snapshot.hasError) {
                    print("UserScript Error: ${snapshot.error}");
                    return Center(child: Text('Error: ${snapshot.error}'));
                  }

                  if (!snapshot.hasData) {
                    return const Center(child: CircularProgressIndicator());
                  }

                  return InAppWebView(
                    initialSettings: InAppWebViewSettings(
                      javaScriptEnabled: true,
                      allowFileAccess: true,
                      allowFileAccessFromFileURLs: true,
                      allowUniversalAccessFromFileURLs: true,
                      useShouldInterceptRequest: true,
                      // 开启硬件加速
                      useHybridComposition: true,
                      // 启用WebView硬件加速
                      hardwareAcceleration: true,
                      // 设置填满屏幕
                      transparentBackground: true,
                      // 设置显示区域，包括刘海区域
                      supportZoom: false,
                      verticalScrollBarEnabled: false,
                      horizontalScrollBarEnabled: false,
                      displayZoomControls: false,
                      // 防止过度滚动
                      overScrollMode: OverScrollMode.NEVER,
                    ),
                    initialUserScripts: snapshot.data,
                    onWebViewCreated: (controller) {
                      _webViewController = controller;
                      _initializeJavaScriptHandlers(controller);
                      print("WebView Created");

                      final uri = Uri.file(widget.localPath);
                      print("Loading URL: $uri");
                      controller.loadUrl(
                        urlRequest: URLRequest(
                          url: WebUri.uri(uri),
                        ),
                      );
                    },
                    onLoadStart: (controller, url) {
                      print("Page load started: $url");
                    },
                    onLoadStop: (controller, url) async {
                      print("Page load finished: $url");
                      // 页面加载完成后，再次确保系统UI样式正确
                      if (_currentStyle != null) {
                        SystemChrome.setSystemUIOverlayStyle(_currentStyle!);
                      }
                    },
                    onLoadError: (controller, url, code, message) async {
                      print("Page load error: $message (code: $code)");
                      if (url.toString().startsWith('file://')) {
                        _verifyResourcePath();
                      }
                    },
                    onReceivedError: (controller, request, error) {
                      print("Received error: ${error.description}");
                      if (request.url.toString().startsWith('file://')) {
                        _verifyResourcePath();
                      }
                    },
                    onConsoleMessage: (controller, consoleMessage) {
                      print("Console Message: ${consoleMessage.message}");
                    },
                  );
                },
              ),
            ),
          ),
        ),
      ),
    );
  }
}

