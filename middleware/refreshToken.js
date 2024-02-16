const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UnAuthonticatedError } = require("../errors");
const User = require("../models/User");

const refreshToken = async (req, res, next) => {

  console.log("req.user=", req.user); //todo temporary
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    console.log("no refresh token"); //todo temporary
    return res.status(401).json({ error: "you are not authenticated" });
  }
  const user = await User.findOne({ refreshToken });
  if (!user) {
    console.log("no user"); //todo temporary
    return res.status(401).json({ error: "you are not authenticated" });
  }
  try {
    //todo is this part necessary? yes :becuause the user is not authenticated yet so we need to verify the refresh token
    const payload = jwt.verify(refreshToken, process.env.RefreshTokenSecret);
    req.user = {
      userId: payload.userId,
      name: payload.name,
    };
    //!create the access token
    const accessToken = user.createAccessToken();
    //!send the access token to the client side
    console.log("from refreshToken middleware:\n", accessToken); //todo temporary
    req.headers.authorization = `Bearer ${accessToken}`;
    next();
  } catch (error) {
    throw new UnAuthonticatedError("authentication invalid");
  }
};
module.exports = refreshToken;
