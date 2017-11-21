const http = require('http');
const formidable = require('formidable');
const page = `
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>file uploader</title>
    </head>
    <body>
        <form method="post" action="/" enctype="multipart/form-data">
            <p><input type="text" name="name" /></p>
            <p><input type="file" name="file" /></p>
            <p><input type="submit" name="Upload" /></p>
        </form>
    </body>
    </html>
`;
const server = http.createServer((req, res) => {
    switch (req.method) {
        case 'GET':
            show(req, res);
            break;
        case 'POST':
            upload(req, res);
            break;
        default:
            res.statusCode = 400;
            res.end('Bad Request');
    }
});

server.listen(3000);

const show = (req, res) => {
    res.setHeader('Content-Length', Buffer.byteLength(page));
    res.setHeader('Content-Type', 'text/html');
    res.end(page);
}

const isFormData = req => {
    const types = req.headers['content-type'] || '';
    return types.indexOf('multipart/form-data') !== -1;
}

const upload = (req, res) => {
    if (!isFormData(req)) {
        res.statusCode = 400;
        res.end('Bad Request');
        return;
    }

    const from = new formidable.IncomingForm();
    //从打印顺序可知，该回调函数发生在表单、文件解析之后
    from.parse(req, (err, fileds, files) => {
        if (err) {
            res.statusCode = 500;
            res.end('Internal Server Error');
            return;
        }
        console.log(fileds);
        console.log(files);
        res.end('file upload compeleted!');
    });
    // 监控文件上传进度
    from.on('progress', (byteReceived, byteExpected) => {
        console.log('progress:', Math.floor(byteReceived / byteExpected * 100) );
    });
}