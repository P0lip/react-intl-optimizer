# react-intl-optimizer

## Install

```sh
yarn add --dev react-intl-optimizer
```

## Usage

.babelrc

```json
```

Your Webpack config

```js
```

## How does it work?

Babel plugin traverses all ObjectExpression nodes in order to find messages object.
When a matching object is found, it extracts useful data (such as IDs) and assigns it to file's context, which is read and processed by Webpack plugin later on.
Once bundle is about to be emitted, we slice the languages to separate files and make some optimization.
Each language file can be accessed at `messages/{langCode}.json`.

## Features

### keepUnused

If you have a large translation file, containing plenty of IDs/values, it's more than likely that some of them are just not used anywhere in the app.
React-intl-optimizer is able to get rid of such unused messages making the final bundle smaller.
By default, react-intl-optimizer does not remove unused message pairs, as it's still a WIP and may lead to missing messages.

## TODO:

* add some documentation
* tests


## Caveats

* No dynamic ID resolution
* No multiple threads support


## Kudos



## LICENSE

[MIT](https://github.com/P0lip/react-intl-optimizer/blob/master/LICENSE)
