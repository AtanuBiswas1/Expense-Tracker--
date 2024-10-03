import mongoose from "mongoose";
import jwt from "jsonwebtoken"; // jwt use for
import bcrypt from "bcrypt"; // bcrypt use for to encrypt the password which save in database such that any one can't read the password from database

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, // cloudinary url (here we give original url of image in cloudinary and we get a link from cloudinary and it save in our database)
    },
  },
  // timestamps save all date and time when user create account
  { timestamps: true }
);
//password encrypt----- logic
UserSchema.pre("save", async function (next) {
  //  if password changed by user only then do encrypt the password other wish not do
  if (!this.isModified("password")) return next();
  // bcrypt do encrypt the password with 10 round
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
//user given password is correct or not check
UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
//Generate Access Token
UserSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id, // those information want to keep into our Access token
      email: this.email,
      userName: this.userName,
    },
    process.env.ACCESS_TOKEN_SECRET,

    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
export const User = mongoose.model("User", UserSchema);
