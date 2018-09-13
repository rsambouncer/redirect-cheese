const http = require('http');
const url  = require('url');
const PORT = process.env.PORT || 3000;

http.createServer(function (req, res) {
    
    let request = url.parse(req.url);
    
    console.log(req.headers);

    
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('Hello World!');
    res.end();
    
}).listen(PORT);
