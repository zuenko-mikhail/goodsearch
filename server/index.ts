import { readFile } from 'fs/promises';
import { createServer } from 'http';
import { createConnection } from 'mariadb';
import { gzip } from 'zlib';

const db = await createConnection({
    host: 'zuenko.my.to',
    port : 3306,
    user: 'marketplace',
    password: 'PasssWorrrd-404',
    database: 'marketplace'
});

const types = {
    txt: 'text/plain; charset=utf-8',
    json: 'application/json',
    html: 'text/html; charset=utf-8',
    css: 'text/css',
    js: 'application/javascript',
    jpg: 'image/jpeg',
    png: 'image/png',
    ico: 'image/x-icon',
    svg: 'image/svg+xml',
    ttf: 'font/ttf'
};

createServer(function(req, res) {
    function send(code: number, contentType: string, data: string | Buffer) {
        if (req.headers['accept-encoding']?.includes('gzip')) {
            res.setHeader('Content-Encoding', 'gzip');
            res.writeHead(code, { 'Content-Type': contentType });
            gzip(data, (err, data) => res.end(data));
        }
        else res.writeHead(code, { 'Content-Type': contentType }).end(data);
    }

    const url = new URL(req.url, 'http://zuenko.my.to:3306/');
    let path = url.pathname;
    if (path.startsWith('/api/')) {
        const search = Object.fromEntries(url.search.slice(1).split('&').map(a => a.split('=').map(b => decodeURIComponent(b))));
        import(`./api/${path.slice(5)}.ts`).then(async function(module: { [key: string]: Function; }) {
            const method = req.method.toLowerCase();
            if (method in module) {
                let body = '';
                req.on('data', chunk => body += chunk);
                req.on('end', async function() {
                    if (req.headers['content-type'].startsWith(types.json)) {
                        try {
                            body = JSON.parse(body);
                        }
                        catch (e) {
                            return send(400, types.json, JSON.stringify({ error: 'Тело запроса не является JSON.' }));
                        }
                    }

                    const [code, resp] = await module[method](db, { search, body });
                    send(code, types.json, JSON.stringify(resp));
                });
            }
            else res.writeHead(405).end();
        }, () => res.writeHead(404).end());
    }
    else if (req.method === 'GET') {
        if (path === '/index.html' || !path.startsWith('/')) return res.writeHead(404).end();
        if (path === '/') path = '/index.html';
        readFile('./public' + path).then(
            data => send(200, types[path.split('.').pop()] || types.txt, data),
            () => res.writeHead(404).end()
        );
    }
}).listen(8080);