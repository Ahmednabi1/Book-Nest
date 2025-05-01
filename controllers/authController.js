const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

exports.registerUser = async (req, res) => {
    const { name, email, password, confirmPassword, phone, age } = req.body;

    // Validation functions
    const sendError = (message) => {
        if (req.xhr) {
            return res.status(400).json({ error: message });
        }
        req.flash('error_msg', message);
        return res.redirect('/auth/signup');
    };

    const sendSuccess = (message) => {
        if (req.xhr) {
            return res.status(200).json({ success: message, redirect: '/auth/login' });
        }
        req.flash('success_msg', message);
        return res.redirect('/auth/login');
    };

    // Validation checks
    if (!name || !email || !password || !confirmPassword || !phone || !age) {
        return sendError('Please enter all fields');
    }

    if (!passwordValidationRegex.test(password)) {
        return sendError(
            'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number.'
        );
    }

    if (password !== confirmPassword) {
        return sendError('Passwords do not match');
    }

    if (age && (isNaN(age) || age < 0 || age > 120)) {
        return sendError('Invalid age.');
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (user) {
            return sendError('Email is already registered');
        }
        // Check if the phone number is already registered
        const existingUser = await User.findOne({ where: { phone } });
        if (existingUser) {
            return sendError('Phone number is already registered');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            age,
        });

        return sendSuccess('You are now registered and can log in');
    } catch (err) {
        console.error(err);
        return sendError('Something went wrong. Please try again.');
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    const sendError = (message) => {
        if (req.xhr) {
            return res.status(400).json({ error: message });
        }
        req.flash('error_msg', message);
        return res.redirect('/auth/login');
    };

    const sendSuccess = (message) => {
        if (req.xhr) {
            return res.status(200).json({ success: message, redirect: '/dashboard' });
        }
        req.flash('success_msg', message);
        return res.redirect('/dashboard');
    };

    if (!email || !password) {
        return sendError('Please enter all fields');
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return sendError('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendError('Invalid password, please try again.');
        }

        req.session.userId = user.id;
        return sendSuccess('You are now logged in');
    } catch (err) {
        console.error(err);
        return sendError('Something went wrong. Please try again.');
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
                pass: 'lpev enam mwtw fhjl'
            }
        });

        const mailOptions = {
            to: user.email,
            from: '"Book Nest, Password Reset"',
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested to reset the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            http://${req.headers.host}/auth/reset/${token}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions);

        req.flash('info', `An e-mail has been sent to ${user.email} with further instructions.`);
        // res.redirect('/auth/login');
        res.send('An e-mail has been sent to ' + user.email + ' with further instructions.');
    } catch (error) {
        console.error('Error handling forgot password:', error);
        res.redirect('/auth/forgot-password');
    }
};

exports.resetPassword = async (req, res) => {
    const { password, confirmPassword } = req.body;
  
    const sendError = (message) => {
      if (req.xhr) {
        return res.status(400).json({ error: message });
      }
      req.flash('error_msg', message);
      return res.redirect(`/auth/reset/${req.params.token}`);
    };
  
    const sendSuccess = (message) => {
      if (req.xhr) {
        return res.status(200).json({ success: message, redirect: '/auth/login' });
      }
      req.flash('success_msg', message);
      return res.redirect('/auth/login');
    };
  
    if (password !== confirmPassword) {
      return sendError('Passwords do not match.');
    }
  
    const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordValidationRegex.test(password)) {
      return sendError('Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number.');
    }
  
    try {
      const user = await User.findOne({
        where: {
          resetPasswordToken: req.params.token,
          resetPasswordExpires: { [Op.gt]: Date.now() }
        }
      });
  
      if (!user) {
        return sendError('Password reset token is invalid or has expired.');
      }
  
      user.password = await bcrypt.hash(password, 12);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
  
      return sendSuccess('Password has been updated.');
    } catch (error) {
      console.error('Error resetting password:', error);
      return sendError('Failed to reset password. Please try again.');
    }
  };
  