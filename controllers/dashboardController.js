exports.dashboard = (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/auth/login');
    }
    res.render('dashboard', {
        user: req.session.user
    });
};

exports.index = (req, res) => {
    res.render('welcomePage');
};