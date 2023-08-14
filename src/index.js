import express from "express";
import { PORT } from "./config.js";

const app = express();
app.get("/login", (req, res) => {
  res.send("Getting login");
});

app.listen(PORT);
console.log("Server running on port", PORT);
