const { StatusCode, Status } = require('../constant');
const {
  userRegistrationSchema,
  userLoginSchema,
} = require('../schemas/user.schema');
const tryCatch = require('../utils/tryCatch');
const createError = require('../helper/createError');

const authHandler = tryCatch(async (req, res, next) => {
  console.log('Auth handler called for URL:', req.url);
  if (req.url !== '/signup' && req.url !== '/login') {
    console.log('URL not for auth, passing to next middleware');
    return next();
  }
  if (!req.body || Object.keys(req.body).length === 0) {
    console.log('No credentials provided in request body');
    throw createError({
      message: 'Credentials are required',
      status: Status.FAILED,
      statusCode: StatusCode.BAD_REQUEST,
      errorDetails: null,
    });
  }
  if (req.url === '/signup') {
    console.log('Handling signup request');
    return signUpHandler(req, res, next);
  }
  if (req.url === '/login') {
    console.log('Handling login request');
    return loginHandler(req, res, next);
  }
  next();
});

const signUpHandler = tryCatch(async (req, res, next) => {
  console.log('Validating signup data:', req.body);
  userRegistrationSchema.parse(req.body);
  console.log('Signup validation successful');
  next();
});

const loginHandler = tryCatch(async (req, res, next) => {
  console.log('Validating login data:', req.body);
  userLoginSchema.parse(req.body);
  console.log('Login validation successful');
  next();
});

module.exports = authHandler;
