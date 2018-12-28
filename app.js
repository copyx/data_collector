const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const mongoose = require('mongoose');
const Data = require('./model/Data');

const dbUri = process.env.MONGO_URI;

if (!dbUri) {
  console.error('There is no MONGO_URI');
  process.exit(1);
}

mongoose.connect(dbUri, { useNewUrlParser: true })
  .then(() => {
    console.debug('Mongo connection is established.\n');
  })
  .catch((err) => {
    console.error('Error on Mongo connecting: ', err.message);
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

module.exports = app;
