(function () {
    if (!window._ttsTasks) {
        window._ttsTasks = {};
    }

    // 全局 text 到 segmentId 的映射，用于复用 segmentId 以利用 native 缓存
    if (!window._ttsTextToSegmentId) {
        window._ttsTextToSegmentId = {};
    }

    function generateSegmentId(text) {
        // 如果提供了 text，尝试复用已有的 segmentId
        if (text && typeof text === 'string') {
            const trimmedText = text.trim();
            const cachedSegmentId = window._ttsTextToSegmentId[trimmedText];
            
            // 如果找到缓存的 segmentId，且该 segmentId 没有正在进行的任务（可安全复用）
            if (cachedSegmentId && !window._ttsTasks[cachedSegmentId]) {
                return cachedSegmentId;
            }
        }
        
        // 生成新的 segmentId
        const newSegmentId = 'tts_' + Math.random().toString(36).substr(2, 4);
        
        // 如果提供了 text，保存映射关系以便后续复用
        if (text && typeof text === 'string') {
            const trimmedText = text.trim();
            window._ttsTextToSegmentId[trimmedText] = newSegmentId;
        }
        
        return newSegmentId;
    }

    function cleanupTask(segmentId) {
        const task = window._ttsTasks[segmentId];
        if (task) {
            if (task.timeoutId) {
                clearTimeout(task.timeoutId);
            }
            delete window._ttsTasks[segmentId];
        }
    }

    function playTTS(text, options = {}) {
        return new Promise((resolve, reject) => {
            if (!text || typeof text !== 'string' || !text.trim()) {
                reject(new Error('播放文本不能为空'));
                return;
            }

            const speakerId = options.speakerId ?? 15014;
            if (!Number.isInteger(speakerId) || speakerId <= 0) {
                reject(new Error('speakerId 必须为正整数'));
                return;
            }

            if (options.voice !== undefined && typeof options.voice !== 'string') {
                reject(new Error('voice 必须为字符串'));
                return;
            }

            const segmentId = generateSegmentId(text);

            window._ttsTasks[segmentId] = {
                resolve: (result) => {
                    cleanupTask(segmentId);
                    resolve(result);
                },
                reject: (error) => {
                    cleanupTask(segmentId);
                    reject(error);
                },
                timeoutId: null,
                onStartReceived: false
            };

            const task = window._ttsTasks[segmentId];

            const timeoutId = setTimeout(() => {
                const currentTask = window._ttsTasks[segmentId];
                if (currentTask && !currentTask.onStartReceived) {
                    currentTask.reject(new Error('TTS播放超时：4秒内未收到播放开始事件'));
                }
            }, 4000);

            task.timeoutId = timeoutId;

            const params = {
                sentences: [
                    { text: text.trim(), id: 'sentence_0' }
                ],
                speakerId: speakerId,
                source: 'mini_app',
                segmentId: segmentId,
                lang: options.lang || 'auto',
                pinyin: options.pinyin || '',
                extensions: {
                    source: 'mini_app',
                }
            };

            if (options.voice !== undefined) {
                params.voice = options.voice;
            }

            // 音色类型映射（voiceType -> extensions）
            const voiceTypeMap = {
                'fairy_tale': { sub_task_id: 'fairy_tale', task_id: 'story_tts' },
                'short_play': { sub_task_id: 'short_play', task_id: 'story_tts' },
                'common': { sub_task_id: '', task_id: 'common_tts' }
            };

            // 如果提供了 voiceType，将映射内容解包到 extensions 中
            if (options.voiceType && voiceTypeMap[options.voiceType]) {
                params.extensions = {
                    ...params.extensions,
                    ...voiceTypeMap[options.voiceType]
                };
            }

            window.CandyJar.call('TTSPlayer', 'play', params,
                function (successResult) {
                },
                function (error) {
                    const currentTask = window._ttsTasks[segmentId];
                    if (currentTask) {
                        const errorMsg = (error && error.message) || 'TTS播放请求失败';
                        currentTask.reject(new Error(errorMsg));
                    }
                }
            );
        });
    }

    function stopAllTTS() {
        if (!Object.keys(window._ttsTasks).length) return;
        
        const segmentIds = Object.keys(window._ttsTasks);
        segmentIds.forEach(segmentId => {
            const task = window._ttsTasks[segmentId];
            if (task) {
                task.reject(new Error('TTS播放被停止'));
            }
        });
        
        window.CandyJar.call('TTSPlayer', 'stop', {},
            function () {
            },
            function (error) {
                console.log('stopAllTTS失败:', error);
            }
        );
    }

    if (!window._ttsEventListenersInitialized) {
        window._ttsEventListenersInitialized = true;

        window.document.addEventListener("CandyJar.TTSPlayer.OnStart", function (event) {
            const segmentId = event.segmentId;
            const task = window._ttsTasks[segmentId];
            if (task) {
                task.onStartReceived = true;
                if (task.timeoutId) {
                    clearTimeout(task.timeoutId);
                    task.timeoutId = null;
                }
            }
        });

        window.document.addEventListener("CandyJar.TTSPlayer.OnComplete", function (event) {
            const segmentId = event.segmentId;
            const task = window._ttsTasks[segmentId];
            if (task) {
                task.resolve();
            }
        });

        window.document.addEventListener("CandyJar.TTSPlayer.OnStop", function (event) {
            const segmentId = event.segmentId;
            const task = window._ttsTasks[segmentId];
            if (task) {
                task.reject(new Error('TTS播放被停止'));
            }
        });

        window.document.addEventListener("CandyJar.TTSPlayer.OnError", function (event) {
            const segmentId = event.segmentId;
            const task = window._ttsTasks[segmentId];
            if (task) {
                const errorMsg = (event.error && event.error.message) || 'TTS播放失败';
                task.reject(new Error(errorMsg));
            }
        });
    }

    window.playTTS = playTTS;
    window.stopAllTTS = stopAllTTS;
})();
