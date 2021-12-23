const uuid = require('uuid');
const {
  tables,
  getKnex,
} = require('../data/index');
const {
  getChildLogger,
} = require('../core/logging');

const SELECT_COLUMNS = [
  `${tables.order}.id`, 'total', 'date', 'paintings',
  `${tables.user}.id as user_id`, `${tables.user}.name as user_name`,
];
const SELECT_COLUMNS_ORDERS = [
  `${tables.user}.id as user_id`, `${tables.user}.name as user_name`, 'total', 'date', 'paintings',
  `${tables.order}.id`,
];

/**
 * Format the order
 */
const formatOrder = ({
  user_id,
  user_name,
  ...rest
}) => ({
  user: {
    id: user_id,
    name: user_name,
  },
  ...rest,
});

/**
 * Get all `limit` orders, skip the first `offset`.
 */
const findAll = async ({
  limit,
  offset,
}) => {
  const orders = await getKnex()(tables.order)
    .select(SELECT_COLUMNS)
    .join(tables.user, `${tables.order}.user_id`, '=', `${tables.user}.id`)
    .limit(limit)
    .offset(offset)
    .orderBy('date', 'ASC');

  return orders.map(formatOrder);
};

/**
 * Calculate the total number of paintings.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.order)
    .count();

  return count['count(*)'];
};

/**
 * Find an order with the given ID.
 */
const findById = async (id) => {
  const order = await getKnex()(tables.order)
    .first(SELECT_COLUMNS)
    .where(`${tables.order}.id`, id)
    .join(tables.user, `${tables.order}.user_id`, '=', `${tables.user}.id`);

  return order && formatOrder(order);
};

/**
 * Find orders from a user by giving his ID
 */
const getMyOrders = async (userId) => {
  const orders = await getKnex()(tables.order)
    .select(SELECT_COLUMNS_ORDERS)
    .where(`${tables.user}.id`, userId)
    .join(tables.user, `${tables.order}.user_id`, '=', `${tables.user}.id`)
    .orderBy('date', 'ASC');

  return orders.map(formatOrder);
};

/**
 * Make a new order
 */
const create = async ({
  total,
  date,
  paintings,
  user_id,
}) => {
  try {
    const id = uuid.v4();
    await getKnex()(tables.order)
      .insert({
        id,
        total,
        date,
        paintings: JSON.stringify(paintings),
        user_id,
      });
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('order-repo');
    logger.error('Error in create', {
      error,
    });
    throw error;
  }
};

/**
 * Remove an order with the given ID.
 */
const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.order)
      .delete()
      .where(`${tables.order}.id`, id);
    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('order-repo');
    logger.error('Error in deleteById', {
      error,
    });
    throw error;
  }
};

module.exports = {
  findAll,
  findCount,
  findById,
  create,
  deleteById,
  getMyOrders,
};