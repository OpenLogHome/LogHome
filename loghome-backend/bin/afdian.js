const fetch = require('node-fetch');
const crypto = require('crypto');

class AfdianAPI {
    constructor(userId, token) {
        this.userId = userId;
        this.token = token;
        this.baseUrl = 'https://afdian.com/api/open';
    }

    // 生成签名
    generateSign(params, timestamp) {
        const kvString = `params${params}ts${timestamp}user_id${this.userId}`;
        return crypto.createHash('md5').update(this.token + kvString).digest('hex');
    }

    // 查询订单
    async queryOrder(page = 1, perPage = 50, customOrderId = '') {
        const timestamp = Math.floor(Date.now() / 1000);
        const params = {
            page,
            per_page: perPage
        };

        if (customOrderId) {
            params.custom_order_id = customOrderId;
        }

        const paramsString = JSON.stringify(params);
        const sign = this.generateSign(paramsString, timestamp);

        const requestBody = {
            user_id: this.userId,
            params: paramsString,
            ts: timestamp,
            sign
        };

        try {
            const response = await fetch(`${this.baseUrl}/query-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('查询订单失败:', error);
            throw error;
        }
    }
}

module.exports = AfdianAPI; 