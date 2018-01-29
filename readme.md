# LimeBike -- Bike Basket

## Install

1. Install prerequisites:

   * [NPM](https://www.npmjs.com/)
   * [Node](https://nodejs.org/en/)

2. Install this repo:

    `npm install`

## Demo

run `node index.js`

```javascript

var ItemCounter = require('./ItemCounter');

var ride = [
   {
      time: [new Date('2018-01-28 07:00'), new Date('2018-01-28 07:30')],
      item: {
         apple: 2,
         brownie: 1
      }
   },
   {
      time: [new Date('2018-01-28 07:10'), new Date('2018-01-28 08:00')],
      item: {
         apple: 1,
         carrot: 3
      }
   },

   {
      time: [new Date('2018-01-28 07:20'), new Date('2018-01-28 07:45')],
      item: {
         apple: 1,
         brownie: 2,
         diamond: 4
      }
   }
];

var ic = new ItemCounter();
ic.process_ride(ride);
ic.print_items_per_interval();
```

## Testing

run `mocha`
