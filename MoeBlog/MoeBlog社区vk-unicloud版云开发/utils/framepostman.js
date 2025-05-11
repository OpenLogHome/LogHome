function FramePostman({
	element,
	info
}) {
	this.frameWin = element.contentWindow
	this.info = info
	window.addEventListener('message', (e) => {
		if (e.data && e.data.type) {
			switch (e.data.type) {
				case 'common':
					this.callback(e.data.data, e)
					break
				case 'connect':
					postMessageAnyOrigin(this.frameWin, { type: 'connect_ok', info: this.info })
					break
			}
		}
	})
}

function postMessageAnyOrigin(win, msg) {
	win.postMessage(msg, '*')
}

FramePostman.prototype.send = function (message) {
	postMessageAnyOrigin(this.frameWin, { type: 'common', data: message })
}

FramePostman.prototype.listen = function (callback) {
	this.callback = callback
}

FramePostman.Sub = function () {
	this.topWin = window.top
	window.addEventListener('message', (e) => {
		if (e.data && e.data.type) {
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
	postMessageAnyOrigin(this.topWin, { type: 'common', data: message })
}

FramePostman.Sub.prototype.connect = function (timeout = 5000) {
	postMessageAnyOrigin(this.topWin, { type: 'connect' })
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


export {FramePostman};