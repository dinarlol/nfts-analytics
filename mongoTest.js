/* eslint-disable no-plusplus */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const { MongoClient } = require('mongodb');

const murl = 'mongodb://127.0.0.1:27017/';
const dbName = 'nftanalytics';
MongoClient.connect(murl, function (err1, dbo) {
    if (err1) throw err1;
    const db = dbo.db(dbName);
  db.collection('sales').aggregate(
    [
      { $match: {} },
      {
          $group:    {
        _id: "$contract_id",
        sales: { $sum: { $multiply: [ "$timestamp", 1 ] } },
        count: { $sum: 1 }
      }
  },

   //   { $group: { _id: '$contract_id', 'sales': { $sum: "$value" } } },
      { $sort: {sales: 1 }}
    ], {}
  ).toArray(console.log);

  db.collection('sales').aggregate([
    { "$match": {
        "timestamp": { 
            "$gte": new Date(new Date().valueOf() - ( 1000 * 60 * 60 * 1 ))
        }
    }},
    { "$group": {
        "_id": "$contract_id",
        "1mincount": { 
            "$sum": {
                "$cond": [
                    { "$gt": [
                        "timestamp",
                        new Date().valueOf() - ( 1000 * 60 * 1 ) / 1000
                    ]},
                    "$count",
                    0
                ]
            }
        },
        "1minvalue": { 
            "$sum": {
                "$cond": [
                    { "$gt": [
                        new Date().valueOf() - ( 1000 * 60 * 1 )
                    ]},
                    "$value",
                    0
                ]
            }
        },
    }}
]).toArray(console.log);

});