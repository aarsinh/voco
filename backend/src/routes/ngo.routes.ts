import express from "express";
import { getProjects, addProject, delProject, getProjectVolunteers, completeEvent, updateVolunteerReport } from '../controllers/ngo.controller'

const router = express.Router();

router.get("/:ngoId", getProjects);

router.post("/addProject/:ngoId", addProject);

router.delete("/delProject", delProject);

router.patch("/completeEvent", completeEvent);

router.get("/VolunteerList/:id", getProjectVolunteers);

router.patch("/report-volunteer/:id", updateVolunteerReport)

export default router;
