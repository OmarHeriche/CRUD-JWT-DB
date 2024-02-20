const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UnAuthonticatedError } = require("../errors");

const refreshToken = async (req, res, next) => {
  //?start
  
  const expire = Number(req.cookies.expire);
  console.log("expire : ",expire);
  const currentTime = Math.floor(Date.now() / 1000); 
  if(expire===undefined){
    console.log("relogin/register please");
    throw new UnAuthonticatedError("authentication invalid");
  }
  if (expire > currentTime) {
    console.log("the access token is still valid");
    next();
    return;
  }
  console.log("the access token is expired");

 

  console.log("----------invoke the refresh token middleware");

  //?end
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
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
    const accessToken = jwt.sign(
      { name: payload.name, userId: payload.userId },
      process.env.AccessTokeSecret,
      {
        expiresIn: "10s",
      }
      );
      const l3iba = jwt.verify(accessToken, process.env.AccessTokeSecret);
      const expire=l3iba.exp;
    //!don't send the access token to the client side
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    res.cookie("expire", expire, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    next();
  } catch (error) {
    throw new UnAuthonticatedError("authentication invalid");
  }
};
module.exports = refreshToken;
