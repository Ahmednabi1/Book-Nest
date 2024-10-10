const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/database');
const flash = require('connect-flash');
const cookieParser=require('cookie-parser')
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const bookRoutes = require('./routes/bookRoutes');
const rentalRoutes = require('./routes//rentalRoutes');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));
app.use(cookieParser())
app.use(
    session({
        resave : false,
        saveUninitialized : false,
        secret : 'your-secret-key',
        cookie : {
            secure : false,
        }
    })
)

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.use('/auth', authRoutes);
app.use(dashboardRoutes);
app.use(bookRoutes);
app.use(rentalRoutes);
// Root route
app.get('/', (req, res) => {
    res.redirect('/index');
});

sequelize.sync()
    .then(result => {
        app.listen(3000, () => console.log('Server started on http://localhost:3000'));
    })
    .catch(err => console.log(err));
