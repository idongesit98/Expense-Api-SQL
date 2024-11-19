const mySql = require('mysql2/promise');
require('dotenv').config();

const dbConnect = async () => {
    try {
        const connection = await mySql.createPool({
            host:process.env.LOCAL_HOST,
            user:process.env.USER,
            password:process.env.PASSWORD,
            database:process.env.DATABASE,
            waitForConnections:true,
            connectionLimit:10,
            queueLimit:0
        });
        console.log("Connected to Database!!!!")
        return connection
    } catch (error) {
        console.log("Couldn't Connect to mySql database:", error);
        throw error;
    }
}

module.exports = dbConnect;