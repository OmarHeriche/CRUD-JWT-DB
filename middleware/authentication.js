const jwt = require("jsonwebtoken");
const { UnAuthonticatedError } = require("../errors");
require("dotenv").config();

const auth = async (req, res, next) => {
  console.log("-----------auth middleware is working");//todo remove this line
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({ error: "you are not authenticated" });
  }
  try {
    const payload = jwt.verify(accessToken, process.env.AccessTokeSecret);
    req.user = {
      userId: payload.userId,
      name: payload.name,
    }; //todo hna jbna l userI and the name from the payload :o
    next();
  } catch (error) {//! let's put some work here to avoid throwing the error when the there is a new access token
    console.log("the user is not authenticated yet catch error");//todo remove this line  
    next();
    return;
  }
};

module.exports = auth;
