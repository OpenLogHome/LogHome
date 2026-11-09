import 'dart:io';
import 'package:just_audio/just_audio.dart';
import 'tts_session.dart';

class PostAudioSource extends StreamAudioSource {
  final String text;
  final String voice;
  final File cacheFile;
  final TtsSession session;
  Future<void>? _pending;

  PostAudioSource({required this.text, required this.voice, required this.cacheFile,
    required this.session, dynamic tag}) : super(tag: tag);

  Future<void> _ensureCached() async {
    if (await cacheFile.exists() && await cacheFile.length() > 0) return;
    final temporary = File('${cacheFile.path}.part');
    try {
      final bytes = await session.synthesize(text, voice);
      await temporary.writeAsBytes(bytes, flush: true);
      await temporary.rename(cacheFile.path);
    } finally {
      if (await temporary.exists()) await temporary.delete();
    }
  }

  @override
  Future<StreamAudioResponse> request([int? start, int? end]) async {
    try {
      await (_pending ??= _ensureCached());
    } catch (_) {
      _pending = null;
      rethrow;
    }
    final length = await cacheFile.length();
    final offset = start ?? 0;
    final limit = end ?? length;
    return StreamAudioResponse(sourceLength: length, contentLength: limit - offset,
      offset: offset, stream: cacheFile.openRead(offset, limit), contentType: 'audio/wav');
  }
}
