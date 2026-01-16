module.exports = (req, res, next) => { //Login olmadan girişi engelleme 
    if (!req.session.isAuth) {
        return res.redirect("/account/login?returnUrl=" + req.url); 
    }
    next();
}