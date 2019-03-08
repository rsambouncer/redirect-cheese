f1.onsubmit = function(e){
  e.preventDefault();
  chrome.runtime.sendMessage({
    scheme: f1.c0.value,
    host:f1.c1.value,
    port:parseInt(f1.c2.value)
  });
  f1.c0.value = "";
  f1.c1.value = "";
  f1.c2.value = "";
};

