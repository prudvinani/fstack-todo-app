import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";


interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const AuthMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.status(401).json({ message: "Authorization header is missing" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "No Token" });
      return;
    } 

    const decoded = jwt.verify(token, "ARJUNCHAY") 
    req.userId = (decoded as JwtPayload).id
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    
  }
};
