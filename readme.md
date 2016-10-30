# d3-chart-dot [![Build Status](https://travis-ci.org/lukeed/d3-chart-dot.svg?branch=master)](https://travis-ci.org/lukeed/d3-chart-dot)

> Dot chart with D3.js


## Install

```
$ npm install --save d3-chart-dot
```


## Usage

```js
const DotChart = require('d3-chart-dot');

const chart = new DotChart({
  target: '#chart',
  width: 760,
  mouseover: data => console.log('hovering:', data)
});
```


## API

### DotChart(options)

#### target

Type: `string`<br>
Default: `'#chart'`

The element selector.

## Development

```bash
# build assets & start a dev server
npm run watch

# bundle module for development
npm run build

# start a server on port 3000
npm start

# run code linter & optionally run tests
npm test
```


## License

MIT © [Luke Edwards](https://lukeed.com)
