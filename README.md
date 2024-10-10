# Book Nest - Book Rental System

### Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [File Uploads](#file-uploads)
- [Contributing](#contributing)
- [License](#license)

## Project Overview
**Book Nest** is a full-stack web application that allows users to rent books from each other. Users can register, manage their books, and browse available books for rent. The system supports file uploads for book thumbnails and galleries, and it ensures that books are not double-booked for the same period. After renting a book, users can rate and review it.

## Features

1. **User Authentication**
   - Register, log in, and reset password functionality.
   - Users can securely register with a username, email, and password.

2. **User Management**
   - Dashboard for users to manage their books and rentals.
   - Add, edit, and delete books from the collection.
   - View available books for rent (excluding the user's own books).

3. **Book Rental System**
   - Rent books for a specific period, with validation to avoid double bookings.
   - Rental history for each user, displaying rented books and rental periods.
   - Users can rate and review books they’ve rented, and other users can view these reviews.

4. **File Uploads**
   - Upload a thumbnail image and a gallery of images for each book.
   - File handling using Multer, storing images in the `/public/uploads/` directory.

5. **Database Design**
   - A relational database structure using Sequelize ORM with MySQL (or another relational database).
   - Relationships: Users, Books, BookImages, Rentals, Ratings, and Reviews.

6. **EJS Views**
   - User authentication (register/login/reset password).
   - Dashboard with book management and rental history.
   - Available books, including ratings and reviews.

7. **Routing**
   - Authentication, book CRUD operations, renting, rating, and reviewing books.

## Technologies Used
- **Backend**: Node.js, Express.js, Sequelize ORM
- **Frontend**: EJS for templating
- **Database**: MySQL/PostgreSQL (or any other relational DB)
- **Authentication**: Passport.js for user login and registration
- **File Uploads**: Multer for handling file uploads
- **CSS Framework**: Bootstrap for styling

## Installation

To get a local copy of the project up and running, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/book-nest.git
   ```

2. **Install dependencies:**
   ```bash
   cd book-nest
   npm install
   ```

3. **Set up the database:**
   - Configure your database settings in `config/config.json`.
   - Run the migrations to set up the database schema:
   ```bash
   npx sequelize db:migrate
   ```

4. **Run the app:**
   ```bash
   npm start
   ```

## Usage

- Register a new account.
- Log in and access the dashboard.
- Add books to your collection, including a thumbnail and a gallery of images.
- Browse available books and rent them for a specified period.
- After renting, leave a review and rating for the book.

## Database Schema

The schema follows a relational model with the following main tables:

- **Users:** Stores user information (username, email, password).
- **Books:** Stores book details (title, author, description, user_id).
- **BookImages:** Stores paths to book images associated with books.
- **Rentals:** Tracks which user rented which book and for what period.
- **Ratings:** Stores user ratings and reviews for books.

## File Uploads

Multer is used for handling image uploads. Thumbnails and galleries are stored in `/public/uploads/` and are associated with each book.

## Contributing

Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.
