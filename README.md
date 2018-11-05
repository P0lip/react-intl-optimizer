# react-intl-optimizer

## Install

```sh
yarn add --dev react-intl-optimizer
```

or if npm is your package manager

```sh
npm install --save-dev react-intl-optimizer
```

## Description

react-intl-optimizer optimizes the messages and its usage.

## Usage

Make sure to import the plugin

```js
const ReactIntlOptimizer = require('react-intl-optimizer');
```

Then, in your plugins configuration, add an equivalent entry with setup of your choice.
Note that presence of messages is required. All optimizations are opt-in and disabled by default.

```js
plugins: [
  new ReactIntlOptimizer({
    messages: require('./messages.json'),
    optimization: {}, // may be skipped
  }),
],
```

## Options

### messages

Source of your messages. Accepted format:

```
{
  [language: string]: {
    [key: string]: {
       id: string,
       defaultMessage?: string,
       description?: string,
    }
  }
}
```

#### Example:

```json
{
  "en": {
    "id_foo_0": "Foo",
    "id_bar_0": "Bar",
  },
  "jp": {
    "id_foo_0": "Foo",
    "id_bar_0": "Bar",
  }
}
```

### chunkName

If you used named splitChunks, you can provide a name to speed up the build time.
If undefined, all chunks are processed.
Both regexp and plain string value are accepted.

### languages

Array of languages used in the app.
Make sure to include every language you need, as only the provided ones will be included in the final bundle.
A single language entry must match the top-level JSON key property.

#### Example

Given such JSON
```
{
  de: {},
  en: {},
  pl: {},
}
```

and such a config

```js
new ReactIntlOptimizer({
  messages: require('./messages.json'),
  languages: ['de', 'pl'],
});
```

English gets removed from the final bundle.

### defaultLanguage

Default language in your app. For now it's used only by optimization.inlineDefaultLanguage.

### output

Allows you to set custom output path.

#### Default:
```js
langKey => `messages/${langKey}.json`
```

#### Example:

```js
new ReactIntlOptimizer({
  messages: require('./messages.json'),
  output: langKey => `static/messages/${langKey}.json`,
});
```

langKey is optional and might be undefined if optimization.sliceLanguages is not enabled.

### optimization

For example output, please refer to tests.

### optimization.inlineDefaultLanguage

Inlines default messages into given message descriptor. defaultLanguage must be provided.
It may speed up boot time, since no request for languages might be needed.

### optimization.removeUnused

Removes unused message descriptors.
If you have a large translation file, containing plenty of IDs/values, it's more than likely that some of them are just not referenced anywhere in the app.
react-intl-optimizer is able to get rid of such unused pairs making the final bundle smaller.
Keep in mind that if you whitelist IDs, they will occur in the final bundle.

### optimization.removeValues

Exclude any matching messages from final bundle.
Note, an array of strings must be provided.

#### Example

given `removeValues: ['N/A']`

```json
{
  "en": {
    "id_foo_0": "N/A",
    "id_bar_0": "Foo"
  },
}
```

is transformed to

```json
{
  "en": {
    "id_foo_0": "Foo"
  },
}
```

### optimization.mergeDuplicates

Merges equal message descriptors.

#### Example

```json
{
  "en": {
    "id_foo_0": "Foo",
    "id_bar_0": "Foo"
  },
  "jp": {
    "id_foo_0": "Foo",
    "id_bar_0": "Foo"
  }
}
```

is transformed to

```json
{
  "en": {
    "id_foo_0": "Foo"
  },
  "jp": {
    "id_foo_0": "Foo"
  }
}
```

and the IDs in messages definitions are rewritten to match.

```js
defineMessages({
  Foo: {
    id: "id_foo_0",
  },
  Bar: {
    id: "id_bar_0",
  }
}
```

is transformed to

```js
defineMessages({
  Foo: {
    id: "id_foo_0",
  },
  Bar: {
    id: "id_foo_0",
  }
}
```

### optimization.minifyIDs

Minifies message descriptor's id. Useful when your messages file have message descriptors with lengthy IDs.

### optimization.trimWhitespaces

Trims all trailing whitespaces in translations.

### optimization.splitLanguages

Currently, there is no way to disable that optimization, but its support will be added soon.

Splits languages to separate files. Useful when you have lots of languages containing plenty of message descriptors.

### optimization.whitelist

#### Default

`[]`

Disallows the following optimizations for matching IDs.

* removeUnused
* minifyIDs

#### Example

```js
new ReactIntlOptimizer({
  messages: require('./messages.json'),
  optimization: {
    removeUnused: true,
    whitelist: ['id_foo_0'],
  },
});
```

`id_foo_0` won't be removed and minified.

## Caveats

* No dynamic ID resolution

## LICENSE

[MIT](https://github.com/P0lip/react-intl-optimizer/blob/master/LICENSE)
