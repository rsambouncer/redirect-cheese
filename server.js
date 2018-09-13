const http = require('http');
const url  = require('url');
const PORT = process.env.PORT || 3000;

http.createServer(function (req, res) {
    
    let request = url.parse(req.url);
    let options = {
        hostname:    "www.cheese.com",
        port:    80,
        path:    "/comte",
        headers: req.headers,
    };
    
    let backend_req = http.request(options, function(backend_res) {
        res.writeHead(backend_res.statusCode, backend_res.headers);
        backend_res.on('data', function(chunk) {
            console.log(chunk);
            res.write(chunk);
        });
        backend_res.on('end', function() {
            res.end();
        });
    });

    req.on('data', function(chunk) {
        backend_req.write(chunk);
    });

    req.on('end', function(chunk) {
        backend_req.end(chunk);
    });
    
}).listen(PORT);
