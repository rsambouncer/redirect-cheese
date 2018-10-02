const http = require('http');
const https = require('https');
const url = require('url');
const PORT = process.env.PORT || 3000;

http.createServer(onClientRequest).listen(PORT);

function onClientRequest(client_req, client_res){
    
    let requestedurl = url.parse(client_req.url).path.substring(1);
    
    let server_req = httpsReqFromURL(requestedurl, client_req, client_res);
        if(server_req==null) return;
    
    client_req.on('data', (chunk)=>{server_req.write(chunk);console.log("chunk: "+chunk);} );
    
    client_req.on('error', (err)=>{console.error(err);} );
    
    client_req.on('end', ()=>{ server_req.end();} );
    
}


function httpsReqFromURL(requrl, client_req, client_res){
    
    console.log("Getting resource: "+requrl);
    
    let qobj = url.parse(requrl);
    if(!qobj.hostname){
        client_res.end("Request not formatted correctly");
        return null;
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
        forwardheader("user-agent");
        forwardheader("cookie");
        forwardheader("via");

    let server_req = https.request(options, function(server_res){
        let body = "";
        server_res.on('data', function(chunk){
            body+=chunk;
        });
        server_res.on('end',function(){
            client_res.writeHead(200, server_res.headers);
            if(server_res.statusCode>=300 && server_res.statusCode<400 || server_res.statusCode==201){ 
                //redirect, or 201 created
                let redirect_req = httpsReqFromURL(server_res.headers['location'],client_req,client_res);
                redirect_req.end();
            }else{
                let type = server_res.headers['content-type'];
                if(type.length>=9&&type.substring(0,9)==="text/html") body = processHTML(options,body);
                client_res.end(body);
            }
        });
    });

    return server_req;
}

function processHTML(options,html){
    if(!html.includes("<base")){
        let baseurl = options.protocol+"//"+options.hostname+(options.path?options.path:"");
        html = html.replace(/<head.*?>/m,"$&<base href=\""+baseurl+"\">");
    }
    //html = html.replace(/("|')\/[^\/]/gm, function(match){return match.substring(0,1)+"//"+options.hostname+match.substring(1);});
    
    return html;
}
