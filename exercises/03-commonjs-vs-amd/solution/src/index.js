// Main entry point - wrapped for the loader
define("./index", function (module, exports, require) {
  var calculator = require("./calculator");

  console.log("Calculator Demo");
  console.log("5 + 3 =", calculator.calculate("add", 5, 3));
  console.log("10 - 4 =", calculator.calculate("subtract", 10, 4));
  console.log("6 * 7 =", calculator.calculate("multiply", 6, 7));
});
