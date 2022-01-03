const axios = require('axios')

const reCaptcha = async (request, response, next) => {

  const verifyCaptcha = `secret=${process.env.RE_CAPTCHA_SECRET_KEY}&response=${request.body.reCaptcha}`;
  
  try {
    const payload = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?${verifyCaptcha}`
      );
      
      const data = payload.data

      console.log(data)

    if (!data.success || data.score < 0.5) {
      return next({ status: 404, message: "security failed" })
    }

    next();
  } catch (err) {
    next(err);
  }
};


module.exports = reCaptcha;
