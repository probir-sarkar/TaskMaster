/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
export interface JwtPayload {
  id: number;
  name: string;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Injectable()
export class CookieAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException("No token found in cookies");
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);
      request.user = payload; // 👤 Attach user to request
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }

    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies?.["token"];
  }
}
