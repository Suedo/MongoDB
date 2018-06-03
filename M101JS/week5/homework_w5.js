/*
Q1.
Suppose you have a collection with the following indexes:

> db.products.getIndexes()
[
    {
        "v" : 1,
        "key" : {
            "_id" : 1
        },
        "ns" : "store.products",
        "name" : "_id_"
    },
    {
        "v" : 1,
        "key" : {
            "sku" : 1
        },
                "unique" : true,
        "ns" : "store.products",
        "name" : "sku_1"
    },
    {
        "v" : 1,
        "key" : {
            "price" : -1
        },
        "ns" : "store.products",
        "name" : "price_-1"
    },
    {
        "v" : 1,
        "key" : {
            "description" : 1
        },
        "ns" : "store.products",
        "name" : "description_1"
    },
    {
        "v" : 1,
        "key" : {
            "category" : 1,
            "brand" : 1
        },
        "ns" : "store.products",
        "name" : "category_1_brand_1"
    },
    {
        "v" : 1,
        "key" : {
            "reviews.author" : 1
        },
        "ns" : "store.products",
        "name" : "reviews.author_1"
    }

Which of the following queries can utilize at least one index to find all matching documents or to sort? Check all that apply.

1. db.products.find( { 'brand' : "GE" } )
2. db.products.find( { 'brand' : "GE" } ).sort( { price : 1 } )
3. db.products.find( { $and : [ { price : { $gt : 30 } },{ price : { $lt : 50 } } ] } ).sort( { brand : 1 } )
4. db.products.find( { brand : 'GE' } ).sort( { category : 1, brand : -1 } )
*/

var records = [         // create a dummy table for testing
  { _id:1, brand:'GE', price:900, category:'engines' },
  { _id:2, brand:'Samsung', price:500, category:'TV' },
  { _id:3, brand:'OP', price:300, category:'phones' }
]

db.products.insertMany(records)

db.products.createIndex({ "category" : 1, "brand" : 1 })
db.products.createIndex({ "price" : -1 })

// read: https://docs.mongodb.com/manual/core/index-compound/?_ga=2.72140179.1022330129.1498588497-941283253.1488488303#compound-indexes
// These two uses IXSCAN as reported by 'executionStats', hence these are the answers:
// MongoDB doesn't care about direction in single entry indexes
> db.products.explain('executionStats').find( { 'brand' : "GE" } ).sort( { price : 1 } )
// find is done using index, then the result is sorted on brand
> db.products.explain('executionStats').find( { $and : [ { price : { $gt : 30 } },{ price : { $lt : 50 } } ] } ).sort( { brand : 1 } )

==========================================================================================================================

