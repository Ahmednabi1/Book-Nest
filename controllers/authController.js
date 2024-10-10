const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

exports.registerUser = async (req, res) => {
    const { name, email, password, confirmPassword, phone, age } = req.body;

    if (!name || !email || !password || !confirmPassword || !phone || !age) {
        req.flash('error_msg', 'Please enter all fields');
        return res.redirect('/auth/register');
    }

    if (!passwordValidationRegex.test(password)) {
        req.flash('error_msg', 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number.');
        return res.redirect('/auth/register');
    }

    if (password !== confirmPassword) {
        req.flash('error_msg', 'Passwords do not match');
        return res.redirect('/auth/register');
    }

    if (age && (isNaN(age) || age < 0 || age > 120)) {
        req.flash('error_msg', 'Invalid age.');
        return res.redirect('/auth/register');
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (user) {
            req.flash('error_msg', 'Email is already registered');
            return res.redirect('/auth/register');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            age
        });

        setTimeout(() => {
            req.flash('success_msg', 'You are now registered and can log in');
            res.redirect('/auth/login');
        }, 2000);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Something went wrong. Please try again.');
        res.redirect('/auth/login');
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        req.flash('error_msg', 'Please enter all fields');
        return res.redirect('/auth/login');
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            req.flash('error_msg', 'Invalid email or password');
            return res.redirect('/auth/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error_msg', 'Invalid password, please try again.');
            return res.redirect('/auth/login');
        }

        req.session.userId = user.id;
        req.flash('success_msg', 'You are now logged in');
        res.redirect('/dashboard'); 
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Something went wrong. Please try again.');
        res.redirect('/auth/login');
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard');
        }
        res.redirect('/auth/login');
    });
};

exports.forgetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            req.flash('error_msg', 'No account with that email found.');
            return res.redirect('/auth/forgot-password');
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'ahmed.nabil.4426@gmail.com',
                pass: 'epfp fiar bwim tqid'
            }
        });

        const mailOptions = {
            to: user.email,
            from: 'passwordreset@demo.com',
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested to reset the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            http://${req.headers.host}/auth/reset/${token}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions);

        req.flash('info', `An e-mail has been sent to ${user.email} with further instructions.`);
        res.redirect('/auth/login');
    } catch (error) {
        console.error('Error handling forgot password:', error);
        res.redirect('/auth/forgot-password');
    }
};

exports.resetPassword = async (req, res) => {
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        req.flash('error_msg', 'Passwords do not match.');
        return res.redirect(`/auth/reset/${req.params.token}`);
    }

    const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordValidationRegex.test(password)) {
        req.flash('error_msg', 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number.');
        return res.redirect(`/auth/reset/${req.params.token}`);
    }

    try {
        const user = await User.findOne({
            where: {
                resetPasswordToken: req.params.token,
                resetPasswordExpires: { [Op.gt]: Date.now() }
            }
        });

        if (!user) {
            req.flash('error_msg', 'Password reset token is invalid or has expired.');
            return res.redirect('/auth/forgot-password');
        }

        user.password = await bcrypt.hash(password, 12);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        req.flash('success_msg', 'Password has been updated.');
        res.redirect('/auth/login');
    } catch (error) {
        console.error('Error resetting password:', error);
        res.redirect('/auth/forgot-password');
    }
};