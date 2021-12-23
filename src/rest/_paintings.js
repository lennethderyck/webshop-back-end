const Joi = require('joi');
const Router = require('@koa/router');
const paintingService = require('../service/painting');
const {
  requireAuthentication,
  makeRequireRole,
} = require('../core/auth');
const Role = require('../core/roles');
const validate = require('./_validation');

//Geeft alle schilderijen
const getAllPaintings = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await paintingService.getAll(limit, offset);
};

getAllPaintings.validationScheme = {
  query: Joi.object({
    limit: Joi.number().positive().integer().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};

//Maakt een schilderij item aan
const createPainting = async (ctx) => {
  const newPainting = await paintingService.create(ctx.request.body);
  ctx.body = newPainting;
  ctx.status = 201;
};
createPainting.validationScheme = {
  body: {
    name: Joi.string().max(255),
    type: Joi.string(),
    price: Joi.number().invalid(0),
    size: Joi.string(),
    description: Joi.string(),
    img: Joi.string(),
  },
};

//Geeft het schilderij met het meegegeven ID
const getPaintingById = async (ctx) => {
  ctx.body = await paintingService.getById(ctx.params.id);
};
getPaintingById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

//Vernieuwd de waarden van een al bestaand schilderij door meegegeven ID
const updatePainting = async (ctx) => {
  ctx.body = await paintingService.updateById(ctx.params.id, ctx.request.body);
};
updatePainting.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    name: Joi.string().max(255),
    type: Joi.string(),
    price: Joi.number().invalid(0),
    size: Joi.string(),
    description: Joi.string(),
    img: Joi.string(),
  },
};

//Verwijderd een schilderij
const deletePainting = async (ctx) => {
  await paintingService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deletePainting.validationScheme = {
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
    prefix: '/paintings',
  });

  router.get('/', validate(getAllPaintings.validationScheme), getAllPaintings);
  router.get('/:id', validate(getPaintingById.validationScheme), getPaintingById);
  router.post('/', requireAuthentication, requireAdmin, validate(createPainting.validationScheme), createPainting);
  router.put('/:id', requireAuthentication, requireAdmin, validate(updatePainting.validationScheme), updatePainting);
  router.delete('/:id', requireAuthentication, requireAdmin, validate(deletePainting.validationScheme), deletePainting);

  app.use(router.routes()).use(router.allowedMethods());
};