// analytics.js
var MyApp = MyApp || {};

MyApp.Analytics = (function () {
  var state = "tracking_active";

  function sendEvent() {
    console.log("Sending data... Status: " + state);
  }

  return {
    sendEvent: sendEvent,
  };
})();
