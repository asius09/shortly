const { Status, StatusCode, ResponseMessages } = require('../constant');
const createError = require('../helper/createError');
const { handleJwtTokens, verifyToken } = require('../utils/jwtToken');
const responseHandler = require('../utils/responseHandler');
const User = require('../models/user.model');
const tryCatch = require('../utils/tryCatch');

const refreshTokenValidation = tryCatch(async (refreshToken, user, res) => {
  console.log(
    '[AUTH MIDDLEWARE] - refreshTokenValidation: Starting refresh token validation',
  );
  console.log('[AUTH MIDDLEWARE] - refreshTokenValidation: User ID:', user._id);

  const refreshDecode = await verifyToken(refreshToken);
  console.log(
    '[AUTH MIDDLEWARE] - refreshTokenValidation: Refresh token decoded successfully',
  );

  if (refreshDecode.id !== user._id) {
    console.log(
      '[AUTH MIDDLEWARE] - refreshTokenValidation: Invalid refresh token - ID mismatch',
    );
    throw createError({
      message: ResponseMessages.INVALID_REFRESH_TOKEN,
      status: Status.ERROR,
      statusCode: StatusCode.UNAUTHORIZED,
      errorDetails: null,
    });
  }

  console.log(
    '[AUTH MIDDLEWARE] - refreshTokenValidation: Refresh token valid, generating new tokens',
  );
  // Generate new auth token
  const { token, newRefreshToken } = await handleJwtTokens(user);
  console.log(
    '[AUTH MIDDLEWARE] - refreshTokenValidation: New tokens generated successfully',
  );

  return responseHandler(
    {
      message: ResponseMessages.TOKENS_REFRESHED,
      token,
      newRefreshToken,
    },
    res,
  );
});

const tokenValidation = async (authToken, refreshToken, user, res) => {
  console.log('[AUTH MIDDLEWARE] - tokenValidation: Starting token validation');
  console.log('[AUTH MIDDLEWARE] - tokenValidation: User ID:', user._id);

  try {
    const decode = await verifyToken(authToken);
    console.log(
      '[AUTH MIDDLEWARE] - tokenValidation: Auth token decoded successfully',
    );

    if (decode.id !== user._id.toString()) {
      console.log(
        '[AUTH MIDDLEWARE] - tokenValidation: Unauthorized request - ID mismatch',
      );
      throw createError({
        message: ResponseMessages.UNAUTHORIZED_REQUEST,
        status: Status.ERROR,
        statusCode: StatusCode.UNAUTHORIZED,
        errorDetails: null,
      });
    }
    console.log(
      '[AUTH MIDDLEWARE] - tokenValidation: Token validation successful',
    );
  } catch (error) {
    console.log(
      '[AUTH MIDDLEWARE] - tokenValidation: Token validation failed:',
      error.message,
    );

    if (error.message === 'Token has expired') {
      console.log(
        '[AUTH MIDDLEWARE] - tokenValidation: Token expired, attempting refresh token validation',
      );
      return await refreshTokenValidation(refreshToken, user, res);
    }
    console.log(
      '[AUTH MIDDLEWARE] - tokenValidation: Token validation error, throwing error',
    );
    throw createError({
      message:
        error.message === 'Token has expired'
          ? ResponseMessages.TOKEN_EXPIRED
          : ResponseMessages.INVALID_TOKEN,
      status: Status.ERROR,
      statusCode: StatusCode.UNAUTHORIZED,
      errorDetails: null,
    });
  }
};

const authMiddleware = async (req, res, next) => {
  console.log(
    '[AUTH MIDDLEWARE] - authMiddleware: Starting authentication process',
  );
  console.log(
    '[AUTH MIDDLEWARE] - authMiddleware: Request params:',
    req.params,
  );
  console.log('[AUTH MIDDLEWARE] - authMiddleware: Request body:', req.body);
  console.log('[AUTH MIDDLEWARE] - authMiddleware: Request query:', req.query);

  // Extract user ID based on route
  let userId;
  if (req.url.startsWith('/logout') || req.url.startsWith('/delete')) {
    console.log(
      '[AUTH MIDDLEWARE] - authMiddleware: Logout route detected, extracting user ID from params',
    );
    // For logout route, get from URL parameters
    userId = req.params.userId;
  } else {
    console.log(
      '[AUTH MIDDLEWARE] - authMiddleware: Other route detected, extracting user ID from body or query',
    );
    // For other routes, get from body or query
    userId = req.query.user;
  }

  console.log('[AUTH MIDDLEWARE] - authMiddleware: User ID extracted:', userId);

  if (!userId) {
    console.log(
      '[AUTH MIDDLEWARE] - authMiddleware: No user ID found in URL parameters',
    );
    throw createError({
      message: ResponseMessages.USER_ID_REQUIRED,
      status: Status.FAILED,
      statusCode: StatusCode.BAD_REQUEST,
      errorDetails: null,
    });
  }

  console.log(
    '[AUTH MIDDLEWARE] - authMiddleware: Searching for user with ID:',
    userId,
  );
  const user = await User.findById(userId);

  if (!user) {
    console.log(
      '[AUTH MIDDLEWARE] - authMiddleware: User not found with ID:',
      userId,
    );
    throw createError({
      message: ResponseMessages.NO_USER_FOUND,
      status: Status.ERROR,
      statusCode: StatusCode.NOT_FOUND,
      errorDetails: null,
    });
  }

  console.log(
    '[AUTH MIDDLEWARE] - authMiddleware: User found successfully:',
    user._id,
  );

  const { accessToken: authToken, refreshToken } = req.cookies;

  console.log(
    '[AUTH MIDDLEWARE] - authMiddleware: Extracted tokens from cookies',
  );
  console.log(
    `[AUTH MIDDLEWARE] - authMiddleware: Auth token present: ${!!authToken}`,
  );
  console.log(
    `[AUTH MIDDLEWARE] - authMiddleware: Refresh token present: ${!!refreshToken}`,
  );

  if (!authToken || !refreshToken) {
    console.log('[AUTH MIDDLEWARE] - authMiddleware: Missing required tokens');
    throw createError({
      message: ResponseMessages.UNAUTHORIZED,
      status: Status.ERROR,
      statusCode: StatusCode.FORBIDDEN,
      errorDetails: null,
    });
  }

  console.log(
    '[AUTH MIDDLEWARE] - authMiddleware: Proceeding with token validation',
  );
  await tokenValidation(authToken, refreshToken, user, res);

  console.log(
    '[AUTH MIDDLEWARE] - authMiddleware: Authentication successful, proceeding to next middleware',
  );
  next();
};

module.exports = authMiddleware;
