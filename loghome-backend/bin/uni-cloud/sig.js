const crypto = require('crypto')

class Sign {
	constructor (requestAuthSecret) {
		this.requestAuthSecret = requestAuthSecret
	}

	getSignature (params, nonce, timestamp) {
		const paramsStr = this.getParamsString(params)
		const signature = crypto.createHmac('sha256', `${this.requestAuthSecret}${nonce}`).update(`${timestamp}${paramsStr}`).digest('hex')

		return signature.toUpperCase()
	}

	getParamsString (params) {
		return Object.keys(params)
				.sort()
				.filter(item => typeof params[item] !== "object")
				.map(item => `${item}=${params[item]}`)
				.join('&')
	}
}

function getSignature(params){
    const requestAuthSecret = "abcdefgh"
    const nonce = Math.random().toString(36).substring(2)
    const timestamp = Date.now()
    
    
    const sign = new Sign(requestAuthSecret)
    const signature = sign.getSignature(params, nonce, timestamp)

    return {nonce, timestamp, signature}
}

module.exports = getSignature;
