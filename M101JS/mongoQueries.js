> db.movies.insertOne({ "title": "Jaws", "year": 1975, "imdb": "tt0073195" });
> db.movies.insertOne({ "title": "Mad Max 2: The Road Warrior", "year": 1981, "imdb": "tt0082694" })
> db.movies.insertOne({ "title": "Raiders of the Lost Ark", "year": 1981, "imdb": "tt0082971" })

> db.movies.find({"title": "Jaws"} ).pretty() // gives only 1 document as output

// this neds to be entered on a terminal, not the MONGO SHELL
mongorestore -d Movie -c movies /media/somjit/Movies/mongo/JSON/CRUDops/dump/movies.bson                        // 3365
mongorestore -d Movie -c movieDetails /media/somjit/Movies/mongo/JSON/CRUDops/dump/movieDetails.bson            // 2295
mongorestore -d Movie -c moviesScratch /media/somjit/Movies/mongo/JSON/CRUDops/dump/moviesScratch.bson          // 8
mongorestore -d Movie -c reviews /media/somjit/Movies/mongo/JSON/CRUDops/dump/reviews.bson                      // 20


> db.getCollectionNames()  // [ "movieDetails", "movies", "moviesScratch", "reviews" ]
> db.moviesScratch.drop()


db.somjit.insertMany(
  [
    {	"_id" : "tt0084726",
  	"title" : "Star Trek II: The Wrath of Khan",
  	"year" : 1982,
  	"type" : "movie"
    },
    {	"_id" : "tt0084726",
  	"title" : "Star Trek: First Contact",
  	"year" : 1996,
  	"type" : "movie"
    }
  ],
  { "ordered": false } // this doesnt seem to work anymore, still throws error for same _id
)

_id ==> object id : <date><mac_addr><pid><counter> : 4|3|2|3 >> total 12
<date> : seconds since epoch
<counter> : last three bytes to 'break the tie' incase the earlier 9 bytes end up being the same


// a ternary operator version of this did not seem to work in the shell
var get = (x,y) => {
  if(typeof x === 'number') return db.movieDetails.find().limit(x).pretty();
  if(typeof x === 'object'){
    if(typeof y === 'number') return db.movieDetails.find(x).limit(y).pretty();
    else return db.movieDetails.find(x).pretty();
  }
  return db.movieDetails.find("notAnObject")
}

get({"year" : 2013},1) // gives:
{
	"_id" : ObjectId("5692a43e24de1e0ce2dfdadb"),
	"title" : "Louis C.K. Oh My God",
	"year" : 2013,
	"rated" : "TV-MA",
	"released" : ISODate("2013-04-13T04:00:00Z"),
	"runtime" : 58,
	"countries" : [
		"USA"
	],
	"genres" : [
		"Documentary",
		"Comedy"
	],
	"director" : "Louis C.K.",
	"writers" : [
		"Louis C.K."
	],
	"actors" : [
		"Louis C.K."
	],
	"plot" : "In February, 2013, Louis brings his impish nihilism to Phoenix, Arizona. He talks about an old lady and her pet, living in Manhattan, experiencing his body's aging (he's 45), men's ...",
	"poster" : "http://ia.media-imdb.com/images/M/MV5BMjQ4NjQwOTYzNl5BMl5BanBnXkFtZTcwNjU2NjczOQ@@._V1_SX300.jpg",
	"imdb" : {
		"id" : "tt2510998",
		"rating" : 8.4,
		"votes" : 5085
	},
	"awards" : {
		"wins" : 0,
		"nominations" : 6,
		"text" : "Won 1 Primetime Emmy. Another 6 nominations."
	},
	"type" : "movie"
}

db.movieDetails.find({"rated":"PG-13"}).limit(2).pretty()
db.movieDetails.find({"actors.0": "Jeff Bridges"}).count() // Jeff Bridges is 1st array position



