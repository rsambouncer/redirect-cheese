const http = require('http');
const PORT = process.env.PORT || 3000;

http.createServer(onRequest).listen(PORT);

function onRequest(client_req, client_res) {
  console.log('serve: ' + client_req.url);

  var options = {
    hostname: 'www.zupans.com',
    port: 80,
    path: '/wp-content/uploads/2018/08/cheese-varieties.jpg',
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

