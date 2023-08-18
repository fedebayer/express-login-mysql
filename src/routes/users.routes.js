import { Router } from "express";
import {
  assignPassword,
  getUsers,
  login,
} from "../controllers/users.controller.js";

const router = Router();

router.get("/", getUsers);

router.post("/login", login);

router.post("/assign-password", assignPassword);

export default router;
