const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../../config/auth.json');

const User = require('../models/user');

const router = express.Router();

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn:259200,
    });
};

//api/user/signup
router.post('/signup', async (req,res) =>
{
    const { email } = req.body;

    try{

        if(await User.findOne({ email }))
        return res.status(422).send({ error:'User already exists'});

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({ 
            user,
            token: generateToken({ id: user.id }), 
        });        
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed'});
    }
});

//api/user/login
router.post('/login', async (req,res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user)
        return res.status(412).send({error: 'User not found' });

    if(!await bcrypt.compare(password, user.password))
        return res.status(412).send({ error: 'Invalid Password' });

    user.password = undefined;

    const token = 

    res.send({ 
        user, 
        token: generateToken({ id: user.id }),
     });
});

router.get('/login', async (req,res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user)
        return res.status(412).send({error: 'User not found' });

    if(!await bcrypt.compare(password, user.password))
        return res.status(412).send({ error: 'Invalid Password' });

    user.password = undefined;

    const token = 

    res.send({ 
        user, 
        token: generateToken({ id: user.id }),
     });
});
module.exports = app => app.use('/api/user', router); 

//api/user/updateuser/$(id)
