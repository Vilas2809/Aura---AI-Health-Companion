if (typeof window !== 'undefined') {
  window.onerror = function (msg, src, line, col, err) {
    document.body.style.cssText = 'background:#0F1117;color:#FF4C4C;padding:20px;font-family:monospace;overflow:auto';
    document.body.innerHTML =
      '<h2 style="color:#FF4C4C">Crash: ' + msg + '</h2>' +
      '<pre style="color:#ccc;font-size:12px;white-space:pre-wrap">' + (err ? err.stack : src + ':' + line) + '</pre>';
    return false;
  };
  window.addEventListener('unhandledrejection', function (e) {
    document.body.style.cssText = 'background:#0F1117;color:#FF4C4C;padding:20px;font-family:monospace;overflow:auto';
    document.body.innerHTML =
      '<h2 style="color:#FF4C4C">Unhandled Promise Rejection</h2>' +
      '<pre style="color:#ccc;font-size:12px;white-space:pre-wrap">' + (e.reason ? (e.reason.stack || e.reason) : 'unknown') + '</pre>';
  });
}

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
