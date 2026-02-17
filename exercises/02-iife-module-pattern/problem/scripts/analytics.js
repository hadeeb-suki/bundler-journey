// analytics.js
var MyApp = MyApp || {}; // Check for existing namespace

MyApp.Analytics = {
  state: "tracking_active",

  sendEvent: function () {
    console.log("Sending data... Status: " + this.state);
  },
};
