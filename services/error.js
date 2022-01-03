const handleErrors = (err, request, response, next) => {

  if(process.env.NODE_ENV === "production") {
    return response.status(500).json("an error occurred, please try again later")
  }

  if (err.status) {
    return response.status(err.status).json(err.message)
  }

  return response.status(500).json(err.message)
  

}

module.exports = handleErrors