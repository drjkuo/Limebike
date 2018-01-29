var moment = require('moment');
var clone = require('clone');

module.exports = class ItemCounter {
  // constructor
  constructor() {
    this._ride = [];
    this._output = [];
  }

  // getter
  get_items_per_interval() {
    return this._output;
  }
  get_process_ride() {
    return this._ride;
  }

  // split ride into two events (one start event where se is true; one end event where se is false). Each event has the following properties: se(start/end), time, and item.  Then, sort the processed events by time and store it in this._ride
  // @param ride: rides to be processed
  process_ride(ride) {
     var sortedEvents = [], i, tmp;
     for (i=0; i<ride.length; i++) {
        tmp = clone({
           se: true,
           time: moment(ride[i].time[0]),
           item: ride[i].item
        });
        sortedEvents.push(tmp);
        tmp = clone({
           se: false,
           time: moment(ride[i].time[1]),
           item: ride[i].item
        });
        sortedEvents.push(tmp);
     }
     sortedEvents = sortedEvents.sort(function (x,y) {
        if (x.time > y.time) return 1;
        else if (x.time === y.time && x.se === false && y.se === true) return 1;
        else return -1;
     });
     this._ride = sortedEvents;
     return;
  }

  // mergeEvents helper function that merge item property in two sortedEvents i, j into one
  // @param i: one sortedEvent
  // @param j: the other sortedEvent
  // @param addOrDelete: flag to determine to add item or delete item
  // @param property: property(value) to be merged
  // @returns clone(i): merged sortedEvent
  counter (i, j, addOrDelete, property) {
    if (Object.keys(i).length === 0) return j;
    for (var key in j[property]) {
      i[property][key] = (addOrDelete)? (i[property][key]||0)+j[property][key] : (i[property][key]||0)-j[property][key];
    }
    return clone(i);
  }

  // merge duplicate events that include the same time and se property, for example, two start event at the same time, and three end events at the same time
  mergeEvents() {
    var sortedEvents = this._ride;
    for (var i=0; i<sortedEvents.length; i++) {
       for (var j=i+1; j<sortedEvents.length; j++) {
          if ((sortedEvents[i].time === sortedEvents[j].time) && (sortedEvents[i].se === sortedEvents[j].se)) {
             sortedEvents[i] = this.counter(sortedEvents[i], sortedEvents[j], true);
             sortedEvents.splice(j, 1);
             j--;
          }
          else break;
       }
    }
    return;
  }

  // accumulate those sortedEvents
  accumulateEvents() {
    var accumulated = [],
        curSum = {},
        sortedEvents = this._ride;
    for (var i=0; i<sortedEvents.length; i++) {
       curSum.item = clone(this.counter(curSum, sortedEvents[i], sortedEvents[i]["se"], "item")).item;
       curSum.time = sortedEvents[i].time;
       accumulated.push(clone(curSum));
    }
    this._ride =  accumulated;
    return;
  }

  // print and store sortedEvents.  Before that, delete item keys having zero value.
  print_items() {
    var result = this._ride;
    for (var i=1; i<result.length; i++) {
        for (var key in result[i-1].item) {
          if (result[i-1].item[key] === 0) delete result[i-1].item[key];
        }
        var str = "";
        for(var key in result[i-1].item) {
          var num = result[i-1].item[key];
          if (num > 1) str += `${num} ${key}s, `;
          else str += `${num} ${key}, `;
        }
        str = str.slice(0, -2);
        var oneOutput = moment(result[i-1].time).format('hh:mm') + "-" + moment(result[i].time).format('h:mm') + " -> " + str;
        this._output.push(oneOutput);
        console.log(oneOutput);
    }
    return;
  }

  // merge duplicate events, accumulate events, and print
  print_items_per_interval() {
    this.mergeEvents();
    this.accumulateEvents();
    this.print_items();
    return;
  }
}
