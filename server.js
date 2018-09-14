const http = require('http');
const PORT = process.env.PORT || 3000;

http.createServer(onClientRequest).listen(PORT);

function onClientRequest(client_req, client_res){
    console.log("starting! --------------");
    console.log(client_req.headers);
    
    let options = {
            protocol: 'http:',
            //host: 'rsambouncer.neocities.org',
            hostname: 'rsambouncer.neocities.org',
            //family: 4,
            port: 80,
            //localAddress: '???????',
            //socketPath: '??????',
            method: 'GET',
            path: '/index.html',
        
        
        
            headers: {
                    host: 'rsambouncer.neocities.org', //change
                    connection: 'close',
                    'cache-control': 'max-age=0',
                    'upgrade-insecure-requests': '1',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
                    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                    'accept-encoding': 'gzip, deflate, br',
                    'accept-language': 'en-US,en;q=0.9',
                    'x-request-id': 'db377189-ae74-438d-8c1c-9ebcbbf8dccf',
                    'x-forwarded-for': '23.240.193.1',
                    'x-forwarded-proto': 'https',
                    'x-forwarded-port': '443',
                    via: '1.1 vegur',
                    'connect-time': '1',
                    'total-route-time': '0' 
            },
        
            //auth:'',
            //agent: idek,
            //createConnection: idek,
            //timeout: idek,
            setHost: true
        };
    let server_req = http.request(options, function(server_res){
        let body = "";
        server_res.on('data', function(chunk){
            body+=chunk;
        });
        server_res.on('end',function(){
            client_res.writeHead(200, server_res.headers);
            console.log(body);
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





