const Router = require('@koa/router');
const Joi = require('joi');
const orderService = require('../service/order');
const Role = require('../core/roles');
const {
  requireAuthentication,
  makeRequireRole,
} = require('../core/auth');
const validate = require('./_validation');

/**
 * Get all `limit` orders, skip the first `offset` and get the count.
 */
const getAllOrders = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await orderService.getAll(limit, offset);
};
getAllOrders.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};

/**
 * Find orders from a user by giving his ID
 */
const getMyOrders = async (ctx) => {
  ctx.body = await orderService.getMyOrders(ctx.params.id);
};
getMyOrders.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

/**
 * Make a new order
 */
const createOrder = async (ctx) => {
  const newOrder = await orderService.create({
    ...ctx.request.body,
    date: new Date(ctx.request.body.date),
  });
  ctx.body = newOrder;
  ctx.status = 201;
};
createOrder.validationScheme = {
  body: {
    total: Joi.number().invalid(0),
    paintings: Joi.array(),
    user_id: Joi.string().uuid(),
    date: Joi.date().iso().less('now'),
  },
};

/**
 * Find an order with the given ID.
 */
const getOrderById = async (ctx) => {
  ctx.body = await orderService.getById(ctx.params.id);
};
getOrderById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};


/**
 * Remove an order with the given ID.
 */
const deleteOrder = async (ctx) => {
  await orderService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteOrder.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const requireAdmin = makeRequireRole(Role.ADMIN);

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/orders',
  });

  router.get('/', requireAuthentication, requireAdmin, validate(getAllOrders.validationScheme), getAllOrders);
  router.get('/mine/:id', requireAuthentication, validate(getMyOrders.validationScheme), getMyOrders);
  router.get('/:id', validate(getOrderById.validationScheme), getOrderById);
  router.post('/', requireAuthentication, validate(createOrder.validationScheme), createOrder);
  router.delete('/:id', requireAuthentication, requireAdmin, validate(deleteOrder.validationScheme), deleteOrder);

  app.use(router.routes()).use(router.allowedMethods());
};