import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(403).json({});
    return;
  }
  const token = authHeader.split("")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    // req.userId = decoded.userId as string;
    if (typeof decoded === "object" && "userId" in decoded) {
      req.userId = decoded.userId as string;
    } else {
      res.status(403).json({ message: "Invalid token structure" });
      return;
    }
    next();
  } catch (error) {
    res.status(403).json({});
  }
};

export default authMiddleware;
