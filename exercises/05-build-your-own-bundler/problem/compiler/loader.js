// Simple Module Loader - Makes CommonJS work in the browser
// This demonstrates how module loaders work under the hood

// The Module Registry - stores all modules
var modules = {};

// Define function - registers a module
function define(id, factory) {
  modules[id] = factory;
}

// Require function - loads and executes a module
function require(id) {
  // Check if module is already cached
  if (modules[id].exports) {
    return modules[id].exports;
  }

  // Create module object
  var module = { exports: {} };

  // Execute the factory function
  // The factory receives: module, exports, require
  modules[id](module, module.exports, require);

  // Cache the exports
  modules[id].exports = module.exports;

  return module.exports;
}

// Make require and define available globally
window.define = define;
window.require = require;
