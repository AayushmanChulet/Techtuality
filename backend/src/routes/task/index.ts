import express from 'express';
import { createTodo, deleteTodo, getTodos, updateTodoStatus } from '../../controller/todos/index.js';
import AuthMiddleware from '../../middleware/authmiddleware.js';

const router = express.Router();

router.get('/', AuthMiddleware, getTodos);
router.post('/', AuthMiddleware, createTodo);
router.delete('/:id', AuthMiddleware, deleteTodo);
router.put('/:id', AuthMiddleware, updateTodoStatus);

export default router;