module.exports = function(req, res, next) {
    if (!req.cookies || !req.cookies.user) {
        res.redirect('/login?returnUrl='+req.url)
        return
    }
    res.locals.user = req.user = req.cookies.user;
    console.log(req.user);
    next();
};
