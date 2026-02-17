// Utility functions module - wrapped for the loader
define("./utils", function (module, exports, require) {
  function add(a, b) {
    return a + b;
  }

  function subtract(a, b) {
    return a - b;
  }

  function multiply(a, b) {
    return a * b;
  }

  module.exports = {
    add: add,
    subtract: subtract,
    multiply: multiply,
  };
});
