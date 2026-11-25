// Entry point of the API: the first file that runs on "pnpm dev".
// Order matters here, because Express runs middleware from top to bottom.

// Must be the first import, so the .env values exist before other files use them.
import "dotenv/config";

import express from "express";
import cors from "cors";

import taskRoutes from "./routes/taskRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { setupSwagger } from "../swagger/swagger";

// Imported only to run it: opens SQLite and creates the tasks table at startup,
// so a database problem stops the API before it accepts any requests.
import "./config/database";

const app = express();

// Environment variables are always text, so PORT is converted to a number.
// 5000 is used when PORT is missing or not a valid number.
const PORT = Number(process.env.PORT) || 5000;

// The only website whose pages may read this API's responses.
const frontendUrl =
  process.env.FRONTEND_URL || "http://localhost:3000";

// The frontend (3000) and API (5000) use different ports, so the browser treats
// them as different origins. One origin is allowed instead of "*" so that other
// websites cannot read or change tasks from a visitor's browser.
app.use(cors({
  origin: frontendUrl
}));

// Must come before the routes, or req.body is undefined in the controllers.
// The limit rejects very large bodies (413) before they use up memory.
app.use(express.json({
  limit: "100kb"
}));

// Adds the API documentation page (/api-docs) and its data (/api-docs.json).
// Must come before the 404 handler, or the page would never be found.
setupSwagger(app);

// Health check: a quick way to confirm the API is running without using tasks.
// The underscore in _req shows that the parameter is not used.
/**
 * @swagger
 * /:
 *   get:
 *     tags: [Health]
 *     summary: Check that the API is running
 *     responses:
 *       200:
 *         description: The API is running
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 */
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "FBC23 Task Tracker API is running."
  });
});

// Every path in taskRoutes starts with /api/tasks.
app.use("/api/tasks", taskRoutes);

// Must come after all routes: a request only gets here if no route matched.
// Returns JSON, because Express would send an HTML page by default.
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found."
  });
});

// Must be last, so it can catch errors from everything registered above it.
app.use(errorHandler);

// Start accepting requests only after everything above has been set up.
app.listen(PORT, () => {
  console.log(
    `Task Tracker API running at http://localhost:${PORT}`
  );
  console.log(
    `API documentation at http://localhost:${PORT}/api-docs`
  );
});
