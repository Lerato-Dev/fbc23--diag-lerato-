
import type { Request, Response, NextFunction } from "express";
import type { ZodIssue } from "zod";

import {
  createTaskSchema,
  updateTaskSchema,
  taskStatusSchema
} from "../types/task";

import * as taskService from "../services/taskService";

/**
 * Validate a task ID from the URL.
 * A valid ID must be a positive whole number.
 */
function parseId(rawId: unknown): number | null {
  if (typeof rawId !== "string") {
    return null;
  }

  const id = Number(rawId);

  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

/**
 * Return a consistent validation error response.
 */
function sendValidationError(
  res: Response,
  issues: ZodIssue[]
): void {
  res.status(400).json({
    success: false,
    message: "Please correct the task information.",
    errors: issues.map((issue) => ({
      message: issue.message,
      field: issue.path.join(".")
    }))
  });
}

// GET /api/tasks?status=Pending|Completed
export function getTasks(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    let status: "Pending" | "Completed" | undefined;

    if (req.query.status !== undefined) {
      const parsedStatus = taskStatusSchema.safeParse(req.query.status);

      if (!parsedStatus.success) {
        res.status(400).json({
          success: false,
          message: "Status must be Pending or Completed."
        });
        return;
      }

      status = parsedStatus.data;
    }

    const tasks = taskService.getTasks(status);

    res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/tasks/:id
export function getTaskById(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      res.status(400).json({
        success: false,
        message: "Task ID must be a positive whole number."
      });
      return;
    }

    const task = taskService.getTaskById(id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found."
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/tasks
export function createTask(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const parsed = createTaskSchema.safeParse(req.body);

    if (!parsed.success) {
      sendValidationError(res, parsed.error.issues);
      return;
    }

    const task = taskService.createTask(parsed.data);

    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      data: task
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/tasks/:id
export function updateTask(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      res.status(400).json({
        success: false,
        message: "Task ID must be a positive whole number."
      });
      return;
    }

    const parsed = updateTaskSchema.safeParse(req.body);

    if (!parsed.success) {
      sendValidationError(res, parsed.error.issues);
      return;
    }

    const task = taskService.updateTask(id, parsed.data);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found."
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      data: task
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/tasks/:id/complete
export function completeTask(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      res.status(400).json({
        success: false,
        message: "Task ID must be a positive whole number."
      });
      return;
    }

    const task = taskService.completeTask(id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found."
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task marked as completed.",
      data: task
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/tasks/:id
export function deleteTask(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      res.status(400).json({
        success: false,
        message: "Task ID must be a positive whole number."
      });
      return;
    }

    const deleted = taskService.deleteTask(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Task not found."
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully."
    });
  } catch (error) {
    next(error);
  }
}
