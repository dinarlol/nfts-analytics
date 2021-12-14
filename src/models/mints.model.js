const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const salesSchema = mongoose.Schema({
  tx: {
    type: String,
    required: true,
    index: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  minter: {
    type: String,
    required: true,
  },
  buyer: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    default: true,
  },
  contract_id: {
    type: String,
    required: true,
  },
  blockNumber: {
    type: String,
    default: true,
  },
});

// add plugin that converts mongoose to json
salesSchema.plugin(toJSON);

/**
 * @typedef Sales
 */
const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;
