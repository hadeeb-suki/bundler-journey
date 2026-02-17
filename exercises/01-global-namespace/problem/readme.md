# Exercise 1.01: The Global Chaos

## Problem

- **Global name collision:** `search-widget.js` and `analytics.js` both declare a global variable `state`. In a single shared global scope, the second script to load overwrites the first, so one module’s `state` replaces the other’s and behavior is wrong.
- **No isolation:** Any script can read or overwrite `state`; there is no separation between the two modules.

## Solution

Use the **namespace pattern** so only one global exists and each module’s state lives under it:

1. **Single global object**  
   Introduce one global (e.g. `MyApp`). In each script use `var MyApp = MyApp || {};` so the object is created or reused regardless of load order.

2. **Attach modules to that object**
   - `search-widget.js`: put state and `activate` on `MyApp.Search` (e.g. `MyApp.Search = { state: "idle", activate: function () { ... } };`).
   - `analytics.js`: put state and `sendEvent` on `MyApp.Analytics`.

3. **Update the inline script in `index.html`**  
   Replace calls to `activate()` and `sendEvent()` with `MyApp.Search.activate()` and `MyApp.Analytics.sendEvent()`.

## Reference

See the `solution/` folder for a working implementation.
