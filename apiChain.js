const { ethers } = require('ethers');

// making contract object!

const smallContractABI = ['event Transfer(address indexed from, address indexed to, uint256 value)'];
const contractAddress = '0x453f8d5943a85dbf5594f6be84e632f62cee2ac6';
const url = 'https://mainnet.infura.io/v3/1760d78a30de43eab87209fb61c88e29';
const provider = new ethers.providers.JsonRpcProvider(url);
const contract = new ethers.Contract(contractAddress, smallContractABI, provider);

// here I can show you 2 ways.
// First way:
// Filtering

const filter = contract.filters.Transfer('0x0000000000000000000000000000000000000000', null, null);

// Note that null is not necessary if you are just filtering first argument, but if you want
// just filter second argument, you have to set first argument null.
// For example when you want to specify transfer events when
// a transfer has been reached a specific address. then you filter like this:
// let filter = contract.filters.Transfer(null, ADDRESS, null)

// Listening to events
let cnt = 0;
// eslint-disable-next-line no-console
console.log('from, to, amount, event, cnt');

contract.on(filter, (from, to, amount, event) => {
  // code here
  // eslint-disable-next-line no-plusplus
  cnt++;
  // eslint-disable-next-line no-console
  console.log(from, to, amount, event, cnt);
});

contract.on('Transfer', (from, to, amount, event) => {
  if (from === '0x0000000000000000000000000000000000000000') {
    // code here
    // eslint-disable-next-line no-console
    console.log(from, to, amount, event, cnt);
  } else {
    // eslint-disable-next-line no-console
    console.log(from, to, amount, event, 'cnt');
  }
});
