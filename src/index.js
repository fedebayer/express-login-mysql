import express from "express";
import { PORT } from "./config.js";
import { pool } from "./db.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Login and Password Assignment System");
});

app.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM user");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/login", (req, res) => {
  res.send("Please log in:");
});

const findUserByName = async (username) => {
  try {
    const [rows] = await pool.query("SELECT * FROM user WHERE username = ?", [
      username,
    ]);

    if (rows.length <= 0)
      return res.status(404).json({ message: "User not found" });

    return rows[0];
  } catch (error) {
    console.log(error.message);
  }
};

const updatePasswordUserByName = async (username, password) => {
  try {
    const [result] = await pool.query(
      "UPDATE user SET username = IFNULL(?, username), password = IFNULL(?, password) WHERE username = username",
      [username, password, username]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      return result;
    }
  } catch (error) {
    console.log(error.message);
  }
};

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await findUserByName(username);

  if (!user || user.password !== password) {
    return res
      .status(401)
      .send("Error due to incorrect access (login incorrect)");
  }

  res.send("Login successful");
});

app.get("/assign-password", (req, res) => {
  res.send("Assign a new password:");
});

app.post("/assign-password", (req, res) => {
  const { username, password } = req.body;

  // Validate password
  if (!password || password.length < 8 || !/^\d+$/.test(password)) {
    return res
      .status(400)
      .send("Error due to incorrect access (password criteria not met)");
  }

  const user = findUserByName(username);
  if (!user) {
    return res.status(404).send("User not found");
  }

  const result = updatePasswordUserByName(username, password);
  if (!result) {
    return res.status(500).send("Internal error");
  }

  res.send("Password assigned successfully");
});

app.listen(PORT);
console.log("Server running on port", PORT);
