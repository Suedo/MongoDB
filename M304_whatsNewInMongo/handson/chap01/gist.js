/*
What is a READ-ONLY-VIEW?
look like a collection, but don't have any actual documents. Created for reading puposes only.
They are a synthetic collection depending upon the source collection for their data.
It is an Aggregation Pipeline ( whatever that means!)
You cannot write to the view, but if you write to the source collection, the view might return different results when queried.
Doesn't consume any space, except for an entry in the system.views collection, which contains the view definition.


*/


// DBs created for this course are prefixed with "M304_"
// Adding Multiple documents to a collection
use M304_Personnel
var sevenEmployees = [
    { name: "Will Cross", team: "Curriculum", likes: ["physics", "lunch", "mongodb" ] },
    { name: "Zach Davis", team: "Curriculum", likes: ["video games", "windows", "lunch", "mongodb"] },
    { name: "Kirby Kohlmorgen", team: "Curriculum", likes: ["mongodb", "New York", "lunch"] },
    { name: "Graham Lowe", team: "University Platform", likes: ["mongodb", "Tim Horton's", "leadership"] },
    { name: "John Yu", team: "University Platform", likes: ["video games", "lunch", "mongodb", "rubik's cube"] },
    { name: "David Percy", team: "University Platform", likes: ["mongodb", "lunch", "video games", "puzzles"] },
    { name: "Jason Flax", team: "University Platform", likes: ["mongodb", "lunch", "current events", "design"] } ];

db.employees.insertMany( sevenEmployees );

// Adding a single document to the collection:
var Norberto = { name: "Norberto Leite", team: "Curriculum", likes: ["languages", "lunch", "mongodb", "leadership"] };
db.employees.insertOne(Norberto);

// this is how we create a Read-only view
// we give a name to this view, the collection from which it will get (aggregate) the data,
// this can be another view also, and finally, the aggregation pipeline.
db.createView( "justNameAndTeam", "employees", [
  { $project: { _id: 0, name: 1, team : 1 } }
] );

// As soon as we create a view, "system.views" is auto generated along with the view we created
db.getCollectionNames();   // [ "employees", "justNameAndTeam", "system.views" ]
show collections
/*employees
justNameAndTeam
system.views*/

// Properties of the view can be seen as such:
db.system.views.find()
/*
  { "_id" : "M304_Personnel.justNameAndTeam",
    "viewOn" : "employees",
    "pipeline" : [ { "$project" : { "_id" : 0, "name" : 1, "team" : 1 } } ] // the 'aggregation pipeline'
  }
*/

// And the view itself:
db.justNameAndTeam.find()
/*
  { "name" : "Will Cross", "team" : "Curriculum" }
  { "name" : "Zach Davis", "team" : "Curriculum" }
  { "name" : "Kirby Kohlmorgen", "team" : "Curriculum" }
  { "name" : "Graham Lowe", "team" : "University Platform" }
  { "name" : "John Yu", "team" : "University Platform" }
  { "name" : "David Percy", "team" : "University Platform" }
  { "name" : "Jason Flax", "team" : "University Platform" }
*/

// More complicated quesries :
db.justNameAndTeam.find( { name : { $lte : "K" } }, { name : 1 } ).sort( { name : -1 } )
{ "name" : "John Yu" }
{ "name" : "Jason Flax" }
{ "name" : "Graham Lowe" }
{ "name" : "David Percy" }

db.justNameAndTeam.aggregate( [ { $group : { _id : 0, numDocuments : { $sum : 1 } } } ] );
{ "_id" : 0, "numDocuments" : 7 }

// What we cannot do on a view:
/*
1. MapReduce
2. $text
3. Some Projection Operators
4. Positional $ Operators
5. $slice
6. $elemmatch and
7. $meta
*/

// Why use a view?
// Added Security. Read-only. Can have performance gain, if you are quesrying the same query multiple times, having a view with that query will help.

// This is what the parent employees collection looks like
db.employees.findOne()
{
	"_id" : ObjectId("58fcd3423e4d4963c7350ec2"),
	"name" : "Will Cross",
	"team" : "Curriculum",
	"likes" : [
		"physics",
		"lunch",
		"mongodb"
	]
}

// We are going to aggregate over team, finding what they like
db.createView("whatCurriculumLikes","employees",[
  { $match: { team : "Curriculum"} },
  { $unwind: "$likes" },  // create a separate document for each like for the team
  { $group: {
      _id: "$likes",
      popularity: { $sum: 1 }
  } },
  { $sort: { popularity: -1 } } // descending
]);

db.whatCurriculumLikes.find().pretty()
/*
{ "_id" : "lunch", "popularity" : 4 }
{ "_id" : "mongodb", "popularity" : 4 }
{ "_id" : "languages", "popularity" : 1 }
{ "_id" : "physics", "popularity" : 1 }
{ "_id" : "leadership", "popularity" : 1 }
{ "_id" : "New York", "popularity" : 1 }
{ "_id" : "windows", "popularity" : 1 }
{ "_id" : "video games", "popularity" : 1 }
*/

/*
Efficiency :
  Since views do not store any data, but run the aggreagation each time it's called,
  efficiency of the query on the source collection has a direct role to play in
  efficiency of the view. Thus, while designing views, try to have the most efficient
  query as per the properties (index etc) of the source collection
*/
