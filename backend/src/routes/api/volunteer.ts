import express from 'express';
import Project from '../../models/projects.model'
import Volunteer from '../../models/volunteers.model'
import { registerProject, unregisterProject } from '../../controllers/volunteer.controller';

const router = express.Router();

router.get('/', (req, res) => {
    Project.find()
        .then(projects => res.json(projects))
        .catch(e => res.status(404).json({projectsnotfound: 'Projects not found'}));
});

router.get('/registered/:volunteerId', async (req, res) => {
    const { volunteerId } = req.params;
    const volunteer = await Volunteer.findById(volunteerId).populate('registeredProjects');
    if(!volunteer){
        return res.status(404).json({message: 'Volunteer not found'});
    }
    res.json(volunteer.registeredProjects);
})

router.post('/register', registerProject);

router.post('/unregister', unregisterProject);

export default router;