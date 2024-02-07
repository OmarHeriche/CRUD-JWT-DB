const { CustomApiError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleWare = (err, req, res, next) => {
  const customError = {
    errorMsg: err.msg || "something went wrong please try again later",
    statusCode: err.statusCode || 500,
  };
  if (err.name === "ValidationError") {
    customError.errorMsg=Object.values(err.errors)
      .map((item) => item.message)
      .join(',');
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === "CastError") {
    customError.errorMsg=`there is no element with the id : ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }
  if (err.code === 11000) {
    customError.errorMsg = `this email: ${err.keyValue.email} is already taken use another one and it will work`;
    customError.statusCode = StatusCodes.UNAUTHORIZED;
  }
  return res.status(customError.statusCode).json({ msg: customError.errorMsg });
};
module.exports = errorHandlerMiddleWare;
