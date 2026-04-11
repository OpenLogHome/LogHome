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
 * @file AipNlp.js
 * @author baidu aip
 */

const BaseClient = require('./client/baseClient');

const RequestInfo = require('./client/requestInfo');

const HttpClient = require('./http/httpClientNlp');

const objectTools = require('./util/objectTools');

const METHOD_POST = 'POST';

const LEXER_PATH = '/rpc/2.0/nlp/v1/lexer';
const LEXER_CUSTOM_PATH = '/rpc/2.0/nlp/v1/lexer_custom';
const DEP_PARSER_PATH = '/rpc/2.0/nlp/v1/depparser';
const WORD_EMBEDDING_PATH = '/rpc/2.0/nlp/v2/word_emb_vec';
const DNNLM_CN_PATH = '/rpc/2.0/nlp/v2/dnnlm_cn';
const WORD_SIM_EMBEDDING_PATH = '/rpc/2.0/nlp/v2/word_emb_sim';
const SIMNET_PATH = '/rpc/2.0/nlp/v2/simnet';
const COMMENT_TAG_PATH = '/rpc/2.0/nlp/v2/comment_tag';
const SENTIMENT_CLASSIFY_PATH = '/rpc/2.0/nlp/v1/sentiment_classify';
const KEYWORD_PATH = '/rpc/2.0/nlp/v1/keyword';
const TOPIC_PATH = '/rpc/2.0/nlp/v1/topic';
const ECNET_V1_PATH = '/rpc/2.0/nlp/v1/ecnet';
const EMOTION_V1_PATH = '/rpc/2.0/nlp/v1/emotion';
const NEWS_SUMMARY_V1_PATH = '/rpc/2.0/nlp/v1/news_summary';
const ADDRESS_V1_PATH = '/rpc/2.0/nlp/v1/address';

const COMMENT_TAG_CUSTOM_PATH = '/rpc/2.0/nlp/v2/comment_tag_custom';
const SENTIMENT_CLASSIFY_CUSTOM_PATH = '/rpc/2.0/nlp/v1/sentiment_classify_custom';
const COUPLETS_PATH = '/rpc/2.0/creation/v1/couplets';
const POEM_PATH = '/rpc/2.0/creation/v1/poem';
const ENTITY_LEVEL_SENTIMENT_PATH = '/rpc/2.0/nlp/v1/entity_level_sentiment';
const ENTITY_LEVEL_SENTIMENT_ADD_PATH = '/rpc/2.0/nlp/v1/entity_level_sentiment/add';
const ENTITY_LEVEL_SENTIMENT_DELETE_PATH = '/rpc/2.0/nlp/v1/entity_level_sentiment/delete';
const ENTITY_LEVEL_SENTIMENT_DELETE_REPO_PATH = '/rpc/2.0/nlp/v1/entity_level_sentiment/delete_repo';
const ENTITY_LEVEL_SENTIMENT_LIST_PATH = '/rpc/2.0/nlp/v1/entity_level_sentiment/list';
const ENTITY_LEVEL_SENTIMENT_QUERY_PATH = '/rpc/2.0/nlp/v1/entity_level_sentiment/query';
const TOPIC_PHRASE_PATH = '/rpc/2.0/creation/v1/topic_phrase';
const CVPARSER_PATH = '/rpc/2.0/recruitment/v1/cvparser';
const PERSON_POST_PATH = '/rpc/2.0/recruitment/v1/person_post';
const PERSONAS_PATH = '/rpc/2.0/recruitment/v1/personas';
const TITLEPREDICTOR_PATH = '/rpc/2.0/nlp/v1/titlepredictor';
const DEPPARSER_V2_PATH = '/rpc/2.0/nlp/v2/depparser';
const BLESS_CREATION_PATH = '/rpc/2.0/nlp/v1/bless_creation';
const ENTITY_ANALYSIS_PATH = '/rpc/2.0/nlp/v1/entity_analysis';
const TEXT_CORRECTION = '/rpc/2.0/nlp/v2/text_correction';

