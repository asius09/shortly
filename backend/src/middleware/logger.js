const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Simple logger function
const logger = (req, res, next) => {
  const logsDir = path.join(__dirname, '../../logs');

  // Ensure logs directory exists
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  // Create log file path
  const logFile = path.join(logsDir, 'app.log');

  // Ensure log file exists
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, '');
  }

  // Use morgan to log requests
  morgan('combined', {
    stream: fs.createWriteStream(logFile, { flags: 'a' }),
  })(req, res, next);
};

module.exports = logger;
