import { RegisterVolunteer, RegisterNGO, Login } from "../controllers/auth.controller";
import { Router } from "express";

const router = Router();

router.post("/register/volunteer", RegisterVolunteer);
router.post("/register/ngo", RegisterNGO);
router.post("/login", Login);

export default router;

