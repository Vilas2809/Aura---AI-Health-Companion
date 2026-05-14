const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../dist/index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const diagnosticScript = `<script>
(function() {
  var banner = document.createElement('div');
  banner.id = '_diag';
  banner.style.cssText = 'position:fixed;top:0;left:0;right:0;padding:12px 16px;background:#6C63FF;color:#fff;font:14px/1.4 monospace;z-index:99999;white-space:pre-wrap;word-break:break-all;max-height:50vh;overflow:auto';
  banner.textContent = 'JS loaded — initializing React...';
  document.body.appendChild(banner);
  function showError(msg) { banner.style.background='#c0392b'; banner.textContent=msg; }
  window.onerror = function(msg,src,line,col,err){ showError('ERROR: '+msg+'\\n'+(err?err.stack:src+':'+line)); return false; };
  window.addEventListener('unhandledrejection', function(e){ showError('PROMISE: '+(e.reason?(e.reason.stack||String(e.reason)):'unknown')); });
  var _eu;
  Object.defineProperty(globalThis,'ErrorUtils',{
    get:function(){return _eu;},
    set:function(v){
      _eu=v;
      if(v&&v.reportFatalError){var o=v.reportFatalError.bind(v);v.reportFatalError=function(e){showError('FATAL: '+(e?e.stack||String(e):'?'));o(e);};}
    },configurable:true});
  setTimeout(function(){
    var r=document.getElementById('root');
    if(r&&r.children.length===0){banner.style.background='#e67e22';banner.textContent='#root empty after 3s — React did not mount';}
    else if(r&&r.children.length>0){banner.style.display='none';}
  },3000);
})();
</script>`;

// Insert right before </body>
html = html.replace('</body>', diagnosticScript + '\n</body>');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Patched dist/index.html with diagnostics');
