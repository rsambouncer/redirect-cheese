const http = require('http');
const https = require('https');
const url = require('url');
const PORT = process.env.PORT || 3000;

http.createServer(onClientRequest).listen(PORT);

function onClientRequest(client_req, client_res){
    
    console.log("Getting resource: "+ client_req.url);
    
    let qobj = url.parse(client_req.url);
    if(!qobj.hostname){ 
        client_res.end("Request not formatted correctly: No hostname"); 
        return;
    }
    let options = {
        protocol: qobj.protocol||"https:",
        hostname: qobj.hostname, 
        headers:  client_req.headers};
        if(qobj.auth) options.auth = qobj.auth;
        if(qobj.port) options.port = qobj.port;
        if(qobj.method) options.method = qobj.method;
        if(qobj.path) options.path = qobj.path;
    
    let proto = options.protocol==="https:"?https:http;
    let server_req = proto.request(options, function(server_res){
        let body = "";
        server_res.on('data', function(chunk){
            body+=chunk;
        });
        server_res.on('end', function(){
            client_res.writeHead(200, server_res.headers);
            client_res.end(body);
        });
        server_res.on('error',function(err){
            console.log(err);
        });
    });
        
    client_req.on('data', (chunk)=>{server_req.write(chunk);console.log("chunk: "+chunk);} );
    client_req.on('error', (err)=>{console.log(err);} );
    client_req.on('end', ()=>{ server_req.end();} );
}

