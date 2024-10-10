const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class Book extends Model {}

Book.init({
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
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    thumbnail_path: {
        type: DataTypes.STRING
    },
    rented: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Book',
    tableName: 'Books',
    timestamps: false
});

User.hasMany(Book, { foreignKey: 'user_id' });
Book.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Book;
