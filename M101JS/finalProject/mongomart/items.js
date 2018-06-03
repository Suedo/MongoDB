var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


function ItemDAO(database) {
    "use strict";

    this.db = database;

    this.getCategories = function(callback) {
        "use strict";

        var categories = [];

        var cursor = this.db.collection('item').aggregate([
          { $group: { _id: { category: "$category" }, num: { $sum:1 } } },
          { $project: { _id: "$_id.category", num:1  } },
          { $sort: { _id:1 } }
        ]);

        var totalItems = 0;

        cursor.forEach(
          doc => {
            categories.push(doc);
            totalItems += parseInt(doc.num, 10)
          },
          err => {
              assert.equal(err, null);

              // Add to the begining
              categories.unshift({
                _id: "All",
                num: totalItems
              });

              callback(categories);
          })
    }


    this.getItems = function(category, page, itemsPerPage, callback) {
        "use strict";

        // snag++
        var skipVal = parseInt(itemsPerPage,10) * parseInt(page, 10); // when page = 0 initially, will show 5 from start
        var pageItems = [];
        var query = {}

        var query = { "category": category };
        if( category === "All" ) query = {};

        // var pageCursor = this.db.collection('item').aggregate([
        //   { $match: query },
        //   { $sort: { _id: 1 } },
        //   { $skip: skipVal },
        //   { $limit: itemsPerPage }
        // ]);

        // pageCursor.forEach(
        //   doc => {
        //     pageItems.push(doc)
        //   },
        //   err => {
        //     callback(pageItems);
        //   }
        // )

        // Since volume will be low here, only ITEMS_PER_PAGE number of stuff in each go, can use a memory intensive toArray() method
        this.db.collection('item').aggregate([
          { $match: query },
          { $sort: { _id: 1 } },
          { $skip: skipVal },
          { $limit: itemsPerPage }
        ]).toArray( ( err, docs ) => {
          assert.equal(err, null);
          callback(docs);
        })
    }


    this.getNumItems = function(category, callback) {
        "use strict";

        var query = { "category": category };
        if( category === "All" ) query = {};

        this.db.collection('item').find(query).count( ( err,count ) => {
          if(err) throw err;
          else(callback(count))
        } );
    }


    this.searchItems = function(query, page, itemsPerPage, callback) {
        "use strict";

        /*
          $text index created in the mongo shell:

          db.item.createIndex({
            "title": "text",
            "slogan": "text",
            "description": "text"
          })

        */

        var skipVal = itemsPerPage * parseInt(page, 10);
        var items = []

        var searchResult = this.db.collection('item')
          .find({ $text: { $search: query } })
          .sort({ _id: 1 })
          .skip(skipVal)
          .limit(itemsPerPage);

        searchResult.forEach(
          doc => { items.push(doc) },
          err => {
            assert.equal(err, null);
            callback(items);
          }
        )
    }


    this.getNumSearchItems = function(query, callback) {
        "use strict";

        /* depends on the same $text index used in searchItems() */

        this.db.collection('item')
          .find({ $text: { $search: query } })
          .count( ( err,numItems ) => {
            assert.equal(err, null);
            callback(numItems);
            }
          );
    }


    this.getItem = function(itemId, callback) {
        "use strict";

        // var itemId = parseInt(req.params.itemId);    // don't need this, already done in mongomart.js

        this.db.collection('item')
          .find({ _id: itemId })
          .limit(1)                         // hack. Just in case some data error gives multiple docs for same _id
          .next( (err, item ) => {          // since we expect only 1 item, next() will suffice
            assert.equal(err, null);
            callback(item)
          } );

          // another way
          // .toArray( ( err, item ) => {
          //   assert.equal(err, null);
          //   // assert.equal(item.size,1)
          //   callback(item[0]);
          // })
    }


    this.getRelatedItems = function(callback) {
        "use strict";

        this.db.collection("item").find({})
            .limit(4)
            .toArray(function(err, relatedItems) {
                assert.equal(null, err);
                callback(relatedItems);
            });
    };


    this.addReview = function(itemId, comment, name, stars, callback) {
        "use strict";

        var reviewDoc = {
            name: name,
            comment: comment,
            stars: stars,
            date: Date.now()
        }

        let selectDoc = { "_id": itemId };
        let updateDoc = { $push: { "reviews": reviewDoc } };

        this.db.collection('item').updateOne(selectDoc, updateDoc, function(err, doc) {
            assert.equal(err, null);
            callback(doc);
        })

    }


    this.createDummyItem = function() {
        "use strict";

        var item = {
            _id: 1,
            title: "Gray Hooded Sweatshirt",
            description: "The top hooded sweatshirt we offer",
            slogan: "Made of 100% cotton",
            stars: 0,
            category: "Apparel",
            img_url: "/img/products/hoodie.jpg",
            price: 29.99,
            reviews: []
        };

        return item;
    }
}

module.exports.ItemDAO = ItemDAO;
