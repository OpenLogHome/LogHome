/*202203026*/
var jsBridge = function() {
	var n = !1,
		e = {
			isReady: function() {
				return !!window.WebViewJavascriptBridge
			},
			ready: function(n) {
				p(n)
			},
			audioPlayer: {
				play: function(n, e) {
					s("10.play", "object" == typeof n ? n : {}, "function" == typeof n ? n : e)
				},
				pause: function(n) {
					s("10.pause", {}, n)
				},
				resume: function(n) {
					s("10.resume", {}, n)
				},
				stop: function(n) {
					s("10.stop", {}, n)
				},
				add: function(n, e) {
					s("10.add", n, e)
				},
				list: function(n) {
					s("10.list", {}, n)
				},
				remove: function(n, e) {
					s("10.remove", n, e)
				},
				clear: function(n) {
					s("10.clear", {}, n)
				},
				setListener: function(n) {
					i("10.setListener", {}, function(e, t) {
						if (n && t) {
							var i = JSON.parse(t);
							n(i.event, i.data)
						}
					})
				},
				removeListener: function(n) {
					i("10.removeListener")
				}
			},
			audioRecorder: {
				startRecord: function(n, e) {
					s("9.startRecord", n, e)
				},
				stopRecord: function(n) {
					s("9.stopRecord", {}, n)
				},
				play: function(n) {
					s("9.play", {}, n)
				},
				pause: function(n) {
					s("9.pause", {}, n)
				},
				resume: function(n) {
					s("9.resume", {}, n)
				},
				stop: function(n) {
					s("9.stop", {}, n)
				},
				duration: function(n) {
					s("9.duration", {}, n)
				},
				read: function(n) {
					o("9.read", {}, n)
				},
				remove: function(n) {
					s("9.remove", {}, n)
				},
				upload: function(n, e) {
					s("9.upload", n, e)
				},
				setListener: function(n) {
					i("9.setListener", {}, function(e, t) {
						if (n && t) {
							var i = JSON.parse(t);
							n(i.event, i.data)
						}
					})
				},
				removeListener: function(n) {
					i("9.removeListener")
				}
			},
			umanalytics: {
				getDeviceInfo: function(n) {
					u("8.getDeviceInfo", {}, n)
				},
				onEvent: function(n, e) {
					s("8.onEvent", n, e)
				}
			},
			txVideo: {
				play: function(n) {
					i("7.play", "string" == typeof n ? {
						url: n
					} : n)
				},
				playList: function(n) {
					i("7.playList", n)
				},
				addPlayer: function(n, e) {
					n.e = "function" == typeof n.onEvent, i("7.addPlayer", n, function(t, i) {
						if (/^\d+$/.test(i)) e && e(parseInt(i));
						else if (n.e) {
							var o = JSON.parse(i);
							n.onEvent(o.p, o.e, o.d ? o.d : null)
						}
					})
				},
				removePlayer: function(n) {
					i("7.removePlayer", {
						p: n
					})
				}
			},
			network: {
				wifiInfo: function(n) {
					s("6.wifiInfo", {}, n)
				},
				active: function(n) {
					s("6.active", {}, n)
				},
				setConnectionListener: function(n) {
					u("6.scl", {}, n)
				}
			},
			ble: {
				getState: function(n) {
					a("5.getState", {}, n)
				},
				requestEnable: function(n) {
					r("5.requestEnable", {}, n)
				},
				getBondedDevices: function(n) {
					u("5.getBondedDevices", {}, n)
				},
				getName: function(n) {
					o("5.getName", {}, n)
				},
				getPeripheral: function(n) {
					u("5.getPeripheral", {}, n)
				},
				isScanning: function(n) {
					r("5.isScanning", {}, n)
				},
				isConnected: function(n, e) {
					r("5.isConnected", n, e)
				},
				scan: function(n) {
					s("5.scan", {}, n)
				},
				stopScan: function(n) {
					r("5.stopScan", {}, n)
				},
				connect: function(n, e) {
					i("5.connect", n, e)
				},
				disconnect: function(n, e) {
					i("5.disconnect", n, e)
				},
				discoverServices: function(n, e) {
					s("5.discoverServices", n, e)
				},
				discoverCharacteristics: function(n, e) {
					s("5.discoverCharacteristics", n, e)
				},
				discoverDescriptors: function(n, e) {
					s("5.discoverDescriptors", n, e)
				},
				setNotify: function(n, e) {
					s("5.setNotify", n, e)
				},
				read: function(n, e) {
					s("5.read", n, e)
				},
				write: function(n, e) {
					s("5.write", n, e)
				}
			},
			fs: {
				exist: function(n, e) {
					i("3.exist", {
						s: n
					}, e)
				},
				mkdir: function(n, e) {
					i("3.mkdir", {
						s: n
					}, e)
				},
				list: function(n, e) {
					s("3.list", {
						s: n
					}, e)
				},
				size: function(n, e) {
					i("3.size", {
						s: n
					}, function(n, t) {
						"function" == typeof e && e(n, n ? parseInt(t) : t)
					})
				},
				delete: function(n, e) {
					i("3.delete", {
						s: n
					}, e)
				},
				copy: function(n, e, t) {
					i("3.copy", {
						s: n,
						d: e
					}, t)
				},
				writeText: function(n, e, t) {
					i("3.writeText", {
						s: n,
						a: e
					}, t)
				},
				appendText: function(n, e, t) {
					i("3.appendText", {
						s: n,
						a: e
					}, t)
				},
				readText: function(n, e) {
					i("3.readText", {
						s: n
					}, e)
				},
				writeBinary: function(n, e, t) {
					i("3.writeBinary", {
						s: n,
						a: e
					}, t)
				},
				appendBinary: function(n, e, t) {
					i("3.appendBinary", {
						s: n,
						a: e
					}, t)
				},
				readBinary: function(n, e) {
					i("3.readBinary", {
						s: n
					}, e)
				},
				toUri: function(n, e) {
					i("3.toUri", {
						s: n
					}, e)
				},
				toAbsolute: function(n, e) {
					i("3.toAbsolute", {
						s: n
					}, e)
				},
				share: function(n, e) {
					i("3.share", {
						s: n
					}, e)
				},
				open: function(n, e) {
					i("3.open", {
						s: n
					}, e)
				},
				unzip: function(n, e, t) {
					i("3.unzip", {
						s: n,
						d: e
					}, t)
				},
				md5: function(n, e) {
					i("3.md5", {
						s: n
					}, e)
				},
				sha1: function(n, e) {
					i("3.sha1", {
						s: n
					}, e)
				},
				sha256: function(n, e) {
					i("3.sha256", {
						s: n
					}, e)
				},
				download: function(n, e) {
					o("3.download", n, function(t) {
						var i = JSON.parse(t);
						0 == i.a ? "function" == typeof n.progress && n.progress(i.t, i.d) :
							"function" == typeof e && e(1 == i.a, i.m)
					})
				}
			},
			db: {
				tables: function(n) {
					s("4.tables", {}, n)
				},
				execSQL: function(n, e, t) {
					s("4.execSQL", {
						s: n,
						a: e
					}, t)
				},
				query: function(n, e, t) {
					s("4.query", {
						s: n,
						a: e
					}, t)
				}
			},
			rc: {
				init: function(n, e) {
					r("s.init", n, e)
				},
				setUserInfoListener: function(n) {
					o("s.setUserInfoListener", {}, n)
				},
				setUserInfo: function(n) {
					i("s.setUserInfo", n, null)
				},
				connect: function(n, e) {
					i("s.connect", n, e)
				},
				disconnect: function(n) {
					r("s.disconnect", {}, n)
				},
				logout: function(n) {
					r("s.logout", {}, n)
				}
			},
			rcIM: {
				startConversationList: function(n, e) {
					r("q.startConversationList", n, e)
				},
				startConversation: function(n, e) {
					r("q.startConversation", n, e)
				},
				startSubConversationList: function(n, e) {
					r("q.startSubConversationList", n, e)
				},
				unreadMessageCount: function(n) {
					a("q.unreadMessageCount", {}, n)
				}
			},
			rcCall: {
				startSingleCall: function(n, e) {
					r("r.startSingleCall", n, e)
				},
				startMultiCall: function(n, e) {
					r("r.startMultiCall", n, e)
				}
			},
			video: {
				play: function(n) {
					i("x.play", "string" == typeof n ? {
						url: n
					} : n)
				},
				addPlayer: function(n, e) {
					n.e = "function" == typeof n.onEvent, i("x.addPlayer", n, function(t, i) {
						if (/^\d+$/.test(i)) e && e(parseInt(i));
						else if (n.e) {
							var o = JSON.parse(i);
							n.onEvent(o.p, o.e, o.d ? o.d : null)
						}
					})
				},
				removePlayer: function(n) {
					i("x.removePlayer", {
						p: n
					})
				},
				resource: function(n) {
					i("x.resource", n)
				},
				start: function(n) {
					i("x.start", {
						p: n
					})
				},
				pause: function(n) {
					i("x.pause", {
						p: n
					})
				},
				stop: function(n) {
					i("x.stop", {
						p: n
					})
				},
				fullScreen: function(n) {
					i("x.fullScreen", {
						p: n
					})
				}
			},
			displays: {
				getDisplays: function(n) {
					u("z.getDisplays", {}, n)
				},
				show: function(n, e) {
					r("z.show", n, e)
				},
				dismiss: function(n) {
					i("z.dismiss", {
						x: n
					})
				}
			},
			iap: {
				canMakePayments: function(n) {
					r("i.canMakePayments", {}, n)
				},
				getProducts: function(n, e) {
					s("i.getProducts", n, e)
				},
				setTransanctionListener: function(n) {
					s("i.setTransanctionListener", {}, n)
				},
				getUnfinishedTransactions: function() {
					s("i.getUnfinishedTransactions", {})
				},
				purchase: function(n) {
					s("i.purchase", n)
				},
				restoreTransactions: function(n) {
					s("i.restoreTransactions", n)
				},
				finishTransaction: function(n) {
					i("i.finishTransaction", n)
				},
				setDownloadListener: function(n) {
					s("i.setDownloadListener", {}, n)
				},
				startDownloads: function(n) {
					s("i.startDownloads", n)
				},
				pauseDownloads: function(n) {
					i("i.pauseDownloads", n)
				},
				resumeDownloads: function(n) {
					i("i.resumeDownloads", n)
				},
				cancelDownloads: function(n) {
					i("i.cancelDownloads", n)
				}
			},
			doc: {
				canOpen: function(n, e) {
					r("c.canOpen", {
						url: n
					}, e)
				},
				open: function(n) {
					i("c.open", n)
				}
			},
			bdloc: {
				getCurrentPosition: function(n, e) {
					u("a.getCurrentPosition", n, e)
				},
				stop: function() {
					i("a.stop")
				}
			},
			bdface: {
				config: function(n) {
					i("y.config", n)
				},
				detect: function(n, e) {
					u("y.detect", n, e)
				},
				liveness: function(n, e) {
					u("y.liveness", n, e)
				}
			},
			bc: {
				login: function(n) {
					i("b.login", {}, n)
				},
				logout: function(n) {
					i("b.logout", {}, n)
				},
				setShouldUseAlipay: function(n) {
					i("b.setShouldUseAlipay", {
						b: n
					})
				},
				setSyncForTaoke: function(n) {
					i("b.setSyncForTaoke", {
						b: n
					})
				},
				setForceH5: function(n) {
					i("b.setForceH5", {
						b: n
					})
				},
				setTaokeParams: function(n) {
					i("b.setTaokeParams", n)
				},
				setChannel: function(n) {
					i("b.setChannel", n)
				},
				setISVCode: function(n) {
					i("b.setISVCode", {
						s: n
					})
				},
				setISVVersion: function(n) {
					i("b.setISVVersion", {
						s: n
					})
				},
				detail: function(n, e) {
					i("b.detail", n, e)
				},
				shop: function(n, e) {
					i("b.shop", n, e)
				},
				url: function(n, e) {
					i("b.url", n, e)
				},
				addCart: function(n, e) {
					i("b.addCart", n, e)
				},
				cart: function(n, e) {
					i("b.cart", n, e)
				},
				order: function(n, e) {
					i("b.order", n, e)
				}
			},
			getui: {
				setListener: function(n) {
					u("g.setListener", {}, n)
				},
				turnOffPush: function() {
					i("g.turnOffPush")
				},
				turnOnPush: function() {
					i("g.turnOnPush")
				},
				setBadge: function(n, e) {
					r("g.setBadge", n, e)
				},
				isPushTurnedOn: function(n) {
					r("g.isPushTurnedOn", {}, n)
				},
				getClientid: function(n) {
					o("g.getClientid", {}, n)
				},
				bindAlias: function(n, e) {
					r("g.bindAlias", {
						alias: n
					}, e)
				},
				unBindAlias: function(n, e) {
					r("g.unBindAlias", n, e)
				},
				setTag: function(n, e) {
					r("g.setTag", {
						tags: n
					}, e)
				},
				setSilentTime: function(n, e) {
					r("g.setSilentTime", n, e)
				}
			},
			jiguang: {
				setListener: function(n) {
					u("j.setListener", {}, n)
				},
				stopPush: function() {
					i("j.stopPush")
				},
				resumePush: function() {
					i("j.resumePush")
				},
				isPushStopped: function(n) {
					r("j.isPushStopped", {}, n)
				},
				getRegistrationID: function(n) {
					o("j.getRegistrationID", {}, n)
				},
				setAlias: function(n, e) {
					o("j.setAlias", {
						alias: n
					}, e)
				},
				deleteAlias: function(n) {
					o("j.deleteAlias", {}, n)
				},
				getAlias: function(n) {
					o("j.getAlias", {}, n)
				},
				setBadge: function(n) {
					i("j.setBadge", {
						b: n
					})
				},
				setTags: function(n, e) {
					u("j.setTags", {
						tags: n
					}, e)
				},
				addTags: function(n, e) {
					u("j.addTags", {
						tags: n
					}, e)
				},
				deleteTags: function(n, e) {
					u("j.deleteTags", {
						tags: n
					}, e)
				},
				cleanTags: function(n) {
					u("j.cleanTags", {}, n)
				},
				getAllTags: function(n) {
					u("j.getAllTags", {}, n)
				}
			},
			notification: {
				getBadge: function(n) {
					o("n.getBadge", {}, function(e) {
						n && n(parseInt(e))
					})
				},
				setBadge: function(n) {
					i("n.setBadge", {
						badge: n
					})
				},
				requestAuth: function(n) {
					r("n.requestAuth", {}, n)
				},
				notify: function(n, e) {
					s("n.notify", n, e)
				},
				cancelAll: function() {
					i("n.cancelAll")
				}
			},
			x5: {
				videoCacheSize: function(n) {
					e.ios ? n && n(0) : i("x5.videoCacheSize", {}, function(e, t) {
						n && n(e && t ? parseInt(t) : 0)
					})
				},
				clearVideoCache: function(n) {
					e.ios ? n && n() : o("x5.clearVideoCache", {}, n)
				},
				playVideo: function(n, t) {
					e.ios ? t && t(!1) : r("x5.playVideo", {
						url: n
					}, t)
				},
				getEnabledState: function(n) {
					e.ios ? n && n(-1) : a("x5.getEnabledState", {}, n)
				},
				setEnabledState: function(n, t) {
					e.ios ? t && t(!1) : r("x5.setEnabledState", {
						s: n
					}, t)
				}
			},
			weibo: {
				login: function(n) {
					i("w.login", {}, function(e, t) {
						var i = t ? JSON.parse(t) : null;
						if ("function" == typeof n) n(e, i);
						else if (e && "string" == typeof n) {
							var o = n + (n.indexOf("?") >= 0 ? "&" : "?") + "uid=" + encodeURIComponent(
									i.uid) + "&expiresTime=" + encodeURIComponent(i.expiresTime) +
								"&phoneNum=" + encodeURIComponent(i.phoneNum) + "&refreshToken=" +
								encodeURIComponent(i.refreshToken) + "&token=" + encodeURIComponent(i
									.token);
							location.href = o
						}
					})
				},
				installed: function(n) {
					r("w.installed", {}, n)
				},
				shareText: function(n, e) {
					t(n, e)
				},
				shareImage: function(n, e) {
					t(n, e, "i")
				},
				shareVideo: function(n, e) {
					t(n, e, "v")
				},
				shareWebPage: function(n, e) {
					t(n, e, "w")
				},
				shareImages: function(n, e) {
					t(n, e, "j")
				},
				shareStory: function(n, e) {
					t(n, e, "s")
				}
			},
			accelerometer: {
				support: function(n) {
					r("sa.support", {}, n)
				},
				start: function(n) {
					i("sa.start", {}, n ? function(e, t) {
						if (e && t) {
							var i = JSON.parse(t);
							n(i[0], i[1], i[2])
						}
					} : null)
				},
				stop: function(n) {
					i("sa.stop")
				}
			},
			gyroscope: {
				support: function(n) {
					r("sg.support", {}, n)
				},
				start: function(n) {
					i("sg.start", {}, n ? function(e, t) {
						if (e && t) {
							var i = JSON.parse(t);
							n(i[0], i[1], i[2])
						}
					} : null)
				},
				stop: function(n) {
					i("sg.stop")
				}
			},
			sidebarIsOpen: function(n) {
				r("sidebarIsOpen", {}, n)
			},
			sidebarOpen: function() {
				i("sidebarOpen")
			},
			sidebarClose: function() {
				i("sidebarClose")
			},
			sidebarHeader: function(n) {
				i("sidebarHeader", n)
			},
			captureWebPage: function(n) {
				i("captureWebPage", n)
			},
			checkCamera: function(n) {
				e.ios ? n && n({
					count: 2,
					front: !0,
					back: !0
				}) : u("checkCamera", {}, n)
			},
			appSettings: function() {
				i("appSettings")
			},
			appDownloads: function() {
				e.ios || i("appDownloads")
			},
			appList: function(n, e) {
				u("31.appList", n, e)
			},
			callLog: function(n, e) {
				s("33.callLog", n, e)
			},
			appInfo: function(n) {
				u("appInfo", {}, n)
			},
			deviceInfo: function(n) {
				u("deviceInfo", {}, n)
			},
			openSetting: function(n) {
				i("openSetting", {
					w: n
				})
			},
			getSettingState: function(n, e) {
				r("getSettingState", {
					w: n
				}, e)
			},
			getIMEI: function(n) {
				e.ios ? n && n("unknown") : o("1.imei", {}, n)
			},
			getOAID: function(n) {
				e.ios ? n && n("unknown") : o("1.oaid", {}, n)
			},
			getIDFA: function(n) {
				e.ios ? o("1.idfa", {}, n) : n && n("unknown")
			},
			agreement: function(n) {
				i("2.agreement", {}, n)
			},
			userAgreement: function() {
				i("2.userAgreement")
			},
			userPrivacy: function() {
				i("2.userPrivacy")
			},
			agreed: function(n, e) {
				"function" == typeof n ? i("2.agreed", {}, n) : i("2.agreed", n, e)
			},
			requestPermissions: function(n, e) {
				u("requestPermissions", {
					p: n
				}, e)
			},
			action: function(n) {
				i("action", n ? {
					btns: n
				} : {}, null)
			},
			uiNavigation: function(n) {
				i("uiNavigation", {
					b: n
				})
			},
			uiShare: function(n) {
				i("uiShare", {
					b: n
				})
			},
			uiActions: function(n) {
				i("uiActions", {
					b: n
				})
			},
			uiRefresh: function(n) {
				i("uiRefresh", {
					b: n
				})
			},
			showImages: function(n) {
				i("showImages", n)
			},
			saveImageToAlbum: function(n, e) {
				r("saveImageToAlbum", {
					i: n
				}, e)
			},
			saveImagesToAlbum: function(n, e) {
				r("saveImagesToAlbum", {
					i: n
				}, e)
			},
			saveScreenshotToAlbum: function(n) {
				r("saveScreenshotToAlbum", {}, n)
			},
			saveVideoToAlbum: function(n, e) {
				r("saveVideoToAlbum", {
					i: n
				}, e)
			},
			canGoBack: function(n) {
				r("canGoBack", {}, n)
			},
			canGoForward: function(n) {
				r("canGoForward", {}, n)
			},
			backToHome: function(n) {
				i("backToHome", {
					loadHomePage: !!n
				})
			},
			contactOne: function(n) {
				u("contactOne", {}, n)
			},
			contactAll: function(n) {
				u("contactAll", {}, n)
			},
			setClipboardText: function(n) {
				i("setClipboardText", {
					text: n
				})
			},
			getClipboardText: function(n) {
				o("getClipboardText", {}, n)
			},
			debug: function() {
				i("debug", {}), n = !0
			},
			qqLogin: function(n) {
				n ? i("qqLogin", {}, function(e, t) {
					if ("function" == typeof n) n(e, t ? JSON.parse(t) : null);
					else if (e && "string" == typeof n) {
						var i = JSON.parse(t),
							o = n + (n.indexOf("?") >= 0 ? "&" : "?") + "openid=" + encodeURIComponent(i
								.openid) + "&access_token=" + encodeURIComponent(i.access_token);
						i.userinfo && (o += "&userinfo=" + JSON.stringify(i.userinfo)), location.href =
							o
					}
				}) : alert("Missing Parameter")
			},
			wxLogin: function(n) {
				n ? i("wxLogin", {}, function(e, t) {
					if ("function" == typeof n) n(e, t ? JSON.parse(t) : null);
					else if (e && "string" == typeof n) {
						var i = JSON.parse(t),
							o = n + (n.indexOf("?") >= 0 ? "&" : "?") + "code=" + encodeURIComponent(i
								.code);
						i.openid && (o += "&openid=" + encodeURIComponent(i.openid)), i.access_token &&
							(o += "&access_token=" + encodeURIComponent(i.access_token)), i.userinfo &&
							(o += "&userinfo=" + JSON.stringify(i.userinfo)), location.href = o
					}
				}) : alert("Missing Parameter")
			},
			wxSubscribeMsg: function(n, e) {
				s("wxSubscribeMsg", n, e)
			},
			wxLaunchMiniProgram: function(n, e) {
				s("wxLaunchMiniProgram", n, e)
			},
			wxOpenCustomerServiceChat: function(n, e) {
				s("wxOpenCustomerServiceChat", n, e)
			},
			wxAppInstalled: function(n) {
				r("wxAppInstalled", {}, n)
			},
			pay: function(n, e) {
				i("pay", n, e)
			},
			wxPay: function(n, e) {
				i("wxPay", n, e)
			},
			aliPay: function(n, e) {
				i("aliPay", n, e)
			},
			unionPay: function(n, e) {
				i("v.pay", n, e)
			},
			unionSeInfo: function(n) {
				e.ios ? "function" == typeof n && n(!1, "not supported") : i("v.seInfo", {}, n)
			},
			unionPayAppInstalled: function(n) {
				r("v.unionPayAppInstalled", {}, n)
			},
			abcPay: function(n, e) {
				i("u.abcPay", n, e)
			},
			abcPayAppInstalled: function(n) {
				r("u.abcPayAppInstalled", {}, n)
			},
			icbcPay: function(n, e) {
				i("0.icbcPay", n, e)
			},
			net: function(n, e) {
				i("net", n, function(n, t) {
					var i = JSON.parse(t);
					e && "function" == typeof e && e(1 == i.a, i.b)
				})
			},
			netUploadFile: function(n) {
				i("netUploadFile", n, function(e, t) {
					var i = JSON.parse(t);
					0 == i.a && "function" == typeof n.onProgress && n.onProgress(i.b, i, c), 1 == i
						.a && "function" == typeof n.onSuccess && n.onSuccess(i.b), 2 == i.a &&
						"function" == typeof n.onFail && n.onFail(i.b)
				})
			},
			http: {
				get: function(n, t, i) {
					var o = {
						url: n,
						method: "GET"
					};
					t && "object" == typeof t && (o.params = t), e.net(o, function(n, e) {
						if (n) {
							var o = "function" == typeof t ? t : "function" == typeof i ? i : null;
							o && o(JSON.parse(e))
						}
					})
				},
				post: function(n, t, i) {
					var o = {
						url: n,
						method: "POST"
					};
					t && "object" == typeof t && (o.params = t), e.net(o, function(n, e) {
						if (n) {
							var o = "function" == typeof t ? t : "function" == typeof i ? i : null;
							o && o(JSON.parse(e))
						}
					})
				}
			},
			share: function(n, e) {
				i("share", n, e)
			},
			shareText: function(n, e) {
				i("shareText", n, e)
			},
			shareImage: function(n, e) {
				i("shareImage", n, e)
			},
			shareMusic: function(n, e) {
				i("shareMusic", n, e)
			},
			shareVideo: function(n, e) {
				i("shareVideo", n, e)
			},
			shareWxMiniProgram: function(n, e) {
				i("shareWxMiniProgram", n, e)
			},
			shareQqMiniProgram: function(n, e) {
				i("shareQqMiniProgram", n, e)
			},
			shareImages: function(n, e) {
				i("shareImages", n, e)
			},
			scan: function(n, e) {
				o("scan", n, e)
			},
			onMenuScan: function(n) {
				f("onMenuScan", function(t) {
					e.scan({
						needResult: !0
					}, n)
				})
			},
			scanFromAlbum: function(n, e) {
				o("scanFromAlbum", n, e)
			},
			scanFromUrl: function(n, e) {
				o("scanFromUrl", n, e)
			},
			cacheSize: function(n) {
				i("cacheSize", {}, function(e, t) {
					n && n(e && t ? parseInt(t) : 0)
				})
			},
			clearCache: function(n) {
				o("clearCache", {}, n)
			},
			clearCookie: function() {
				i("clearCookie")
			},
			vibrate: function() {
				i("vibrate")
			},
			onAppEnterBackground: function(n) {
				i("onAppEnterBackground", {}, n)
			},
			onAppEnterForeground: function(n) {
				i("onAppEnterForeground", {}, n)
			},
			toast: function(n) {
				i("toast", {
					s: "string" == typeof n ? n : JSON.stringify(n)
				})
			},
			progress: function(n) {
				i("progress", n)
			},
			print: function(n, e) {
				i("print", n, e)
			},
			exit: function(n) {
				i("exit", {
					k: !!n
				})
			},
			upgrade: function(n) {
				i("upgrade", n, function(e, t) {
					if (n && "function" == typeof n.progress && t) {
						var i = JSON.parse(t);
						n.progress(i.a, i.b)
					}
				})
			},
			restart: function() {
				i("restart")
			},
			home: function() {
				e.ios ? e.exit() : i("home")
			},
			openInBrowser: function(n) {
				i("openInBrowser", {
					s: n
				})
			},
			miniProgram: function(n) {
				o("miniProgram", n, function(e) {
					"function" == typeof n.onResult && n.onResult(e)
				})
			},
			setMiniProgramResult: function(n) {
				i("setMiniProgramResult", {
					r: "string" != typeof n ? JSON.stringify(n) : n
				})
			},
			open: function(n) {
				i("open", "string" == typeof n ? {
					url: n
				} : n)
			},
			setOptions: function(n) {
				i("setOptions", n)
			},
			close: function(n) {
				e.version > 35 && e.isRoot || i("close", n ? {
					f: n
				} : {})
			},
			evalInNavbar: function(n) {
				i("evalInNavbar", {
					j: n
				})
			},
			evalInNavbarAction: function(n, t) {
				e.evalInNavbar("action(" + JSON.stringify({
					action: n,
					data: t
				}) + ")")
			},
			evalInToolbar: function(n) {
				i("evalInToolbar", {
					j: n
				})
			},
			launch: function(n, e) {
				"string" == typeof n ? r("launch", {
					a: n
				}, e) : a("launch", {
					b: n
				}, e)
			},
			canLaunch: function(n, e) {
				r("canLaunch", {
					u: n
				}, e)
			},
			launchPackage: function(n, e) {
				r("launchPackage", {
					s: n
				}, e)
			},
			deviceOwnerAuth: function(n, e) {
				r("d.deviceOwnerAuth", n, e)
			},
			deviceOwnerAuthAvailable: function(n) {
				r("d.deviceOwnerAuthAvailable", {}, n)
			},
			getInstallId: function(n) {
				o("getInstallId", {}, n)
			},
			getDeviceId: function(n) {
				o("getDeviceId", {}, n)
			},
			onMenuAction: function(n) {
				f("onMenuAction", function(t) {
					e.action(n)
				})
			},
			onClose: function(n) {
				f("onClose", n)
			},
			onBackPressed: function(n) {
				f("onBackPressed", n)
			},
			onMenuShareTimeline: function(n) {
				l("onMenuShareTimeline", 0, n)
			},
			onMenuShareFriend: function(n) {
				l("onMenuShareFriend", 1, n)
			},
			onMenuShareQQ: function(n) {
				l("onMenuShareQQ", 2, n)
			},
			onMenuShareQZone: function(n) {
				l("onMenuShareQZone", 3, n)
			}
		};

	function t(n, e, t) {
		n = n || {};
		var i = {};
		t && (i[t] = n), n.text && (i.text = n.text), o("w.share", i, e)
	}

	function i(e, t, o) {
		d() ? (n && alert("js call\n\nname:" + e + "\noptions:" + JSON.stringify(t)), window.WebViewJavascriptBridge
			.callHandler(e, t || {}, function(e) {
				if (n && alert("js back\n\n" + e), o && "function" == typeof o) {
					var t = JSON.parse(e);
					o(!!t.success, t.text)
				}
			})) : p(function() {
			i(e, t, o)
		})
	}

	function o(n, e, t) {
		i(n, e, t ? function(n, e) {
			t && t(e)
		} : null)
	}

	function a(n, e, t) {
		i(n, e, t ? function(n, e) {
			t && t(parseInt(e))
		} : null)
	}

	function r(n, e, t) {
		i(n, e, t ? function(n, e) {
			t && t("true" == e)
		} : null)
	}

	function s(n, e, t) {
		i(n, e, t ? function(n, e) {
			t && t(n, e ? JSON.parse(e) : null)
		} : null)
	}

	function u(n, e, t) {
		i(n, e, t ? function(n, e) {
			t && t(e ? JSON.parse(e) : null)
		} : null)
	}

	function f(n, e) {
		d() ? window.WebViewJavascriptBridge.registerHandler(n, function(n, t) {
			var i = {
				ok: !0
			};
			if (e) {
				var o = e(n);
				null != o && (i.data = o)
			}
			t(i)
		}) : p(function() {
			f(n, e)
		})
	}

	function d() {
		return e.inApp || console.log("jsBridge can only used in App"), !!e.isReady() || (console.log(
			"jsBridge is not ready\nUsage:\njsBridge.ready(function(){\n  //do something\n});"), !1)
	}

	function l(n, t, i) {
		f(n, function(n) {
			"function" == typeof i ? i() : (i = i || {}, e.share({
				to: t,
				title: i.title || document.title,
				link: i.link || location.href,
				imgUrl: i.imgUrl || "",
				desc: i.desc || ""
			}, function(n) {
				n && i.success && i.success(), n || i.cancel && i.cancel()
			}))
		})
	}

	function p(n) {
		if (window.WebViewJavascriptBridge) return n(WebViewJavascriptBridge);
		if (window.WVJBCallbacks) return window.WVJBCallbacks.push(n);
		window.WVJBCallbacks = [n];
		var e = document.createElement("iframe");
		e.style.display = "none", e.src = "wvjbscheme://__BRIDGE_LOADED__";
		var t = document.body ? document.body : document.documentElement;
		t.appendChild(e), setTimeout(function() {
			t.removeChild(e)
		}, 3e3)
	}
	Object.defineProperty(e, "zqprinter", {
		configurable: !1,
		writable: !1,
		value: function() {
			for (var n =
					"SDK_Version|Prn_GetPortList|Prn_Connect|Prn_Disconnect|Prn_PrinterInit|Prn_Status|Prn_PowerStatus|Prn_PrintText|Prn_PrintEscText|Prn_PrintString|Prn_PrintBarcode|Prn_PrintQRCode|Prn_PrintBitmap|Prn_PrintBmp|Prn_CutPaper|Prn_OpenCashbox|Prn_LineFeed|Prn_MarkFeed|Prn_SetCharacterSet|Prn_SetInterCharacterSet|Prn_SetLineSpacing|Prn_SetFontStyle|Prn_SetFontSize|Prn_SetAlignment|Prn_SendData|Prn_ReadData|Prn_BeginTransaction|Prn_EndTransaction|Prn_GetMsrTrack"
					.split("|"), e = {}, t = 0; t < n.length; t++) {
				var i = n[t];
				e[i] = function(n) {
					return function(e, t) {
						o("zq." + n, e, t)
					}
				}(i)
			}
			return e
		}()
	});
	for (var g = [{
			f: "wxOpenLaunchAppExtinfo"
		}, {
			i: 21,
			f: "alipayLogin"
		}, {
			i: 11,
			n: "ttStat",
			f: "init|eventRegister|eventPurchase|eventAccessAccount|eventAccessPaymentChannel|eventAddCart|eventAddToFavorite|eventCheckOut|eventCreateGameRole|eventLogin|eventUpdateLevel|eventQuest|eventViewContent|eventV3|setUserUniqueID"
		}, {
			i: 12,
			n: "ttAd",
			f: "init|bannerExpressAd|interactionExpressAd|rewardVideoAd|fullScreenVideoAd|interactionAd2",
			e: 1,
			r: 1
		}, {
			i: 13,
			n: "xlx",
			f: "init|refreshMediaUserId|refreshAppSecret|open"
		}, {
			i: 14,
			n: "hyAd",
			f: "init|openMotivateVideoAd",
			e: 1,
			r: 1
		}, {
			i: 15,
			n: "fm",
			f: "rewardVideoAd",
			e: 1,
			r: 1
		}, {
			i: 16,
			n: "hx",
			f: "init|rewardVideoAD|fullscreenVideoAD|interstitialAD|nativeAD|isAdOpen|gameList",
			e: 1,
			r: 1
		}, {
			i: 17,
			n: "yuemeng",
			f: "openReader|setOutUserId"
		}, {
			i: 18,
			n: "trtc",
			f: "enterRoom|exitRoom|switchRole|startSpeedTest|stopSpeedTest|getSDKVersion",
			e: 1,
			r: 1
		}, {
			i: 19,
			n: "leto",
			f: "syncUserInfo|jumpMiniGame|startGameCenter",
			e: 1,
			r: 1
		}, {
			i: 20,
			n: "yhad",
			f: "rewardAdvert",
			e: 1,
			r: 1
		}, {
			i: 22,
			n: "dyad",
			f: "jumpAdList|jumpAdDetail|jumpMine"
		}, {
			i: 23,
			n: "mid",
			f: "init|commonTask|weChatTask|cplTask|newsTask|novelTask|uiPreference|rewardVideo",
			e: 1,
			r: 1
		}, {
			i: 24,
			n: "xw",
			f: "jumpToList|jumpToDetail"
		}, {
			i: 25,
			n: "yilan",
			f: "init|shortVideo|littleTiktokVideo|littleKuaishouVideo|play|login|logout|getToken",
			e: 1,
			r: 1
		}, {
			i: 26,
			n: "nfc",
			f: "isSupported|isEnabled|openSettings|enableForegroundDispatch|disableForegroundDispatch|writeNdefUri|writeNdefText|writeNdefMime|cancelWriteNdef|makeReadOnlyNdef|cancelMakeReadOnlyNdef|writeMifareUltralightPage|cancelWriteMifareUltralightPage|transceiveMifareUltralight|cancelTransceiveMifareUltralight",
			e: 1,
			r: 1
		}, {
			i: 27,
			n: "pcg",
			f: "load|loadDetail"
		}, {
			i: 28,
			n: "bh",
			f: "rewardVideo|fullVideo|interactionAd|nativeAd",
			e: 1,
			r: 1
		}, {
			i: 29,
			n: "xprinter",
			f: "init|connectBtPort|connectNetPort|connectUsbPort|disconnectCurrentPort|disconnetNetPort|checkLinkedState|getBtAvailableDevice|onDiscovery|writeDataByUSB|writeSendData|write|writeTSC|writePos58|writePos76|writePos80",
			e: 1,
			r: 1
		}, {
			i: 30,
			n: "sms",
			f: "list",
			e: 1,
			r: 1
		}, {
			i: 32,
			n: "bm",
			f: "config|rewardVideoAd|interstitialAd|bannerAd|feedVideo|hVideo|interactive|cpa|setUserId",
			e: 1,
			r: 1
		}, {
			i: 34,
			n: "dlna",
			f: "search|videoResource|audioResource|imageResource|play|pause|stop|seek|devices|mediaInfo|positionInfo"
		}, {
			i: 35,
			n: "qmf",
			f: "wxPay|aliPay|unionPay|pay|seInfo|unionPayAppInstalled"
		}, {
			i: 36,
			n: "wch",
			f: "info"
		}, {
			i: 37,
			n: "push",
			f: "getPushId|getDeviceToken|bindTag|bindAlias|isOnline",
			e: 1,
			r: 1
		}, {
			i: 38,
			n: "cncb",
			f: "pay"
		}, {
			i: 39,
			n: "gdtAction",
			f: "logAction|setUserUniqueId|onRegister|onLogin|onBindAccount|onQuestFinish|onCreateRole|onUpdateLevel|onShare|onRateApp|onViewContent|onAddToCart|onCheckout|onPurchase|onAddPaymentChannel"
		}, {
			i: 40,
			n: "netum",
			f: "setMode|getBlueToothList|connectSppBlueTooth|sendCommand",
			e: 1,
			r: 1
		}, {
			i: 41,
			n: "fusion",
			f: "setUserId|bannerAd|interactionAd|rewardVideoAd",
			e: 1,
			r: 1
		}, {
			i: 42,
			n: "game321",
			f: "platformLogin|openSuit",
			e: 1,
			r: 1
		}, {
			i: 43,
			n: "gdt",
			f: "setChannel|interaction|interactionFullScreen|rewardVideo",
			e: 1,
			r: 1
		}, {
			i: 44,
			n: "topflow",
			f: "banner|rewardVideo",
			e: 1,
			r: 1
		}, {
			i: 45,
			n: "tel",
			f: "call"
		}, {
			i: 46,
			n: "qs",
			f: "scan",
			e: 1,
			r: 1
		}, {
			i: 47,
			n: "amapLoc",
			f: "getCurrentPosition|stop"
		}, {
			i: 48,
			n: "amapNavi",
			f: "showRoute",
			e: 1,
			r: 1
		}, {
			i: 49,
			n: "amapTrack",
			f: "startTrack|stopTrack",
			e: 1,
			r: 1
		}, {
			i: 50,
			n: "pns",
			f: "setAuthSDKInfo|checkAuthEnvEnable|getLoginToken"
		}, {
			i: 51,
			n: "sia",
			f: "checkSupport|request"
		}, {
			i: 52,
			n: "zj",
			f: "rewardVideo|interstitial|fullScreenVideo|banner|expressFeedFullVideo|contentVideo|h5|setUserId",
			e: 1,
			r: 1
		}, {
			i: 53,
			n: "serialPort",
			f: "getDevices|open|send|close",
			e: 1,
			r: 1
		}, {
			i: 54,
			n: "prt",
			f: "getUsbPrinters|open|close|sendBytesData|printText|printImage|printTable|initPrinter|setFont|setPrinter|setLeftMargin|cutPaper|ringBuzzer|blackLableFind|resetFeedDistance"
		}, {
			i: 55,
			n: "bmNews",
			f: "config|show|setUserId|startCountDown|setRewardResult",
			e: 1,
			r: 1
		}, {
			i: 56,
			n: "uhf",
			f: "open|close|isOpen|getFirmwareVersion|getTemperature|getPower|setPower|getRegion|setRegion|inventoryOnce|inventoryStart|inventoryStop|getTagIDCount|getTagIDs|readTagData|writeTagData|blockWriteTagData|blockEraseTagData|lockTag|killTag|setParameters|setParamBytes|readTagLED|readTagTemperature|registerReadTags|unregisterReadTags"
		}, {
			i: 57,
			n: "hkc",
			f: "addDevice|getDevices|addPreview|removePreview|startPreview|stopPreview|snapshot"
		}, {
			i: 58,
			n: "ob",
			f: "preview|removePreview|snapshot"
		}, {
			i: 59,
			n: "bmVideo",
			f: "config|show|setUserId",
			e: 1,
			r: 1
		}, {
			i: 60,
			n: "bmGame",
			f: "config|show|setUserId",
			e: 1,
			r: 1
		}, {
			i: 61,
			n: "bmNovel",
			f: "config|show|setUserId",
			e: 1,
			r: 1
		}, {
			i: 62,
			n: "xyAd",
			f: "config|rewardVideoAd|interstitialAd|bannerAd|feedVideo|hVideo|interactive|cpa|setUserId",
			e: 1,
			r: 1
		}, {
			i: 63,
			n: "xyNews",
			f: "config|show|startCountDown|setRewardResult|setUserId",
			e: 1,
			r: 1
		}, {
			i: 64,
			n: "xyVideo",
			f: "config|show|setUserId",
			e: 1,
			r: 1
		}, {
			i: 65,
			n: "xyGame",
			f: "config|show|setUserId",
			e: 1,
			r: 1
		}, {
			i: 66,
			n: "xyNovel",
			f: "config|show|setUserId",
			e: 1,
			r: 1
		}, {
			i: 67,
			n: "qqLoc",
			f: "getCurrentPosition|stop"
		}, {
			i: 68,
			n: "flyer",
			f: "logEvent|setAdditionalData|setMinTimeBetweenSessions|logSession|setResolveDeepLinkURLs|sendPushNotificationData|getAppsFlyerUID|setCustomerUserId|setCollect|setCollectData|stop|start|anonymizeUser",
			e: 1,
			r: 1
		}, {
			i: 69,
			n: "topVpn",
			f: "setConfigInfo|loginVOne|requestVPNResInfo|startService|closeService|logoutVOne|requestCaptcha|getStatus|modifyPassword",
			e: 1,
			r: 1
		}, {
			i: 70,
			n: "fbEvent",
			f: "logEvent|setAutoLogAppEventsEnabled|setAdvertiserIDCollectionEnabled"
		}, {
			i: 71,
			n: "fbLogin",
			f: "login"
		}, {
			i: 72,
			n: "fbShare",
			f: "shareLink|sharePhoto|shareVideo|shareMedia"
		}, {
			i: 73,
			n: "tb",
			f: "requestPermissionIfNecessary|interaction|banner|rewardVideo",
			e: 1,
			r: 1
		}, {
			i: 74,
			n: "aliRpVerify",
			f: "start"
		}, {
			i: 75,
			n: "aliSmartVerify",
			f: "getMetaInfo|start"
		}, {
			i: 76,
			n: "aliZimVerify",
			f: "getMetaInfo|getSession|verify"
		}], v = function(n, e, t) {
			var i;
			Object.defineProperty(n, t, {
				configurable: !1,
				writable: !1,
				value: (i = (e ? e + "." : "") + t, function(n, e) {
					"function" == typeof n ? s(i, {}, n) : s(i, n, e)
				})
			})
		}, h = function(n, e, t) {
			for (var i = t.split("|"), o = 0; o < i.length; o++) {
				var a = i[o];
				a && v(n, e, a)
			}
		}, m = 0; m < g.length; m++) {
		var b = g[m];
		b.n ? Object.defineProperty(e, b.n, {
			configurable: !1,
			writable: !1,
			value: function() {
				var n, e = {};
				return h(e, b.i, b.f), b.e && Object.defineProperty(e, "setListener", {
					configurable: !1,
					writable: !1,
					value: (n = b.i, function(e) {
						i(n + ".setListener", {}, function(n, t) {
							if (e && t) {
								var i = JSON.parse(t);
								e(i.event, i.data)
							}
						})
					})
				}), b.r && Object.defineProperty(e, "removeListener", {
					configurable: !1,
					writable: !1,
					value: function(n) {
						return function() {
							i(n + ".removeListener")
						}
					}(b.i)
				}), e
			}()
		}) : h(e, b.i, b.f)
	}
	Object.defineProperty(e, "bdocr", {
		configurable: !1,
		writable: !1,
		value: function() {
			for (var n =
					"general|generalBasic|accurate|accurateBasic|generalEnhanced|webImage|idCardFront|idCardFrontAuto|idCardBack|idCardBackAuto|bankCard|vehicleLicense|drivingLicense|licensePlate|businessLicense|receipt|passport|vatInvoice|qrcode|numbers|lottery|businessCard|handWriting"
					.split("|"), e = {}, t = 0; t < n.length; t++) {
				var i = n[t];
				e[i] = function(n) {
					return function(e) {
						u("t." + n, {}, e)
					}
				}(i)
			}
			return e.custom = function(n, e) {
				u("t.custom", n, e)
			}, e
		}()
	});
	var y = /LT-APP\/(\d+)/,
		P = navigator.userAgent;
	Object.defineProperty(e, "inApp", {
		configurable: !1,
		writable: !1,
		value: y.test(P)
	}), Object.defineProperty(e, "version", {
		configurable: !1,
		writable: !1,
		value: e.inApp ? parseInt(y.exec(P)[1]) : 0
	});
	var w = /LT-APP\/(\d+)\/(\d+)/;
	Object.defineProperty(e, "appVersion", {
		configurable: !1,
		writable: !1,
		value: w.test(P) ? parseInt(w.exec(P)[2]) : 0
	}), Object.defineProperty(e, "ios", {
		configurable: !1,
		writable: !1,
		value: /(iPhone|iPad|iPod|iOS)/i.test(P)
	});
	var S = /YM-RT/.test(P);
	return Object.defineProperty(e, "isRoot", {
		configurable: !1,
		get: function() {
			return S
		}
	}), e.inApp && e.ready(function() {
		e.version > 35 && e.version < 41 && r("_isRoot", {}, function(n) {
			S = n
		})
	}), e
}();

export default jsBridge;
