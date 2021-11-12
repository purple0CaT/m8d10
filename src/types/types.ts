import { Model } from "mongoose";

export interface reqUser {
  tokens: [{ accessToken: string; refreshToken: string }];
  _id: string;
}
export interface UserType {
  _id: string;
}
export interface UserModel {
  _id: string;
  name: string;
  email?: string;
  password?: string | undefined;
  role: string;
  fbId?: string | undefined;
  googleId?: string | undefined;
  refreshToken?: string | any;
}
export interface UserSchemaType extends Model<UserModel> {
  checkCredentials(email: string, password: string): any;
}
