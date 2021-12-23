const Joi = require('joi');

const JOI_OPTIONS = {
  abortFarly: true,
  allowUnknown: false,
  context: true,
  convert: true,
  presence: 'required',
};

const cleanupJoiError = (error) => error.details.reduce((resultObj, {
  message,
  path,
  type,
}) => {
  const joinedPath = path.join('.') || 'value';
  if (!resultObj[joinedPath]) {
    resultObj[joinedPath] = [];
  }

  resultObj[joinedPath].push({
    type,
    message,
  });

  return resultObj;
}, {});

//Gaat na of de waarden die meegegeven worden voldoen aan de eisen
const validate = (schema) => {
  if (!schema) {
    schema = {
      query: {},
      body: {},
      params: {},
    };
  }

  return (ctx, next) => {
    const errors = {};


    if (!Joi.isSchema(schema.query)) {
      schema.query = Joi.object(schema.query || {});
    }

    const {
      error: queryError,
      value: queryValue,
    } = schema.query.validate(ctx.query, JOI_OPTIONS);

    if (queryError) {
      errors.query = cleanupJoiError(queryError);
    } else {
      ctx.query = queryValue;
    }



    if (!Joi.isSchema(schema.body)) {
      schema.body = Joi.object(schema.body || {});
    }

    const {
      error: bodyError,
      value: bodyValue,
    } = schema.body.validate(ctx.request.body, JOI_OPTIONS);

    if (bodyError) {
      errors.body = cleanupJoiError(bodyError);
    } else {
      ctx.request.body = bodyValue;
    }

    if (!Joi.isSchema(schema.params)) {
      schema.params = Joi.object(schema.params || {});
    }

    const {
      error: paramsError,
      value: paramsValue,
    } = schema.params.validate(ctx.params, JOI_OPTIONS);

    if (paramsError) {
      errors.params = cleanupJoiError(paramsError);
    } else {
      ctx.params = paramsValue;
    }

    if (Object.keys(errors).length > 0) {
      //status, message, code, details
      ctx.throw(400, 'Validation failed, ckeck details fro more information', {
        code: 'VALIDATION_FAILED',
        details: errors,
      });
    }

    return next();
  };
};

module.exports = validate;