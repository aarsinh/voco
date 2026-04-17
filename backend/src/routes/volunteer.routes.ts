import express from 'express';
import { registerProject, unregisterProject, showRegisteredProj, showUpcomingProj, UpdatePreferences, GetPreferences, completeTask, submitReview, getVolunteerAllProjects, getVolunteerProfile, updateVolunteerDetails } from '../controllers/volunteer.controller';

const router = express.Router();


router.get('/registered/:volunteerId', showRegisteredProj);
router.get('/allprojects/:volunteerId', getVolunteerAllProjects);
router.get('/profile-data/:volunteerId', getVolunteerProfile);

router.patch('/update-details/:id', updateVolunteerDetails);

router.get('/preferences/:volunteerId', GetPreferences);

router.put('/preferences', UpdatePreferences)

router.post('/register', registerProject);

router.post('/unregister', unregisterProject);

router.patch('/completeTask', completeTask);

router.patch('/submitReview', submitReview);

router.get('/:volunteerId', showUpcomingProj);


export default router;
