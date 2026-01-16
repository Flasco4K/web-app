const User = require("../models/user")
const bcrypt = require("bcrypt");
const emailService = require("../helpers/send-mail");
const config = require("../config");
const ctypto = require("crypto");
const { Op } = require("sequelize");

exports.get_register = async function (req, res) {
    try {
        return res.render("auth/register", { // Register (kayıt) sayfasını kullanıcıya render eder
            title: "register" // View içine gönderilen başlık değişkeni
        });
    }
    catch (err) { // Sayfa render edilirken bir hata olursa console'a yazdırır
        console.log(err);
    }
}

exports.post_register = async function (req, res) {
    const name = req.body.name;     // Formdan gelen kullanıcı adını alır
    const email = req.body.email; // Formdan gelen email bilgisini alır
    const password = req.body.password; // Formdan gelen şifreyi alır

    const hashedPassword = await bcrypt.hash(password, 10); // Şifreyi bcrypt ile hash'ler GİZLER (10 = güvenlik seviyesi)

    try {
        const user = await User.findOne({ where: { email: email } });
        if (user) {
            req.session.message = { text: "Girdiğiniz E-Mail Adresiyle Kayıt Olunmuş.", class: "warning" };
            return res.redirect("login");
        }
        const newUser = await User.create({ //User modeli üzerinden veritabanına yeni bir kullanıcı kaydı ekler
            fullname: name,
            email: email,
            password: hashedPassword
        });

        emailService.sendMail({
            from: config.email.from,
            to: newUser.email,
            subject: "Hesabınız Oluşturuldu",
            text: "Hesabınız Başarılı Bir Şekilde Oluşturuldu"
        })

        req.session.message = { text: "Hesabınıza Giriş Yapabilirsiniz.", class: "success" };

        return res.redirect("login"); // Kayıt başarılı olursa kullanıcıyı login sayfasına yönlendirir
    }
    catch (err) { // Kayıt sırasında hata olursa hatayı console'a yazdırır
        console.log(err)
    }
}

exports.get_login = async function (req, res) {
    const message = req.session.message;
    delete req.session.message;
    try {
        return res.render("auth/login", { // Login sayfasını kullanıcıya render eder
            title: "login", // View içine gönderilen başlık değişkeni
            message: message,
            csrfToken: req.csrfToken()
        });
    }
    catch (err) { // Sayfa render edilirken bir hata olursa console'a yazdırır
        console.log(err);
    }
}

exports.get_logout = function (req, res) {
    req.session.destroy(err => {
        if (err) {
            console.log("SESSION DESTROY ERROR:", err);
        }
        res.redirect("/account/login");
    });
};

exports.post_login = async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.render("auth/login", {
            title: "login",
            message: { text: "E-Mail Hatalı.", class: "danger" }
        });
    }
    //Parolo Kontrolü
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.render("auth/login", {
            title: "login",
            message: { text: "Parola Hatalı.", class: "danger" }
        });
    }
    req.session.isAuth = true;
    req.session.fullname = user.fullname;

    req.session.save(err => {
        if (err) console.log(err);
        res.redirect("/"); // SADECE BURADA
    });
};

exports.get_reset = async function (req, res) {
    const message = req.session.message;
    delete req.session.message;
    try {
        return res.render("auth/reset-password", { // Register (kayıt) sayfasını kullanıcıya render eder
            title: "reset password", // View içine gönderilen başlık değişkeni
            message: message
        });
    }
    catch (err) { // Sayfa render edilirken bir hata olursa console'a yazdırır
        console.log(err);
    }
}

exports.post_reset = async function (req, res) {
    const email = req.body.email;
    try {
        var token = ctypto.randomBytes(32).toString("hex");
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            req.session.message = { text: "Email Bulunamadı.", class: "danger" };
            return res.redirect("reset-password");
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + (1000 * 60 * 60);
        await user.save();

        emailService.sendMail({
            from: config.email.from,
            to: email.email,
            subject: "Reset Password",
            html: `
            <p>Parolanızı Güncellemek için Aşağıdaki Linke Tıklayınız.</p>
            <p>
             <a href="http://127.0.0.1:3000/account/new-password/${token}">Parola Sıfırla</a>>
            </p>
            `
        });

        req.session.message = { text: "Parolanızı Sıfırlamak için Epostanızı Kontrol Ediniz", class: "success" };
        res.redirect("login");
    }
    catch (err) { // Sayfa render edilirken bir hata olursa console'a yazdırır
        console.log(err);
    }
}

exports.get_newpassword = async function (req, res) {
    const token = req.params.token;

    try {
        const user = await User.findOne({
            where:{
                resetToken:token,
                resetTokenExpiration: {
                    [Op.gt] : Date.now()
                }
            }
        });
        return res.render("auth/new-password", { // Register (kayıt) sayfasını kullanıcıya render eder
            title: "new password", // View içine gönderilen başlık değişkeni
            token: token,
            userId:user.id
        });
    }
    catch (err) { // Sayfa render edilirken bir hata olursa console'a yazdırır
        console.log(err);
    }
}

exports.post_newpassword = async function (req, res) {
    const message = req.session.message;
    delete req.session.message;
    try {
        return res.render("auth/reset-password", { // Register (kayıt) sayfasını kullanıcıya render eder
            title: "reset password", // View içine gönderilen başlık değişkeni
            message: message
        });
    }
    catch (err) { // Sayfa render edilirken bir hata olursa console'a yazdırır
        console.log(err);
    }
}
