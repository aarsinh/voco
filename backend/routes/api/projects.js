const express = require('express');
const router = express.Router();

const Project = require('../../models/Projects');

router.get('/', (req, res) => {
    Project.find()
        .then(projects => res.json(projects))
        .catch(e => res.status(404).json({projectsnotfound: 'Projects not found'}));
});

router.post('/', (req, res) => {
    Project.findByIdAndUpdate(req.params.id, req.body)
        .then(_ => res.json({msg: 'Count incremented'}))
        .catch(_ => res.status(400).json({error:'Unable to register'}));
});

module.exports = router;