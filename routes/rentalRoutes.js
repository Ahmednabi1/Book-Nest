const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const Book = require('../models/Book');
const RatingAndReview = require('../models/RatingAndReview');


router.post('/books/rent/:book_id', rentalController.rentBook);

router.get('/my-rentals', rentalController.myRentals);

router.post('/rentals/return/:rentalId', rentalController.returnBook);

//_____________________________________________________________
router.get('/rentals/rate/:book_id', async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.book_id);
        if (!book) {
            req.flash('error_msg', 'Book not found.');
            return res.status(404).send('Book not found');
        }
        res.render('rentals/rateBook', { book });
    } catch (error) {
        console.error('Error fetching book:', error.message);
        res.status(500).send('Internal Server Error');
    }
});




router.post('/rentals/rate/:book_id', async (req, res) => {
    try {
        const { rating, review } = req.body;
        const userId = req.session.userId;
        const bookId = req.params.book_id;

        if (!userId) {
            req.flash('error_msg', 'You must be logged in to leave a review.');
            return res.status(403).send('You must be logged in to leave a review.');
        }

        await RatingAndReview.create({
            user_id: userId,
            book_id: bookId,
            rating,
            review
        });

        req.flash('success_msg', 'Rating and review submitted successfully');
        res.redirect('/my-rentals');
    } catch (error) {
        console.error('Error submitting rating and review:', error.message);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;