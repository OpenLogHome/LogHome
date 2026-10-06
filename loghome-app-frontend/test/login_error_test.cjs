const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

for (const page of ['login_page_email.vue', 'login_page_mobile.vue', 'login_page.vue']) {
	test(`${page}: 密码错误显示提示，随后可重新登录`, async () => {
		const source = fs.readFileSync(path.join(__dirname, '../pages/users', page), 'utf8');
		const script = source.match(/<script>([\s\S]*?)<\/script>/)[1]
			.replace(/^\s*import .*$/gm, '').replace('export default', 'module.exports =');
		const module = { exports: {} };
		const toasts = [];
		const writes = [];
		const navigations = [];
		const requests = [];
		let rejectLogin = true;
		const token = { tk: 'test-token', id: 1 };
		vm.runInNewContext(script, {
			module, moveVerify: {},
			axios: { post: async (url, body) => {
				requests.push({ url, body });
				if (rejectLogin) throw { response: { status: 422, data: { message: '密码无效' } } };
				return { data: { token } };
			} },
			window: { localStorage: { setItem: (...args) => writes.push(args) } },
			uni: { showToast: toast => toasts.push(toast), reLaunch: options => navigations.push(options) }
		});
		const instance = {
			...module.exports.data(), checked: true, step: 5, pwd: 'wrong-password',
			email: 'test@example.com', mobile: '13800000000', account: 'test-user',
			$baseUrl: 'https://test.invalid', $store: { state: { hypernotion: false } },
			$t: key => {
				assert.equal(key, 'auth.login.invalidCredential');
				return '账号或密码错误';
			}
		};
		const login = module.exports.methods.login.bind(instance);
		await login();
		assert.equal(toasts.length, 1);
		assert.equal(toasts[0].title, '账号或密码错误');
		assert.equal(toasts[0].icon, 'none');
		assert.equal(writes.length, 0);
		assert.equal(navigations.length, 0);
		assert.equal(instance.step, 5);
		if (page !== 'login_page.vue') assert.equal(instance.pwd, '');
		rejectLogin = false;
		instance.pwd = 'correct-password';
		await login();
		assert.equal(requests.length, 2);
		assert.equal(requests[1].url, 'https://test.invalid/users/login');
		assert.equal(requests[1].body.password, 'correct-password');
		assert.equal(writes.length, 1);
		assert.equal(writes[0][0], 'token');
		assert.deepEqual(JSON.parse(writes[0][1]), token);
		assert.equal(navigations[0].url, '../me');
		assert.equal(toasts.length, 1);
	});
}