/**
 * AipNlp类
 *
 * @class
 * @extends BaseClient
 * @constructor
 * @param {string} appid appid.
 * @param {string} ak  access key.
 * @param {string} sk  security key.
 */
class AipNlp extends BaseClient {
    constructor(appId, ak, sk) {
        super(appId, ak, sk);
    }
    commonImpl(param) {
        let httpClient = new HttpClient();
        let apiUrl = param.targetPath;
        delete param.targetPath;
        let encodeType = param.encodeType;
        delete param.encodeType;
        let requestInfo = new RequestInfo(apiUrl,
            param, METHOD_POST);
        requestInfo.encodeType = encodeType;
        return this.doRequest(requestInfo, httpClient);
    }

    /**
     * 词法分析接口
     *
     * @param {string} text - 待分析文本（目前仅支持GBK编码），长度不超过65536字节
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    lexer(text, options) {
        let param = {
            text: text,
            targetPath: LEXER_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 词法分析（定制版）接口
     *
     * @param {string} text - 待分析文本（目前仅支持GBK编码），长度不超过65536字节
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    lexerCustom(text, options) {
        let param = {
            text: text,
            targetPath: LEXER_CUSTOM_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 依存句法分析接口
     *
     * @param {string} text - 待分析文本（目前仅支持GBK编码），长度不超过256字节
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   mode 模型选择。默认值为0，可选值mode=0（对应web模型）；mode=1（对应query模型）
     * @return {Promise} - 标准Promise对象
     */
    depparser(text, options) {
        let param = {
            text: text,
            targetPath: DEP_PARSER_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 词向量表示接口
     *
     * @param {string} word - 文本内容（GBK编码），最大64字节
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    wordembedding(word, options) {
        let param = {
            word: word,
            targetPath: WORD_EMBEDDING_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * DNN语言模型接口
     *
     * @param {string} text - 文本内容（GBK编码），最大512字节，不需要切词
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    dnnlmCn(text, options) {
        let param = {
            text: text,
            targetPath: DNNLM_CN_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 词义相似度接口
     *
     * @param {string} word1 - 词1（GBK编码），最大64字节
     * @param {string} word2 - 词1（GBK编码），最大64字节
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   mode 预留字段，可选择不同的词义相似度模型。默认值为0，目前仅支持mode=0
     * @return {Promise} - 标准Promise对象
     */
    wordSimEmbedding(word1, word2, options) {
        let param = {
            word_1: word1,
            word_2: word2,
            targetPath: WORD_SIM_EMBEDDING_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 短文本相似度接口
     *
     * @param {string} text1 - 待比较文本1（GBK编码），最大512字节
     * @param {string} text2 - 待比较文本2（GBK编码），最大512字节
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   model 默认为"BOW"，可选"BOW"、"CNN"与"GRNN"
     * @return {Promise} - 标准Promise对象
     */
    simnet(text1, text2, options) {
        let param = {
            text_1: text1,
            text_2: text2,
            targetPath: SIMNET_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 评论观点抽取接口
     *
     * @param {string} text - 评论内容（GBK编码），最大10240字节
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   type 评论行业类型，默认为4（餐饮美食）
     * @return {Promise} - 标准Promise对象
     */
    commentTag(text, options) {
        let param = {
            text: text,
            targetPath: COMMENT_TAG_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 情感倾向分析接口
     *
     * @param {string} text - 文本内容（GBK编码），最大102400字节
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    sentimentClassify(text, options) {
        let param = {
            text: text,
            targetPath: SENTIMENT_CLASSIFY_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 文章标签接口
     *
     * @param {string} title - 篇章的标题，最大80字节
     * @param {string} content - 篇章的正文，最大65535字节
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    keyword(title, content, options) {
        let param = {
            title: title,
            content: content,
            targetPath: KEYWORD_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 文章分类接口
     *
     * @param {string} title - 篇章的标题，最大80字节
     * @param {string} content - 篇章的正文，最大65535字节
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    topic(title, content, options) {
        let param = {
            title: title,
            content: content,
            targetPath: TOPIC_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 文本纠错
     *
     * @param {string} text - 待纠错文本，输入限制550个汉字或英文
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    ecnetV1(text, options) {
        let param = {
            text: text,
            targetPath: ECNET_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 文本纠错-高级版
     *
     * @param {string} text - 待纠错文本，输入限制550个汉字或英文
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    textCorrection(text, options) {
        let param = {
            text: text,
            targetPath: TEXT_CORRECTION
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 对话情绪识别
     *
     * @param {string} text - 待识别情感文本，输入限制512字节
     * @param {number} max_summary_len - 此数值将作为摘要结果的最大长度。
     * @param {Object} options
     * - scene: 场景
     *  - default（默认项-不区分场景）
     *  - talk（闲聊对话-如度秘聊天等）
     *  - task（任务型对话-如导航对话等）
     *  - customer_service（客服对话-如电信/银行客服等）
     * @return {Promise} - 标准Promise对象
     */
    emotionV1(text, options) {
        let param = {
            text: text,
            targetPath: EMOTION_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }


    /**
     * 新闻摘要
     *
     * @param {string} content - 新闻文本（限3000字符数以内）
     * @param {number} max_summary_len - 此数值将作为摘要结果的最大长度。
     * @description options
     * - title: 新闻标题（限200字符数）
     * @return {Promise} - 标准Promise对象
     */
    newsSummaryV1(content, max_summary_len, options) {
        let param = {
            content: content,
            max_summary_len: max_summary_len,
            targetPath: NEWS_SUMMARY_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }


    /**
     * 地址识别
     *
     * @param {string} text - 待识别的文本内容，不超过1000字节
     * @description options
     * - confidence: 不设置时默认为-1
     * @return {Promise} - 标准Promise对象
     */
    addressV1(text, options) {
        let param = {
            text: text,
            targetPath: ADDRESS_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }


    /**
     * 评论观点抽取（定制）
     * 接口文档链接: https://ai.baidu.com/ai-doc/NLP/ok6z52g8q
     */
    commentTagCustom(text, options) {
        let param = {
            text: text,
            targetPath: COMMENT_TAG_CUSTOM_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 情感倾向分析（定制）
     * 接口文档链接: https://ai.baidu.com/ai-doc/NLP/zk6z52hds
     */
    sentimentClassifyCustom(text, options) {
        let param = {
            text: text,
            targetPath: SENTIMENT_CLASSIFY_CUSTOM_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 智能春联
     * 接口文档链接: https://ai.baidu.com/ai-doc/NLP/Ok53wb6dh
     */
    couplets(text, options) {
        let param = {
            text: text,
            targetPath: COUPLETS_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 智能写诗
     * 接口文档链接: https://ai.baidu.com/ai-doc/NLP/ak53wc3o3
     */
    poem(text, options) {
        let param = {
            text: text,
            targetPath: POEM_PATH,
            encodeType: 'utf-8'
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 实体抽取与情感倾向分析
     * 接口文档链接: https://ai.baidu.com/ai-doc/NLP/Fk6z52g04
     */
    entityLevelSentiment(title, content, type, options) {
        let param = {
            title: title,
            content: content,
            type: type,
            targetPath: ENTITY_LEVEL_SENTIMENT_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 增加实体/实体库新增
     * 接口文档链接: https://ai.baidu.com/ai-doc/NLP/Fk6z52g04#%E5%AE%9E%E4%BD%93%E5%BA%93%E6%96%B0%E5%A2%9E%E6%8E%A5%E5%8F%A3
     */
    entityLevelSentimentAdd(repository, entities, options) {
        let param = {
            repository: repository,
            entities: entities,
            targetPath: ENTITY_LEVEL_SENTIMENT_ADD_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 删除实体/实体名单删除
     * 接口文档链接: https://ai.baidu.com/ai-doc/NLP/Fk6z52g04#%E5%AE%9E%E4%BD%93%E5%90%8D%E5%8D%95%E5%88%A0%E9%99%A4%E6%8E%A5%E5%8F%A3
     */
    entityLevelSentimentDelete(repository, options) {
        let param = {
            repository: repository,
            targetPath: ENTITY_LEVEL_SENTIMENT_DELETE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 删除实体库/实体库删除
     * 接口文档链接: https://ai.baidu.com/ai-doc/NLP/Fk6z52g04#%E5%AE%9E%E4%BD%93%E5%BA%93%E5%88%A0%E9%99%A4%E6%8E%A5%E5%8F%A3
     */
    entityLevelSentimentDeleteRepo(repositories, options) {
        let param = {
            repositories: repositories,
            targetPath: ENTITY_LEVEL_SENTIMENT_DELETE_REPO_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 实体库列表/实体库查询
     * 接口文档链接: https://ai.baidu.com/ai-doc/NLP/Fk6z52g04#%E5%AE%9E%E4%BD%93%E5%BA%93%E6%9F%A5%E8%AF%A2%E6%8E%A5%E5%8F%A3
     */
    entityLevelSentimentList(options) {
        let param = {
            targetPath: ENTITY_LEVEL_SENTIMENT_LIST_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 查询实体/实体名单查询
     * 接口文档链接: https://ai.baidu.com/ai-doc/NLP/Fk6z52g04#%E5%AE%9E%E4%BD%93%E5%90%8D%E5%8D%95%E6%9F%A5%E8%AF%A2%E6%8E%A5%E5%8F%A3
     */
    entityLevelSentimentQuery(repository, options) {
        let param = {
            repository: repository,
            targetPath: ENTITY_LEVEL_SENTIMENT_QUERY_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 文章主题短语生成
     * 接口文档链接: https://ai.baidu.com/ai-doc/NLP/9k53w3qob
     */
    topicPhrase(title, summary, options) {
        let param = {
            title: title,
            summary: summary,
            targetPath: TOPIC_PHRASE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 智能招聘-简历解析
     * 接口文档链接: https://ai.baidu.com/ai-doc/NLP/Xkahvfeqa
     */
    recruitmentCvparser(resume, options) {
        let param = {
            resume: resume,
            targetPath: CVPARSER_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 智能招聘-人岗匹配
     * 接口文档链接: https://ai.baidu.com/ai-doc/NLP/Pkahwzux5
     */
    recruitmentPersonPost(resume, job_description, options) {
        let param = {
            resume: resume,
            job_description: job_description,
            targetPath: PERSON_POST_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 智能招聘-简历画像
     * 接口文档链接: https://ai.baidu.com/ai-doc/NLP/5kc1kmz3w
     */
    recruitmentPersonas(resume, options) {
        let param = {
            resume: resume,
            targetPath: PERSONAS_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 文章标题生成
     * 接口文档链接: https://ai.baidu.com/ai-doc/NLP/0kvc1u1eg
     */
    titlepredictor(doc, options) {
        let param = {
            doc: doc,
            targetPath: TITLEPREDICTOR_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 依存句法分析V2
     * 接口文档链接: https://ai.baidu.com/ai-doc/NLP/nk6z52eu6
     */
    depparserV2(text, options) {
        let param = {
            text: text,
            targetPath: DEPPARSER_V2_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 祝福语生成
     * 接口文档链接: https://ai.baidu.com/ai-doc/NLP/sl4cg75jk
     */
    blessCreation(text, options) {
        let param = {
            text: text,
            targetPath: BLESS_CREATION_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 实体分析
     * 接口文档链接: https://ai.baidu.com/ai-doc/NLP/al631z295
     */
    entityAnalysis(text, options) {
        let param = {
            text: text,
            targetPath: ENTITY_ANALYSIS_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }


}

module.exports = AipNlp;

