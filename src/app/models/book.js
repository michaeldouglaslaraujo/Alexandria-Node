const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const BookSchema = new mongoose.Schema(
    {
        title:
        {
            type: String,
            require: true,
        },
        description:
        {
            type: String,
        },
		cover:
		{
			type: String,
			require: true,
		},		
		status:
        {
            type: String,
            require: true,
        }, 
		publisher:
        {
            type: String,
            require: true,
        }, 
		category:
        [{
            type: String,
            require: true,
        }], 
		publishedDate:
        {
            type: Date,
			require: true,

        },        
        authors:
		[{
            type: String,
        }],
		pageCount:
		{
            type: Number,
        },		
        isbn:
		{
            type: String,
            require: true,
        },		
		pageRead:
		{
            type: String,
            require: false,
        },		
		recommended:
		{
            type: String,
			require: false,
        },		
		bookcase:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bookcase',
            require: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
            require: true,
        },
        completed: {
            type: Boolean,
            require: true,
            default: false,
        },
        createdAt:
        {
            type: Date,
            default: Date.now,
        },        
    }
);

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;