// search-widget.js
var MyApp = MyApp || {};

MyApp.Search = (function () {
  var state = "idle";

  function activate() {
    state = "searching";
    console.log("Search is now " + state);
  }

  return {
    activate: activate,
  };
})();
