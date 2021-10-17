/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
const MongoClient = require('mongodb').MongoClient;

const request = require('request');

const murl = 'mongodb://127.0.0.1:27017/';

const nftdb = 'nftanalytics';

let url = 'https://api.opensea.io/api/v1/events?event_type=successful&only_opensea=false&format=json';

function runUpdate(offset, limit) {
  url += `&offset=${offset}&limit=${limit}`;

  request.get(
    {
      url,
      json: true,
      headers: { 'User-Agent': 'request' },
    },
    (error, resp, data) => {
      if (error) {
        console.log('Error:', error);
      } else if (resp.statusCode !== 200) {
        console.log('Status:', resp.statusCode);
      } else {
        // data is already parsed as JSON:
        MongoClient.connect(murl, function (err1, db) {
          if (err1) throw err1;
          const dbo = db.db(nftdb);
          data.asset_events.forEach((event) => {
            if (event.asset && !event.asset.collection.slug.toLowerCase().includes('untitle')) {
              // save or update in db
              const query = { id: event.asset.id };
              const values = {
                $set: { id: event.asset.id, asset: event.asset, asset_contract: event.asset.asset_contract.address },
              };
              dbo.collection('assets').updateOne(query, values, { upsert: true }, function (err, res) {
                if (err) throw err;
                console.log('1 document updated', res);
              });
            }
          });
        });
      }
    }
  );
}

// eslint-disable-next-line no-plusplus
for (let index = 0; index < 10; index++) {
  runUpdate(index * 300, 300);
}
