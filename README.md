# Hypothes.is Customized Embedding

**NOTE**: it's early days yet...but promising.

This repo contains an example of our very much in progress customized embedding
options as we explore giving external document viewer authors (et al) the
option to customize how [hypothes.is](http://hypothes.is/) works within their
UI.

Checkout Issue [hypothesis/h#2584](https://github.com/hypothesis/h/issues/2584)
for discussion.

## (Current) Usage

```javascript
window.hypothesisConfig = function() {
  var Annotator = window.Annotator;
  function MySidebar(elem, options) {
    var self = this;

    options.showHighlights = true;
    Annotator.Host.call(this, elem, options);
    self._areHighlightsShowing = options.showHighlights;
    self.on('panelReady', function() {
      var a_highlights = document.createElement('button');
      a_highlights.innerHTML = 'toggle highlights';
      a_highlights.onclick = function() {
        self._areHighlightsShowing = !self._areHighlightsShowing;
        self.setVisibleHighlights(self._areHighlightsShowing);
      };
      document.body.insertBefore(a_highlights,
          document.body.firstElementChild);
    });
  }
  MySidebar.prototype = Object.create(Annotator.Host.prototype);

  return {
    constructor: MySidebar,
  }
};
```

Obviously do something more useful.

Reference
[`Annotator.Host`](https://github.com/hypothesis/h/blob/master/h/static/scripts/annotator/host.coffee)
and
[`Annotator.Sidebar`](https://github.com/hypothesis/h/blob/master/h/static/scripts/annotator/sidebar.coffee)
in the `h` repo for more info.

# License

BSD
