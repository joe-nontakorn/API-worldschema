const db = require('../config/knexConfig');
                    
async function getWorldSchema(req, res) {
  const { countryCode, provinceName,districtName,search} = req.query;

  try {
      if (!countryCode) {
          return res.status(400).json({
            success: false,
            message: "Please provide a countryCode",
          });
        }

    let query = db 
    .distinct() 
    .select('countryCode', 'provinceCode', 'provinceName', 'provinceNativeName')
    .from("worldschema");

    let query1 = db 
    .distinct() 
    .select('countryCode', 'provinceCode', 'provinceName', 'provinceNativeName', 'districtCode', 'districtName', 'districtNativeName')
    .from("worldschema");

    let query2 = db 
    .distinct() 
    .select('countryCode', 'provinceCode', 'provinceName', 'provinceNativeName', 'districtCode', 'districtName', 'districtNativeName', 'subdistrictCode', 'subdistrictNativeName', 'zipcode')
    .from("worldschema");


if (countryCode) {
  // query = query.where("countryCode", countryCode);
  query = query.where("countryCode", countryCode);

  if(search){
    query = query.where(function () {
      this.where("provinceName", "like", `%${search}%`)
           .orWhere("provinceNativeName", "like", `%${search}%`)
           .orWhere("provinceCode", "like", `%${search}%`);
    });
  }
}


  if (countryCode && provinceName) {
    query1 = query1
      .where("countryCode", countryCode)
      .andWhere("provinceNativeName", provinceName);

      if(search){
        query1 = query1.where(function () {
          this.where("districtNativeName", "like", `%${search}%`)
               .orWhere("districtName", "like", `%${search}%`);
        });
      }
  } 
  else if (provinceName && !countryCode) {
    return res.status(400).json({
      success: false,
      message: "Please enter countryCode.",
    });
  }

  if (countryCode && provinceName && districtName) {
    query2 = query2
      .where("countryCode", countryCode)
      .andWhere("provinceNativeName", provinceName)
      .andWhere("districtNativeName", districtName);

      if(search){
        query2 = query2.where(function () {
          this.where("subdistrictNativeName", "like", `%${search}%`);
        });
      }
  } else if (districtName && !countryCode && !provinceName) {
    return res.status(400).json({
      success: false,
      message: "Please enter countryCode and provinceName",
    });
  }

  let results = [];
let successMessage = "";

if (countryCode && !provinceName) {
  results = await query;
  successMessage = "County data based on countryCode";
} else if (countryCode && provinceName && !districtName) {
  const resultsQuery = await query;
  const resultsQuery1 = await query1;
  if (resultsQuery.length === 0 && resultsQuery1.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Data not found for the provided parameters",
    });
  }

  results = resultsQuery1;

  successMessage = "Province data based on countryCode and provinceName";
} else if (countryCode && provinceName && districtName) {
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

  successMessage = "District data based on countryCode, provinceName, and districtName";
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
