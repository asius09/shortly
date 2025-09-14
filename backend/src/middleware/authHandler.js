const { StatusCode, Status } = require('../constant');
const {
  userRegistrationSchema,
  userLoginSchema,
} = require('../schemas/user.schema');
const tryCatch = require('../utils/tryCatch');
const createError = require('../helper/createError');

const authHandler = tryCatch(async (req, res, next) => {
  if (req.url !== '/signup' && req.url !== '/login') {
    return next();
  }
  if (!req.body || Object.keys(req.body).length === 0) {
    throw createError({
      message: 'Credentials are required',
      status: Status.FAILED,
      statusCode: StatusCode.BAD_REQUEST,
      errorDetails: null,
    });
  }
  if (req.url === '/signup') {
    return signUpHandler(req, res, next);
  }
  if (req.url === '/login') {
    return loginHandler(req, res, next);
  }
  next();
});

const signUpHandler = tryCatch(async (req, res, next) => {
  userRegistrationSchema.parse(req.body);
  next();
});

const loginHandler = tryCatch(async (req, res, next) => {
  userLoginSchema.parse(req.body);
  next();
});

module.exports = authHandler;
