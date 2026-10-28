import 'dart:convert';
import 'dart:typed_data';
import 'package:http/http.dart' as http;

class TtsSession {
  static const baseUrl = 'https://tts.codesocean.top';
  static const voices = {
    'warm-gentleman': '温润君子',
    'sunny-boy': '阳光少年',
    'youthful-goddess': '青春女神',
    'soft-girl': '软糯萝莉',
  };
  final String loginToken;
  final String userId;
  String _token;
  Map<String, String> _voiceIds;

  TtsSession._(this.loginToken, this.userId, this._token, this._voiceIds);

  static Future<TtsSession> create(String loginToken) async {
    if (loginToken.isEmpty) throw Exception('请先登录后使用听书');
    final response = await http.post(
      Uri.parse('https://loghomeservice.codesocean.top/tts/session'),
      headers: {'Authorization': 'Bearer $loginToken', 'Content-Type': 'application/json'},
      body: '{}',
    ).timeout(const Duration(seconds: 60));
    if (response.statusCode != 200) throw Exception('无法获取听书凭证，请重新登录或稍后重试');
    final data = jsonDecode(response.body)['data'];
    final resolved = <String, String>{};
    for (final voice in data['voices']) {
      if (voices.containsKey(voice['id'])) resolved[voice['id']] = voice['voice_id'];
    }
    if (resolved.length != voices.length) throw Exception('听书音色暂时不可用');
    return TtsSession._(loginToken, data['user_id'].toString(), data['token'], resolved);
  }

  String cacheIdentity(String voice) => 'gpt-sovits-v1|$userId|${_voiceIds[voice]}';

  Future<Uint8List> synthesize(String text, String voice) async {
    if (!voices.containsKey(voice)) throw ArgumentError('不支持的听书音色');
    final result = <Uint8List>[];
    final characters = text.trim().runes.toList();
    if (characters.isEmpty) throw ArgumentError('听书文本不能为空');
    for (var offset = 0; offset < characters.length; offset += 900) {
      final end = offset + 900 < characters.length ? offset + 900 : characters.length;
      final chunk = String.fromCharCodes(characters.sublist(offset, end));
      for (var attempt = 0; attempt < 3; attempt++) {
        final response = await http.post(Uri.parse('$baseUrl/v1/audio/speech'),
          headers: {'Authorization': 'Bearer $_token', 'Content-Type': 'application/json'},
          // Omitting model follows the deployed service default.
          body: jsonEncode({'input': chunk, 'voice': _voiceIds[voice], 'language': 'zh', 'response_format': 'wav'}),
        ).timeout(const Duration(seconds: 240));
        if (response.statusCode == 401 && attempt == 0) {
          final refreshed = await create(loginToken);
          if (refreshed.userId != userId) throw Exception('听书账号已变更');
          _token = refreshed._token;
          _voiceIds = refreshed._voiceIds;
          continue;
        }
        if (response.statusCode == 429 && attempt < 2) {
          await Future<void>.delayed(Duration(milliseconds: 1500 * (attempt + 1)));
          continue;
        }
        if (response.statusCode != 200 || response.bodyBytes.isEmpty) {
          throw Exception('听书合成失败（${response.statusCode}），请稍后重试');
        }
        result.add(response.bodyBytes);
        break;
      }
    }
    return mergeTtsWaves(result);
  }
}

// Rebuild WAV headers so long paragraphs retain correct duration and seeking.
Uint8List mergeTtsWaves(List<Uint8List> chunks) {
  Uint8List? format;
  final audio = BytesBuilder(copy: false);
  for (final wave in chunks) {
    String name(int offset) => ascii.decode(wave.sublist(offset, offset + 4));
    if (wave.length < 12 || name(0) != 'RIFF' || name(8) != 'WAVE') {
      throw FormatException('听书服务返回无效 WAV');
    }
    final header = ByteData.sublistView(wave);
    Uint8List? chunkFormat;
    Uint8List? samples;
    var offset = 12;
    while (offset + 8 <= wave.length) {
      final kind = name(offset);
      final declared = header.getUint32(offset + 4, Endian.little);
      final start = offset + 8;
      final length = kind == 'data' && declared == 0xffffffff ? wave.length - start : declared;
      if (length > wave.length - start) throw FormatException('听书音频不完整');
      if (kind == 'fmt ') chunkFormat = Uint8List.sublistView(wave, start, start + length);
      if (kind == 'data') samples = Uint8List.sublistView(wave, start, start + length);
      offset = start + length + length % 2;
    }
    if (chunkFormat == null || chunkFormat.length < 16 || samples == null || samples.isEmpty) {
      throw FormatException('听书音频无效');
    }
    if (format == null) {
      format = chunkFormat;
    } else if (base64Encode(format) != base64Encode(chunkFormat)) {
      throw FormatException('听书音频格式发生变化，请重试');
    }
    audio.add(samples);
  }
  if (format == null) throw FormatException('听书服务返回空音频');
  final samples = audio.takeBytes();
  final dataOffset = 20 + format.length + format.length % 2;
  final result = Uint8List(dataOffset + 8 + samples.length + samples.length % 2);
  final header = ByteData.sublistView(result);
  result.setRange(0, 4, ascii.encode('RIFF'));
  header.setUint32(4, result.length - 8, Endian.little);
  result.setRange(8, 16, ascii.encode('WAVEfmt '));
  header.setUint32(16, format.length, Endian.little);
  result.setRange(20, 20 + format.length, format);
  result.setRange(dataOffset, dataOffset + 4, ascii.encode('data'));
  header.setUint32(dataOffset + 4, samples.length, Endian.little);
  result.setRange(dataOffset + 8, dataOffset + 8 + samples.length, samples);
  return result;
}
