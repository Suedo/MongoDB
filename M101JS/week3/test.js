var qs = [
  {"tag_list":{"$regex":"social-networking"},"founded_year":{"$gte":2002,"$lte":2016},"offices.city":"Palo Alto"},
  {"tag_list":{"$regex":"social-networking"},"offices.city":"London"},
  {"tag_list":{"$regex":"social-networking"},"founded_year":{"$lte":2010},"offices.city":"New York"}
]

db.companies.find(
  {"tag_list":{"$regex":"social-networking"},"founded_year":{"$gte":2002,"$lte":2016},"offices.city":"Palo Alto"},
  {_id:0, name:1}
).count() // 6

db.companies.find(
  {"tag_list":{"$regex":"social-networking"},"offices.city":"London"},
  {_id:0, name:1}
).count() // 20

db.companies.find(
  {"tag_list":{"$regex":"social-networking"},"founded_year":{"$lte":2010},"offices.city":"New York"},
  {_id:0, name:1}
).count() // 20



db.companies.findOne({},{ _id:0, name:1, 'offices.city':1, overview:1, tag_list:1 })



db.companies.findOne(
  { $or: [
    { overview: { '$regex': options.overview, '$options': 'i' } },
    { tag_list: { '$regex': options.overview, '$options': 'i' } }
  ]},
  { _id:0, name:1, 'offices.city':1, overview:1, tag_list:1 }
)

{ $or: [
  { overview: { '$regex': options.overview, '$options': 'i' } },
  { tag_list: { '$regex': options.overview, '$options': 'i' } }
]}

db.companies.findOne(
  { $and: [
    { overview: { '$regex': 'wiki', '$options': 'i' } },
    { tag_list: { '$regex': 'wiki', '$options': 'i' } }
  ]},
  { _id:0, name:1, 'offices.city':1, overview:1, tag_list:1 }
)
