import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';
import 'package:crypto/crypto.dart';

class AudioUtils {
  static Future<Directory> _getCacheDirectory() async {
    final tempDir = await getTemporaryDirectory();
    final cacheDir = Directory('${tempDir.path}/audio_cache');
    if (!await cacheDir.exists()) {
      await cacheDir.create(recursive: true);
    }
    return cacheDir;
  }

  static String _generateMd5(String input) {
    return md5.convert(utf8.encode(input)).toString();
  }

  static Future<File> getCachedFile(String articleId, String text, String voice) async {
    final cacheDir = await _getCacheDirectory();
    final fileName = '$articleId-${_generateMd5(text)}-$voice.mp3';
    final filePath = '${cacheDir.path}/$fileName';
    return File(filePath);
  }
  
  // 清除指定语音的所有缓存文件
  static Future<void> clearVoiceCache(String voice) async {
    final cacheDir = await _getCacheDirectory();
    final directory = Directory(cacheDir.path);
    
    if (await directory.exists()) {
      print('清除语音缓存: $voice');
      final entities = await directory.list().toList();
      
      for (var entity in entities) {
        if (entity is File && entity.path.contains('-$voice.mp3')) {
          try {
            await entity.delete();
            print('已删除缓存文件: ${entity.path}');
          } catch (e) {
            print('删除缓存文件失败: ${entity.path}, 错误: $e');
          }
        }
      }
    }
  }
}