import "dotenv/config";
const env = {
  port: process.env.PORT || 8080,
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  jwtSecret: process.env.JWT_SECRET || "thisisasecret",
};

export default env;
