import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { GoogleUserRequest } from "./strategies/google.strategy";
import { JwtService } from "@nestjs/jwt";
import type { CookieOptions, Response } from "express";
import { JwtPayload } from "./auth.guard";
import { ConfigService } from "@nestjs/config";
import { SignupDto } from "./dto/signup.dto";
import argon2 from "argon2";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
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

  async signup(body: SignupDto, res: Response) {
    const { email, password, name } = body;
    const foundUser = await this.prisma.user.findUnique({ where: { email } });
    if (foundUser) return { message: "Email already exists", success: false, alreadyExists: true };
    const hashedPassword = await argon2.hash(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        additionalInfo: {
          create: {
            signupMethod: "EMAIL",
            password: hashedPassword,
          },
        },
      },
    });
    const payload: JwtPayload = { id: user.id, name: user.name || "" };
    const token = await this.jwtService.signAsync(payload);
    res.cookie("token", token, this.cookieParams);
    return { message: "Signup successfully", success: true };
  }

  async login(body: LoginDto, res: Response) {
    const { email, password } = body;
    const user = await this.prisma.user.findUnique({ where: { email }, include: { additionalInfo: true } });
    if (!user) return { message: "Email not found", success: false };
    if (user.additionalInfo?.signupMethod === "GOOGLE")
      return { message: "Google account cannot login here", success: false };
    if (!user.additionalInfo?.password) return { message: "Password not found", success: false };
    const isPasswordMatch = await argon2.verify(user.additionalInfo.password, password);
    if (!isPasswordMatch) return { message: "Password is incorrect", success: false };
    const payload: JwtPayload = { id: user.id, name: user.name || "" };
    const token = await this.jwtService.signAsync(payload);
    res.cookie("token", token, this.cookieParams);
    return { message: "Login successfully", success: true };
  }

  get cookieParams(): CookieOptions {
    return {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      domain: this.configService.get<string>("domain"),
    };
  }
}
