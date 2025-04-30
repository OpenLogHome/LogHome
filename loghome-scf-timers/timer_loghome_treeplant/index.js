let { query } = require('./sql.js');
let message = require('./message.js');

async function updateTreeStatus() {
  //比对时间的函数
  let getInervalHour=(startDate, endDate) => {
	  let ms = endDate.getTime() - startDate.getTime();
	  if (ms < 0) return 0;
	  return Math.floor(ms / 1000 / 60 / 60);
  }

  //进行更新
	try {
		let results = await query(
			'SELECT * FROM treeplant WHERE is_gotten = 0 AND messaged = 0',
		);
		for (let item of results) {
			let hour = getInervalHour(item.plant_time, new Date());
			if (hour >= 8) {
				let ratio = 0.6;
				if (Math.random() <= ratio) {
					await query(
						'UPDATE treeplant SET tree_status = \'结果\', messaged = 1 WHERE plant_id = ?',
						[item.plant_id],
					);
					message.sendMsg(
						-1,
						item.user_id,
						'[原木树场]你的树长成啦，快来收获吧！',
						'treePlant/treeplant',
						'notification',
					);
				}
				continue;
			}
			if (hour >= 4) {
				let ratio = 0.8;
				if (Math.random() <= ratio) {
					await query(
						'UPDATE treeplant SET tree_status = \'开花\' WHERE plant_id = ?',
						[item.plant_id],
					);
				}
				continue;
			}
		}
	} catch (e) {
		console.log(e);
	}
}

exports.main_handler = async (event, context, callback) => {
    await updateTreeStatus();
    console.log("树场更新操作执行成功。")
    event.result="success";
    return event
};