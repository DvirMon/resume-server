
const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const returnMessage = (errors, next) => {
  if (errors) {
    const error = errors.details.map((error) => errorFormat(error));
    return next({ status: 400, message: error[0] });
  }
  next();
};

const errorFormat = (error) => {
  error.path = error.context.key;
  error.value = error.context.value;
  delete error.context;
  return formatMessage(error);
};

const formatMessage = (error) => {

  if (error.type === "string.pattern.base") {
    error.message = "מייל לא תקין";
  }
  if (error.type === "string.empty") {
    error.message = error.path + " is required";
  }
  return error;
};

module.exports = {
  regex,
  returnMessage,
} 
