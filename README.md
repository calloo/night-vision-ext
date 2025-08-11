## Disclaimer

I have created my own fork of night-vision-ext repo, as it seems the author is no longer active, and no recent contributions from others have been accepted, still all pending.

![PepeNV](https://github.com/calloo/night-vision-ext/blob/main/docs/docs/public/nv-banner.jpeg?raw=true)

<div align="center">

![npm](https://img.shields.io/npm/v/night-vision-ext.svg?color=brightgreen&label=version) ![license](https://img.shields.io/badge/license-MIT-blue.svg) ![build](https://img.shields.io/badge/build-passing-brightgreen.svg)

</div>

# <center> Night Vision EXT Charts™ </center>

**NightVision-EXT** is a highly customizable charting library, created for professional traders. It is a continuation of [TradingVueJS](https://github.com/tvjsx/trading-vue-js) project, borrowing its core ideas, but applying better design decisions and improving performance. Built with Svelte.   

Start your charting journey with our interactive [**[DOCS]**](https://calloo.github.io/night-vision-ext/guide/intro/night-vision-ext-charts.html).

![Screen](https://raw.githubusercontent.com/calloo/night-vision-ext/main/docs/docs/public/screen.png)

## Installation

```sh
npm i night-vision-ext
```

## Usage

```js

import { NightVision } from 'night-vision-ext'

let chart = new NightVision('<root-element-id>')

// Generate some random data
function data() {
    return Array(30).fill(1).map((x, i) => [
        new Date(`${i+1} Nov 2022 GMT+0000`).getTime(),
        i * Math.random()
    ])
}

// Set the dataset
chart.data = {
    panes: [{
        overlays: [{
            name: 'APE Stock',
            type: 'Spline',
            data: data(),
            settings: {
                precision: 2
            }
        }]
    }]
}
```

## Roadmap
- NavyJS tutorial
- Data API (the high-level API)
- *Add tool overlays* ???
- *Toolbar* ??? 
- Mobile support
