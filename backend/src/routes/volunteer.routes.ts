import express from 'express';
import { registerProject, unregisterProject, showRegisteredProj, showUpcomingProj, updateTaskStatus } from '../controllers/volunteer.controller';

const router = express.Router();

router.get('/:volunteerId', showUpcomingProj);

router.get('/registered/:volunteerId', showRegisteredProj);

router.post('/register', registerProject);

router.post('/unregister', unregisterProject);

router.post('/changeStatus', updateTaskStatus);

export default router;