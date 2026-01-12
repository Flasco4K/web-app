const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Category = sequelize.define("blog", {
    categoryid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
         allowNull: false, //Boş Geçilmesin
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull:false

    }
});
module.exports = Category;