/*
Lab00:

Get the MongoMart application up and running. It doesn't do much (yet), but you should be able to run it and experiment with the UI.

    Download the MongoMart application from the handout.
    Install the dependencies.
    Make sure you have a mongod running version 3.2.x of MongoDB.
    Import the "item" collection: mongoimport --drop -d mongomart -c item data/items.json
    Import the "cart" collection: mongoimport --drop -d mongomart -c cart data/cart.json
    Run the application by typing "node mongomart.js" in the mongomart directory.

In your browser, visit http://localhost:3000. If you've set up and launched MongoMart correctly, you should see a page that lists the same product repeated five times. Which of the following products is it?

    1. Gray Hooded Sweatshirt
    2. WiredTiger T-shirt
    3. MongoDB University Book
    4. Powered by MongoDB Sticker
    5. Stress Ball

*/


// Ans: 1. Gray Hooded Sweatshirt


==========================================================================================================================



/*
Lab01:

The items.js file implements data access for the item collection. The item collection contains the product catalog for the MongoMart application.
The mongomart.js application instantiates an item data access object (DAO) with this call:
    var items = new ItemDAO(db);

The DAO, items, is used throughout mongomart.js to implement several of the routes in this application.


In this lab, you will implement the methods in items.js necessary to support the root route or "/". This route is implemented in mongomart.js in the function that begins with this line:

    router.get("/", function(req, res) {

The methods you will implement in items.js are: getCategories(), getItems(), and getNumItems(). The comments in each of these methods describe in detail what you need to do to implement each method. When you believe you are finished, restart the mongomart.js application and evaluate your application to see whether it matches the following description.
If you have completed this lab correctly, the landing page for Mongomart should now show the following five products: Gray Hooded Sweatshirt, Coffee Mug, Stress Ball, Track Jacket, and Women's T-shirt. On the left side of the page you should see nine product categories listed, beginning with "All" and ending with "Umbrellas". At the bottom of the page you should see tabs for pages 1-5 with the statement "23 Products" immediately underneath.

If your application matches the above description, please answer the following question.

Select the "Apparel" category by clicking on it with your mouse. This category contains six products. MongoMart will paginate the products in this category into two pages. Which of the following items is listed on the second page? There should be only one item on this page. Please make sure you are sorting query results as specified in the Lab 1 instructions or you might get the wrong answer.

Choose the best answer:

    1. Gray Hooded Sweatshirt
    2. Track Jacket
    3. Women's T-shirt
    4. WiredTiger T-shirt
    5. Green T-shirt
    6. MongoDB University T-shirt

*/

// Ans : 4. WiredTiger T-shirt

  /*    To get the answers for this Lab Assessment, the below codes were made/added :  */

    // added to getCategories()
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


      // added to getItems()
      var skipVal = parseInt(itemsPerPage,10) * parseInt(page, 10); // when page = 0 initially, will show 5 from start
      var pageItems = [];
      var query = {}

      var query = { "category": category };
      if( category === "All" ) query = {};

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

      // added to getNumItems()
      var query = { "category": category };
      if( category === "All" ) query = {};

      this.db.collection('item').find(query).count( ( err,count ) => {
        if(err) throw err;
        else(callback(count))
      } );

/* Lab01 done */


==========================================================================================================================



/*
Lab02:

In this lab, you will implement the methods in items.js necessary to support the route for text search or "/search". This route is implemented in mongomart.js in the function that begins with this line:
    router.get("/search", function(req, res) {

The methods you will implement in items.js are: searchItems(), and getNumSearchItems(). The comments in each of these methods describe in detail what you need to do to implement each method. When you are finished, restart the mongomart.js application and answer the question below.

How many products match the query, "leaf"?

Choose the best answer:

  [ answers values from 1 to 10 were given]

*/

// Ans: 7

  /*    To get the answers for this Lab Assessment, the below codes were made/added :  */


    // added to searchItems()

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

    // added to getNumSearchItems().
    this.db.collection('item')
      .find({ $text: { $search: query } })
      .count( ( err,numItems ) => {
        assert.equal(err, null);
        callback(numItems);
        }
      );

/* Lab02 done */


==========================================================================================================================



