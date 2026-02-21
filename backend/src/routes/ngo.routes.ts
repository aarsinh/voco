import express, { Request, Response } from "express";
import { getProjects, addProject, delProject } from '../controllers/ngo.controller'

const router = express.Router();

// CRUD routes for projects
router.get("/:ngoId", getProjects);

router.post("/addProject/:ngoId", addProject);

router.delete("/delProject", delProject);

export default router;