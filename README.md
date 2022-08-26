# sample-extension

Created With

https://www.npmjs.com/package/vue-cli-plugin-chrome-extension-cli

```bash
# example where app is 'sample-extension'
vue create sample-extension

cd sample-extension/

vue add chrome-extension-cli
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

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
