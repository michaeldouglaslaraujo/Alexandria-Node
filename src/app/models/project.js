const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const ProjectSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'user',
            require: true,
        },
        task: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
        }],
        createdAt:
        {
            type: Date,
            default: Date.now,
        },        
    }
);

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;