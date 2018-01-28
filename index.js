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
   // {
   //    time: [700, 730],
   //    item: {
   //       apple: 2,
   //       brownie: 1
   //    }
   // },
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
   return sortedEvents;
}

sortedEvents = process_ride(ride)
   .sort(function (x,y) {
   if (x.time > y.time) return 1;
   else if (x.time === y.time && x.se === false && y.se === true) return 1;
   else return -1;
});

var SELen = sortedEvents.length;
for (let i=0; i<sortedEvents.length; i++) {
   // merge same-time events
   for (let j=i+1; j<sortedEvents.length; j++) {
      if ((sortedEvents[i].time === sortedEvents[j].time) && (sortedEvents[i].se === sortedEvents[j].se)) {
         console.log(sortedEvents[i], sortedEvents[j]);
         sortedEvents[i] = merge(sortedEvents[i], sortedEvents[j], true);
         console.log("merged");
         sortedEvents.splice(j, 1);
         j--;
         console.log(sortedEvents[i], sortedEvents[j]);
         // console.log(sortedEvents[i], sortedEvents[j]);
      }
      else break;
   }
   // sortedEvents.splice(i+1, j-i-1);
   // console.log("??");
}
console.log(sortedEvents);

var result = [];
var curSum = {};
for (let i=0; i<sortedEvents.length; i++) {
   console.log("before", curSum);
   curSum.item = deepClone(merge(curSum, sortedEvents[i], sortedEvents[i]["se"])).item;
   curSum.time = sortedEvents[i].time;
   console.log("each", curSum);
   result.push(deepClone(curSum));
}
console.log("\n", result);

for (let i=1; i<result.length; i++) {
    for (let key in result[i-1].item) {
      if (result[i-1].item[key] === 0) delete result[i-1].item[key];
    }
    console.log(moment(result[i-1].time).format('h:mm'), moment(result[i].time).format('h:mm'), result[i-1].item);
}

// console.log(moment(Date.now()).format('h:mm'));
// result[i-1].time.format('MMMM Do YYYY, h:mm');
// console.log(sortedEvents);
// console.log(
//    sortedEvents[0].item===sortedEvents[1].item,
//    sortedEvents[0].item===sortedEvents[2].item,
//    sortedEvents[0].item===sortedEvents[3].item
//    // sortedEvents[0]===sortedEvents[1]
// );


function merge (i, j, addOrDelete) {
   // console.log("i", i, "j", j);
   if (Object.keys(i).length === 0) return j;
   for (let key in j["item"]) {
         if (addOrDelete) {
            if (i["item"].hasOwnProperty(key)) {
               i["item"][key] = (i["item"][key] || 0) + j["item"][key];
            }
            else {
               i["item"][key] = 0;
               i["item"][key] = j["item"][key];
            }

         }
         else {
            i["item"][key] = (i["item"][key] || 0) - j["item"][key];
         }
         console.log(i["item"][key]);
      // }
   }
   console.log("i", i, "j", j);
   return deepClone(i);
   // console.log(i);
}


// print_items_per_interval(sortedEvents) {


// }2
