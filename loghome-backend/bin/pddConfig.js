const fs = require('fs');
const os = require('os');
const path = require('path');

// Environment variables override private machine configuration, including in tests.
let local;
module.exports = function setting(name) {
	if (process.env[name] !== undefined) return process.env[name];
	if (local === undefined) {
		const filename = process.env.PDD_CONFIG_FILE || path.join(os.homedir(), '.loghome', 'pdd-config.json');
		try { local = JSON.parse(fs.readFileSync(filename, 'utf8')); }
		catch (error) {
			if (error.code === 'ENOENT') local = {};
			else throw new Error('拼多多本机配置无法读取，请检查 PDD_CONFIG_FILE 和 JSON 格式');
		}
		if (!local || typeof local !== 'object' || Array.isArray(local)) throw new Error('拼多多本机配置必须为 JSON 对象');
	}
	return typeof local[name] === 'string' ? local[name] : undefined;
};
