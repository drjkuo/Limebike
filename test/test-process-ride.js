var assert = require('assert');
var ItemCounter = require('../index');
describe('Array', function() {
  let ic;
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
  before(function() {
    // runs before all tests in this block
    ic = new ItemCounter();
  });


  describe('process_ride()', function() {
    it('should return double of ride.length', function() {
      ic.process_ride(ride);
      console.log(ic._ride);
      assert.equal(ic.process_ride(ride).length, ride.length*2);
    });
  });
  describe('print_items_per_interval()', function() {
    it('should print items per interval', function() {
      ic.process_ride(ride);
      ic.print_items_per_interval();
      // console.log(ic.print_items_per_interval());
      assert.equal(ic.get_items_per_interval()[0], "07:00-7:10 -> 2 apples, 1 brownie");
      assert.equal(ic.get_items_per_interval()[1], "07:10-7:20 -> 3 apples, 1 brownie, 3 carrots");
      assert.equal(ic.get_items_per_interval()[2], "07:20-7:30 -> 4 apples, 3 brownies, 3 carrots, 4 diamonds");
      assert.equal(ic.get_items_per_interval()[3], "07:30-7:45 -> 2 apples, 2 brownies, 3 carrots, 4 diamonds");
      assert.equal(ic.get_items_per_interval()[4], "07:45-8:00 -> 1 apple, 3 carrots");
    });
  });

});
