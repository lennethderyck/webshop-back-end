const config = require('config');
const {
  getChildLogger,
} = require('../core/logging');
const orderRepository = require('../repository/order');
const ServiceError = require('../core/serviceError');

const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger('order-service');
  this.logger.debug(message, meta);
};

/**
 * Get all `limit` orders, skip the first `offset` and get the count.
 */
const getAll = async (
  limit = DEFAULT_PAGINATION_LIMIT,
  offset = DEFAULT_PAGINATION_OFFSET,
) => {
  debugLog('Fetching all orders', {
    limit,
    offset,
  });
  const data = await orderRepository.findAll({
    limit,
    offset,
  });
  const count = await orderRepository.findCount();
  return {
    data,
    count,
    limit,
    offset,
  };
};

/**
 * Find an order with the given ID.
 */
const getById = async (id) => {
  debugLog(`Fetching order with id ${id}`);
  const order = await orderRepository.findById(id);

  if (!order) {
    throw ServiceError.notFound(`There is no transaction with id ${id}`, {
      id,
    });
  }

  return order;
};

/**
 * Find orders from a user by giving his ID
 */
const getMyOrders = async (id) => {
  debugLog(`Fetching order with id ${id}`);
  const order = await orderRepository.getMyOrders(id);
  const count = order.length;

  if (!order) {
    throw ServiceError.notFound(`There is no transaction with id ${id}`, {
      id,
    });
  }

  return {
    order,
    count,
  };
};

/**
 * Make a new order
 */
const create = async ({
  paintings,
  total,
  user_id,
  date,
}) => {
  debugLog('Creating new order', {
    total,
    date,
    paintings,
    user_id,
  });

  return orderRepository.create({
    total,
    date,
    paintings: paintings,
    user_id,
  });
};

/**
 * Remove an order with the given ID.
 */
const deleteById = async (id) => {
  debugLog(`Deleting order with id ${id}`);
  await orderRepository.deleteById(id);
};

module.exports = {
  getAll,
  getById,
  create,
  deleteById,
  getMyOrders,
};