/*
Q1. Please review the data model for the Crunchbase companies data set. The document from this collection for Facebook is attached in the handout for convenience. Documents in this collection contain several array fields including one for "milestones".

Suppose we are building a web site that will display companies data in several different views. Based on the lessons in this module and ignoring other concerns, which of the following conditions favor embedding milestones (as they are in the facebook.json example) over maintaining milestones in a separate collection. Check all that apply.

Note: Schema design is as much an art as a science. If you get the answer wrong on your first attempt. Please visit the forum to discuss with your fellow students.*/

// This post on the discussion forum on this Question Helped:

/*Hi,

• The number of milestones for a company rarely exceeds 10 per year
I think it is true. I consider that we have here one to few.

• Milestones will never contain more than 15 fields
I think it is not true. I don’t see a reason for embedding milestone because of the quantity of fields.

• An individual milestone will always be smaller than 16K bytes
I think it is not true, but I’m not sure. The milestone can be incremented forever. Even considering that we have just 10 for year, after dozens of years we could have a performance problem.

• One frequently displayed view of our data displays company details such as the "name", "founded_year", "twitter_username", etc. as well as milestones.
This is true. If you watch benefits of embedding video, it is explained that a strong reason for embed is reading latency.

• Some of the milestone fields such as "stoneable_type" and "stoneable" are frequently the same from one milestone to another
I don’t think it is true. I understood the benefits of embedding is performance and transactions control. I think it doesn’t fit any of them. */

// Accordingly My answers (correct and accepted version) :
• The number of milestones for a company rarely exceeds 10 per year // True
• Milestones will never contain more than 15 fields // False
• An individual milestone will always be smaller than 16K bytes // False
• One frequently displayed view of our data displays company details such as the "name", "founded_year", "twitter_username", etc. as well as milestones. // True
• Some of the milestone fields such as "stoneable_type" and "stoneable" are frequently the same from one milestone to another // False

// Another member called veryFatBoy pointed out the below post in a previous iteration of the course, which also pointed to the same direction:
/*My advice is to recall what has been said throughout this week's lectures and if it hasn't been mentioned, even though it sounds reasonable, just ignore it and go for the only ones that have been given as concrete suggestions. For example, when the advice given for choosing when to embed vs. link collections in the 1:1, 1:many and many:many discussions. What were significant factors for embedding rather than creating a separate collection and linking them? I can only recall two that I could see in the list ;-)*/

====================================================================================================================================================

