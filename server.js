const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');

const app = http.createServer((request, response) => {
    const path = url.parse(request.url, false).pathname;

    if (path === '/') {
        fs.readFile('./view/main.html', 'utf8', (err, content) => {
            response.writeHead(200);
            response.end(content);
        });
    }
    else if (path === '/collect/data') {
        const body = [];

        request.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            const parsedBody = qs.parse(Buffer.concat(body).toString());

            response.writeHead(200);
            response.end(parsedBody.data);
        });
    }
    else {
        response.writeHead(200);
        response.end(`"${path}" is unknown path.`);
    }

});

app.listen(3000);