import { add, subtract, multiply } from "./utils.js";

function multiply32bit(a, b) {
  return Math.imul(a, b);
}

function calculate(operation, a, b) {
  switch (operation) {
    case "add":
      return add(a, b);
    case "subtract":
      return subtract(a, b);
    case "multiply":
      return multiply32bit(a, b);
    default:
      throw new Error("Unknown operation: " + operation);
  }
}

export { calculate };
