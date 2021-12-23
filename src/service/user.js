const {
  generateJWT,
  verifyJWT,
} = require('../core/jwt');
const {
  getChildLogger,
} = require('../core/logging');
const {
  hashPassword,
  verifyPassword,
} = require('../core/password');
const userRepository = require('../repository/user');
const Role = require('../core/roles');
const ServiceError = require('../core/serviceError');

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger('user-service');
  this.logger.debug(message, meta);
};

const makeExposedUser = ({
  id,
  name,
  email,
  roles,
}) => ({
  id,
  name,
  email,
  roles,
});

const makeLoginData = async (user) => {
  const token = await generateJWT(user);
  return {
    user: makeExposedUser(user),
    token,
  };
};

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw ServiceError.unauthorized('The given email and password do not match');
  }

  const passwordValid = await verifyPassword(password, user.password_hash);
  if (!passwordValid) {
    throw ServiceError.unauthorized('The given email and password do not match');
  }
  return await makeLoginData(user);
};

const register = async ({
  name,
  email,
  password,
}) => {
  debugLog('Creating a new user', {
    name,
  });
  const passwordHash = await hashPassword(password);
  const user = await userRepository.create({
    name,
    email,
    passwordHash,
    roles: [Role.USER],
  });
  return await makeLoginData(user);
};

const getAll = async (
  limit = 100,
  offset = 0,
) => {
  debugLog('Fetching all users', {
    limit,
    offset,
  });
  const data = await userRepository.findAll({
    limit,
    offset,
  });
  const totalCount = await userRepository.findCount();
  return {
    data: data.map(makeExposedUser),
    count: totalCount,
    limit,
    offset,
  };
};

const getById = async (id) => {
  debugLog(`Fetching user with id ${id}`);
  const user = await userRepository.findById(id);

  if (!user) {
    throw ServiceError.notFound(`No user with id ${id} exists`, {
      id,
    });
  }

  return user;
};

const updateById = async (id, {
  name,
  email,
}) => {
  debugLog(`Updating user with id ${id}`, {
    name,
    email,
  });
  const user = await userRepository.updateById(id, {
    name,
    email,
  });
  return makeExposedUser(user);
};

const deleteById = async (id) => {
  debugLog(`Deleting user with id ${id}`);
  const deleted = await userRepository.deleteById(id);

  if (!deleted) {
    throw ServiceError.notFound(`No user with id ${id} exists`, {
      id,
    });
  }
};

const checkAndParseSession = async (authHeader) => {
  if (!authHeader) {
    throw ServiceError.unauthorized('You need to be signed in');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Invalid authentication token');
  }

  const authToken = authHeader.substr(7);
  try {
    const {
      roles,
      userId,
    } = await verifyJWT(authToken);

    return {
      userId,
      roles,
      authToken,
    };
  } catch (error) {
    const logger = getChildLogger('user-service');
    logger.error(error.message, {
      error,
    });
    throw ServiceError.unauthorized(error.message);
  }
};

const checkRole = (role, roles) => {
  const hasPermission = roles.includes(role);

  if (!hasPermission) {
    throw ServiceError.forbidden('You are not allowed to view this part of the application');
  }
};

module.exports = {
  login,
  register,
  getAll,
  getById,
  updateById,
  deleteById,
  checkAndParseSession,
  checkRole,
};