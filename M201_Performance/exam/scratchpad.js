exp.find({name: "Perry Street Brasserie", "address.state": "NY"}, { _id:0, name:1 })
db.restaurants.createIndex({name:1})

var entries = [
  { price: 2.99, name: "Soap", in_stock: true, categories: ['Beauty', 'Personal Care'] },
  { price: 7.99, name: "Knife", in_stock: false, categories: ['Outdoors'] }
]

db.exam.insertMany(entries)

// queries:
 db.exam.find({ in_stock: true, price: { $gt: 1, $lt: 5 } }).sort({ name: 1 })
 db.exam.find({ in_stock: true })
 db.exam.find({ categories: 'Beauty' }).sort({ price: 1 })


// indexes:
  db.exam.createIndex({ categories: 1, price: 1 })
  db.exam.createIndex({ in_stock: 1, price: 1, name: 1 })


// query + explain:
  exp.find({ in_stock: true, price: { $gt: 1, $lt: 5 } }).sort({ name: 1 })
  exp.find({ in_stock: true })
  exp.find({ categories: 'Beauty' }).sort({ price: 1 })

/*
1. Index #1 would provide a sort to query #3. : true
2. Index #2 properly uses the equality, sort, range rule for query #1. : false
3. There would be a total of 4 index keys created across all of these documents and indexes. : 5 total keys, 4 keys "created" manually >> true
4. Index #2 can be used by both query #1 and #2. : true
*/
var exp = db.exam.explain("executionStats")


// query1:
  exp.find({ in_stock: true, price: { $gt: 1, $lt: 5 } }).sort({ name: 1 })
// index2:
  db.exam.createIndex({ in_stock: 1, price: 1, name: 1 })
// Index #2 properly uses the equality, sort, range rule for query #1. : NO >> this is equality, range, sort. 
