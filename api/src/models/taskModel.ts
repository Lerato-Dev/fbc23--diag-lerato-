
import db from "../config/database";
import type { Task, TaskInput, TaskStatus } from "../types/task";

// Select the task fields returned by the database.
const taskSelect = `
  SELECT
    id,
    title,
    description,
    due_date,
    status,
    created_at,
    updated_at
  FROM tasks
`;

/**
 * Retrieve all tasks.
 * Optionally filter tasks by status.
 */
export function findAll(status?: TaskStatus): Task[] {
  const rows = status
    ? db.prepare(
        `${taskSelect}
         WHERE status = ?
         ORDER BY due_date ASC, id DESC`
      ).all(status)
    : db.prepare(
        `${taskSelect}
         ORDER BY due_date ASC, id DESC`
      ).all();

  return rows as Task[];
}

/**
 * Retrieve one task using its ID.
 */
export function findById(id: number): Task | undefined {
  return db.prepare(
    `${taskSelect} WHERE id = ?`
  ).get(id) as Task | undefined;
}

/**
 * Insert a new task into the database.
 */
export function create(input: TaskInput): Task {
  const result = db.prepare(`
    INSERT INTO tasks (
      title,
      description,
      due_date,
      status
    )
    VALUES (
      @title,
      @description,
      @dueDate,
      @status
    )
  `).run(input);

  const task = findById(Number(result.lastInsertRowid));

  if (!task) {
    throw new Error("Task was created but could not be retrieved.");
  }

  return task;
}

/**
 * Update an existing task.
 */
export function update(
  id: number,
  input: TaskInput
): Task | undefined {
  const result = db.prepare(`
    UPDATE tasks
    SET
      title = @title,
      description = @description,
      due_date = @dueDate,
      status = @status,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `).run({
    ...input,
    id
  });

  if (result.changes === 0) {
    return undefined;
  }

  return findById(id);
}

/**
 * Mark a task as completed.
 */
export function complete(id: number): Task | undefined {
  const result = db.prepare(`
    UPDATE tasks
    SET
      status = 'Completed',
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(id);

  if (result.changes === 0) {
    return undefined;
  }

  return findById(id);
}

/**
 * Delete a task using its ID.
 */
export function remove(id: number): boolean {
  const result = db.prepare(
    "DELETE FROM tasks WHERE id = ?"
  ).run(id);

  return result.changes > 0;
}
