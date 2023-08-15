import { Router } from "express";
import {
  getAssignNewPassword,
  getLogin,
  index,
} from "../controllers/index.controller.js";
const router = Router();

router.get("/", index);

router.get("/login", getLogin);

router.get("/assign-password", getAssignNewPassword);

export default router;
