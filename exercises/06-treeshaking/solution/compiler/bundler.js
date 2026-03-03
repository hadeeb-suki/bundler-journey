// @ts-check
// TODO: Implement the bundler step by step

import * as fs from 'fs';
import * as path from 'path';
import { traverse, parse, transformFromAstSync, types as t } from '@babel/core';

/**
 * @param {t.File} ast
 * @param {Set<string>} usedExports the exports the consumer of the module is actually importing
 * @returns {t.File}
 */
function pruneAst(ast, usedExports) {
    // Traverse the AST to find the used identifiers
    // Check for CallExpressions: Functions that are used
    // and add them to the usedIdentifiers set
    const usedIdentifiers = new Set(usedExports);

    traverse(ast, {
        CallExpression(callNode) {
            if (t.isIdentifier(callNode.node.callee)) {
                usedIdentifiers.add(callNode.node.callee.name);
            }
        },
    });


    // Filter ast.program.body to remove
    // 1. Function declarations not in usedIdentifiers
    // 2. Import declarations
    // 2.1 Filter out specifiers that are not in usedIdentifiers
    // 3. Export declarations
    // 3.1 Filter out specifiers that are not in usedExports
    const body = ast.program.body.filter((node) => {
        if (t.isExportNamedDeclaration(node)) {
            node.specifiers = node.specifiers.filter((spec) => t.isIdentifier(spec.exported) && usedExports.has(spec.exported.name));
            return node.specifiers.length > 0;
        }
        if (t.isImportDeclaration(node)) {
            node.specifiers = node.specifiers.filter((spec) => t.isImportSpecifier(spec) && t.isIdentifier(spec.imported) && usedIdentifiers.has(spec.imported.name));
            return node.specifiers.length > 0;
        }
        if (t.isFunctionDeclaration(node) && node.id) return usedIdentifiers.has(node.id.name);

        return true;
    });


    // Create a new AST with the filtered body
    return t.file(t.program(body, [], 'module'));
}

// Step 1: Create Asset
// This function should:
// 1. Read the file content
// 2. Parse it into an AST
// 3. Extract dependencies (import statements) with the imported names
// 3.1 Prune the AST to only include the imported names & their dependencies
// 4. Transform ES6 to CommonJS
// 5. Return an object with { dependencies, code }
/**
 * @param {string} filename
 * @param {Set<string>} usedExports
 * @returns {{dependencies: Map<string, string[]>, code: string}}
 */
function createAsset(filename, usedExports) {

    // Hint: Use fs.readFileSync to read the file
    const content = fs.readFileSync(filename, 'utf-8');

    // Hint: Use parse from @babel/core to create AST with { sourceType: 'module' }
    const ast = parse(content, {
        sourceType: 'module'
    });

    if (!ast) throw new Error('Failed to parse AST');

    // Prune the AST to only include the imported names
    const prunedAst = pruneAst(ast, usedExports);


    // Hint: Use traverse from @babel/core to find ImportDeclaration nodes

    // Extract dependencies
    // Hint: Switch to using a Map for dependencies
    const dependencies = new Map();
    traverse(prunedAst, {
        ImportDeclaration({ node }) {
            const names = [];
            for (const spec of node.specifiers) {
                if (t.isImportSpecifier(spec)) {
                    if (t.isIdentifier(spec.imported)) {
                        names.push(spec.imported.name);
                    }
                }
            }
            dependencies.set(node.source.value, names);
        }
    });



    // Use @babel/plugin-transform-modules-commonjs plugin
    const result = transformFromAstSync(prunedAst, undefined, {
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
 * @returns {Array<{ id: string, dependencies: Map<string, string[]>, code: string }>}
 */
function createModuleGraph(rootDirectory, entry) {
    // Hint: Use a queue (array) for BFS
    // Hint: Use path.resolve and path.dirname to resolve relative paths
    // Hint: Assign a the relative path as the id
    /**@type {Array<{ entry: string, usedExports: string[] }>} */
    const queue = [{ entry, usedExports: [] }];

    const graph = [];

    while (queue.length > 0) {
        // Loop through the queue and create an asset for each entry
        // Add the asset to the graph
        const { entry, usedExports } = /**@type {{ entry: string, usedExports: string[] }} */ (queue.shift());
        const asset = createAsset(path.resolve(rootDirectory, entry), new Set(usedExports));
        graph.push({ id: `./${entry}`, ...asset });
        // For each dependency,
        //  > resolve the relative path to the root directory and add it to the queue
        for (const [relativePath, imported] of asset.dependencies) {
            const relativePathToRoot = path.join(path.dirname(entry), relativePath);
            queue.push({ entry: relativePathToRoot, usedExports: imported });
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
const entry = "index.js";
const graph = createModuleGraph(rootDirectory, entry);
const bundledCode = bundle(graph);

// Start running the entry point
const entryCode = `require("./${entry}")`;

const fullCode = `${bundledCode};\n${entryCode}`;

// Write output
fs.writeFileSync('./dist/bundle.js', fullCode);
console.log('Bundle created successfully!');
