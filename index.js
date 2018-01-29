var moment = require('moment');
var clone = require('clone');

module.exports = class ItemCounter {

  constructor() {
    this._ride = [];
    this._output = [];
  }

  get_items_per_interval() {
    return this._output;
  }

  counter (i, j, addOrDelete, property) {
    if (Object.keys(i).length === 0) return j;
    for (let key in j[property]) {
      i[property][key] = (addOrDelete)? (i[property][key] || 0)+j[property][key] : (i[property][key] || 0)-j[property][key];
    }
    return clone(i);
  }

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
     // console.log(this._ride);
     return this._ride;
  }

  mergeEvents() {
    var sortedEvents = this._ride;
    for (let i=0; i<sortedEvents.length; i++) {
       for (let j=i+1; j<sortedEvents.length; j++) {
          if ((sortedEvents[i].time === sortedEvents[j].time) && (sortedEvents[i].se === sortedEvents[j].se)) {
             console.log(sortedEvents[i], sortedEvents[j]);
             sortedEvents[i] = this.counter(sortedEvents[i], sortedEvents[j], true);
             console.log("merged");
             sortedEvents.splice(j, 1);
             j--;
             console.log(sortedEvents[i], sortedEvents[j]);
          }
          else break;
       }
    }
  }

  accumulateItem() {
    var accumulated = [],
        curSum = {},
        sortedEvents = this._ride;
    for (let i=0; i<sortedEvents.length; i++) {
       // console.log("before", curSum);
       curSum.item = clone(this.counter(curSum, sortedEvents[i], sortedEvents[i]["se"], "item")).item;
       curSum.time = sortedEvents[i].time;
       // console.log("each", curSum);
       accumulated.push(clone(curSum));
    }
    this._ride =  accumulated;
  }

  print_items() {
    var result = this._ride;
    for (let i=1; i<result.length; i++) {
        for (let key in result[i-1].item) {
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
        // console.log(oneOutput);
        this._output.push(oneOutput);
    }
  }

  print_items_per_interval() {
    this.mergeEvents();
    this.accumulateItem();
    this.print_items();
    console.log(this._output);
    return this._output;
  }
}
