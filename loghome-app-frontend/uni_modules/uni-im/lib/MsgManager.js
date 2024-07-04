 import uniIm from '@/uni_modules/uni-im/lib/main.js';
 import md5 from '@/uni_modules/uni-im/common/md5'
 const db = uniCloud.database();
 const dbCmd = db.command

export default class Message {
 	constructor(currentConversation) {
		// #ifdef APP
		this.sqlite = getApp().globalData.sqlite
		// #endif
 		// console.log('currentConversation',currentConversation);
 		// currentConversation = currentConversation//await uniIm.conversation.get(conversation_id)
 		this.conversation_id = currentConversation.id

 		Object.defineProperty(this, 'msgList', {
 			get() {
				// 未init当[]，防止本地发送失败的数据 影响查询线上数据结果
				if(currentConversation.isInit){
					return currentConversation.msgList
				}else{
					return []
				}
 			},
 			set(data) {
 				currentConversation.msgList = data
 			}
 		})
		
		
		// #ifdef H5
		Object.defineProperty(this, 'indexDB', {
			get() {
				return uniIm.indexDB
			}
		})
		// #endif

 		// 初始化 storage中的maxTime
 		// #ifdef MP
 		this.localMsg.key = 'uni-im-msg-' + this.conversation_id
 		// #endif
 	}
	indexDB = false
 	isInit = false
 	msgList = []
 	async sleep(t) {
 		return await new Promise((resolve, rejece) => {
 			setTimeout(resolve, t)
 		})
 	}
	async localMsgMaxTime() {
		// 拿到【本地】数据库中，当前会话聊天记录的最大值
		if (this.localMsg.maxTime === false) {
			let lastLocalDatas =  await this.localMsg.get({limit:1,orderBy:{"create_time":"desc"}})
			// console.log('lastLocalDatas------',lastLocalDatas);
			let [lastLocalData] =lastLocalDatas
			if (lastLocalData) {
				this.localMsg.maxTime = lastLocalData.create_time
			} else {
				this.localMsg.maxTime = 0
			}
			// console.log('init localMsgMaxTime',this.localMsg.maxTime);
		}
		return this.localMsg.maxTime
	}
	msgListMinTime(){
		let item = this.msgList[0]
		if(item){
			return item.create_time
		}else{
			return 0
		}
	}
 	getMore = async () => {
 		// console.log('getMore');
 		if (this.cloudMsg.hasAfterStorage) {
			let minTime = await this.localMsgMaxTime(),
				maxTime = this.msgListMinTime()
 			// 1. 拉取云端最新数据（大于本地storage的部分）直到没有
 			let data = await this.cloudMsg.get({minTime,maxTime})

 			if (data.length) {
 				// console.error('【+++】cloudMsg:请求到时间大于storeage中的云端数据', minTime, data.length, data);
 				return data
 			} else {
 				this.cloudMsg.hasAfterStorage = false
 				// console.error('cloudMsg已无：时间大于storeage中的云端数据');
 				return this.getMore()
 			}

 		} else if (this.localMsg.hasBeforeList) {
 			// 2. 拉取storage中的数据（小于已经拉取的数据）直到没有
 			let maxTime = this.msgListMinTime()
 			let data = await this.localMsg.get({
 				maxTime
 			})
 			if (data.length) {
 				// console.error('【+++】localMsg:请求到时间小于列表的本地数据', data.length, data, maxTime);
 				return data
 			} else {
 				this.localMsg.hasBeforeList = false
 				// console.error('localMsg:已无时间小于列表的本地数据', maxTime);
 				return this.getMore()
 			}
 		}
 		// 3. 拉取云端（小于已经拉取的数据）的数据直到没有
 		if (this.cloudMsg.hasBeforeStorage) {
 			// await this.sleep(3000)
 			let maxTime = this.msgList[0] ? this.msgList[0].create_time : false
 			// console.log('*--**--*', maxTime, JSON.stringify(this.msgList));
 			let data = await this.cloudMsg.get({
 				maxTime
 			})
 			if (data.length) {
 				// console.error('【+++】cloudMsg:请求到时间小于列表的云端数据', data.length, data, maxTime);
 				return data
 			} else {
 				this.cloudMsg.hasBeforeStorage = false
 				// console.error('cloudMsg已无:时间小于列表的云端数据', maxTime);
 				return []
 			}
 		}
 	}
 	cloudMsg = {
 		hasAfterStorage: true,
 		hasBeforeStorage: true,
 		get: async ({
 			minTime = 0,
 			maxTime = false,
			limit = 30
 		} = {}) => {
 			// console.log(1111,minTime,maxTime);
 			//console.log('this',this);
 			// let where = `"conversation_id" == "${this.conversation_id}"`
 			let where = {
 				"conversation_id": this.conversation_id
 			}
 			if (minTime && maxTime) {
 				where.create_time = dbCmd.and([
 					dbCmd.gt(minTime),
 					dbCmd.lt(maxTime)
 				])
 			} else {
 				if (minTime) {
 					// where += `&& "create_time" > ${minTime}`
 					where.create_time = dbCmd.gt(minTime)
 				}
 				if (maxTime) {
 					// where += `&& "create_time" < ${maxTime}`
 					where.create_time = dbCmd.lt(maxTime)
 				}
 			}

 			const msgTable = db.collection('uni-im-msg')
 			let data;
 			try {
 				let res = await msgTable.where(where)
					.limit(limit)
 					.orderBy('create_time', 'desc')
 					.get()
 				data = res.result.data.reverse()
 				// console.error('where', where,{minTime,maxTime},data);
 			} catch (e) {
 				// console.error(e);
 				// 如果断网的话，会请求不到直接返回空即可
 				data = []
 			}
 			// console.error('where', where, data);
 			if (data.length) {
 				//存到本地
 				this.localMsg.add(data, minTime === 0 ? 'unshift' : 'push')
 				//console.error(996666699955,[...data], minTime != 0);
 			}
 			return data
 		}
 	}
 	localMsg = {
 		maxTime: false,
 		hasBeforeList: true,
 		get: async ({
 			minTime = 0,
 			maxTime = false,
			limit = 30,
			orderBy = {"create_time":"asc"} //asc 升序，desc 降序
 		} = {}) => {
			// #ifdef APP
			let sql = `select * from msg WHERE conversation_id = "${this.conversation_id}" ` //注意结尾要留空格，下一段语句连接
			if(maxTime || minTime){
				if(maxTime){
					sql += `AND create_time < ${maxTime} `
				}
				if(minTime){
					sql += `AND create_time > ${minTime} `
				}
			}
			// 注意传入的orderBy是查询结果不是过程，im场景下都是从大到小查询
			sql += `ORDER BY "create_time" DESC `

			if(limit){
				sql += `LIMIT ${limit} `
			}
			
			let datas = []
			try{
				datas = await this.sqlite.selectSql(sql)
			}catch(e){
				// 错误时，仍然返回空数组，提高 高可用性
				console.error(e)
			}
			
			// console.error('sql:',sql,datas);
			return datas.map(data=>{
				try{
					let mapData = {
						"&quot;":'"',
						"&#39;":"'",
						"&lt;":'<',
						"&gt;":'>',
						"&amp;":'&'
					}
					
					Object.keys(mapData).forEach(key=>{
						data.body = data.body.replace(new RegExp(key,'g'), mapData[key]);
					})
					// console.log('data.body',data.body)
					data.body = JSON.parse(data.body)
				}catch(e){
					console.error(e)
				}
				return data
			}).sort((a,b)=>{
				if(orderBy.create_time == 'asc'){
					return a.create_time - b.create_time
				}else{
					return b.create_time - a.create_time
				}
			})
			// #endif
			
 			// #ifdef H5
 			let datas = await new Promise((resolve, reject) => {
				let datas = [],index = 0
				if (!maxTime) {
					maxTime = Date.now()
				}
				try{
					// 设置查询索引
					// console.log('kkkkkkkk',[this.conversation_id, minTime], [this.conversation_id,maxTime]);
					let range = IDBKeyRange.bound([this.conversation_id, minTime], [this.conversation_id,maxTime])
					// 传入的 prev 表示是降序遍历游标，默认是next表示升序；
					// indexDB 在im的场景下，查始终是降序遍历游标 orderBy指的是查询结果的排序方式
					let sort = "prev"
					// console.log('sortsortsortsortsortsortsort',sort);
					let task = this.indexDB.transaction("uni-im-msg")
						.objectStore("uni-im-msg")
						.index("conversation_id-create_time")
						.openCursor(range, sort)
					
						task.onsuccess = function(event) {
							let cursor = event.target.result;
							if (cursor) {
								// console.log('cursor',cursor.value);
								// 排除边界值
								if (![minTime, maxTime].includes(cursor.value.create_time)) {
									datas.push(cursor.value)
								}
								index ++
								if(limit && index === limit){
									resolve(datas)
								}else{
									cursor.continue();
								}
							} else {
								resolve(datas)
							}
						}
						
						task.onerror = function(err) {
							console.error(err);
							resolve([])
						}
				}catch(e){
					console.error(e);
					resolve([])
					//TODO handle the exception
				}
 			})
 			return datas.sort((a,b)=>{
				if(orderBy.create_time == 'asc'){
					return a.create_time - b.create_time
				}else{
					return b.create_time - a.create_time
				}
			})
 			// #endif

 			// #ifdef MP
 			let data = uni.getStorageSync(this.localMsg.key) || []
 			// console.error(111,data,minTime,maxTime)
 			data = data.filter(item => {
 				if (minTime && (item.create_time < minTime || item.create_time == minTime)) {
 					return false
 				}
 				if (maxTime && (item.create_time > maxTime || item.create_time == maxTime)) {
 					return false
 				}
 				return true
 			})
 			// console.error(222,data)
 			data = data.sort((a,b)=>{
				if(orderBy.create_time == 'asc'){
					return a.create_time - b.create_time
				}else{
					return b.create_time - a.create_time
				}
			})
			if(limit){
				data = data.slice(0,limit)
			}
			return data
 			// #endif
 		},
 		add: async (datas, action = 'push') => {
 			// console.log('localMsg.add',action,datas);
			if(!Array.isArray(datas)){
				datas = [datas]
			}
			datas.forEach(async data=>{
				data.unique_id = md5(JSON.stringify(data) + Math.random())
			})
			// #ifdef APP
			let sql = []
			datas.forEach(async data=>{
				let keys = Object.keys(data)
				let str = keys.reduce((sum,key)=>{
				    if(key == 'body'){
						let body = JSON.stringify(data.body)
						try{
							body = escapeHtml(body)
							// console.log('bodybodybody',body)
						}catch(e){
							console.error(e)
						}
				    	sum += `"${body}",`
				    }else if(typeof data[key] == 'string'){
				        sum += `"${data[key]}",`
				    } else if(typeof data[key] == 'undefined'){
						sum += `${null},`
					}else{
				        sum += `${data[key]},`
				    }
				    return sum
				},'').slice(0,-1);
				sql.push(`insert into msg("${keys.join('","')}") values (${str})`)
			})
			if(sql.length){
				try{
					await this.sqlite.executeSql(sql)
				}catch(e){
					console.log(e)
				}
			}
			// console.log('executeSql:',sql);
			// #endif
			
 			// #ifdef H5
 			let res = await new Promise((resolve, reject) => {
 				// console.log('datas', datas[0]);
 				// 事务对象 指定表格名称和操作模式（"只读"或"读写"）
 				let transaction = this.indexDB.transaction('uni-im-msg', 'readwrite')
 				let objectStore = transaction.objectStore('uni-im-msg') // 仓库对象
 				let index = 0
 				let length = datas.length
 				datas.forEach(data => {
 					let res = objectStore.add(data)
 					res.onsuccess = (e) => {
 						// console.log('resolve',e, index, length);
 						index++
 						if (index == length) {
 							resolve()
 						}
 					}
 					res.onerror = (e) => {
 						// console.error('add - failed', e);
 						// console.log('reject', e);
 						reject()
 					}
 				})
 			})
 			// #endif

 			// #ifdef MP
 			// mp 端把所有storage查出来
 			let _datas = await this.localMsg.get()
			if(_datas.length > 20){
				let tipText = "提示：当前会话的离线（存到storage）的聊天记录已经超过20条，"
				if(action == 'push'){
					console.log(tipText + '将“自动删除”旧数据后再添加新数据。如果你有其他策略可以自己修改此逻辑')	
					_datas = _datas.slice(-1*datas.length)
				}else{
					return console.log(tipText + '不再存储更多')	
				}
			}
 			_datas[action](...datas)
			uni.setStorageSync(this.localMsg.key,_datas)
 			// #endif

			// 更新最大值
			let maxTime = datas.map(i=>i.create_time).sort((a,b)=>b-a)[0]
			let localMsgMaxTime = await this.localMsgMaxTime()
			if(maxTime > await localMsgMaxTime){
				// console.error('更新最大值 maxTime----------------',maxTime);
				this.localMsg.maxTime = maxTime
			}
 		},
		update: async(unique_id,data)=> {
			// console.log('localMsg update',data);
			data = Object.assign({},data)
			// #ifdef APP
			let dataStr = ''
			for (let key in data) {
				dataStr += `"${key}" = `
				if(key == 'body'){
					let body = JSON.stringify(data.body)
					try{
						body = escapeHtml(body)
						// console.log('bodybodybody',body)
					}catch(e){
						console.error(e)
					}
					dataStr += `"${body}",`
				}else if(typeof data[key] == 'string'){
					dataStr +=  `"${data[key]}",`
				}else if(typeof data[key] == 'undefined'){
					dataStr +=  `${null},`
				}else{
					dataStr += `${data[key]},`
				}
			}
			let sql = `UPDATE msg SET ${dataStr.slice(0,-1)} WHERE unique_id = "${unique_id}"`
			try{
				await this.sqlite.executeSql(sql)
			}catch(e){
				console.log(e)
			}
			// console.log('executeSql:',sql);
			// #endif
			
			// #ifdef H5
			let datas = await new Promise((resolve, reject) => {
				let request = this.indexDB.transaction(['uni-im-msg'], 'readwrite')
								.objectStore("uni-im-msg")
								.put(data)
					request.onsuccess = function(event) {
						// console.log('event---',event);
						resolve(event)
					}
					request.onerror = function(event) {
						console.error(event);
						reject(event)
					};
			})
			// #endif
			
			// #ifdef MP
			// mp 端把所有storage查出来
			let _datas = await this.localMsg.get()
			
			let index = _datas.findIndex(i=>i.unique_id == unique_id)
			_datas[index] = data
			uni.setStorageSync(this.localMsg.key,_datas)
			// #endif
		}
 	}
}

// #ifdef APP
var matchHtmlRegExp = /["'&<>]/
function escapeHtml (string) {
  var str = '' + string
  var match = matchHtmlRegExp.exec(str)

  if (!match) {
    return str
  }

  var escape
  var html = ''
  var index = 0
  var lastIndex = 0

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;'
        break
      case 38: // &
        escape = '&amp;'
        break
      case 39: // '
        escape = '&#39;'
        break
      case 60: // <
        escape = '&lt;'
        break
      case 62: // >
        escape = '&gt;'
        break
      default:
        continue
    }
	if (lastIndex !== index) {
      html += str.substring(lastIndex, index)
    }

    lastIndex = index + 1
    html += escape
  }

  return lastIndex !== index
    ? html + str.substring(lastIndex, index)
    : html
}
// #endif