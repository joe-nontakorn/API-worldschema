const knex = require('knex');
const logger = require('../utils/logger'); // เพิ่ม logger

const connectDB = async () => {
  try {
    const connection = knex({
      client: 'mysql',
      connection: {
        host: process.env.LOGIN_HOST,
        user: process.env.LOGIN_USER,
        password: process.env.LOGIN_PASSWORD,
        database: process.env.LOGIN_DATABASE,
        port: process.env.LOGIN_PORT // แก้ชื่อ environment variable จาก LOGIN_PORD เป็น LOGIN_PORT
      },
    });

    await connection.raw('SELECT 1'); // ทดสอบการเชื่อมต่อโดยส่ง query สั้น ๆ

    logger.info('Connected to login Database.'); // Logging using logger
    return connection;
  } catch (error) {
    logger.error('Database connection failed:', error); // Logging using logger
    console.error('Database connection failed:', error);
    throw error;
  }
};

module.exports = connectDB;
