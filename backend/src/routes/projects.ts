const express = require('express');
const router = express.Router();

const Project = require('../../models/Projects');

router.get('/', (req, res) => {
    Project.find()
        .then(projects => res.json(projects))
        .catch(e => res.status(404).json({projectsnotfound: 'Projects not found'}));
});

module.exports = router;
