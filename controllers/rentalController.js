const { Book, Rental } = require('../models');
const { Op } = require('sequelize');

exports.rentBook = async (req, res) => {
    const { book_id } = req.params;
    const { startDate, endDate } = req.body;

    try {
        const userId = req.session.userId;

        if (!userId) {
            req.flash('error_msg', 'User is not authenticated.');
            throw new Error("User is not authenticated.");
        }

        const book = await Book.findByPk(book_id);
        if (!book) {
            req.flash('error_msg', 'Book not found.');
            throw new Error("Book not found.");
        }

        const rentalConflict = await Rental.findOne({
            where: {
                book_id: book_id,
                [Op.or]: [
                    { start_date: { [Op.between]: [startDate, endDate] } },
                    { end_date: { [Op.between]: [startDate, endDate] } },
                    { [Op.and]: [
                        { start_date: { [Op.lte]: startDate } },
                        { end_date: { [Op.gte]: endDate } }
                    ]}
                ]
            }
        });

        if (rentalConflict) {
            req.flash('error_msg', 'The book is already rented for the specified period.');
            throw new Error("The book is already rented for the specified period.");
        }

        await Rental.create({
            user_id: userId,
            book_id: book_id,
            start_date: startDate,
            end_date: endDate
        });

        req.flash('success_msg', 'Book rented successfully');
        res.redirect('/my-rentals');
    } catch (error) {
        console.error('Error renting book:', error.message);
        req.flash('error_msg', error.message);
        res.redirect('/books/allBooks');
    }
};

exports.myRentals = async (req, res) => {
    try {
        if (!req.session.userId) {
            req.flash('error_msg', 'User is not authenticated.');
            throw new Error("User is not authenticated.");
        }

        const userId = req.session.userId;

        const rentals = await Rental.findAll({
            where: { user_id: userId },
            include: [Book]
        });

        // Convert date fields to JavaScript Date objects
        rentals.forEach(rental => {
            rental.start_date = new Date(rental.start_date);
            rental.end_date = new Date(rental.end_date);
        });

        res.render('rentals/myRentals', { rentals });
    } catch (error) {
        console.error('Error fetching rental history:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

exports.returnBook = async (req, res) => {
    const { rentalId } = req.params;
    console.log(rentalId);
    try {
        if (!req.session.userId) {
            req.flash('error_msg', 'User is not authenticated.');
            throw new Error("User is not authenticated.");
        }

        const rental = await Rental.findByPk(rentalId);
        if (!rental) {
            req.flash('error_msg', 'Rental not found.');
            throw new Error("Rental not found.");
        }

        if (rental.user_id !== req.session.userId) {
            req.flash('error_msg', 'Unauthorized.');
            throw new Error("Unauthorized.");
        }

        await Rental.destroy({
            where: {
                id: rentalId
            }
        })

        req.flash('success_msg', 'Book returned successfully');
        console.log('Book returned successfully');
        res.redirect('/my-rentals');
    } catch (error) {
        console.error('Error returning book:', error.message);
        req.flash('error_msg', error.message);
        res.redirect('/my-rentals');
    }
};
