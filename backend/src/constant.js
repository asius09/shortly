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
  URL_ID_REQUIRED: 'URL ID is required',
  URL_NOT_FOUND: 'URL not found',
  URL_ALIAS_TAKEN: 'URL alias is already taken',
  INVALID_URL_ALIAS: 'Invalid short URL alias',
  INVALID_URL_ID: 'Invalid short URL ID',
  URL_CREATE_SUCCESS: 'URL created successfully',
  URL_CREATE_FAILED: 'Failed to create short URL',
  URL_UPDATE_SUCCESS: 'URL updated successfully',
  URL_UPDATE_FAILED: 'Failed to update short URL',
  URL_DELETE_SUCCESS: 'URL deleted successfully',
  URL_DELETE_FAILED: 'Failed to delete short URL',
  URL_FETCH_SUCCESS: 'URL fetched successfully',
  URL_FETCH_FAILED: 'Failed to fetch short URL',
};

module.exports = {
  Status,
  StatusCode,
  ResponseMessages,
};
