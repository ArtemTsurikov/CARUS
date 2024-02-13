import { StatusCodes } from 'http-status-codes';

import User from '../models/userModel.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';
import { createJWT } from '../utils/tokenUtils.js';
import { UnauthenticatedError } from '../errors/customErrors.js';
import errorMiddleware from "../middleware/errorMiddleware.js";
import { getGeoCode } from '../utils/geocoder.js';
import emailMiddleware from '../middleware/emailMiddleware.js';
import HttpError from "../errors/HttpError.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

//regiter user with firstname, lastname, email, password, address and determine geolocation
//create token (valid for 1 day) and send back to client
const register = errorMiddleware.asyncErrorHandler(async (req, res, next) =>  {
  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;
  const user = await User.create(req.body);
  
  //update user latitude and longitude from address
  const location = await getGeoCode(user.address)
  user.address.latitude = location[0]
  user.address.longitude = location[1]
  user.save()

  const token = createJWT({ userId: user._id });

  res.status(StatusCodes.CREATED).json({ msg: 'User created', userId: user._id, token: token });
});

//login user with email and password
//create token (valid for 1 day) and send back to client
const login =errorMiddleware.asyncErrorHandler(async (req, res, next) =>  {
  const { email, password } = req.body;
  // check if user exists
  const user = await User.findOne({ email });
  // check if password is correct
  const isValidUser = user && (await comparePassword(password, user.password));
  if (!isValidUser) {
    throw new UnauthenticatedError('Invalid credentials');
  }
  const token = createJWT({ userId: user._id });
  
  // uncomment for dicrect acces to backend with postman
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  });
  

  res.status(StatusCodes.OK).json({ msg: 'User logged in', userId: user._id, token: token, user : user});
});


//check if user exists with email
//create token (valid for 10 minutes) and send back to client
//send email to user with link to reset password
const passwordResetLink = errorMiddleware.asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;
  //check if user exists
  const user = await User.findOne({ email });
  if (user) {
    const secretKey = process.env.JWT_SECRET;
    const tokenExpiryTime = '10min'; // Token will be valid for 10 minutes
    const token =  jwt.sign({userId: user._id}, secretKey, { expiresIn: tokenExpiryTime });
    
    const resetPasswordLink = `http://localhost:3000/resetPassword/${token}`;

    await emailMiddleware.handleMail(
        //email to user,
        user.email,    
        `Password Reset`,
        `<p>Dear ${user.firstName},<br><br>
        Please click on the following link to reset your password:<br><br>
        <a href=${resetPasswordLink}>Reset Password</a><br><br>
        For security reasons, this link will expire in 10 minutes.<br><br>
        Cheers, Team Carus</p>`
    );

    res.status(StatusCodes.OK).json({ msg: 'Email sent' });
    //no else as this would expose if a user exists
  }
  else{
    next(new HttpError( `Bad Request`, StatusCodes.BAD_REQUEST));
  }
});


//check if user exists with token
//update password
const passwordReset = errorMiddleware.asyncErrorHandler(async (req, res, next) => {
  const password  = req.body.password;
  const token = req.params.token;
  const secretKey = process.env.JWT_SECRET;
  const decodedToken = jwt.verify(token, secretKey);
  const user = await User.findById(decodedToken.userId);
  if (user) {
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Password reset' });
  }
  else{
    next(new HttpError(`Bad Request`, StatusCodes.BAD_REQUEST));
  }
});




export { register, login, passwordResetLink, passwordReset };