/*
Q2.
Suppose you have a collection called tweets whose documents contain information about the created_at time of the tweet and the user's
followers_count at the time they issued the tweet. What can you infer from the following explain output?

> db.tweets.explain("executionStats").find({"user.followers_count":{$gt:1000}}).limit(10).skip(5000).sort( { created_at : 1 } )
{
    "queryPlanner" : {
        "plannerVersion" : 1,
        "namespace" : "twitter.tweets",
        "indexFilterSet" : false,
        "parsedQuery" : {
            "user.followers_count" : {
                "$gt" : 1000
            }
        },
        "winningPlan" : {
            "stage" : "LIMIT",
            "limitAmount" : 0,
            "inputStage" : {
                "stage" : "SKIP",
                "skipAmount" : 0,
                "inputStage" : {
                    "stage" : "FETCH",
                    "filter" : {
                        "user.followers_count" : {
                            "$gt" : 1000
                        }
                    },
                    "inputStage" : {
                        "stage" : "IXSCAN",
                        "keyPattern" : {
                            "created_at" : -1
                        },
                        "indexName" : "created_at_-1",
                        "isMultiKey" : false,
                        "direction" : "backward",
                        "indexBounds" : {
                            "created_at" : [
                                "[MinKey, MaxKey]"
                            ]
                        }
                    }
                }
            }
        },
        "rejectedPlans" : [ ]
    },
    "executionStats" : {
        "executionSuccess" : true,
        "nReturned" : 10,
        "executionTimeMillis" : 563,
        "totalKeysExamined" : 251120,
        "totalDocsExamined" : 251120,
        "executionStages" : {
            "stage" : "LIMIT",
            "nReturned" : 10,
            "executionTimeMillisEstimate" : 500,
            "works" : 251121,
            "advanced" : 10,
            "needTime" : 251110,
            "needFetch" : 0,
            "saveState" : 1961,
            "restoreState" : 1961,
            "isEOF" : 1,
            "invalidates" : 0,
            "limitAmount" : 0,
            "inputStage" : {
                "stage" : "SKIP",
                "nReturned" : 10,
                "executionTimeMillisEstimate" : 500,
                "works" : 251120,
                "advanced" : 10,
                "needTime" : 251110,
                "needFetch" : 0,
                "saveState" : 1961,
                "restoreState" : 1961,
                "isEOF" : 0,
                "invalidates" : 0,
                "skipAmount" : 0,
                "inputStage" : {
                    "stage" : "FETCH",
                    "filter" : {
                        "user.followers_count" : {
                            "$gt" : 1000
                        }
                    },
                    "nReturned" : 5010,
                    "executionTimeMillisEstimate" : 490,
                    "works" : 251120,
                    "advanced" : 5010,
                    "needTime" : 246110,
                    "needFetch" : 0,
                    "saveState" : 1961,
                    "restoreState" : 1961,
                    "isEOF" : 0,
                    "invalidates" : 0,
                    "docsExamined" : 251120,
                    "alreadyHasObj" : 0,
                    "inputStage" : {
                        "stage" : "IXSCAN",
                        "nReturned" : 251120,
                        "executionTimeMillisEstimate" : 100,
                        "works" : 251120,
                        "advanced" : 251120,
                        "needTime" : 0,
                        "needFetch" : 0,
                        "saveState" : 1961,
                        "restoreState" : 1961,
                        "isEOF" : 0,
                        "invalidates" : 0,
                        "keyPattern" : {
                            "created_at" : -1
                        },
                        "indexName" : "created_at_-1",
                        "isMultiKey" : false,
                        "direction" : "backward",
                        "indexBounds" : {
                            "created_at" : [
                                "[MinKey, MaxKey]"
                            ]
                        },
                        "keysExamined" : 251120,
                        "dupsTested" : 0,
                        "dupsDropped" : 0,
                        "seenInvalidated" : 0,
                        "matchTested" : 0
                    }
                }
            }
        }
    },
    "serverInfo" : {
        "host" : "generic-name.local",
        "port" : 27017,
        "version" : "3.0.1",
        "gitVersion" : "534b5a3f9d10f00cd27737fbcd951032248b5952"
    },
    "ok" : 1
}

The query uses an index to determine the order in which to return result documents.
The query uses an index to determine which documents match.
The query returns 251120 documents.
The query examines 251120 documents.
The query is a covered query.

*/


The query uses an index to determine the order in which to return result documents.
// True. Sort is based on 'created_at', and an index exists with that field.

The query uses an index to determine which documents match.
// False: Match is done with 'user.followers_count' which is not part of any index

The query returns 251120 documents.
// False. executionStats shows: "nReturned" : 10

The query examines 251120 documents.
// True. executionStats shows: "totalDocsExamined" : 251120

The query is a covered query.
// False: 'user.followers_count' is not part of any index

==========================================================================================================================

/*
Q3.
In this problem you will analyze a profile log taken from a mongoDB instance. To start, please download sysprofile.json
from Download Handout link and import it with the following command:

mongoimport --drop -d m101 -c profile sysprofile.json

Now query the profile data, looking for all queries to the students collection in the database school2,
sorted in order of decreasing latency.

What is the latency of the longest running operation to the collection, in milliseconds?

1. 19776550
2. 10000000
3. 5580001
4. 15820
5. 2350

*/

// Ans: 15820

> mongoimport -d test -c profile sysprofile.json    // I imported to my test db, instead of what they suggested

db.profile.find({ "ns" : "school2.students" })      // students collection in the database school2
          .sort({ "millis":-1 })                    // sorted in order of decreasing latency
          .limit(1)                                 // longest running operation to the collection, in milliseconds
          .pretty()

// The above query gives:
{
	"_id" : ObjectId("595aadd1fd3e4972a8a178b4"),
	"ts" : ISODate("2012-11-20T20:09:49.862Z"),
	"op" : "query",
	"ns" : "school2.students",
	"query" : {
		"student_id" : 80
	},
	"ntoreturn" : 0,
	"ntoskip" : 0,
	"nscanned" : 10000000,
	"keyUpdates" : 0,
	"numYield" : 5,
	"lockStats" : {
		"timeLockedMicros" : {
			"r" : 19776550,
			"w" : 0
		},
		"timeAcquiringMicros" : {
			"r" : 4134067,
			"w" : 5
		}
	},
	"nreturned" : 10,
	"responseLength" : 2350,
	"millis" : 15820,
	"client" : "127.0.0.1",
	"user" : ""
}

// Thus, ANSWER is : 15820
