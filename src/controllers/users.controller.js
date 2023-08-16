import createError from "http-errors";
import HttpStatus from "http-status-codes";

import UserModel from "../db.js";

// UserModel.sync({ force: true }); // This will create the user table if it doesn't exist.

// This function will be modified/deleted to avoid security issues
export const getUsers = async (req, res, next) => {
  try {
    const users = await UserModel.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ where: { username } });

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
    const user = await UserModel.findOne({ where: { username } });

    if (!user || user.password !== null) {
      throw createError(HttpStatus.BAD_REQUEST, "Incorrect access credentials");
    }

    if (!password || password.length < 8 || !/^\d+$/.test(password)) {
      throw createError(HttpStatus.BAD_REQUEST, "Invalid password criteria");
    }

    user.password = password;
    await user.save();

    res.send("Password assigned successfully");
  } catch (error) {
    next(error);
  }
};
