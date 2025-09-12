const ResponseSchema = require('../schemas/response.schema');
const formatErrorMessage = require('../utils/formatErrorMessage');
const responseHandler = require('../utils/responseHandler');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.log('[ERROR HANDLER] - Error occurred:', err);

  const errorResponse = formatErrorMessage(err);
  console.log('[ERROR HANDLER] - Formatted error response:', errorResponse);

  try {
    console.log('[ERROR HANDLER] - Validating error response with schema');
    ResponseSchema.parse(errorResponse);
    console.log(
      '[ERROR HANDLER] - Schema validation successful, sending response',
    );
    responseHandler({ ...errorResponse }, res);
  } catch (zodErr) {
    console.log('[ERROR HANDLER] - Schema validation failed:', zodErr);
  }
};

module.exports = errorHandler;
