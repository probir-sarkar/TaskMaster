import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import env from "@/env";

const googleConfig = {
  clientID: env.googleClientId,
  clientSecret: env.googleClientSecret,
  callbackURL: "http://localhost:8080/auth/google/callback",
};
passport.use(
  new GoogleStrategy(googleConfig, (accessToken, refreshToken, profile, done) => {
    try {
      const user = { ...profile._json, access_token: accessToken ? accessToken : null };
      return done(null, user);
    } catch (err) {
      return done(null, err);
    }
  })
);

export default passport;
