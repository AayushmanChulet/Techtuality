import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import { SigninSchema, SignupSchema } from "../../types/index.js";
import User from "../../models/user.model.js";
import { JWT_SECRET, SALT_ROUNDS } from "../../config/config.js";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
  const { success, data, error } = SignupSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ error: error.message });
  }
  const { username, email, password, firstName, lastName } = data;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    const hasedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hasedPassword,
      firstName,
      lastName,
    });

    if (!newUser) {
      throw new Error("User creation failed");
    }

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "24h" });

    return res
      .status(201)
      .json({ message: "User created successfully", token });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const signin = async (req: Request, res: Response) => {
  const { success, data, error } = SigninSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({ error: error.message });
  }

  const { identifier, password } = data;

  try {
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string
    );
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "24h" });

    return res.status(200).json({ message: "Signin successful", token });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};
