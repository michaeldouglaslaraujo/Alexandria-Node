const express = require('express');
const authMiddleware = require('../middlewares/auth')

const Bookcase = require('../models/bookcase');
const Book = require('../models/book');
const { pipeline } = require('nodemailer/lib/xoauth2');
const bookcaseController = require('./bookcaseController');

const router = express.Router();
router.use(authMiddleware);


router.get('/top10', async(req, res) => {    
    try {
        
        //const book = await Book.find({recommended: { $eq : 1}}).limit(10).populate('book');
        //const book = await Book.distinct("isbn").populate('book');
        //const like = await Book.aggregate([{'$group': {'_id': '$isbn', 'likes': {'$sum': 'recommended'}}}]).sort({recommended:1});
        //const like = book.aggregate([{'$group': {'_id': '$isbn', 'likes': {'$sum': 'recommended'}}}]).sort({recommended:1});
 
        
        const likes = await Book.aggregate(
        [
            {'$project':
                {'title': 1, 'description': 1, 'publisher': 1,'category': 1, 'publishedDate': 1, 'authors': 1, 'pageCount': 1, 'isbn': 1, 'recommended': 1, 'completed': 1, 'createdAt': 1}
            }, 
            {'$match': 
                {'recommended': {'$gte': 1}}
            },
            {'$group':
                {
                    '_id': '$isbn', 
                    'Likes':{'$sum': '$recommended'}
                }
            },
            {'$sort': {'Likes': -1}},
            {'$limit': 10},
        ]
    );
        
    const book = await Book.find(item => likes.isbn === Book.isbn).populate("book");
    console.log(book);

        return res.send({likes, book});
    } catch (err) {
        return res.status(412).send({ error: 'Error Query' });
    }
});


router.get('/bottom10', async(req, res) => {    
    try {
        
        //const book = await Book.find({recommended: { $eq : 1}}).limit(10).populate('book');
        //const book = await Book.distinct("isbn").populate('book');
        //const like = await Book.aggregate([{'$group': {'_id': '$isbn', 'likes': {'$sum': 'recommended'}}}]).sort({recommended:1});
        //const like = book.aggregate([{'$group': {'_id': '$isbn', 'likes': {'$sum': 'recommended'}}}]).sort({recommended:1});
 
        
        const likes = await Book.aggregate(
        [
            {'$project':
                {'title': 1, 'description': 1, 'publisher': 1,'category': 1, 'publishedDate': 1, 'authors': 1, 'pageCount': 1, 'isbn': 1, 'recommended': 1, 'completed': 1, 'createdAt': 1}
            }, 
            {'$match': 
                {'recommended': {'$lte': -1}}
            },
            {'$group':
                {
                    '_id': '$isbn', 
                    'Likes':{'$sum': '$recommended'}
                }
            },
            {'$sort': {'Likes': 1}},
            {'$limit': 10},
        ]
    );
        
    const book = await Book.find(item => likes.isbn === Book.isbn).populate("book");
    console.log(book);

        return res.send({likes, book});
    } catch (err) {
        return res.status(412).send({ error: 'Error Query' });
    }
});
  

module.exports = (app) => app.use('/api/query', router);