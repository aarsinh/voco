import express from 'express';
import { registerProject, unregisterProject, showRegisteredProj, showUpcomingProj } from '../../controllers/volunteer.controller';

const router = express.Router();

router.get('/:volunteerId', showUpcomingProj);

router.get('/registered/:volunteerId', showRegisteredProj);

router.post('/register', registerProject);

router.post('/unregister', unregisterProject);

export default router;