/*
Q1.
In this lab you're going to determine which index was used to satisfy a query given its explain output.

The following query was ran:

> var exp = db.restaurants.explain("executionStats")
> exp.find({ "address.state": "NY", stars: { $gt: 3, $lt: 4 } }).sort({ name: 1 }).hint(REDACTED)

Which resulted in the following output:

{
  "queryPlanner": {
    "plannerVersion": 1,
    "namespace": "m201.restaurants",
    "indexFilterSet": false,
    "parsedQuery": "REDACTED",
    "winningPlan": {
      "stage": "SORT",
      "sortPattern": {
        "name": 1
      },
      "inputStage": {
        "stage": "SORT_KEY_GENERATOR",
        "inputStage": {
          "stage": "FETCH",
          "inputStage": {
            "stage": "IXSCAN",
            "keyPattern": "REDACTED",
            "indexName": "REDACTED",
            "isMultiKey": false,
            "isUnique": false,
            "isSparse": false,
            "isPartial": false,
            "indexVersion": 1,
            "direction": "forward",
            "indexBounds": "REDACTED"
          }
        }
      }
    },
    "rejectedPlans": [ ]
  },
  "executionStats": {
    "executionSuccess": true,
    "nReturned": 3335,
    "executionTimeMillis": 20,
    "totalKeysExamined": 3335,
    "totalDocsExamined": 3335,
    "executionStages": "REDACTED"
  },
  "serverInfo": "REDACTED",
  "ok": 1
}

Given the redacted explain output above, select the index that was passed to hint.

Note: The hint() method is used to force the query planner to select a particular index for a given query.
You can learn more about hint by visiting its documentation.(https://docs.mongodb.com/manual/reference/method/cursor.hint/)
*/

/* Ans: The presence of SORT stage in the above explain cements that SORT did not use an index.
        However, The FETCH part does have an IXSCAN, so the find() did use an index.
        So to find our answer, we need to find the index from the options which, with the given query,
        will allow IXSCAN on find() but COLLSCAN on sort() :

        TLDR; Our index is:

          { "address.state": 1, "stars": 1, "name": 1 }

        Read below to find out why.

*/


// First, this is when the query does use an index for both find() and sort()
var exp = db.restaurants.explain('executionStats')
var index = { "address.state": 1, "name": 1, "stars": 1 } // index _is_ used by sort
exp.find({ "address.state": "NY", stars: { $gt: 3, $lt: 4 } }).sort({ name: 1 }).hint(index)

  // no SORT stage. Only Fetch stage > implies FETCH got the data in sorted order, so no SORT in memory (COLLSCAN) needed

  "winningPlan" : {
  			"stage" : "FETCH",
  			"inputStage" : {
  				"stage" : "IXSCAN",
  				"keyPattern" : {
  					"address.state" : 1,
  					"name" : 1,
  					"stars" : 1
  				},
  				"indexName" : "address.state_1_name_1_stars_1",  // notice the index here
  				"isMultiKey" : false,
  				"multiKeyPaths" : {
  					"address.state" : [ ],
  					"name" : [ ],
  					"stars" : [ ]
  				},
  				"isUnique" : false,
  				"isSparse" : false,
  				"isPartial" : false,
  				"indexVersion" : 2,
  				"direction" : "forward",
  				"indexBounds" : {
  					"address.state" : [
  						"[\"NY\", \"NY\"]"
  					],
  					"name" : [
  						"[MinKey, MaxKey]"        // names will always be in sorted order
  					],
  					"stars" : [
  						"(3.0, 4.0)"              // filters stars on sorted list of names
  					]
  				}
  			}
  		},

/* But here, this is what we are looking for:
    In short technical terms, the sort prefix equality condition on the index is not met.
    prefix for `name` is the key formed by { `address.state`, `stars` } and stars has a range instead of an equality
*/

var index = { "address.state": 1, "stars": 1, "name": 1 } // sort does not use index
exp.find({ "address.state": "NY", stars: { $gt: 3, $lt: 4 } }).sort({ name: 1 }).hint(index)

    "winningPlan" : {
			"stage" : "SORT",   // MEMORY scanned (COLLSCAN) to get SORT-ed output
			"sortPattern" : {
				"name" : 1
			},
			"inputStage" : {
				"stage" : "SORT_KEY_GENERATOR",
				"inputStage" : {
					"stage" : "FETCH",
					"inputStage" : {
						"stage" : "IXSCAN",   // FETCH uses index, over this result SORT does a memory scan
						"keyPattern" : {
							"address.state" : 1,
							"stars" : 1,
							"name" : 1
						},
						"indexName" : "address.state_1_stars_1_name_1",
						"isMultiKey" : false,
						"multiKeyPaths" : {
							"address.state" : [ ],
							"stars" : [ ],
							"name" : [ ]
						},
						"isUnique" : false,
						"isSparse" : false,
						"isPartial" : false,
						"indexVersion" : 2,
						"direction" : "forward",
						"indexBounds" : {
							"address.state" : [
								"[\"NY\", \"NY\"]"
							],
							"stars" : [
								"(3.0, 4.0)"  // documents satisfying this range may not turn up in sorted order of `name`,
                              // forcing the in-memory SORT we see after this stage (explain o/p is read inside-out)
							],
							"name" : [
								"[MinKey, MaxKey]"
							]
						}
					}
				}
			}
		}
