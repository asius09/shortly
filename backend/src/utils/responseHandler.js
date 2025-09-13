const config = require('../config/config');
const { Status, StatusCode } = require('../constant');

const responseHandler = (
  {
    data = undefined,
    message = undefined,
    status = Status.SUCCESS,
    statusCode = StatusCode.OK,
    error = null,
    token = undefined,
    refreshToken = undefined,
    clearCookies = false,
  },
  res,
) => {
  // Clear cookies if requested
  if (clearCookies) {
    res.clearCookie(config.ACCESS_TOKEN);
    res.clearCookie(config.REFRESH_TOKEN);
  }

  // Set cookies if tokens are provided
  if (token) {
    res.cookie(config.ACCESS_TOKEN, token, {
      httpOnly: true,
      secure: config.environment === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours (1 day)
    });
  }

  if (refreshToken) {
    res.cookie(config.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: config.environment === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  const responsePayload = {
    statusCode,
    data,
    message,
    status,
    error,
  };

  return res.status(statusCode).json(responsePayload);
};

module.exports = responseHandler;
