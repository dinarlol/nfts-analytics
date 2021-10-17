/* eslint-disable no-continue */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
const { ethers } = require('ethers');

const { MongoClient } = require('mongodb');

const murl = 'mongodb://127.0.0.1:27017/';

const nftdb = 'nftanalytics';

MongoClient.connect(murl, function (err1, db) {
    if (err1) throw err1;
    const dbo = db.db(nftdb);
    const cb = function(err, result) {
        if (err) {
            console.log.send(err);
        } else {
          console.log(result);
        }}
    const res = dbo.collection('assets').aggregate([
        { "$group": { "_id": "$_id", "count": { "$sum": 1 }, "totalCount": { "$sum": "$value" } } }
    ]);
    res.next((err, resp) => {
        console.log(resp);
    })

    const resp = dbo.collection('assets').find({});
    console.log(resp);
    resp.next((err, respX) => {
        console.log(respX.asset_contract);
    })
});