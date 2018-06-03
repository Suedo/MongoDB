/*
GRAPH LOOKUP : SELF JOIN
*/

// Create parent_reference collection
var entries = [
  { "_id" : 1, "name" : "Dev", "title" : "CEO" },
  { "_id" : 2, "name" : "Eliot", "title" : "CTO", "reports_to" : 1},
  { "_id" : 3, "name" : "Meagen", "title" : "CMO", "reports_to" : 1 },
  { "_id" : 4, "name" : "Carlos", "title" : "CRO", "reports_to" : 1 },
  { "_id" : 5, "name" : "Andrew", "title" : "VP Eng", "reports_to" : 2 },
  { "_id" : 6, "name" : "Ron", "title" : "VP PM", "reports_to" : 2 },
  { "_id" : 7, "name" : "Elyse", "title" : "COO", "reports_to" : 2 },
  { "_id" : 8, "name" : "Richard", "title" : "VP PS", "reports_to" : 1 },
  { "_id" : 9, "name" : "Shannon", "title" : "VP Education", "reports_to" : 5 },
  { "_id" : 10, "name" : "Dan", "title" : "VP Core Engineering", "reports_to" : 5 },
  { "_id" : 11, "name" : "Cailin", "title" : "VP Cloud Engineering", "reports_to" : 5 }
]

// create a new database
use GraphOPS;
db.parent_reference.insertMany(entries)

// mesed up insertion somehow? drop collection and retry
db.parent_reference.drop()

// Find all the people who report to Dave
db.parent_reference.find({reports_to: 1}).pretty()
/*
{ "_id" : 2, "name" : "Eliot", "title" : "CTO", "reports_to" : 1 }
{ "_id" : 3, "name" : "Meagen", "title" : "CMO", "reports_to" : 1 }
{ "_id" : 4, "name" : "Carlos", "title" : "CRO", "reports_to" : 1 }
{ "_id" : 8, "name" : "Richard", "title" : "VP PS", "reports_to" : 1 }
*/

// All descendents of Eliot in the ORG-CHART
db.parent_reference.aggregate([
  { $match: { name: "Eliot"}},
  { $graphLookup: {
    from: 'parent_reference',
    startWith: '$_id',
    connectFromField: '_id',
    connectToField: 'reports_to',
    as: 'all_reports' }
  }
]).pretty()

// All descendents of Eliot, sorted in order of people they report to
db.parent_reference.aggregate([
  { $match: { name: "Eliot"}},
  { $graphLookup: {
    from: 'parent_reference',
    startWith: '$_id',
    connectFromField: '_id',
    connectToField: 'reports_to',
    as: 'all_reports' }
  },
  { $unwind: '$all_reports'},
  { $project: {
    _id:1,
    name:1,
    title:1,
    reports_to:1,
    'Reportee_id': '$all_reports._id',
    'Reportee_name': '$all_reports.name',
    'Reportee_title': '$all_reports.title',
    'Boss_id': '$all_reports.reports_to'
  }},
  { $sort: { 'Boss_id': 1 } }
]).pretty()


var entries = [
  { "_id" : 1, "name" : "Dev", "title" : "CEO", "direct_reports" : ["Eliot", "Meagen", "Carlos", "Richard", "Kristen"] },
  { "_id" : 2, "name" : "Eliot", "title" : "CTO", "direct_reports" : ["Andrew", "Elyse", "Ron"]},
  { "_id" : 3, "name" : "Meagen", "title" : "CMO" },
  { "_id" : 4, "name" : "Carlos", "title" : "CRO" },
  { "_id" : 5, "name" : "Andrew", "title" : "VP Eng", "direct_reports" : ["Cailin", "Dan", "Shannon"] },
  { "_id" : 6, "name" : "Ron", "title" : "VP PM" },
  { "_id" : 7, "name" : "Elyse", "title" : "COO" },
  { "_id" : 8, "name" : "Richard", "title" : "VP PS" },
  { "_id" : 9, "name" : "Shannon", "title" : "VP Education" },
  { "_id" : 10, "name" : "Dan", "title" : "VP Core Engineering" },
  { "_id" : 11, "name" : "Cailin", "title" : "VP Cloud Engineering" }
]

db.child_reference.insertMany(entries)

// All people directly reporting to Dev
db.child_reference.aggregate([
  { $match: { name: 'Dev'}},
  { $graphLookup: {
    from: 'child_reference',
    startWith: '$direct_reports',
    connectFromField: 'direct_reports',
    connectToField: 'name',
    as: 'all_reports',
    // maxDepth: if you dont give this, $graphLookup will go through all levels
    // maxDepth: 0 // lookup only the direct child nodes.
    maxDepth: 1, // include grandchild nodes. Same as not specifying this at all for this collection, as stuff are only upto grandchildren
    depthField: 'level'
  } }
]).pretty()

