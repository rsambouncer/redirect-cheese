const http = require('http');
const https = require('https');
const PORT = process.env.PORT || 3000;

http.createServer(onClientRequest).listen(PORT);

function onClientRequest(client_req, client_res){
    console.log("starting! --------------");
    console.log(client_req.headers);
    
    let options = {
            protocol: 'https:',
            hostname: 'rsambouncer.neocities.org',
            port: 443,
            method: 'GET',
            path: '/index.html',
        };
    let server_req = https.request(options, function(server_res){
        let body = "";
        server_res.on('data', function(chunk){
            body+=chunk;
        });
        server_res.on('end',function(){
            client_res.writeHead(200, server_res.headers);
          console.log(server_res.headers);
            client_res.end(body);
        });
    });
    
    client_req.on('data', function(chunk) {
        server_req.write(chunk);
    });
    client_req.on('end', function() {
        server_req.end();
    });
}