db.movieDetails.find({ runtime: { $gt: 90 } }).count()
db.movieDetails.find({ runtime: { $gt: 90, $lt: 120 } }).count()
db.movieDetails.find({ "tomato.meter": { $gte: 95 }, runtime: { $gt: 180 } })
db.movieDetails.find({ rated: { $ne: "UNRATED" } }).count()
db.movieDetails.find({ rated: { $in: ["G", "PG"] } }).pretty()


db.moviesDetails.find({ "tomato.meter": { $exists: true } })
db.moviesDetails.find({ "tomato.meter": { $exists: false } })
// Value of $type may be either a BSON type number or the string alias
// See https://docs.mongodb.org/manual/reference/operator/query/type
db.moviesScratch.find({ _id: { $type: "string" } })


db.movieDetails.find({ $and : [
  { rated: { $exists: true } },
  { rated: { $eq: "UNRATED" } }
] })


db.movieDetails.find({ $or : [
  { "tomato.meter": { $gt: 99 } },
  { "metacritic": { $gt: 95 } }
] })


db.movieDetails.find({ $and : [
  { "metacritic": { $ne: 100 } },
  { "metacritic" { $exists: true } }
] })

// regex: https://docs.mongodb.com/manual/reference/operator/query/regex/
db.movieDetails.find( { "awards.text": { $regex: /^Won.*/ } } ).pretty()

db.movieDetails.find(
  { "awards.text": { $regex: /^Won.*/ } },
  { title: 1, "awards": 1, _id: 0}
).pretty()

// projection: selecting particular fields
// https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/
db.movies.find({},{title: 1, _id: 0}).limit(5).pretty()
{ "title" : "Once Upon a Time in the West" }
{ "title" : "Wild Wild West" }
{ "title" : "West Side Story" }
{ "title" : "Slow West" }
{ "title" : "An American Tail: Fievel Goes West" }


// Array operators
// match where all of these are in genres
db.movieDetails.find({ genres: { $all: ["Comedy", "Crime", "Drama"] } }).pretty()
// countries array is of length 1, ie shot in only one country
db.movieDetails.find({ countries: { $size: 1 } }).pretty()

boxOffice: [ { "country": "USA", "revenue": 41.3 },
             { "country": "Australia", "revenue": 2.9 },
             { "country": "UK", "revenue": 10.1 },
             { "country": "Germany", "revenue": 4.3 },
             { "country": "France", "revenue": 3.5 } ]
// this will give wrong result: union of two sets :
// 1. all records with country UK,
// 2. all records with revenue > 15
db.movieDetails.find({ boxOffice: { country: "UK", revenue: { $gt: 15 } } })

// all criteria must be satisfied withon a single element of an array
// i.e the same element must have both country UK and revenue > 15
db.movieDetails.find({ boxOffice: {$elemMatch: { country: "UK", revenue: { $gt: 15 } } } })


// Update operations

db.movieDetails.updateOne(
  {title: "The Martian"},
  { $set: {poster: "http://ia.media-imdb.com/images/M/MV5BMTc2MTQ3MDA1Nl5BMl5BanBnXkFtZTgwODA3OTI4NjE@._V1_SX300.jpg"} }
)
db.movieDetails.updateOne(
  {title: "The Martian"},
  { $set: { "awards" : {"wins" : 8, "nominations" : 14, "text" : "Nominated for 3 Golden Globes. Another 8 wins & 14 nominations." } }}
);

// Updates are used to correct errors and, over time, keep our data current.
// For movie data, much of what's there is static: directors, authors and the like.
// Other content such as reviews and ratings will need to be updated as users
// take action. We could use $set for this purpose, but that's an error prone
// approach. It's too easy to do the arithmetic incorrectly. Instead, we have a
// number of operators that support numeric updates of data: $min, $max, $inc,
// $mul. Let's look at an example using $inc to update reviews.
db.movieDetails.updateOne(
  {title: "The Martian"}, // where to update
  { $inc: { "tomato.reviews": 3, "tomato.userReviews": 25 } } // increment
)

