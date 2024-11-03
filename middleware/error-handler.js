// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later',
  }

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }


  if (err.name && err.name === 'ValidationError') {
    customError.msg = err.message;
    // customError.msg = Object.values(err.errors).map((item) => item.message).join(', ');
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST,
      customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please provide another value.`
  }

  if (err.name === 'CastError') {
    customError.msg = `No item with id: ${err.value} found`;
    customError.statusCode = StatusCodes.BAD_GATEWAY;
  }

  // return res.status(customError.statusCode).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
