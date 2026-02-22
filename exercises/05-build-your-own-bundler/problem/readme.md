# Exercise 4.01: Build Your Own Bundler

## The Challenge

You're going to build "Minipack" - a simple JavaScript bundler from scratch! This exercise will demystify how tools like Webpack work under the hood.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create the output directory:
   ```bash
   mkdir -p dist
   ```

## Your Mission

Implement the three core functions in `compiler/bundler.js`:

### Step 1: `createAsset(filename)`

This function should:
- Read the file content using `fs.readFileSync`
- Parse it into an AST using `@babel/parser` with `{ sourceType: 'module' }`
- Use `@babel/traverse` to find all `ImportDeclaration` nodes
- Extract the import paths into a `dependencies` array
- Transform the AST to CommonJS using `transformFromAst` with preset `'env'`
- Return: `{ filename, dependencies, code }`

**Hint**: Look for `ImportDeclaration` in the traverse visitor.

### Step 2: `createGraph(entry)`

This function should:
- Start with the entry file in a queue
- For each file in the queue:
  - Create an asset using `createAsset`
  - Resolve relative import paths to absolute paths
  - Add dependencies to the queue
  - Assign a unique ID (array index) to each asset
- Return an array of all assets

**Hint**: Use BFS (Breadth-First Search) with a queue. Use `path.resolve(dirname, relativePath)` to resolve imports.

### Step 3: `bundle(graph)`

This function should:
- Create a modules object where each module is: `{ id: [function, mapping] }`
- Each function wraps the module code and receives `(require, module, exports)`
- The mapping object maps relative paths (like `'./message.js'`) to module IDs
- Generate a `require` function that:
  - Takes a module ID
  - Creates a `localRequire` function for relative paths
  - Executes the module function
  - Returns `module.exports`
- Wrap everything in an IIFE: `(function(modules) { ... })({ ... })`
- Return the final bundle string

**Hint**: The bundle structure should look like:
```javascript
(function(modules) {
  function require(id) { ... }
  require(0); // Start with entry point
})({
  0: [function(require, module, exports) { ... }, {'./greeting.js': 1}],
  1: [function(require, module, exports) { ... }, {'./message.js': 2}],
  2: [function(require, module, exports) { ... }, {}]
});
```

## Steps to Complete

- [ ] Install dependencies: `npm install`
- [ ] Implement `createAsset()` function
- [ ] Test `createAsset()` on a single file
- [ ] Implement `createGraph()` function
- [ ] Test `createGraph()` to see the dependency graph
- [ ] Implement `bundle()` function
- [ ] Run `npm run build` to generate the bundle
- [ ] Run `npm run test` to verify the bundle works
- [ ] Check the solution if you get stuck

## Learning Objectives

- Understand how ASTs are used to analyze code
- Learn how bundlers traverse dependency graphs
- See how modules are wrapped and executed
- Demystify the "magic" of require() in bundles

## Expected Output

After running `npm run build`, you should see:
- A `dist/bundle.js` file that can run in Node.js
- Console output: "Hello from Minipack! Welcome, Developer!"

## Hints

- Use `path.dirname(filename)` to get the directory for resolving relative imports
- Use `path.resolve(dir, relativePath)` to convert relative to absolute paths
- Remember to add `.js` extension when resolving imports
- The module wrapper function should convert the CommonJS code to work with your require system
