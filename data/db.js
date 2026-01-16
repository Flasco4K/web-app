//DATABASE BAĞLANMA MySQL 
const config = require("../config")

const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
    dialect: "mysql",
    host: config.db.host,
    define: {
        timestamps : false
    },
    storoge: "./session.mysql"
});
async function connect() {
    try {
        await sequelize.authenticate();
        console.log("mysql server bağlantisi yapildi");
    }
    catch (err) {
        console.log("bağlanti hatasi", err)
    }
}

connect();
module.exports = sequelize;
