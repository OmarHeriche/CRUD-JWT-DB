const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {
  BadRequestError,
  NotFoundError,
  UnAuthonticatedError, 
} = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body }); //todo treat the internal server error comming from here later
                                    //? start
  //! create the access token
  const accessToken = user.createAccessToken();
  //! create the refresh token
  const refreshToken=user.createRefreshToken();
  //!send the refresh token as a cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
  const l3iba = jwt.verify(accessToken, process.env.AccessTokeSecret);
  const expire=l3iba.exp;
  res.cookie("expire", expire, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
  //!don't send access token to the client side
  res.status(StatusCodes.OK).json({
    user: { name: user.name },
    msg: "user created successfully"
  });
                                    //? end
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    throw new BadRequestError("please provide an email and password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnAuthonticatedError("invalid email");
  }
  const truePassword = user.cmparePassword(password);
  if (!truePassword) {
    throw new UnAuthonticatedError("invalid password");
  }
  //! create the access token
  const accessToken = user.createAccessToken();
  //!create the refresh token
  const refreshToken = user.createRefreshToken();
  //!send the refresh token as a cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
  const l3iba = jwt.verify(accessToken, process.env.AccessTokeSecret);
  const expire=l3iba.exp;
  res.cookie("expire", expire, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
  //!don't send access token to the client side
  res.status(StatusCodes.OK).json({
    user: { name: user.name },
    msg: "user logged in successfully"
  });
};
const logout=(req,res)=>{
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.clearCookie("expire");
  res.status(StatusCodes.OK).json({msg:"logged out successfully"});
}


module.exports = { register, login,logout };

