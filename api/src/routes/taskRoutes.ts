
import { Router } from "express";

import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  completeTask,
  deleteTask
} from "../controllers/taskController";

const router = Router();
// When someone sends a POST request to /api/tasks, call the createTask controller.
// GET: Retrieve all tasks.
router.get("/", getTasks);

// GET: Retrieve one task by ID.
router.get("/:id", getTaskById);

// POST: Create a new task.
router.post("/", createTask);

// PUT: Update an existing task.
router.put("/:id", updateTask);

// PATCH: Mark a task as completed.
router.patch("/:id/complete", completeTask);

// DELETE: Delete a task.
router.delete("/:id", deleteTask);

export default router;
