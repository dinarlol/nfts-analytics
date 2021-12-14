const { Sales } = require('../models');

/**
 * Query for sales
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySales = async (filter, options) => {
  const sales = await Sales.paginate(filter, options);
  return sales;
};

/**
 * Get sales by id
 * @param {ObjectId} id
 * @returns {Promise<Sales>}
 */
const getSalesById = async (id) => {
  return Sales.findById(id);
};

/**
 * Get sales by contract_id
 * @param {string} contractId
 * @returns {Promise<Sales>}
 */
const getSalesByContract = async (contractId) => {
  return Sales.find({ contract_id: contractId });
};

module.exports = {
  querySales,
  getSalesById,
  getSalesByContract,
};
