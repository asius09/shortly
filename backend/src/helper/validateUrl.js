const tryCatch = require('../utils/tryCatch');
const mongoose = require('mongoose');
const Url = require('../models/url.model');
const createError = require('./createError');
const { ResponseMessages, Status, StatusCode } = require('../constant');

// Validate urlId as a valid ObjectId before querying
const validateUrlById = tryCatch(async (urlId, next) => {
  if (!urlId) {
    next(
      createError({
        message: ResponseMessages.URL_ID_REQUIRED,
        status: Status.ERROR,
        statusCode: StatusCode.BAD_REQUEST,
      }),
    );
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(urlId)) {
    next(
      createError({
        message: ResponseMessages.URL_ID_INVALID || 'Invalid URL Id',
        status: Status.ERROR,
        statusCode: StatusCode.BAD_REQUEST,
      }),
    );
    return;
  }

  const url = await Url.findById(urlId);

  if (!url) {
    next(
      createError({
        message: ResponseMessages.URL_NOT_FOUND,
        status: Status.ERROR,
        statusCode: StatusCode.NOT_FOUND,
      }),
    );
    return;
  }
  return url;
});

const validateOneUrl = tryCatch(async (urlProps = {}, next) => {
  if (!urlProps || Object.keys(urlProps).length === 0) {
    next(
      createError({
        message: ResponseMessages.INVALID_INPUT,
        status: Status.ERROR,
        statusCode: StatusCode.BAD_REQUEST,
      }),
    );
    return;
  }

  const url = await Url.findOne(urlProps);

  if (!url) {
    next(
      createError({
        message: ResponseMessages.URL_NOT_FOUND,
        status: Status.ERROR,
        statusCode: StatusCode.NOT_FOUND,
      }),
    );
    return;
  }
  return url;
});

module.exports = { validateUrlById, validateOneUrl };
