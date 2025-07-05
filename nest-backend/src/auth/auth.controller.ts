import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { GoogleUserRequest } from "./strategies/google.strategy";
import type { Response } from "express";
import { CookieAuthGuard } from "./auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth() {
    // Redirects to Google
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthCallback(@Req() req: GoogleUserRequest, @Res() res: Response) {
    await this.authService.googleAuthCallback(req, res);
  }

  @Get("verify")
  @UseGuards(CookieAuthGuard)
  verify(@Req() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    return { success: true, message: "User is authenticated", user: req.user };
  }

  @Get("logout")
  logout(@Res() res: Response) {
    res.cookie("token", "", {
      maxAge: 0,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.json({ message: "Logout successfully" });
  }
}
