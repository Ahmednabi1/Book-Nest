const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Book = require('./Book');

const BookImage = sequelize.define('BookImage', {
    image_path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'BookImage',
    tableName: 'BookImages',
    timestamps: false
});

BookImage.belongsTo(Book, { foreignKey: 'book_id' });
Book.hasMany(BookImage, { foreignKey: 'book_id' });

module.exports = BookImage;
