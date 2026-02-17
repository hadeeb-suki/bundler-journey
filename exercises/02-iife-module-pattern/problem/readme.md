# Exercise 2.01: The Secure Vault

## Problem

Starter code is the **namespace-pattern** app from Exercise 1 (search widget + analytics). `MyApp.Search` and `MyApp.Analytics` each expose a `state` property. Because it lives on the public object, any script can read or overwrite it. Namespaces organize code but do not hide state.

## Solution

Refactor both modules to the **IIFE + Revealing Module** pattern:

1. **IIFE** – Wrap each module in an immediately invoked function: `MyApp.Search = (function () { ... })();`
2. **Private state** – Declare `state` (and any other internal data) as a `var` inside the IIFE. It is not on the returned object, so it is not accessible from outside.
3. **Public API** – Return only the methods that callers need: `activate` for Search, `sendEvent` for Analytics. Use the same names so `MyApp.Search.activate()` and `MyApp.Analytics.sendEvent()` still work.
4. **Closure** – Internal functions close over the private `state` variable; the API is the only way to affect it.

After refactoring, `MyApp.Search.state` and `MyApp.Analytics.state` are undefined from the outside; behavior is unchanged for the intended API.

## Verification

- In the console, `MyApp.Search.activate()` and `MyApp.Analytics.sendEvent()` behave as before.
- `MyApp.Search.state` is undefined (or missing). Assigning to it no longer affects the module’s internal state.

## Reference

See the `solution/` folder for the IIFE implementation.
