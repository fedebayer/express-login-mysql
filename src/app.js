import express from "express";
import HttpStatus from "http-status-codes";

import indexRoutes from "./routes/index.routes.js";
import usersRoutes from "./routes/users.routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(errorHandler());

// Routes
app.use("/api", indexRoutes);
app.use("/", usersRoutes);

function errorHandler() {
  return (err, req, res, next) => {
    if (err.statusCode) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal error" });
    }
  };
}

export default app;
