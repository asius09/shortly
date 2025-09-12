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
const ErrorMessages = {
  VALIDATION_ERROR: 'Validation failed',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Access denied',
  NOT_FOUND: 'Resource not found',
  CONFLICT: 'Resource already exists',
  INTERNAL_ERROR: 'Internal server error',
  BAD_REQUEST: 'Invalid request',
};

module.exports = {
  Status,
  StatusCode,
  ErrorMessages,
};
