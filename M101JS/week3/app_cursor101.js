var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


MongoClient.connect('mongodb://localhost:27017/crunchy', function(err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");

    var query = {"category_code": "biotech"};

    // instead of executing the query and consuming memory to store
    // the o/p all at once, we use a cursor to 'stream' the results one by one
    // as and when needed. The point of the cursor here is to define our query
    var cursor = db.collection('companies').find(query).limit(10);

    cursor.forEach(
        function(doc) {
            console.log( doc.name + " is a " + doc.category_code + " company." );
        },
        function(err) {
            assert.equal(err, null);
            return db.close();
        }
    );

});


/* OUTPUT:

Successfully connected to MongoDB.
23andMe is a biotech company.
Genentech is a biotech company.
Nutra Pharma is a biotech company.
Posit Science is a biotech company.
Manyeta is a biotech company.
BioIQ is a biotech company.
Sirtris Pharmaceuticals is a biotech company.
GlaxoSmithKline is a biotech company.
NeuroVigil is a biotech company.
Primordial is a biotech company.

*/
