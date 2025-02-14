import { ApiError } from "../utils/ApiError.js";
import { asyncHandaler } from "../utils/asyncHandaler.js";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

export const verifyJWT = asyncHandaler(async (req, resp, next) => {
  
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log(new ApiError(401, "Unauthorized request"));
      return resp
        .status(401)
        .json(
          new ApiResponce(401," ", "Unauthorized request")
        );
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password");

    if (!user) {
      console.log( new ApiError(404, "Invalid Access Token"));
      return resp
        .status(404)
        .json(
          new ApiResponce(404," ", "Invalid Access Token")
        );
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
