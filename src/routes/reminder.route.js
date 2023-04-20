import { Router } from "express";
import {requireToken} from "../middlewares/requireToken.js";
import { paramLinkValidator,bodyLoginValidator } from "../middlewares/validatorManager.js";
import { createReminder, getReminder, getReminders, removeReminder, updateReminder } from "../controllers/reminders.controller.js";
const router = Router();

router.get('/',requireToken, getReminders);
router.get('/:id',requireToken, getReminder);
router.post('/',requireToken, createReminder);
router.delete('/:id',requireToken,paramLinkValidator, removeReminder);
router.patch('/:id',requireToken,paramLinkValidator, updateReminder);

export default router;