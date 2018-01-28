var moment = require('moment');
var clone = require('clone');

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

class ItemCounter {

}

function process_ride(ride) {
   var sortedEvents = [];
   var i, tmp;
   for (i=0; i<ride.length; i++) {
      tmp = clone({
         se: true,
         time: ride[i].time[0],
         item: ride[i].item
      });
      sortedEvents.push(tmp);
      tmp = clone({
         se: false,
         time: ride[i].time[1],
         item: ride[i].item
      });
      sortedEvents.push(tmp);
   }
   sortedEvents = sortedEvents.sort(function (x,y) {
      if (x.time > y.time) return 1;
      else if (x.time === y.time && x.se === false && y.se === true) return 1;
      else return -1;
   });
   return sortedEvents;
}

function mergeEvents (sortedEvents) {
  for (let i=0; i<sortedEvents.length; i++) {
     for (let j=i+1; j<sortedEvents.length; j++) {
        if ((sortedEvents[i].time === sortedEvents[j].time) && (sortedEvents[i].se === sortedEvents[j].se)) {
           console.log(sortedEvents[i], sortedEvents[j]);
           sortedEvents[i] = counter(sortedEvents[i], sortedEvents[j], true);
           console.log("merged");
           sortedEvents.splice(j, 1);
           j--;
           console.log(sortedEvents[i], sortedEvents[j]);
        }
        else break;
     }
  }
  return sortedEvents;
}

function counter (i, j, addOrDelete, property) {
  if (Object.keys(i).length === 0) return j;
  for (let key in j[property]) {
    i[property][key] = (addOrDelete)? (i[property][key] || 0)+j[property][key] : (i[property][key] || 0)-j[property][key];
  }
  return clone(i);
}

function accumulateItem(sortedEvents) {
  var accumulated = [];
  var curSum = {};
  for (let i=0; i<sortedEvents.length; i++) {
     console.log("before", curSum);
     curSum.item = clone(counter(curSum, sortedEvents[i], sortedEvents[i]["se"], "item")).item;
     curSum.time = sortedEvents[i].time;
     console.log("each", curSum);
     accumulated.push(clone(curSum));
  }
  return accumulated;
}



function print_items(result) {
  for (let i=1; i<result.length; i++) {
      for (let key in result[i-1].item) {
        if (result[i-1].item[key] === 0) delete result[i-1].item[key];
      }
      console.log(moment(result[i-1].time).format('h:mm'), moment(result[i].time).format('h:mm'), result[i-1].item);
  }
}

// merge events at the same time
function print_items_per_interval() {

}
var sortedEvents = process_ride(ride);
sortedEvents = mergeEvents(sortedEvents);
var accumulated = accumulateItem(sortedEvents);
print_items(accumulated);
