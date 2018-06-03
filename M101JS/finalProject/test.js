var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

MongoClient.connect('mongodb://localhost:27017/mongomart', function(err, db) {
  "use strict";

  assert.equal(null, err);
  console.log("Successfully connected to MongoDB.");

  var categories = [];

  var cursor = db.collection('item').aggregate([
    { $group: { _id: { category: "$category" }, num: { $sum:1 } } },
    { $project: { _id: "$_id.category", num:1  } }
  ]);

  /*
    { "num" : 3, "_id" : "Electronics" }
    { "num" : 3, "_id" : "Books" }
    { "num" : 2, "_id" : "Stickers" }
    { "num" : 6, "_id" : "Apparel" }
    { "num" : 2, "_id" : "Umbrellas" }
    { "num" : 3, "_id" : "Kitchen" }
    { "num" : 2, "_id" : "Swag" }
    { "num" : 2, "_id" : "Office" }
  */

  var totalItems = 0;

  cursor.forEach(

    doc => {
      categories.push(doc);
      totalItems += parseInt(doc.num, 10)
    },
    err => {
        assert.equal(err, null);
        console.log("all done");
        categories.push({
          _id: "All",
          num: totalItems
        });
        console.log(categories);

        categories.sort( (id1, id2) => {
          var a = id1._id.toUpperCase();
          var b = id2._id.toUpperCase();

          if(a<b) return -1  // smaller
          if(a>b) return 1   // bigger
          return 0  // same
        } )

        console.log('sorted categories:')
        console.log(categories);

        return db.close();
    }
  )

  // for mongomart lab06
  db.collection('cart').find(
    { userId: "558098a65133816958968d88" },
    { _id:0, items:{ $elemMatch: { _id: 2 } } }
  ).limit(1)
  .next((err, doc) => {
    assert.equal(err,null);
    console.log(' item is : \n' + JSON.stringify(doc.items[0],null,2));
    return db.close()
  })

});


/*
categories.sort( (id1, id2) => {
  var a = id1._id.toUpperCase();
  var b = id2._id.toUpperCase();

  if(a<b) return -1  // smaller
  if(a>b) return 1   // bigger
  return 0  // same
} )
*/
