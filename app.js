const express = require("express");
const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: "localhost",
    user: "root",
    password: "123456789",
    database: "mydatabase",
  },
});

const app = express();
const port = 4000;

app.get("/api/worldschema", async (req, res) => {
    const { countryCode, provinceCode, districtCode } = req.query;
  
    try {
        if (!countryCode) {
            return res.status(400).json({
              success: false,
              message: "Please provide a countryCode",
            });
          }
          
      let query = knex 
      .distinct() 
      .select('countryCode', 'provinceCode', 'provinceName', 'provinceNativeName')
      .from("worldschema");
  
      let query1 = knex 
      .distinct() 
      .select('countryCode', 'provinceCode', 'provinceName', 'provinceNativeName', 'districtCode', 'districtName', 'districtNativeName')
      .from("worldschema");
  
      let query2 = knex 
      .distinct() 
      .select('countryCode', 'provinceCode', 'provinceName', 'provinceNativeName', 'districtCode', 'districtName', 'districtNativeName', 'subdistrictCode', 'subdistrictNativeName', 'zipcode')
      .from("worldschema");

      
    
  
      if (countryCode) {
        query = query.where("countryCode", countryCode);
      }
  
      if (countryCode && provinceCode) {
          query1 = query1
            .where("countryCode", countryCode)
            .andWhere("provinceCode", provinceCode);
        } else if (provinceCode && !countryCode) {
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
    if (resultsQuery.length === 0 && resultsQuery1.length === 0 && resultsQuery2.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data not found for the provided parameters",
      });
    }
  
    results = resultsQuery2;
  
    successMessage = "District data based on countryCode, provinceCode, and districtCode";
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
  });

// get country
app.get("/api/country", async (req, res) => {
  const { name } = req.query;

  try {
    let query = knex
      .select("code", "name", "nativeName", "timeZone", "flag")
      .from("country");

      if (name) {
        query = query.where("name", "like", `%${name}%`);
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
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