{
	"_id" : 1,
	"name" : "Dev",
	"title" : "CEO",
	"direct_reports" : [
		"Eliot",
		"Meagen",
		"Carlos",
		"Richard",
		"Kristen"
	],
	"all_reports" : [
		{
			"_id" : 7,
			"name" : "Elyse", "title" : "COO", "level" : NumberLong(1) } // level 1 indicates grandchild. if 'maxDepth:0' was provided, these would not show up
		{
			"_id" : 6,
			"name" : "Ron", "title" : "VP PM", "level" : NumberLong(1) }
		{
			"_id" : 5,
			"name" : "Andrew", "title" : "VP Eng", "direct_reports" : [ "Cailin", "Dan", "Shannon" ], "level" : NumberLong(1) }
		{
			"_id" : 2,
			"name" : "Eliot", "title" : "CTO", "direct_reports" : [ "Andrew", "Elyse", "Ron" ], "level" : NumberLong(0) }
		{
			"_id" : 3,
			"name" : "Meagen", "title" : "CMO", "level" : NumberLong(0) }
		{
			"_id" : 4,
			"name" : "Carlos", "title" : "CRO", "level" : NumberLong(0) }
		{
			"_id" : 8,
			"name" : "Richard", "title" : "VP PS", "level" : NumberLong(0)
		}
	]
}

/*
GRAPH LOOKUP : JOININIG DIFFERENT DOCUMENTS
*/

/* Load data from json file
mongoimport --db dbName --collection collName --file file.json */
mongoimport --db GraphOPS --collection airlines --file air_airlines.json // 2017-05-30T20:17:13.779+0530	imported 6048 documents
mongoimport --db M304_GraphOPS --collection routes --file air_routes.json // 2017-05-30T21:26:28.646+0530	imported 66985 documents

// Original plan was to keep all databases as part of this course prefixed with 'M304_'
// for GraphOPS, that was not done, so copying existing db to new db with proper name, and dropping the old one
// ^^ because you cannot simply rename an existing database
db.copyDatabase('GraphOPS','M304_GraphOPS') // copy into new database
use GraphOPS // set currentdatabase to old one
db.dropDatabase() // drop it
// It worked :
> use M304_GraphOPS
switched to db M304_GraphOPS
> show collections
airlines
child_reference
parent_reference


db.airlines.createIndex({name: 1})

db.airlines.explain("executionStats").find({name: { $regex: /india/i } }) // 6 entries
db.airlines.find({name: { $regex: /india/i } }, { _id:0, name:1} ).pretty()
/*
{ "name" : "Air India Express" }
{ "name" : "Air India Limited" }
{ "name" : "Air India Regional" }
{ "name" : "India International Airways" }
{ "name" : "Indian Air Force" }
{ "name" : "Indian Airlines" }
*/

db.airlines.aggregate([
  { $match: { name: 'Air India Express' }},
  { $graphLookup: {
    from: 'routes',
    startWith: '$base',
    connectToField: 'src_airport', // check $base in connectToField, i.e. Source
    connectFromField: 'dst_airport', // recursively check data in connectToField in connectFromField
    maxDepth: 0,
    as: 'RoutesFromIndia'
  } },
]).pretty();

db.airlines.aggregate([
  { $match: { name: 'Air India Express' }},
  { $graphLookup: {
    from: 'routes',
    startWith: '$base',
    connectToField: 'src_airport', // check $base in connectToField, i.e. Source
    connectFromField: 'dst_airport', // recursively check data in connectToField in connectFromField
    maxDepth: 0,
    restrictSearchWithMatch: { 'airlines.name': 'Air India Express' }, // qoutes around key are needed
    as: 'RoutesFromIndiaViaAirIndiaExpressOnly'  // none
  } },
]).pretty();


/*
Things to keep in Mind
*/

1. Due to recursive nature of graphLookup, it can lead to very high memory usage; '$allowDiskUse' is your friend
2. Indexes on the connectToField will be good to have, as the values are constantly searched in them
3. 'from' collection CANNOT be sharded
4. Unrelated '$match' stages will NOT be pushed before the '$graphLookup' stage.
5. Maximum memory allowed per aggreagation pipeline is 100 MB ; Even with '$allowDiskUse', this limit may still be surpassed if you arent careful
