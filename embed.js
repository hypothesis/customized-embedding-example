(function () {
// Prevent double embedding
if (typeof(window.annotator) === 'undefined') {
    window.annotator = {};
} else {
    return;
}

// Injects the hypothesis dependencies. These can be either js or css, the
// file extension is used to determine the loading method. This file is
// pre-processed in order to insert the wgxpath, url and inject scripts.
//
// Custom injectors can be provided to load the scripts into a different
// environment. Both script and stylesheet methods are provided with a url
// and a callback fn that expects either an error object or null as the only
// argument.
//
// For example a Chrome extension may look something like:
//
//   window.hypothesisInstall({
//     script: function (src, fn) {
//       chrome.tabs.executeScript(tab.id, {file: src}, fn);
//     },
//     stylesheet: function (href, fn) {
//       chrome.tabs.insertCSS(tab.id, {file: href}, fn);
//     }
//   });
window.hypothesisInstall = function (inject) {
  inject = inject || {};

  var resources = [];
  var injectStylesheet = inject.stylesheet || function injectStylesheet(href, fn) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = href;

    document.head.appendChild(link);
    fn(null);
  };

  var injectScript = inject.script || function injectScript(src, fn) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = function () { fn(null) };
    script.onerror = function () { fn(new Error('Failed to load script: ' + src)) };
    script.src = src;

    document.head.appendChild(script);
  };

  if (!window.document.evaluate) {
    resources.push('https://hypothes.is/assets/scripts/vendor/wgxpath.install.min.js?0cd5ec8a');
  }

  if (typeof window.Annotator === 'undefined') {
    resources.push('https://hypothes.is/assets/styles/hypothesis.min.css?a1f13d87');
    resources.push('https://hypothes.is/assets/scripts/vendor/url.min.js?2a5acbac');
    resources.push('https://hypothes.is/assets/scripts/hypothesis.min.js?3af1f37d');
  }

  window.hypothesisConfig = function() {
    var Annotator = window.Annotator;
     function MySidebar(elem, options) {
         Annotator.Sidebar.call(this, elem, options);
     }
     MySidebar.prototype = Object.create(Annotator.Sidebar.prototype);

    return {
      constructor: MySidebar
    }
  };

  (function next(err) {
    if (err) { throw err; }

    if (resources.length) {
      var url = resources.shift();
      var ext = url.split('?')[0].split('.').pop();
      var fn = (ext === 'css' ? injectStylesheet : injectScript);
      fn(url, next);
    }
  })();
}

var baseUrl = document.createElement('link');
baseUrl.rel = 'sidebar';
baseUrl.href = 'https://hypothes.is/app.html';
baseUrl.type = 'application/annotator+html';
document.head.appendChild(baseUrl);

window.hypothesisInstall();
})();
