const mongoose = require('../database');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
    {
        name:
        {
            type: String,
            require: true,
        },
        email:
        {
            type: String,
            unique: true,
            require: true,
            lowercase: true,
        },
        cpf:
        {
            type: String,
            require: true,
        },
        dataDeNascimento:
        {
            type: Date,
            require: true,
        },
        genero:
        {
            type: String,
            require: true,
        },
        password:
        {
            type:  String,
            required: true,
            select: false,
        },
        createdAt:
        {
            type: Date,
            default: Date.now,
        },        
    }
);

UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

const User = mongoose.model('user', UserSchema);

module.exports = User;