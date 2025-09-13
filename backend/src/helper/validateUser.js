const tryCatch = require('../utils/tryCatch');
const User = require('../models/user.model');
const createError = require('./createError');
const { ResponseMessages, Status, StatusCode } = require('../constant');

const validateUserById = tryCatch(async (userId, next) => {
  if (!userId) {
    return next(
      createError({
        message: ResponseMessages.USER_ID_REQUIRED,
        status: Status.ERROR,
        statusCode: StatusCode.BAD_REQUEST,
      }),
    );
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(
      createError({
        message: ResponseMessages.NO_USER_FOUND,
        status: Status.ERROR,
        statusCode: StatusCode.NOT_FOUND,
      }),
    );
  }
  return user;
});

module.exports = { validateUserById };
