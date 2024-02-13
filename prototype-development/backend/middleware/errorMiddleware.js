import { StatusCodes } from "http-status-codes";

//Does global error handling in controllers
const controllerErrorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode !== undefined ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({ status: statusCode, message: error.message });
};

//Catches errors in async functions and passes them to the global controller error handler
const asyncErrorHandler = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => next(err));
  };
};

export default { controllerErrorHandler, asyncErrorHandler };
