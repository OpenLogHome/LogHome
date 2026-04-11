'use strict';
/**
 * Copyright (c) 2017 Baidu.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * @file AipImageCensor
 * @author baiduAip
 */
const BaseClient = require('./client/baseClient');

const RequestInfo = require('./client/requestInfo');

const objectTools = require('./util/objectTools');

const HttpClient = require('./http/httpClient');

const HttpClientJson = require('./http/httpClientExt');

const httpHeader = require('./const/httpHeader');

const CONTENT_TYPE_JSON = 'application/json';

const METHOD_POST = 'POST';

const PATH_USER_DEFINED = '/rest/2.0/solution/v1/img_censor/v2/user_defined';
const PATH_VOICE_USER_DEFINED = '/rest/2.0/solution/v1/voice_censor/v3/user_defined';
const PATH_VIDEO_USER_DEFINED = '/rest/2.0/solution/v1/video_censor/v2/user_defined';
const PATH_ANTIPORN_GIF = '/rest/2.0/antiporn/v1/detect_gif';
const PATH_FACEAUDIT = '/rest/2.0/solution/v1/face_audit';
const PATH_COMBOCENSOR = '/api/v1/solution/direct/img_censor';
const PATH_REPORT = '/rpc/2.0/feedback/v1/report';
const PATH_TEXT_CENSOR = '/rest/2.0/solution/v1/text_censor/v2/user_defined';

const PATH_ANTIPORN = '/rest/2.0/antiporn/v1/detect';
const PATH_ANTITERROR = '/rest/2.0/antiterror/v1/detect';
const PATH_ANTISPAM = '/rest/2.0/antispam/v2/spam';

const LIVE_SAVE_V1_PATH = '/rest/2.0/solution/v1/live/v1/config/save';
const LIVE_STOP_V1_PATH = '/rest/2.0/solution/v1/live/v1/config/stop';
const LIVE_VIEW_V1_PATH = '/rest/2.0/solution/v1/live/v1/config/view';
const LIVE_PULL_V1_PATH = '/rest/2.0/solution/v1/live/v1/audit/pull';
const VIDEO_CENSOR_SUBMIT_V1_PATH = '/rest/2.0/solution/v1/video_censor/v1/video/submit';
const VIDEO_CENSOR_PULL_V1_PATH = '/rest/2.0/solution/v1/video_censor/v1/video/pull';
const ASYNC_VOICE_SUBMIT_V1_PATH = '/rest/2.0/solution/v1/async_voice/submit';
const ASYNC_VOICE_PULL_V1_PATH = '/rest/2.0/solution/v1/async_voice/pull';

const DOCUMENT_CENSOR_SUBMIT_PATH = '/rest/2.0/solution/v1/solution/document/v1/submit';
const DOCUMENT_CENSOR_PULL_PATH = '/rest/2.0/solution/v1/solution/document/v1/pull';


const scope = require('./const/devScope').DEFAULT;


/**
 * AipContentCensor类，构造调用图像审核对象
 *
 * @class
 * @extends BaseClient
 * @constructor
 * @param {string} appid appid.
 * @param {string} ak  access key.
 * @param {string} sk  security key.
 */
class AipImageCensor extends BaseClient {
    constructor(appId, ak, sk) {
        super(appId, ak, sk);
    }

    commonImpl(param) {
        let httpClient = new HttpClient();
        let apiUrl = param.targetPath;
        delete param.targetPath;
        let requestInfo = new RequestInfo(apiUrl,
            param, METHOD_POST);
        return this.doRequest(requestInfo, httpClient);
    }

    jsonRequestImpl(param) {
        let httpClient = new HttpClientJson();
        let apiUrl = param.targetPath;
        delete param.targetPath;
        let requestInfo = new RequestInfo(apiUrl,
            param, METHOD_POST, false, {
                [httpHeader.CONTENT_TYPE]: CONTENT_TYPE_JSON
            });
        return this.doRequest(requestInfo, httpClient);
    }

