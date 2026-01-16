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
    const { name, email, password } = req.body;

    try {
        // 1️⃣ Email daha önce kayıtlı mı?
        const user = await User.findOne({ where: { email } });
        if (user) {
            req.session.message = {
                text: "Bu E-Mail adresi zaten kayıtlı.",
                class: "warning"
            };
            return res.redirect("/login");
        }

        // 2️⃣ Şifreyi hashle
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3️⃣ Kullanıcıyı oluştur
        const newUser = await User.create({
            fullname: name,
            email,
            password: hashedPassword
        });

        // 4️⃣ TEST MAİL GÖNDER (ETHEREAL)
        const info = await emailService.sendMail({
            from: '"Test App" <no-reply@test.com>',
            to: newUser.email,
            subject: "Hesabınız Oluşturuldu",
            html: `
                <h2>Merhaba ${newUser.fullname}</h2>
                <p>Hesabınız başarıyla oluşturuldu.</p>
                <p>Giriş yapmak için <a href="http://localhost:3000/login">tıklayın</a></p>
            `
        });

        // 5️⃣ Terminalde mail linki göster
        console.log("MAIL ÖNİZLEME LİNKİ:");
        console.log(nodemailer.getTestMessageUrl(info));

        // 6️⃣ Başarılı mesaj
        req.session.message = {
            text: "Hesabınız oluşturuldu. Giriş yapabilirsiniz.",
            class: "success"
        };

        return res.redirect("/login");
        console.log(nodemailer.getTestMessageUrl(info));


    } catch (err) {
        console.log(err);
        req.session.message = {
            text: "Bir hata oluştu.",
            class: "danger"
        };
        return res.redirect("/register");
    }
};

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
            message: { text: "E-Mail Hatalı.", class: "danger" },
            csrfToken: req.csrfToken()   // ✅ EKLENDİ
        });
    }

    // Parola Kontrolü
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.render("auth/login", {
            title: "login",
            message: { text: "Parola Hatalı.", class: "danger" },
            csrfToken: req.csrfToken()   // ✅ EKLENDİ
        });
    }

    req.session.isAuth = true;
    req.session.fullname = user.fullname;

    req.session.save(err => {
        if (err) console.log(err);
        res.redirect("/");
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
            where: {
                resetToken: token,
                resetTokenExpiration: {
                    [Op.gt]: Date.now()
                }
            }
        });
        return res.render("auth/new-password", { // Register (kayıt) sayfasını kullanıcıya render eder
            title: "new password", // View içine gönderilen başlık değişkeni
            token: token,
            userId: user.id
        });
    }
    catch (err) { // Sayfa render edilirken bir hata olursa console'a yazdırır
        console.log(err);
    }
}

exports.post_newpassword = async function (req, res) {
    const token = req.body.token;
    const userId = req.body.userId;
    const newPassword = req.body.password;


    try {
        const user = await User.findOne({
            where: {
                resetToken: token,
                resetTokenExpiration: {
                    [Op.gt]: Date.now()
                },
                id: userId
            }
        });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = null;
        user.resetTokenExpiration = null;
        await user.save();

        req.session.message = { text: "Parolanız Güncellendi", class: "success" }
        return res.redirect("login");
    }
    catch (err) {
        console.log(err);
    }
}
