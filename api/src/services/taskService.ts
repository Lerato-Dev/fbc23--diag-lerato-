
import * as taskModel from "../models/taskModel";
import type { Task, TaskInput, TaskStatus } from "../types/task";

/**
 * Retrieve all tasks, optionally filtered by status.
 */
export function getTasks(status?: TaskStatus): Task[] {
  return taskModel.findAll(status);
}

/**
 * Retrieve one task using its ID.
 */
export function getTaskById(id: number): Task | undefined {
  return taskModel.findById(id);
}

/**
 * Create a new task.
 */
export function createTask(input: TaskInput): Task {
  return taskModel.create(input);
}

/**
 * Update an existing task.
 */
export function updateTask(
  id: number,
  input: TaskInput
): Task | undefined {
  return taskModel.update(id, input);
}

/**
 * Mark a task as completed.
 */
export function completeTask(id: number): Task | undefined {
  return taskModel.complete(id);
}

/**
 * Delete a task.
 */
export function deleteTask(id: number): boolean {
  return taskModel.remove(id);
}
