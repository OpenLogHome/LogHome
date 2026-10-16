const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const defaults = ['null', 'https://m.loghome.ink', 'https://loghome.ink', 'http://localhost:8080', 'http://127.0.0.1:8080'];
function createServer(options = {}) {
  const basePath = (options.basePath ?? process.env.BASE_PATH ?? '/log-book-cover').replace(/\/$/, '');
  if (basePath && !/^\/[a-zA-Z0-9/_-]+$/.test(basePath)) throw new Error('BASE_PATH 格式无效');
  const root = path.resolve(options.root || path.join(__dirname, '../dist'));
  for (const file of ['index.html', 'bridge.js', 'loghome.css', 'assets/style-itQcOJ0T.css', 'assets/index-DJH4ljDL.js', 'assets/EditorView-BBdfO0G6.js']) {
    if (!fs.existsSync(path.join(root, file))) throw new Error('缺少构建产物，请先执行 npm run build：' + file);
  }
  const parentOrigins = options.parentOrigins || (process.env.ALLOWED_PARENT_ORIGINS?.split(',').map(x => x.trim()).filter(Boolean) ?? defaults);
  const mime = {'.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml'};
  return http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    const reply = (code, body, type = 'text/plain; charset=utf-8') => {
      res.writeHead(code, {'Content-Type':type, 'Cache-Control':'no-cache'});
      res.end(req.method === 'HEAD' ? undefined : body);
    };
    if (!['GET', 'HEAD'].includes(req.method)) { res.setHeader('Allow', 'GET, HEAD'); return reply(405, 'Method not allowed'); }
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { return reply(400, 'Invalid path'); }
    if (basePath && pathname === basePath) { res.writeHead(308, {Location:basePath + '/'}); return res.end(); }
    if (!pathname.startsWith(basePath + '/')) return reply(404, 'Not found');
    const relative = pathname.slice(basePath.length + 1) || 'index.html';
    if (relative === 'api/health') return reply(200, JSON.stringify({ok:true, id:'log-book-cover'}), 'application/json');
    if (relative === 'config.js') return reply(200, 'window.__LOGHOME_COVER_CONFIG__=' + JSON.stringify({parentOrigins}).replace(/</g, '\\u003c') + ';', mime['.js']);
    if (relative.includes('\0') || relative.split(/[\\/]/).some(part => part === '..' || part.startsWith('.'))) return reply(404, 'Not found');
    const file = path.resolve(root, relative);
    if (!file.startsWith(root + path.sep)) return reply(404, 'Not found');
    try {
      const data = await fs.promises.readFile(file);
      reply(200, data, mime[path.extname(file)] || 'application/octet-stream');
    } catch (error) { reply(error.code === 'ENOENT' || error.code === 'EISDIR' ? 404 : 500, 'Resource unavailable'); }
  });
}
if (require.main === module) {
  const host = process.env.HOST || '127.0.0.1', port = Number(process.env.PORT || 8789);
  const server = createServer();
  server.listen(port, host, () => console.log(`书籍封面生成器（高级版）：http://${host}:${port}${process.env.BASE_PATH || '/log-book-cover'}/`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
}
module.exports = {createServer};
