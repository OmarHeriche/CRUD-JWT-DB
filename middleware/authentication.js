const jwt = require("jsonwebtoken");
const { UnAuthonticatedError } = require("../errors");
const refreshToken = require("./refreshToken");
require("dotenv").config();
const express = require("express");
const app = express();

const auth = async (req, res, next) => {
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
    console.log("from auth middleware:\n", req.user); //todo temporary
    next();
  } catch (error) {
    // throw new UnAuthonticatedError("authentication invalid");
    // console.log("from auth middleware:\n", error); //todo temporary
    next(new UnAuthonticatedError("authentication invalid"));
    // app.use(refreshToken);
  }
};

module.exports = auth;
