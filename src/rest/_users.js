const Router = require('@koa/router');
const userService = require('../service/user');
const Role = require('../core/roles');
const Joi = require('joi');
const validate = require('./_validation');
const {
  requireAuthentication,
  makeRequireRole,
} = require('../core/auth');


//Geeft alle gebruikers terug
const getAllUsers = async (ctx) => {
  const users = await userService.getAll(
    ctx.query.limit && Number(ctx.query.limit),
    ctx.query.offset && Number(ctx.query.offset),
  );
  ctx.body = users;
};
getAllUsers.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};

//Geeft een gebruiker met het meegegeven ID
const getUserById = async (ctx) => {
  const user = await userService.getById(ctx.params.id);
  ctx.body = user;
};
getUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

//Vernieuwd de gegeven van een gebruiker door meegeven van zijn ID
const updateUserById = async (ctx) => {
  const user = await userService.updateById(ctx.params.id, ctx.request.body);
  ctx.body = user;
  console.log(ctx.params.id);
};
updateUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    name: Joi.string().max(255),
    email: Joi.string().email(),
  },
};

//Verwijderd een gebruiker uit de databank
const deleteUserById = async (ctx) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

//Logt een gebruiker in
const login = async (ctx) => {
  const {
    email,
    password,
  } = ctx.request.body;
  const response = await userService.login(email, password);
  ctx.body = response;
};
login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};

//Maakt een nieuwe gebruiker aan
const register = async (ctx) => {
  const response = await userService.register(ctx.request.body);
  ctx.body = response;
};
register.validationScheme = {
  body: {
    name: Joi.string().max(255),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(30),
  },
};

const requireAdmin = makeRequireRole(Role.ADMIN);

/**
 * Install user routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/users',
  });

  router.post('/login', validate(login.validationScheme), login);
  router.post('/register', validate(register.validationScheme), register);

  router.get('/', requireAuthentication, requireAdmin, validate(getAllUsers.validationScheme), getAllUsers);
  router.get('/:id', requireAuthentication, validate(getUserById.validationScheme), getUserById);
  router.put('/:id', requireAuthentication, validate(updateUserById.validationScheme), updateUserById);
  router.delete('/:id', requireAuthentication, requireAdmin, validate(deleteUserById.validationScheme), deleteUserById);

  app
    .use(router.routes())
    .use(router.allowedMethods());
};