# LimeBike -- Bike Basket

## Ideas

`process_ride(ride)`: Processes a Ride object that contains metadata about the ride, including: start time, end time, and bike basket items.

`print_items_per_interval()`: Prints a summary of the numbers of each type of item in transit during any given time interval. Excludes time intervals during which no items were in transit.

## Implementation
#### process_ride(ride)

`process_ride(ride)`: split ride into two events (one start event where se is true; one end event where se is false). Each event has the following properties: se(start/end), time, and item.  Then, sort the processed events by time and store it in this._ride

Ride
```javascript
{
   time: [new Date('2018-01-28 07:00'), new Date('2018-01-28 07:30')],
   item: {
      apple: 2,
      brownie: 1
   }
}
```

Events
```javascript
{
  se: true,
  time: moment("2018-01-28T07:00:00.000"),
  item: { apple: 2, brownie: 1 }
}

{
  se: false,
  time: moment("2018-01-28T07:30:00.000"),
  item: { apple: 2, brownie: 1 }
}
```


#### print_items_per_interval()
```javascript
print_items_per_interval() {
  this.mergeEvents();
  this.accumulateEvents();
  this.print_items();
  return;
}
```

`print_items_per_interval()` includes three sub functions: `mergeEvents()`; `accumulateEvents()`; `print_items()`.

`mergeEvents()`: merge duplicate events that include the same time and se property, for example, two start events at the same time, and three end events at the same time

`accumulateEvents()`: accumulate those sortedEvents

`print_items()`: print and store those sortedEvents



## Install

1. Install prerequisites:

   * [NPM](https://www.npmjs.com/)
   * [Node](https://nodejs.org/en/)

2. Install this repo:

    `npm install`

## Demo

run `node index.js`

![alt](https://github.com/drjkuo/Limebike/blob/master/index.png)




## Testing

`npm install -g mocha`

run `mocha`

![alt](https://github.com/drjkuo/Limebike/blob/master/test.png)
