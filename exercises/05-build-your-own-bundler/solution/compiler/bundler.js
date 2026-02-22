// @ts-check
// TODO: Implement the bundler step by step

import * as fs from 'fs';
import * as path from 'path';
import { traverse, parse, transformFromAstSync } from '@babel/core';


// Step 1: Create Asset
// This function should:
// 1. Read the file content
// 2. Parse it into an AST
// 3. Extract dependencies (import statements)
// 4. Transform ES6 to CommonJS
// 5. Return an object with { dependencies, code }
/**
 * @param {string} filename
 * @returns {{dependencies: Set<string>, code: string}}
 */
function createAsset(filename) {

    // Hint: Use fs.readFileSync to read the file
    const content = fs.readFileSync(filename, 'utf-8');

    // Hint: Use parse from @babel/core to create AST with { sourceType: 'module' }
    const ast = parse(content, {
        sourceType: 'module'
    });

    if (!ast) throw new Error('Failed to parse AST');

    // Hint: Use traverse from @babel/core to find ImportDeclaration nodes

    // Extract dependencies
    const dependencies = new Set();


    traverse(ast, {
        ImportDeclaration: ({ node }) => {
            dependencies.add(node.source.value);
        }
    });

    // Hint: Use transformFromAstSync to convert AST to CommonJS
    // Use @babel/plugin-transform-modules-commonjs plugin
    const result = transformFromAstSync(ast, undefined, {
        plugins: [['@babel/plugin-transform-modules-commonjs', { strict: true }]],

    });

    if (!result || !result.code) throw new Error('Failed to transform AST');

    const { code } = result;


    return { dependencies, code };
}

// Step 2: Create Module Graph
// This function should:
// 1. Start with the entry file
// 2. use createAsset to transform the file & find dependencies
// 2. Repeat for all dependencies
// 3. Use the filepath as the id
// 4. Return an array of all assets
/**
 * @param {string} rootDirectory
 * @param {string} entry
 * @returns {Array<{ id: string, code: string }>}
 */
function createModuleGraph(rootDirectory, entry) {
    // Hint: Use a queue (array) for BFS
    // Hint: Use path.resolve and path.dirname to resolve relative paths
    // Hint: Assign a the relative path as the id
    const absolutePath = path.resolve(rootDirectory, entry);
    const mainAsset = createAsset(absolutePath);
    const queue = [{ ...mainAsset, id: entry }];

    // Find all dependencies and add them to the queue
    for (let i = 0; i < queue.length; i++) {
        const asset = queue[i];
        // Resolve dependencies
        asset.dependencies.forEach(relativePath => {
            const absolutePath = path.join(rootDirectory, relativePath);
            const child = createAsset(absolutePath);
            queue.push({ ...child, id: relativePath });
        });
    }

    return queue;
}

// Step 3: Bundle
// This function should:
// 1. Go through each item in the graph and generate the module code
// 2. Generate the loader code from "./compiler/loader.js"
// 3. Merge everything together and return the final bundle string
/**
 * @param {ReturnType<typeof createModuleGraph>} graph
 * @returns {string}
 */
function bundle(graph) {

    // Hint: Create module code for each item in the graph
    // define("id of the module", function(module, exports,require) { source code of the module })
    const modules = graph.map(asset => {
        return (`define("${asset.id}", function(module,exports,require) {
                ${asset.code}
            });`);
    });
    // Merge all module code together
    const moduleCode = modules.join('\n')

    // Hint: Read "./compiler/loader.js" as string
    const loaderCode = fs.readFileSync('./compiler/loader.js', 'utf-8');
    // Hint: Merge everything together and return the final bundle string
    return `${loaderCode}\n${moduleCode}`
}

// Main execution
const rootDirectory = path.join(process.cwd(), 'scripts');
const entry = "./index.js";
const graph = createModuleGraph(rootDirectory, entry);
const bundledCode = bundle(graph);

// Start running the entry point
const entryCode = `require("${entry}")`;

const fullCode = `${bundledCode};\n${entryCode}`;

// Write output
fs.writeFileSync('./dist/bundle.js', fullCode);
console.log('Bundle created successfully!');