// No reviews upto now. Add the first review
db.movieDetails.updateOne(
  {title: "The Martian"},
  {$push: { reviews: {   // pushing something that doesn't exists creates it
    rating: 4.5,
    date: ISODate("2016-01-12T09:00:00Z"),
    reviewer: "Spencer H.",
    text: "The Martian could have been a sad drama film, instead it was a hilarious film with a little bit of drama added to it. The Martian is what everybody wants from a space adventure. Ridley Scott can still make great movies and this is one of his best."
  }}}
)

// see: https://docs.mongodb.com/manual/reference/operator/query/type/#available-types
// ISODate makes the date field of reviews, of type "date"
db.movieDetails.find({ "reviews.date": { $type:"date" } }).count() // returns 1 (as we have only added 1 review)

// projection
db.movieDetails.find( {title:"The Martian"}, { title:1, "reviews.date":1, _id:0 } )

// Remove the review field altogether. Deletes the newly added review
db.movieDetails.update(
  {title:"The Martian"},     // which document to remove stuff from
  { $unset: { reviews: "" }} // which field to remove ($unset)
)

db.movieDetails.updateOne(
  {title: "The Martian"},
  {push: { reviews: {
    $each: [      // add each of these array elements to existing reviews as siblings, instead of child, which would have happened without the $each keyword
      { rating: 0.5,
        date: ISODate("2016-01-12T07:00:00Z"),
        reviewer: "Yabo A.",
        text: "i believe its ranked high due to its slogan 'Bring him Home' there is nothing in the movie, nothing at all ! Story telling for fiction story !"},
      { rating: 5,
        date: ISODate("2016-01-12T09:00:00Z"),
        reviewer: "Kristina Z.",
        text: "This is a masterpiece. The ending is quite different from the book - the movie provides a resolution whilst a book doesn't."},
      { rating: 2.5,
        date: ISODate("2015-10-26T04:00:00Z"),
        reviewer: "Matthew Samuel",
        text: "There have been better movies made about space, and there are elements of the film that are borderline amateur, such as weak dialogue, an uneven tone, and film cliches."},
      { rating: 4.5,
        date: ISODate("2015-12-13T03:00:00Z"),
        reviewer: "Eugene B",
        text: "This novel-adaptation is humorous, intelligent and captivating in all its visual-grandeur. The Martian highlights an impeccable Matt Damon, power-stacked ensemble and Ridley Scott's masterful direction, which is back in full form."},
      { rating: 4.5,
        date: ISODate("2015-10-22T00:00:00Z"),
        reviewer: "Jens S",
        text: "A declaration of love for the potato, science and the indestructible will to survive. While it clearly is the Matt Damon show (and he is excellent), the supporting cast may be among the strongest seen on film in the last 10 years. An engaging, exciting, funny and beautifully filmed adventure thriller no one should miss."},
      { rating: 4.5,
        date: ISODate("2016-01-12T09:00:00Z"),
        reviewer: "Spencer H.",
        text: "The Martian could have been a sad drama film, instead it was a hilarious film with a little bit of drama added to it. The Martian is what everybody wants from a space adventure. Ridley Scott can still make great movies and this is one of his best."
      }  ]
  } } }
)

// Deletee the oldest review, and add a new one, keeping only 5 reviews at a time
db.movieDetails.updateOne(
  { title: "The Martian" },
  // $push : appends at the end of the array if $position is not specified. Creates a new array if specified array does not exist
  // $each : $push-es 'each' of the objects specified to the array mentioned in $push
  {$push: { reviews: {
    $each: [
      { rating: 0.5,
        date: ISODate("2016-01-13T07:00:00Z"),
        reviewer: "Shannon B.",
        text: "Enjoyed watching with my kids!" }
    ],
    $position: 0, // denotes where $push adds it's stuff. 0 : begining
    $slice: 5 // keep only 5 reviews from the begining of the array
    } } }
)


