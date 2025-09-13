const { Status, StatusCode, ResponseMessages } = require('../constant');
const createError = require('../helper/createError');
const User = require('../models/user.model');
const tryCatch = require('../utils/tryCatch');
const { handleJwtTokens } = require('../utils/jwtToken');
const responseHandler = require('../utils/responseHandler');

const handleSignup = tryCatch(async (req, res) => {
  console.log(
    '[USER CONTROLLERS] - handleSignup: Starting user signup process',
  );
  console.log(
    '[USER CONTROLLERS] - handleSignup: Creating user in database with data:',
    req.body,
  );
  const createdUser = await User.create(req.body); // Create user in database
  console.log(
    '[USER CONTROLLERS] - handleSignup: User created successfully with ID:',
    createdUser._id,
  );
  console.log('[USER CONTROLLERS] - handleSignup: Generating tokens for user');
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

  console.log('[USER CONTROLLERS] - handleSignup: Sending successful response');
  return responseHandler(responseData, res);
});

const handleLogin = tryCatch(async (req, res) => {
  console.log('[USER CONTROLLERS] - handleLogin: Starting user login process');
  const { email, password } = req.body;
  console.log(
    '[USER CONTROLLERS] - handleLogin: Attempting to find user with email:',
    email,
  );

  const foundedUser = await User.findOne({ email });
  if (!foundedUser) {
    console.log(
      '[USER CONTROLLERS] - handleLogin: No user found with email:',
      email,
    );
    throw createError({
      message: ResponseMessages.NO_USER_FOUND,
      status: Status.FAILED,
      statusCode: StatusCode.NOT_FOUND,
      errorDetails: null,
    });
  }
  console.log(
    '[USER CONTROLLERS] - handleLogin: User found, verifying password',
  );

  const isUser = await foundedUser.checkPassword(password);

  if (!isUser) {
    console.log(
      '[USER CONTROLLERS] - handleLogin: Incorrect password provided for user:',
      email,
    );
    throw createError({
      message: ResponseMessages.INCORRECT_PASSWORD,
      status: Status.FAILED,
      statusCode: StatusCode.UNAUTHORIZED,
      errorDetails: null,
    });
  }
  console.log(
    '[USER CONTROLLERS] - handleLogin: Password verified successfully, generating tokens',
  );
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

  console.log(
    '[USER CONTROLLERS] - handleLogin: Sending successful login response',
  );
  return responseHandler(responseData, res);
});

const handleLogout = tryCatch(async (req, res) => {
  console.log(
    '[USER CONTROLLERS] - handleLogout: Starting user logout process',
  );
  console.log('[USER CONTROLLERS] - handleLogout: Request params:', req.params);
  console.log(
    '[USER CONTROLLERS] - handleLogout: User ID from params:',
    req.params.userId,
  );

  const userId = req.params.userId;

  if (!userId) {
    console.log(
      '[USER CONTROLLERS] - handleLogout: No user ID provided in params',
    );
    throw createError({
      message: ResponseMessages.USER_ID_REQUIRED,
      status: Status.FAILED,
      statusCode: StatusCode.BAD_REQUEST,
      errorDetails: null,
    });
  }

  console.log(
    '[USER CONTROLLERS] - handleLogout: Searching for user with ID:',
    userId,
  );
  const user = await User.findById(userId);

  console.log(
    '[USER CONTROLLERS] - handleLogout: User found:',
    user ? user._id : 'No user found',
  );

  if (!user) {
    console.log(
      '[USER CONTROLLERS] - handleLogout: No user found with ID:',
      userId,
    );
    throw createError({
      message: ResponseMessages.NO_USER_FOUND,
      status: Status.FAILED,
      statusCode: StatusCode.NOT_FOUND,
      errorDetails: null,
    });
  }

  console.log(
    '[USER CONTROLLERS] - handleLogout: User found successfully, preparing logout response',
  );
  console.log(
    '[USER CONTROLLERS] - handleLogout: User details - ID:',
    user._id,
    'Email:',
    user.email,
  );

  const responseData = {
    clearCookies: true,
    message: ResponseMessages.LOGOUT_SUCCESS,
    status: Status.SUCCESS,
    statusCode: StatusCode.OK,
  };

  console.log(
    '[USER CONTROLLERS] - handleLogout: Sending successful logout response',
  );
  return responseHandler(responseData, res);
});

const handleDelete = tryCatch(async (req, res) => {
  console.log(
    '[USER CONTROLLERS] - handleDelete: Starting user delete process',
  );
  console.log('[USER CONTROLLERS] - handleDelete: Request params:', req.params);
  console.log(
    '[USER CONTROLLERS] - handleDelete: User ID from params:',
    req.params.userId,
  );

  const userId = req.params.userId;

  if (!userId) {
    console.log(
      '[USER CONTROLLERS] - handleDelete: No user ID provided in params',
    );
    throw createError({
      message: ResponseMessages.USER_ID_REQUIRED,
      status: Status.FAILED,
      statusCode: StatusCode.BAD_REQUEST,
      errorDetails: null,
    });
  }

  console.log(
    '[USER CONTROLLERS] - handleDelete: Searching for user with ID:',
    userId,
  );
  const deleteUser = await User.findByIdAndDelete(userId);
  if (!deleteUser) {
    console.log(
      '[USER CONTROLLERS] - handleDelete: No user found with ID:',
      userId,
    );
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
  console.log(
    '[USER CONTROLLERS] - handleLogout: Sending successful delete response',
  );
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
