const config = require('config');
const {
  getChildLogger,
} = require('../core/logging');
const ServiceError = require('../core/serviceError');
const paintingRepository = require('../repository/painting');

const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger('painting-service');
  this.logger.debug(message, meta);
};

/**
 * Get all `limit` paintings, skip the first `offset`.
 */
const getAll = async (
  limit = DEFAULT_PAGINATION_LIMIT,
  offset = DEFAULT_PAGINATION_OFFSET,
) => {
  debugLog('Fetching all paintings', {
    limit,
    offset,
  });
  const data = await paintingRepository.findAll({
    limit,
    offset,
  });
  const count = await paintingRepository.findCount();
  return {
    data,
    count,
    limit,
    offset,
  };
};

/**
 * Find a painting with the given ID.
 */
const getById = async (id) => {
  debugLog(`Fetching painting with id ${id}`);
  const painting = await paintingRepository.findById(id);

  if (!painting) {
    throw ServiceError.notFound(`There is no painting with id ${id}`, {
      id,
    });
  }

  return painting;
};

/**
 * Find a painting with the given type.
 */
const getByType = (type) => {
  debugLog(`Fetching places with type ${type}`);
  return paintingRepository.findByType(type);
};

/**
 * Make a new painting.
 */
const create = ({
  name,
  type,
  price,
  size,
  description,
  img,
}) => {
  const newPainting = {
    name,
    type,
    price,
    size,
    description,
    img,
  };
  debugLog('Creating new place', newPainting);
  return paintingRepository.create(newPainting);
};

/**
 * Update a painting with the given ID.
 */
const updateById = (id, {
  name,
  type,
  price,
  size,
  description,
  img,
}) => {
  const updatedPainting = {
    name,
    type,
    price,
    size,
    description,
    img,
  };
  debugLog(`Updating painting with id ${id}`, updatedPainting);
  return paintingRepository.updateById(id, updatedPainting);
};

/**
 * Delete a painting with the given ID.
 */
const deleteById = async (id) => {
  debugLog(`Deleting place with id ${id}`);
  await paintingRepository.deleteById(id);
};

module.exports = {
  getAll,
  getByType,
  getById,
  create,
  updateById,
  deleteById,
};