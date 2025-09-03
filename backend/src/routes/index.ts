import express from "express";
import authRouter from "./auth/index.js";
import taskRouter from "./task/index.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/tasks", taskRouter);

export default router