const express = require("express");
const router = express.Router();
const worldSchemaController = require("../controllers/worldSchemaController");

// Define routes related to world schema
// ...
router.get("/", worldSchemaController.getWorldSchema);

module.exports = router;
