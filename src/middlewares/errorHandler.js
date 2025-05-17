export const errorHandler = (err, req, res, next) => {
  console.error('💥 Error:', err.message);

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};