/*
Lab03:

In this lab, you will implement the method in items.js necessary to support the route for viewing a single item. This route is implemented in mongomart.js in the function that begins with this line:

    router.get("/item/:itemId", function(req, res) {

This route is implemented using a parameter for the item as part of the url. In Express, you may define a route with url parameters by placing a ":" before each portion of the url path that should be interpreted by Express as a variable. In this case, :itemId indicates that our callback for this route expects to use the value found in this portion of the url to do its job. You may access url parameters via the params property of the request object passed as the first parameter to our route callback function as we do here:

    var itemId = parseInt(req.params.itemId);

To complete the functionality to support the single item view, you will need to implement the getItem() method in items.js. The comments in this method describe what you need to do to implement it. When you are finished, restart the mongomart.js application and answer the question below.

Which of the following are true of the single item view for the Track Jacket product? Check all that apply.

Check all that apply:

    1. The Track Jacket page shows reviews from Shannon, Bob, and Jorge.
    2. Jorge's review is the last review listed on the Track Jacket page.
    3. Under "Product Description" the Track Jacket page shows an average of four stars.
    4. Bob's review of the Track Jacket was made in December of 2015.
    5. The Track Jacket page shows both front and back views of the product.


*/

// Ans:
//       1. The Track Jacket page shows reviews from Shannon, Bob, and Jorge.
//       2. Jorge's review is the last review listed on the Track Jacket page.

  /*    To get the answers for this Lab Assessment, the below codes were made/added :  */

    // added to getItem()
    this.db.collection('item')
      .find({ _id: itemId })
      .limit(1)                         // hack. Just in case some data error gives multiple docs for same _id
      .next( (err, item ) => {          // since we expect only 1 item, next() will suffice
        assert.equal(err, null);
        callback(item)
      } );


/* Lab03 done */



==========================================================================================================================



/*
Lab04:

In this lab, you will implement the method in items.js necessary to support the route for adding a review to a single item. This route is implemented in mongomart.js in the function that begins with this line:

    router.post("/item/:itemId/reviews", function(req, res) {

Note that this route uses a url parameter much like that used in the route for the single item view. However, this route supports POST rather than GET requests. To access the form values passed in the POST request, we use the "body" property of the request object passed to the callback function for this route.

To complete the functionality to support adding reviews, you will need to implement the addReview() method in items.js. The comments in this method describe what you need to do to implement it.

If you have completed this problem successfully, you should be able to add reviews to products. To test your code, experiment with adding reviews to the Leaf Sticker. To add a review, complete the "Add a Review" form on any individual product's page and click "Submit Review". You should see the review appear beneath the "Latest Reviews" heading. When correctly created, reviews will contain the following information: - The reviewer name - The date and time the review was made - The number of stars provided by the reviewer - The reviewer comments

When you are satisfied that your code is working, navigate to the Track Jacket page. Unless you've modified the data in some way you should see reviews from Shannon, Bob, and Jorge only. If you see reviews other than these, please drop the item collection and mongoimport it again, following the instructions in Lab 0.

Add a five-star review with a brief comment. Type any name and review comments you wish, but make sure you select five stars for your review.

After submitting this review, under "Product Description" the Track Jacket page now shows an average of how many stars?

Choose the best answer:

  [ answers values from 1 to 5 were given]

*/

// Ans: 4

  /*    To get the answers for this Lab Assessment, the below codes were made/added :  */

    // added to addReview()
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


/* Lab04 done */



==========================================================================================================================



/*
Lab05:

The cart.js file implements data access for the cart collection. The cart collection contains the shopping carts for users of the MongoMart application.

The mongomart.js application instantiates a cart data access object (DAO) with this call:

    var cart = new CartDAO(db);

The DAO, cart, is used throughout mongomart.js to implement several of the routes in this application.

In this lab, you will implement the method in cart.js necessary to support the route for viewing a shopping cart. This route is implemented in mongomart.js in the function that begins with this line:

    router.get("/cart", function(req, res) {

The method you will implement in cart.js is: getCart(). The comments in this method describe what you need to do to implement it. When you are finished, restart mongomart.js application and answer the question below.

Click the "Cart" button in the upper right corner of the MongoMart home page. There are already several items in the user cart. Which of the following values is closest to the total value of items in the cart REPORTED ON THAT PAGE?

Choose the best answer:

    1. $100
    2. $200
    3. $300
    4. $400
    5. $500

*/

// Ans:    4. $400

  /*    To get the answers for this Lab Assessment, the below codes were made/added :  */

    // added to getCart()
    this.db.collection('cart')
      .find({ "userId": userId })
      .limit(1)   // hack, should always be 1
      .next( (err, userCart ) => {
        assert.equal(err, null);
        callback(userCart);
      } )



/* Lab05 done */
