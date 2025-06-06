export const isloggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}
export const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
    }
    next();
}