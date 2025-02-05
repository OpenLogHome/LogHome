import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:flutter_displaymode/flutter_displaymode.dart';
import 'dart:io';
import 'dart:ui' as ui;
import 'utils/asset_utils.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'dart:collection';
import 'dart:async';
import 'package:battery_plus/battery_plus.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await FlutterDisplayMode.setHighRefreshRate();

  // 设置应用切换器描述
  if (Platform.isAndroid || Platform.isIOS) {
    await SystemChrome.setApplicationSwitcherDescription(
      const ApplicationSwitcherDescription(
        label: '原木社区',
        primaryColor: 0xFF2196F3, // Material Blue
      ),
    );
  }

  if (Platform.isAndroid) {
    await Permission.storage.request();
    await InAppWebViewController.setWebContentsDebuggingEnabled(true);
  }

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // 设置状态栏完全透明和图标颜色
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarBrightness: Brightness.light, // iOS状态栏
      statusBarIconBrightness: Brightness.dark, // Android状态栏图标
    ));

    return MaterialApp(
      title: '原木社区',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: Scaffold(
        extendBodyBehindAppBar: true,
        // 直接使用WebView，移除SafeArea
        body: const WebViewPage(),
      ),
    );
  }
}

class WebViewPage extends StatefulWidget {
  const WebViewPage({super.key});

  @override
  State<WebViewPage> createState() => _WebViewPageState();
}

class _WebViewPageState extends State<WebViewPage> {
  late InAppWebViewController _webViewController;
  final Battery _battery = Battery();
  String? _localPath;
  DateTime? _lastPressedAt; // 添加变量跟踪返回键按下时间
  Timer? _colorCheckTimer; // 添加定时器变量

  @override
  void initState() {
    super.initState();
    _prepareWebContent();
  }

  Future<void> _prepareWebContent() async {
    try {
      _localPath = await AssetUtils.prepareAssets();
      setState(() {});
    } catch (e) {
      print('WebView preparation error: $e');
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

    final statusBarHeightPx = MediaQuery.of(context).padding.top;
    final bottomPadding = MediaQuery.of(context).padding.bottom;
    PackageInfo packageInfo = await PackageInfo.fromPlatform();
    String buildNumber = packageInfo.buildNumber;

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

  // 检查顶部区域颜色并更新状态栏
  Future<void> _updateStatusBarStyle() async {
    try {
      // 获取状态栏高度区域的截图
      Uint8List? pixels = await _webViewController.takeScreenshot(
          screenshotConfiguration: ScreenshotConfiguration(
              rect: InAppWebViewRect(
                  x: 0,
                  y: 0,
                  width: MediaQuery.of(context).size.width,
                  height: MediaQuery.of(context).padding.top)));

      if (pixels != null) {
        // 解码图片
        final image = await decodeImageFromList(pixels);
        // 计算顶部区域的平均亮度
        double brightness = await _calculateBrightness(image);

        // 根据亮度设置状态栏样式
        SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness:
              brightness > 0.5 ? Brightness.dark : Brightness.light,
          statusBarBrightness:
              brightness > 0.5 ? Brightness.light : Brightness.dark,
        ));
      }
    } catch (e) {
      print('Error updating status bar style: $e');
    }
  }

  // 计算图片亮度
  Future<double> _calculateBrightness(ui.Image image) async {
    try {
      ByteData? byteData = await image.toByteData();
      if (byteData == null) return 0.5;

      int pixels = (image.height * image.width).round();
      int totalBrightness = 0;

      for (int i = 0; i < byteData.lengthInBytes; i += 4) {
        int r = byteData.getUint8(i);
        int g = byteData.getUint8(i + 1);
        int b = byteData.getUint8(i + 2);

        // 使用相对亮度公式: 0.299R + 0.587G + 0.114B
        totalBrightness += ((0.299 * r + 0.587 * g + 0.114 * b)).round();
      }

      // 返回平均亮度 (0-255) 转换为 0-1 范围
      return (totalBrightness / pixels) / 255.0;
    } catch (e) {
      print('Error calculating brightness: $e');
      return 0.5;
    }
  }

  void _initializeJavaScriptHandlers(InAppWebViewController controller) {
    controller.addJavaScriptHandler(
      handlerName: 'setNavigationBarVisible',
      callback: (args) async {
        if (args.isNotEmpty && args[0] is bool) {
          bool visible = args[0];
          print("Setting Navigation Bar Visibility: $visible");

          if (!visible) {
            // 进入全屏模式并忽略异形区
            await SystemChrome.setEnabledSystemUIMode(
              SystemUiMode.immersiveSticky,
            );
            // 设置异形屏适配
            if (Platform.isAndroid) {
              await SystemChrome.setEnabledSystemUIMode(
                SystemUiMode.immersiveSticky,
                overlays: [],
              );
            }
          } else {
            // 退出全屏模式
            await SystemChrome.setEnabledSystemUIMode(
              SystemUiMode.edgeToEdge,
            );
          }
        }
      },
    );

    controller.addJavaScriptHandler(
      handlerName: 'setStatusBarStyle',
      callback: (args) async {
        if (args.isNotEmpty && args[0] is bool) {
          bool isDark = args[0];
          SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
            statusBarColor: Colors.transparent,
            statusBarIconBrightness:
                isDark ? Brightness.light : Brightness.dark,
            statusBarBrightness: isDark ? Brightness.dark : Brightness.light,
          ));
        }
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
  }

  @override
  void dispose() {
    _colorCheckTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_localPath == null) {
      return const Center(child: CircularProgressIndicator());
    }

    final bottomPadding = MediaQuery.of(context).padding.bottom;

    return WillPopScope(
      onWillPop: _onWillPop,
      child: Scaffold(
        // 设置为true允许内容区域随键盘调整
        resizeToAvoidBottomInset: true,
        body: Padding(
          padding: EdgeInsets.only(bottom: bottomPadding),
          child: FutureBuilder<UnmodifiableListView<UserScript>>(
            future: _prepareUserScripts(),
            builder: (context, snapshot) {
              if (snapshot.hasError) {
                print("UserScript Error: ${snapshot.error}"); // 错误日志
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
                ),
                initialUserScripts: snapshot.data,
                onWebViewCreated: (controller) {
                  _webViewController = controller;
                  _initializeJavaScriptHandlers(controller);
                  print("WebView Created"); // 调试日志

                  final uri = Uri.file(_localPath!);
                  print("Loading URL: $uri"); // 调试日志
                  controller.loadUrl(
                    urlRequest: URLRequest(
                      url: WebUri.uri(uri),
                    ),
                  );
                },
                onLoadStart: (controller, url) {
                  print("Page load started: $url"); // 调试日志
                },
                onLoadStop: (controller, url) async {
                  print("Page load finished: $url");

                  // 取消之前的定时器（如果存在）
                  _colorCheckTimer?.cancel();

                  // 创建新的定时器，每500毫秒检查一次颜色
                  // _colorCheckTimer = Timer.periodic(const Duration(milliseconds: 500), (timer) {
                  //   _updateStatusBarStyle();
                  // });

                  // 验证注入
                  controller.evaluateJavascript(
                      source: "console.log('JS Bridge verification test');");
                },
                onConsoleMessage: (controller, consoleMessage) {
                  print("Console Message: ${consoleMessage.message}");
                  print("Console: ${consoleMessage.message}"); // 调试日志
                },
              );
            },
          ),
        ),
      ),
    );
  }
}
