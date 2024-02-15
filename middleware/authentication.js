const jwt = require("jsonwebtoken");
const { UnAuthonticatedError } = require("../errors");
require("dotenv").config();

const auth = (req, res, next) => {
  if (
    !(
      req.headers.authorization.startsWith("Bearer") &&
      req.headers.authorization
    )
  ) {
    throw new UnAuthonticatedError("authentication invalid");
  }
  const token = req.headers.authorization.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.AccessTokeSecret);
    req.user = {
      userId: payload.userId,
      name: payload.name,
    }; //todo hna jbna l userI and the name from the payload :o
    next();
  } catch (error) {
    throw new UnAuthonticatedError("authentication invalid");
  }
};

module.exports = auth;
