const express = require('express');
const authMiddleware = require('../middlewares/auth')

const Project = require('../models/Project');
const Task = require('../models/Task');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async(req, res) => {
    try {
        const projects = await Project.find().populate('user');

        return res.send({ projects });

    } catch (err) {
        return res.status(412).send({ error: 'Error Loading projects' });
    }
});

router.get('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate('user');

        return res.send({ project });

    } catch (err) {
        return res.status(412).send({ error: 'Error Loading project' });
    }
});

router.post('/', async (req, res) => {
    try{
        const project = await Project.create({ ...req.body, user: req.userId});

        return res.send({ project });
    } catch (err) {
        return res.status(412).send({ error: 'Error Creating new project' })
    }

});

router.put('/:projectId', async (req, res) => {
    res.send({ user: req.userId });
});

router.delete('/:projectId', async (req, res) => {
    try {
        await Project.findByIdAndRemove(req.params.projectId);

        return res.send();

    } catch (err) {
        return res.status(412).send({ error: 'Error deleting project' });
    }
});

module.exports = app => app.use('/projects', router);