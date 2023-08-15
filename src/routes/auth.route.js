import express from "express";
import {
  login,
  logout,
  refreshToken,
  register,
  googleOauthHandler,
  forgotPassword,
  confirmation
} from "../controllers/auth.controller.js";
import { requireToken } from "../middlewares/requireToken.js";
import { requireRefreshToken } from "../middlewares/requireRefreshToken.js";
import {
  bodyLoginValidator,
  bodyRegisterValidator,
} from "../middlewares/validatorManager.js";

const router = express.Router();

router.post("/register", bodyRegisterValidator, register);
router.post("/login", bodyLoginValidator, login);
router.post("/forgot-password", forgotPassword);
router.post("/confirmation", confirmation);
router.get("/refresh", requireRefreshToken, refreshToken);
router.get("/logout", logout);
router.get("/session/auth0/google", googleOauthHandler)

export default router;
