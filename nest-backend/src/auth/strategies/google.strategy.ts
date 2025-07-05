/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// auth/strategies/google.strategy.ts
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>("googleClientId")!,
      clientSecret: configService.get<string>("googleClientSecret")!,
      callbackURL: `${configService.get<string>("baseUrl")}/auth/google/callback`,
      scope: ["profile", "email"],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const user = { ...profile._json, access_token: accessToken ? accessToken : null };
    done(null, user);
  }
}

export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  access_token: string;
}
export interface GoogleUserRequest extends Request {
  user: GoogleUser;
}
