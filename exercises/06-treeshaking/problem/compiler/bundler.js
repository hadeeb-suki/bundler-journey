// @ts-check

import * as fs from 'fs';
import * as path from 'path';
import { traverse, parse } from '@babel/core';
import * as t from '@babel/types';


// Step 1: Create Asset
// This function should:
// 1. Read the file content
// 2. Parse it into an AST
// 3. Extract dependencies (import statements) with the imported names
// 4. Return the AST with the dependencies, AST can be converted to code later
/**
 * @param {string} filename
 * @returns {{dependencies: Map<string, string[]>, ast: any, exports: Set<string>}}
 */
function createAsset(filename) {
    // Hint: Use fs.readFileSync to read the file
    const content = fs.readFileSync(filename, 'utf-8');

    // Hint: Use parse from @babel/core to create AST with { sourceType: 'module' }
    const ast = parse(content, {
        sourceType: 'module'
    });

    if (!ast) throw new Error('Failed to parse AST');

    // Hint:Keep a map of used imports
    // Replace Set with a Map

    // Extract dependencies
    const dependencies = new Map();
    const exports = new Set();

    traverse(ast, {
        ImportDeclaration: ({ node }) => {
            const names = []
            for (const spec of node.specifiers) {
                if (t.isImportSpecifier(spec)) {
                    if (t.isIdentifier(spec.imported)) {
                        names.push(spec.imported.name);
                    }
                }
            }
            dependencies.set(node.source.value, names);
        },
        ExportNamedDeclaration: ({ node }) => {
            for (const spec of node.specifiers) {
                if (t.isIdentifier(spec.exported)) {
                    exports.add(spec.exported.name);
                }
            }
        }
    });

    return { dependencies, ast, exports };
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
 * @returns {Array<{ id: string, ast: any, dependencies: Map<string, string[]>, exports: Set<string> }>}
 */
function createModuleGraph(rootDirectory, entry) {
    // Hint: Use a queue (array) for BFS
    // Hint: Use path.resolve and path.dirname to resolve relative paths
    // Hint: Assign a the relative path as the id
    const queue = [entry];

    const graph = [];

    // Find all dependencies and add them to the queue
    for (let i = 0; i < queue.length; i++) {
        const entry = queue[i];
        const asset = createAsset(path.resolve(rootDirectory, entry));
        graph.push({ id: `./${entry}`, ...asset });
        // Resolve dependencies
        for (const [source, _] of asset.dependencies) {
            const relativePathToRoot = path.join(path.dirname(entry), source);
            queue.push(relativePathToRoot);
        }
    }

    return graph;
}

// Step 3: Bundle
// This function should:
// 1. Go through each item in the graph and generate the module code
// 2. Generate the loader code from "./compiler/loader.js"
// 3. Merge everything together and return the final bundle string
/**
 * @param {ReturnType<typeof createModuleGraph>} graph
 * @param {string} rootDirectory
 * @param {string} entry
 * @returns {string}
 */
function bundle(graph, rootDirectory, entry) {

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
const bundledCode = bundle(graph, rootDirectory, entry);

// Start running the entry point
const entryCode = `require("${entry}")`;

const fullCode = `${bundledCode};\n${entryCode}`;

// Write output
fs.writeFileSync('./dist/bundle.js', fullCode);
console.log('Bundle created successfully!');
