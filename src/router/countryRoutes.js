const express = require("express");
const router = express.Router();
const countryController = require("../controllers/countryController");

// Define routes related to countries
// ...
router.get("/", countryController.getCountry);

module.exports = router;
