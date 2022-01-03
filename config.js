 
const config = {
  smtp: {
    type: 'OAuth2', 
    user: process.env.USER_EMAIL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  }, 
};  

module.exports = config