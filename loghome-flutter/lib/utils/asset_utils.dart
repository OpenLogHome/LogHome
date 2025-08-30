import 'dart:io';
import 'package:flutter/services.dart';
import 'package:path_provider/path_provider.dart';
import 'package:archive/archive.dart';
import 'package:package_info_plus/package_info_plus.dart';

class AssetUtils {
  /// 判断当前是否为调试模式
  static bool get isDebugMode {
    // 使用Flutter内置的方法判断是否为调试模式
    return const bool.fromEnvironment('dart.vm.product') == false;
  }
  
  /// 将版本字符串转换为可比较的整数值
  static int parseVersionString(String version) {
    try {
      final parts = version.split('.');
      int major = 0, minor = 0, patch = 0;
      
      if (parts.length > 0) major = int.tryParse(parts[0]) ?? 0;
      if (parts.length > 1) minor = int.tryParse(parts[1]) ?? 0;
      if (parts.length > 2) patch = int.tryParse(parts[2]) ?? 0;
      
      return int.parse('${major}${minor}${patch}');
    } catch (e) {
      print('版本解析错误: $e, 版本字符串: $version');
      return 0;
    }
  }

  static Future<String> prepareAssets() async {
    try {
      final appDir = await getApplicationDocumentsDirectory();
      final webDir = Directory('${appDir.path}/web');
      
      print('Web directory: ${webDir.path}');
      
      final packageInfo = await PackageInfo.fromPlatform();
      final currentPackageVersion = packageInfo.buildNumber;
      final versionFile = File('${webDir.path}/.version');
      
      bool needExtract = !await webDir.exists();
      
      if (await webDir.exists() && await versionFile.exists()) {
        final savedVersion = await versionFile.readAsString();
        
        // 使用新的版本比较逻辑
        print('Comparing versions: saved=$savedVersion, current=$currentPackageVersion');
        final savedVersionInt = int.parse(savedVersion);
        final currentVersionInt = int.parse(currentPackageVersion);
        
        if (savedVersionInt < currentVersionInt) {
          print('App version changed: $savedVersion -> $currentPackageVersion');
          needExtract = true;
          await webDir.delete(recursive: true);
        } else {
          print('Using cached web content (version: $currentPackageVersion)');
        }
      }
      
      if (needExtract) {
        print('Extracting web content (version: $currentPackageVersion)');
        
        if (!await webDir.exists()) {
          await webDir.create(recursive: true);
        }

        final ByteData data = await rootBundle.load('assets/web/web.zip');
        print('Zip file size: ${data.lengthInBytes}');
        
        final List<int> bytes = data.buffer.asUint8List();
        final archive = ZipDecoder().decodeBytes(bytes);
        
        for (final file in archive) {
          final filename = file.name;
          if (file.isFile) {
            final filePath = '${webDir.path}/$filename';
            print('Extracting: $filePath');
            
            final fileDir = Directory(File(filePath).parent.path);
            if (!await fileDir.exists()) {
              await fileDir.create(recursive: true);
            }
            
            await File(filePath).writeAsBytes(file.content as List<int>);
          }
        }
        
        await versionFile.writeAsString(currentPackageVersion);
      }

      final indexPath = '${webDir.path}/index.html';
      if (!await File(indexPath).exists()) {
        throw Exception('index.html not found: $indexPath');
      }
      
      return indexPath;
    } catch (e, stack) {
      print('Asset preparation error: $e');
      print('Stack trace: $stack');
      rethrow;
    }
  }

  static Future<String> getCurrentAssetVersion() async {
    final appDir = await getApplicationDocumentsDirectory();
    final webDir = Directory('${appDir.path}/web');
    final versionFile = File('${webDir.path}/.version');
    if (await versionFile.exists()) {
      return await versionFile.readAsString();
    }
    return '';
  }

  /// 热更新资源文件
  /// [url] 资源包下载链接
  /// [newVersion] 新资源包的版本号
  /// [onProgress] 内部使用的进度回调，用于更新Flutter UI
  static Future<void> hotUpdateAssets({
    required String url,
    required String newVersion,
    Function(double progress, String status)? onProgress,
  }) async {
    try {
      final appDir = await getApplicationDocumentsDirectory();
      final webDir = Directory('${appDir.path}/web');
      final versionFile = File('${webDir.path}/.version');
      final tmpZip = File('${webDir.path}/update.zip');
      
      if (!await webDir.exists()) {
        await webDir.create(recursive: true);
      }
      
      // 下载 zip 文件
      if (onProgress != null) {
        onProgress(0.0, 'downloading');
      }
      
      final client = HttpClient();
      final request = await client.getUrl(Uri.parse(url));
      final response = await request.close();
      final total = response.contentLength;
      int received = 0;
      final sink = tmpZip.openWrite();
      
      await for (var chunk in response) {
        received += chunk.length;
        sink.add(chunk);
        if (onProgress != null && total > 0) {
          onProgress(received / total, 'downloading');
        }
      }
      await sink.close();
      
      // 解压 zip 文件
      if (onProgress != null) {
        onProgress(0.0, 'extracting');
      }
      
      final bytes = await tmpZip.readAsBytes();
      final archive = ZipDecoder().decodeBytes(bytes);
      int extractedCount = 0;
      int totalFiles = archive.files.where((f) => f.isFile).length;
      
      for (final file in archive) {
        final filename = file.name;
        if (file.isFile) {
          final filePath = '${webDir.path}/$filename';
          final fileDir = Directory(File(filePath).parent.path);
          if (!await fileDir.exists()) {
            await fileDir.create(recursive: true);
          }
          await File(filePath).writeAsBytes(file.content as List<int>);
          
          extractedCount++;
          if (onProgress != null && totalFiles > 0) {
            onProgress(extractedCount / totalFiles, 'extracting');
          }
        }
      }
      
      await tmpZip.delete();
      await versionFile.writeAsString(newVersion);
      
      if (onProgress != null) {
        onProgress(1.0, 'completed');
      }
    } catch (e) {
      print('Hot update error: $e');
      if (onProgress != null) {
        onProgress(0.0, 'failed');
      }
      rethrow;
    }
  }
}