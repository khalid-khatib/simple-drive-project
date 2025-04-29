function errorHandler(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
      // exposing stack trace in development only
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
}

module.exports = { errorHandler };
