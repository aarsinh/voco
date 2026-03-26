import express from 'express';
import { registerProject, unregisterProject, showRegisteredProj, showUpcomingProj, UpdatePreferences, GetPreferences } from '../controllers/volunteer.controller';

const router = express.Router();

router.get('/:volunteerId', showUpcomingProj);
router.get('/registered/:volunteerId', showRegisteredProj);
router.get('/preferences/:volunteerId', GetPreferences);
router.put('/preferences', UpdatePreferences)
router.post('/register', registerProject);
router.post('/unregister', unregisterProject);

export default router;
