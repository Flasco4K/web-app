const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const User = sequelize.define("user",{ //Sequelize’e yeni bir model (tablo şeması) tanımlar
    fullname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    }
},{timestamps: true});

module.exports = User;