import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'dart:io';
import 'dart:collection';
import 'dart:async';
import 'dart:convert';
import 'package:battery_plus/battery_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import 'dart:math';
import '../main.dart';  // 导入SplashScreen
import '../utils/asset_utils.dart'; // 修正为相对路径导入
import '../services/audio_player_handler.dart';

// 使用main.dart中声明的全局变量
// 不需要再次声明_audioHandler

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
  
  // 缓存 UserScripts，避免每次重建都重新加载
  UnmodifiableListView<UserScript>? _cachedUserScripts;
  bool _isLoading = true; // WebView 加载状态
  String? _loadingError; // 加载错误信息

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
    
    // 预加载 UserScripts
    _loadUserScripts();
  }
  
  Future<void> _loadUserScripts() async {
    final startTime = DateTime.now();
    print('[Performance] Starting to load UserScripts...');
    
    try {
      _cachedUserScripts = await _prepareUserScripts();
      final loadTime = DateTime.now().difference(startTime).inMilliseconds;
      print('[Performance] UserScripts loaded in ${loadTime}ms');
      
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e) {
      final loadTime = DateTime.now().difference(startTime).inMilliseconds;
      print('[Performance] UserScripts failed to load in ${loadTime}ms: $e');
      
      if (mounted) {
        setState(() {
          _isLoading = false;
          _loadingError = e.toString();
        });
      }
    }
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
    final totalStart = DateTime.now();
    
    final jsStart = DateTime.now();
    String jsContent = await rootBundle.loadString('assets/js/jsbridge.js');
    print('[Performance] Loaded jsbridge.js in ${DateTime.now().difference(jsStart).inMilliseconds}ms');

    final statusBarStart = DateTime.now();
    final statusBarHeightPx = min(MediaQuery.of(context).padding.top, 29);
    final bottomPadding = MediaQuery.of(context).padding.bottom;
    print('[Performance] Got status bar height in ${DateTime.now().difference(statusBarStart).inMilliseconds}ms');
    
    final versionStart = DateTime.now();
    String assetVersion = await AssetUtils.getCurrentAssetVersion();
    print('[Performance] Got asset version in ${DateTime.now().difference(versionStart).inMilliseconds}ms');
    
    print('statusBarHeightPx, $statusBarHeightPx');

    jsContent += """
        window.jsBridge.statusBarHeight = $statusBarHeightPx;
        window.jsBridge.navigationBarHeight = $bottomPadding;
        window.jsBridge.appVersion = '$assetVersion';
    """;
    
    print('[Performance] Total _prepareUserScripts took ${DateTime.now().difference(totalStart).inMilliseconds}ms');

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

    controller.addJavaScriptHandler(
      handlerName: 'hotUpdateAssets',
      callback: (args) async {
        if (args.length >= 2 && args[0] is String && args[1] is String) {
          String url = args[0];
          String newVersion = args[1];
          try {
            // 显示进度弹窗
            double progress = 0.0;
            String statusText = '准备更新...';
            
            // 创建一个可更新的对话框
            BuildContext? dialogContext;
            showDialog(
              context: context,
              barrierDismissible: false,
              builder: (context) {
                dialogContext = context;
                return StatefulBuilder(
                  builder: (context, setState) {
                    return AlertDialog(
                      title: Text(statusText.contains('下载') ? '正在下载资源包' : 
                                 statusText.contains('解压') ? '正在解压资源包' : 
                                 statusText.contains('完成') ? '更新完成' : '极速更新中'),
                      content: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          LinearProgressIndicator(value: progress),
                          const SizedBox(height: 16),
                          Text('${(progress * 100).toStringAsFixed(1)}%'),
                          const SizedBox(height: 8),
                          Text(statusText, style: const TextStyle(fontSize: 12, color: Colors.grey)),
                        ],
                      ),
                    );
                  },
                );
              },
            );
            
            // 执行热更新，使用Flutter内部的进度回调更新对话框
            await AssetUtils.hotUpdateAssets(
              url: url,
              newVersion: newVersion,
              onProgress: (p, status) {
                // 更新进度和状态
                progress = p;
                if (status == 'downloading') {
                  statusText = '下载资源包中... ${(p * 100).toStringAsFixed(1)}%';
                } else if (status == 'extracting') {
                  statusText = '解压资源包中... ${(p * 100).toStringAsFixed(1)}%';
                } else if (status == 'completed') {
                  statusText = '更新完成，准备重启应用...';
                } else if (status == 'failed') {
                  statusText = '更新失败，请尝试重新更新';
                }
                
                // 使用dialogContext更新对话框
                if (dialogContext != null) {
                  (dialogContext! as Element).markNeedsBuild();
                }
              },
            );
            
            // 给用户一点时间看到完成信息
            if (statusText.contains('完成')) {
              await Future.delayed(const Duration(seconds: 1));
            }
            
            // 关闭对话框
            if (dialogContext != null) {
              Navigator.of(dialogContext!, rootNavigator: true).pop();
            }
            
            // 重启应用（重启到SplashScreen）
            if (mounted) {
              Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (_) => const SplashScreen()),
                (route) => false,
              );
            }
            return true;
          } catch (e) {
            // 关闭对话框并显示错误
            Navigator.of(context, rootNavigator: true).pop();
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('极速更新失败: $e')),
            );
            return false;
          }
        }
        return false;
      },
    );

    controller.addJavaScriptHandler(
      handlerName: 'replacePlaylist',
      callback: (args) async {
        if (args.isNotEmpty && args[0] is List) {
          List<String> articleIds = List<String>.from(args[0]);
          String? startArticleId;
          
          // 检查是否提供了起始文章ID
          if (args.length > 1 && args[1] != null) {
            startArticleId = args[1].toString();
            print('指定从文章ID: $startArticleId 开始播放');
          }
          
          await audioHandler.loadPlaylist(articleIds, startArticleId: startArticleId);
          return true;
        }
        return false;
      },
    );

    controller.addJavaScriptHandler(
      handlerName: 'playAudio',
      callback: (args) async {
        audioHandler.play();
        return true;
      },
    );

    controller.addJavaScriptHandler(
      handlerName: 'pauseAudio',
      callback: (args) async {
        audioHandler.pause();
        return true;
      },
    );

    controller.addJavaScriptHandler(
      handlerName: 'getPlaybackProgress',
      callback: (args) async {
        final progress = audioHandler.getProgress();
        // 将Map转换为JSON字符串，以便在JavaScript中正确解析
        return progress != null ? jsonEncode(progress) : null;
      },
    );

    controller.addJavaScriptHandler(
      handlerName: 'setVoice',
      callback: (args) async {
        if (args.isNotEmpty && args[0] is String) {
          String voice = args[0];
          print('设置语音: $voice');
          audioHandler.setVoice(voice);
          return true;
        }
        return false;
      },
    );

    controller.addJavaScriptHandler(
      handlerName: 'jumpToArticleParagraph',
      callback: (args) async {
        print('收到跳转请求');
        print(args);
        if (args.length >= 2 && args[0] is String && args[1] is String) {
          String articleId = args[0];
          String paragraphId = args[1];
          print('收到跳转请求：文章ID=$articleId, 段落ID=$paragraphId');
          bool result = await audioHandler.jumpToArticleParagraph(articleId, paragraphId);
          return result;
        }
        return false;
      },
    );

    controller.addJavaScriptHandler(
      handlerName: 'copyToClipboard',
      callback: (args) async {
        if (args.isNotEmpty && args[0] is String) {
          String text = args[0];
          try {
            await Clipboard.setData(ClipboardData(text: text));
            return true;
          } catch (e) {
            print('复制到剪贴板失败: $e');
            return false;
          }
        }
        return false;
      },
    );

    controller.addJavaScriptHandler(
      handlerName: 'getClipboardData',
      callback: (args) async {
        try {
          ClipboardData? data = await Clipboard.getData('text/plain');
          return data?.text ?? '';
        } catch (e) {
          print('从剪贴板获取内容失败: $e');
          return '';
        }
      },
    );
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    HardwareKeyboard.instance.removeHandler(volumeKeyHandler);
    _colorCheckTimer?.cancel();
    super.dispose();
  }
  
  Widget _buildWebViewContent() {
    if (_loadingError != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 48, color: Colors.red),
            const SizedBox(height: 16),
            Text('加载失败: $_loadingError'),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  _isLoading = true;
                  _loadingError = null;
                });
                _loadUserScripts();
              },
              child: const Text('重试'),
            ),
          ],
        ),
      );
    }
    
    if (_isLoading || _cachedUserScripts == null) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text('正在加载...'),
          ],
        ),
      );
    }
    
    print("UserScript loaded successfully, initializing WebView...");
    print("Local path: ${widget.localPath}");
    print("File exists: ${File(widget.localPath).existsSync()}");
    
    final uri = Uri.file(widget.localPath);
    print("Loading URL: $uri");
    
    return InAppWebView(
      initialUrlRequest: URLRequest(
        url: WebUri.uri(uri),
      ),
      initialSettings: InAppWebViewSettings(
        javaScriptEnabled: true,
        allowFileAccess: true,
        allowFileAccessFromFileURLs: true,
        allowUniversalAccessFromFileURLs: true,
        useShouldInterceptRequest: false,
        useHybridComposition: true,
        hardwareAcceleration: true,
        transparentBackground: true,
        supportZoom: false,
        verticalScrollBarEnabled: false,
        horizontalScrollBarEnabled: false,
        displayZoomControls: false,
        overScrollMode: OverScrollMode.NEVER,
      ),
      initialUserScripts: _cachedUserScripts,
      onWebViewCreated: (controller) {
        final createTime = DateTime.now();
        print("[Performance] WebView Created at $createTime");
        _webViewController = controller;
        _initializeJavaScriptHandlers(controller);
      },
      onLoadStart: (controller, url) {
        print("[Performance] Page load started: $url");
      },
      onLoadStop: (controller, url) async {
        print("[Performance] Page load finished: $url");
        if (_currentStyle != null) {
          SystemChrome.setSystemUIOverlayStyle(_currentStyle!);
        }
      },
      onLoadError: (controller, url, code, message) async {
        print("Page load error: $message (code: $code, url: $url)");
        if (url.toString().startsWith('file://')) {
          _verifyResourcePath();
        }
      },
      onReceivedError: (controller, request, error) {
        print("Received error: ${error.description}, type: ${error.type}");
        if (request.url.toString().startsWith('file://')) {
          _verifyResourcePath();
        }
      },
      onConsoleMessage: (controller, consoleMessage) {
        print("Console Message: ${consoleMessage.message}");
      },
    );
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
      child: PopScope(
        canPop: false,
        onPopInvoked: (didPop) async {
          if (didPop) return;
          final shouldPop = await _onWillPop();
          if (shouldPop && context.mounted) {
            Navigator.of(context).pop();
          }
        },
        child: Scaffold(
          // 设置为true允许内容区域随键盘调整
          resizeToAvoidBottomInset: true,
          backgroundColor: _currentNavBarColor,
          // 不再扩展body到系统UI区域
          extendBody: false,
          extendBodyBehindAppBar: false,
          body: SafeArea(
            child: Container(
              width: double.infinity,
              height: double.infinity,
              color: Colors.white,
              child: _buildWebViewContent(),
            ),
          ),
        ),
      ),
    );
  }
}

