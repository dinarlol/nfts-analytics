/* eslint-disable object-shorthand */
/* eslint-disable no-multi-assign */
/* eslint-disable no-undef */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-continue */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
const { ethers } = require('ethers');

const { MongoClient } = require('mongodb');

// const murl = 'mongodb+srv://test:test@cluster0.cjynh.mongodb.net/nftanalytics?retryWrites=true&w=majority';

const murl = 'mongodb://127.0.0.1:27017/';

const nftdb = 'nftanalytics';

const trans = [];

// making contract object!

const abi = ['event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'];
// const contractAddress = '0xb06204423d5e2d6ad48d33181defcf14307894cb';
const url = 'https://mainnet.infura.io/v3/1760d78a30de43eab87209fb61c88e29';
const zero = '0x0000000000000000000000000000000000000000';

module.exports = { fetch: function(contractAddress, fromBlock) {
    const provider = new ethers.providers.JsonRpcProvider(url);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const filter = contract.filters.Transfer(null, null, null);
    filter.fromBlock = provider.getBlockNumber().then((b) => b - 5000);
    filter.toBlock = 'latest';
    const iface = new ethers.utils.Interface(abi);

    provider.getLogs(filter).then((logs) => {
        for (let index = 0; index < logs.length; index++) {
            const log = logs[index];
            if (trans.includes(log.transactionHash)) {
                continue;
            }
            trans.push(log.transactionHash);
            provider.getTransaction(log.transactionHash).then((tx) => {
                provider.getBlock(tx.blockNumber).then((block) => {
                    //  console.log(block.timestamp, ' is the transaction time');
                    const l = iface.parseLog(log);
                    let coll = "mints";
                    let data = {};
                    if (l.args.from === zero) {
                        // save in mint
                        data = { tx: log.transactionHash, timestamp: block.timestamp, minter: l.args.to, value: tx.value.toString(), tokenId: l.args.tokenId.toString(), contract_id: tx.to, blockNumber: tx.blockNumber };
                    }
                    else {
                        // save in sales
                        coll = "sales";
                        data = { tx: log.transactionHash, timestamp: block.timestamp, seller: l.args.from, buyer: l.args.to, value: tx.value.toString(), tokenId: l.args.tokenId.toString(), contract_id: tx.to, blockNumber: tx.blockNumber };
                    }
                    MongoClient.connect(murl, function (err1, db) {
                        if (err1) throw err1;
                        const dbo = db.db(nftdb);
                        const query = { tx: data.tx, tokenId: data.tokenId };
                        const values = { $set: data };
                        dbo.collection(coll).updateOne(query, values, { upsert: true }, function (err, res) {
                            if (err) throw err;
                            console.log(` ${index} document updated for ${coll}`, data, res);

                        });
                    });

                    console.log("data: ", data);
                }).catch(console.error);
            }).catch(console.error);

        }
        console.log(logs.length, 'is the count ');
    }).catch((e) => {
        console.log(e);
        process.exit(0);
    });
}
}