const express = require('express');
const config = require('./config/config');
const connectDB = require('./db');
const cors = require('cors');
const authRoutes = require('./routes/user.route');
const urlRoutes = require('./routes/url.route');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const { Status, StatusCode, ResponseMessages } = require('./constant');
const createError = require('./helper/createError');
const cookieParser = require('cookie-parser');
const { handleRedirectUrl } = require('./controllers/url.controller');

const PORT = config.port;

const app = express();
app.use(cors());
app.use(logger);
app.use(express.json());
app.use(cookieParser());

// Connect DB
connectDB();

// Place the redirect route AFTER the API routes to avoid conflicts
app.use('/api', authRoutes);
app.use('/api/urls', urlRoutes);

// URL redirect route (should be after API routes to avoid shadowing)
app.get('/:alias', handleRedirectUrl);

// Handle all non-matching routes with 404
app.all('/*splat', (req, res, next) => {
  const error = createError({
    message: ResponseMessages.NOT_FOUND,
    status: Status.FAILED,
    statusCode: StatusCode.NOT_FOUND,
  });
  next(error);
});

// Central Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  // Server started successfully
});
