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
 * @file AipOcr.js
 * @author baidu aip
 */

const BaseClient = require('./client/baseClient');

const RequestInfo = require('./client/requestInfo');

const HttpClient = require('./http/httpClient');

const objectTools = require('./util/objectTools');

const METHOD_POST = 'POST';

const GENERAL_BASIC_PATH = '/rest/2.0/ocr/v1/general_basic';
const ACCURATE_BASIC_PATH = '/rest/2.0/ocr/v1/accurate_basic';
const GENERAL_PATH = '/rest/2.0/ocr/v1/general';
const ACCURATE_PATH = '/rest/2.0/ocr/v1/accurate';
const GENERAL_ENHANCED_PATH = '/rest/2.0/ocr/v1/general_enhanced';
const WEB_IMAGE_PATH = '/rest/2.0/ocr/v1/webimage';
const IDCARD_PATH = '/rest/2.0/ocr/v1/idcard';
const BANKCARD_PATH = '/rest/2.0/ocr/v1/bankcard';
const DRIVING_LICENSE_PATH = '/rest/2.0/ocr/v1/driving_license';
const VEHICLE_LICENSE_PATH = '/rest/2.0/ocr/v1/vehicle_license';
const LICENSE_PLATE_PATH = '/rest/2.0/ocr/v1/license_plate';
const BUSINESS_LICENSE_PATH = '/rest/2.0/ocr/v1/business_license';
const RECEIPT_PATH = '/rest/2.0/ocr/v1/receipt';
const FORM_PATH = '/rest/2.0/ocr/v1/form';
const TABLE_RECOGNIZE_PATH = '/rest/2.0/solution/v1/form_ocr/request';
const TABLE_RESULT_GET_PATH = '/rest/2.0/solution/v1/form_ocr/get_request_result';
const VAT_INVOICE_PATH = '/rest/2.0/ocr/v1/vat_invoice';
const QRCODE_PATH = '/rest/2.0/ocr/v1/qrcode';
const NUMBERS_PATH = '/rest/2.0/ocr/v1/numbers';
const LOTTERY_PATH = '/rest/2.0/ocr/v1/lottery';
const PASSPORT_PATH = '/rest/2.0/ocr/v1/passport';
const BUSINESS_CARD_PATH = '/rest/2.0/ocr/v1/business_card';
const HANDWRITING_PATH = '/rest/2.0/ocr/v1/handwriting';
const CUSTOM_PATH = '/rest/2.0/solution/v1/iocr/recognise';

const DOCANALYSIS_PATH = '/rest/2.0/ocr/v1/doc_analysis';
const METER_PATH  = '/rest/2.0/ocr/v1/meter';
const WEBIMAGELOC_PATH  = '/rest/2.0/ocr/v1/webimage_loc';

const TAXI_RECEIPT_PATH  = '/rest/2.0/ocr/v1/taxi_receipt';
const VIN_CODE_PATH  = '/rest/2.0/ocr/v1/vin_code';
const TRAIN_TICKET_PATH  = '/rest/2.0/ocr/v1/train_ticket';
const VEHICLE_INVOICE_PATH = '/rest/2.0/ocr/v1/vehicle_invoice';
const VEHICLE_CERTIFICATE_PATH = '/rest/2.0/ocr/v1/vehicle_certificate';
const HOUSEHOLD_REGISTER_PATH = '/rest/2.0/ocr/v1/household_register';
const AIR_TICKET_PATH = '/rest/2.0/ocr/v1/air_ticket';
const INVOICE_PATH = '/rest/2.0/ocr/v1/invoice';
const ONLINE_TAXI_ITINERARY_PATH = '/rest/2.0/ocr/v1/online_taxi_itinerary';
const WEIGHT_NOTE_PATH = '/rest/2.0/ocr/v1/weight_note';
const MEDICAL_DETAIL_PATH = '/rest/2.0/ocr/v1/medical_detail';

const BIRTH_CERTIFICATE_V1_PATH = '/rest/2.0/ocr/v1/birth_certificate';
const HK_MACAU_EXITENTRYPERMIT_V1_PATH = '/rest/2.0/ocr/v1/HK_Macau_exitentrypermit';
const TAIWAN_EXITENTRYPERMIT_V1_PATH = '/rest/2.0/ocr/v1/taiwan_exitentrypermit';
const QUOTA_INVOICE_V1_PATH = '/rest/2.0/ocr/v1/quota_invoice';
const INSURANCE_DOCUMENTS_V1_PATH = '/rest/2.0/ocr/v1/insurance_documents';
const SEAL_V1_PATH = '/rest/2.0/ocr/v1/seal';
const DOC_ANALYSIS_OFFICE_V1_PATH = '/rest/2.0/ocr/v1/doc_analysis_office';

const CUSTOM_FINANCE_PATH = '/rest/2.0/solution/v1/iocr/recognise/finance';
const FORMULA = '/rest/2.0/ocr/v1/formula';
const BUS_TICKET = '/rest/2.0/ocr/v1/bus_ticket';
const TOLL_INVOICE = '/rest/2.0/ocr/v1/toll_invoice';
const MULTI_CARD_CLASSIFY = '/rest/2.0/ocr/v1/multi_card_classify';
const INTELLIGENT_OCR = '/rest/2.0/ocr/v1/intelligent_ocr';
const MEDICAL_RECORD = '/rest/2.0/ocr/v1/medical_record';
const MEDICAL_STATEMENT = '/rest/2.0/ocr/v1/medical_statement';
const FERRY_TICKET = '/rest/2.0/ocr/v1/ferry_ticket';
const USED_VEHICLE_INVOICE = '/rest/2.0/ocr/v1/used_vehicle_invoice';
const MULTI_IDCARD = '/rest/2.0/ocr/v1/multi_idcard';
const TRAVEL_CARD = '/rest/2.0/ocr/v1/travel_card';
const HEALTH_CODE = '/rest/2.0/ocr/v1/health_code';
const COVID_TEST = '/rest/2.0/ocr/v1/covid_test';
const SOCIAL_SECURITY_CARD = '/rest/2.0/ocr/v1/social_security_card';
const MEDICAL_REPORT_DETECTION = '/rest/2.0/ocr/v1/medical_report_detection';
const MEDICAL_RECIPTS_CLASSIFY = '/rest/2.0/ocr/v1/medical_recipts_classify';
const WAYBILL = '/rest/2.0/ocr/v1/waybill';
const MEDICAL_SUMMARY = '/rest/2.0/ocr/v1/medical_summary';
const SHOPPING_RECEIPT = '/rest/2.0/ocr/v1/shopping_receipt';
const ROAD_TRANSPORT_CERTIFICATE = '/rest/2.0/ocr/v1/road_transport_certificate';
const TABLE = '/rest/2.0/ocr/v1/table';
const REMOVE_HANDWRITING = '/rest/2.0/ocr/v1/remove_handwriting';
const DOC_CROP_ENHANCE = '/rest/2.0/ocr/v1/doc_crop_enhance';
const MEDICAL_PRESCRIPTION = '/rest/2.0/ocr/v1/medical_prescription';
const MEDICAL_OUTPATIENT = '/rest/2.0/ocr/v1/medical_outpatient';
const MEDICAL_SUMMARY_DIAGNOSIS = '/rest/2.0/ocr/v1/medical_summary_diagnosis';
const HEALTH_REPORT = '/rest/2.0/ocr/v1/health_report';
const DOC_CONVERT_REQUEST = '/rest/2.0/ocr/v1/doc_convert/request';
const DOC_CONVERT_RESULT = '/rest/2.0/ocr/v1/doc_convert/get_request_result';
const MIXED_MULTI_VEHICLE = '/rest/2.0/ocr/v1/mixed_multi_vehicle';
const BANK_RECEIPT_NEW = '/rest/2.0/ocr/v1/bank_receipt_new';
const MARRIAGE_CERTIFICATE = '/rest/2.0/ocr/v1/marriage_certificate';
const HK_MACAU_TAIWAN_EXITENTRYPERMIT = '/rest/2.0/ocr/v1/hk_macau_taiwan_exitentrypermit';


