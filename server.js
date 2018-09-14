const http = require('http');
const PORT = process.env.PORT || 3000;

http.createServer(onRequest).listen(PORT);

function onRequest(client_req, client_res) {
  console.log('serve: ' + client_req.url);

  var options = {
    hostname: 'rsambouncer.neocities.org',
    port: 80,
    path: '/article-test/data.json',
    method: 'GET'
  };

  var proxy = http.request(options, function (res) {
    res.pipe(client_res, {
      end: true
    });
  });

  client_req.pipe(proxy, {
    end: true
  });
}

