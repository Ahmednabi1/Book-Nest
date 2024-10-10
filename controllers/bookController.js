const Book = require('../models/Book');
const Rental = require('../models/Rental');
const User = require('../models/User');
const BookImage = require('../models/BookImage');
const { Op,fn,col } = require('sequelize');
const RatingAndReview = require('../models/RatingAndReview');
const sequelize = require('../config/database');

exports.getAllBooks = async (req, res) => {
    try {
        if (!req.session.userId) {
            req.flash('error_msg', 'User is not authenticated.');
            throw new Error("User is not authenticated.");
        }

        const userId = req.session.userId; 
        const books = await Book.findAll({
            where: {
                user_id: { [Op.ne]: userId } 
            },
            include: [
                {
                    model: User,
                    attributes: ['name']
                },
                {
                    model: RatingAndReview,
                    attributes: ['rating', 'review'],
                    include: [{ model: User, attributes: ['name'] }] // Include reviewer's name
                },
                {
                    model: BookImage, // Include images for the book gallery
                    attributes: ['image_path']
                }
            ]
        });

        books.forEach(book => {
            const ratings = book.RatingAndReviews;
            if (ratings.length > 0) {
                const total = ratings.reduce((sum, review) => sum + review.rating, 0);
                book.averageRating = (total / ratings.length).toFixed(1); // Set avg rating
            } else {
                book.averageRating = 'No ratings yet';
            }
        });

        res.render('books/allBooks', { books });
    } catch (error) {
        console.error('Error fetching books:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

exports.renderAddBookPage = (req, res) => {
    res.render('books/addBook');
};

exports.addBook = async (req, res) => {
    const { title, author, description } = req.body;
    let thumbnail = req.files && req.files.thumbnail ? `uploads/${req.files.thumbnail[0].filename}` : null;

    try {
        if (!req.session.userId) {
            req.flash('error_msg', 'User is not authenticated.');
            throw new Error("User is not authenticated.");
        }

        const userId = req.session.userId;

        const book = await Book.create({
            user_id: userId,
            title,
            author,
            description,
            thumbnail_path: thumbnail,
        });

        if (req.files && req.files.gallery) {
            const galleryImages = req.files.gallery.map(file => ({
                book_id: book.id,
                image_path: `uploads/${file.filename}`
            }));
            await BookImage.bulkCreate(galleryImages);
        }

        req.flash('success_msg', 'Book added successfully');
        res.redirect('/books/allBooks');
    } catch (error) {
        console.error('Error adding book:', error.message);
        req.flash('error_msg', 'Failed to add book. Please try again.');
        res.redirect('/books/addBooks');
    }
};


exports.myBooks = async (req, res) => {
    try {
        if (!req.session.userId) {
            req.flash('error_msg', 'User is not authenticated.');
            throw new Error("User is not authenticated.");
        }

        const userId = req.session.userId;

        const books = await Book.findAll({
            where: { user_id: userId }
        });

        res.render('books/myBooks', { books });
    } catch (error) {
        console.error('Error fetching user books:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

exports.editBookForm = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.book_id);
        if (!book || book.user_id !== req.session.userId) {
            req.flash('error_msg', 'You are not authorized to edit this book.');
            return res.status(403).send('You are not authorized to edit this book.');
        }
        res.render('books/editBook', { book });
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Handle editing a book
exports.editBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.book_id);
        if (!book || book.user_id !== req.session.userId) {
            req.flash('error_msg', 'You are not authorized to edit this book.');
            return res.status(403).send('You are not authorized to edit this book.');
        }
        await book.update({
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
        });
        req.flash('success_msg', 'Book updated successfully');
        res.redirect('/myBooks');
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.book_id);
        if (!book || book.user_id !== req.session.userId) {
            req.flash('error_msg', 'You are not authorized to delete this book.');
            return res.status(403).send('You are not authorized to delete this book.');
        }
        await book.destroy();
        req.flash('success_msg', 'Book deleted successfully');
        res.redirect('/myBooks');
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).send('Internal Server Error');
    }
};