import 'dart:async';
import 'dart:convert';
import 'package:audio_service/audio_service.dart';
import 'package:just_audio/just_audio.dart';
import 'package:http/http.dart' as http;
import '../utils/audio_utils.dart';
import 'post_audio_source.dart';

// Data models
class Article {
  final String id;
  final String title;
  final List<String> paragraphs;
  final List<String> paragraphIds; // 添加段落ID列表

  Article({required this.id, required this.title, required this.paragraphs, required this.paragraphIds});

  factory Article.fromJson(Map<String, dynamic> json) {
    List<String> paragraphs = [];
    List<String> paragraphIds = []; // 添加段落ID列表

    if (json['article_type'] == "richtext" && json['content'] != null) {
      print('原始 content: ${json['content']}');
      var content;
      try {
        content = jsonDecode(json['content']);
        print('解析后 content 类型: ${content.runtimeType}');
      } catch (e) {
        print('解析 content JSON 失败: $e');
        return Article(
          id: json['article_id'].toString(),
          title: json['title'] ?? 'Untitled',
          paragraphs: paragraphs,
          paragraphIds: paragraphIds,
        );
      }

      paragraphs.add('章节 ${json["title"]}');
      paragraphIds.add('-1');
      
      if (content is List) {
        for (var i = 0; i < content.length; i++) {
          var item = content[i];
          if (item is Map && item['type'] == 'text' && item['value'] != null) {
            String value = item['value'].toString();
            if (value.trim().isNotEmpty) {
              paragraphs.add(value);
              // 获取段落ID，如果没有则使用索引作为ID
              String paragraphId = item['id']?.toString() ?? i.toString();
              paragraphIds.add(paragraphId);
            } else {
              print('跳过空段落');
            }
          }
        }
      } else if (content is String && content.trim().isNotEmpty) {
        print('content 是字符串，添加为段落');
        paragraphs.add(content);
        paragraphIds.add('0'); // 默认ID为0
      }
    } else if(json['article_type'] == "spliter" ) {
      paragraphs.add('分卷 ${json["title"]}');
      paragraphIds.add('-1');
    }
    
    print('解析完成，段落数量: ${paragraphs.length}，段落ID数量: ${paragraphIds.length}');
    return Article(
      id: json['article_id'].toString(),
      title: json['title'] ?? 'Untitled',
      paragraphs: paragraphs,
      paragraphIds: paragraphIds,
    );
  }
}

// Audio Handler
class AudioPlayerHandler extends BaseAudioHandler with SeekHandler {
  final _player = AudioPlayer();
  final _playlist = ConcatenatingAudioSource(children: []);
  String _voice = 'zh-CN-XiaoxiaoNeural'; // Default voice
  Timer? _notificationDismissTimer;

  AudioPlayerHandler() {
    _player.playbackEventStream.map(_transformEvent).pipe(playbackState);
    _listenForDurationChanges();
    _listenForPlayerStateChanges();
    _setupAutoLoadNextArticle();
  }

  // 存储待加载的文章ID列表
  List<String> _pendingArticleIds = [];
  bool _isLoadingArticle = false;
  int _currentArticleIndex = 0;

  Future<void> loadPlaylist(List<String> articleIds, {String? startArticleId}) async {
    print('开始加载播放列表，文章ID: $articleIds');
    if (articleIds.isEmpty) {
      print('文章ID列表为空，退出加载');
      return;
    }

    // 清除现有播放列表和待加载文章列表
    _playlist.clear();
    mediaItem.add(null); // Clear current item display
    queue.add([]); // 确保队列也被清空
    _pendingArticleIds = List.from(articleIds);
    _currentArticleIndex = 0;
    
    // 如果指定了起始文章ID，调整加载顺序
    if (startArticleId != null && startArticleId.isNotEmpty) {
      int startIndex = _pendingArticleIds.indexOf(startArticleId);
      if (startIndex != -1) {
        print('找到指定的起始文章，索引: $startIndex');
        // 将起始文章移到列表开头
        if (startIndex > 0) {
          String startArticle = _pendingArticleIds.removeAt(startIndex);
          _pendingArticleIds.insert(0, startArticle);
          print('已将起始文章 $startArticleId 移到列表开头');
        }
      } else {
        print('未找到指定的起始文章 $startArticleId，将从第一篇文章开始播放');
      }
    }
    
    // 加载第一篇文章
    await _loadNextArticle();
  }

