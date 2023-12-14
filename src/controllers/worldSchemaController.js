const db = require('../config/knexConfig');
                    
async function getWorldSchema(req, res) {
    const { countryCode, provinceCode, districtCode, provinceName} = req.query;

    try {
      if (!countryCode) {
        return res.status(400).json({
          success: false,
          message: "Please provide a countryCode",
        });
      }
  
      let query = db
        .distinct()
        .select(
          "countryCode",
          "provinceCode",
          "provinceName",
          "provinceNativeName"
        )
        .from("worldschema");
  
      let query1 = db
        .distinct()
        .select(
          "countryCode",
          "provinceCode",
          "provinceName",
          "provinceNativeName",
          "districtCode",
          "districtName",
          "districtNativeName"
        )
        .from("worldschema");
  
      let query2 = db
        .distinct()
        .select(
          "countryCode",
          "provinceCode",
          "provinceName",
          "provinceNativeName",
          "districtCode",
          "districtName",
          "districtNativeName",
          "subdistrictCode",
          "subdistrictNativeName",
          "zipcode"
        )
        .from("worldschema");

        
  
      if (countryCode) {
        query = query.where("countryCode", countryCode);
      }
  
      if (countryCode && provinceCode && provinceName) {
        query1 = query1
          .where("countryCode", countryCode)
          .andWhere("provinceCode", provinceCode)
          .andWhere("provinceName","like", `%${provinceName}%`);

      } else if (provinceCode && !countryCode && provinceName) {
        return res.status(400).json({
          success: false,
          message: "Please enter countryCode.",
        });
      }
  
      if (countryCode && provinceCode && districtCode) {
        query2 = query2
          .where("countryCode", countryCode)
          .andWhere("provinceCode", provinceCode)
          .andWhere("districtCode", districtCode);
      } else if (districtCode && !countryCode && !provinceCode) {
        return res.status(400).json({
          success: false,
          message: "Please enter countryCode and provinceCode",
        });
      }
  
      if (countryCode && districtCode && !provinceCode) {
        return res.status(400).json({
          success: false,
          message: "Please enter provinceCode.",
        });
      }
  
      let results = [];
      let successMessage = "";
  
      if (countryCode && !provinceCode) {
        results = await query;
        successMessage = "County data based on countryCode";
      } else if (countryCode && provinceCode && !districtCode) {
        const resultsQuery = await query;
        const resultsQuery1 = await query1;
        if (resultsQuery.length === 0 && resultsQuery1.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Data not found for the provided parameters",
          });
        }
  
        results = resultsQuery1;
  
        successMessage = "Province data based on countryCode and provinceCode";
      } else if (countryCode && provinceCode && districtCode) {
        const resultsQuery = await query;
        const resultsQuery1 = await query1;
        const resultsQuery2 = await query2;
        if (
          resultsQuery.length === 0 &&
          resultsQuery1.length === 0 &&
          resultsQuery2.length === 0
        ) {
          return res.status(404).json({
            success: false,
            message: "Data not found for the provided parameters",
          });
        }
  
        results = resultsQuery2;
  
        successMessage =
          "District data based on countryCode, provinceCode, and districtCode";
      }

      if (countryCode, provinceCode, districtCode ) {
        query1 = query.where("countryCode", "like", `%${countryCode}%`);
        query2 = query.where("provinceCode", "like", `%${provinceCode}%`);
        query3 = query.where("districtCode", "like", `%${districtCode}%`);

      }
  
  
      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No provinces found for the provided countryCode",
        });
      }
  
      res.status(200).json({
        success: true,
        message: successMessage,
        results: results.length,
        data: results,
      });
    } catch (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Database error" });
    }

}

module.exports = { getWorldSchema };
