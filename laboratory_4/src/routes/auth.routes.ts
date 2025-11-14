import {Router} from "express";
import * as controller from "@/controllers/auth.controller"
import {authenticate} from "@/middleware/auth.middleware";

const router = Router();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/profile", [authenticate], controller.profile);

export default router;