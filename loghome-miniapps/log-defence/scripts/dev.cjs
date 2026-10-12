// Local debug server still verifies real LogHome account tickets.
process.env.LOGHOME_API_URL ||= 'http://127.0.0.1:9000';
process.env.HOST ||= '127.0.0.1';
process.env.ALLOWED_PARENT_ORIGINS ||= 'null,http://localhost:8080,http://127.0.0.1:8080';
process.env.TRUST_PROXY ||= '0';
const {createGameServer} = require('../server/index.cjs');
const port = Number(process.env.PORT || 8787);
createGameServer().listen(port, process.env.HOST, () => console.log(`Log Defence debug: http://${process.env.HOST}:${port}${process.env.BASE_PATH || '/log-defence'}/`));
