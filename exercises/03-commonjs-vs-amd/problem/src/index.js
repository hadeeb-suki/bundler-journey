// Main entry point (CommonJS format)
var calculator = require("./calculator");

console.log("Calculator Demo");
console.log("5 + 3 =", calculator.calculate("add", 5, 3));
console.log("10 - 4 =", calculator.calculate("subtract", 10, 4));
console.log("6 * 7 =", calculator.calculate("multiply", 6, 7));
