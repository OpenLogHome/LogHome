const dns = require('dns').promises;
const net = require('net');
const { database } = require('../config');

async function checkDns(server) {
	const resolver = new dns.Resolver();
	resolver.setServers([server]);
	const timer = setTimeout(() => resolver.cancel(), 3000);
	try {
		const records = await resolver.resolve4(database.host, { ttl: true });
		console.log(`[dns ${server}]`, records);
	} catch (error) {
		console.log(`[dns ${server}] ${error.code}`);
	} finally { clearTimeout(timer); }
}

async function run() {
	console.log(`Database DNS check: ${database.host}:${database.port || 3306}`);
	try { console.log('[system lookup]', await dns.lookup(database.host, { all: true })); }
	catch (error) { console.log('[system lookup]', error.code); }
	await Promise.all(['223.5.5.5', '119.29.29.29'].map(checkDns));
	await new Promise((resolve) => {
		const socket = net.createConnection({ host: database.host, port: database.port || 3306 });
		let settled = false;
		function finish(result) {
			if (settled) return;
			settled = true;
			console.log('[tcp]', result);
			socket.destroy();
			resolve();
		}
		socket.setTimeout(3000, () => finish('timeout'));
		socket.once('connect', () => finish('connected (no authentication or SQL sent)'));
		socket.once('error', (error) => finish(error.code));
	});
}
run().catch((error) => { console.error(error.code || error.message); process.exitCode = 1; });
