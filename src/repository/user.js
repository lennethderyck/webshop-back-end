const uuid = require('uuid');
const {
  tables,
  getKnex,
} = require('../data');
const {
  getChildLogger,
} = require('../core/logging');

/**
 * Get all `limit` users, skip the first `offset`.
 */
const findAll = ({
  limit,
  offset,
}) => {
  return getKnex()(tables.user)
    .select()
    .limit(limit)
    .offset(offset)
    .orderBy('name', 'ASC');
};

/**
 * Calculate the total number of user.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.user)
    .count();
  return count['count(*)'];
};

/**
 * Find a user with the given id.
 */
const findById = (id) => {
  return getKnex()(tables.user)
    .where('id', id)
    .first();
};

const findByEmail = (email) => {
  return getKnex()(tables.user)
    .where('email', email)
    .first();
};

/**
 * Create a new user with the given `name`.
 */
const create = async ({
  name,
  email,
  passwordHash,
  roles,
}) => {
  try {
    const id = uuid.v4();
    await getKnex()(tables.user)
      .insert({
        id,
        name,
        email,
        password_hash: passwordHash,
        roles: JSON.stringify(roles),
      });
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('users-repo');
    logger.error('Error in create', {
      error,
    });
    throw error;
  }
};

/**
 * Update a user with the given `id`.
 */
const updateById = async (id, {
  name,
}) => {
  console.log(name);
  try {
    await getKnex()(tables.user)
      .update({
        name,
      })
      .where('id', id);
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('users-repo');
    logger.error('Error in updateById', {
      error,
    });
    throw error;
  }
};

/**
 * Delete a user with the given `id`.
 */
const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.user)
      .delete()
      .where('id', id);
    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('users-repo');
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
  findByEmail,
  create,
  updateById,
  deleteById,
};