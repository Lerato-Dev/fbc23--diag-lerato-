// Swagger setup: creates a web page that documents the API and lets people try it.
//
// How the parts work together:
// 1. The @swagger comments in taskRoutes.ts and server.ts describe each endpoint.
// 2. swagger-jsdoc reads those comments and builds one OpenAPI document (JSON).
// 3. swagger-ui-express turns that document into the page at /api-docs.

import path from "node:path";

import type { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// The limits below repeat the Zod rules in src/types/task.ts, because Swagger
// cannot read Zod schemas. When a rule changes there, change it here as well.
const taskLimits = {
  titleMax: 120,
  descriptionMax: 2000
};

// Builds a path from this file's folder, so it works from any terminal folder.
// Windows "\" becomes "/", because file patterns only understand "/".
function fromHere(relativePath: string): string {
  return path.join(__dirname, relativePath).replace(/\\/g, "/");
}

// Describes an error response that only contains a message.
// A function is used so every error has the same shape without repeating it.
function messageResponse(description: string, message: string) {
  return {
    description,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ErrorMessage" },
        example: { success: false, message }
      }
    }
  };
}

const options: swaggerJsdoc.Options = {
  definition: {
    // Version of the OpenAPI standard, not of this API.
    openapi: "3.0.3",

    // Shown at the top of the Swagger page.
    info: {
      title: "FBC23 Mini Task Tracker API",
      version: "1.0.0",
      description:
        "Create, view, edit, complete and delete tasks. " +
        "\"Try it out\" sends real requests, so it changes the real tasks."
    },

    // "/" means "the server this page came from", so the page keeps working when
    // PORT changes and the browser does not need CORS for these requests.
    servers: [{ url: "/", description: "This API" }],

    // Headings that group the endpoints on the page.
    tags: [
      { name: "Tasks", description: "Manage tasks" },
      { name: "Health", description: "Check that the API is running" }
    ],

    // Reusable pieces. The @swagger comments point to them with $ref, so each
    // one is written once and stays the same everywhere.
    components: {
      // Values that come from the URL.
      parameters: {
        TaskId: {
          name: "id",
          in: "path",
          required: true,
          description: "Task ID (a positive whole number)",
          schema: { type: "integer", minimum: 1 },
          example: 1
        }
      },

      // Shapes of the data that goes in and comes out.
      schemas: {
        TaskStatus: {
          type: "string",
          enum: ["Pending", "Completed"]
        },

        // What the client sends. Uses camelCase (dueDate).
        TaskInput: {
          type: "object",
          required: ["title", "dueDate"],
          properties: {
            title: {
              type: "string",
              minLength: 1,
              maxLength: taskLimits.titleMax
            },
            description: {
              type: "string",
              maxLength: taskLimits.descriptionMax,
              default: ""
            },
            dueDate: {
              type: "string",
              pattern: "^\\d{4}-\\d{2}-\\d{2}$",
              description: "YYYY-MM-DD"
            },
            status: {
              type: "string",
              enum: ["Pending", "Completed"],
              default: "Pending"
            }
          },
          example: {
            title: "Prepare diagnostic walkthrough",
            description: "Explain the application architecture",
            dueDate: "2026-11-28",
            status: "Pending"
          }
        },

        // What the API returns. Uses snake_case (due_date), because rows are
        // sent exactly as SQLite stores them.
        Task: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            description: { type: "string" },
            due_date: { type: "string" },
            status: { $ref: "#/components/schemas/TaskStatus" },
            created_at: { type: "string", description: "UTC" },
            updated_at: { type: "string", description: "UTC" }
          },
          example: {
            id: 1,
            title: "Prepare diagnostic walkthrough",
            description: "Explain the application architecture",
            due_date: "2026-11-28",
            status: "Pending",
            created_at: "2026-11-24 09:00:00",
            updated_at: "2026-11-24 09:00:00"
          }
        },

        TaskListResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Task" }
            }
          }
        },

        TaskResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            // Missing when one task is read, present after a change.
            message: { type: "string" },
            data: { $ref: "#/components/schemas/Task" }
          }
        },

        SuccessMessage: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" }
          }
        },

        ErrorMessage: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            // Only present when the task information is invalid.
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" }
                }
              }
            }
          }
        }
      },

      // Error responses shared by several endpoints.
      responses: {
        InvalidStatus: messageResponse(
          "The status filter is not Pending or Completed",
          "Status must be Pending or Completed."
        ),
        InvalidId: messageResponse(
          "The ID is not a positive whole number",
          "Task ID must be a positive whole number."
        ),
        InvalidTask: {
          description: "Invalid task information, invalid JSON or an invalid ID",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorMessage" },
              example: {
                success: false,
                message: "Please correct the task information.",
                errors: [{ message: "Title is required", field: "title" }]
              }
            }
          }
        },
        NotFound: messageResponse(
          "No task has this ID",
          "Task not found."
        ),
        TooLarge: messageResponse(
          "The request body is larger than 100 KB",
          "Request body is too large."
        ),
        ServerError: messageResponse(
          "Unexpected error; details are only shown in the API terminal",
          "An unexpected server error occurred."
        )
      }
    }
  },

  // Files that contain @swagger comments.
  apis: [fromHere("../src/server.ts"), fromHere("../src/routes/*.ts")]
};

// Built once at startup. Restart the API to see changed comments.
const swaggerDocument = swaggerJsdoc(options);

/**
 * Adds the documentation pages to the app.
 * Called from server.ts, so all Swagger code stays in this file.
 */
export function setupSwagger(app: Express): void {
  // The raw OpenAPI document. Postman can import this URL.
  // Registered first, so the page below does not handle this address.
  app.get("/api-docs.json", (_req, res) => {
    res.json(swaggerDocument);
  });

  // "serve" sends the page's CSS and JavaScript; "setup" sends the page itself.
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customSiteTitle: "Task Tracker API docs"
    })
  );
}
