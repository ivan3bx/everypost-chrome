# EveryPost Chrome Extension

Built with Vue 3, Vite, TypeScript, and Tailwind CSS. Targets Chrome Manifest V3.

## Project Layout

```text
./dist               - compiled extension output (load this in Chrome)
./src                - all source files
./src/chrome         - Chrome extension scripts (background, content scripts)
./src/entry          - Vue entry points (HTML + TS pairs)
./src/view           - Vue components
./src/assets         - static assets used by components
./manifest.json      - Chrome extension manifest (single source of truth)
./tests              - unit tests
```

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

```bash
npm install
```

## Development

### Watch mode (recommended for Chrome extension development)

Builds the extension and rebuilds automatically on file changes:

```bash
npm run dev
```

Then load `./dist` as an unpacked extension in Chrome (see [Loading in Chrome](#loading-in-chrome)).
Chrome will pick up most changes automatically when files rebuild — for background script
changes you may need to click the reload icon on `chrome://extensions`.

### Loading in Chrome

1. Go to `chrome://extensions`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked** and select the `./dist` folder
4. The extension icon appears in the toolbar

## Build for Production

```bash
npm run build
```

Output is written to `./dist`. The manifest's `host_permissions` will not include
`http://localhost:3000/*` (that is injected only in development mode).

## Testing

### Run unit tests (watch mode)

```bash
npm test
```

### Run unit tests once (CI)

```bash
npm run test:unit
```

Tests use [Vitest](https://vitest.dev/) with `jsdom` and are configured inline in `vite.config.ts`.

## Linting

```bash
npm run lint
```

Uses ESLint v9 with flat config (`eslint.config.mjs`). Automatically fixes fixable issues.

## Toolchain

| Tool | Purpose |
|------|---------|
| [Vite](https://vitejs.dev/) | Build tool |
| [vite-plugin-web-extension](https://vite-plugin-web-extension.aklinker1.io/) | Chrome extension build support |
| [Vue 3](https://vuejs.org/) | UI framework |
| [Vitest](https://vitest.dev/) | Unit testing |
| [ESLint v9](https://eslint.org/) | Linting (flat config) |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
