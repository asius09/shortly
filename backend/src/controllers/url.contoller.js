const createError = require('../helper/createError');
const responseHandler = require('../utils/responseHandler');
const { Status, StatusCode, ResponseMessages } = require('../constant');
const tryCatch = require('../utils/tryCatch');
const Url = require('../models/url.model');
const { validateUrlById, validateOneUrl } = require('../helper/validateUrl');

const handleCreateURL = tryCatch(async (req, res, next) => {
  const user = req.user;
  const body = req.body;

  console.log('handleCreateURL called with user:', user, 'and body:', body);

  const createdUrl = await Url.create({ ...body, user: user._id });

  console.log('Created URL:', createdUrl);

  if (!createdUrl) {
    console.error('URL creation failed');
    next(
      createError({
        message: ResponseMessages.URL_CREATE_FAILED,
        status: Status.FAILED,
        statusCode: StatusCode.INTERNAL_ERROR,
      }),
    );
    return;
  }
  return responseHandler(
    {
      data: { createdUrl },
      message: ResponseMessages.URL_CREATE_SUCCESS,
      status: Status.SUCCESS,
      statusCode: StatusCode.CREATED,
    },
    res,
  );
});

const handleGetURL = tryCatch(async (req, res, next) => {
  const user = req.user;
  const urlId = req.urlId;

  console.log('handleGetURL called with user:', user, 'and urlId:', urlId);

  if (urlId) {
    const foundedUrl = await validateUrlById(urlId, req, res, next);

    console.log('Found URL by id:', foundedUrl);

    return responseHandler(
      {
        data: foundedUrl,
        message: ResponseMessages.URL_FETCH_SUCCESS,
        status: Status.SUCCESS,
        statusCode: StatusCode.OK,
      },
      res,
    );
  }

  const allUrl = await Url.find({ user: user._id });

  console.log('All URLs for user:', allUrl);

  if (!allUrl) {
    console.error('No URLs found for user');
    return next(
      createError({
        message: ResponseMessages.INTERNAL_ERROR,
        status: Status.FAILED,
        statusCode: StatusCode.INTERNAL_ERROR,
      }),
    );
  }
  return responseHandler(
    {
      data: allUrl,
      message: ResponseMessages.URL_FETCH_SUCCESS,
      status: Status.SUCCESS,
      statusCode: StatusCode.OK,
    },
    res,
  );
});

const handleUpdateURL = tryCatch(async (req, res, next) => {
  const user = req.user;
  const body = req.body;

  console.log('handleUpdateURL called with user:', user, 'and body:', body);

  if (body.user !== user._id) {
    console.error('User ID mismatch:', body.user, user._id);
    return next(
      createError({
        message: ResponseMessages.INVALID_INPUT,
        status: Status.FAILED,
        statusCode: StatusCode.BAD_REQUEST,
      }),
    );
  }

  const foundedUrl = await validateUrlById(body.id, next);

  console.log('Found URL to update:', foundedUrl);

  const updatedUrl = await Url.updateOne({ ...body, _id: foundedUrl._id });

  console.log('Update result:', updatedUrl);

  if (!updatedUrl) {
    console.error('URL update failed');
    return next(
      createError({
        message: ResponseMessages.URL_UPDATE_FAILED,
        status: Status.FAILED,
        statusCode: StatusCode.INTERNAL_ERROR,
      }),
    );
  }

  return responseHandler(
    {
      data: updatedUrl,
      message: ResponseMessages.URL_UPDATE_SUCCESS,
      status: Status.SUCCESS,
      statusCode: StatusCode.OK,
    },
    res,
  );
});

const handleDeleteURL = tryCatch(async (req, res, next) => {
  console.log('handleDeleteURL calling');
  const user = req.user;
  const urlId = req.urlId;

  console.log('handleDeleteURL called with user:', user, 'and urlId:', urlId);

  const foundedUrl = await validateUrlById(urlId, next);

  console.log('Found URL to delete:', foundedUrl);

  if (String(foundedUrl.user) !== String(user._id)) {
    console.error('User ID mismatch for delete:', foundedUrl.user, user._id);
    return next(
      createError({
        message: ResponseMessages.INVALID_INPUT,
        status: Status.FAILED,
        statusCode: StatusCode.BAD_REQUEST,
      }),
    );
  }

  const deletedUrl = await Url.deleteOne({ _id: foundedUrl._id });

  console.log('Delete result:', deletedUrl);

  if (!deletedUrl) {
    console.error('URL delete failed');
    return next(
      createError({
        message: ResponseMessages.URL_DELETE_FAILED,
        status: Status.FAILED,
        statusCode: StatusCode.INTERNAL_ERROR,
      }),
    );
  }

  return responseHandler(
    {
      data: deletedUrl,
      message: ResponseMessages.URL_DELETE_SUCCESS,
      status: Status.SUCCESS,
      statusCode: StatusCode.OK,
    },
    res,
  );
});

const handleRedirectUrl = tryCatch(async (req, res, next) => {
  const alias = req.params.alias;

  const foundedUrl = await validateOneUrl({ alias }, next);
  await foundedUrl.updateClicks();
  await foundedUrl.save();

  // Redirect to the original URL
  return res.redirect(foundedUrl.originalUrl);
});

module.exports = {
  handleCreateURL,
  handleGetURL,
  handleUpdateURL,
  handleDeleteURL,
  handleRedirectUrl,
};
