// search-widget.js
let state = "idle";
// Intended logic: "idle", "searching", "results_found"

function activate() {
  state = "searching";
  console.log("Search is now " + state);
}

export { activate };