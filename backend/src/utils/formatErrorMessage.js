const { ErrorMessages, Status, StatusCode } = require('../constant');
const { z } = require('zod');

// Main function that orchestrates all error formatting
const formatErrorMessage = (error) => {
  console.error('[FORMAT_ERROR] - Raw error received:', error);
  console.error('[FORMAT_ERROR] - Error type:', typeof error);
  console.error(
    '[FORMAT_ERROR] - Error constructor:',
    error?.constructor?.name,
  );

  // Check error type and parse accordingly
  const errorType = getErrorType(error);
  console.log('[FORMAT_ERROR] - Detected error type:', errorType);

  // Format based on error type
  switch (errorType) {
    case 'primitive':
      return formatPrimitiveError(error);

    case 'validation':
      return formatValidationError(error);

    case 'cast':
      return formatCastError(error);

    case 'mongo':
      return formatMongoError(error);

    case 'mongoServer':
      return formatMongoServerError(error);

    case 'jwt':
      return formatJWTError(error);

    case 'zod':
      return formatZodError(error);

    case 'custom':
      return formatCustomError(error);

    case 'generic':
      return formatGenericError(error);

    default:
      return formatFallbackError();
  }
};

module.exports = formatErrorMessage;

// Helper function to determine error type
const getErrorType = (error) => {
  // Check for primitive types first
  if (isPrimitiveError(error)) {
    return 'primitive';
  }

  // Check for Error instances
  if (error instanceof Error) {
    switch (error.name) {
      case 'ValidationError':
        return 'validation';
      case 'CastError':
        return 'cast';
      case 'MongoError':
        return 'mongo';
      case 'MongoServerError':
        return 'mongoServer';
      case 'JsonWebTokenError':
      case 'TokenExpiredError':
        return 'jwt';
      case 'ZodError':
        return 'zod';
      default:
        return 'generic';
    }
  }

  // Check for Zod errors
  if (error instanceof z.ZodError) {
    return 'zod';
  }

  // Check for custom error objects
  if (typeof error === 'object' && error !== null) {
    return 'custom';
  }

  return 'unknown';
};

// Helper function to check if error is primitive
const isPrimitiveError = (error) => {
  return (
    typeof error === 'string' ||
    typeof error === 'number' ||
    typeof error === 'boolean' ||
    error === null ||
    error === undefined
  );
};

// Generic error formatter
const formatGenericError = (error) => {
  const message = error.message || ErrorMessages.SOMETHING_WENT_WRONG;
  return {
    data: null,
    message,
    status: Status.ERROR,
    statusCode: StatusCode.INTERNAL_ERROR,
    error: [message],
  };
};

// Fallback error formatter
const formatFallbackError = () => {
  return {
    data: null,
    message: ErrorMessages.SOMETHING_WENT_WRONG,
    status: Status.ERROR,
    statusCode: StatusCode.INTERNAL_ERROR,
    error: ErrorMessages.SOMETHING_WENT_WRONG,
  };
};

