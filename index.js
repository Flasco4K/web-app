//Express 
const express = require("express"); // Express framework’ünü projeye dahil eder
const app = express(); // Express uygulamasını başlatır

const cookieParser = require('cookie-parser'); // Cookie’leri okumak ve yönetmek için middleware
const session = require('express-session') // Kullanıcı oturumlarını (session) yönetmek için middleware
var SequelizeStore = require("connect-session-sequelize")(session.Store);


const csrf = require("csurf");
const csrfProtection = csrf();

app.use(csrfProtection);



//Node Modules
const path = require("path"); // Dosya ve klasör yollarını güvenli şekilde oluşturmak için Node.js path modülü

//Routes
const userRoutes = require("./routes/user"); // Kullanıcıya ait sayfa ve işlemler için route’lar
const adminRoutes = require("./routes/admin"); // Admin paneline ait route’lar
const authRoutes = require("./routes/auth"); // Giriş, kayıt, çıkış gibi kimlik doğrulama route’ları

//Custom Modules
const sequelize = require("./data/db"); // Sequelize veritabanı bağlantısı
const dummyData = require("./data/dummy-data"); // Test / örnek verileri içeren dosya
const locals = require("./middlewares/local")

//Template engine
app.set("view engine", "ejs"); // Express’te şablon motoru olarak EJS kullanılacağını belirtir

//Models
const Category = require("./models/category"); // Category (kategori) modeli
const Blog = require("./models/blog"); // Blog modeli
const User = require("./models/user"); //User Kullanıcı modeli

//Middleware
app.use(express.urlencoded({ extended: false })); // Formlardan (POST) gelen verileri req.body içine almak için kullanılır
app.use(cookieParser()); // Tarayıcıdan gelen cookie’leri okumak için middleware
app.use(session({ // Kullanıcı oturumlarını (session) yönetmek için kullanılır, cookie içine session ID ekler
  secret: "hello world",
  resave: false, //Session üzerinde bir değişiklik yapıldığında güncelleme olur
  saveUninitialized: false, // İçinde veri olmayan (boş) session’ların da kaydedilmesini engeller
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 //1 günlük cookie oluşturulur
  },
  store: new SequelizeStore({ //Sessionları Saklama
    db: sequelize
  })
}));

app.use(locals);

app.use("/libs", express.static(path.join(__dirname, "node_modules"))); // node_modules içindeki dosyaları /libs yoluyla statik olarak sunar
app.use("/static", express.static(path.join(__dirname, "public"))); // public klasöründeki statik dosyaları (/css, /js, /img) /static yoluyla sunar

app.use("/admin", adminRoutes); // /admin ile başlayan istekleri adminRoutes dosyasına yönlendirir
app.use("/account", authRoutes); // Kullanıcı giriş/çıkış (auth) işlemleri için route’lar
app.use(userRoutes); // Genel kullanıcı route’ları


//One to Many
Blog.belongsTo(User, { // Bir Blog’un tek bir User’a (kullanıcıya) ait olduğunu belirtir
  foreignKey: {
    allowNull: true // Blog kaydı kullanıcıya bağlı olmadan da oluşturulabilir
  }
});
User.hasMany(Blog) //User olan kullanıcının bütün bilgileri gelsin

Blog.belongsToMany(Category, { through: "blogCategories" }); //Blog Tablasosu Birden Fazla Categori Bilgisi Alır
Category.belongsToMany(Blog, { through: "blogCategories" }); //Categori Tablosu Birden Fazla Blog Bilgisi Alır 

//Veri Tabanı Güncelleme
(async () => {
  // await sequelize.sync({ force: true })
  // await dummyData();
})(); // Async fonksiyonu hemen çalıştırır

app.listen(3000, () => {
  console.log("listening on port 3000"); // Sunucuyu 3000 portunda başlatır.
});
