// analytics.js
let state = "tracking_active";
// Intended logic: "tracking_active", "paused", "disconnected"

function sendEvent() {
  console.log("Sending data... Status: " + state);
}
export { sendEvent };