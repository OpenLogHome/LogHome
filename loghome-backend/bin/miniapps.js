const fs = require('node:fs');
const path = require('node:path');
const schema = fs.readFileSync(path.join(__dirname, '../sql/miniapps.sql'), 'utf8');
function failure(status, message) { const error = new Error(message); error.status = status; return error; }
function validateId(id) {
  if (typeof id !== 'string' || !/^[a-z][a-z0-9-]{0,63}$/.test(id)) throw failure(400, '小程序 ID 须为小写字母、数字或连字符，以字母开头');
  if (id === 'manage') throw failure(400, 'manage 是系统保留 ID');
  return id;
}
function address(value, label, production = false) {
  if (typeof value !== 'string' || !value.trim() || value.length > 2048) throw failure(400, label + '不能为空且不能超过 2048 字符');
  let url; try { url = new URL(value.trim()); } catch { throw failure(400, label + '格式不正确'); }
  if (!(production ? ['https:'] : ['https:', 'http:']).includes(url.protocol) || url.username || url.password || url.hash) throw failure(400, label + (production ? '必须使用 HTTPS，不能包含账号或 fragment' : '须使用 HTTP/HTTPS，不能包含账号或 fragment'));
  return url.href;
}
function validate(input) {
  if (!input || typeof input !== 'object') throw failure(400, '缺少注册信息');
  const id = validateId(input.id);
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const description = typeof input.description === 'string' ? input.description.trim() : '';
  if (!name || name.length > 80 || description.length > 500) throw failure(400, '名称须为 1–80 字符，说明不能超过 500 字符');
  const icon = typeof input.icon === 'string' && /^\/static\/[a-zA-Z0-9_./-]+$/.test(input.icon) && !input.icon.includes('..') ? input.icon : address(input.icon, '图标地址');
  if (![true, false, 0, 1].includes(input.enabled)) throw failure(400, '启用状态不正确');
  const sortOrder = Number(input.sortOrder);
  if (!Number.isInteger(sortOrder) || Math.abs(sortOrder) > 100000) throw failure(400, '排序须为 -100000 到 100000 的整数');
  const minClientVersion = input.minClientVersion === undefined ? 0 : input.minClientVersion;
  if (typeof minClientVersion !== 'number' || !Number.isInteger(minClientVersion) || minClientVersion < 0 || minClientVersion > 2147483647) throw failure(400, '最低客户端版本须为 0–2147483647 的整数');
  return {id, name, icon, description, minClientVersion, debugUrl: address(input.debugUrl, '调试地址'), productionUrl: address(input.productionUrl, '生产地址', true), enabled: input.enabled ? 1 : 0, sortOrder};
}
function record(row) { return {id: row.app_id, name: row.name, icon: row.icon_url, description: row.description, debugUrl: row.debug_url, productionUrl: row.production_url, enabled: Number(row.enabled) === 1, sortOrder: row.sort_order, minClientVersion: Number(row.min_client_version || 0)}; }
function createRegistry(query) {
  let initialized;
  async function ensure() {
    if (!initialized) initialized = (async () => {
      await query(schema);
      const columns = await query("SHOW COLUMNS FROM miniapps LIKE 'min_client_version'");
      if (!columns.length) {
        try { await query('ALTER TABLE miniapps ADD COLUMN min_client_version INT UNSIGNED NOT NULL DEFAULT 0'); }
        catch(e) { if (e.code !== 'ER_DUP_FIELDNAME') throw e; }
      }
    })().catch(e => { initialized = null; throw e; });
    await initialized;
  }
  async function all(admin = false) { await ensure(); return (await query('SELECT * FROM miniapps' + (admin ? '' : ' WHERE enabled = 1') + ' ORDER BY sort_order ASC, app_id ASC')).map(record); }
  return {
    all,
    async catalog() { return (await all()).map(({id, name, icon, description}) => ({id, name, icon, description})); },
    async resolve(id, environment) {
      validateId(id);
      if (!['debug', 'production'].includes(environment)) throw failure(400, '环境须为 debug 或 production');
      await ensure(); const rows = await query('SELECT * FROM miniapps WHERE app_id = ? AND enabled = 1', [id]);
      if (!rows.length) throw failure(404, '小程序未注册或已停用');
      const app = record(rows[0]); return {id: app.id, name: app.name, icon: app.icon, description: app.description, environment, minClientVersion: app.minClientVersion, url: environment === 'debug' ? app.debugUrl : app.productionUrl};
    },
    async save(input, existingId) {
      const app = validate(input); if (existingId && app.id !== validateId(existingId)) throw failure(400, '注册后不能更改小程序 ID');
      await ensure(); const values = [app.name, app.icon, app.description, app.debugUrl, app.productionUrl, app.enabled, app.sortOrder, app.minClientVersion];
      if (existingId) {
        const rows = await query('SELECT app_id, min_client_version FROM miniapps WHERE app_id = ?', [existingId]);
        if (!rows.length) throw failure(404, '小程序不存在');
        if (input.minClientVersion === undefined) { app.minClientVersion = Number(rows[0].min_client_version || 0); values[7] = app.minClientVersion; }
        await query('UPDATE miniapps SET name=?, icon_url=?, description=?, debug_url=?, production_url=?, enabled=?, sort_order=?, min_client_version=? WHERE app_id=?', [...values, app.id]);
      } else {
        try { await query('INSERT INTO miniapps (app_id,name,icon_url,description,debug_url,production_url,enabled,sort_order,min_client_version) VALUES (?,?,?,?,?,?,?,?,?)', [app.id, ...values]); }
        catch(e) { if (e.code === 'ER_DUP_ENTRY') throw failure(409, '小程序 ID 已注册'); throw e; }
      }
      return {...app, enabled: Boolean(app.enabled)};
    },
    async remove(id) {
      validateId(id); await ensure();
      try { const result = await query('DELETE FROM miniapps WHERE app_id = ?', [id]); if (!result.affectedRows) throw failure(404, '小程序不存在'); }
      catch(e) { if (e.code === 'ER_ROW_IS_REFERENCED_2') throw failure(409, '此小程序仍有关联的原木实验室入口，请先移除实验室入口'); throw e; }
    }
  };
}
module.exports = {createRegistry, validate, validateId};
