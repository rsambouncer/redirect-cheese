const http = require('http');
const https = require('https');
const url = require('url');
const PORT = process.env.PORT || 3000;

http.createServer(onClientRequest).listen(PORT);

function onClientRequest(client_req, client_res){
    console.log("starting! --------------");
    console.log(client_req.headers);
    let qobj = url.parse(url.parse(client_req.url).path.substring(1));
    
    if(!qobj.hostname){
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
      
    options.headers = {};
        function forwardheader(hstr){if(client_req.headers[hstr]) options.headers[hstr] = client_req.headers[hstr];}
        forwardheader("accept");
        //forwardheader("accept-encoding");
        forwardheader("accept-language");
        //forwardheader("user-agent");
    
    
    
    //options.headers = client_req.headers;
        //if(options.headers.host) options.headers.host = qobj.hostname;
        //if(options.headers["x-request-id"]) delete options.headers["x-request-id"];
        //if(options.headers["x-forwarded-for"]) delete options.headers["x-forwarded-for"];
        //if(options.headers["x-forwarded-proto"]) delete options.headers["x-forwarded-proto"];
        //if(options.headers["x-forwarded-port"]) delete options.headers["x-forwarded-port"];
        //if(options.headers["cookie"]) delete options.headers["cookie"];
        //if(options.headers["via"]) delete options.headers["via"];
    
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


function processHTML(options,html){
    if(!html.includes("<base")){
        let baseurl = options.protocol+"//"+options.hostname+(options.path?options.path:"");
        html = html.replace(/<head.*?>/m,"$&<base href=\""+baseurl+"\">");
    }
    //html = html.replace(/("|')\/[^\/]/gm, function(match){return match.substring(0,1)+"//"+options.hostname+match.substring(1);});
    
    return html;
}
