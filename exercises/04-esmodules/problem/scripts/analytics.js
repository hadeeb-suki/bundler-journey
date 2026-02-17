// analytics.js
var state = "tracking_active";
// Intended logic: "tracking_active", "paused", "disconnected"

function sendEvent() {
  console.log("Sending data... Status: " + state);
}
