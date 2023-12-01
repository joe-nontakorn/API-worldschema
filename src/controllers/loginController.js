const { knex } = require('../config/loginDB');
const logger = require('../utils/logger'); // เพิ่มการ import logger

const login = async (req, res) => {
    try {
        const { countryCode, provinceNativeName } = req.body;

        const query = knex('worldschema')
            .select('*');

        if (countryCode) {
            query.where('countryCode', countryCode);
        }
    
        if (provinceNativeName) {
            query.andWhere('provinceNativeName', provinceNativeName);
        }

        const results = await query;
    
        res.json(results);
    } catch (error) {
        logger.error('Database error:', error); // ใช้ logger เพื่อ logging ข้อผิดพลาด
        console.error('Database error:', error);
        res.status(500).json({ success: false, errMessage: 'Database error' });
    }
};

module.exports = { login };
