const db = require('../config/knexConfig');

async function getCountry(req, res) {
    const { countryCode } = req.query;

    try {
      let query = db
        .select("code", "name", "nativeName", "timeZone", "flag")
        .from("country");
        if (countryCode) {
          query = query.where(function () {
            this.where("code", "like", `%${countryCode}%`)
          });
        }
  
      const results = await query;
  
      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Data not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "OK",
        results: results.length,
        data: results,
      });
    } catch (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Database error" });
    }
}

module.exports = { getCountry };
