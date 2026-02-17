## Intro
The idea is to understand what JS modules are, how we reached at the current position, why certain questionable quirks around modules exist, etc.
So that we understand tradeoffs when we make architectural decisions, and be aware of issues that may come up.

To understand modules & bundling, let's go back to the earlier days of JS dev, where JS was a small scripting language, only acting as an enhancement for HTML pages.
There small handwritten scripts inserted into HTML pages, there were `function`, `var`, and basic data types like `number`, `string`, `boolean`,etc. And Object and arrays. We won't go into classes/inheritance, and all that.

### Problems
1. `var` can be overridden
2. Scripts share a common scope. An HTML problem
3. Scope is created only for `function`s (mention closure)

### Journey
Wants to write code as modules -> A module is an encapsulated set of code.
Namespacing as a solution -> Naming collision
IIFE for encapsulation
CommonJS became standard
Tooling to convert `CommonJS -> IIFE wrapper`
CommonJS is synchronous. Doesn't work in browsers -> ES Modules introduced
type=module, separate scope
ES Modules: Uses keywords vs functions. Static Analysis, JS Engines can scan & load deps async.
Introduce caniuse.com
Browser support is low. IE does not update anymore.
Tooling to convert `ES Modules -> CommonJS -> IIFE wrapper`


### Key points
1. A module is an encapsulated set of code.
2. Modules interact with each other through import/export. Different keywords in different languages

### Modern tooling
1. Flat bundling / hoisting
2. Side-effects: what, why & why not
3. Treeshaking