import { RegisterVolunteer, RegisterNGO, Login, ValidateToken, Logout } from "../controllers/auth.controller";
import { Router } from "express";

const router = Router();

router.get("/validate", ValidateToken)
router.post("/register/volunteer", RegisterVolunteer);
router.post("/register/ngo", RegisterNGO);
router.post("/login", Login);
router.post("/logout", Logout)

export default router;