  // 加载下一篇文章
  Future<void> _loadNextArticle() async {
    if (_isLoadingArticle || _currentArticleIndex >= _pendingArticleIds.length) {
      return;
    }

    _isLoadingArticle = true;
    try {
      String articleId = _pendingArticleIds[_currentArticleIndex];
      print('正在加载第 ${_currentArticleIndex + 1}/${_pendingArticleIds.length} 篇文章，ID: $articleId');
      
      final article = await _fetchArticle(articleId);
      if (article != null) {
        print('成功获取文章: ${article.title}，段落数: ${article.paragraphs.length}');
        await _addArticleToPlaylist(article);
      } else {
        print('获取文章失败，ID: $articleId');
      }
      
      _currentArticleIndex++;
      
      // 如果播放列表为空（即当前文章没有有效段落），则尝试加载下一篇
      if (_playlist.length == 0 && _currentArticleIndex < _pendingArticleIds.length) {
        await _loadNextArticle();
      }
    } finally {
      _isLoadingArticle = false;
    }
  }

  // 将文章添加到播放列表
  Future<void> _addArticleToPlaylist(Article article) async {
    print('开始创建音频源列表');
    List<AudioSource> audioSources = [];
    bool isFirstArticle = _playlist.length == 0;
    
    for (int i = 0; i < article.paragraphs.length; i++) {
      final paragraph = article.paragraphs[i];
      
      // 确保段落不为空
      if (paragraph.trim().isEmpty) {
        print('警告: 段落内容为空，跳过此段落');
        continue;
      }
      
      final mediaItem = MediaItem(
        id: '${paragraph}_$_voice', // Placeholder URL，仅用于标识，没有实际意义。
        album: "原木社区",
        title: article.title,
        artist: paragraph,
        extras: {
          'articleId': article.id, 
          'paragraphIndex': i,
          'paragraphId': article.paragraphIds[i], // 添加段落ID
        },
      );

      // 使用自定义的PostAudioSource，通过POST请求获取音频
      print('为段落 ${i+1}/${article.paragraphs.length} 创建音频源，文章: ${article.title}');
      print('段落内容: "$paragraph", 长度: ${paragraph.length}');
      
      final cacheFile = await AudioUtils.getCachedFile(article.id, paragraph, _voice);
      print('缓存文件路径: ${cacheFile.path}');
      
      // 创建 PostAudioSource 实例
      final audioSource = PostAudioSource(
        text: paragraph,
        voice: _voice,
        cacheFile: cacheFile,
        tag: mediaItem,
      );
      
      print('添加音频源: text="${paragraph}", voice="${_voice}"');
      audioSources.add(audioSource);
    }

    if (audioSources.isEmpty) {
      print('文章没有有效段落，跳过添加');
      return;
    }

    print('添加 ${audioSources.length} 个音频源到播放列表');
    await _playlist.addAll(audioSources);
    
    // 如果是第一篇文章，需要设置音频源到播放器
    if (isFirstArticle) {
      print('设置音频源到播放器，初始索引: 0，预加载: false');
      await _player.setAudioSource(_playlist, initialIndex: 0, preload:false);
    }
    
    // 更新队列
    List<MediaItem> newItems = audioSources.map((source) => (source as PostAudioSource).tag as MediaItem).toList();
    
    // 如果是第一篇文章，则完全替换队列，否则追加到现有队列
    if (isFirstArticle) {
      // 完全替换队列，确保旧的媒体项被清除
      queue.add(newItems);
      print('完全替换队列，新队列长度: ${newItems.length}');
    } else {
      // 追加到现有队列
      List<MediaItem> currentQueue = queue.value.toList();
      currentQueue.addAll(newItems);
      queue.add(currentQueue);
      print('追加到现有队列，更新后队列长度: ${currentQueue.length}');
    }
    
    // 如果是第一篇文章的第一个媒体项，设置为当前媒体项
    if (isFirstArticle && newItems.isNotEmpty) {
      print('初始化当前媒体项: ${newItems[0].title}');
      mediaItem.add(newItems[0]);
    }
    
    print('文章添加到播放列表完成');
  }

