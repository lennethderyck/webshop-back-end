const Router = require('@koa/router');
const installPaintingRouter = require('./_paintings');
const installUsersRouter = require('./_users');
const installOrdersRouter = require('./_orders');

/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/api',
  });

  installPaintingRouter(router);
  installUsersRouter(router);
  installOrdersRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};
