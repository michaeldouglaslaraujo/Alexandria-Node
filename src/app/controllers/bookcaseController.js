const express = require('express');
const authMiddleware = require('../middlewares/auth')

const Bookcase = require('../models/bookcase');
const Book = require('../models/book');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async(req, res) => {    
    try {
        const bookcases = await Bookcase.find().populate('user');

        return res.send({ bookcases });

    } catch (err) {
        return res.status(412).send({ error: 'Error Loading Bookcase' });
    }
});

router.get('/:bookcaseId', async (req, res) => {
    try {
        const bookcase = await Bookcase.findById(req.params.bookcaseId).populate('user');

        return res.send({ bookcase });

    } catch (err) {
        return res.status(412).send({ error: 'Error Loading Bookcase' });
    }
});

router.post('/', async (req, res) => {  
    console.log(req.body);
    try{
        
    const {title, description, book} = req.body;
    console.log(req.body);

    const bookcase = await Bookcase.create({title, description, user: req.userId});
    console.log(bookcase);

    await bookcase.save();
    console.log(bookcase);
    return res.send({ bookcase });

}catch{
    return res.status(412).send({ error: 'Error creating New Bookcase'});
}

});

router.put('/:bookcaseId', async (req, res) => {
    try{
        
        const book = req.body;
        //console.log("Req.body", req.body);
    
        let bookcase = await Bookcase.findOne({_id: req.params.bookcaseId}).populate('book');
        //console.log("Params", req.params.bookcaseId);
        //console.log("Bookcase", bookcase);
        if(book){
            console.log('BOOK/ISBN', book.isbn);
            const isbn = bookcase.book.find(item => item.isbn === book.isbn);
            console.log('ISBN:', isbn);

          if(!isbn)
          {
            const bookBookcase = Book({ ... book, bookcase: req.params.bookcaseId});

            await bookBookcase.save();
    
            bookcase.book.push(bookBookcase);
    
            await bookcase.save();
            return res.send({ bookcase });
          } else {
            return res.status(412).send({ error: ' Book already inclused in this Bookcase'});
          }
        };
    
    } catch (err) {
        console.log(err);
        return res.status(422).send({ error: 'Error included Book in a Bookcase'});
    }
    
});


//metdodo de histórico de leitura
router.put('/:bookcaseId/:bookId', async (req, res) => {
    try{
        
        const book = req.body;
        
        let bookcase = await Bookcase.findOne({_id: req.params.bookcaseId}).populate('book');
        
        if(book){
            
            const isbn = bookcase.book.find(item => item.isbn === book.isbn);
            
          if(isbn)
          {
            const bookBookcase = Book({ ... book, bookcase: req.params.bookcaseId});

            await bookBookcase.save();
     //Ajustar atualização
            bookcase.book.push(bookBookcase);
    
            await bookcase.save();
            return res.send({ bookcase });  
          } else {
            return res.status(412).send({ error: ' Book already inclused in this Bookcase'});
          }
        };
    
    } catch (err) {
        console.log(err);
        return res.status(422).send({ error: 'Error updating book reading history'});
    }
    
});



router.delete('/:bookcaseId', async (req, res) => {
    try {
        await Bookcase.findByIdAndRemove(req.params.bookcaseId);

        return res.send();

    } catch (err) {
        return res.status(412).send({ error: 'Error deleting bookcase' });
    }
});

module.exports = app => app.use('/bookcases', router);