    antiPornGif(image, options) {
        let param = {
            image: image,
            targetPath: PATH_ANTIPORN_GIF
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    antiPorn(image, options) {
        let param = {
            image: image,
            targetPath: PATH_ANTIPORN
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    antiTerror(image, options) {
        let param = {
            image: image,
            targetPath: PATH_ANTITERROR
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    antiSpam(content, options) {
        let param = {
            content: content,
            targetPath: PATH_ANTISPAM
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    faceAudit(images, type, configId) {
        let param = {configId: configId};
        if (type === 'url') {
            images = images.map(function (elm) {
                return encodeURIComponent(elm);
            });
            param.imgUrls = images.join(',');
        }
        if (type === 'base64') {
            param.images = images.join(',');
        }
        param.targetPath = PATH_FACEAUDIT;
        return this.commonImpl(param);
    }

    imageCensorUserDefined(image, type) {
        let param = {};
        if (type === 'url') {
            param.imgUrl = image;
        }
        if (type === 'base64') {
            param.image = image;
        }
        param.targetPath = PATH_USER_DEFINED;
        return this.commonImpl(param);
    }

    imageCensorComb(image, type, scenes, scenesConf) {
        let param = {};
        if (type === 'url') {
            param.imgUrl = image;
        }
        if (type === 'base64') {
            param.image = image;
        }
        param.scenes = scenes;
        param.sceneConf = scenesConf;
        param.targetPath = PATH_COMBOCENSOR;
        return this.jsonRequestImpl(param);
    }

    report(feedback) {
        let param = {};
        param.feedback = feedback;
        param.targetPath = PATH_REPORT;
        return this.jsonRequestImpl(param);
    }

    voiceCensorUserDefined(voice, rate, fmt, options) {
        let param = {};
        param.base64 = voice;
        param.rate = rate;
        param.fmt = fmt;
        param.targetPath = PATH_VOICE_USER_DEFINED;
        return this.commonImpl(objectTools.merge(param, options));
    }

    voiceUrlCensorUserDefined(url, rate, fmt, options) {
        let param = {};
        param.url = url;
        param.rate = rate;
        param.fmt = fmt;
        param.targetPath = PATH_VOICE_USER_DEFINED;
        return this.commonImpl(objectTools.merge(param, options));
    }

    videoCensorUserDefined(name, videoUrl, extId, options) {
        let param = {};
        param.name = name;
        param.videoUrl = videoUrl;
        param.extId = extId;
        param.targetPath = PATH_VIDEO_USER_DEFINED;
        return this.commonImpl(objectTools.merge(param, options));
    }

    textCensorUserDefined(text, options) {
        let param = {};
        param.text = text;
        param.targetPath = PATH_TEXT_CENSOR;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 内容审核平台-直播流（新增任务）
     * 接口使用说明: https://ai.baidu.com/ai-doc/ANTIPORN/mkxlraoz5
     */
    liveSaveV1(streamUrl, streamType, extId, startTime, endTime, streamName, options) {
        let param = {
            streamUrl: streamUrl,
            streamType: streamType,
            extId: extId,
            startTime: startTime,
            endTime: endTime,
            streamName: streamName,
            targetPath: LIVE_SAVE_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }


    /**
     * 内容审核平台-直播流（删除任务）
     * 接口使用说明: https://ai.baidu.com/ai-doc/ANTIPORN/Ckxls2owb
     */
    liveStopV1(taskId, options) {
        let param = {
            taskId: taskId,
            targetPath: LIVE_STOP_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }


    /**
     * 内容审核平台-直播流（查看配置）
     * 接口使用说明: https://ai.baidu.com/ai-doc/ANTIPORN/ckxls6tl1
     */
    liveViewV1(taskId, options) {
        let param = {
            taskId: taskId,
            targetPath: LIVE_VIEW_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }


    /**
     * 内容审核平台-直播流（获取结果）
     * 接口使用说明: https://ai.baidu.com/ai-doc/ANTIPORN/Pkxlshd1s
     */
    livePullV1(taskId, options) {
        let param = {
            taskId: taskId,
            targetPath: LIVE_PULL_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }


    /**
     * 内容审核平台-长视频（提交任务）
     * 接口使用说明: https://ai.baidu.com/ai-doc/ANTIPORN/bksy7ak30
     */
    videoCensorSubmitV1(url, extId, options) {
        let param = {
            url: url,
            extId: extId,
            targetPath: VIDEO_CENSOR_SUBMIT_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }


    /**
     * 内容审核平台-长视频（获取结果）
     * 接口使用说明: https://ai.baidu.com/ai-doc/ANTIPORN/jksy7j3jv
     */
    videoCensorPullV1(taskId, options) {
        let param = {
            taskId: taskId,
            targetPath: VIDEO_CENSOR_PULL_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }


    /**
     * 音频文件异步审核
     * 接口使用说明: https://ai.baidu.com/ai-doc/ANTIPORN/akxlple3t
     */
    asyncVoiceSubmitV1(url, fmt, rate, options) {
        let param = {
            url: url,
            fmt: fmt,
            rate: rate,
            targetPath: ASYNC_VOICE_SUBMIT_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }


    /**
     * 音频文件异步审核-查询
     * 接口使用说明: https://ai.baidu.com/ai-doc/ANTIPORN/jkxlpxllo
     */
    asyncVoicePullV1TaskId(taskId, options) {
        let param = {
            taskId: taskId,
            targetPath: ASYNC_VOICE_PULL_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }


    /**
     * 音频文件异步审核-查询
     * 接口使用说明: https://ai.baidu.com/ai-doc/ANTIPORN/jkxlpxllo
     */
    asyncVoicePullV1AudioId(audioId, options) {
        let param = {
            audioId: audioId,
            targetPath: ASYNC_VOICE_PULL_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 文档审核-提交任务
     * https://ai.baidu.com/ai-doc/ANTIPORN/2l8484xvl
     */
    documentCensorFileSubmit(fileName, document, options) {
        let param = {};
        param.fileBase64 = document;
        param.fileName = fileName;
        param.targetPath = DOCUMENT_CENSOR_SUBMIT_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 文档审核-提交任务
     * https://ai.baidu.com/ai-doc/ANTIPORN/2l8484xvl
     */
    documentCensorUrlSubmit(fileName, url, options) {
        let param = {};
        param.url = url;
        param.fileName = fileName;
        param.targetPath = DOCUMENT_CENSOR_SUBMIT_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 文档审核-拉取结果
     * https://ai.baidu.com/ai-doc/ANTIPORN/4l848df5n
     */
    documentCensorPull(taskId, options) {
        let param = {};
        param.taskId = taskId;
        param.targetPath = DOCUMENT_CENSOR_PULL_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }
}

module.exports = AipImageCensor;
