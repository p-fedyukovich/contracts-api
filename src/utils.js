/**
 * Wrapper that catches errors and passes it to next
 */
function errorHandler(callback) {
  return async (req, res, next) => {
    try {
      await callback(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = {
  errorHandler,
}
