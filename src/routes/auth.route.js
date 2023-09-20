import express from "express";
import {
  login,
  logout,
  refreshToken,
  register,
  googleOauthHandler,
  forgotPassword,
  confirmation,
  confirmationApp,
  registerApp,
  loginApp,
} from "../controllers/auth.controller.js";
import { requireToken } from "../middlewares/requireToken.js";
import { refreshTokenMiddleware, requireRefreshToken } from "../middlewares/requireRefreshToken.js";
import {
  bodyLoginValidator,
  bodyRegisterValidator,
} from "../middlewares/validatorManager.js";

const router = express.Router();

router.post("/register", bodyRegisterValidator, register);
router.post("/registerApp", bodyRegisterValidator, registerApp);
router.post("/login", bodyLoginValidator, login);
router.post("/loginApp", bodyLoginValidator, loginApp);
router.post("/forgot-password", forgotPassword);
router.post("/confirmation", confirmation);
router.post("/confirmationApp", confirmationApp);
router.get("/refresh", requireRefreshToken, refreshToken);
router.get("/app/refresh", refreshTokenMiddleware, refreshToken);
router.get("/logout", logout);
router.get("/session/auth0/google", googleOauthHandler)
// router.get("/session/auth0/googleApp", googleOauthHandlerApp)

export default router;