//A Slight detour to explain array addition updation
db.somjit.insertOne({_id:100, arr:[10,20,30] })
db.somjit.updateOne( // push where _id is 100
  { _id: 100},
  { $push: { arr: {  // no $position, thus append at end
        $each: [40,50,60],
        $slice: -5 // keep only last 5
  } } }
)  // { "_id" : 100, "arr" : [ 20, 30, 40, 50, 60 ] }


db.somjit.updateOne( // push where _id is 100
  { _id: 100},
  { $push: { arr: {
        $each: [10],
        $position: 0 // insert at the front/begining of the array. no $slice limit, thus array will grow
  } } }
) // { "_id" : 100, "arr" : [ 10, 20, 30, 40, 50, 60 ] }

db.somjit.updateOne( // push where _id is 100
  { _id: 100},
  { $push: { arr: {
        $each: [10, 20, 30], // add some repeats
        $position: 0 // insert at front
  } } }
) // { "_id" : 100, "arr" : [ 10, 20, 30, 10, 20, 30, 40, 50, 60 ] }

db.somjit.updateOne( // push where _id is 100
  { _id: 100},
  { $push: { arr: {
        $each: [10],
        $position: 0,
        $slice: -6 // remove repeats
  } } }
)  // { "_id" : 100, "arr" : [ 10, 20, 30, 40, 50, 60 ] }


/*******************************
Removing stuff that are null
********************************/

// how many such cases?
db.movieDetails.find({ $and: [
  {rated: { $exists: true}},
  {rated: null}
]}).count() // 1599

// Could do this, but it's probably the wrong semantics.
db.movieDetails.updateMany(
  { rated: null },
  { $set : { rated: "UNRATED" } }
)
// Better to do this.
db.movieDetails.updateMany(
  { rated: null }, // find nulls
  { $unset: { rated: "" } } // removes the field altogether
)
// this also works, but probably redundant, as the above filter works fine
db.movieDetails.updateMany(
  { $and: [
    {rated: { $exists: true}},
    {rated: null}
  ]}, // find nulls
  { $unset: { rated: "" } } // removes the field altogether
)     //{ "acknowledged" : true, "matchedCount" : 1599, "modifiedCount" : 1599 }

db.movieDetails.updateOne(
    {"imdb.id": detail.imdb.id},
    {$set: detail},
    {upsert: true}); // UPSERT! insert if doesn't exist


db.movies.replaceOne(
    {"imdb": detail.imdb.id},
    detail);

// checkout the updating_documents handout for more queries (big ones that just update/insert data)

/*******************************
explain command
Verbosity modes for explain() : queryPlanner, executionStats and allPlansExecution,
^^ in ascending order or info given
********************************/

var exp = db.students.explain()
exp.help()
Explainable operations
	.aggregate(...) - explain an aggregation operation
	.count(...) - explain a count operation
	.distinct(...) - explain a distinct operation
	.find(...) - get an explainable query
	.findAndModify(...) - explain a findAndModify operation
	.group(...) - explain a group operation
	.remove(...) - explain a remove operation
	.update(...) - explain an update operation
Explainable collection methods
	.getCollection()
	.getVerbosity()
	.setVerbosity(verbosity)

  /*******************************
  Basic Aggregation
  ********************************/

db.companies.aggregate([
    { $match: { founded_year: 2004 } },
    { $project: {
        _id: 0,
        name: 1,
        founded_year: 1
    } }
])

db.companies.aggregate([
    { $match: { founded_year: 2004 } },
    { $sort: { name: 1} },
    { $limit: 5 },
    { $project: {
        _id: 0,
        name: 1 } }
])

// Take care with the order in which you specify sort skip and limit
db.companies.aggregate([
    { $match: { founded_year: 2004 } },
    { $limit: 5 },
    { $sort: { name: 1} },
    { $project: {
        _id: 0,
        name: 1 } }
])

db.companies.aggregate([
    { $match: { founded_year: 2004 } },
    { $sort: { name: 1} },
    { $skip: 10 },
    { $limit: 5 },
    { $project: {
        _id: 0,
        name: 1 } },
])

  /*******************************
  Aggregation with Array expressions
  ********************************/

