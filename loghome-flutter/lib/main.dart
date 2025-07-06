import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:flutter_displaymode/flutter_displaymode.dart';
import 'dart:io';
import 'utils/asset_utils.dart';
import 'package:permission_handler/permission_handler.dart';
import 'dart:async';
import 'pages/webview_page.dart';  // 新增导入

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
  
  // 确保系统UI模式设置为edgeToEdge，但保持状态栏和导航栏可见
  await SystemChrome.setEnabledSystemUIMode(
    SystemUiMode.edgeToEdge,
    overlays: [SystemUiOverlay.top, SystemUiOverlay.bottom],
  );

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // 设置状态栏和导航栏样式
    final systemUiStyle = SystemUiOverlayStyle(
      // 状态栏设置
      statusBarColor: Colors.transparent,
      statusBarBrightness: Brightness.light, // iOS状态栏
      statusBarIconBrightness: Brightness.dark, // Android状态栏图标
      // 导航栏设置
      systemNavigationBarColor: Colors.white,
      systemNavigationBarIconBrightness: Brightness.dark,
      systemNavigationBarDividerColor: Colors.transparent,
    );
    
    SystemChrome.setSystemUIOverlayStyle(systemUiStyle);

    return MaterialApp(
      title: '原木社区',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const SplashScreen(),
    );
  }
}

// 修改 SplashScreen 的跳转逻辑
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _initialize();
    
    // 确保启动屏幕的系统UI设置正确
    SystemChrome.setEnabledSystemUIMode(
      SystemUiMode.edgeToEdge,
      overlays: [SystemUiOverlay.top, SystemUiOverlay.bottom],
    );
  }

  Future<void> _initialize() async {
    try {
      // 同时执行资源准备和延时
      final results = await Future.wait([
        AssetUtils.prepareAssets(),
        Future.delayed(const Duration(seconds: 3)), // 最小显示时间2秒
      ]);

      if (mounted) {
        Navigator.of(context).pushReplacement(
          PageRouteBuilder(
            pageBuilder: (context, animation, secondaryAnimation) => WebViewPage(
              localPath: results[0], // 资源路径在results[0]
            ),
            transitionsBuilder: (context, animation, secondaryAnimation, child) {
              return FadeTransition(opacity: animation, child: child);
            },
            transitionDuration: const Duration(milliseconds: 500),
          ),
        );
      }
    } catch (e) {
      print('初始化失败: $e');
      // 显示错误信息并允许用户重试
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('应用初始化失败，请尝试重启应用'),
            duration: const Duration(seconds: 5),
            action: SnackBarAction(
              label: '重试',
              onPressed: () {
                _initialize(); // 重试初始化
              },
            ),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    // 设置启动屏的系统UI样式
    final splashSystemUiStyle = SystemUiOverlayStyle(
      // 状态栏设置
      statusBarColor: const Color(0xFF1B4B88),
      statusBarIconBrightness: Brightness.light,
      statusBarBrightness: Brightness.dark,
      // 导航栏设置
      systemNavigationBarColor: const Color(0xFF1B4B88),
      systemNavigationBarIconBrightness: Brightness.light,
      systemNavigationBarDividerColor: const Color(0xFF1B4B88),
    );
    
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: splashSystemUiStyle,
      child: Scaffold(
        body: Container(
          width: double.infinity,
          height: double.infinity,
          color: const Color(0xFF1B4B88), // 设置背景色为#1B4B88
          child: SafeArea(
            // 使用SafeArea确保内容不会被系统UI覆盖
            bottom: true, // 特别注意底部安全区域
            child: Align(
              alignment: Alignment.bottomCenter, // 图片沿屏幕底部对齐
              child: Image.asset(
                'assets/images/splash.png',
                fit: BoxFit.fitWidth, // 图片宽度适应屏幕
              ),
            ),
          ),
        ),
      ),
    );
  }
}
