const http = require('http');
const parse = require('url').parse;
const join = require('path').join;
const fs = require('fs');

const server = http.createServer((req, res) => {
    const root = __dirname;
    const url = parse(req.url);
    const path = join(root, url.pathname);

    fs.stat(path, (err, stat) => {
        if (err) {
            if ('ENOENT' === err.code) {
                res.statusCode = 404;
                res.end('Not Found');
            } else {
                res.statusCode = 500;
                res.end('Internal Server Errror');
            }
        } else {
            const rs = fs.createReadStream(path);
            res.setHeader('Content-Length', stat.size)
            rs.pipe(res);
            rs.on('error', err => {
                res.statusCode = 500;
                res.end('Internal Server Errror');
            });
        }
    });

    
});

server.listen(3000);