module.exports = function (req, res, next) {
  res.locals.isAuth = req.session.isAuth; // Session’daki isAuth bilgisini tüm EJS view’lara gönderir
  res.locals.fullname = req.session.fullname;
  next(); // Bir sonraki middleware’e geçer
}