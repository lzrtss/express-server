export const notFound = (req, res, next) => {
  res.status(404).json({
    message: 'Resource not found',
  });
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.status || 500;
  let message = err.message;

  // Handling mongoose CastError:
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  console.log(err);

  res.status(statusCode || 500).json({
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};
