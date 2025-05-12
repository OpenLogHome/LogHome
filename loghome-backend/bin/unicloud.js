const fetch = require('node-fetch');
const config = require('../config.js');
const crypto = require('crypto');

class UniCloud {
    constructor() {
        this.uniCloudUrl = config.uniCloudUrl;
    }

    // 生成UniCloud用户名
    static generateUsername(userId) {
        return "loghomeuser" + String(userId).replace("-", "_");
    }

    // 生成UniCloud密码（MD5）
    static generatePasswordMd5(password) {
        return crypto.createHash('md5').update(password).digest('hex').slice(0, 16);
    }

    async registerUser(username, password) {
        try {
            let requestOptions = {
                method: 'POST',
                redirect: 'follow'
            };
            let response = await fetch(this.uniCloudUrl + "/user/pub/register?username=" + username + "&password=" + password, requestOptions)
            let result = await response.json();
            if (result.code == 0) {
                return result;
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.log('error', error);
        }
    }

    /**
     * 用户登录
     * @param {String} username 用户名
     * @param {String} password 密码
     * @returns {Promise<Object>} 登录结果
     * @property {Number} code 错误码，0表示成功
     * @property {String} msg 详细信息
     * @property {String} token 登录成功之后返回的token信息
     * @property {String} tokenExpired token过期时间
     */
    async login(username, password) {
        try {
            let requestOptions = {
                method: 'POST',
                redirect: 'follow'
            };
            let response = await fetch(this.uniCloudUrl + "/user/pub/login?username=" + username + "&password=" + password, requestOptions);
            let result = await response.json();
            if (result.code == 0) {
                return result;
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.log('error', error);
            throw error;
        }
    }

    /**
     * 更新用户信息
     * @param {Object} userInfo 用户信息对象
     * @param {String} userInfo.nickname 用户昵称
     * @param {String} userInfo.avatar 用户头像URL
     * @param {String} userInfo.background 用户背景图URL
     * @param {String} userInfo.gxqm 用户个性签名
     * @param {Number} userInfo.gender 用户性别(0:男,1:女,2:未知)
     * @returns {Promise<Object>} 更新结果
     */
    async updateUserInfo(userInfo, token) {
        try {
            let requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "uni-id-token": token
                },
                body: JSON.stringify(userInfo),
                redirect: 'follow'
            };
            let response = await fetch(this.uniCloudUrl + "/client/user/kh/upList", requestOptions);
            let result = await response.json();
            if (result.code == 0) {
                return result;
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.log('error', error);
            throw error;
        }
    }
}

module.exports = UniCloud;