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
 * @file AipMt.js
 * @author baidu aip
 */



const BaseClient = require('./client/baseClient');

const RequestInfo = require('./client/requestInfo');

const HttpClient = require('./http/httpClient');

const HttpClientJson = require('./http/httpClientExt');

const httpHeader = require('./const/httpHeader');

const CONTENT_TYPE_JSON = 'application/json';

const objectTools = require('./util/objectTools');

const METHOD_POST = 'POST';

const TEXTTRANS_V1_PATH = '/rpc/2.0/mt/texttrans/v1';
const TEXTTRANS_WITH_DICT_V1_PATH = '/rpc/2.0/mt/texttrans-with-dict/v1';
const DOC_TRANSLATION_CREATE_V2_PATH = '/rpc/2.0/mt/v2/doc-translation/create';
const DOC_TRANSLATION_QUERY_V2_PATH = '/rpc/2.0/mt/v2/doc-translation/query';
const SPEECH_TRANSLATION_V2_PATH = '/rpc/2.0/mt/v2/speech-translation';



/**
 * AipMt类
 *
 * @class
 * @extends BaseClient
 * @constructor
 * @param {string} appid appid.
 * @param {string} ak  access key.
 * @param {string} sk  security key.
 */
class AipMt extends BaseClient {
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

    /**
     * 文本翻译-通用版
     * 接口使用说明文档: https://ai.baidu.com/ai-doc/MT/4kqryjku9
     */
    texttransV1(from, to, q, options) {
        let param = {
            from: from,
            to: to,
            q: q,
            targetPath: TEXTTRANS_V1_PATH
        };
        return this.jsonRequestImpl(objectTools.merge(param, options));
    }

    /**
     * 文本翻译-词典版
     * 接口使用说明文档: https://ai.baidu.com/ai-doc/MT/nkqrzmbpc
     */
    texttransWithDictV1(from, to, q, options) {
        let param = {
            from: from,
            to: to,
            q: q,
            targetPath: TEXTTRANS_WITH_DICT_V1_PATH
        };
        return this.jsonRequestImpl(objectTools.merge(param, options));
    }

    /**
     * 文档翻译
     * 接口使用说明文档: https://ai.baidu.com/ai-doc/MT/Xky9x5xub
     */
    docTranslationCreateV2(from, to, input, options) {
        let param = {
            from: from,
            to: to,
            input: input,
            targetPath: DOC_TRANSLATION_CREATE_V2_PATH
        };
        return this.jsonRequestImpl(objectTools.merge(param, options));
    }

    /**
     * 文档翻译-文档状态查询
     * 接口使用说明文档: https://ai.baidu.com/ai-doc/MT/Xky9x5xub#%E6%9F%A5%E8%AF%A2%E6%96%87%E6%A1%A3%E7%BF%BB%E8%AF%91%E6%8E%A5%E5%8F%A3
     */
    docTranslationQueryV2(id, options) {
        let param = {
            id: id,
            targetPath: DOC_TRANSLATION_QUERY_V2_PATH
        };
        return this.jsonRequestImpl(objectTools.merge(param, options));
    }

    /**
     * 语音翻译
     * 接口使用说明文档: https://ai.baidu.com/ai-doc/MT/el4cmi76f
     */
    speechTranslationV2(from, to, voice, format, options) {
        let param = {
            from: from,
            to: to,
            voice: voice,
            format: format,
            targetPath: SPEECH_TRANSLATION_V2_PATH
        };
        console.log(param);
        return this.jsonRequestImpl(objectTools.merge(param, options));
    }

}

module.exports = AipMt;

