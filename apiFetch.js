/* eslint-disable no-plusplus */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const { MongoClient } = require('mongodb');
const assert = require('assert');
const api = require('./apiSaleChain')

const murl = 'mongodb://127.0.0.1:27017/';
const dbName = 'nftanalytics';

const mintsPipeline = function (db, callback) {

  db.collection('assets').aggregate(
    [
      { $match: {} },
      { $unwind: '$asset_contract' },
      { $group: { _id: '$asset_contract', 'mints': { $sum: 1 } } },
      { $sort: {mints: 1 }}
    ], {}
  ).toArray(callback);
};

// Returns a Promise that resolves after "ms" Milliseconds
const timer = ms => new Promise(res => setTimeout(res, ms))

module.exports = { getMints: function getMints () {
  MongoClient.connect(murl, function (err, client) {
    const db = client.db(dbName);
    assert.equal(null, err);
    mintsPipeline(db, function (err1, mints) {
        (async function(){
        for (let index = 0; index < mints.length; index++) {        
          const mint = mints[index];
          console.log(`Task ${mint._id} starting!`);
          api.fetch(mint._id.toLowerCase(), mint.mints); 
          await timer(45000);
          console.log(`Task ${mint._id} done!`);
        }
        })()  
        
    // api.fetch('0xaa86c991f431a0cff8aba553b19268debb9b48a4', 1); 
      
    });
  });
}
}
