const express = require('express');
const config = require('./config/config');
const connectDB = require('./db');
const cors = require('cors');
const authRoutes = require('./routes/user.route');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const { Status, StatusCode, ResponseMessages } = require('./constant');
const createError = require('./helper/createError');
var cookieParser = require('cookie-parser');

const PORT = config.port;

const app = express();
app.use(cors());
app.use(logger);
app.use(express.json());
app.use(cookieParser());

// Connect DB
connectDB();

// Routes
app.use('/', authRoutes);

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

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
