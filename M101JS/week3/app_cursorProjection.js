var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

/*Commenting out some stuff to make it more es6-ish with fat arrows*/

// MongoClient.connect('mongodb://localhost:27017/crunchy', function(err, db) {
MongoClient.connect('mongodb://localhost:27017/crunchy', (err, db) => {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");

    var query = {"category_code": "biotech"};
    var projection = {"name": 1, "category_code": 1, "_id": 0};

    // var cursor = db.collection('companies').find(query).limit(10);
    var cursor = db.collection('companies').find(query)
                  .project(projection)
                  .limit(10);
    // cursor.project(projection);

    cursor.forEach(
        // function(doc) {
        doc => {
            console.log(doc.name + " is a " + doc.category_code + " company.");
            console.log(doc);
        },
        // function(err) {
        err => {
            assert.equal(err, null);
            return db.close();
        }
    );

});

/* OUTPUT

Successfully connected to MongoDB.
23andMe is a biotech company.
{ name: '23andMe', category_code: 'biotech' }
Genentech is a biotech company.
{ name: 'Genentech', category_code: 'biotech' }
Nutra Pharma is a biotech company.
{ name: 'Nutra Pharma', category_code: 'biotech' }
Posit Science is a biotech company.
{ name: 'Posit Science', category_code: 'biotech' }
Manyeta is a biotech company.
{ name: 'Manyeta', category_code: 'biotech' }
BioIQ is a biotech company.
{ name: 'BioIQ', category_code: 'biotech' }
Sirtris Pharmaceuticals is a biotech company.
{ name: 'Sirtris Pharmaceuticals', category_code: 'biotech' }
GlaxoSmithKline is a biotech company.
{ name: 'GlaxoSmithKline', category_code: 'biotech' }
NeuroVigil is a biotech company.
{ name: 'NeuroVigil', category_code: 'biotech' }
Primordial is a biotech company.
{ name: 'Primordial', category_code: 'biotech' }

*/
