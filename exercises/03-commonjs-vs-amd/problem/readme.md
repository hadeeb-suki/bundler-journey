# Exercise 3.01: The Universal Loader

With Node.js, the CommonJS format became the defacto standard of writing javascript modules.
## The Problem

You have a Node.js project written in CommonJS format (using `require` and `module.exports`). When you try to run this code in a browser, you get: `Uncaught ReferenceError: require is not defined`.

This happens because `require` is not a JavaScript keyword—it's a function provided by the Node.js runtime. Browsers don't have this function.

## Your Mission

Build a simple module loader that makes CommonJS work in the browser. You'll create a mock `require` and `module.exports` system that demonstrates how module loaders work under the hood.

## Steps to Complete

### Part 1: Understand the Failure

- [ ] Open `index.html` in your browser
- [ ] Open the console and observe the error: `require is not defined`
- [ ] Understand that `require` is not a JavaScript keyword, but a runtime function

### Part 2: Convert to AMD (Optional - Experience the Pain)

- [ ] Convert `utils.js` to AMD format using `define()`
- [ ] Convert `calculator.js` to AMD format
- [ ] Notice how the code expands from 3 lines to 10+ lines of boilerplate
- [ ] This demonstrates why developers wanted CommonJS syntax in browsers

### Part 3: Build a Mock Loader

Create a `loader.js` file that implements:

1. **Module Registry**: An object to store modules: `var modules = {};`

2. **Define Function**: A function that registers modules:
   ```javascript
   function define(id, factory) {
       modules[id] = factory;
   }
   ```

3. **Require Function**: A function that loads and executes modules:
   ```javascript
   function require(id) {
       var module = { exports: {} };
       // Execute the factory function
       modules[id](module, module.exports, require);
       return module.exports;
   }
   ```

4. **Convert Modules**: Wrap each CommonJS module in a `define()` call that converts it to work with your loader

## Learning Objectives

- Understand that `require` is not magic—it's just a function
- Experience the "Schism" between CommonJS (clean syntax) and AMD (browser-compatible)
- Learn how module loaders work: they're just functions wrapping code in closures
- See that modules are stored in a lookup table (object)

## Hints

- The loader needs to convert CommonJS modules to a format it can understand
- Each module needs to be wrapped in a factory function
- The factory function receives `module`, `exports`, and `require` as parameters
- Store modules in an object: `modules['./utils'] = function(module, exports, require) { ... }`

## Expected Solution Structure

Your `loader.js` should:
1. Define a module registry
2. Provide `define()` and `require()` functions
3. Convert the CommonJS modules to work with the loader
4. Execute the entry point (`index.js`)

## Bonus Challenge

After completing the basic loader, try to:
- Handle circular dependencies
- Implement module caching (don't re-execute modules that are already loaded)
- Support relative path resolution (`./utils` → actual file path)
