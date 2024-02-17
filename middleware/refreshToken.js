const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UnAuthonticatedError } = require("../errors");
const User = require("../models/User");

const refreshToken = async (req, res, next) => {
  //?start
  const accessToken = req.cookies.accessToken;

  // const decodedToken = jwt.verify(accessToken, process.env.AccessTokeSecret);//! here we are verifying the access token li jaflena
  // console.log("decodedToken", decodedToken);
  
  if(req.expirationTime===undefined){
    req.expirationTime=Math.floor(Date.now() / 1000);
    console.log("chamouli9");
  }
  const expirationTime = req.expirationTime;//! here we are getting the expiration time from the access token
  console.log("18\n",req.expirationTime);
  
  const currentTime = Math.floor(Date.now() / 1000); 


  if (expirationTime < currentTime) {
    next();
    return;
  }

  console.log("invoke the refresh token middleware");

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
      req.expirationTime=l3iba.exp;
      console.log("52\n",req.expirationTime);
    //!don't send the access token to the client side
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    next();
  } catch (error) {
    throw new UnAuthonticatedError("authentication invalid");
  }
};
module.exports = refreshToken;
