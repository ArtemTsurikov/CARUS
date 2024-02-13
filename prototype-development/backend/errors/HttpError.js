class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status =
      statusCode >= 400 && statusCode < 500 ? "Bad Request" : "Internal Server Error";
    Error.captureStackTrace(this, this.constructor)
  }
}
export default HttpError;
