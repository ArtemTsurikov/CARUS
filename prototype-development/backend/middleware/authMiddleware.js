import User from "../models/userModel.js";
import { UnauthenticatedError } from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

const authenticateUser = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  //use req.cookies for direct acces to backend with postman
  //const { token } = req.cookies;
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    throw new UnauthenticatedError("Authentication invalid, no token present");
  }

  try {
    const payload = verifyJWT(token);
    const userID = payload.userId;

    // check if user exists
    const user = await User.findOne({ _id: userID });
    req.user = { userID };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

const addHeaders = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
};

export { authenticateUser, addHeaders };
