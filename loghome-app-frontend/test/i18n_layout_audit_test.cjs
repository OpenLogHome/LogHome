const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

test('i18n layout audit is development-only and dormant without explicit config', () => {
	const main = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
	const audit = fs.readFileSync(path.join(root, 'common/i18n-layout-audit.js'), 'utf8');
	assert.match(main, /process\.env\.NODE_ENV === 'development'/);
	assert.match(audit, /loghome_i18n_layout_audit/);
	assert.match(audit, /if \(!config\) return;/);
	assert.match(audit, /__startLogHomeI18nLayoutAudit/);
	assert.match(audit, /__stopLogHomeI18nLayoutAudit/);
});

test('i18n layout audit checks clipping and sibling overlap', () => {
	const audit = fs.readFileSync(path.join(root, 'common/i18n-layout-audit.js'), 'utf8');
	assert.match(audit, /scrollWidth - element\.clientWidth/);
	assert.match(audit, /scrollHeight - element\.clientHeight/);
	assert.match(audit, /left\.contains\(right\)/);
	assert.match(audit, /style\.display\.startsWith\('inline'\)/);
	assert.match(audit, /type: 'overlap'/);
});
