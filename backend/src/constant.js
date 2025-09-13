// Simple status enums
const Status = {
  SUCCESS: 'success',
  ERROR: 'error',
  FAILED: 'failed',
};

// Common HTTP status codes
const StatusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

// Common error messages
const ResponseMessages = {
  VALIDATION_ERROR: 'Validation failed',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Access denied',
  NOT_FOUND: 'Resource not found',
  CONFLICT: 'Resource already exists',
  INTERNAL_ERROR: 'Internal server error',
  BAD_REQUEST: 'Invalid request',
  PASSWORD_REQUIRED: 'Password is required',
  USER_ID_REQUIRED: 'User ID is required',
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGIN_FAILED: 'Login failed',
  LOGOUT_SUCCESS: 'Logout successfully',
  LOGOUT_FAILED: 'Logout failed',
  SIGNUP_SUCCESS: 'User registered and logged in successfully',
  SIGNUP_FAILED: 'Signup failed',
  DELETE_SUCCESS: 'Deleted successfully',
  DELETE_FAILED: 'Delete failed',
  TOKENS_REFRESHED: 'Tokens refreshed successfully',
  INVALID_TOKEN: 'Invalid token',
  TOKEN_EXPIRED: 'Session expired',
  AUTHENTICATION_FAILED: 'Authentication failed',
  INVALID_CREDENTIALS: 'Invalid credentials',
  CREDENTIALS_REQUIRED: 'Credentials are required',
  NO_USER_FOUND: 'No User Found, Please Signup First',
  INCORRECT_PASSWORD: 'Incorrect Password',
  UNAUTHORIZED_REQUEST: 'Unauthorized Request',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  DUPLICATE_ENTRY: 'Duplicate entry',
  EMAIL_EXISTS: 'Email already exists',
  USERNAME_TAKEN: 'Username already taken',
  INVALID_DATA_TYPE: 'Invalid data type',
  INVALID_INPUT: 'Invalid input',
  SERVER_ERROR: 'Server error',
  SOMETHING_WENT_WRONG: 'Something went wrong',
  SHORTURL_ID_REQUIRED: 'Short URL ID is required',
  SHORTURL_NOT_FOUND: 'Short URL not found',
  SHORTURL_ALIAS_TAKEN: 'Short URL alias is already taken',
  INVALID_SHORTURL_ALIAS: 'Invalid short URL alias',
  INVALID_SHORTURL_ID: 'Invalid short URL ID',
  SHORTURL_CREATE_SUCCESS: 'Short URL created successfully',
  SHORTURL_UPDATE_SUCCESS: 'Short URL updated successfully',
  SHORTURL_DELETE_SUCCESS: 'Short URL deleted successfully',
  SHORTURL_FETCH_SUCCESS: 'Short URL fetched successfully',
};

module.exports = {
  Status,
  StatusCode,
  ResponseMessages,
};
