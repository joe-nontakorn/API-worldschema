const mysql = require('mysql2');
const logger = require('../utils/logger');

const connectMysql = () => {
    const connection = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port:  process.env.MYSQL_PORD,

    });

    connection.connect((err) => {
        if (err) {
            logger.error('Error connecting to MySQL database:', err.message);
        } else {
            logger.info('Connected to Polarbird database');
        }
    });

    return connection;
};

module.exports = connectMysql;
