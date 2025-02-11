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
  }

  Future<void> _initialize() async {
    try {
      // 同时执行资源准备和延时
      final results = await Future.wait([
        AssetUtils.prepareAssets(),
        Future.delayed(const Duration(seconds: 2)), // 最小显示时间3秒
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
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage('assets/images/splash.png'),
            fit: BoxFit.cover,
          ),
        ),
      ),
    );
  }
}
