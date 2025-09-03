import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/test";
export const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret_key";
export const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;