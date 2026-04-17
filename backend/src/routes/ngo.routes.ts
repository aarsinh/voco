import express from "express";
import { 
    getProjects, 
    addProject, 
    delProject, 
    getProjectVolunteers, 
    completeEvent, 
    updateVolunteerReport,
    projectStatusPie,
    getNGOProfile,
    updateNGODetails,
    getProjectHistory,
    volPerProject,
    ratingPerProject

} from '../controllers/ngo.controller'

const router = express.Router();

router.post("/addProject/:ngoId", addProject);

router.delete("/delProject", delProject);

router.patch("/completeEvent", completeEvent);

router.get("/VolunteerList/:id", getProjectVolunteers);

router.patch("/report-volunteer/:id", updateVolunteerReport);

router.get("/projectStatusPie/:ngoId", projectStatusPie);
router.get("/volPerProject/:ngoId", volPerProject);
router.get("/projectRatings/:ngoId", ratingPerProject);

router.get("/profile-data/:ngoId", getNGOProfile);

router.patch("/update-details/:id", updateNGODetails);

router.get("/history/:ngoId", getProjectHistory);

router.get("/:ngoId", getProjects);

export default router;
