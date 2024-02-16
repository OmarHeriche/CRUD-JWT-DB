const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UnAuthonticatedError } = require("../errors");
const User = require("../models/User");

const refreshToken = async (req, res) => {
  //if access token valid ill leave it to the next middleware 
  
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: "you are not authenticated" });
  }
  const user = await User.findOne({ refreshToken });
  if (!user) {
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
    // req.headers.authorization = `Bearer ${accessToken}`;
    const token = accessToken;//todo to be removed
    res.status(200).json({
      token,
    });
  } catch (error) {
    throw new UnAuthonticatedError("authentication invalid");
  }
};
module.exports = refreshToken;
