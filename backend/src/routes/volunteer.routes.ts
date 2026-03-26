import express from 'express';
import { registerProject, unregisterProject, showRegisteredProj, showUpcomingProj, updateTaskStatus } from '../controllers/volunteer.controller';

const router = express.Router();

router.get('/registered/:volunteerId', showRegisteredProj);

router.get('/:volunteerId', showUpcomingProj);

router.post('/register', registerProject);

router.post('/unregister', unregisterProject);

router.patch('/changeStatus', updateTaskStatus);

export default router;