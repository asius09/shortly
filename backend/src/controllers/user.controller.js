const { Status, StatusCode, ResponseMessages } = require('../constant');
const createError = require('../helper/createError');
const User = require('../models/user.model');
const tryCatch = require('../utils/tryCatch');
const { handleJwtTokens } = require('../utils/jwtToken');
const responseHandler = require('../utils/responseHandler');

const handleSignup = tryCatch(async (req, res) => {
  const createdUser = await User.create(req.body); // Create user in database
  const { token, refreshToken } = await handleJwtTokens(createdUser);

  const responseData = {
    status: Status.SUCCESS,
    statusCode: StatusCode.CREATED,
    message: ResponseMessages.SIGNUP_SUCCESS,
    data: {
      user: {
        id: createdUser._id,
        fullName: createdUser.fullName,
        email: createdUser.email,
      },
    },
    token,
    refreshToken,
  };

  return responseHandler(responseData, res);
});

const handleLogin = tryCatch(async (req, res) => {
  const { email, password } = req.body;

  const foundedUser = await User.findOne({ email });
  if (!foundedUser) {
    throw createError({
      message: ResponseMessages.NO_USER_FOUND,
      status: Status.FAILED,
      statusCode: StatusCode.NOT_FOUND,
      errorDetails: null,
    });
  }

  const isUser = await foundedUser.checkPassword(password);

  if (!isUser) {
    throw createError({
      message: ResponseMessages.INCORRECT_PASSWORD,
      status: Status.FAILED,
      statusCode: StatusCode.UNAUTHORIZED,
      errorDetails: null,
    });
  }
  const { token, refreshToken } = await handleJwtTokens(foundedUser);

  const responseData = {
    status: Status.SUCCESS,
    statusCode: StatusCode.OK,
    message: ResponseMessages.LOGIN_SUCCESS,
    data: {
      user: {
        id: foundedUser._id,
        fullName: foundedUser.fullName,
        email: foundedUser.email,
      },
    },
    token,
    refreshToken,
  };

  return responseHandler(responseData, res);
});

const handleLogout = tryCatch(async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    throw createError({
      message: ResponseMessages.USER_ID_REQUIRED,
      status: Status.FAILED,
      statusCode: StatusCode.BAD_REQUEST,
      errorDetails: null,
    });
  }

  const user = await User.findById(userId);

  if (!user) {
    throw createError({
      message: ResponseMessages.NO_USER_FOUND,
      status: Status.FAILED,
      statusCode: StatusCode.NOT_FOUND,
      errorDetails: null,
    });
  }

  const responseData = {
    clearCookies: true,
    message: ResponseMessages.LOGOUT_SUCCESS,
    status: Status.SUCCESS,
    statusCode: StatusCode.OK,
  };

  return responseHandler(responseData, res);
});

const handleDelete = tryCatch(async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    throw createError({
      message: ResponseMessages.USER_ID_REQUIRED,
      status: Status.FAILED,
      statusCode: StatusCode.BAD_REQUEST,
      errorDetails: null,
    });
  }

  const deleteUser = await User.findByIdAndDelete(userId);
  if (!deleteUser) {
    throw createError({
      message: ResponseMessages.NO_USER_FOUND,
      status: Status.FAILED,
      statusCode: StatusCode.NOT_FOUND,
      errorDetails: null,
    });
  }
  const responseData = {
    clearCookies: true,
    message: ResponseMessages.DELETE_SUCCESS,
    status: Status.SUCCESS,
    statusCode: StatusCode.OK,
  };
  return responseHandler(responseData, res);
});

const handleUser = tryCatch(async (req, res, next) => {
  // Simply return the user info from req.user (populated by authMiddleware)
  if (!req.user) {
    throw createError({
      message: ResponseMessages.NO_USER_FOUND,
      status: Status.ERROR,
      statusCode: StatusCode.NOT_FOUND,
      errorDetails: null,
    });
  }

  return responseHandler(
    {
      status: Status.SUCCESS,
      statusCode: StatusCode.OK,
      message: 'User info retrieved successfully',
      data: {
        user: {
          id: req.user._id,
          fullName: req.user.fullName,
          email: req.user.email,
        },
      },
    },
    res,
  );
});

module.exports = {
  handleLogin,
  handleSignup,
  handleLogout,
  handleDelete,
  handleUser,
};
