# vitest browser mode: `navigator.clipboard.readText()` fails on WebKit

The same code (grant `clipboard-read`, click a button that writes to the
clipboard, then read it back) passes with `@playwright/test` but throws
`NotAllowedError` in Vitest browser mode on WebKit:

```
NotAllowedError: The request is not allowed by the user agent or the platform
in the current context, possibly because the user denied permission.
```

- [`playwright-test/`](./playwright-test) uses `@playwright/test` -> **passes**
- [`vitest-test/`](./vitest-test) uses Vitest browser mode (Playwright provider) -> **fails**

Both grant `clipboard-read` and run WebKit headless via Playwright.

## Run

```sh
cd playwright-test && pnpm install && pnpm exec playwright install webkit && pnpm test
cd vitest-test     && pnpm install && pnpm exec playwright install webkit && pnpm test
```

## Cause

Vitest runs each test inside an iframe whose Permissions Policy is
`allow="clipboard-write;"`. It omits `clipboard-read`, so WebKit blocks
`navigator.clipboard.readText()` regardless of the granted context permission.
