const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Blog = sequelize.define("blog", {
    blogid: {
        type: DataTypes.INTEGER, //sayı
        autoIncrement: true, //
        allowNull: false, //Boş Geçilmesin
        primaryKey: true
    },
    baslik: {
        type: DataTypes.STRING, //yazı
        allowNull: false //Boş Geçilmesin
    },
    altbaslik: {
        type: DataTypes.STRING, //yazi
        allowNull: false //Boş Geçilmesin
    },
    aciklama: {
        type: DataTypes.TEXT, //daha fazla değer
        allowNull: true //Boş Geçilsin
    },
    resim: {
        type: DataTypes.STRING, //yazi
        allowNull: false
    },
    anasayfa: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    onay: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    categoryid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    eklenmeTarihi: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW //Bilgisayarın Güncel Tarih ve Saat Bilgisini Otomatik Ekler
    }
});
module.exports = Blog;