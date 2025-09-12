const { StatusCode, Status, ErrorMessages } = require('../constant');

const createError = (props = {}) => {
  const {
    message = ErrorMessages.SOMETHING_WENT_WRONG,
    status = Status.FAILED,
    statusCode = StatusCode.BAD_REQUEST,
    errorDetails = null,
  } = props;

  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = status;
  if (errorDetails) error.errorDetails = errorDetails;
  return error;
};

module.exports = createError;
