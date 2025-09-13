const { ResponseMessages, Status, StatusCode } = require('../constant');
const createError = require('../helper/createError');
const tryCatch = require('../utils/tryCatch');
const { validateUserById } = require('../helper/validateUser');
const urlSchema = require('../schemas/url.schema');

const validateUrlRequest = tryCatch(async (req, res, next) => {
  console.log(
    `[VALIDATE URL REQUEST] - validateUrlRequest : starting validations of URL requests`,
  );
  const method = req.method;
  console.log(
    `[VALIDATE URL REQUEST] - validateUrlRequest : Validate Request Method: ${method}`,
  );
  const query = req.query;
  console.log(`[VALIDATE URL REQUEST] - validateUrlRequest : Query:`, query);
  console.log(
    `[VALIDATE URL REQUEST] - validateUrlRequest : Query User: ${query.user}`,
  );

  const user = await validateUserById(query.user, next);

  console.log(
    `[VALIDATE URL REQUEST] - validateUrlRequest : User Found:`,
    user,
  );
  req.user = user;

  if (method === 'GET') {
    console.log(`[VALIDATE URL REQUEST] - GET method detected`);
    if (query.id) {
      console.log(`[VALIDATE URL REQUEST] - GET with id: ${query.id}`);
      req.urlId = query.id;
    } else {
      console.log(`[VALIDATE URL REQUEST] - GET all URLs for user`);
    }
    return next();
  }

  if (method === 'DELETE') {
    console.log(`[VALIDATE URL REQUEST] - DELETE method detected`);
    if (!query.id) {
      console.error(`[validateUrlRequest] DELETE missing id`);
      return next(
        createError({
          message: ResponseMessages.URL_ID_REQUIRED,
          status: Status.ERROR,
          statusCode: StatusCode.BAD_REQUEST,
        }),
      );
    }
    console.log(`[VALIDATE URL REQUEST] - DELETE with id: ${query.id}`);
    req.urlId = query.id;
    return next();
  }

  if (method === 'POST' || method === 'PUT') {
    console.log(`[validateUrlRequest] ${method} method detected`);
    console.log(`[validateUrlRequest] ${method} body:`, req.body);
    return await validateUrlRequestBody(req, res, next);
  }

  console.error(`[validateUrlRequest] Unsupported method: ${method}`);
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
  console.log(`[validateUrlRequestBody] Validating body:`, req.body);
  const result = await urlSchema.safeParseAsync(req.body);
  console.log(`[validateUrlRequestBody] Validation result:`, result);
  console.log(`[validateUrlRequestBody] Validation success: ${result.success}`);
  if (!result.success) {
    console.error('[validateUrlRequestBody] Validation failed:', result.error);
    // Ensure the error is properly identified as a ZodError for downstream handling
    if (!result.error.name || result.error.name !== 'ZodError') {
      result.error.name = 'ZodError';
    }
    throw result.error;
  }
  console.log(
    '[validateUrlRequestBody] Validation passed, proceeding to next middleware',
  );
  next();
});

module.exports = validateUrlRequest;

/**
 * Route Handling:
 *
 * GET All    - /URL?userId=                  (validates user)
 * GET One    - /URL?userId=&id=              (validates user and url)
 * DELETE One - /URL?userId=&id=              (validates user and url, id required)
 * POST Create- /URL?userId=   {body:}        (validates user and body)
 * PUT Update - /URL?userId=   {body:}        (validates user and body)
 */
