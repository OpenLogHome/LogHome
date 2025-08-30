import 'dart:async';
import 'dart:io';
import 'package:just_audio/just_audio.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../utils/audio_utils.dart';

/// 一个自定义的音频源类，使用POST请求来获取音频数据
class PostAudioSource extends StreamAudioSource {
  final String text;
  final String voice;
  final File cacheFile;
  final Map<String, String> headers;
  
  PostAudioSource({
    required this.text,
    required this.voice,
    required this.cacheFile,
    this.headers = const {'Content-Type': 'application/json'},
    dynamic tag,
  }) : super(tag: tag) {
    // 构造函数中打印参数，确保正确接收
    print('PostAudioSource 构造函数: text="$text", voice="$voice"');
  }

  @override
  Future<StreamAudioResponse> request([int? start, int? end]) async {
    try {
      // 检查缓存文件是否存在
      if (await cacheFile.exists()) {
        final fileLength = await cacheFile.length();
        final fileStream = cacheFile.openRead(start, end);
        return StreamAudioResponse(
          sourceLength: fileLength,
          contentLength: end != null ? (end - (start ?? 0)) : (fileLength - (start ?? 0)),
          offset: start ?? 0,
          stream: fileStream,
          contentType: 'audio/mpeg',
        );
      }
      
      // 如果缓存文件不存在，使用POST请求获取音频数据
      print('PostAudioSource 发送请求，text 长度: ${text.length}, text: "$text", voice: "$voice"');
      
      // 确保 text 不为空
      final String textToSend = text.trim().isEmpty ? "测试文本" : text;
      
      // 使用 JSON 格式
      final Map<String, dynamic> jsonRequestMap = {'text': textToSend, 'voice': voice};
      final String jsonRequestBody = jsonEncode(jsonRequestMap);
      print('JSON 请求体: $jsonRequestBody');
      
      // 设置 JSON 请求头
      final Map<String, String> requestHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      // 设置请求 URL
      final Uri requestUri = Uri.parse('http://tts.loghome.ink/generate');
      print('请求 URL: $requestUri');
      
      // 使用 JSON 格式发送请求
      final response = await http.post(
        requestUri,
        headers: requestHeaders,
        body: jsonRequestBody,
      );
      
      print('响应状态码: ${response.statusCode}');
      if (response.statusCode != 200) {
        print('响应内容: ${response.body}');
      }
      
      if (response.statusCode == 200) {
        // 保存到缓存文件
        final bytes = response.bodyBytes;
        await cacheFile.writeAsBytes(bytes);
        print('Audio cached successfully: ${cacheFile.path}');
        
        // 返回音频流
        final fileLength = bytes.length;
        final fileStream = cacheFile.openRead(start, end);
        return StreamAudioResponse(
          sourceLength: fileLength,
          contentLength: end != null ? (end - (start ?? 0)) : (fileLength - (start ?? 0)),
          offset: start ?? 0,
          stream: fileStream,
          contentType: 'audio/mpeg',
        );
      } else {
        throw Exception('Failed to load audio: ${response.statusCode}');
      }
    } catch (e) {
      print('Error in PostAudioSource.request: $e');
      rethrow;
    }
  }
}