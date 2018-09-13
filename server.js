const http = require('http');
const PORT = process.env.PORT || 3000;

http.createServer(onClientRequest).listen(PORT);

function onClientRequest(client_req, client_res){
    
    console.log(client_req.headers);
    
    let options = {
            hostname: 'rsambouncer.neocities.org',
            port: 80,
            path: '/index.html',
            method: 'GET'
        };
    let server_req = http.request(options, function(server_res){
        let body = "";
        server_res.on('data', function(chunk){
            body+=chunk;
        });
        server_res.on('end',function(){
            client_res.writeHead(server_res.statusCode, server_res.headers);
            console.log(body);
            client_res.end(body);
        });
    });
    
    client_req.on('data', function(chunk) {
        backend_req.write(chunk);
    });
    client_req.on('end', function() {
        backend_req.end();
    });
}





