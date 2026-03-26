import express from "express";
import { getProjects, addProject, delProject, updateEventStatus } from '../controllers/ngo.controller'

const router = express.Router();

router.get("/:ngoId", getProjects);

router.post("/addProject/:ngoId", addProject);

router.delete("/delProject", delProject);

router.patch("/changeStatus", updateEventStatus);

export default router;