  // 监听播放完成事件，自动加载下一篇文章
  void _setupAutoLoadNextArticle() {
    _player.processingStateStream.listen((state) {
      if (state == ProcessingState.completed) {
        print('当前播放列表播放完成，检查是否需要加载下一篇');
        if (_currentArticleIndex < _pendingArticleIds.length) {
          _loadNextArticle();
        }
      }
    });
    
    // 监听当前索引变化，预加载下一篇文章
    _player.currentIndexStream.listen((index) {
      if (index != null) {
        _checkAndLoadMoreArticles();
      }
    });
  }
  
  // 检查是否需要加载更多文章
  void _checkAndLoadMoreArticles() {
    // 如果当前没有在加载文章，并且还有待加载的文章
    if (!_isLoadingArticle && _currentArticleIndex < _pendingArticleIds.length) {
      // 如果当前播放的是最后几个段落，则预加载下一篇文章
      final currentIndex = _player.currentIndex;
      if (currentIndex != null && _playlist.length > 0) {
        // 如果当前播放的是播放列表中最后 3 个段落之一，则加载下一篇文章
        if (currentIndex >= _playlist.length - 3) {
          print('即将播放到播放列表末尾，预加载下一篇文章');
          _loadNextArticle();
        }
      }
    }
  }

  Future<Article?> _fetchArticle(String id) async {
    try {
      print('获取文章，ID: $id');
      final response = await http.get(Uri.parse('https://loghomeservice.codesocean.top/articles/get_article?id=$id'));
      print('API 响应状态码: ${response.statusCode}');
      
      if (response.statusCode == 200) {
        print('API 响应内容: ${response.body}');
        try {
          final data = jsonDecode(response.body);
          print('解析后的数据类型: ${data.runtimeType}, 长度: ${data.length}');
          
          if (data != null && data.isNotEmpty) {
            print('使用第一项数据创建文章对象');
            return Article.fromJson(data[0]);
          } else {
            print('API 返回的数据为空');
          }
        } catch (parseError) {
          print('解析 API 响应 JSON 失败: $parseError');
        }
      } else {
        print('API 请求失败，状态码: ${response.statusCode}');
      }
    } catch (e) {
      print('获取文章时发生错误，ID: $id, 错误: $e');
    }
    return null;
  }

  Future<void> setVoice(String voice) async {
    if (_voice != voice) {
      print('语音发生变化: $_voice -> $voice');
      String oldVoice = _voice;
      _voice = voice;
      
      // 清除旧语音的缓存文件
      await AudioUtils.clearVoiceCache(oldVoice);
      
      // 如果当前有正在播放的媒体项，需要重新加载当前播放的内容
      if (mediaItem.value != null && _player.currentIndex != null) {
        final currentItem = mediaItem.value!;
        final extras = currentItem.extras;
        final isPlaying = _player.playing;
        final position = _player.position;
        
        if (extras != null && extras['articleId'] != null && extras['paragraphId'] != null) {
          print('重新加载当前媒体项，使用新的语音: $voice');
          final articleId = extras['articleId'] as String;
          final paragraphId = extras['paragraphId'] as String;
          
          // 暂停当前播放
          if (isPlaying) {
            await pause();
          }
          
          // 记录当前播放位置和状态
          final currentPosition = position;
          
          // 清空当前播放列表
          _playlist.clear();
          queue.add([]);
          
          // 重新加载当前文章
          _pendingArticleIds = [articleId];
          _currentArticleIndex = 0;
          _isLoadingArticle = false; // 重置加载状态
          await _loadNextArticle();
          
          // 等待队列更新
          await Future.delayed(Duration(milliseconds: 300));
          
          // 跳转到之前播放的段落
          bool jumpResult = await jumpToArticleParagraph(articleId, paragraphId);
          print('跳转结果: $jumpResult');
          
          // 恢复播放位置
          if (jumpResult && currentPosition.inMilliseconds > 0) {
            await seek(currentPosition);
          }
          
          // 如果之前是播放状态，则恢复播放
          if (isPlaying) {
            await play();
          }
        }
      }
    }
  }

