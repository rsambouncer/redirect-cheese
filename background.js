chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
  var message = request;
  var config = {
    mode: "fixed_servers",
    rules: {
      singleProxy: {
        scheme: message.scheme,
        host: message.host,
        port: message.port
      }
    }
  };
  console.log(config);
  chrome.proxy.settings.set(
    {value: config, scope: 'regular'},
    function(){
      console.log("done setting");
    }
  );
});
    
    
