const http = require('http');
const https = require('https');
const url = require('url');
const PORT = process.env.PORT || 3000;

http.createServer(onClientRequest).listen(PORT);

function onClientRequest(client_req, client_res){
    console.log("starting! --------------");
    let qobj = url.parse(url.parse(client_req.url).path.substring(1));
    console.log(qobj);
    console.log("nice nice");
    /*
    let options = {
            protocol: 'https:',
            hostname: "www.cheese.com",
            port: 443,
            method: 'GET',
            path: "/index.html",
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
    */
}
