export function successResponse(res, message, data = {}, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

export function errorResponse(res, message, statusCode = 400, errors = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
}