  @override
  Future<void> play() async {
    _cancelNotificationDismissTimer();
    await _player.play();
  }

  @override
  Future<void> pause() async {
    await _player.pause();
    _scheduleNotificationDismiss();
  }

  @override
  Future<void> seek(Duration position) => _player.seek(position);

  @override
  Future<void> skipToNext() => _player.seekToNext();

  @override
  Future<void> skipToPrevious() => _player.seekToPrevious();

  @override
  Future<void> stop() async {
    await _player.stop();
    _cancelNotificationDismissTimer();
    await super.stop();
  }

  Map<String, dynamic>? getProgress() {
    // 无论是否播放，只要有当前索引和媒体项就返回进度信息
    if (_player.currentIndex != null && mediaItem.value != null) {
      return {
        'articleId': mediaItem.value!.extras!['articleId'],
        'paragraphId': mediaItem.value!.extras!['paragraphId'],
        'position': _player.position.inMilliseconds,
        'duration': mediaItem.value!.duration?.inMilliseconds,
        'isPlaying': _player.playing
      };
    }
    return null;
  }

  // 跳转到指定的文章和段落
  Future<bool> jumpToArticleParagraph(String articleId, String paragraphId) async {
    print('尝试跳转到文章 $articleId 的段落 $paragraphId');
    
    // 检查当前队列
    final currentQueue = queue.value;
    
    // 如果队列不为空，尝试在当前队列中查找匹配的媒体项
    if (currentQueue.isNotEmpty) {
      // 查找匹配的媒体项索引
      int? targetIndex;
      for (int i = 0; i < currentQueue.length; i++) {
        final item = currentQueue[i];
        final extras = item.extras;
        
        if (extras != null && 
            extras['articleId'] == articleId && 
            extras['paragraphId'] == paragraphId) {
          targetIndex = i;
          print('找到匹配的媒体项，索引: $i');
          break;
        }
      }
      
      // 如果找到匹配的媒体项，则跳转到该项
      if (targetIndex != null) {
        print('跳转到索引: $targetIndex');
        await _player.seek(Duration.zero, index: targetIndex);
        if (!_player.playing) {
          await play();
        }
        return true;
      }
      
      print('当前队列中未找到匹配的媒体项');
    } else {
      print('队列为空，需要先加载文章');
    }
    
    // 如果队列为空或未找到匹配项，检查是否需要加载文章
    
    // 检查文章是否已在待加载列表中
    bool isArticleInPendingList = _pendingArticleIds.contains(articleId);
    
    // 如果文章不在待加载列表中，添加到列表
    if (!isArticleInPendingList) {
      print('文章不在待加载列表中，添加到列表: $articleId');
      
      // 如果待加载列表为空，直接添加
      if (_pendingArticleIds.isEmpty) {
        _pendingArticleIds.add(articleId);
      } else {
        // 将该文章添加到待加载列表的当前位置
        _pendingArticleIds.insert(_currentArticleIndex, articleId);
      }
    } else {
      print('文章已在待加载列表中: $articleId');
    }
    
    // 如果当前没有在加载文章，则开始加载
    if (!_isLoadingArticle) {
      print('开始加载文章: $articleId');
      
      // 如果队列为空且待加载列表只有这一篇文章，重置加载索引
      if (currentQueue.isEmpty && _pendingArticleIds.length == 1) {
        _currentArticleIndex = 0;
      }
      
      // 加载文章
      await _loadNextArticle();
      
      // 递归调用以尝试再次跳转
      return jumpToArticleParagraph(articleId, paragraphId);
    } else {
      print('文章正在加载中，等待加载完成后再尝试跳转');
      
      // 等待一段时间后再次尝试跳转
      await Future.delayed(Duration(milliseconds: 500));
      return jumpToArticleParagraph(articleId, paragraphId);
    }
  }

