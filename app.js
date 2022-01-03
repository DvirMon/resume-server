require('dotenv').config();

// IMPORTS
const express = require("express");
const cors = require("cors")
const services = require("./services/services");

// INVOKE SERVER
const server = express();

const handleServer = () => {
  const PORT = process.env.PORT || 3003
  return server.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
  });
}

// MIDDLEWARE
server.use(express.json({ limit: "50mb" }));
server.use(cors())
server.use(services.sanitize)

// POST - http://localhost:3003/api/mail

server.post('/api/mail', 
services.reCaptcha, 
services.joi, 
async (request, response, next) => {
  try {

    const data = request.body.resumeForm

    const resume = await services.mail.sendResumeMail(data)

    if (!!resume.accepted[0]) { 
      await services.mail.sendMessageMail(data)
    }

    return response.json({ resume: !!resume.accepted[0] })

  }
  catch (err) {
    // console.log(err)
    next(err)
  }
})

if (process.env.NODE_ENV === "production") {
  server.use(express.static("public/client"));

  server.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "public/client", "index.html"));
  });
}


server.use(services.error)

handleServer()


