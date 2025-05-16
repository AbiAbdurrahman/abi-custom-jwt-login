const sendResponse = ({
  res,
  code = 200,
  message = 'SUCCESS',
  data = {},
  error
}) => {
  if (error !== undefined) {
    res.status(code)
        .json({
        message: message,
        error: error
        })
  } else {
    res.status(code)
        .json({
          message: message,
          data: data
        })
  }
}

module.exports = { sendResponse }