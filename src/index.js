import express from "express";
import createError from "http-errors";
import HttpStatus from "http-status-codes";
import { PORT } from "./config.js";
import { pool } from "./db.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(errorHandler());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Login and Password Assignment System");
});

app.get("/users", async (req, res, next) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

app.get("/login", (req, res) => {
  res.send("Please log in:");
});

app.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);

    if (!user || user.password !== password) {
      throw createError(HttpStatus.UNAUTHORIZED, "Incorrect login credentials");
    }

    res.send("Login successful");
  } catch (error) {
    next(error);
  }
});

app.get("/assign-password", (req, res) => {
  res.send("Assign a new password:");
});

app.post("/assign-password", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!password || password.length < 8 || !/^\d+$/.test(password)) {
      throw createError(HttpStatus.BAD_REQUEST, "Invalid password criteria");
    }

    const user = await getUserByUsername(username);

    if (!user) {
      throw createError(HttpStatus.NOT_FOUND, "User not found");
    }

    if (user.password !== null) {
      throw createError(HttpStatus.BAD_REQUEST, "User already has a password");
    }

    const result = await updateUser(user.id, { password });

    if (!result) {
      throw createError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to assign password"
      );
    }

    res.send("Password assigned successfully");
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

// Functions
async function getUsers() {
  const [rows] = await pool.query("SELECT * FROM user");
  return rows;
}

async function getUserByUsername(username) {
  const [rows] = await pool.query("SELECT * FROM user WHERE username = ?", [
    username,
  ]);
  return rows.length > 0 ? rows[0] : null;
}

async function updateUser(id, data) {
  const [result] = await pool.query(
    "UPDATE user SET password = ? WHERE id = ?",
    [data.password, id]
  );
  return result.affectedRows > 0 ? result : null;
}

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
