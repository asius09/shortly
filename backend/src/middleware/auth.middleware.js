const { Status, StatusCode, ResponseMessages } = require('../constant');
const createError = require('../helper/createError');
const { handleJwtTokens, verifyToken } = require('../utils/jwtToken');
const responseHandler = require('../utils/responseHandler');
const { validateUserById } = require('../helper/validateUser');
const tryCatch = require('../utils/tryCatch');

/**
 * Main authentication middleware
 */
const authMiddleware = tryCatch(async (req, res, next) => {
  const { accessToken: authToken, refreshToken } = req.cookies || {};

  if (!authToken || !refreshToken) {
    return next(
      createError({
        message: ResponseMessages.UNAUTHORIZED,
        status: Status.ERROR,
        statusCode: StatusCode.FORBIDDEN,
      }),
    );
  }

  let decode;
  let user;
  let userId;

  // Try to verify access token
  try {
    decode = await verifyToken(authToken);
    userId = decode.id;
  } catch (err) {
    // If token expired, try to refresh
    if (err.message === 'Token has expired') {
      // Try to verify refresh token
      let refreshDecode;
      try {
        refreshDecode = await verifyToken(refreshToken);
      } catch (refreshErr) {
        if (refreshErr.message === 'Token has expired') {
          return next(
            createError({
              message: ResponseMessages.TOKEN_EXPIRED,
              status: Status.ERROR,
              statusCode: StatusCode.UNAUTHORIZED,
            }),
          );
        }
        return next(
          createError({
            message: ResponseMessages.INVALID_REFRESH_TOKEN,
            status: Status.ERROR,
            statusCode: StatusCode.UNAUTHORIZED,
          }),
        );
      }
      // If refresh token valid, get user and generate new tokens
      user = await validateUserById(refreshDecode.id, next);
      if (!user) return; // validateUserById will call next(err) if not found

      // Generate new tokens
      const { token, newRefreshToken } = await handleJwtTokens(user);

      return responseHandler(
        {
          message: ResponseMessages.TOKENS_REFRESHED,
          token,
          refreshToken: newRefreshToken,
          data: user,
        },
        res,
      );
    } else {
      return next(
        createError({
          message: ResponseMessages.INVALID_TOKEN,
          status: Status.ERROR,
          statusCode: StatusCode.UNAUTHORIZED,
        }),
      );
    }
  }

  // If access token is valid, get user from DB
  user = await validateUserById(userId, next);
  if (!user) return; // validateUserById will call next(err) if not found

  // Check refresh token is valid and matches user
  let refreshDecode;
  try {
    refreshDecode = await verifyToken(refreshToken);
  } catch (err) {
    if (err.message === 'Token has expired') {
      return next(
        createError({
          message: ResponseMessages.TOKEN_EXPIRED,
          status: Status.ERROR,
          statusCode: StatusCode.UNAUTHORIZED,
        }),
      );
    }
    return next(
      createError({
        message: ResponseMessages.INVALID_REFRESH_TOKEN,
        status: Status.ERROR,
        statusCode: StatusCode.UNAUTHORIZED,
      }),
    );
  }
  if (refreshDecode.id !== userId) {
    return next(
      createError({
        message: ResponseMessages.UNAUTHORIZED_REQUEST,
        status: Status.ERROR,
        statusCode: StatusCode.UNAUTHORIZED,
      }),
    );
  }

  // Set req.user for downstream
  req.user = user;

  // Route-specific userId checks
  // For /logout/:userId and /delete/:userId, compare decoded id with req.params.userId
  if (req.url.startsWith('/logout') || req.url.startsWith('/delete')) {
    const paramUserId = req.params.userId;
    if (!paramUserId) {
      return next(
        createError({
          message: ResponseMessages.USER_ID_REQUIRED,
          status: Status.ERROR,
          statusCode: StatusCode.BAD_REQUEST,
        }),
      );
    }
    if (paramUserId !== userId) {
      return next(
        createError({
          message: ResponseMessages.UNAUTHORIZED_REQUEST,
          status: Status.ERROR,
          statusCode: StatusCode.UNAUTHORIZED,
        }),
      );
    }
  }
  // For /api/url?user=... or similar, compare decoded id with req.query.user
  else if (req.query && req.query.user) {
    if (req.query.user !== userId) {
      return next(
        createError({
          message: ResponseMessages.UNAUTHORIZED_REQUEST,
          status: Status.ERROR,
          statusCode: StatusCode.UNAUTHORIZED,
        }),
      );
    }
  }
  // For /user/me and other routes, just pass if token is verified and user is set

  return next();
});

module.exports = authMiddleware;
