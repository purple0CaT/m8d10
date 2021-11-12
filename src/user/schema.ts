import mongoose, { SchemaType } from "mongoose";
import bcrypt from "bcrypt";
import { UserModel, UserSchemaType } from "../types/types";

const { Schema, model } = mongoose;

const UserSchema = new Schema<UserModel, UserSchemaType>({
  name: { type: String, required: true },
  email: {
    type: String,
    required: function (this: any) {
      return !Boolean(this.fbId || this.googleId);
    },
  },
  password: {
    type: String,
    required: function (this: any) {
      return !Boolean(this.fbId || this.googleId);
    },
  },
  role: { type: String, required: true, default: "guest" },
  //   googleId: { type: String },
  fbId: {
    type: String,
    required: function (this: any) {
      return !Boolean(this.password || this.googleId);
    },
  },
  googleId: {
    type: String,
    required: function (this: any) {
      return !Boolean(this.password || this.fbId);
    },
  },
  refreshToken: { type: String },
});

UserSchema.pre("save", async function () {
  const newUser = this;
  const passNew: any = newUser.password;
  if (newUser.isModified("password")) {
    newUser.password = await bcrypt.hash(passNew, 10);
  }
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.__v;
  delete userObj.refreshToken;
  return userObj;
};
UserSchema.statics.checkCredentials = async function (email, pass) {
  const user: any = await this.findOne({ email });
  if (user) {
    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
};
export default model<UserModel, UserSchemaType>("User", UserSchema);
