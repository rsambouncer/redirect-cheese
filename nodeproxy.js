const http = require('http');
const net = require('net');
const url = require('url');

// create an HTTP tunneling proxy
const proxy = http.createServer((req, res) => {
  console.log("HTTP Proxying "+req.url);
  let options = {
    headers:req.headers,
    method:req.method
  };
  let newreq = http.request(req.url,options, (newres)=>{
    newres.pipe(res);
  });
  req.pipe(newreq);
});

//HTTPS requests send a connect
//connect handler code from https://nodejs.org/api/http.html#http_event_connect
proxy.on('connect', (req, cltSocket, head) => {
  console.log("Connect Proxying "+req.url);
  const srvUrl = url.parse(`http://${req.url}`);
  const srvSocket = net.connect(srvUrl.port, srvUrl.hostname, () => {
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    srvSocket.write(head);
    srvSocket.pipe(cltSocket);
    cltSocket.pipe(srvSocket);
  });
  srvSocket.on('error', (e)=>{console.log("Server socket error: "+e.message);});
  cltSocket.on('error', (e)=>{console.log("Client socket error: "+e.message);});
});

// now that proxy is running
proxy.on('error',(e)=>{console.log("Proxy server error: "+e.message);});
proxy.listen(8080, () => {
  console.log("now listening");
});

