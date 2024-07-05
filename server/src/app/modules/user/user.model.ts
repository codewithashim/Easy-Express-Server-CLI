import { Schema, model } from "mongoose";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { IUser, UserModel } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../../config";

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    profile: {
      type: String,
    },
    phone: {
      type: String,
      index: { unique: true },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(ENUM_USER_ROLE),
      required: true,
    },

    password_reset_token: {
      token: String,
      expires: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_round)
    );
  }
  next();
});

UserSchema.methods.isUserExist = async function (
  email: string
): Promise<Partial<IUser> | null> {
  const user = await User.findOne(
    { email },
    {
      password: 1,
      id: 1,
      role: 1,
      name: 1,
      email: 1,
      phone: 1,
    }
  );
  return user;
};

UserSchema.methods.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  const isPasswordMatched = await bcrypt.compare(givenPassword, savedPassword);
  return isPasswordMatched;
};

export const User = model<IUser, UserModel>("User", UserSchema);