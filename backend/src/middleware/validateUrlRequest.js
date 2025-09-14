const { ResponseMessages, Status, StatusCode } = require('../constant');
const createError = require('../helper/createError');
const tryCatch = require('../utils/tryCatch');
const { validateUserById } = require('../helper/validateUser');
const urlSchema = require('../schemas/url.schema');

const validateUrlRequest = tryCatch(async (req, res, next) => {
  const method = req.method;
  const query = req.query;

  const user = await validateUserById(query.user, next);

  req.user = user;

  if (method === 'GET') {
    if (query.id) {
      req.urlId = query.id;
    } else {
      // GET all URLs for user
    }
    return next();
  }

  if (method === 'DELETE') {
    if (!query.id) {
      return next(
        createError({
          message: ResponseMessages.URL_ID_REQUIRED,
          status: Status.ERROR,
          statusCode: StatusCode.BAD_REQUEST,
        }),
      );
    }
    req.urlId = query.id;
    return next();
  }

  if (method === 'POST' || method === 'PUT') {
    return await validateUrlRequestBody(req, res, next);
  }

  return next(
    createError({
      message: ResponseMessages.BAD_REQUEST,
      status: Status.ERROR,
      statusCode: StatusCode.BAD_REQUEST,
    }),
  );
});

// eslint-disable-next-line no-unused-vars
const validateUrlRequestBody = tryCatch(async (req, res, next) => {
  const result = await urlSchema.safeParseAsync(req.body);
  if (!result.success) {
    // Ensure the error is properly identified as a ZodError for downstream handling
    if (!result.error.name || result.error.name !== 'ZodError') {
      result.error.name = 'ZodError';
    }
    throw result.error;
  }
  next();
});

module.exports = validateUrlRequest;
