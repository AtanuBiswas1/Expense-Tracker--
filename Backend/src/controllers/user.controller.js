import { asyncHandaler } from "../utils/asyncHandaler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { User } from "../model/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
//import mongoose from "mongoose";

const generateAccessToken = async (userId) => {
  //console.log(userId);
  try {
    const user = await User.findById(userId);
    //console.log(user)
    const accessToken = await user.generateAccessToken();
    //console.log({accessToken});
    return accessToken; // if any show error then check this please
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Access Token"
    );
  }
};

const registerUser = asyncHandaler(async (req, resp) => {
  // user data get from frontend
  const { userName, email, password } = req.body;
  //console.log({userName})

  if (userName === "") {
    throw new ApiError(400, "User Name is required !!");
  }
  if (email === "") {
    //throw new ApiError(400, "Email ID is required !!");
    console.log(new ApiError(400, "Email ID is required !!"));
    return resp
      .status(409)
      .json(new ApiResponce(400, "", "Email ID is required !!"));
  }
  if (password === "") {
    console.log(new ApiError(400, "Password is required !!"));
    return resp
      .status(409)
      .json(new ApiResponce(400, "", "Password is required !!"));
  }
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    //throw new ApiError(409, "This mail id already exists");
    console.log(new ApiError(409, "This mail id already exists"));
    return resp
      .status(409)
      .json(new ApiResponce(409, "", "This mail id already exists"));
  }
  /*
  return resp
    .status(201)
    .json( new ApiError(409, "This mail id already exists"));
  */
  let avatarLocalPath = req.files?.avatar?.avatar[0]?.path;
  let avatar = "";
  if (avatarLocalPath) avatar = await uploadOnCloudinary(avatarLocalPath); //|| ""

  // create database
  const user = await User.create({
    userName: userName.toLowerCase(),
    avatar: avatar?.url || "",
    email,
    password,
  });
  const checkUsercreate = await User.findById(user._id).select("-password");

  if (!checkUsercreate) {
    throw new ApiError(500, "Something  went wrong while registering user");
  }

  return resp
    .status(201)
    .json(
      new ApiResponce(200, checkUsercreate, "User registered successfully")
    );
});

const loginUser = asyncHandaler(async (req, resp) => {
  //1. get data from req.body for login
  //2.Email input is not empty?
  //3. Email has into userdatabase or not?
  //4.password input is not empty?
  //5. password correct or not
  //6/access token
  //7.send all in cookie

  const { email, password } = req.body;
  if (!email && !password) {
    throw new ApiError(400, "Email id and password required");
  }

  const user = await User.findOne({ email });
  //console.log(user);

  if (!user) {
    console.log(new ApiError(404, "User does not exist"));
    return resp
      .status(409)
      .json(new ApiResponce(409, "", "This mail id already exists"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    // throw new ApiError(401, "Password incorrect")
    console.log(new ApiError(401, "Password incorrect"));
    return resp
      .status(401)
      .json(new ApiResponce(401, "", "Password incorrect"));
  }
  //console.log(user._id);

  const accessToken = await generateAccessToken(user._id);
  //console.log("line 103",accessToken);
  const loggedInUser = await User.findById(user._id).select("-password");
  

  const option = {
    // this option works for anyone can't modify cookie by frontend
    //httpOnly: true,
    secure: true,
    sameSite: 'None',               // Allow cross-site cookies
    maxAge:24*60*60*1000,    // 1 day in milliseconds (expire in 24 hours)
    
  };

  return resp
    .status(200)
    // .cookie("accessToken", accessToken, option) // set cookie
    .json(
      // send data in cookie from backend to frontend
      new ApiResponce(
        200,
        {
          user: loggedInUser,
          accessToken,
          authenticated:true,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandaler(async (req, resp) => {
  await User.findByIdAndUpdate(req.user._id, {
    new: true,
  });
  const option = {
    httpOnly: true,
    secure: true,
  };
  return resp
    .status(200)
    .clearCookie("accessToken", option)
    .json(new ApiResponce(200, {}, "User logged out"));
});

const currentPasswordChange = asyncHandaler(async (req, resp) => {
  const { oldPassword, newPassword } = req.bdy;
  const user = await User.findById(req.user?._id); // req.user come from middleware auth.middleware.js ,here we write if user logged in then must be req.user=user
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return resp.status(200).json(200, {}, "password changed successfully");
});

export { registerUser, loginUser, logoutUser, currentPasswordChange };
