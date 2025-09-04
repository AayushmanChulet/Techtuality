import {type NextFunction,type Request,type Response } from "express";
import jwt  from "jsonwebtoken";
import dotenv from "dotenv";
import { JWT_SECRET } from "../config/config.js";
import { da } from "zod/locales";
dotenv.config();

if (!JWT_SECRET) {
  throw new Error("jwt variable not set");
}

export interface AuthenticatedRequest extends Request {
  token?: string;
}

const AuthMiddleware = async (req : AuthenticatedRequest , res: Response, next : NextFunction) => {
    const {authorization} = req.headers;
    if(!authorization){
        return res.status(403).json({
        success: false,
        message: "Authorization token missing or invalid",
    });
    }

    const token = authorization.split(' ')[1];
    if(!token){
      return res.status(403).json({
        success: false,
        message: "Authorization token missing or invalid",
    });
    }

    const data = jwt.verify(token ,JWT_SECRET) as {exp:number , id : string, iat :number};
    

    if(!data){
    return res.status(402).json({
      message : 'wrong token'
    })
  }
  req.token = data.id;
  next();

}

export default AuthMiddleware;