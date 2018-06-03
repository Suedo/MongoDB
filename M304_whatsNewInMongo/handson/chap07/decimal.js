show databases;
use decimal

db.collection.insert({ decimal: NumberDecimal('1000.566') })

// decimal created as string
var d0 = NumberDecimal('1000.566')
// decimal created as numeric
var d1 = NumberDecimal(1000.566)

// in JS, d1 and d0 are not the same
d1 == d0 // false
d1 === d0 // false

// But they are same in MongoDB, both return the same document
db.collection.find({ decimal: d0 }) // { "_id" : ObjectId("59324523362542fd2cee21b1"), "decimal" : NumberDecimal("1000.566") }
db.collection.find({ decimal: d1 }) // { "_id" : ObjectId("59324523362542fd2cee21b1"), "decimal" : NumberDecimal("1000.566") }

// we can also lookup by datatype. Here we use BSON decimal datatype alias >> decimal
db.collection.find({ decimal: { $type: 'decimal' } })
// { "_id" : ObjectId("59324523362542fd2cee21b1"), "decimal" : NumberDecimal("1000.566") }


// We a\can also use the BSON datatype number for decimal >> 19
db.collection.find({ decimal: { $type: 19 } })
// { "_id" : ObjectId("59324523362542fd2cee21b1"), "decimal" : NumberDecimal("1000.566") }


/*
So, prior to MongoDB 3.4, there was no Decimal type, and actual decimal data was saved in various different formats. Two common techniques was to store in cents instead of dollars (money record is one of the biggest use of decimal in the real world), and the other was to store as string. Below we see how to convert them to the proper Decimal format
*/

// Number to NumberDecimal conversion

db.priceInCents.insert({ price: 1000566 })
db.priceInCents.find();

// convert to Decimal type : Method 1
db.priceInCents.find().forEach( doc => {
  doc.price = NumberDecimal( doc.price/100 );
  // db.coll.save(doc) // saves converted document in new collection
  db.priceInCents.save(doc) // saves converted document inplace
})

// convert to Decimal type : Method 2
db.priceInCents.find().forEach( doc => {
  temp = NumberDecimal( doc.price/100 );
  db.priceInCents.update(
    { _id: doc._id },
    { $set: { price: temp } }
  )
})


// String to NumberDecimal conversion

db.priceAsString.insert({ price: '1000566' })
db.priceAsString.find()
// { "_id" : ObjectId("59325478362542fd2cee21b6"), "price" : "1000566" }


db.priceAsString.find().forEach( doc => {
  temp = NumberDecimal( doc.price ); // constructor takes in the string
  db.priceAsString.update(
    { _id: doc._id },
    { $set: { price: temp } }
  )
})  // { "_id" : ObjectId("5932547b362542fd2cee21b7"), "price" : NumberDecimal("1000566") }
