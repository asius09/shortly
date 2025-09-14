const { ResponseMessages, Status, StatusCode } = require('../constant');
const { z } = require('zod');

// Main function that orchestrates all error formatting
const formatErrorMessage = (error) => {
  // Special handling for errors created by createError.js
  if (
    error instanceof Error &&
    Object.prototype.hasOwnProperty.call(error, 'statusCode') &&
    Object.prototype.hasOwnProperty.call(error, 'status')
  ) {
    // This is likely a custom error from createError.js
    return {
      data: null,
      message: error.message || ResponseMessages.SOMETHING_WENT_WRONG,
      status: error.status || Status.FAILED,
      statusCode: error.statusCode || StatusCode.BAD_REQUEST,
      error: error.errorDetails
        ? Array.isArray(error.errorDetails)
          ? error.errorDetails
          : [error.errorDetails]
        : [error.message || ResponseMessages.SOMETHING_WENT_WRONG],
    };
  }

  // Check error type and parse accordingly
  const errorType = getErrorType(error);

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
  const message = error.message || ResponseMessages.SOMETHING_WENT_WRONG;
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
    message: ResponseMessages.SOMETHING_WENT_WRONG,
    status: Status.ERROR,
    statusCode: StatusCode.INTERNAL_ERROR,
    error: ResponseMessages.SOMETHING_WENT_WRONG,
  };
};

// Handle MongoDB server errors with specific duplicate key info
function formatMongoServerError(error) {
  let message = '';
  let status = Status.ERROR;
  let statusCode = StatusCode.INTERNAL_ERROR;
  let errorDetails = [];

  if (error.code === 11000 || error.statusCode === 11000) {
    statusCode = StatusCode.BAD_REQUEST;
    status = Status.FAILED;

    // Try to extract the duplicated field(s) and value(s)
    let duplicateFields = [];
    let duplicateValues = [];
    if (error.keyPattern) {
      duplicateFields = Object.keys(error.keyPattern);
    }
    if (error.keyValue) {
      duplicateValues = Object.entries(error.keyValue).map(
        ([field, value]) => `${field}: "${value}"`,
      );
    }

    // Compose a specific message
    if (duplicateFields.length > 0 && duplicateValues.length > 0) {
      message = `Duplicate entry for ${duplicateValues.join(', ')}. Please use a different value.`;
      errorDetails = [
        `Duplicate value for field(s): ${duplicateFields.join(', ')}`,
      ];
    } else if (error.message && error.message.includes('email')) {
      message = ResponseMessages.EMAIL_ALREADY_EXISTS;
      errorDetails = [ResponseMessages.EMAIL_ALREADY_EXISTS];
    } else if (error.message && error.message.includes('username')) {
      message = ResponseMessages.USERNAME_ALREADY_TAKEN;
      errorDetails = [ResponseMessages.USERNAME_ALREADY_TAKEN];
    } else {
      message = ResponseMessages.DUPLICATE_ENTRY;
      errorDetails = [ResponseMessages.DUPLICATE_ENTRY];
    }
  } else if (error.code === 11001 || error.statusCode === 11001) {
    statusCode = StatusCode.BAD_REQUEST;
    status = Status.FAILED;
    message = ResponseMessages.DUPLICATE_ENTRY;
    errorDetails = [ResponseMessages.DUPLICATE_ENTRY];
  } else if (error.code === 121 || error.statusCode === 121) {
    statusCode = StatusCode.BAD_REQUEST;
    status = Status.FAILED;
    message = ResponseMessages.INVALID_INPUT;
    errorDetails = [ResponseMessages.INVALID_INPUT];
  } else {
    statusCode = StatusCode.INTERNAL_ERROR;
    status = Status.ERROR;
    message = ResponseMessages.SOMETHING_WENT_WRONG;
    errorDetails = [ResponseMessages.SOMETHING_WENT_WRONG];
  }

  const result = {
    data: null,
    message,
    status,
    statusCode,
    error: errorDetails,
  };

  return result;
}

// Handle MongoDB errors
function formatMongoError(error) {
  if (error.code === 11000 || error.statusCode === 11000) {
    const errorMessage = error.message || '';
    let errorDetails = [];

    if (errorMessage.includes('email')) {
      errorDetails = [ResponseMessages.EMAIL_ALREADY_EXISTS];
    } else if (errorMessage.includes('username')) {
      errorDetails = [ResponseMessages.USERNAME_ALREADY_TAKEN];
    } else {
      errorDetails = [ResponseMessages.DUPLICATE_ENTRY];
    }

    const result = {
      data: null,
      message: ResponseMessages.DUPLICATE_ENTRY,
      status: Status.FAILED,
      statusCode: StatusCode.BAD_REQUEST,
      error: errorDetails,
    };

    return result;
  }

  // Return default error response instead of null
  return {
    data: null,
    message: ResponseMessages.SOMETHING_WENT_WRONG,
    status: Status.ERROR,
    statusCode: StatusCode.INTERNAL_ERROR,
    error: ResponseMessages.SOMETHING_WENT_WRONG,
  };
}

// Handle validation errors
function formatValidationError(error) {
  const result = {
    data: null,
    message: ResponseMessages.INVALID_INPUT,
    status: Status.FAILED,
    statusCode: StatusCode.BAD_REQUEST,
    error: error.message,
  };

  return result;
}

// Handle cast errors
function formatCastError(error) {
  const result = {
    data: null,
    message: ResponseMessages.INVALID_INPUT,
    status: Status.FAILED,
    statusCode: StatusCode.BAD_REQUEST,
    error: ResponseMessages.INVALID_INPUT,
  };

  return result;
}

// Handle JWT errors
function formatJWTError(error) {
  if (error.name === 'JsonWebTokenError') {
    const result = {
      data: null,
      message: ResponseMessages.INVALID_TOKEN,
      status: Status.FAILED,
      statusCode: StatusCode.UNAUTHORIZED,
      error: ResponseMessages.INVALID_TOKEN,
    };
    return result;
  } else if (error.name === 'TokenExpiredError') {
    const result = {
      data: null,
      message: 'Session expired',
      status: Status.FAILED,
      statusCode: StatusCode.UNAUTHORIZED,
      error: 'Please login again',
    };
    return result;
  }

  // Return default JWT error response instead of null
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
  let message = error.message || ResponseMessages.INTERNAL_ERROR;
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
    const ResponseMessages = Object.values(error.errors).map(
      (err) => err.message,
    );
    errorDetails = ResponseMessages;
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
      message: ResponseMessages.INTERNAL_ERROR,
      status: Status.ERROR,
      statusCode: StatusCode.INTERNAL_ERROR,
      error: ResponseMessages.INTERNAL_ERROR,
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
        message: ResponseMessages.INTERNAL_ERROR,
        status: Status.ERROR,
        statusCode: StatusCode.INTERNAL_ERROR,
        error: ResponseMessages.INTERNAL_ERROR,
      };
    }
  }

  // Return default error response instead of null
  return {
    data: null,
    message: ResponseMessages.INTERNAL_ERROR,
    status: Status.ERROR,
    statusCode: StatusCode.INTERNAL_ERROR,
    error: 'Something went wrong',
  };
}

const formatZodError = (err) => {
  if (err instanceof z.ZodError) {
  } else {
  }

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
