# EveryPost Chrome Extension

## Project Layout

```text
./dist               - output of chrome extension
./src                - all source files
./src/chrome         - chrome extension javascript files
./src/entry          - Vue entry points
./src/view           - Vue components
./src/assets         - assets (used by components)
./public/_base.html  - template file (used to generate Vue entry points)
./public/index.html  - dev page (eg. "npm run serve")
./tests              - tests
```

## Testing chrome extension in-browser

Default route will no longer load. `vuejs.config.js` maps each component
in `src/entry/..` into its own page.

```js
const chromeName = getEntryFile(path.resolve(`src/entry`))
// ...
chromeName.forEach((name) => {
    // ...
    pages[fileName] = {
        entry: `src/entry/${name}`,
        template: 'public/index.html',
        filename: `${fileName}.html`
    }
})
```

Therefore, to test `src/entry/main.ts` (or any file that mounts '#app' via `createApp()`)
the URL looks like:  http://localhost:8080/main.html

## Project setup

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
# executes build + watch for chrome extension development
npm run build-watch
```

### Compiles and minifies for production

```bash
npm run build
```

### Run your unit tests

```bash
npm run test:unit
```

### Lints and fixes files

```bash
npm run lint
```

## How this project was generated

https://www.npmjs.com/package/vue-cli-plugin-chrome-extension-cli

```bash
# Created a Vue.js project
vue create sample-extension
cd sample-extension/

# Add chrome extension support
vue add chrome-extension-cli
```

Update default `vue.config.js` to keep serviceWorker code separate from Vue
and to use a different 'base' template for entry pages.

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
