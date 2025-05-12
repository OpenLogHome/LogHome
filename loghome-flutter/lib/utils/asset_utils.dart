import 'dart:io';
import 'package:flutter/services.dart';
import 'package:path_provider/path_provider.dart';
import 'package:archive/archive.dart';
import 'package:package_info_plus/package_info_plus.dart';

class AssetUtils {
  static Future<String> prepareAssets() async {
    try {
      final appDir = await getApplicationDocumentsDirectory();
      final webDir = Directory('${appDir.path}/web');
      
      print('Web directory: ${webDir.path}');
      
      final packageInfo = await PackageInfo.fromPlatform();
      final currentVersion = packageInfo.version;
      final versionFile = File('${webDir.path}/.version');
      
      bool needExtract = !await webDir.exists();
      
      if (await webDir.exists() && await versionFile.exists()) {
        final savedVersion = await versionFile.readAsString();
        if (savedVersion != currentVersion) {
          print('App version changed: $savedVersion -> $currentVersion');
          needExtract = true;
          await webDir.delete(recursive: true);
        } else {
          print('Using cached web content (version: $currentVersion)');
        }
      }
      
      if (needExtract) {
        print('Extracting web content (version: $currentVersion)');
        
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
        
        await versionFile.writeAsString(currentVersion);
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
}