// Calculator module - wrapped for the loader
define("./calculator", function (module, exports, require) {
  var utils = require("./utils");

  function calculate(operation, a, b) {
    switch (operation) {
      case "add":
        return utils.add(a, b);
      case "subtract":
        return utils.subtract(a, b);
      case "multiply":
        return utils.multiply(a, b);
      default:
        throw new Error("Unknown operation: " + operation);
    }
  }

  module.exports = {
    calculate: calculate,
  };
});
