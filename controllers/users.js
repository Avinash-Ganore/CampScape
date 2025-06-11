const User = require('../models/user');
module.exports.getRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try {
        const {email, username, password} = req.body;
        const user = await new User({username, email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Successfully registered!');
            res.redirect('/campgrounds');
        })
    }
    catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.getLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if(err) return next(err);
        req.flash('success', 'Goodbye!!');
        res.redirect('/campgrounds');
    });  
}