// Maps each URL and method to a controller function. There is no logic here.
//
// The @swagger comments are read by swagger/swagger.ts to build /api-docs.
// They only document the API: changing one does not change how the API works.
// They are written in YAML, so the indentation must stay correct.
//
// What the parts of a @swagger comment do:
//   /api/tasks     the full path (server.ts adds /api/tasks to these routes)
//   get, post...   the HTTP method
//   tags           the heading the endpoint appears under
//   summary        the short text next to the endpoint
//   parameters     values in the URL, such as the ID or the status filter
//   requestBody    the JSON the client must send
//   responses      each status code the endpoint can return
//   $ref           reuses a piece defined in swagger.ts

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

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Get all tasks
 *     description: Sorted by due date (earliest first), then newest ID first.
 *     parameters:
 *       - name: status
 *         in: query
 *         required: false
 *         description: Return only tasks with this status
 *         schema:
 *           $ref: '#/components/schemas/TaskStatus'
 *     responses:
 *       200:
 *         description: The list of tasks (empty when there are none)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskListResponse'
 *       400:
 *         $ref: '#/components/responses/InvalidStatus'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/", getTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get one task
 *     parameters:
 *       - $ref: '#/components/parameters/TaskId'
 *     responses:
 *       200:
 *         description: The task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       400:
 *         $ref: '#/components/responses/InvalidId'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/:id", getTaskById);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create a task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       201:
 *         description: Task created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       400:
 *         $ref: '#/components/responses/InvalidTask'
 *       413:
 *         $ref: '#/components/responses/TooLarge'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post("/", createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Replace a task
 *     description: >-
 *       Send every field. A description that is left out becomes empty, and a
 *       status that is left out becomes Pending, which reopens a completed task.
 *     parameters:
 *       - $ref: '#/components/parameters/TaskId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       200:
 *         description: Task updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       400:
 *         $ref: '#/components/responses/InvalidTask'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       413:
 *         $ref: '#/components/responses/TooLarge'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put("/:id", updateTask);

/**
 * @swagger
 * /api/tasks/{id}/complete:
 *   patch:
 *     tags: [Tasks]
 *     summary: Mark a task as completed
 *     description: Needs no body. Completing a completed task also returns 200.
 *     parameters:
 *       - $ref: '#/components/parameters/TaskId'
 *     responses:
 *       200:
 *         description: Task marked as completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       400:
 *         $ref: '#/components/responses/InvalidId'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.patch("/:id/complete", completeTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete a task permanently
 *     parameters:
 *       - $ref: '#/components/parameters/TaskId'
 *     responses:
 *       200:
 *         description: Task deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       400:
 *         $ref: '#/components/responses/InvalidId'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete("/:id", deleteTask);

export default router;
