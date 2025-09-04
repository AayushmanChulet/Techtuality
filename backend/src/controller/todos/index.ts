import { type Response } from "express";
import { type AuthenticatedRequest } from "../../middleware/authmiddleware.js";
import Todos from "../../models/todos.model.js";
import { TaskSchema } from "../../types/index.js";

export const getTodos = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.token;
  const todos = await Todos.find({
    userId: userId,
  });
  return res.status(200).json({
    success: true,
    todos,
  });
};

export const createTodo = async (req: AuthenticatedRequest, res: Response) => {
  const { success, data, error } = TaskSchema.safeParse(req.body);
  const userId = req.token;
  if (!success) {
    return res.status(400).json({
      success: false,
      error,
    });
  }
  const { title, description } = data;

  const newTodo = await Todos.create({
    userId,
    title,
    description,
  });
  if (!newTodo) {
    return res.status(500).json({
      success: false,
      message: "Failed to create todo",
    });
  }

  return res.status(201).json({
    success: true,
    todo: newTodo,
  });
};

export const deleteTodo = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.token;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Todo id is required",
    });
  }

  const todo = await Todos.findOneAndDelete({ _id: id, userId: userId });
  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Todo deleted successfully",
  });
}

export const updateTodoStatus = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.token;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Todo id is required",
    });
  }

  const todo = await Todos.findOne({ _id: id, userId: userId });
  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  await Todos.updateOne({ _id: id, userId: userId }, { $set: { status: !todo.status } });

  return res.status(200).json({
    success: true,
    message: "Todo status updated successfully",
  }); 
}
