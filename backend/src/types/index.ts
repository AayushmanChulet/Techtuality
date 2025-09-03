import zod, { email } from "zod";

export const SignupSchema = zod.object({
    username: zod.string().min(3).max(20),
    email: zod.email(),
    password: zod.string().min(8).max(50),
    firstName: zod.string().min(3).max(20),
    lastName: zod.string().min(3).max(20),
});

export const SigninSchema = zod.object({
    identifier: zod.string().min(3).max(50),
    password: zod.string().min(8).max(50),
});