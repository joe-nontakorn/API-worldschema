const db = require("../config/knexConfig");

async function getCountry(req, res) {
  const { name } = req.query;

  try {
    let query = db
      .select("code", "name", "nativeName", "timeZone", "flag")
      .from("country");
    if (name) {
      query = query.where(function () {
        this.where("name", "like", `%${name}%`)
          .orWhere("nativeName", "like", `%${name}%`)
          .orWhere("code", "like", `%${name}%`);
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