/*
Q2.
Suppose you are working with a set of categories defined using the following tree structure. "Science" is a sub-category of "Books"; "Chemistry" and "Physics" are sub-categories of "Science"; and "Classical Mechanics" and "Quantum Mechanics" are sub categories of "Physics".

Books
    Science
        Chemistry
        Physics
            Classical Mechanics
            Quantum Mechanics

For this tree, each node is represented by a document in a collection called categories.

Which of the following schemas will make it possible to find() all descendants of a category using a single query. For example, all descendants of "Science" are "Chemistry", "Physics", "Classical Mechanics", and "Quantum Mechanics".

// A)
db.categories.insertOne({"_id": "Books", "parent": 0, "left": null, "right": "Science"})
db.categories.insertOne({"_id": "Science", "parent": "Books", "left": "Chemistry", "right": "Physics"})
db.categories.insertOne({"_id": "Chemistry", "parent": "Science", "left": null, "right": null})
db.categories.insertOne({"_id": "Physics", "parent": "Science", "left": "Classical Mechanics", "right": "Quantum Mechanics"})
db.categories.insertOne({"_id": "Classical Mechanics", "parent": "Physics", "left": null, "right": null})
db.categories.insertOne({"_id": "Quantum Mechanics", "parent": "Physics", "left": null, "right": null})

// B)
db.categories.insertOne({"_id": "Quantum Mechanics", "ancestors": ["Books", "Science", "Physics"], "parent": "Physics"})
db.categories.insertOne({"_id": "Classical Mechanics", "ancestors": ["Books", "Science", "Physics"], "parent": "Physics"})
db.categories.insertOne({"_id": "Physics", "ancestors": ["Books", "Science"], "parent": "Science"})
db.categories.insertOne({"_id": "Chemistry", "ancestors": ["Books", "Science"], "parent": "Science"})
db.categories.insertOne({"_id": "Science", "ancestors": ["Books"], "parent": "Books"})
db.categories.insertOne({"_id": "Books", "ancestors": [], "parent": null})

// C)
db.categories.insertOne({"_id": "Classical Mechanics", "parent": "Physics"})
db.categories.insertOne({"_id": "Quantum Mechanics", "parent": "Physics"})
db.categories.insertOne({"_id": "Physics", "parent": "Science"})
db.categories.insertOne({"_id": "Chemistry", "parent": "Science"})
db.categories.insertOne({"_id": "Science", "parent": "Books"})
db.categories.insertOne({"_id": "Books", "parent": null})

// D)
db.categories.insertOne({"_id": "Classical Mechanics", "children": []})
db.categories.insertOne({"_id": "Quantum Mechanics", "children": []})
db.categories.insertOne({"_id": "Physics", "children": ["Classical Mechanics", "Quantum Mechanics"]})
db.categories.insertOne({"_id": "Chemistry", "children": []})
db.categories.insertOne({"_id": "Science", "children": ["Physics", "Chemistry"]})
db.categories.insertOne({"_id": "Books", "children": ["Science"]})

// E)
db.categories.insertOne({"_id": "Classical Mechanics", "children": [], "descendants": []})
db.categories.insertOne({"_id": "Quantum Mechanics", "children": [], "descendants": []})
db.categories.insertOne({"_id": "Physics", "children": ["Classical Mechanics", "Quantum Mechanics"], "descendants": ["Classical Mechanics", "Quantum Mechanics"] })
db.categories.insertOne({"_id": "Chemistry", "children": [], "descendants": []})
db.categories.insertOne({"_id": "Science", "children": ["Chemistry", "Physics"], "descendants": ["Chemistry", "Physics", "Classical Mechanics", "Quantum Mechanics"]})
db.categories.insertOne({"_id": "Books", "children": ["Science"], "descendants": ["Science", "Chemistry", "Physics", "Classical Mechanics", "Quantum Mechanics"]})
*/

// Ans: B
// The ancestors method was there in the quiz also, as well as : https://docs.mongodb.com/manual/tutorial/model-tree-structures-with-ancestors-array/
// Below Query finds all the descendants using the ancestors method:
db.categories.find(   { ancestors:{ $all: ["Science"]} } , { _id:1  }).pretty()
/*  Gives:
{ "_id" : "Quantum Mechanics" }
{ "_id" : "Classical Mechanics" }
{ "_id" : "Physics" }
{ "_id" : "Chemistry" }
*/

// Option E is trivial. And for real world scenarios, it will lead to huge arrays

====================================================================================================================================================

/*
Q3.
Suppose you are working with a library catalog system containing collections for patrons, publishers, and books. Book documents maintain a field "available" that identifies how many copies are currently available for checkout. There is also a field "checkout" that holds a record of all patrons that are currently borrowing a copy of the book. For example, the document below indicates that the library owns four copies of "Good Book". Three are currently available for checkout. One has been checked out by patron "33457".

{
    _id: 123456789,
    title: "Good Book",
    author: [ "Sam Goodman", "Mike Smith" ],
    published_date: ISODate("2010-09-24"),
    publisher_id: "Smith Publishing",
    available: 3,
    checkout: [ { patron_id: "33457", date: ISODate("2012-10-15") } ]
}

Which of the following is the primary advantage to this design?

1. We get the ability to retrieve a complete checkout history for books as a side effect.
2. We maintain the ability to update patrons, publishers, and books independently and safely rely on MongoDB's foreign key constraints.
3. We maintain the ability to update patrons, publishers, and books independently and safely rely on MongoDB's foreign key constraints.
4. Can retrieve all data about a book, its publisher, and any patrons who checked out the book with a single query.
5. Can make atomic updates as books are checked out or turned in.
*/

// Ans: 5 ( #4 seemed correct also, but it wasn't, as "who checked out the book" probably indicates all historical record of checkouts, whereas only current check outs can be seen from a query)
