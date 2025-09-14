const tryCatch = (fn) => {
  return async function (req, res, next) {
    try {
      const result = await fn(req, res, next);
      // If the function returns a response, don't call next()
      if (result && typeof result.then === 'undefined') {
        return result;
      }
    } catch (error) {
      next(error);
    }
  };
};
module.exports = tryCatch;
