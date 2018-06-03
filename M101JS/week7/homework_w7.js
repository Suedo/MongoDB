/*
Q1.
Which of the following statements are true about replication in MongoDB? Check all that apply:
  1. Which of the following statements are true about replication in MongoDB? Check all that apply.
  2. MongoDB replication is synchronous.
  3. By default, using the MongoClient connection class, w=1 and j=1
  4. The oplog utilizes a capped collection.

*/

// Ans: Option 1 and 4
// A capped collection is similar to a GDG in COBOL, or a Citcular buffer in modern languages

/*
Q2.
Let's suppose you have a five member replica set and want to assure that writes are committed to the journal and are acknowledged by at least 3 nodes before you proceed forward. What would be the appropriate settings for w and j?

  1. w=1, j=1
  2. w="majority", j=1
  3. w=3, j=0
  4. w=5, j=1
  5. w=1, j=3
*/

// Ans: 2


/*
Q3.
Which of the following statements are true about choosing and using a shard key? Check all that apply.

    1. The shard key must be unique.
    2. There must be an index on the collection that starts with the shard key.
    3. MongoDB cannot enforce unique indexes on a sharded collection other than the shard key itself or indexes prefixed by the shard key.
    4. Any update that does not contain the shard key or _id field will result in an error.
    5. You can change the shard key on a collection if you desire.
*/

// Ans: 2,3,4
