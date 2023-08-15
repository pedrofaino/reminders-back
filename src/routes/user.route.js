import express from "express";
import { requireToken } from "../middlewares/requireToken.js";
import { requireRefreshToken } from "../middlewares/requireRefreshToken.js";
import {
  bodyLoginValidator,
  bodyRegisterValidator,
} from "../middlewares/validatorManager.js";
import { infoUser, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/info/:email", requireToken, infoUser);
router.patch("/user/:id", requireToken, updateUser);

export default router;