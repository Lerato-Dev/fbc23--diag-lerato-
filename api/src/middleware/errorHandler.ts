
import type { ErrorRequestHandler } from "express";

/**
 * Central error-handling middleware.
 * Handles unexpected errors from routes, controllers and middleware.
 */
export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  _next
): void => {
  // Log technical details in the backend terminal.
  console.error(
    `[API ERROR] ${req.method} ${req.originalUrl}`,
    error
  );

  // Read known error properties safely.
  const errorDetails = error as {
    type?: string;
    status?: number;
    statusCode?: number;
    message?: string;
  };

  // Handle invalid JSON sent in the request body.
  if (errorDetails.type === "entity.parse.failed") {
    res.status(400).json({
      success: false,
      message: "Invalid JSON format. Please check your request body."
    });
    return;
  }

  // Handle request bodies that exceed the configured size limit.
  if (errorDetails.type === "entity.too.large") {
    res.status(413).json({
      success: false,
      message: "Request body is too large."
    });
    return;
  }

  // Handle other known client errors.
  const statusCode =
    errorDetails.statusCode ?? errorDetails.status;

  if (
    typeof statusCode === "number" &&
    statusCode >= 400 &&
    statusCode < 500
  ) {
    res.status(statusCode).json({
      success: false,
      message: errorDetails.message || "Invalid request."
    });
    return;
  }

  // Do not expose internal technical details to the frontend.
  // yThis sends a JSON error response to the frontend.
  res.status(500).json({
    success: false,
    message: "An unexpected server error occurred."
  });
};
