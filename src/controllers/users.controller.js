import createError from "http-errors";
import HttpStatus from "http-status-codes";
import { pool } from "../db.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await getUsersFromDB();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsernameFromDB(username);

    if (!user || user.password !== password) {
      throw createError(HttpStatus.UNAUTHORIZED, "Incorrect login credentials");
    }

    res.send("Login successful");
  } catch (error) {
    next(error);
  }
};

export const assignPassword = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsernameFromDB(username);

    if (!user || user.password !== null) {
      throw createError(HttpStatus.BAD_REQUEST, "Incorrect access credentials");
    }

    if (!password || password.length < 8 || !/^\d+$/.test(password)) {
      throw createError(HttpStatus.BAD_REQUEST, "Invalid password criteria");
    }

    const result = await updateUserFromDB(user.user_id, password);

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
};

// Functions
async function getUsersFromDB() {
  const [rows] = await pool.query("SELECT * FROM user");
  return rows;
}

async function getUserByUsernameFromDB(username) {
  const [rows] = await pool.query("SELECT * FROM user WHERE username = ?", [
    username,
  ]);
  return rows.length > 0 ? rows[0] : null;
}

async function updateUserFromDB(id, password) {
  const [result] = await pool.query(
    "UPDATE user SET password = ? WHERE user_id = ?",
    [password, id]
  );
  return result.affectedRows > 0 ? result : null;
}
