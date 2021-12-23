const uuid = require('uuid');
const {
  tables,
  getKnex,
} = require('../data/index');
const {
  getChildLogger,
} = require('../core/logging');

/**
 * Get all `limit` paintings, skip the first `offset`.
 */
const findAll = ({
  limit,
  offset,
}) => {
  return getKnex()(tables.painting)
    .select()
    .limit(limit)
    .offset(offset);
};

/**
 * Find a painting with the given type.
 */
const findByType = (type) => {
  return getKnex()(tables.painting)
    .where('type', type)
    .first();
};

/**
 * Find a painting with the given ID.
 */
const findById = (id) => {
  return getKnex()(tables.painting)
    .where('id', id)
    .first();
};

/**
 * Calculate the total number of paintings.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.painting)
    .count();
  return count['count(*)'];
};

/**
 * Create a new painting.
 */
const create = async ({
  name,
  type,
  price,
  size,
  description,
  img,
}) => {
  try {
    const id = uuid.v4();
    await getKnex()(tables.painting)
      .insert({
        id,
        name,
        type,
        price,
        size,
        description,
        img,
      });

    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('places-repo');
    logger.error('Error in create', {
      error,
    });
    throw error;
  }
};

/**
 * Update a painting with the given `id`.
 */
const updateById = async (id, {
  name,
  type,
  price,
  size,
  description,
  img,
}) => {
  try {
    await getKnex()(tables.painting)
      .update({
        name,
        type,
        price,
        size,
        description,
        img,
      })
      .where('id', id);

    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('places-repo');
    logger.error('Error in updateById', {
      error,
    });
    throw error;
  }
};

/**
 * Delete a painting with the given `id`.
 */
const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.painting)
      .delete()
      .where('id', id);

    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('painting-repo');
    logger.error('Error in deleteById', {
      error,
    });
    throw error;
  }
};

module.exports = {
  findAll,
  findByType,
  findCount,
  findById,
  create,
  updateById,
  deleteById,
};