import { Router } from "express";
import { createLink, getLink, getLinks, removeLink, updateLink } from "../controllers/link.controller.js";
import {requireToken} from "../middlewares/requireToken.js";
import { bodyLoginValidator, paramLinkValidator } from "../middlewares/validatorManager.js";
const router = Router();

router.get('/',requireToken, getLinks);
router.get('/:id',requireToken, getLink);
router.post('/',requireToken,bodyLoginValidator, createLink);
router.delete('/:id',requireToken,paramLinkValidator, removeLink);
router.patch('/:id',requireToken,paramLinkValidator,bodyLoginValidator,updateLink)

export default router;