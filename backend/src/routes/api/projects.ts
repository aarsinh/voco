import express from 'express';
import Project from '../../models/projects.model'

const router = express.Router();

router.get('/', (req, res) => {
    Project.find()
        .then(projects => res.json(projects))
        .catch(e => res.status(404).json({projectsnotfound: 'Projects not found'}));
});

export default router;