// Verify hosted images first; --upload publishes assets, --apply updates only icon URLs.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const axios = require('axios');
const FormData = require('form-data');

const root = path.resolve(__dirname, '../..');
const manifestPath = path.join(__dirname, 'miniapp-icon-assets.json');
const assets = {
  'log-defence': 'loghome-app-frontend/static/icons/enderman.png',
  'log-miniminecraft': 'loghome-app-frontend/static/icons/mini-minecraft.svg'
};
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};

async function readPublicImage(url) {
  for (let attempt=0; ; attempt++) {
    try {
      return await axios.get(url,{responseType:'arraybuffer',timeout:60000});
    } catch (error) {
      if (attempt >= 2 || !['ENOTFOUND','EAI_AGAIN','ECONNRESET','ETIMEDOUT','ECONNABORTED'].includes(error.code)) throw error;
      await new Promise(resolve => setTimeout(resolve,500));
    }
  }
}

async function verify(entry) {
  const url = new URL(entry.url);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error(`Icon requires a public HTTPS URL (received ${url.protocol}//${url.host})`);
  const response = await readPublicImage(url.href);
  if (!String(response.headers['content-type']).startsWith('image/')) throw new Error('Hosted icon is not an image');
  if (hash(response.data) !== entry.sha256) throw new Error('Hosted icon bytes differ from the uploaded PNG');
}

async function main() {
  for (const [id, source] of Object.entries(assets)) {
    const sourceBytes = fs.readFileSync(path.join(root,source));
    // Rasterize the code-native block icon at its pixel grid, then enlarge without blur.
    const bytes = source.endsWith('.svg')
      ? await require('sharp')(await require('sharp')(sourceBytes).png().toBuffer()).resize(256,256,{kernel:'nearest'}).png().toBuffer()
      : sourceBytes;
    const sha256 = hash(bytes);
    let entry = manifest[id];
    if (!entry || entry.sha256 !== sha256) {
      if (!process.argv.includes('--upload') || !process.env.LOGHOME_IMAGE_API_KEY) {
        throw new Error('Upload requires --upload and LOGHOME_IMAGE_API_KEY');
      }
      const form = new FormData();
      form.append('img',bytes,{filename:`${id}.png`,contentType:'image/png'});
      const response = await axios.post('https://img.codesocean.top/upload/img',form,{
        headers:{...form.getHeaders(),apikey:process.env.LOGHOME_IMAGE_API_KEY},timeout:60000
      });
      const payload = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      if (typeof payload?.url !== 'string') throw new Error('Upload response missing image URL');
      // This host returns HTTP links even when uploaded over HTTPS; use its HTTPS image endpoint.
      const publicUrl = new URL(payload.url);
      if (['img.codesocean.top','storage.codesocean.top'].includes(publicUrl.hostname)) publicUrl.protocol = 'https:';
      entry = {source,url:publicUrl.href,sha256};
    }
    // Retain the public upload URL if verification needs to be retried, avoiding duplicate uploads.
    manifest[id] = entry;
    fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
    await verify(entry);
    console.log(`${id}: verified ${entry.url}`);
  }
  if (!process.argv.includes('--apply')) return;

  const connection = require('mysql').createConnection(require('../config').database);
  const query = (sql,values=[]) => new Promise((resolve,reject) => connection.query(sql,values,(error,rows) => error ? reject(error) : resolve(rows)));
  try {
    await query('START TRANSACTION');
    const ids = Object.keys(assets);
    const apps = await query('SELECT app_id,icon_url FROM miniapps WHERE app_id IN (?) FOR UPDATE',[ids]);
    if (apps.length !== ids.length) throw new Error('Both miniapps must be registered before applying icons');
    const entries = await query('SELECT entry_id,miniapp_id,icon_url FROM lab_entries WHERE miniapp_id IN (?) FOR UPDATE',[ids]);
    const backupDir = path.join(root,'_tmp');
    fs.mkdirSync(backupDir,{recursive:true});
    const backup = path.join(backupDir,`miniapp-icon-urls-backup-${Date.now()}.json`);
    fs.writeFileSync(backup,JSON.stringify({miniapps:apps,labEntries:entries},null,2)+'\n');
    for (const id of ids) {
      await query('UPDATE miniapps SET icon_url=? WHERE app_id=?',[manifest[id].url,id]);
      await query('UPDATE lab_entries SET icon_url=? WHERE miniapp_id=?',[manifest[id].url,id]);
    }
    await query('COMMIT');
    console.log(`Applied icons to ${apps.length} miniapps and ${entries.length} lab entries; backup: ${backup}`);
  } catch (error) {
    await query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    connection.end();
  }
}

main().catch(error => {
  // Axios configs contain credentials; never print requests, headers or database configs.
  console.error(error.response ? `Image host HTTP ${error.response.status}` : (error.code ? `${error.code}${error.hostname ? ` (${error.hostname})` : ''}` : error.message));
  process.exitCode = 1;
});
