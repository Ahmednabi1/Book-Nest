const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const User = require('../models/User');
const bookController = require('../controllers/bookController');
const upload = require('../middleware/multerConfig'); 

router.get('/books/allBooks',bookController.getAllBooks);

router.get('/books/addBooks', bookController.renderAddBookPage);

router.post('/books/addBooks', upload, bookController.addBook);

router.get('/myBooks', bookController.myBooks);


router.get('/books/edit/:book_id', bookController.editBookForm);

router.post('/books/edit/:book_id', bookController.editBook);

router.post('/books/delete/:book_id', bookController.deleteBook);

router.get('/rent/:book_id', async (req, res) => {
    const { book_id } = req.params;
    
    try {
        const book = await Book.findByPk(book_id);
        if (!book) {
            req.flash('error_msg', 'Book not found.');
            return res.status(404).send('Book not found');
        }
        res.render('rentals/rentBook', { book });
    } catch (error) {
        console.error('Error fetching book:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
