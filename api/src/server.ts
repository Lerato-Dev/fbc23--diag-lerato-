
import "dotenv/config";

import express from "express";
import cors from "cors";

import taskRoutes from "./routes/taskRoutes";
import { errorHandler } from "./middleware/errorHandler";
import "./config/database";

const app = express();

const PORT = Number(process.env.PORT) || 5000;

const frontendUrl =
  process.env.FRONTEND_URL || "http://localhost:3000";

// Configure CORS to allow requests from the frontend.
app.use(cors({
  origin: frontendUrl
}));

// Allow Express to read JSON request bodies.
app.use(express.json({
  limit: "100kb"
}));

// API health check.
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "FBC23 Task Tracker API is running."
  });
});

// Register task routes.
app.use("/api/tasks", taskRoutes);

// Handle requests to endpoints that do not exist.
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found."
  });
});

// Handle errors after registering routes.
app.use(errorHandler);

// Start the Express server.
app.listen(PORT, () => {
  console.log(
    `Task Tracker API running at http://localhost:${PORT}`
  );
});
