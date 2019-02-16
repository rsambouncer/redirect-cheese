const http = require('http');
const https = require('https');
const url = require('url');
const PORT = process.env.PORT || 3000;

http.createServer(onClientRequest).listen(PORT);

function onClientRequest(client_req, client_res){
    
    console.log(client_req.url);
    
    let requestedurl = url.parse(client_req.url).path.substring(1);
    
    client_res.end("Hello there: \n"+client_req.url);
    
}

