import express from 'express';
const router = express.Router();
import Project from "../models/project.model"

router.get('/', (req, res) => {
  Project.find()
    .then(projects => res.json(projects))
    .catch(e => res.status(404).json({ projectsnotfound: 'Projects not found' }));
});

export default router;

