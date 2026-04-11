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
 * @file AipBodyAnalysis.js
 * @author baidu aip
 */



const BaseClient = require('./client/baseClient');

const RequestInfo = require('./client/requestInfo');

const HttpClient = require('./http/httpClient');

const objectTools = require('./util/objectTools');

const METHOD_POST = 'POST';

const BODY_ANALYSIS_V1_PATH = '/rest/2.0/image-classify/v1/body_analysis';
const BODY_ATTR_V1_PATH = '/rest/2.0/image-classify/v1/body_attr';
const BODY_NUM_V1_PATH = '/rest/2.0/image-classify/v1/body_num';
const DRIVER_BEHAVIOR_V1_PATH = '/rest/2.0/image-classify/v1/driver_behavior';
const BODY_SEG_V1_PATH = '/rest/2.0/image-classify/v1/body_seg';
const GESTURE_V1_PATH = '/rest/2.0/image-classify/v1/gesture';
const BODY_TRACKING_V1_PATH = '/rest/2.0/image-classify/v1/body_tracking';
const HAND_ANALYSIS_V1_PATH = '/rest/2.0/image-classify/v1/hand_analysis';
const BODY_DANGER_V1_PATH = '/rest/2.0/video-classify/v1/body_danger';
const FINGERTIP_V1_PATH = '/rest/2.0/image-classify/v1/fingertip';


/**
 * AipBodyAnalysis类
 *
 * @class
 * @extends BaseClient
 * @constructor
 * @param {string} appid appid.
 * @param {string} ak  access key.
 * @param {string} sk  security key.
 */
class AipBodyAnalysis extends BaseClient {
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

    /**
     * 人体关键点识别
     * 接口使用说明文档: https://ai.baidu.com/ai-doc/BODY/0k3cpyxme
     */
    bodyAnalysisV1(image, options) {
        let param = {
            image: image,
            targetPath: BODY_ANALYSIS_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 人体检测与属性识别
     * 接口使用说明文档: https://ai.baidu.com/ai-doc/BODY/Ak3cpyx6v
     */
    bodyAttrV1(image, options) {
        let param = {
            image: image,
            targetPath: BODY_ATTR_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 人流量统计
     * 接口使用说明文档: https://ai.baidu.com/ai-doc/BODY/7k3cpyy1t
     */
    bodyNumV1(image, options) {
        let param = {
            image: image,
            targetPath: BODY_NUM_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 驾驶行为分析
     * 接口使用说明文档: https://ai.baidu.com/ai-doc/BODY/Nk3cpywct
     */
    driverBehaviorV1(image, options) {
        let param = {
            image: image,
            targetPath: DRIVER_BEHAVIOR_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 人像分割
     * 接口使用说明文档: https://ai.baidu.com/ai-doc/BODY/Fk3cpyxua
     */
    bodySegV1(image, options) {
        let param = {
            image: image,
            targetPath: BODY_SEG_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 手势识别
     * 接口使用说明文档: https://ai.baidu.com/ai-doc/BODY/4k3cpywrv
     */
    gestureV1(image, options) {
        let param = {
            image: image,
            targetPath: GESTURE_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 人流量统计（动态版）
     * 接口使用说明文档: https://ai.baidu.com/ai-doc/BODY/wk3cpyyog
     */
    bodyTrackingV1(dynamic, image, options) {
        let param = {
            dynamic: dynamic,
            image: image,
            targetPath: BODY_TRACKING_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 手部关键点识别
     * 接口使用说明文档: https://ai.baidu.com/ai-doc/BODY/Kk3cpyxeu
     */
    handAnalysisV1(image, options) {
        let param = {
            image: image,
            targetPath: HAND_ANALYSIS_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 危险行为识别
     * 接口使用说明文档: https://ai.baidu.com/ai-doc/BODY/uk3cpywke
     */
    bodyDangerV1(data, options) {
        let param = {
            data: data,
            targetPath: BODY_DANGER_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 指尖检测
     * 接口使用说明文档: https://ai.baidu.com/ai-doc/BODY/Jk7ir38ut
     */
    fingertipV1(image, options) {
        let param = {
            image: image,
            targetPath: FINGERTIP_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }
}

module.exports = AipBodyAnalysis;

