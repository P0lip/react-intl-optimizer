All the needed setup is done in webpack.config.js.

To build the project:

```bash
yarn
yarn build
npx serve dist/
```

and go to localhost:5000

IntlConnector makes use of react-intl-optimizer client, which fetches messages and caches them in IndexedDB.
This may be unneeded for React Native.
The client requires html-webpack-plugin, as it stores checksums.
See code for more info + make sure to have network tab open to see how requests are made.
