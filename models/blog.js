const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Blog = sequelize.define("blog", {
    baslik: {
        type: DataTypes.STRING, //yazı
        allowNull: false //Boş Geçilmesin
    },
     url: {
        type: DataTypes.STRING, //yazı
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
    }
},{
    timestamps: true
});
module.exports = Blog;