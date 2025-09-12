const { StatusCode, Status } = require('../constant');

const createError = (props = {}) => {
  const {
    message = 'An error occurred',
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