// Handle MongoDB server errors
function formatMongoServerError(error) {
  console.log('[MONGO_SERVER_ERROR] - Processing error:', error);
  console.log('[MONGO_SERVER_ERROR] - Error code:', error.code);
  console.log('[MONGO_SERVER_ERROR] - Error statusCode:', error.statusCode);

  let message = '';
  let status = Status.ERROR;
  let statusCode = StatusCode.INTERNAL_ERROR;
  let errorDetails = [];

  if (error.code === 11000 || error.statusCode === 11000) {
    console.log('[MONGO_SERVER_ERROR] - Duplicate key error detected');
    statusCode = StatusCode.BAD_REQUEST;
    status = Status.FAILED;
    message = ErrorMessages.DUPLICATE_ENTRY;
    const errorMessage = error.message || '';

    if (errorMessage.includes('email')) {
      errorDetails = [ErrorMessages.EMAIL_ALREADY_EXISTS];
      message = ErrorMessages.EMAIL_ALREADY_EXISTS;
    } else if (errorMessage.includes('username')) {
      errorDetails = [ErrorMessages.USERNAME_ALREADY_TAKEN];
      message = ErrorMessages.USERNAME_ALREADY_TAKEN;
    } else {
      errorDetails = [ErrorMessages.DUPLICATE_ENTRY];
    }

    console.log(
      '[MONGO_SERVER_ERROR] - Duplicate error details:',
      errorDetails,
    );
  } else if (error.code === 11001 || error.statusCode === 11001) {
    console.log('[MONGO_SERVER_ERROR] - Duplicate data error detected');
    statusCode = StatusCode.BAD_REQUEST;
    status = Status.FAILED;
    message = ErrorMessages.DUPLICATE_ENTRY;
    errorDetails = [ErrorMessages.DUPLICATE_ENTRY];
  } else if (error.code === 121 || error.statusCode === 121) {
    console.log('[MONGO_SERVER_ERROR] - Document validation error detected');
    statusCode = StatusCode.BAD_REQUEST;
    status = Status.FAILED;
    message = ErrorMessages.INVALID_INPUT;
    errorDetails = [ErrorMessages.INVALID_INPUT];
  } else {
    console.log('[MONGO_SERVER_ERROR] - Unknown MongoDB error, using default');
    statusCode = StatusCode.INTERNAL_ERROR;
    status = Status.ERROR;
    message = ErrorMessages.SOMETHING_WENT_WRONG;
    errorDetails = [ErrorMessages.SOMETHING_WENT_WRONG];
  }

  const result = {
    data: null,
    message,
    status,
    statusCode,
    error: errorDetails,
  };

  console.log('[MONGO_SERVER_ERROR] - Final result:', result);
  return result;
}

// Handle MongoDB errors
function formatMongoError(error) {
  console.log('[MONGO_ERROR] - Processing error:', error);
  console.log('[MONGO_ERROR] - Error code:', error.code);
  console.log('[MONGO_ERROR] - Error statusCode:', error.statusCode);

  if (error.code === 11000 || error.statusCode === 11000) {
    console.log('[MONGO_ERROR] - Duplicate key error detected');
    const errorMessage = error.message || '';
    let errorDetails = [];

    if (errorMessage.includes('email')) {
      errorDetails = [ErrorMessages.EMAIL_ALREADY_EXISTS];
    } else if (errorMessage.includes('username')) {
      errorDetails = [ErrorMessages.USERNAME_ALREADY_TAKEN];
    } else {
      errorDetails = [ErrorMessages.DUPLICATE_ENTRY];
    }

    const result = {
      data: null,
      message: ErrorMessages.DUPLICATE_ENTRY,
      status: Status.FAILED,
      statusCode: StatusCode.BAD_REQUEST,
      error: errorDetails,
    };

    console.log('[MONGO_ERROR] - Duplicate error result:', result);
    return result;
  }

  // Return default error response instead of null
  console.log('[MONGO_ERROR] - Using default error response');
  return {
    data: null,
    message: ErrorMessages.SOMETHING_WENT_WRONG,
    status: Status.ERROR,
    statusCode: StatusCode.INTERNAL_ERROR,
    error: ErrorMessages.SOMETHING_WENT_WRONG,
  };
}

// Handle validation errors
function formatValidationError(error) {
  console.log('[VALIDATION_ERROR] - Processing error:', error);
  console.log('[VALIDATION_ERROR] - Error message:', error.message);

  const result = {
    data: null,
    message: ErrorMessages.INVALID_INPUT,
    status: Status.FAILED,
    statusCode: StatusCode.BAD_REQUEST,
    error: error.message,
  };

  console.log('[VALIDATION_ERROR] - Result:', result);
  return result;
}

// Handle cast errors
function formatCastError(error) {
  console.log('[CAST_ERROR] - Processing error:', error);
  console.log('[CAST_ERROR] - Error message:', error.message);

  const result = {
    data: null,
    message: ErrorMessages.INVALID_INPUT,
    status: Status.FAILED,
    statusCode: StatusCode.BAD_REQUEST,
    error: ErrorMessages.INVALID_INPUT,
  };

  console.log('[CAST_ERROR] - Result:', result);
  return result;
}