// $$round below is like a pointer to a pointer
db.companies.aggregate([
    { $match: {"funding_rounds.investments.financial_org.permalink": "greylock" } },
    { $project: {
        _id: 0,
        name: 1,
        founded_year: 1,
        rounds: { $filter: {          // op: smaller array whose elems meet the given criteria
            input: "$funding_rounds", // input array for filter
            as: "round",
            cond: { $gte: ["$$round.raised_amount", 100000000] } } }
    } },
    // after the filter above, some rounds[] may be blank, as raised_amount was less.
    // below match filters out such documents blank rounds[]
    { $match: {"rounds.investments.financial_org.permalink": "greylock" } },
]).pretty()

// funding_rounds is an array
db.companies.aggregate([
    { $match: { "founded_year": 2010 } },
    { $project: {
        _id: 0,
        name: 1,
        founded_year: 1,
        first_round: { $arrayElemAt: [ "$funding_rounds", 0 ] },
        last_round: { $arrayElemAt: [ "$funding_rounds", -1 ] }
    } },
    // keep only those who has valid investments in the last round
    { $match: { "last_round.investments.financial_org": { $exists: true }}},
    { $limit: 2 } // just see two
]).pretty()


db.companies.aggregate([
    { $match: { "founded_year": 2010 } },
    { $project: {
        _id: 0,
        name: 1,
        founded_year: 1,
        first_round: { $slice: [ "$funding_rounds", 1 ] },
        last_round: { $slice: [ "$funding_rounds", -1 ] }
    } }
]).pretty()

db.companies.aggregate([
    { $match: { "founded_year": 2010 } },
    { $project: {
        _id: 0,
        name: 1,
        founded_year: 1,
        // leave funding_rounds[0], and take 3 from funding_rounds[1]
        // thus, funding_rounds[1,2 and 3]
        early_rounds: { $slice: [ "$funding_rounds", 1, 3 ] }
    } }
]).pretty()

// Inspecting the funding_rounds array
db.companies.find({name: "Facebook"},{_id:0,funding_rounds:1}).pretty();

db.companies.aggregate([
    { $match: { "founded_year": 2004 } },
    { $project: {
        _id: 0,
        name: 1,
        founded_year: 1,
        total_rounds: { $size: "$funding_rounds" }
    } }
]).pretty()

/*******************************
Basic accumulator in project stage
********************************/

db.companies.aggregate([
    { $match: { "funding_rounds": { $exists: true, $ne: [ ]} } },
    { $project: {
        _id: 0,
        name: 1,
        largest_round: { $max: "$funding_rounds.raised_amount" },
        total_funding: { $sum: "$funding_rounds.raised_amount" }
    } }
]).pretty()

/*******************************
Accumulator with $group
********************************/

db.companies.aggregate([
  // group by founded_year
  { $group: {
      _id: { founded_year: "$founded_year" }, // this is our key
      average_number_of_employees: { $avg: "$number_of_employees" }
  } },
  // sort in descending order
  { $sort: { average_number_of_employees: -1 } },
  { $limit: 5}

])

db.companies.find({name: { $regex: /^Face.*/i } }, {_id:0, name:1}).pretty()

db.companies.aggregate([
    { $group: {
      // adding a label helps visibilty of the returned data
        _id: { founded_year: "$founded_year" },
        average_number_of_employees: { $avg: "$number_of_employees" }
    } },
    // $project makes sense BEFORE $group
    { $project: { name:1, founded_year:1, average_number_of_employees:1}}, // useless
    { $sort: { average_number_of_employees: -1 } }
])

db.companies.aggregate( [
    { $match : { founded_year : 2001 } },
    { $project : { _id: 0, name : 1, number_of_employees: 1 } },
    { $sort : { number_of_employees : -1 } }
] )

// This shows how many individual relationships document has a particular
// person mentioned. To find a unique count of exactly how many companies
// the person was associated with, further work needed. This is because one
// person can be involded with a company over many years in different roles,
// and that would add to the count.