  void _listenForDurationChanges() {
    _player.durationStream.listen((duration) {
      print("音频时长变化: $duration");
      final index = _player.currentIndex;
      print("当前索引: $index");
      
      if (index != null && duration != null) {
        final newQueue = queue.value.toList(); // 创建队列的副本以避免直接修改原队列
        print("队列长度: ${newQueue.length}");
        
        if (index < newQueue.length) {
          final oldMediaItem = newQueue[index];
          print("更新媒体项: ${oldMediaItem.title}, 旧时长: ${oldMediaItem.duration}, 新时长: $duration");
          
          final newMediaItem = oldMediaItem.copyWith(duration: duration);
          newQueue[index] = newMediaItem;
          queue.add(newQueue);
          mediaItem.add(newMediaItem);
          print("媒体项已更新，新时长: ${newMediaItem.duration}");
        } else {
          print("警告: 当前索引 $index 超出队列范围 ${newQueue.length}");
        }
      }
    });
    
    // 添加播放位置监听，确保即使没有时长变化也能更新当前媒体项
    _player.currentIndexStream.listen((index) {
      print("当前索引变化: $index");
      if (index != null) {
        final currentQueue = queue.value;
        if (currentQueue.isNotEmpty && index < currentQueue.length) {
          final currentItem = currentQueue[index];
          print("当前媒体项变化: ${currentItem.title}");
          mediaItem.add(currentItem);
        } else if (currentQueue.isEmpty) {
          print("警告: 队列为空，无法更新当前媒体项");
        } else {
          print("警告: 当前索引 $index 超出队列范围 ${currentQueue.length}");
        }
      }
    });
  }

  void _listenForPlayerStateChanges() {
    _player.playerStateStream.listen((state) {
      if (state.playing) {
        _cancelNotificationDismissTimer();
      } else if (state.processingState == ProcessingState.completed || !state.playing) {
        _scheduleNotificationDismiss();
      }
      
      // 检查是否需要加载更多文章
      if (state.processingState == ProcessingState.ready) {
        _checkAndLoadMoreArticles();
      }
    });
  }

  void _scheduleNotificationDismiss() {
    _notificationDismissTimer?.cancel();
    _notificationDismissTimer = Timer(const Duration(seconds: 30), () {
      if (!_player.playing) {
        stop();
      }
    });
  }

  void _cancelNotificationDismissTimer() {
    _notificationDismissTimer?.cancel();
  }

  PlaybackState _transformEvent(PlaybackEvent event) {
    return PlaybackState(
      controls: [
        MediaControl.rewind,
        if (_player.playing) MediaControl.pause else MediaControl.play,
        MediaControl.stop,
        MediaControl.fastForward,
      ],
      systemActions: const {
        MediaAction.seek,
        MediaAction.seekForward,
        MediaAction.seekBackward,
      },
      androidCompactActionIndices: const [0, 1, 3],
      processingState: const {
        ProcessingState.idle: AudioProcessingState.idle,
        ProcessingState.loading: AudioProcessingState.loading,
        ProcessingState.buffering: AudioProcessingState.buffering,
        ProcessingState.ready: AudioProcessingState.ready,
        ProcessingState.completed: AudioProcessingState.completed,
      }[_player.processingState]!,
      playing: _player.playing,
      updatePosition: _player.position,
      bufferedPosition: _player.bufferedPosition,
      speed: _player.speed,
      queueIndex: event.currentIndex,
    );
  }
}