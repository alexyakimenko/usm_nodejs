import {Router} from "express";
import * as controller from "@/controllers/auth.controller"
import {authenticate} from "@/middleware/auth.middleware";
import {createUserValidator, loginValidator} from "@/validators/user.validator";
import validate from "@/middleware/validate.middleware";

const router = Router();

router.post("/register", createUserValidator, validate, controller.register);
router.post("/login", loginValidator, validate, controller.login);
router.get("/profile", [authenticate], controller.profile);

export default router;