import config from "../config";

export const strategyConfig = {
  clientID: config.google.clientId,
  clientSecret: config.google.clientSecret,
  callbackURL: config.google.callbackUrl,
  scope: ["profile", "email"],
};
