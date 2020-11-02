const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const BookcaseSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'user',
            require: true,
        },
        book: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
        }],
        createdAt:
        {
            type: Date,
            default: Date.now,
        },        
    }
);

const Bookcase = mongoose.model('Bookcase', BookcaseSchema);

module.exports = Bookcase;