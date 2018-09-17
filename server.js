const http = require('http');
const https = require('https');
const url = require('url');
const PORT = process.env.PORT || 3000;

http.createServer(onClientRequest).listen(PORT);

function onClientRequest(client_req, client_res){
    console.log("starting! --------------");
    
    let qobj = url.parse(url.parse(client_req.url).path.substring(1));
    
    if(!qobj.hostname){
        console.log(qobj);
        client_res.end("Request not formatted correctly");
        return;
    }
    
    let options = {
            protocol: qobj.protocol||"https:",
            hostname: qobj.hostname };
            if(qobj.auth) options.auth = qobj.auth;
            if(qobj.port) options.port = qobj.port;
            if(qobj.method) options.method = qobj.method;
            if(qobj.path) options.path = qobj.path;
    
    
    let server_req = https.request(options, function(server_res){
        let body = "";
        server_res.on('data', function(chunk){
            body+=chunk;
        });
        server_res.on('end',function(){
            client_res.writeHead(200, server_res.headers);
            let type = server_res.headers['content-type'];
            if(type.length>=9&&type.substring(0,9)==="text/html") body = processHTML(options,body);
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

//doesn't work - too buggy. Going to try the onbeforerequest thing on client side
function processHTML(options,html){
    //links to root need to go back through our server, in case they were blocked
    //html = html.replace(/http/gm,"https://redirect-cheese.herokuapp.com/http");
    //html = html.replace(/"\//gm,"\"https://redirect-cheese.herokuapp.com/"+options.protocol+"//"+options.hostname+"/");
    //html = html.replace(/'\//gm,"\'https://redirect-cheese.herokuapp.com/"+options.protocol+"//"+options.hostname+"/");
    
    html = html.replace(/("|')\/[^\/]/gm, function(match){return match.substring(0,1)+"//"+options.hostname+match.substring(1);});
    
    return html;
}
