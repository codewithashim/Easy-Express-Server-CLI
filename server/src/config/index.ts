/* eslint-disable no-undef */
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DB_URL,
  domain: process.env.DOMAIN,

  app_id: process.env.APP_ID,
  app_certificate: process.env.APP_CERTIFICATE,

  redis: {
    password: process.env.REDIS_PASSWORD as string,
    host: process.env.REDIS_HOST as string,
    port: process.env.REDIS_PORT as string,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_EXPIRATION_TIME,
    refresh_expires: process.env.JWT_REFRESH_EXPIRATION_TIME,
    bcrypt_salt_round: process.env.BCRYPT_SALT_ROUNDS,
  },

  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL as string,
    redirectUrl: process.env.GOOGLE_REDIRECT_URL as string,
    appUser: process.env.GOOGLE_APP_USER as string,
    appPass: process.env.GOOGLE_APP_PASSWORD as string,
  },
};
