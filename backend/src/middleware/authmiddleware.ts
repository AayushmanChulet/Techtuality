import {type NextFunction,type Request,type Response } from "express";
import jwt  from "jsonwebtoken";
import dotenv from "dotenv";
import { JWT_SECRET } from "../config/config.js";
dotenv.config();

if (!JWT_SECRET) {
  throw new Error("jwt variable not set");
}

export interface AuthenticatedRequest extends Request {
  token?: number;
}

const AuthMiddleware = async (req : AuthenticatedRequest , res: Response, next : NextFunction) => {
    const token = req.headers["authorization"];
    if(!token){
        return res.status(403).json({
        success: false,
        message: "Authorization token missing or invalid",
    });
    }

    const data = jwt.verify(token ,JWT_SECRET) as {exp:number , id : string, iat :number};
    

    if(!data){
    res.status(402).json({
      message : 'wrong token'
    })
    return;
  }
  req.token = parseInt(data?.id);
  next();

}

export default AuthMiddleware;