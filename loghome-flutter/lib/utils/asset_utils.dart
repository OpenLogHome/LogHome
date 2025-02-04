import 'dart:io';
import 'package:flutter/services.dart';
import 'package:path_provider/path_provider.dart';
import 'package:archive/archive.dart';

class AssetUtils {
  static Future<String> prepareAssets() async {
    try {
      final tempDir = await getTemporaryDirectory();
      final webDir = Directory('${tempDir.path}/web');
      
      print('Web directory: ${webDir.path}');
      
      if (await webDir.exists()) {
        await webDir.delete(recursive: true);
      }
      await webDir.create(recursive: true);

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