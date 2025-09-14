const ResponseSchema = require('../schemas/response.schema');
const formatErrorMessage = require('../utils/formatErrorMessage');
const responseHandler = require('../utils/responseHandler');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const errorResponse = formatErrorMessage(err);

  try {
    ResponseSchema.parse(errorResponse);

    responseHandler({ ...errorResponse }, res);
  } catch (schemaErr) {
    // Fallback: send minimal error response
    res.status(500).json({
      status: 'FAILED',
      statusCode: 500,
      message: 'Internal Server Error',
      errorDetails: schemaErr.message,
    });
  }
};

module.exports = errorHandler;
