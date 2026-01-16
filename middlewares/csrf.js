const csrf = require("csurf");

// sadece bu middleware çağrıldığında çalışır
const csrfProtection = csrf();

module.exports = (req, res, next) => {
    csrfProtection(req, res, () => {
        res.locals.csrfToken = req.csrfToken();
        next();
    });
};