db.companies.aggregate( [
    { $match: { "relationships.person": { $ne: null } } },
    { $project: { relationships: 1, _id: 0 } },
    { $unwind: "$relationships" },
    { $group: {
        _id: "$relationships.person",
        count: { $sum: 1 }
    } },
    { $sort: { count: -1 } }
] ).pretty()

// $push adds the vale to an already running array
db.companies.aggregate([
    { $match: { founded_year: { $gte: 2010 } } },
    { $group: {
        _id: { founded_year: "$founded_year"},
        // push names of all companies founded in
        // a particularyear into one array
        companies: { $push: "$name" }
    } },
    { $sort: { "_id.founded_year": 1 } }
]).pretty()


// grouping with multiple keys/fields
db.companies.aggregate([
    { $match: { founded_year: { $gte: 2010 } } },
    { $group: {
        _id: { founded_year: "$founded_year", category_code: "$category_code" },
        companies: { $push: "$name" }
    } },
    { $sort: { "_id.founded_year": 1 } }
]).pretty()


db.companies.aggregate([
    { $group: {
        _id: { ipo_year: "$ipo.pub_year" },
        companies: { $push: "$name" }
    } },
    { $sort: { "_id.ipo_year": 1 } }
]).pretty()


db.companies.aggregate( [
    { $match: { "relationships.person": { $ne: null } } },
    { $project: { relationships: 1, _id: 0 } },
    { $unwind: "$relationships" },
    { $group: {

        // this resolves to a document with first name, last name and permalink
        // perfectly legal
        _id: "$relationships.person",
        count: { $sum: 1 }
    } },
    { $sort: { count: -1 } }
] )


/*******************************
 $group vs $project
********************************/


db.companies.find({funding_rounds: { $exists: true, $eq: []}},
  {_id:0, name:1, funding_rounds:1}).limit(2).pretty()
/*
{ "name" : "AdventNet", "funding_rounds" : [ ] }
{ "name" : "Zoho", "funding_rounds" : [ ] }
*/

db.companies.aggregate([
    { $match: { funding_rounds: { $ne: [ ] } } },
    { $unwind: "$funding_rounds" },
    { $sort: { "funding_rounds.funded_year": 1,
               "funding_rounds.funded_month": 1,
               "funding_rounds.funded_day": 1 } },
    { $group: {
        _id: { company: "$name" },
        funding: {
          // $push is an accumulator that is available on $group but not on $project
          // because it will combine stuff that has been 'grouped' together
            $push: {
                amount: "$funding_rounds.raised_amount",
                year: "$funding_rounds.funded_year"
            } }
    } },
    { $match: { "_id.company" : "Facebook"}}
] ).pretty()



db.companies.aggregate([
    { $match: { funding_rounds: { $exists: true, $ne: [ ] } } },
    { $unwind: "$funding_rounds" },
    { $sort: { "funding_rounds.funded_year": 1,
               "funding_rounds.funded_month": 1,
               "funding_rounds.funded_day": 1 } },
    { $group: {
        _id: { company: "$name" },
        // $first and $last are also accumulators
        // this is also availableonly in $group
        first_round: { $first: "$funding_rounds" },
        last_round: { $last: "$funding_rounds" },
        num_rounds: { $sum: 1 },
        total_raised: { $sum: "$funding_rounds.raised_amount" }
    } },
    { $project: {
        _id: 0,
        company: "$_id.company",
        first_round: {
            amount: "$first_round.raised_amount",
            article: "$first_round.source_url",
            year: "$first_round.funded_year"
        },
        last_round: {
            amount: "$last_round.raised_amount",
            article: "$last_round.source_url",
            year: "$last_round.funded_year"
        },
        num_rounds: 1,
        total_raised: 1,
    } },
    { $sort: { total_raised: -1 } }
] ).pretty()





db.companies.find({ name: "Fox Interactive Media" })