// Handle JWT errors
function formatJWTError(error) {
  console.log('[JWT_ERROR] - Processing error:', error);
  console.log('[JWT_ERROR] - Error name:', error.name);
  console.log('[JWT_ERROR] - Error message:', error.message);

  if (error.name === 'JsonWebTokenError') {
    const result = {
      data: null,
      message: ErrorMessages.INVALID_TOKEN,
      status: Status.FAILED,
      statusCode: StatusCode.UNAUTHORIZED,
      error: ErrorMessages.INVALID_TOKEN,
    };
    console.log('[JWT_ERROR] - Invalid token result:', result);
    return result;
  } else if (error.name === 'TokenExpiredError') {
    const result = {
      data: null,
      message: 'Session expired',
      status: Status.FAILED,
      statusCode: StatusCode.UNAUTHORIZED,
      error: 'Please login again',
    };
    console.log('[JWT_ERROR] - Token expired result:', result);
    return result;
  }

  // Return default JWT error response instead of null
  console.log('[JWT_ERROR] - Using default JWT error response');
  return {
    data: null,
    message: 'Authentication failed',
    status: Status.FAILED,
    statusCode: StatusCode.UNAUTHORIZED,
    error: 'Please login again',
  };
}

// Handle custom error objects
function formatCustomError(error) {
  console.log('[CUSTOM_ERROR] - Processing error:', error);
  console.log('[CUSTOM_ERROR] - Error keys:', Object.keys(error));

  let message = error.message || ErrorMessages.INTERNAL_ERROR;
  let status = Status.ERROR;
  let statusCode = StatusCode.INTERNAL_ERROR;
  let errorDetails = [message];

  if (error.status) {
    status = error.status;
  }
  if (error.statusCode) {
    // Ensure statusCode is from StatusCode enum
    const validStatusCodes = Object.values(StatusCode);
    if (validStatusCodes.includes(error.statusCode)) {
      statusCode = error.statusCode;
    } else {
      statusCode = StatusCode.INTERNAL_ERROR;
    }
  }

  // Handle validation errors from libraries like Joi, Zod, etc.
  if (error.details && Array.isArray(error.details)) {
    statusCode = StatusCode.BAD_REQUEST;
    status = Status.FAILED;
    message = 'Invalid input';
    errorDetails = error.details.map((detail) => detail.message);
  }

  // Handle Mongoose validation errors
  if (error.errors) {
    statusCode = StatusCode.BAD_REQUEST;
    status = Status.FAILED;
    message = 'Invalid input';
    const errorMessages = Object.values(error.errors).map((err) => err.message);
    errorDetails = errorMessages;
  }

  return {
    data: null,
    message,
    status,
    statusCode,
    error: errorDetails,
  };
}

// Handle primitive error types
function formatPrimitiveError(error) {
  if (!error) {
    return {
      data: null,
      message: ErrorMessages.INTERNAL_ERROR,
      status: Status.ERROR,
      statusCode: StatusCode.INTERNAL_ERROR,
      error: ErrorMessages.INTERNAL_ERROR,
    };
  } else if (typeof error === 'string') {
    return {
      data: null,
      message: error,
      status: Status.ERROR,
      statusCode: StatusCode.INTERNAL_ERROR,
      error: error,
    };
  } else if (Array.isArray(error)) {
    if (error.length > 0) {
      return {
        data: null,
        message: 'Multiple errors found',
        status: Status.ERROR,
        statusCode: StatusCode.INTERNAL_ERROR,
        error: error.join(', '),
      };
    } else {
      return {
        data: null,
        message: ErrorMessages.INTERNAL_ERROR,
        status: Status.ERROR,
        statusCode: StatusCode.INTERNAL_ERROR,
        error: ErrorMessages.INTERNAL_ERROR,
      };
    }
  }

  // Return default error response instead of null
  return {
    data: null,
    message: ErrorMessages.INTERNAL_ERROR,
    status: Status.ERROR,
    statusCode: StatusCode.INTERNAL_ERROR,
    error: 'Something went wrong',
  };
}

const formatZodError = (err) => {
  const errors =
    err instanceof z.ZodError ? err.issues.map((issue) => issue.message) : [];

  // Create a more descriptive message that includes the specific validation errors
  const errorMessage =
    errors.length > 0 ? `${errors.join(', ')}` : 'Validation failed';

  return {
    data: null,
    message: errorMessage,
    status: Status.FAILED,
    statusCode: StatusCode.BAD_REQUEST,
    error: errors,
  };
};
