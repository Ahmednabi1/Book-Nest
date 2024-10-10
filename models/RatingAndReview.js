const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Book = require('./Book');

class RatingAndReview extends Model {}

RatingAndReview.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Books',
            key: 'id'
        }
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    review: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'RatingAndReview',
    tableName: 'RatingsAndReviews',
    timestamps: false
});

User.hasMany(RatingAndReview, { foreignKey: 'user_id' });
Book.hasMany(RatingAndReview, { foreignKey: 'book_id' });
RatingAndReview.belongsTo(User, { foreignKey: 'user_id' });
RatingAndReview.belongsTo(Book, { foreignKey: 'book_id' });

module.exports = RatingAndReview;
