function FramePostman({
	element,
	info,
	token
}) {
	this.frameWin = element.contentWindow
	this.info = info
	this.token = token
	window.addEventListener('message', (e) => {
		if (e.data && e.data.type) {
			// 验证口令
			if (e.data.token !== this.token) {
				return
			}
			switch (e.data.type) {
				case 'common':
					this.callback(e.data.data, e)
					break
				case 'connect':
					postMessageAnyOrigin(this.frameWin, { type: 'connect_ok', info: this.info, token: this.token })
					break
			}
		}
	})
}

function postMessageAnyOrigin(win, msg) {
	win.postMessage(msg, '*')
}

FramePostman.prototype.send = function (message) {
	postMessageAnyOrigin(this.frameWin, { type: 'common', data: message, token: this.token })
}

FramePostman.prototype.listen = function (callback) {
	this.callback = callback
}

FramePostman.Sub = function (token) {
	this.topWin = window.top
	this.token = token
	window.addEventListener('message', (e) => {
		if (e.data && e.data.type) {
			// 验证口令
			if (e.data.token !== this.token) {
				return
			}
			switch (e.data.type) {
				case 'common':
					this.callback(e.data.data, e)
					break
				case 'connect_ok':
					this.resolve(e.data.info)
					break
			}
		}
	})
}

FramePostman.Sub.prototype.send = function (message) {
	postMessageAnyOrigin(this.topWin, { type: 'common', data: message, token: this.token })
}

FramePostman.Sub.prototype.connect = function (timeout = 5000) {
	postMessageAnyOrigin(this.topWin, { type: 'connect', token: this.token })
	return new Promise((resolve, reject) => {
		this.resolve = (value) => {
			resolve(value)
			this.resolve = null
		}
		setTimeout(() => {
			this.resolve = null
			reject({ msg: 'FramePostman: connect timeout' })
		}, timeout);
	})
}

FramePostman.Sub.prototype.listen = function (callback) {
	this.callback = callback
}