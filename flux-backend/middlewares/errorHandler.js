const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error("ERROR:", err);
  console.error("STACK:", err.stack);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
