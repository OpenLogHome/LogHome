/**
 * Static host for the uni-app H5 build in ./unpackage/dist/build/web.
 *
 * Loopback only: the public entry is the frp tunnel plus Caddy on m.loghome.ink,
 * and HBuilderX overwrites the build folder in place, so revalidation is enabled
 * for every name that is not content-hashed.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.join(__dirname, 'unpackage', 'dist', 'build', 'web');
const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 9004);

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.map': 'application/json; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.eot': 'application/vnd.ms-fontobject',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mp3': 'audio/mpeg',
    '.wasm': 'application/wasm'
};

const COMPRESSIBLE = new Set(['.html', '.js', '.mjs', '.css', '.json', '.txt', '.svg']);
const HASHED = /\.[0-9a-f]{8}\.[A-Za-z0-9]+$/;
const GZIP_MIN_BYTES = 860;

function toTarget(pathname) {
    let decoded;
    try {
        decoded = decodeURIComponent(pathname);
    } catch (err) {
        return null;
    }
    if (decoded.endsWith('/')) {
        decoded += 'index.html';
    }
    const target = path.normalize(path.join(ROOT, decoded));
    const rel = path.relative(ROOT, target);
    if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) {
        return null;
    }
    return target;
}

function cacheControlFor(file, ext) {
    if (ext === '.html' || file === 'index.html') return 'no-cache';
    if (HASHED.test(file)) return 'public, max-age=31536000, immutable';
    return 'public, max-age=300';
}

const server = http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { Allow: 'GET, HEAD' });
        return res.end();
    }

    const target = toTarget(new URL(req.url, 'http://static.local').pathname);
    if (!target) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Not found');
    }

    fs.stat(target, (err, stat) => {
        if (err || !stat.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end('Not found');
        }

        const ext = path.extname(target).toLowerCase();
        const file = path.basename(target);
        const etag = 'W/"' + stat.size.toString(16) + '-' + stat.mtimeMs.toString(16) + '"';
        const headers = {
            'Content-Type': MIME[ext] || 'application/octet-stream',
            'Cache-Control': cacheControlFor(file, ext),
            ETag: etag,
            'Last-Modified': stat.mtime.toUTCString(),
            Vary: 'Accept-Encoding'
        };

        if (req.headers['if-none-match'] === etag) {
            res.writeHead(304, headers);
            return res.end();
        }

        const wantsGzip =
            COMPRESSIBLE.has(ext) &&
            stat.size >= GZIP_MIN_BYTES &&
            /\bgzip\b/.test(String(req.headers['accept-encoding'] || ''));

        if (req.method === 'HEAD') {
            headers['Content-Length'] = stat.size;
            res.writeHead(200, headers);
            return res.end();
        }

        if (!wantsGzip) {
            headers['Content-Length'] = stat.size;
            res.writeHead(200, headers);
            return fs.createReadStream(target).pipe(res);
        }

        headers['Content-Encoding'] = 'gzip';
        res.writeHead(200, headers);
        fs.createReadStream(target).pipe(zlib.createGzip()).pipe(res);
    });
});

server.on('error', (err) => {
    console.error('[static-server] ' + err.message);
    if (err.code === 'EADDRINUSE') process.exit(1);
});

server.listen(PORT, HOST, () => {
    console.log('[static-server] root=' + ROOT + ' listening on http://' + HOST + ':' + PORT);
});

process.on('SIGINT', () => server.close(() => process.exit(0)));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
