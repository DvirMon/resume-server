const Joi = require('joi');
const validation = require('./validation')

const emailValidation = (request, response, next) => {

  const data = request.body.resumeForm

  const schema = Joi.object().keys({
    email: Joi.string().regex(validation.regex).required(),
  }).unknown(true);

  const error = schema.validate(data, { abortEarly: false }).error;

  return validation.returnMessage(error, next);

}

module.exports = emailValidation 
