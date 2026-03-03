let state = "tracking_active";

function pause() {
  state = "paused";
  console.log("Paused the tracker");
}

function sendEvent() {
  console.log("Sending data... Status: " + state);
}

export { sendEvent, pause };