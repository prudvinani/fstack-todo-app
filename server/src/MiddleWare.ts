import dotenv from "dotenv"
dotenv.config()
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const AuthMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token,process.env.JWTPASSWORD as string) as JwtPayload;
    req.userId = decoded.id; 
    next(); 
  } catch (err:any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired, please login again' });
  }
  return res.status(401).json({ error: 'Invalid token' });
  }
};



