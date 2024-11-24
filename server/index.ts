import { createServer } from 'http';

createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.write(`Запрос пришел с ${req.url}\n\n`);
    res.end('Сервер не реализован.');
}).listen(8080);