let state = "idle";

function activate() {
  state = "searching";
  console.log("Search is now " + state);
}

function deactivate() {
  state = "idle";
  console.log("Search is now " + state);
}

export { activate, deactivate };