/**
 * 云存储文件上传模块
 */
import unicloud from './unicloud.js'
import aliyun from './aliyun.js'
import extStorage from './extStorage.js'
export default {
	unicloud, // 空间内置存储
	aliyun, // 阿里云官方oss
	extStorage, // 扩展存储
};