/**
 * AipOcr类
 *
 * @class
 * @extends BaseClient
 * @constructor`
 * @param {string} appid appid.
 * @param {string} ak  access key.
 * @param {string} sk  security key.
 */
class AipOcr extends BaseClient {
    constructor(appId, ak, sk) {
        super(appId, ak, sk);
    }
    commonImpl(param) {
        let httpClient = new HttpClient();
        let apiUrl = param.targetPath;
        delete param.targetPath;
        let requestInfo = new RequestInfo(apiUrl, param, METHOD_POST);
        return this.doRequest(requestInfo, httpClient);
    }

    /**
     * 通用文字识别（标准版）
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   language_type 识别语言类型，默认为CHN_ENG。可选值包括：<br>- CHN_ENG：中英文混合；<br>- ENG：英文；<br>- POR：葡萄牙语；<br>- FRE：法语；<br>- GER：德语；<br>- ITA：意大利语；<br>- SPA：西班牙语；<br>- RUS：俄语；<br>- JAP：日语；<br>- KOR：韩语；
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   detect_language 是否检测语言，默认不检测。当前支持（中文、英语、日语、韩语）
     *   probability 是否返回识别结果中每一行的置信度
     * @return {Promise} - 标准Promise对象
     */
    generalBasic(image, options) {
        let param = {
            image: image,
            targetPath: GENERAL_BASIC_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用文字识别（标准版）
     *
     * @param {string} url - 图片完整URL，URL长度不超过1024字节，URL对应的图片base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式，当image字段存在时url字段失效
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   language_type 识别语言类型，默认为CHN_ENG。可选值包括：<br>- CHN_ENG：中英文混合；<br>- ENG：英文；<br>- POR：葡萄牙语；<br>- FRE：法语；<br>- GER：德语；<br>- ITA：意大利语；<br>- SPA：西班牙语；<br>- RUS：俄语；<br>- JAP：日语；<br>- KOR：韩语；
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   detect_language 是否检测语言，默认不检测。当前支持（中文、英语、日语、韩语）
     *   probability 是否返回识别结果中每一行的置信度
     * @return {Promise} - 标准Promise对象
     */
    generalBasicUrl(url, options) {
        let param = {
            url: url,
            targetPath: GENERAL_BASIC_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用文字识别（标准版）
     * https://ai.baidu.com/ai-doc/OCR/zk3h7xz52
     *
     * @param pdf
     * @param options
     * @returns {*}
     */
    generalBasicPdf(pdf, options) {
        let param = {
            pdf_file: pdf,
            targetPath: GENERAL_BASIC_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用文字识别（高精度版）
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   probability 是否返回识别结果中每一行的置信度
     * @return {Promise} - 标准Promise对象
     */
    accurateBasic(image, options) {
        let param = {
            image: image,
            targetPath: ACCURATE_BASIC_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用文字识别（高精度版）
     * https://ai.baidu.com/ai-doc/OCR/1k3h7y3db
     *
     * @param url
     * @param options
     * @returns {*}
     */
    accurateBasicUrl(url, options) {
        let param = {
            url: url,
            targetPath: ACCURATE_BASIC_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用文字识别（高精度版）
     * https://ai.baidu.com/ai-doc/OCR/1k3h7y3db
     *
     * @param pdf
     * @param options
     * @returns {*}
     */
    accurateBasicPdf(pdf, options) {
        let param = {
            pdf_file: pdf,
            targetPath: ACCURATE_BASIC_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }


    /**
     * 通用文字识别（标准含位置版）
     * https://ai.baidu.com/ai-doc/OCR/vk3h7y58v
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   recognize_granularity 是否定位单字符位置，big：不定位单字符位置，默认值；small：定位单字符位置
     *   language_type 识别语言类型，默认为CHN_ENG。可选值包括：<br>- CHN_ENG：中英文混合；<br>- ENG：英文；<br>- POR：葡萄牙语；<br>- FRE：法语；<br>- GER：德语；<br>- ITA：意大利语；<br>- SPA：西班牙语；<br>- RUS：俄语；<br>- JAP：日语；<br>- KOR：韩语；
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   detect_language 是否检测语言，默认不检测。当前支持（中文、英语、日语、韩语）
     *   vertexes_location 是否返回文字外接多边形顶点位置，不支持单字位置。默认为false
     *   probability 是否返回识别结果中每一行的置信度
     * @return {Promise} - 标准Promise对象
     */
    general(image, options) {
        let param = {
            image: image,
            targetPath: GENERAL_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用文字识别（标准含位置版）
     * https://ai.baidu.com/ai-doc/OCR/vk3h7y58v
     *
     * @param {string} url - 图片完整URL，URL长度不超过1024字节，URL对应的图片base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式，当image字段存在时url字段失效
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   recognize_granularity 是否定位单字符位置，big：不定位单字符位置，默认值；small：定位单字符位置
     *   language_type 识别语言类型，默认为CHN_ENG。可选值包括：<br>- CHN_ENG：中英文混合；<br>- ENG：英文；<br>- POR：葡萄牙语；<br>- FRE：法语；<br>- GER：德语；<br>- ITA：意大利语；<br>- SPA：西班牙语；<br>- RUS：俄语；<br>- JAP：日语；<br>- KOR：韩语；
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   detect_language 是否检测语言，默认不检测。当前支持（中文、英语、日语、韩语）
     *   vertexes_location 是否返回文字外接多边形顶点位置，不支持单字位置。默认为false
     *   probability 是否返回识别结果中每一行的置信度
     * @return {Promise} - 标准Promise对象
     */
    generalUrl(url, options) {
        let param = {
            url: url,
            targetPath: GENERAL_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用文字识别（标准含位置版）
     * https://ai.baidu.com/ai-doc/OCR/vk3h7y58v
     *
     * @param pdf
     * @param options
     * @returns {*}
     */
    generalPdf(pdf, options) {
        let param = {
            pdf_file: pdf,
            targetPath: GENERAL_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用文字识别（高精度含位置版）
     * https://ai.baidu.com/ai-doc/OCR/tk3h7y2aq
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   recognize_granularity 是否定位单字符位置，big：不定位单字符位置，默认值；small：定位单字符位置
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   vertexes_location 是否返回文字外接多边形顶点位置，不支持单字位置。默认为false
     *   probability 是否返回识别结果中每一行的置信度
     * @return {Promise} - 标准Promise对象
     */
    accurate(image, options) {
        let param = {
            image: image,
            targetPath: ACCURATE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用文字识别（高精度含位置版）
     * https://ai.baidu.com/ai-doc/OCR/tk3h7y2aq
     *
     * @param url
     * @param options
     * @returns {*}
     */
    accurateUrl(url, options) {
        let param = {
            url: url,
            targetPath: ACCURATE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用文字识别（高精度含位置版）
     * https://ai.baidu.com/ai-doc/OCR/tk3h7y2aq
     *
     * @param pdf
     * @param options
     * @returns {*}
     */
    accuratePdf(pdf, options) {
        let param = {
            pdf_file: pdf,
            targetPath: ACCURATE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用文字识别（含生僻字版）接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   language_type 识别语言类型，默认为CHN_ENG。可选值包括：<br>- CHN_ENG：中英文混合；<br>- ENG：英文；<br>- POR：葡萄牙语；<br>- FRE：法语；<br>- GER：德语；<br>- ITA：意大利语；<br>- SPA：西班牙语；<br>- RUS：俄语；<br>- JAP：日语；<br>- KOR：韩语；
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   detect_language 是否检测语言，默认不检测。当前支持（中文、英语、日语、韩语）
     *   probability 是否返回识别结果中每一行的置信度
     * @return {Promise} - 标准Promise对象
     */
    generalEnhance(image, options) {
        let param = {
            image: image,
            targetPath: GENERAL_ENHANCED_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用文字识别（含生僻字版）接口
     *
     * @param {string} url - 图片完整URL，URL长度不超过1024字节，URL对应的图片base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式，当image字段存在时url字段失效
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   language_type 识别语言类型，默认为CHN_ENG。可选值包括：<br>- CHN_ENG：中英文混合；<br>- ENG：英文；<br>- POR：葡萄牙语；<br>- FRE：法语；<br>- GER：德语；<br>- ITA：意大利语；<br>- SPA：西班牙语；<br>- RUS：俄语；<br>- JAP：日语；<br>- KOR：韩语；
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   detect_language 是否检测语言，默认不检测。当前支持（中文、英语、日语、韩语）
     *   probability 是否返回识别结果中每一行的置信度
     * @return {Promise} - 标准Promise对象
     */
    generalEnhanceUrl(url, options) {
        let param = {
            url: url,
            targetPath: GENERAL_ENHANCED_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 网络图片文字识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   detect_language 是否检测语言，默认不检测。当前支持（中文、英语、日语、韩语）
     * @return {Promise} - 标准Promise对象
     */
    webImage(image, options) {
        let param = {
            image: image,
            targetPath: WEB_IMAGE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 网络图片文字识别接口
     *
     * @param {string} url - 图片完整URL，URL长度不超过1024字节，URL对应的图片base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式，当image字段存在时url字段失效
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   detect_language 是否检测语言，默认不检测。当前支持（中文、英语、日语、韩语）
     * @return {Promise} - 标准Promise对象
     */
    webImageUrl(url, options) {
        let param = {
            url: url,
            targetPath: WEB_IMAGE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 身份证识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {string} idCardSide - front：身份证含照片的一面；back：身份证带国徽的一面
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   detect_risk 是否开启身份证风险类型(身份证复印件、临时身份证、身份证翻拍、修改过的身份证)功能，默认不开启，即：false。可选值:true-开启；false-不开启
     * @return {Promise} - 标准Promise对象
     */
    idcard(image, idCardSide, options) {
        let param = {
            image: image,
            id_card_side: idCardSide,
            targetPath: IDCARD_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 身份证识别
     * https://ai.baidu.com/ai-doc/OCR/rk3h7xzck
     *
     * @param url
     * @param idCardSide
     * @param options
     * @returns {*}
     */
    idcardUrl(url, idCardSide, options) {
        let param = {
            url: url,
            id_card_side: idCardSide,
            targetPath: IDCARD_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 银行卡识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    bankcard(image, options) {
        let param = {
            image: image,
            targetPath: BANKCARD_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 驾驶证识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     * @return {Promise} - 标准Promise对象
     */
    drivingLicense(image, options) {
        let param = {
            image: image,
            targetPath: DRIVING_LICENSE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 驾驶证识别
     * https://ai.baidu.com/ai-doc/OCR/Vk3h7xzz7
     *
     * @param url
     * @param options
     * @returns {*}
     */
    drivingLicenseUrl(url, options) {
        let param = {
            url: url,
            targetPath: DRIVING_LICENSE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 行驶证识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     *   accuracy normal 使用快速服务，1200ms左右时延；缺省或其它值使用高精度服务，1600ms左右时延
     * @return {Promise} - 标准Promise对象
     */
    vehicleLicense(image, options) {
        let param = {
            image: image,
            targetPath: VEHICLE_LICENSE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 驾驶证识别
     * https://ai.baidu.com/ai-doc/OCR/Vk3h7xzz7
     * @param url
     * @param options
     * @returns {*}
     */
    vehicleLicenseUrl(url, options) {
        let param = {
            url: url,
            targetPath: VEHICLE_LICENSE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 车牌识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   multi_detect 是否检测多张车牌，默认为false，当置为true的时候可以对一张图片内的多张车牌进行识别
     * @return {Promise} - 标准Promise对象
     */
    licensePlate(image, options) {
        let param = {
            image: image,
            targetPath: LICENSE_PLATE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 营业执照识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    businessLicense(image, options) {
        let param = {
            image: image,
            targetPath: BUSINESS_LICENSE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用票据识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   recognize_granularity 是否定位单字符位置，big：不定位单字符位置，默认值；small：定位单字符位置
     *   probability 是否返回识别结果中每一行的置信度
     *   accuracy normal 使用快速服务，1200ms左右时延；缺省或其它值使用高精度服务，1600ms左右时延
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     * @return {Promise} - 标准Promise对象
     */
    receipt(image, options) {
        let param = {
            image: image,
            targetPath: RECEIPT_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 表格文字识别同步接口接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    form(image, options) {
        let param = {
            image: image,
            targetPath: FORM_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 表格文字识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    tableBegin(image, options) {
        let param = {
            image: image,
            targetPath: TABLE_RECOGNIZE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 表格识别结果接口
     *
     * @param {string} requestId - 发送表格文字识别请求时返回的request id
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   result_type 期望获取结果的类型，取值为“excel”时返回xls文件的地址，取值为“json”时返回json格式的字符串,默认为”excel”
     * @return {Promise} - 标准Promise对象
     */
    tableGetresult(requestId, options) {
        let param = {
            request_id: requestId,
            targetPath: TABLE_RESULT_GET_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 增值税发票识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    vatInvoice(image, options) {
        let param = {
            image: image,
            targetPath: VAT_INVOICE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 增值税发票识别接口
     *
     * @param {string} image - url
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    vatInvoiceUrl(image, options) {
        let param = {
            url: image,
            targetPath: VAT_INVOICE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 增值税发票识别接口
     *
     * @param {string} image - pdf
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    vatInvoicePdf(image, options) {
        let fs = require('fs');
        let data = fs.readFileSync(image);
        let base64 = new Buffer(data).toString('base64');
        let param = {
            pdf_file: base64,
            targetPath: VAT_INVOICE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 二维码识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    qrcode(image, options) {
        let param = {
            image: image,
            targetPath: QRCODE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 数字识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   recognize_granularity 是否定位单字符位置，big：不定位单字符位置，默认值；small：定位单字符位置
     *   detect_direction 是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:<br>- true：检测朝向；<br>- false：不检测朝向。
     * @return {Promise} - 标准Promise对象
     */
    numbers(image, options) {
        let param = {
            image: image,
            targetPath: NUMBERS_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 彩票识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   recognize_granularity 是否定位单字符位置，big：不定位单字符位置，默认值；small：定位单字符位置
     * @return {Promise} - 标准Promise对象
     */
    lottery(image, options) {
        let param = {
            image: image,
            targetPath: LOTTERY_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 护照识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    passport(image, options) {
        let param = {
            image: image,
            targetPath: PASSPORT_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 名片识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    businessCard(image, options) {
        let param = {
            image: image,
            targetPath: BUSINESS_CARD_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 手写文字识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   recognize_granularity 是否定位单字符位置，big：不定位单字符位置，默认值；small：定位单字符位置
     * @return {Promise} - 标准Promise对象
     */
    handwriting(image, options) {
        let param = {
            image: image,
            targetPath: HANDWRITING_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 自定义模板文字识别接口
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param {string} templateSign - 您在自定义文字识别平台制作的模板的ID
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    custom(image, templateSign, options) {
        let param = {
            image: image,
            templateSign: templateSign,
            targetPath: CUSTOM_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * https://ai.baidu.com/ai-doc/OCR/Ek3h7y961
     */
    customUrl(url, templateSign, options) {
        let param = {
            url: url,
            templateSign: templateSign,
            targetPath: CUSTOM_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }
    tableRecorgnize(image, type, timeout, interval) {
        let self = this;
        timeout = timeout || 20000;
        interval = interval || 2000;
        return this.tableBegin(image).then(function(result) {
            if (result.error_code) {
                return result;
            }
            let id = result.result[0]['request_id'];
            let pid = null;
            let startTime = Date.now();
            return new Promise(function(resolve, reject) {
                pid = setInterval(function () {
                    if (Date.now() - startTime > timeout) {
                        reject({errorMsg: 'get result timeout', requestId: id});
                        clearInterval(pid);
                    } else {
                        self.tableGetresult(id, type).then(function (result) {
                            if (result['result']['ret_code'] === 3) {
                                clearInterval(pid);
                                resolve(result);
                            }
                        });
                    }
                }, interval);
            })
        });
    }

    /**
     * 文档版面分析与识别
     *
     * @param {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param languageType
         识别语言类型，默认为CHN_ENG  可选值包括：CHN_ENG：中英文, ENG：英文
     * @param resultType
         返回识别结果是按单行结果返回，还是按单字结果返回，默认为big。
         big：返回行识别结果
         small：返回行识别结果之上还会返回单字结果
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *      detect_direction：
     *                  类型: string   可选值范围: true/false  说明：是否检测图像朝向，默认不检测，即：false。
     *      line_probability:
     *                  类型: string   可选值范围: true/false  说明：是否返回每行识别结果的置信度。默认为false
     *      words_type:
     *                  类型: string   可选值范围: handwring_only/handprint_mix  说明：文字类型, 默认 印刷文字识别
     *      layout_analysis：
     *                  类型: string   可选值范围: true/false  说明：是否分析文档版面：包括图、表、标题、段落的分析输出
     * @return {Promise} - 标准Promise对象
     */
    docAnalysis(image,languageType, resultType, options) {
        let param = {
            image: image,
            language_type:languageType,
            result_type:resultType,
            targetPath: DOCANALYSIS_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }


    /**
     * 仪器仪表盘读数识别
     {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param options - options列表
     *      probability：
     *                  类型: string   可选值范围: true/false  说明：是否返回每行识别结果的置信度。默认为false
     *      poly_location:
     *                  类型: string   可选值范围: true/false  说明：位置信息返回形式，默认：false
     * @return
     */
    meter(image, options) {
        let param = {
            image: image,
            targetPath: METER_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }


    /**
     * 网络图片文字识别（含位置版）
     * {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param options - options列表
     *      detect_direction：
     *                  类型: string   可选值范围: true/false  说明：是否检测图像朝向，默认不检测，即：false。
     *      probability:
     *                  类型: string   可选值范围: true/false  说明：是否返回每行识别结果的置信度。默认为false
     *      poly_location:
     *                  类型: string   可选值范围: handwring_only/handprint_mix  说明：是否返回文字所在区域的外接四边形的4个点坐标信息。默认为false
     *      recognize_granularity：
     *                  类型: string   可选值范围: true/false  说明：是否定位单字符位置，big：不定位单字符位置，默认值；small：定位单字符位置
     * @return
     */
     webimageLoc(image, options) {
        let param = {
            image: image,
            targetPath: WEBIMAGELOC_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 出租车票识别
     * {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param options - options列表
     * @return
     */
    taxiReceipt(image, options) {
        let param = {
            image: image,
            targetPath: TAXI_RECEIPT_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }


    /**
     * 出租车票识别
     * {string} image - url
     * @param options - options列表
     * @return
     */
    taxiReceiptUrl(image, options) {
        let param = {
            url: image,
            targetPath: TAXI_RECEIPT_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * VIN码识别
     * {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param options - options列表
     * @return
     */
    vinCode(image, options) {
        let param = {
            image: image,
            targetPath: VIN_CODE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * VIN码识别
     * {string} image - url
     * @param options - options列表
     * @return
     */
    vinCodeUrl(image, options) {
        let param = {
            url: image,
            targetPath: VIN_CODE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 火车票识别
     * {string} image - 图像数据，base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/png/bmp格式
     * @param options - options列表
     * @return
     */
    trainTicket(image, options) {
        let param = {
            image: image,
            targetPath: TRAIN_TICKET_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 火车票识别
     * {string} image - url
     * @param options - options列表
     * @return
     */
    trainTicketUrl(image, options) {
        let param = {
            url: image,
            targetPath: TRAIN_TICKET_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }
    /**
     * 二维码识别
     *
     * @param {string} url - 图片完整URL
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    qrcodeUrl(url, options) {

        let param = {};

        param.url = url;
        param.targetPath = QRCODE_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 试卷分析与识别
     *
     * @param {string} url - 图片完整URL
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   multi_detect 控制是否开启多航班信息识别功能,默认值：false
     * @return {Promise} - 标准Promise对象
     */
    docAnalysisUrl(url, options) {

        let param = {};

        param.url = url;
        param.targetPath = DOCANALYSIS_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 机动车销售发票
     *
     * @param {string} image - 二进制图像数据
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    vehicleInvoice(image, options) {

        let param = {};

        param.image = image;
        param.targetPath = VEHICLE_INVOICE_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 机动车销售发票
     *
     * @param {string} url - 图片完整URL
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    vehicleInvoiceUrl(url, options) {

        let param = {};

        param.url = url;
        param.targetPath = VEHICLE_INVOICE_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 车辆合格证
     *
     * @param {string} image - 二进制图像数据
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   language_type 识别语言类型，默认为CHN_ENG
     *   result_type 返回识别结果是按单行结果返回，还是按单字结果返回，默认为big
     *   detect_direction 是否检测图像朝向，默认不检测，即：false
     *   line_probability 是否返回每行识别结果的置信度。默认为false
     *   words_type 文字类型。
     * @return {Promise} - 标准Promise对象
     */
    vehicleCertificate(image, options) {

        let param = {};

        param.image = image;
        param.targetPath = VEHICLE_CERTIFICATE_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 车辆合格证
     *
     * @param {string} url - 图片完整URL
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   language_type 识别语言类型，默认为CHN_ENG
     *   result_type 返回识别结果是按单行结果返回，还是按单字结果返回，默认为big
     *   detect_direction 是否检测图像朝向，默认不检测，即：false
     *   line_probability 是否返回每行识别结果的置信度。默认为false
     *   words_type 文字类型。
     * @return {Promise} - 标准Promise对象
     */
    vehicleCertificateUrl(url, options) {

        let param = {};

        param.url = url;
        param.targetPath = VEHICLE_CERTIFICATE_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 户口本识别
     *
     * @param {string} image - 二进制图像数据
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    householdRegister(image, options) {

        let param = {};

        param.image = image;
        param.targetPath = HOUSEHOLD_REGISTER_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 户口本识别
     *
     * @param {string} url - 图片完整URL
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    householdRegisterUrl(url, options) {

        let param = {};

        param.url = url;
        param.targetPath = HOUSEHOLD_REGISTER_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 手写文字识别
     *
     * @param {string} url - 图片完整URL
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   recognize_granularity 是否定位单字符位置，
     *   probability 是否返回识别结果中每一行的置信度，默认为false，不返回置信度
     *   detect_direction 是否检测图像朝向，默认不检测，即：false
     * @return {Promise} - 标准Promise对象
     */
    handwritingUrl(url, options) {

        let param = {};

        param.url = url;
        param.targetPath = HANDWRITING_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 飞机行程单识别
     *
     * @param {string} image - 二进制图像数据
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   multi_detect 控制是否开启多航班信息识别功能,默认值：false
     * @return {Promise} - 标准Promise对象
     */
    airTicket(image, options) {

        let param = {};

        param.image = image;
        param.targetPath = AIR_TICKET_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 飞机行程单识别
     *
     * @param {string} url - 图片完整URL
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   multi_detect 控制是否开启多航班信息识别功能,默认值：false
     * @return {Promise} - 标准Promise对象
     */
    airTicketUrl(url, options) {

        let param = {};

        param.url = url;
        param.targetPath = AIR_TICKET_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用机打发票
     *
     * @param {string} image - 二进制图像数据
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   location 是否输出位置信息，true：输出位置信息，false：不输出位置信息，默认false
     * @return {Promise} - 标准Promise对象
     */
    invoice(image, options) {

        let param = {};

        param.image = image;
        param.targetPath = INVOICE_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通用机打发票
     *
     * @param {string} url - 图片完整URL
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   location 是否输出位置信息，true：输出位置信息，false：不输出位置信息，默认false
     * @return {Promise} - 标准Promise对象
     */
    invoiceUrl(url, options) {

        let param = {};

        param.url = url;
        param.targetPath = INVOICE_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 护照识别
     *
     * @param {string} url - 图片完整URL
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    passportUrl(url, options) {

        let param = {};

        param.url = url;
        param.targetPath = PASSPORT_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 网约车行程单识别
     *
     * @param {string} image - 二进制图像数据
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   pdf_file_num 需要识别的PDF文件的对应页码，当 pdf_file 参数有效时，识别传入页码的对应页面内容，若不传入，则默认识别第 1 页
     * @return {Promise} - 标准Promise对象
     */
    onlineTaxiItinerary(image) {

        let param = {};
        let options = {};
        param.image = image;
        param.targetPath = ONLINE_TAXI_ITINERARY_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 网约车行程单识别
     *
     * @param {string} url - 图片完整URL路径
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   pdf_file_num 需要识别的PDF文件的对应页码，当 pdf_file 参数有效时，识别传入页码的对应页面内容，若不传入，则默认识别第 1 页
     * @return {Promise} - 标准Promise对象
     */
    onlineTaxiItineraryUrl(url) {

        let param = {};
        let options = {};
        param.url = url;
        param.targetPath = ONLINE_TAXI_ITINERARY_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 网约车行程单识别
     *
     * @param {string} pdf_file - pdf文件二进制数据
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   pdf_file_num 需要识别的PDF文件的对应页码，当 pdf_file 参数有效时，识别传入页码的对应页面内容，若不传入，则默认识别第 1 页
     * @return {Promise} - 标准Promise对象
     */
    onlineTaxiItineraryPdf(pdf_file, options) {

        let param = {};

        param.pdf_file = pdf_file;
        param.targetPath = ONLINE_TAXI_ITINERARY_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 磅单识别
     *
     * @param {string} image - 二进制图像数据
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   pdf_file_num 需要识别的PDF文件的对应页码，当 pdf_file 参数有效时，识别传入页码的对应页面内容，若不传入，则默认识别第 1 页
     *   probability 是否返回字段识别结果的置信度，默认为 false，可缺省
                - false：不返回字段识别结果的置信度
                - true：返回字段识别结果的置信度，包括字段识别结果中各字符置信度的平均值（average）和最小值（min）
     * @return {Promise} - 标准Promise对象
     */
    weightNote(image, options) {

        let param = {};

        param.image = image;
        param.targetPath = WEIGHT_NOTE_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 磅单识别
     *
     * @param {string} url - 图片完整URL路径
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   pdf_file_num 需要识别的PDF文件的对应页码，当 pdf_file 参数有效时，识别传入页码的对应页面内容，若不传入，则默认识别第 1 页
     *   probability 是否返回字段识别结果的置信度，默认为 false，可缺省
                - false：不返回字段识别结果的置信度
                - true：返回字段识别结果的置信度，包括字段识别结果中各字符置信度的平均值（average）和最小值（min）
     * @return {Promise} - 标准Promise对象
     */
    weightNoteUrl(url, options) {

        let param = {};

        param.url = url;
        param.targetPath = WEIGHT_NOTE_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 磅单识别
     *
     * @param {string} pdf_file - 图片完整URL路径
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   pdf_file_num 需要识别的PDF文件的对应页码，当 pdf_file 参数有效时，识别传入页码的对应页面内容，若不传入，则默认识别第 1 页
     *   probability 是否返回字段识别结果的置信度，默认为 false，可缺省
                - false：不返回字段识别结果的置信度
                - true：返回字段识别结果的置信度，包括字段识别结果中各字符置信度的平均值（average）和最小值（min）
     * @return {Promise} - 标准Promise对象
     */
    weightNotePdf(pdf_file, options) {

        let param = {};

        param.pdf_file = pdf_file;
        param.targetPath = WEIGHT_NOTE_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 医疗费用明细识别
     *
     * @param {string} image - 二进制图像数据
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   location 是否返回字段的位置信息，默认为 false，可缺省
                - false：不返回字段位置信息
                - true：返回字段的位置信息，包括上边距（top）、左边距（left）、宽度（width）、高度（height）
     *   probability 是否返回字段识别结果的置信度，默认为 false，可缺省
                - false：不返回字段识别结果的置信度
                - true：返回字段识别结果的置信度，包括字段识别结果中各字符置信度的平均值（average）和最小值（min）
     * @return {Promise} - 标准Promise对象
     */
    medicalDetail(image, options) {

        let param = {};

        param.image = image;
        param.targetPath = MEDICAL_DETAIL_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 医疗费用明细识别
     *
     * @param {string} url - 图片完整URL路径
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *   location 是否返回字段的位置信息，默认为 false，可缺省
                - false：不返回字段位置信息
                - true：返回字段的位置信息，包括上边距（top）、左边距（left）、宽度（width）、高度（height）
     *   probability 是否返回字段识别结果的置信度，默认为 false，可缺省
                - false：不返回字段识别结果的置信度
                - true：返回字段识别结果的置信度，包括字段识别结果中各字符置信度的平均值（average）和最小值（min）
     * @return {Promise} - 标准Promise对象
     */
    medicalDetailUrl(url, options) {

        let param = {};

        param.url = url;
        param.targetPath = MEDICAL_DETAIL_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 出生医学证明识别
     *
     * @param {string} image - 二进制图像数据
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    birthCertificateV1(image, options) {
        let param = {};

        param.image = image;
        param.targetPath = BIRTH_CERTIFICATE_V1_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 出生医学证明识别
     *
     * @param {string} image - 图片完整URL路径
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    birthCertificateV1Url(url, options) {
        let param = {};

        param.url = url;
        param.targetPath = BIRTH_CERTIFICATE_V1_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }


    /**
     * 港澳通行证识别
     *
     * @param {string} image - 二进制图像数据
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    hkMacauExitentrypermitV1(image, options) {
        let param = {};

        param.image = image;
        param.targetPath = HK_MACAU_EXITENTRYPERMIT_V1_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 港澳通行证识别
     *
     * @param {string} image - 图片完整URL路径
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    hkMacauExitentrypermitV1Url(url, options) {
        let param = {};

        param.url = url;
        param.targetPath = HK_MACAU_EXITENTRYPERMIT_V1_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 台湾通行证识别
     *
     * @param {string} image - 二进制图像数据
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    taiwanExitentrypermitV1(image, options) {
        let param = {};

        param.image = image;
        param.targetPath = TAIWAN_EXITENTRYPERMIT_V1_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 台湾通行证识别
     *
     * @param {string} image - 图片完整URL路径
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    taiwanExitentrypermitV1Url(url, options) {
        let param = {};

        param.url = url;
        param.targetPath = TAIWAN_EXITENTRYPERMIT_V1_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }


    /**
     * 定额发票识别
     *
     * @param {string} image - 二进制图像数据
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    quotaInvoiceV1(image, options) {
        let param = {};

        param.image = image;
        param.targetPath = QUOTA_INVOICE_V1_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 定额发票识别
     *
     * @param {string} image - 图片完整URL路径
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    quotaInvoiceV1Url(url, options) {
        let param = {};

        param.url = url;
        param.targetPath = QUOTA_INVOICE_V1_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 定额发票识别
     *
     * @param {string} pdf_file - PDF文件路径
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *  - pdf_file_num: 需要识别的PDF文件的对应页码,
     *                  当 pdf_file 参数有效时，识别传入页码的对应页面内容，
     *                  若不传入，则默认识别第 1 页
     * @return {Promise} - 标准Promise对象
     */
    quotaInvoiceV1Pdf(pdf_file, options) {
        let fs = require('fs');
        let data = fs.readFileSync(pdf_file);
        let base64 = new Buffer(data).toString('base64');
        let param = {
            pdf_file: base64,
            targetPath: QUOTA_INVOICE_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }


    /**
     * 印章识别
     *
     * @param {string} image - 二进制图像数据
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    sealV1(image, options) {
        let param = {};

        param.image = image;
        param.targetPath = SEAL_V1_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 印章识别
     *
     * @param {string} url - 图片完整URL路径
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     * @return {Promise} - 标准Promise对象
     */
    sealV1Url(url, options) {
        let param = {};

        param.url = url;
        param.targetPath = SEAL_V1_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 印章识别
     *
     * @param {string} pdf_file - PDF文件路径
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *  - pdf_file_num: 需要识别的PDF文件的对应页码,
     *                  当 pdf_file 参数有效时，识别传入页码的对应页面内容，
     *                  若不传入，则默认识别第 1 页
     * @return {Promise} - 标准Promise对象
     */
    sealV1Pdf(pdf_file, options) {
        let fs = require('fs');
        let data = fs.readFileSync(pdf_file);
        let base64 = new Buffer(data).toString('base64');
        let param = {
            pdf_file: base64,
            targetPath: SEAL_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 办公文档识别
     *
     * @param {string} image - 二进制图像数据
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表: 参考官网说明文档: https://ai.baidu.com/ai-doc/OCR/ykg9c09ji
     * @return {Promise} - 标准Promise对象
     */
    docAnalysisOfficeV1(image, options) {
        let param = {};

        param.image = image;
        param.targetPath = DOC_ANALYSIS_OFFICE_V1_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 办公文档识别
     *
     * @param {string} url - 图片完整URL路径
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表: 参考官网说明文档: https://ai.baidu.com/ai-doc/OCR/ykg9c09ji
     * @return {Promise} - 标准Promise对象
     */
    docAnalysisOfficeV1Url(url, options) {
        let param = {};

        param.url = url;
        param.targetPath = DOC_ANALYSIS_OFFICE_V1_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 办公文档识别
     *
     * @param {string} pdf_file - PDF文件路径
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表: 参考官网说明文档: https://ai.baidu.com/ai-doc/OCR/ykg9c09ji
     * @return {Promise} - 标准Promise对象
     */
    docAnalysisOfficeV1Pdf(pdf_file, options) {
        let fs = require('fs');
        let data = fs.readFileSync(pdf_file);
        let base64 = new Buffer(data).toString('base64');
        let param = {
            pdf_file: base64,
            targetPath: DOC_ANALYSIS_OFFICE_V1_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 保险单识别
     *
     * @param {string} image - 二进制图像数据
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *  kv_business: 是否进行商业逻辑处理
     *      - true：进行商业逻辑处理
     *      - false：不进行商业逻辑处理，默认true
     * @return {Promise} - 标准Promise对象
     */
    insuranceDocumentsV1(image, options) {
        let param = {};

        param.image = image;
        param.targetPath = INSURANCE_DOCUMENTS_V1_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 保险单识别
     *
     * @param {string} url - 图像url
     * @param {Object} options - 可选参数对象，key: value都为string类型
     * @description options - options列表:
     *  kv_business: 是否进行商业逻辑处理
     *      - true：进行商业逻辑处理
     *      - false：不进行商业逻辑处理，默认true
     * @return {Promise} - 标准Promise对象
     */
    insuranceDocumentsV1Url(url, options) {
        let param = {};

        param.url = url;
        param.targetPath = INSURANCE_DOCUMENTS_V1_PATH;
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 自定义模板文字识别接口-财会版
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/yk3h7y9u3
     */
    customFinance(image, options) {
        let param = {
            image: image,
            targetPath: CUSTOM_FINANCE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 自定义模板文字识别接口-财会版
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/yk3h7y9u3
     */
    customFinanceUrl(url, options) {
        let param = {
            url: url,
            targetPath: CUSTOM_FINANCE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 自定义模板文字识别接口-财会版
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/yk3h7y9u3
     */
    customFinancePdf(pdf_file, options) {
        let param = {
            pdf_file: pdf_file,
            targetPath: CUSTOM_FINANCE_PATH
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 公式识别接口
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Ok3h7xxva
     */
    formula(image, options) {
        let param = {
            image: image,
            targetPath: FORMULA
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 汽车票识别接口
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Kkblx01ww
     */
    busTicket(image) {
        let param = {
            image: image,
            targetPath: BUS_TICKET
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 汽车票识别接口
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Kkblx01ww
     */
    busTicketUrl(url) {
        let param = {
            url: url,
            targetPath: BUS_TICKET
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 过路过桥费发票识别接口
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/1kbpyx8js
     */
    tollInvoice(image) {
        let param = {
            image: image,
            targetPath: TOLL_INVOICE
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 过路过桥费发票识别接口
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/1kbpyx8js
     */
    tollInvoiceUrl(url) {
        let param = {
            url: url,
            targetPath: TOLL_INVOICE
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 多卡证类别检测接口
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/nkbq6wxxy
     */
    multiCardClassify(image) {
        let param = {
            image: image,
            targetPath: MULTI_CARD_CLASSIFY
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 多卡证类别检测接口
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/nkbq6wxxy
     */
    multiCardClassifyUrl(url) {
        let param = {
            url: url,
            targetPath: MULTI_CARD_CLASSIFY
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 智能结构化识别接口
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Qke3nkykj
     */
    intelligentOcr(image, options) {
        let param = {
            image: image,
            targetPath: INTELLIGENT_OCR
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 智能结构化识别接口
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Qke3nkykj
     */
    intelligentOcrUrl(url, options) {
        let param = {
            url: url,
            targetPath: INTELLIGENT_OCR
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 病案首页识别接口
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/1ke30k2s2
     */
    medicalRecord(image, options) {
        let param = {
            image: image,
            targetPath: MEDICAL_RECORD
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 病案首页识别接口
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/1ke30k2s2
     */
    medicalRecordUrl(url, options) {
        let param = {
            url: url,
            targetPath: MEDICAL_RECORD
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 医疗费用结算单识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Jke30ki7d
     */
    medicalStatement(image, options) {
        let param = {
            image: image,
            targetPath: MEDICAL_STATEMENT
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 医疗费用结算单识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Jke30ki7d
     */
    medicalStatementUrl(url, options) {
        let param = {
            url: url,
            targetPath: MEDICAL_STATEMENT
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 船票识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/nkmcwp3ne
     */
    ferryTicket(image) {
        let param = {
            image: image,
            targetPath: FERRY_TICKET
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 船票识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/nkmcwp3ne
     */
    ferryTicketUrl(url) {
        let param = {
            url: url,
            targetPath: FERRY_TICKET
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 二手车销售发票识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/8knr8rrj8
     */
    usedVehicleInvoice(image) {
        let param = {
            image: image,
            targetPath: USED_VEHICLE_INVOICE
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 二手车销售发票识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/8knr8rrj8
     */
    usedVehicleInvoiceUrl(url) {
        let param = {
            url: url,
            targetPath: USED_VEHICLE_INVOICE
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 身份证混贴识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/akp3gfbmc
     */
    multiIdcard(image, options) {
        let param = {
            image: image,
            targetPath: MULTI_IDCARD
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 身份证混贴识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/akp3gfbmc
     */
    multiIdcardUrl(url, options) {
        let param = {
            url: url,
            targetPath: MULTI_IDCARD
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 通信行程卡识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Nksg89dkc
     */
    travelCard(image) {
        let param = {
            image: image,
            targetPath: TRAVEL_CARD
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 健康码识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Ol52hedan
     */
    healthCode(image) {
        let param = {
            image: image,
            targetPath: HEALTH_CODE
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 核酸证明识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/nl56ibk44
     */
    covidTest(image) {
        let param = {
            image: image,
            targetPath: COVID_TEST
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 社保卡识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/lkto93055
     */
    socialSecurityCard(image) {
        let param = {
            image: image,
            targetPath: SOCIAL_SECURITY_CARD
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 社保卡识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/lkto93055
     */
    socialSecurityCardUrl(url) {
        let param = {
            url: url,
            targetPath: SOCIAL_SECURITY_CARD
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 医疗检验报告单识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Ekvakju92
     */
    medicalReportDetection(image, options) {
        let param = {
            image: image,
            targetPath: MEDICAL_REPORT_DETECTION
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 医疗检验报告单识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Ekvakju92
     */
    medicalReportDetectionUrl(url, options) {
        let param = {
            url: url,
            targetPath: MEDICAL_REPORT_DETECTION
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 医疗票据类别检测
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/zkvriu3sh
     */
    medicalReciptsClassify(image) {
        let param = {
            image: image,
            targetPath: MEDICAL_RECIPTS_CLASSIFY
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 医疗票据类别检测
     ** 参数详情参考：https://ai.baidu.com/ai-doc/OCR/zkvriu3sh
     */
    medicalReciptsClassifyUrl(url) {
        let param = {
            url: url,
            targetPath: MEDICAL_RECIPTS_CLASSIFY
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 快递面单识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Ekwkggqa5
     */
    waybill(image) {
        let param = {
            image: image,
            targetPath: WAYBILL
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 快递面单识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Ekwkggqa5
     */
    waybillUrl(url) {
        let param = {
            url: url,
            targetPath: WAYBILL
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 出院小结识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Wkwwy4y4q
     */
    medicalSummary(image, options) {
        let param = {
            image: image,
            targetPath: MEDICAL_SUMMARY
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 出院小结识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Wkwwy4y4q
     */
    medicalSummaryUrl(url, options) {
        let param = {
            url: url,
            targetPath: MEDICAL_SUMMARY
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 购物小票识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/3kwvk8y36
     */
    shoppingReceipt(image, options) {
        let param = {
            image: image,
            targetPath: SHOPPING_RECEIPT
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 购物小票识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/3kwvk8y36
     */
    shoppingReceiptUrl(url, options) {
        let param = {
            url: url,
            targetPath: SHOPPING_RECEIPT
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 购物小票识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/3kwvk8y36
     */
    shoppingReceiptPdf(pdf_file, options) {
        let param = {
            pdf_file: pdf_file,
            targetPath: SHOPPING_RECEIPT
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 道路运输证识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/ol07rjylw
     */
    roadTransportCertificate(image) {
        let param = {
            image: image,
            targetPath: ROAD_TRANSPORT_CERTIFICATE
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 道路运输证识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/ol07rjylw
     */
    roadTransportCertificateUrl(url) {
        let param = {
            url: url,
            targetPath: ROAD_TRANSPORT_CERTIFICATE
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 道路运输证识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/ol07rjylw
     */
    roadTransportCertificatePdf(pdf_file) {
        let param = {
            pdf_file: pdf_file,
            targetPath: ROAD_TRANSPORT_CERTIFICATE
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 表格文字识别V2
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Al1zvpylt
     */
    table(image, options) {
        let param = {
            image: image,
            targetPath: TABLE
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 表格文字识别V2
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Al1zvpylt
     */
    tableUrl(url, options) {
        let param = {
            url: url,
            targetPath: TABLE
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 表格文字识别V2
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Al1zvpylt
     */
    tablePdf(pdf_file, options) {
        let param = {
            pdf_file: pdf_file,
            targetPath: TABLE
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 文档去手写
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/il4tb1jay
     */
    removeHandwriting(image) {
        let param = {
            image: image,
            targetPath: REMOVE_HANDWRITING
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 文档去手写
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/il4tb1jay
     */
    removeHandwritingUrl(url) {
        let param = {
            url: url,
            targetPath: REMOVE_HANDWRITING
        };
        return this.commonImpl(objectTools.merge(param));
    }

    /**
     * 文档去手写
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/il4tb1jay
     */
    removeHandwritingPdf(pdf_file, options) {
        let param = {
            pdf_file: pdf_file,
            targetPath: REMOVE_HANDWRITING
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 文档矫正增强
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Hl4taza5f
     */
    docCropEnhance(image, options) {
        let param = {
            image: image,
            targetPath: DOC_CROP_ENHANCE
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 文档矫正增强
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Hl4taza5f
     */
    docCropEnhanceUrl(url, options) {
        let param = {
            url: url,
            targetPath: DOC_CROP_ENHANCE
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 文档矫正增强
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Hl4taza5f
     */
    docCropEnhancePdf(pdf_file, options) {
        let param = {
            pdf_file: pdf_file,
            targetPath: DOC_CROP_ENHANCE
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 处方笺识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Pl59exph0
     */
    medicalPrescription(image, options) {
        let param = {
            image: image,
            targetPath: MEDICAL_PRESCRIPTION
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 处方笺识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Pl59exph0
     */
    medicalPrescriptionUrl(url, options) {
        let param = {
            url: url,
            targetPath: MEDICAL_PRESCRIPTION
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 门诊病历识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/ll59eepzw
     */
    medicalOutpatient(image, options) {
        let param = {
            image: image,
            targetPath: MEDICAL_OUTPATIENT
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 门诊病历识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/ll59eepzw
     */
    medicalOutpatientUrl(url, options) {
        let param = {
            url: url,
            targetPath: MEDICAL_OUTPATIENT
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 诊断证明识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Dl59e3ohe
     */
    medicalSummaryDiagnosis(image, options) {
        let param = {
            image: image,
            targetPath: MEDICAL_SUMMARY_DIAGNOSIS
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 诊断证明识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Dl59e3ohe
     */
    medicalSummaryDiagnosisUrl(url, options) {
        let param = {
            url: url,
            targetPath: MEDICAL_SUMMARY_DIAGNOSIS
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 医疗诊断报告单识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/El59es47z
     */
    healthReport(image, options) {
        let param = {
            image: image,
            targetPath: HEALTH_REPORT
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 医疗诊断报告单识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/El59es47z
     */
    healthReportUrl(url, options) {
        let param = {
            url: url,
            targetPath: HEALTH_REPORT
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 图文转换器
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Elf3sp7cz
     */
    docConvertRequestV1(image, options) {
        let param = {
            image: image,
            targetPath: DOC_CONVERT_REQUEST
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 图文转换器
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Elf3sp7cz
     */
    docConvertRequestV1Url(url, options) {
        let param = {
            url: url,
            targetPath: DOC_CONVERT_REQUEST
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 图文转换器
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Elf3sp7cz
     */
    docConvertRequestV1Pdf(pdf, options) {
        let param = {
            pdf_file: pdf,
            targetPath: DOC_CONVERT_REQUEST
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 图文转换器获取任务结果
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Elf3sp7cz
     */
    docConvertResultV1(taskId, options) {
        let param = {
            task_id: taskId,
            targetPath: DOC_CONVERT_RESULT
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 车辆证照混贴识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Kksfsbngb
     */
    mixedMultiVehicle(image, options) {
        let param = {
            image: image,
            targetPath: MIXED_MULTI_VEHICLE
        };
        return this.commonImpl(objectTools.merge(param, options));
    }


    /**
     * 银行回单识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Plep1yzi9
     */
    bankReceiptNew(image, options) {
        let param = {
            image: image,
            targetPath: BANK_RECEIPT_NEW
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 银行回单识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Plep1yzi9
     */
    bankReceiptNewUrl(url, options) {
        let param = {
            url: url,
            targetPath: BANK_RECEIPT_NEW
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 银行回单识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Plep1yzi9
     */
    bankReceiptNewPdf(pdf, options) {
        let param = {
            pdf_file: pdf,
            targetPath: BANK_RECEIPT_NEW
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 结婚证识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Klg67mfkc
     */
    marriageCertificate(image, options) {
        let param = {
            image: image,
            targetPath: MARRIAGE_CERTIFICATE
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 结婚证识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Klg67mfkc
     */
    marriageCertificateUrl(url, options) {
        let param = {
            url: url,
            targetPath: MARRIAGE_CERTIFICATE
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 结婚证识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Klg67mfkc
     */
    marriageCertificatePdf(pdf, options) {
        let param = {
            pdf_file: pdf,
            targetPath: MARRIAGE_CERTIFICATE
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 港澳台证件识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Tlg6859ns
     */
    hkMacauTaiwanExitentrypermit(image, exitentrypermitType, options) {
        let param = {
            image: image,
            exitentrypermit_type: exitentrypermitType,
            targetPath: HK_MACAU_TAIWAN_EXITENTRYPERMIT
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 港澳台证件识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Tlg6859ns
     */
    hkMacauTaiwanExitentrypermitUrl(url, exitentrypermitType, options) {
        let param = {
            url: url,
            exitentrypermit_type: exitentrypermitType,
            targetPath: HK_MACAU_TAIWAN_EXITENTRYPERMIT
        };
        return this.commonImpl(objectTools.merge(param, options));
    }

    /**
     * 港澳台证件识别
     * 参数详情参考：https://ai.baidu.com/ai-doc/OCR/Tlg6859ns
     */
    hkMacauTaiwanExitentrypermitPdf(pdf, exitentrypermitType, options) {
        let param = {
            pdf_file: pdf,
            exitentrypermit_type: exitentrypermitType,
            targetPath: HK_MACAU_TAIWAN_EXITENTRYPERMIT
        };
        return this.commonImpl(objectTools.merge(param, options));
    }
}

module.exports = AipOcr;



