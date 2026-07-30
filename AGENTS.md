<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Code conventions

## Module member order

Within a file (after imports), keep this order. Within the same kind, keep the author's order — do not alphabetize.

1. `type` / `interface` / `enum`
2. `const` (module-level constants)
3. `let` / `var` (module-level variables, if any)
4. `function` / `class`

Import order is enforced by ESLint (`simple-import-sort`). Do not reorder imports by hand against that config.
