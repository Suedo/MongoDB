/*
Q1.
Which of the choices below is the title of a movie from the year 2013 that is rated PG-13 and won no awards? Please query the video.movieDetails collection to find the answer. */

db.movieDetails.find(
  { $and: [
    { year: 2013 },
    { rated: 'PG-13' } ] },
  { _id:0, title:1, 'awards.wins':1 }
)
/*
Answer: A Decade of Decadence, Pt. 2: Legacy of Dreams. It has 0 wins

{ "title" : "Journey to the West", "awards" : { "wins" : 1 } }
{ "title" : "All Is Lost", "awards" : { "wins" : 3 } }
{ "title" : "World War Z", "awards" : { "wins" : 3 } }
{ "title" : "Star Trek Into Darkness", "awards" : { "wins" : 6 } }
{ "title" : "What If", "awards" : { "wins" : 2 } }
{ "title" : "A Decade of Decadence, Pt. 2: Legacy of Dreams", "awards" : { "wins" : 0 } } // the answer
{ "title" : "After Earth", "awards" : { "wins" : 3 } }
{ "title" : "Thor: The Dark World", "awards" : { "wins" : 2 } }
{ "title" : "Iron Man 3", "awards" : { "wins" : 17 } }
{ "title" : "Man of Steel", "awards" : { "wins" : 7 } }
{ "title" : "Saving Mr. Banks", "awards" : { "wins" : 11 } }
*/


/*
Q2.
Using the video.movieDetails collection, which of the queries below would produce output documents that resemble the following. Check all that apply.

NOTE: We are not asking you to consider specifically which documents would be output from the queries below, but rather what fields the output documents would contain.

{ "title" : "P.S. I Love You" }
{ "title" : "Love Actually" }
{ "title" : "Shakespeare in Love" }

*/

db.movieDetails.findOne({},{ _id:0, title:1 })
db.movieDetails.findOne({ year: 1964 },{ _id:0, title:1 })

/*
Q3.
Using the video.movieDetails collection, how many movies list "Sweden" second in the the list of countries.

NOTE: There is a dump of the video database included in the handouts for the "Creating Documents" lesson. Use that data set to answer this question.
*/
db.movieDetails.findOne({ 'countries.1': 'Sweden' }) // test query
db.movieDetails.find({ 'countries.1': 'Sweden' }).count() // answer : 6


/*
Q4.
How many documents in our video.movieDetails collection list just the following two genres: "Comedy" and "Crime" with "Comedy" listed first.

NOTE: There is a dump of the video database included in the handouts for the "Creating Documents" lesson. Use that data set to answer this question.
*/

db.movieDetails.findOne( {genres: ['Comedy','Crime']}) // exactly in this order
db.movieDetails.find( {genres: ['Comedy','Crime']}).count() // exactly in this order


/*
Q4.
As a follow up to the previous question, how many documents in the video.movieDetails collection list both "Comedy" and "Crime" as genres regardless of how many other genres are listed?

NOTE: There is a dump of the video database included in the handouts for the "Creating Documents" lesson. Use that data set to answer this question
*/

db.movieDetails.findOne( {genres: { $all: ['Comedy','Crime'] }}) //test
db.movieDetails.find( {genres: { $all: ['Comedy','Crime'] }}).count() // ANSWER: 56

/*
Q5.
Suppose you wish to update the value of the "plot" field for one document in our "movieDetails" collection to correct a typo. Which of the following update operators and modifiers would you need to use to do this?
*/

// Answer: $set
