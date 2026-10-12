const fs = require('node:fs');
const path = require('node:path');
const {createRegistry, validateId} = require('./miniapps');
const schema = fs.readFileSync(path.join(__dirname, '../sql/lab_entries.sql'), 'utf8');
function failure(status, message) { return Object.assign(new Error(message), {status}); }
function text(value, limit, label, required = false) {
  if (value === undefined && !required) return '';
  if (typeof value !== 'string' || value.trim().length > limit || (required && !value.trim())) throw failure(400, label + '格式或长度不正确');
  return value.trim();
}
function validate(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw failure(400, '缺少实验室入口信息');
  const id = validateId(input.id), miniappId = validateId(input.miniappId);
  const icon = text(input.icon, 2048, '图标地址', true);
  if (!(/^\/static\/[a-zA-Z0-9_./-]+$/.test(icon) && !icon.includes('..'))) {
    let url; try { url = new URL(icon); } catch { throw failure(400, '图标地址格式不正确'); }
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw failure(400, '图标须为 HTTP/HTTPS 地址或 /static/ 路径');
  }
  if (![true, false, 0, 1].includes(input.enabled)) throw failure(400, '启用状态不正确');
  const sortOrder = Number(input.sortOrder);
  if (!Number.isInteger(sortOrder) || Math.abs(sortOrder) > 100000) throw failure(400, '排序须为 -100000 到 100000 的整数');
  return {id, miniappId, name: text(input.name,80,'名称',true), nameEn: text(input.nameEn,80,'英文名称'), icon,
    description: text(input.description,500,'说明'), descriptionEn: text(input.descriptionEn,500,'英文说明'), enabled: Boolean(input.enabled), sortOrder};
}
function record(row) {
  return {id: row.entry_id, miniappId: row.miniapp_id, name: row.name, nameEn: row.name_en || '', icon: row.icon_url,
    description: row.description, descriptionEn: row.description_en || '', enabled: Number(row.enabled) === 1, sortOrder: row.sort_order,
    miniappName: row.miniapp_name, miniappEnabled: Number(row.miniapp_enabled) === 1};
}
function createLabRegistry(query, miniapps = createRegistry(query)) {
  let initialized;
  async function ensure() {
    if (!initialized) initialized = (async () => { await miniapps.all(true); await query(schema); })().catch(e => { initialized = null; throw e; });
    await initialized;
  }
  async function all(admin = false) {
    await ensure();
    const rows = await query('SELECT e.*, m.name AS miniapp_name, m.enabled AS miniapp_enabled FROM lab_entries e JOIN miniapps m ON m.app_id = e.miniapp_id' +
      (admin ? '' : ' WHERE e.enabled = 1 AND m.enabled = 1') + ' ORDER BY e.sort_order ASC, e.entry_id ASC');
    return rows.map(record);
  }
  return {
    all,
    async catalog() { return (await all()).map(({id,miniappId,name,nameEn,icon,description,descriptionEn,sortOrder}) => ({id,miniappId,name,nameEn,icon,description,descriptionEn,sortOrder})); },
    async save(input, existingId) {
      const entry = validate(input);
      if (existingId && entry.id !== validateId(existingId)) throw failure(400,'入口 ID 注册后不能修改');
      await ensure();
      if (!(await miniapps.all(true)).some(app => app.id === entry.miniappId)) throw failure(400,'关联的小程序未注册，请先在小程序管理中注册');
      const values = [entry.miniappId,entry.name,entry.nameEn,entry.icon,entry.description,entry.descriptionEn,entry.enabled ? 1 : 0,entry.sortOrder];
      try {
        if (existingId) {
          const rows = await query('SELECT entry_id FROM lab_entries WHERE entry_id = ?', [existingId]);
          if (!rows.length) throw failure(404,'实验室入口不存在');
          await query('UPDATE lab_entries SET miniapp_id=?,name=?,name_en=?,icon_url=?,description=?,description_en=?,enabled=?,sort_order=? WHERE entry_id=?', [...values,entry.id]);
        } else {
          await query('INSERT INTO lab_entries (entry_id,miniapp_id,name,name_en,icon_url,description,description_en,enabled,sort_order) VALUES (?,?,?,?,?,?,?,?,?)', [entry.id,...values]);
        }
      } catch(e) {
        if (e.code === 'ER_DUP_ENTRY') throw failure(409,'实验室入口 ID 已存在');
        if (e.code === 'ER_NO_REFERENCED_ROW_2') throw failure(400,'关联的小程序不存在，请重新选择');
        throw e;
      }
      return entry;
    },
    async remove(id) { validateId(id); await ensure(); const result = await query('DELETE FROM lab_entries WHERE entry_id = ?', [id]); if (!result.affectedRows) throw failure(404,'实验室入口不存在'); }
  };
}
module.exports = {createLabRegistry, validate};
