var MongoClient = require ('mongodb').MongoClient,
    commandLineArgs = require('command-line-args'),
    assert = require('assert');

var options = getCommandLineOptions();

MongoClient.connect('mongodb://localhost:27017/crunchy', (err,db) => {

  assert.equal(err, null);
  console.log('Successfully connected to MongoDB');

  var query = getQueryDocument(options);
  var projection = {_id:0, name:1, founded_year:1, number_of_employees:1 };
  var numMatches = 0;

  var cursor = db.collection('companies').find(query, projection).limit(10);

  cursor.forEach(
      doc => {
        numMatches++;
        console.log(numMatches +  ' ' + JSON.stringify(doc));
        // console.log(numMatches + JSON.stringify(doc,null,2));
        // console.log(doc.name + "; founded in " + doc.founded_year + "; employee count - " + doc.number_of_employees);
      },
      err => {
        console.log("Our query was:" + JSON.stringify(query));
        console.log("Matching documents: " + numMatches);
        return db.close();
      }
    )

});


function getCommandLineOptions(){

  var cli = commandLineArgs([
    { name: 'firstYear', alias: 'f', type: Number },
    { name: 'lastYear',  alias: 'l', type: Number },
    { name: 'employees', alias: 'e', type: Number }
  ]);

  if(cli.firstYear && cli.lastYear) return cli;
  // else
  console.log("firstYear and lastYear are mandatory");
  process.exit();

}

function getQueryDocument(options){

  var query = {
    "founded_year": {
      $gte : options.firstYear,
      $lte : options.lastYear
    }
  }

  if(options.employees) {
    query['number_of_employees'] = { '$gte': options.employees }
  }

  return query;

}


/* OUTPUT

> node app_cmd101.js --firstYear 2008 --lastYear 2012 --employees 300
Successfully connected to MongoDB
1 {"name":"OpenX","number_of_employees":305,"founded_year":2008}
2 {"name":"Mobiluck","number_of_employees":1234,"founded_year":2012}
3 {"name":"AdParlor","number_of_employees":300,"founded_year":2008}
4 {"name":"PurpleTalk","number_of_employees":350,"founded_year":2008}
5 {"name":"Thomson Reuters","number_of_employees":50000,"founded_year":2008}
6 {"name":"Yammer","number_of_employees":400,"founded_year":2008}
7 {"name":"Thomson Reuters","number_of_employees":50000,"founded_year":2008}
8 {"name":"Yammer","number_of_employees":400,"founded_year":2008}
9 {"name":"Groupon","number_of_employees":10000,"founded_year":2008}
10 {"name":"WJT Global Solutions","number_of_employees":2000,"founded_year":2008}
Our query was:{"founded_year":{"$gte":2008,"$lte":2012},"number_of_employees":{"$gte":300}}
Matching documents: 10

*/
