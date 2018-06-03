/*
Chapter01 : Q1

Welcome to your first lab in M201! In this lab you're going to install
MongoDB Enterprise 3.4 and import the people dataset.

While MongoDB Enterprise is available as part of the MongoDB Enterprise Advanced subscription
it's permitted to be ran outside of production environments.

In order to install MongoDB you're going to need to head over to our online
documentation and follow the instructions on installing MongoDB.

After you've successfully installed MongoDB you should start a standalone server.
Once your sever is up and running you should be able to download the
people.json handout and import it with mongoimport. Make sure to import
the documents into the m201 database and the people collection.

To confirm that you've successfully completed these steps run the following
query on the m201 database from the mongo shell and paste it's output into
the submission area below:

  > db.people.count({ "email" : {"$exists": 1} })

*/

// Ans: 50474

================================================================================

/*
Chapter 02 : Q1
In this lab you're going to determine which queries are able to successfully use a given index for both filtering and sorting.

Given the following index:
{"first_name": 1, "address.state": -1, "address.city": -1, "ssn": 1}

Which of the following queries are able to use it for both filtering and sorting?

*/

// Answers
db.people.find({ first_name: { $gt: "J" }}).sort({ "address.city": -1 })                        // no
db.people.find({ first_name:  "Jessica" }).sort( {"address.state": 1, "address.city": 1} )       // yes
db.people.find({ first_name: "Jessica", "address.state": { $lt: "S" } }).sort( "address.state": 1 ) // yes
db.people.find({ "address.city": "West Cindy" }).sort({ "address.city": -1 })                   // no
db.people.find({ "address.state": "South Dakota", first_name: "Jessica" }).sort({ "address.city": -1 }) // yes

// Some related queries
db.people.createIndex({ "first_name": 1, "address.state": -1, "address.city": -1, "ssn": 1 })

db.people.findOne().pretty()

{
        "_id" : ObjectId("57d7a121fa937f710a7d486e"),
        "last_name" : "Pham",
        "quote" : "Aliquam est reiciendis alias neque ad.",
        "job" : "Counselling psychologist",
        "ssn" : "401-31-6615",
        "address" : {
                "city" : "Burgessborough",
                "street" : "83248 Woods Extension",
                "zip" : "47201"
        },
        "first_name" : "Yvonne",
        "company_id" : ObjectId("57d7a121fa937f710a7d486d"),
        "employer" : "Terry and Sons",
        "birthday" : ISODate("2011-03-17T11:21:36Z"),
        "email" : "murillobrian@cox.net"
}

db.people.find({ "address.state": { $exists: false }}).count()  // 22786
db.people.find({ "address.state": { $exists: true }}).count()   // 27688

// Confusion:
var exp = db.people.explain();
exp.find({ first_name: { $gt: "J" }}).sort({ "address.city": -1 }) // Says IXSCAN, but answers say it should not use the Index


================================================================================

/*
Chapter 02 : Q2

In this lab you're going to examine several example queries and determine which compound index will best service them.

  db.people.find({
      "address.state": "Nebraska",
      "last_name": /^G/,
      "job": "Police officer"
    })

  db.people.find({
      "job": /^P/,
      "first_name": /^C/,
      "address.state": "Indiana"
    }).sort({ "last_name": 1 })

  db.people.find({
      "address.state": "Connecticut",
      "birthday": {
        "$gte": ISODate("2010-01-01T00:00:00.000Z"),
        "$lt": ISODate("2011-01-01T00:00:00.000Z")
      }
    })

If you had to build one index on the people collection, which of the following indexes would best sevice all 3 queries?

  1. { "address.state": 1, "job": 1 }
  2. { "address.state": 1, "job": 1, "first_name": 1 }
  3. { "address.state": 1, "last_name": 1, "job": 1 }
  4. { "job": 1, "address.state": 1 }
  5. { "job": 1, "address.state": 1, "first_name": 1 }
  6. { "job": 1, "address.state": 1, "last_name": 1 }

*/

// Ans:
{ "address.state": 1, "last_name": 1, "job": 1 }
/* ^^ satisfies the 1st query completely, and the 2nd query, though not fully satisfied on the find() part,
      the advantage provied in it's sort() part outweighs it*/


================================================================================
