exports.tryCatch = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

exports.tryCatchAsync = (fn, onError) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      onError(error);
    }
  };
};
