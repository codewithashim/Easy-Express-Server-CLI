import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { responseMessage } from "../../../constants/message";
import config from "../../../config";

const loginWithGoogle = async (payload: Partial<IUser>): Promise<string> => {
  try {
    const isExist = await User.findOne({ email: payload.email });
    const jwtPayload: { id: Types.ObjectId | string; email: string } = {
      id: "",
      email: "",
    };
    if (isExist) {
      jwtPayload.id = isExist._id;
      jwtPayload.email = isExist.email;
      const accessToken = jwt.sign(jwtPayload, config.jwt.secret as string, {
        expiresIn: config.jwt.expiresIn,
      });
      return accessToken;
    } else {
      const result = await User.create(payload);
      jwtPayload.id = result._id;
      jwtPayload.email = result.email;
      const accessToken = jwt.sign(jwtPayload, config.jwt.secret as string, {
        expiresIn: config.jwt.expiresIn,
      });
      return accessToken;
    }
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `${responseMessage.FAILED_MESSAGE}`
    );
  }
};

export const GoogleOAuthService = {
  loginWithGoogle
};
