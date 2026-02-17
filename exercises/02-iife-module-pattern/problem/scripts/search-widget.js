// search-widget.js
var MyApp = MyApp || {}; // Check for existing namespace

MyApp.Search = {
  state: "idle",

  activate: function () {
    this.state = "searching";
    console.log("Search is now " + this.state);
  },
};
