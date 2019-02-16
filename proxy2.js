const http      = require('http');
const httpProxy = require('http-proxy');
const proxy     = httpProxy.createProxyServer({});
const PORT = process.env.PORT || 3000;

http.createServer(function(req, res) {
  proxy.web(req, res, { target: req.url });
}).listen(PORT, () => {
  console.log("Waiting for requests on port "+PORT);
});
