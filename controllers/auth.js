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
  req.body.refreshToken= jwt.sign(
    { name: req.body.name, userId: req.body._id },
    process.env.RefreshTokenSecret,
    {
      expiresIn: "1d",
    }
  );
  const user = await User.create({ ...req.body }); //todo treat the internal server error comming from here later
                                    //? start
  console.log("from controllers:\n",user);//todo temporary
  //! create the access token
  const accessToken = user.createAccessToken();
  //!send the refresh token as a cookie
  res.cookie("refreshToken", user.refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
  const token = accessToken;//todo this shit is only for testing

  //!send access token to the client side
  res.status(StatusCodes.OK).json({
    user: { name: user.name },
    token,
  });
                                    //? end
  
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    throw new BadRequestError("please provide an email and password");
  }
  const user = await User.findOne({ email });

  const extraUser= await User.findOneAndUpdate(
    { email },
    {refreshToken:jwt.sign(
      { name: user.name, userId: user._id },
      process.env.RefreshTokenSecret,
      {
        expiresIn: "1d",
      }
    )},
    { new: true, runValidators: true }
  );

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
  // const refreshToken = user.createRefreshToken();
  //!send the refresh token as a cookie
  res.cookie("refreshToken", extraUser.refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
  const token = accessToken;//todo this shit is only for testing

  //!send access token to the client side
  res.status(StatusCodes.OK).json({
    user: { name: user.name },
    token,
  });
};


module.exports = { register, login };

