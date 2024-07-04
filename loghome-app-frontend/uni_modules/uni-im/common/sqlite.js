let options = {
	name: "uni-im",
	path: '_doc/uni-im.db'
}
import uniIm from '@/uni_modules/uni-im/lib/main.js';
export default {
	async init(callback = ()=>{}){
		callback()
	},
	async checkDataBaseIsOpen(){
		if(uniIm.dataBaseIsOpen){
			return true
		}
		let dataBaseIsOpen = plus.sqlite.isOpenDatabase(options)
		uniIm.dataBaseIsOpen = dataBaseIsOpen
		// console.log('uniIm.dataBaseIsOpen',uniIm.dataBaseIsOpen);
		if (!dataBaseIsOpen) {
			let res = await new Promise((resolve, reject) => {
				plus.sqlite.openDatabase({
					...options,
					success: function(e) {
						// console.log(e, 'openDatabase success!')
						resolve(e)
					},
					fail: function(e) {
						console.error(e, 'openDatabase failed: ' + JSON.stringify(e))
						reject(e)
					}
				});
			})
			
			let sql = `create table if not exists msg(
					"_id" CHAR(32),
					"body" TEXT,
					"type" CHAR(32),
					"from_uid" CHAR(32),
					"to_uid" CHAR(32),
					"is_read" BOOLEAN,
					"friendly_time" DATETIME,
					"create_time" DATETIME,
					"conversation_id" CHAR(32),
					"group_id" CHAR(32),
					"client_create_time" DATETIME,
					"unique_id" CHAR(32),
					"appid" CHAR(32),
					"state" INT,
					"is_revoke" BOOLEAN,
					"is_delete" BOOLEAN,
					"action" TEXT
			)`
			this.executeSql(sql)
			
			return res
		}
	},
	async clearMsgTable(){
		let dd = await this.executeSql('drop table msg')
		console.log('clearMsgTable',dd);
	},
	async executeSql(sql) { //执行executeSql
		await this.checkDataBaseIsOpen()
		// console.log('sql',sql);
		return await new Promise((resolve, reject) => {
			// console.log('执行executeSql',{
			// 	"name": options.name,
			// 	"sql": sql
			// });
			try{
				plus.sqlite.executeSql({
					name: options.name,
					sql: sql,
					success: function(e) {
						// console.log(e, 'executeSql success!')
						resolve(e)
					},
					fail: function(e) {
						console.error(e)
						console.error({sql})
						console.error('executeSql failed: ' + JSON.stringify(e))
						console.error('executeSql failed: ' + JSON.stringify(sql))
						reject(e)
					}
				});
			}catch(e){
				reject(e)
			}
		})
	},
	async selectSql(sql) { //执行selectSql
		await this.checkDataBaseIsOpen()
		
		return await new Promise( async(resolve, reject) => {
			// console.log('执行selectSql',{
			// 	"name": options.name,
			// 	"sql": sql
			// });
			try{
				plus.sqlite.selectSql({
					name: options.name,
					sql: sql,
					success: function(e) {
						// console.log(e, 'selectSql success!')
						resolve(e)
					},
					fail: function(e) {
						console.error('sql:'+sql,'selectSql failed: ' + JSON.stringify(e))
						reject(e)
					}
				});
			}catch(e){
				reject(e)
			}
		})
	}
}

// await this.clearMsgTable()
// try{
// 	await new Promise((resolve, reject) => {
// 		plus.sqlite.closeDatabase({
// 			...options,
// 			success: function(e) {
// 				console.log(e, 'closeDatabase success!')
// 				resolve(e)
// 			},
// 			fail: function(e) {
// 				console.error(e, 'closeDatabase failed: ' + JSON.stringify(e))
// 				reject(e)
// 			}	
// 		})
// 	})
// }catch(e){
// 	console.error(e)
// 	//TODO handle the exception
// }