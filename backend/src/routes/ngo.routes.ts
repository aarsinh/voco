import express from "express";
import { getProjects, addProject, delProject, updateEventStatus, getProjectVolunteers, completeEvent } from '../controllers/ngo.controller'

const router = express.Router();

router.get("/:ngoId", getProjects);

router.post("/addProject/:ngoId", addProject);

router.delete("/delProject", delProject);

router.patch("/changeStatus", updateEventStatus);

router.patch("/completeEvent", completeEvent);

router.get("/VolunteerList/:id", getProjectVolunteers);

export default router;
