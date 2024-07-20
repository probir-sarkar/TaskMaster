import { isTokenTimeExpired, verifyToken } from "@/utils/jwt";
import { RequestHandler } from "express";

export const authenticate: RequestHandler = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - Missing Jwt Token" });
    }
    if (isTokenTimeExpired(token)) {
      return res.status(401).json({ message: "Unauthorized - Jwt Token Expired" });
    }
    const user = verifyToken(token);
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized - Jwt Token Expired" });
  }
};
