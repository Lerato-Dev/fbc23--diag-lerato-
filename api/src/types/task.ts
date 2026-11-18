
import { z } from "zod";

// Define the allowed task statuses.
export const taskStatusSchema = z.enum([
  "Pending",
  "Completed"
]);

// Create a TypeScript type from the Zod schema.
export type TaskStatus = z.infer<typeof taskStatusSchema>;

// Validation rules for creating a task.
export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Title must be 120 characters or fewer"),

  description: z
    .string()
    .trim()
    .max(2000, "Description must be 2000 characters or fewer")
    .optional()
    .default(""),

  dueDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Due date must use YYYY-MM-DD format"
    ),

  status: taskStatusSchema
    .optional()
    .default("Pending")
});

// Updating a task follows the same validation rules.
export const updateTaskSchema = createTaskSchema;

// Create a TypeScript type from the task validation schema.
export type TaskInput = z.infer<typeof createTaskSchema>;

// Define the structure of a task returned by SQLite.
export interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}
