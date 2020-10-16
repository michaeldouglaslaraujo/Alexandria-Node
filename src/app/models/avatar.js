const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const AvatarSchema = new mongoose.Schema(
    {
        name:
        {
            type: String,
            require: true,
        },
        literary_genre:
        {
            type: String,
            require: true,
        },
        link: {
            type: String,
            require: true,
        },  
    }
);


const Avatar = mongoose.model('Avatar', AvatarSchema);

module.exports = Avatar;