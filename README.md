# playwright-safari-clipboard-read-issue

Minimal reproduction for a Playwright bug: `navigator.clipboard.readText()`
throws `NotAllowedError` in **WebKit on macOS**, even after
`context.grantPermissions(['clipboard-read'])`.

```
NotAllowedError: The request is not allowed by the user agent or the platform
in the current context, possibly because the user denied permission.
```

## Why this looks like a bug

This test mirrors Playwright's own
[`should support clipboard read`](https://github.com/microsoft/playwright/blob/main/tests/library/permissions.spec.ts)
test. That test only marks WebKit as broken on:

- Windows (`WebPasteboardProxy::allPasteboardItemInfo not implemented`)
- Linux / WPE when headless

macOS WebKit is expected to pass, but it fails here.

## Run locally

```sh
pnpm install
pnpm exec playwright install
pnpm test
```

## CI

`.github/workflows/ci.yml` runs the test on `macos-latest` and `ubuntu-latest`
across the `chromium` and `webkit` projects. `chromium` passes everywhere;
`webkit` fails the clipboard read on macOS.
