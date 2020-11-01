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
    console.log(req.body);
    try{
    //const { title, description, tasks } = req.body;
    //const project = await Project.create({ title, description, user: req.userId });

    const {title, description, task} = req.body;
    console.log(req.body);

    const project = await Project.create({title, description, user: req.userId});
    console.log(project);

    
    await project.save();
    console.log(project);
    return res.send({ project });
    console.log(project);
}catch{
    return res.status(412).send({ error: 'Error creating New Project'});
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