const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const mongoose = require('mongoose');
const Data = require('./model/Data');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.debug('Mongo connected!\n');
  })
  .catch((err) => {
    console.error('Mongo connection err: ', err.message);
  });

const app = http.createServer((request, response) => {
  const path = url.parse(request.url, false).pathname;

  if (path === '/') {
    fs.readFile('./view/main.html', 'utf8', (err, content) => {
      response.writeHead(200);
      response.end(content);
    });
  } else if (path === '/collect/data') {
    const body = [];

    request.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      const parsedData = qs.parse(Buffer.concat(body).toString()).data;

      Data.create({ content: parsedData })
        .then(() => {
          response.writeHead(200);
          response.end(parsedData);
        })
        .catch((err) => {
          response.writeHead(500);
          response.end(err);
        });
    });
  } else {
    response.writeHead(404);
    response.end(`"${path}" is unknown path.`);
  }
});

app.listen(3000, () => console.log('Start listening on 3000\n'));

module.exports = app;
