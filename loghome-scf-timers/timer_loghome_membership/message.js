const { query } = require('./sql.js');

async function sendMsg(toId, content, router = 'membership/index') {
  await query(
    `INSERT INTO user_message
     (from_id, to_id, message_content, router, message_type)
     VALUES (-1, ?, ?, ?, 'notification')`,
    [toId, content, router],
  );
}

module.exports = {
  sendMsg,
};
