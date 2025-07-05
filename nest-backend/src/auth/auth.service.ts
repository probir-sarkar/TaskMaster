import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { GoogleUserRequest } from "./strategies/google.strategy";
import { JwtService } from "@nestjs/jwt";
import type { CookieOptions, Response } from "express";
import { JwtPayload } from "./auth.guard";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async googleAuthCallback(req: GoogleUserRequest, res: Response) {
    const user = req.user;
    const { email, name, picture } = user;
    const foundUser = await this.prisma.user.findUnique({ where: { email } });
    if (foundUser) {
      const payload: JwtPayload = { id: foundUser.id, name: foundUser.name || "" };
      const token = await this.jwtService.signAsync(payload);
      res.cookie("token", token, this.cookieParams);
      return res.redirect(`${process.env.CLIENT_URL}`);
    }
    const newUser = await this.prisma.user.create({
      data: {
        email,
        name,
        photo: picture,
        additionalInfo: {
          create: {
            signupMethod: "GOOGLE",
          },
        },
      },
    });
    const payload: JwtPayload = { id: newUser.id, name: newUser.name || "" };
    const token = await this.jwtService.signAsync(payload);
    res.cookie("token", token, this.cookieParams);
    return res.redirect(`${process.env.CLIENT_URL}`);
  }

  cookieParams: CookieOptions = {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    // domain: ".probir.dev"
  };
}
